import type { OutfitInput, PersonalColor, UserPreference } from "./types";

// 상수 정의
const MIN_LENGTH = 2;
const MAX_LENGTH = 50;

// 특수문자 및 이모지 정규식
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
const SPECIAL_CHAR_REGEX = /[<>{}[\]\\\/|`~]/g;

/**
 * 문자열 전처리 (최종 제출 시 사용)
 */
export function preprocessString(input: string | undefined): string | undefined {
  if (!input) return undefined;
  
  // 앞뒤 공백만 제거 (중간 공백은 유지)
  let processed = input.trim();
  
  // 특수 문자 제거
  processed = processed.replace(SPECIAL_CHAR_REGEX, "");
  
  // 이모지 제거
  processed = processed.replace(EMOJI_REGEX, "");
  
  return processed || undefined;
}

/**
 * 실시간 입력용 전처리 (trim 제외)
 */
export function preprocessStringRealtime(input: string | undefined): string | undefined {
  if (!input) return undefined;
  
  let processed = input;
  
  // 특수 문자 제거만 적용 (공백은 유지)
  processed = processed.replace(SPECIAL_CHAR_REGEX, "");
  
  // 이모지 제거
  processed = processed.replace(EMOJI_REGEX, "");
  
  return processed || undefined;
}

/**
 * 문자열 유효성 검증
 */
export function validateString(
  input: string | undefined,
  fieldName: string
): { valid: boolean; error?: string } {
  // 빈 문자열은 선택사항이므로 유효함
  if (!input || input.trim() === "") {
    return { valid: true };
  }

  const processed = preprocessString(input);
  
  if (!processed) {
    return {
      valid: false,
      error: `${fieldName}에 유효한 문자가 없습니다.`,
    };
  }

  // 최소 길이 체크
  if (processed.length < MIN_LENGTH) {
    return {
      valid: false,
      error: `${fieldName}은(는) 최소 ${MIN_LENGTH}자 이상이어야 합니다.`,
    };
  }

  // 최대 길이 체크
  if (processed.length > MAX_LENGTH) {
    return {
      valid: false,
      error: `${fieldName}은(는) 최대 ${MAX_LENGTH}자까지 입력 가능합니다.`,
    };
  }

  return { valid: true };
}

/**
 * 의상 입력 유효성 검증
 */
export function validateOutfitInput(outfitInput: OutfitInput): {
  valid: boolean;
  errors: string[];
  processed: OutfitInput;
} {
  const errors: string[] = [];
  const processed: OutfitInput = {};

  const partNames: Record<string, string> = {
    outer: "아우터",
    top_outer: "상의 탑",
    top_mid: "상의 미드",
    top_inner: "상의 이너",
    bottom: "하의",
    socks: "양말",
    shoes: "신발",
  };

  for (const [part, item] of Object.entries(outfitInput)) {
    if (!item) continue;

    const partName = partNames[part] || part;
    const processedItem: { type?: string; color?: string } = {};

    // 종류 검증
    if (item.type) {
      const typeValidation = validateString(item.type, `${partName} 종류`);
      if (!typeValidation.valid) {
        errors.push(typeValidation.error!);
      } else {
        processedItem.type = preprocessString(item.type);
      }
    }

    // 색상 검증
    if (item.color) {
      const colorValidation = validateString(item.color, `${partName} 색상`);
      if (!colorValidation.valid) {
        errors.push(colorValidation.error!);
      } else {
        processedItem.color = preprocessString(item.color);
      }
    }

    // 처리된 항목이 있으면 추가
    if (processedItem.type || processedItem.color) {
      processed[part as keyof OutfitInput] = processedItem;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    processed,
  };
}

/**
 * 퍼스널 컬러 유효성 검증
 */
export function validatePersonalColor(personalColor: PersonalColor): {
  valid: boolean;
  error?: string;
  processed: PersonalColor;
} {
  const validMainTypes = ["winter_cool", "summer_cool", "autumn_warm", "spring_warm"];

  if (!validMainTypes.includes(personalColor.main)) {
    return {
      valid: false,
      error: "유효하지 않은 퍼스널 컬러 타입입니다.",
      processed: personalColor,
    };
  }

  const processed: PersonalColor = {
    main: personalColor.main,
  };

  // 세부 타입 검증
  if (personalColor.detail) {
    const detailValidation = validateString(personalColor.detail, "퍼스널 컬러 세부 타입");
    if (!detailValidation.valid) {
      return {
        valid: false,
        error: detailValidation.error,
        processed,
      };
    }
    processed.detail = preprocessString(personalColor.detail);
  }

  return { valid: true, processed };
}

/**
 * 사용자 선호도 전체 유효성 검증
 */
export function validateUserPreference(userPreference: UserPreference): {
  valid: boolean;
  errors: string[];
  processed: UserPreference;
} {
  const errors: string[] = [];

  // 성별 검증
  const validGenders = ["male", "female"];
  if (!validGenders.includes(userPreference.gender)) {
    errors.push("유효하지 않은 성별입니다.");
  }

  // 퍼스널 컬러 검증
  const colorValidation = validatePersonalColor(userPreference.personalColor);
  if (!colorValidation.valid) {
    errors.push(colorValidation.error!);
  }

  return {
    valid: errors.length === 0,
    errors,
    processed: {
      gender: userPreference.gender,
      personalColor: colorValidation.processed,
    },
  };
}

/**
 * API 에러 메시지 생성
 */
export function getErrorMessage(statusCode: number, defaultMessage?: string): string {
  const errorMessages: Record<number, string> = {
    400: "입력하신 정보가 올바르지 않습니다. 다시 확인해주세요.",
    429: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요.",
    500: "AI 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
    503: "서비스를 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.",
  };

  return errorMessages[statusCode] || defaultMessage || "알 수 없는 오류가 발생했습니다.";
}
