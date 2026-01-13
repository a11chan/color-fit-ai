// 성별
export type Gender = "male" | "female";

// 퍼스널 컬러 메인 타입
export type PersonalColorMain =
  | "winter_cool"
  | "summer_cool"
  | "autumn_warm"
  | "spring_warm";

// 퍼스널 컬러 정보
export interface PersonalColor {
  main: PersonalColorMain;
  detail?: string; // 세부 타입 (예: "겨울 딥", "여름 뮤트")
}

// 의상 부위 타입
export type OutfitPart =
  | "outer"
  | "top_outer"
  | "top_mid"
  | "top_inner"
  | "bottom"
  | "socks"
  | "shoes";

// 의상 아이템
export interface OutfitItem {
  type?: string; // 의상 종류 (예: "데님 트러커 재킷")
  color?: string; // 색상 (예: "애쉬 다크 그레이")
}

// 부위별 의상 입력
export type OutfitInput = {
  [key in OutfitPart]?: OutfitItem;
};

// 사용자 선호도 정보
export interface UserPreference {
  gender: Gender;
  personalColor: PersonalColor;
}

// AI 추천 요청 페이로드
export interface AIRequestPayload {
  userPreference: UserPreference;
  outfitInput: OutfitInput;
}

// 플르부아 핸드크림 추천
export interface HandCreamRecommendation {
  brand: string; // "PLEUVOIR"
  productName: string;
  scentDescription: string;
}

// AI 추천 응답
export interface AIRecommendation {
  outfit: OutfitInput; // 완성된 전체 의상 조합
  handCream: HandCreamRecommendation;
  accessories: string[]; // 추가 액세서리 제안
  weatherInsight: string; // 날씨 고려 인사이트
  styleMessage: string; // 코디가 전달하는 메시지
}

// 부위별 한글 라벨
export const OUTFIT_PART_LABELS: Record<OutfitPart, string> = {
  outer: "아우터",
  top_outer: "상의 탑",
  top_mid: "상의 미드",
  top_inner: "상의 이너",
  bottom: "하의",
  socks: "양말",
  shoes: "신발",
};

// 퍼스널 컬러 한글 라벨
export const PERSONAL_COLOR_LABELS: Record<PersonalColorMain, string> = {
  winter_cool: "겨울 쿨톤",
  summer_cool: "여름 쿨톤",
  autumn_warm: "가을 웜톤",
  spring_warm: "봄 웜톤",
};

// 성별 한글 라벨
export const GENDER_LABELS: Record<Gender, string> = {
  male: "남성",
  female: "여성",
};
