"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Loader2, User, AlertCircle } from "lucide-react";
import type {
  Gender,
  PersonalColorMain,
  OutfitInput,
  AIRecommendation,
  OutfitPart,
} from "@/lib/types";
import {
  GENDER_LABELS,
  PERSONAL_COLOR_LABELS,
  OUTFIT_PART_LABELS,
} from "@/lib/types";
import { preprocessString, preprocessStringRealtime, validateString } from "@/lib/validation";

export default function Home() {
  // 사용자 입력 상태
  const [gender, setGender] = useState<Gender>("male");
  const [personalColorMain, setPersonalColorMain] = useState<PersonalColorMain>("winter_cool");
  const [personalColorDetail, setPersonalColorDetail] = useState("");
  const [outfitInput, setOutfitInput] = useState<OutfitInput>({});
  
  // AI 추천 결과 및 로딩 상태
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // 의상 입력 업데이트 (실시간 전처리 - trim 제외)
  const updateOutfitInput = (part: OutfitPart, field: "type" | "color", value: string) => {
    // 실시간 전처리 (공백은 유지)
    const realtimeProcessed = preprocessStringRealtime(value);
    
    // 유효성 검증을 위한 최종 전처리 (trim 포함)
    const finalProcessed = preprocessString(realtimeProcessed);
    
    // 유효성 검증
    const fieldName = `${OUTFIT_PART_LABELS[part]} ${field === "type" ? "종류" : "색상"}`;
    const validation = validateString(finalProcessed, fieldName);
    
    // 에러 상태 업데이트
    const errorKey = `${part}-${field}`;
    if (!validation.valid && finalProcessed) {
      setValidationErrors((prev) => ({
        ...prev,
        [errorKey]: validation.error!,
      }));
    } else {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }

    // 입력 업데이트 (실시간 전처리된 값 사용 - 공백 유지)
    setOutfitInput((prev) => ({
      ...prev,
      [part]: {
        ...prev[part],
        [field]: realtimeProcessed || undefined,
      },
    }));
  };

  // 퍼스널 컬러 세부 타입 업데이트
  const updatePersonalColorDetail = (value: string) => {
    // 실시간 전처리 (공백은 유지)
    const realtimeProcessed = preprocessStringRealtime(value);
    
    // 유효성 검증을 위한 최종 전처리 (trim 포함)
    const finalProcessed = preprocessString(realtimeProcessed);
    const validation = validateString(finalProcessed, "퍼스널 컬러 세부 타입");
    
    if (!validation.valid && finalProcessed) {
      setValidationErrors((prev) => ({
        ...prev,
        "color-detail": validation.error!,
      }));
    } else {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors["color-detail"];
        return newErrors;
      });
    }
    
    // 실시간 전처리된 값 사용 (공백 유지)
    setPersonalColorDetail(realtimeProcessed || "");
  };

  // AI 추천 요청
  const handleRecommend = async () => {
    // 유효성 검증 에러가 있으면 요청 중단
    if (Object.keys(validationErrors).length > 0) {
      setError("입력 정보를 확인해주세요. 일부 항목에 오류가 있습니다.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPreference: {
            gender,
            personalColor: {
              main: personalColorMain,
              detail: personalColorDetail || undefined,
            },
          },
          outfitInput,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // 상세 에러 메시지 처리
        let errorMessage = errorData.error || "추천 요청에 실패했습니다.";
        if (errorData.details) {
          if (Array.isArray(errorData.details)) {
            errorMessage += "\n\n" + errorData.details.join("\n");
          } else {
            errorMessage += "\n\n" + errorData.details;
          }
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setRecommendation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const outfitParts: OutfitPart[] = [
    "outer",
    "top_outer",
    "top_mid",
    "top_inner",
    "bottom",
    "socks",
    "shoes",
  ];

  // 부위별 placeholder
  const outfitPlaceholders: Record<OutfitPart, { type: string; color: string }> = {
    outer: { type: "예: 데님 재킷", color: "예: 네이비" },
    top_outer: { type: "예: 후드 집업", color: "예: 크림" },
    top_mid: { type: "예: 베이직 플리스", color: "예: 차콜" },
    top_inner: { type: "예: 피케 폴로 셔츠", color: "예: 화이트" },
    bottom: { type: "예: 스웨트 팬츠", color: "예: 크림" },
    socks: { type: "예: 하프 삭스", color: "예: 크림" },
    shoes: { type: "예: 스웨이드 스니커즈", color: "예: 네이비" },
  };

  return (
    <div className="min-h-screen bg-background pb-safe">
      <div className="container mx-auto px-4 pt-8 pb-24 md:pb-12 max-w-6xl">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary">
            ✨ ColorFit AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            퍼스널 컬러와 원하는 의상 정보를 입력하면, AI가 코디와 어울리는 플르부아 핸드크림 향을 추천해드립니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 입력 폼 */}
          <div className="space-y-6">
            {/* 성별 선택 */}
            <Card>
              <CardHeader>
                <CardTitle>성별 (필수)</CardTitle>
                <CardDescription>성별을 선택해주세요</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={gender} onValueChange={(value) => setGender(value as Gender)}>
                  {(Object.keys(GENDER_LABELS) as Gender[]).map((g) => (
                    <div key={g} className="flex items-center space-x-2">
                      <RadioGroupItem value={g} id={`gender-${g}`} />
                      <Label htmlFor={`gender-${g}`} className="cursor-pointer">
                        {GENDER_LABELS[g]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* 퍼스널 컬러 선택 */}
            <Card>
              <CardHeader>
                <CardTitle>퍼스널 컬러 (필수)</CardTitle>
                <CardDescription>메인 타입을 선택하고, 세부 타입은 선택사항입니다</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>메인 타입</Label>
                  <RadioGroup
                    value={personalColorMain}
                    onValueChange={(value) => setPersonalColorMain(value as PersonalColorMain)}
                  >
                    {(Object.keys(PERSONAL_COLOR_LABELS) as PersonalColorMain[]).map((color) => (
                      <div key={color} className="flex items-center space-x-2">
                        <RadioGroupItem value={color} id={`color-${color}`} />
                        <Label htmlFor={`color-${color}`} className="cursor-pointer">
                          {PERSONAL_COLOR_LABELS[color]}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color-detail">세부 타입 (선택)</Label>
                  <Input
                    id="color-detail"
                    placeholder="예: 겨울 딥, 여름 뮤트"
                    value={personalColorDetail}
                    onChange={(e) => updatePersonalColorDetail(e.target.value)}
                    className={validationErrors["color-detail"] ? "border-destructive" : ""}
                  />
                  {validationErrors["color-detail"] && (
                    <div className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      <span>{validationErrors["color-detail"]}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 부위별 의상 입력 */}
            <Card>
              <CardHeader>
                <CardTitle>부위별 의상 입력 (선택)</CardTitle>
                <CardDescription>
                  입력하지 않은 부위는 AI가 자동으로 추천합니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {outfitParts.map((part) => (
                  <div key={part} className="space-y-2 p-4 border rounded-lg">
                    <h4 className="font-semibold text-sm">{OUTFIT_PART_LABELS[part]}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor={`${part}-type`} className="text-xs">
                          종류
                        </Label>
                        <Input
                          id={`${part}-type`}
                          placeholder={outfitPlaceholders[part].type}
                          value={outfitInput[part]?.type || ""}
                          onChange={(e) => updateOutfitInput(part, "type", e.target.value)}
                          className={validationErrors[`${part}-type`] ? "border-destructive" : ""}
                        />
                        {validationErrors[`${part}-type`] && (
                          <div className="flex items-center gap-1 text-xs text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            <span>{validationErrors[`${part}-type`]}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`${part}-color`} className="text-xs">
                          색상
                        </Label>
                        <Input
                          id={`${part}-color`}
                          placeholder={outfitPlaceholders[part].color}
                          value={outfitInput[part]?.color || ""}
                          onChange={(e) => updateOutfitInput(part, "color", e.target.value)}
                          className={validationErrors[`${part}-color`] ? "border-destructive" : ""}
                        />
                        {validationErrors[`${part}-color`] && (
                          <div className="flex items-center gap-1 text-xs text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            <span>{validationErrors[`${part}-color`]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 추천 버튼 */}
            <Button
              onClick={handleRecommend}
              disabled={isLoading}
              className="w-full h-12 text-lg"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  AI가 분석 중입니다...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  AI 코디 추천 받기
                </>
              )}
            </Button>
          </div>

          {/* 오른쪽: 추천 결과 */}
          <div>
            {error && (
              <Card className="border-destructive bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-destructive flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    오류 발생
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-destructive whitespace-pre-line">{error}</p>
                </CardContent>
              </Card>
            )}

            {isLoading && (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center">
                  <Loader2 className="h-16 w-16 mx-auto mb-4 text-primary animate-spin" />
                  <p className="text-lg font-semibold text-primary">AI가 코디를 분석하고 있습니다...</p>
                  <p className="text-sm text-muted-foreground mt-2">잠시만 기다려주세요</p>
                </CardContent>
              </Card>
            )}

            {recommendation && !isLoading && (
              <div className="space-y-6 pb-8">
                {/* 스타일링 메시지 */}
                <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-primary/50 shadow-lg">
                  <CardContent className="flex flex-col items-center justify-center gap-3 px-6 py-6">
                    <div className="flex items-center justify-center gap-2 text-primary font-semibold text-lg">
                      <Sparkles className="h-5 w-5" />
                      스타일링 메시지
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <p className="text-base leading-relaxed text-center text-foreground/90 max-w-2xl whitespace-pre-line">
                      {recommendation.styleMessage}
                    </p>
                  </CardContent>
                </Card>

                {/* 추천 의상 */}
                <Card>
                  <CardHeader>
                    <CardTitle>👔 추천 의상</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2 flex-wrap">
                      <span className="flex items-center gap-1 text-xs">
                        <div className="w-3 h-3 rounded-sm bg-blue-100 dark:bg-blue-900 border-2 border-blue-500" />
                        완전 입력
                      </span>
                      <span className="flex items-center gap-1 text-xs">
                        <div className="w-3 h-3 rounded-sm bg-purple-100 dark:bg-purple-900 border-2 border-purple-500" />
                        부분 입력
                      </span>
                      <span className="flex items-center gap-1 text-xs">
                        <div className="w-3 h-3 rounded-sm bg-primary/20 border-2 border-primary" />
                        AI 추천
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {outfitParts.map((part) => {
                      const item = recommendation.outfit[part];
                      if (!item) return null;
                      
                      // 사용자가 입력한 종류와 색상 확인
                      const userInputType = outfitInput[part]?.type;
                      const userInputColor = outfitInput[part]?.color;
                      
                      // 3가지 케이스 구분
                      const isFullUserInput = userInputType && userInputColor; // 완전 사용자 입력
                      const isPartialUserInput = (userInputType && !userInputColor) || (!userInputType && userInputColor); // 부분 입력
                      const isFullAI = !userInputType && !userInputColor; // 완전 AI 추천
                      
                      // 카드 스타일 결정
                      let cardStyle = "";
                      if (isFullUserInput) {
                        cardStyle = "bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-blue-500 shadow-sm";
                      } else if (isPartialUserInput) {
                        cardStyle = "bg-purple-50 dark:bg-purple-950/20 border-l-4 border-l-purple-500";
                      } else {
                        cardStyle = "bg-primary/5 border-l-4 border-l-primary";
                      }
                      
                      return (
                        <div 
                          key={part} 
                          className={`p-3 rounded ${cardStyle}`}
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{OUTFIT_PART_LABELS[part]}</span>
                            </div>
                            <div className="text-sm text-right space-y-1">
                              <div className="flex items-center justify-end gap-1.5">
                                <span className="text-muted-foreground">종류:</span>
                                <span className="font-medium">{item.type}</span>
                                {userInputType ? (
                                  <User className="h-3 w-3 text-blue-500 flex-shrink-0" />
                                ) : (
                                  <Sparkles className="h-3 w-3 text-primary flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center justify-end gap-1.5">
                                <span className="text-muted-foreground">색상:</span>
                                <span className="font-semibold text-primary">{item.color}</span>
                                {userInputColor ? (
                                  <User className="h-3 w-3 text-blue-500 flex-shrink-0" />
                                ) : (
                                  <Sparkles className="h-3 w-3 text-primary flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* 핸드크림 추천 */}
                <Card>
                  <CardHeader>
                    <CardTitle>🌸 추천 향 (핸드크림)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-semibold">
                      {recommendation.handCream.brand} - {recommendation.handCream.productName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {recommendation.handCream.scentDescription}
                    </p>
                  </CardContent>
                </Card>

                {/* 액세서리 */}
                <Card>
                  <CardHeader>
                    <CardTitle>💎 추천 액세서리</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {recommendation.accessories.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* 날씨 인사이트 */}
                <Card>
                  <CardHeader>
                    <CardTitle>🌤️ 스타일 인사이트</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{recommendation.weatherInsight}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {!recommendation && !error && !isLoading && (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center">
                  <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    정보를 입력하고 AI 코디 추천을 받아보세요!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
