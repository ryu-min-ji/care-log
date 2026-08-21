# Care Log

보육교사가 남긴 메모 한 줄을 표준보육과정 5개 영역 기준 관찰일지와 학부모용 알림장으로
동시에 완성해주는 AI 기록 도구입니다.

## 핵심 기능

- 반·원아 등록 (로그인 없이 바로 시작)
- 메모 입력 → AI 관찰일지 초안 생성
- 표준보육과정 5개 영역 자동 태깅
- 같은 메모를 학부모용 알림장 문장으로 원클릭 변환
- 저장 전 검수·수정, 텍스트 파일로 내보내기
- 원아별 영역 커버리지 대시보드

## 시작하기

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

### AI 연동 (선택)

기본적으로는 키 없이 mock 응답으로 동작합니다. 실제 AI 생성을 쓰려면
[console.groq.com](https://console.groq.com/keys) 에서 무료로 키를 발급받아
`.env.local`에 추가하세요.

```bash
cp .env.example .env.local
# GROQ_API_KEY=여기에_발급받은_키
```

## 데이터 저장

현재 버전은 브라우저 `localStorage`에 데이터를 저장합니다(별도 백엔드/로그인 없음).
브라우저 저장소를 지우면 기록이 사라집니다.

## 기술 스택

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Zustand (localStorage persist)
- Groq API (Llama 3.3 70B) — 키 미설정 시 mock 생성기로 자동 대체

## 관련 문서

기획·디자인·비즈니스 배경은 `docs/` 폴더의 4개 문서를 참고하세요:
제품기획서, 디자인가이드, 프로토타입&유저플로우, 사업계획서.
