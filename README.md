# ✨ ColorFit AI - AI 코디 추천 서비스

> 퍼스널 컬러를 기반으로 AI가 추천하는 맞춤형 코디, 향기, 액세서리

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8)](https://tailwindcss.com/)

## 📖 프로젝트 소개

**ColorFit AI**는 사용자의 퍼스널 컬러와 의상 정보를 기반으로 AI가 완벽한 코디, 향기(플르부아 핸드크림), 액세서리를 추천하는 혁신적인 스타일링 서비스입니다.

### 🎯 주요 목표
- 퍼스널 컬러 기반의 신뢰도 높은 코디 추천
- 최소 입력으로 완성도 높은 스타일 제안
- 코디 + 향 + 메시지까지 연결되는 감성 경험 제공

---

## ✨ 주요 기능

### 1️⃣ **퍼스널 컬러 기반 추천**
- 4가지 메인 타입 지원 (겨울 쿨톤, 여름 쿨톤, 가을 웜톤, 봄 웜톤)
- 세부 타입 커스터마이징 (예: 겨울 딥, 여름 뮤트)

### 2️⃣ **부위별 의상 입력**
- 7개 부위 지원: 아우터, 상의(탑/미드/이너), 하의, 양말, 신발
- 부분 입력만으로도 AI가 전체 코디 완성
- 사용자 입력과 AI 추천을 시각적으로 구분

### 3️⃣ **플르부아(PLEUVOIR) 핸드크림 추천**
- 5가지 시그니처 향 라인업
  - HINOKI LEATHER - 히노끼와 가죽의 관능
  - ROSE WOOD - 싱그러운 로즈와 스모키 우디
  - MORNING SOIL - 비 온 뒤의 자연
  - FLORAL MUSK - 은은한 꽃향기와 크리미한 머스크
  - TOKYO CLOUD - 청량하고 투명한 향
- 코디에 어울리는 향 자동 매칭

### 4️⃣ **스타일링 메시지**
- 의상과 향기가 어우러진 시각적, 후각적 이미지 표현
- 3문장 이내의 감각적인 총평
- 코디가 전달하는 느낌과 감성 서술

### 5️⃣ **입력 검증 및 최적화**
- 실시간 입력 검증 (최소/최대 길이, 특수문자 필터링)
- 자동 전처리 (공백 정리, 이모지 제거)
- 사용자 친화적 에러 메시지

---

## 🛠️ 기술 스택

### **Frontend**
- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Shadcn/ui (Radix UI 기반)
- **Icons**: Lucide React

### **AI/Backend**
- **AI SDK**: Vercel AI SDK
- **LLM**: Google Gemini 2.5 Flash
- **Validation**: Zod 4.3.5

### **Development**
- **Package Manager**: npm
- **Linting**: ESLint 9
- **Type Checking**: TypeScript

---

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.x 이상
- npm 또는 yarn

### 1. 저장소 클론
```bash
git clone https://github.com/yourusername/outfit-of-the-day.git
cd outfit-of-the-day
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_gemini_api_key_here
```

> **Google Gemini API 키 발급 방법**
> 1. [Google AI Studio](https://makersuite.google.com/app/apikey) 접속
> 2. "Get API Key" 클릭
> 3. 생성된 API 키를 복사하여 `.env.local`에 추가

### 4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요!

### 5. 프로덕션 빌드
```bash
npm run build
npm start
```

---

## 📁 프로젝트 구조

```
outfit-of-the-day/
├── app/
│   ├── api/
│   │   └── recommend/
│   │       └── route.ts          # AI 추천 API 엔드포인트
│   ├── layout.tsx                # 루트 레이아웃 (메타데이터)
│   ├── page.tsx                  # 메인 페이지 (코디 추천 UI)
│   └── globals.css               # 전역 스타일 (브랜드 컬러)
├── components/
│   └── ui/                       # Shadcn UI 컴포넌트
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       └── radio-group.tsx
├── lib/
│   ├── types.ts                  # TypeScript 타입 정의
│   ├── validation.ts             # 입력 검증 유틸리티
│   └── utils.ts                  # 공통 유틸리티
├── docs/
│   └── PRD.md                    # 제품 요구사항 정의서
└── public/                       # 정적 파일
```

---

## 🎨 브랜드 컬러

### Primary Color (모브 퍼플)
- Light: `#8B7BA8`
- OKLCH: `oklch(0.595 0.075 302)`

### Secondary Color (베이지 크림)
- Light: `#E8DED2`
- OKLCH: `oklch(0.90 0.02 70)`

### Accent Color (골드 베이지)
- Light: `#C4A57B`
- OKLCH: `oklch(0.74 0.06 70)`

---

## 🔒 환경 변수

| 변수명 | 설명 | 필수 여부 |
|--------|------|-----------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini API 키 | ✅ 필수 |

---

## 📱 주요 화면

### 메인 페이지
- 성별 선택
- 퍼스널 컬러 입력 (메인 타입 + 세부 타입)
- 부위별 의상 입력 (7개 부위)
- AI 추천 결과 표시

### 추천 결과
- 스타일링 메시지 (총평)
- 추천 의상 (사용자 입력/AI 추천 구분)
- 플르부아 핸드크림 추천
- 액세서리 제안
- 스타일 인사이트

---

## 🧪 개발 가이드

### 코드 스타일
- TypeScript strict 모드 사용
- ESLint 규칙 준수
- Tailwind CSS 유틸리티 클래스 사용

### 커밋 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 업무, 패키지 매니저 설정 등
```

---

## 🐛 알려진 이슈

현재 알려진 이슈 없음

---

## 🗺️ 로드맵

### v1.0.0 (현재)
- ✅ 기본 코디 추천 기능
- ✅ 퍼스널 컬러 기반 추천
- ✅ 플르부아 핸드크림 추천
- ✅ 입력 검증 및 에러 처리

### v1.1.0 (계획 중)
- [ ] 사용자 계정 시스템
- [ ] 코디 히스토리 저장
- [ ] 좋아요/북마크 기능

### v2.0.0 (장기 계획)
- [ ] 날씨 API 자동 연동
- [ ] 이미지 기반 코디 분석
- [ ] 쇼핑몰 연계 추천

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

---

## 👥 기여하기

기여를 환영합니다! 다음 단계를 따라주세요:

1. 저장소를 Fork합니다
2. 새 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'feat: Add amazing feature'`)
4. 브랜치에 Push합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

---

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.

---

<div align="center">

**Made with ❤️ by ColorFit AI Team**

⭐ 이 프로젝트가 마음에 드셨다면 Star를 눌러주세요!

</div>
