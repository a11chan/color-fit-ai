import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import type { AIRequestPayload } from "@/lib/types";
import {
  validateUserPreference,
  validateOutfitInput,
  getErrorMessage,
} from "@/lib/validation";

// AI 응답 스키마
const recommendationSchema = z.object({
  outfit: z.object({
    outer: z
      .object({
        type: z.string().describe("아우터 종류"),
        color: z.string().describe("아우터 색상"),
      })
      .optional(),
    top_outer: z
      .object({
        type: z.string().describe("상의 탑 종류"),
        color: z.string().describe("상의 탑 색상"),
      })
      .optional(),
    top_mid: z
      .object({
        type: z.string().describe("상의 미드 종류"),
        color: z.string().describe("상의 미드 색상"),
      })
      .optional(),
    top_inner: z
      .object({
        type: z.string().describe("상의 이너 종류"),
        color: z.string().describe("상의 이너 색상"),
      })
      .optional(),
    bottom: z
      .object({
        type: z.string().describe("하의 종류"),
        color: z.string().describe("하의 색상"),
      })
      .optional(),
    socks: z
      .object({
        type: z.string().describe("양말 종류"),
        color: z.string().describe("양말 색상"),
      })
      .optional(),
    shoes: z
      .object({
        type: z.string().describe("신발 종류"),
        color: z.string().describe("신발 색상"),
      })
      .optional(),
  }),
  handCream: z.object({
    brand: z.string().describe("브랜드 이름 (PLEUVOIR)"),
    productName: z.string().describe("제품명 (예: 0001, 0002)"),
    scentDescription: z.string().describe("향 설명"),
  }),
  accessories: z.array(z.string()).describe("추천 액세서리 목록"),
  weatherInsight: z.string().describe("날씨를 고려한 스타일 인사이트"),
  styleMessage: z.string().describe("이 코디가 전달하는 메시지"),
});

export async function POST(req: NextRequest) {
  try {
    // 요청 본문 파싱
    let body: AIRequestPayload;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        {
          error: "잘못된 요청 형식입니다.",
          details: "JSON 형식이 올바르지 않습니다.",
        },
        { status: 400 }
      );
    }

    const { userPreference, outfitInput } = body;

    // API 키 확인
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: getErrorMessage(500) },
        { status: 500 }
      );
    }

    // 사용자 선호도 유효성 검증
    const userValidation = validateUserPreference(userPreference);
    if (!userValidation.valid) {
      return NextResponse.json(
        {
          error: "입력 정보를 확인해주세요.",
          details: userValidation.errors,
        },
        { status: 400 }
      );
    }

    // 의상 입력 유효성 검증
    const outfitValidation = validateOutfitInput(outfitInput);
    if (!outfitValidation.valid) {
      return NextResponse.json(
        {
          error: "의상 입력 정보를 확인해주세요.",
          details: outfitValidation.errors,
        },
        { status: 400 }
      );
    }

    // 검증 및 전처리된 데이터 사용
    const validatedUserPreference = userValidation.processed;
    const validatedOutfitInput = outfitValidation.processed;

    // 퍼스널 컬러 한글 변환
    const colorMap: Record<string, string> = {
      winter_cool: "겨울 쿨톤",
      summer_cool: "여름 쿨톤",
      autumn_warm: "가을 웜톤",
      spring_warm: "봄 웜톤",
    };

    const genderText = validatedUserPreference.gender === "male" ? "남성" : "여성";
    const colorText = colorMap[validatedUserPreference.personalColor.main] || "";
    const detailText = validatedUserPreference.personalColor.detail
      ? ` (세부: ${validatedUserPreference.personalColor.detail})`
      : "";

    // 입력된 의상 정보 포맷팅
    const inputOutfitText = Object.entries(validatedOutfitInput)
      .filter(([_, item]) => item && (item.type || item.color))
      .map(([part, item]) => {
        const partMap: Record<string, string> = {
          outer: "아우터",
          top_outer: "상의 탑",
          top_mid: "상의 미드",
          top_inner: "상의 이너",
          bottom: "하의",
          socks: "양말",
          shoes: "신발",
        };
        return `${partMap[part]}: ${item?.type || "미정"} / ${item?.color || "미정"}`;
      })
      .join("\n");

    // 프롬프트 생성
    const prompt = `당신은 퍼스널 컬러 전문가이자 패션 스타일리스트입니다.

사용자 정보:
- 성별: ${genderText}
- 퍼스널 컬러: ${colorText}${detailText}

사용자가 입력한 의상:
${inputOutfitText || "없음 (전체 추천 필요)"}

PLEUVOIR(플르부아) 핸드크림 제품 라인업:

1. HINOKI LEATHER
- 특징: 히노끼와 가죽의 관능, 유니크한 우디
- 노트: Top(Warm spicy, Hinoki Pine, Cypress), Middle(Atlas cedar, Leather, Styrax), Base(Tobacco, Gaiac wood, Musk, Sandalwood, Amber)
- 무드: 햇빛과 바람이 좋은 히노끼 숲에 둘러 싸인 듯, 신비롭고 따뜻하며 매혹적인 느낌. 편백나무 숲속 온천의 편안함과 가죽의 강렬함

2. ROSE WOOD
- 특징: 싱그러운 생화로즈향과 스모키한 우디 향
- 노트: Top(Bergamot, Pink Rose), Middle(Fresh spicy, Vetiver), Base(Gaiac wood, Musk, Sandalwood, Olibanum)
- 무드: 햇빛이 좋은 오후, 장미가 피어난 정원을 거닐며 느껴지는 숲의 향기. 부드러운 로즈향과 스모키한 우디향의 조화

3. MORNING SOIL
- 특징: 비 온 뒤의 자연의 향
- 노트: Top(Ozonic, Rosemary), Middle(Fresh spicy, Patchouli, Aromatic Muguet, Jasmine), Base(Amber, Musk)
- 무드: 가뭄 후에 내린 소나기로 상쾌해진 땅의 공기. 비와 대지의 조화 속에 피어오르는 편안함

4. FLORAL MUSK
- 특징: 부담스럽지 않은 은은한 꽃향기와 크리미한 머스크
- 노트: Top(African orange flower, Iris, Rose, Jasmine), Middle(Tuberose, Orris, Peony, Amber), Base(Musk, Benzoin)
- 무드: 따스한 햇살 속 들판에 피어난 야생화와 강인한 머스크. 순백의 중성적 무드

5. TOKYO CLOUD
- 특징: 청량한 도쿄의 하늘 구름처럼 가볍고 투명한 향
- 노트: Top(Bergamot, Pine Needles), Middle(Rose, Neroli), Base(Sandalwood, Patchouli, Cedarwood, Moss, Amber, White Musk)
- 무드: 투명한 시트러스와 은은한 머스크. 청량하고 여유로운 향

요청사항:
1. 사용자의 퍼스널 컬러에 맞는 색상으로 전체 의상을 완성해주세요.
2. 입력되지 않은 부위는 자동으로 추천해주세요.
3. 입력된 부위가 있다면 그것을 기반으로 전체 조화를 맞춰주세요.
4. 위 5가지 PLEUVOIR 핸드크림 제품 중 이 코디와 가장 어울리는 향을 1개 추천해주세요. 제품명과 향의 특징을 자세히 설명해주세요.
5. 추가 액세서리 3-5개를 제안해주세요 (예: 시계, 가방, 모자, 선글라스, 스카프 등).
6. 오늘의 날씨를 고려한 스타일 조언을 해주세요 (현재 계절: ${new Date().getMonth() + 1}월).
7. **스타일링 메시지**: 추천한 의상과 향기가 함께 어우러졌을 때 형성되는 시각적, 후각적 이미지를 감각적으로 표현해주세요.
   - 의상의 색감과 실루엣이 주는 시각적 인상
   - 핸드크림 향이 더해졌을 때 완성되는 분위기
   - 이 조합이 전달하는 전체적인 느낌과 감성
   - 반드시 3문장 이내로 작성해주세요.

중요:
- 모든 색상은 퍼스널 컬러에 적합해야 합니다.
- 의상 종류와 색상은 구체적으로 명시해주세요.
- 핸드크림은 반드시 위 5가지 제품 중에서 선택해주세요.
- 스타일링 메시지는 구체적이고 감각적으로 작성하되, 3문장을 초과하지 마세요.
- 전문적이고 실용적인 조언을 제공해주세요.`;

    // Gemini API 호출
    const result = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: recommendationSchema,
      prompt: prompt,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error("AI 추천 에러:", error);

    // 에러 타입에 따른 상태 코드 결정
    let statusCode = 500;
    let errorMessage = getErrorMessage(500);

    if (error instanceof Error) {
      // API 호출 한도 초과 에러
      if (error.message.includes("quota") || error.message.includes("rate limit")) {
        statusCode = 429;
        errorMessage = getErrorMessage(429);
      }
      // 서비스 이용 불가 에러
      else if (error.message.includes("unavailable") || error.message.includes("timeout")) {
        statusCode = 503;
        errorMessage = getErrorMessage(503);
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === "development" && error instanceof Error 
          ? error.message 
          : undefined,
      },
      { status: statusCode }
    );
  }
}
