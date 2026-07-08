# 모임 정산

정기 모임 주최자의 공지·참여자 관리(RSVP)·정산을 하나의 링크로 대체하는 웹 서비스.

## 핵심 기능

- 이벤트 생성 → slug 공유 링크 자동 발급
- 비회원 RSVP (로그인 없이 이름 입력 → 참여/불참)
- 주최자 실시간 참여 명단·정원 초과 경고
- 총비용 입력 → 확정 인원 1/N 자동 계산, 입금 체크
- 지난 이벤트 복제
- 관리자 콘솔 (전체 이벤트/회원 현황, 통계)

## 기술 스택

- Next.js 15 (App Router) + TypeScript
- Supabase (Auth, Postgres, RLS)
- shadcn/ui (new-york) + Tailwind CSS
- Recharts (관리자 통계 차트)

## 로컬 실행

1. Supabase 프로젝트 생성 후 `.env.example`을 `.env.local`로 복사하고 값 채우기

   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
   ```

2. 의존성 설치 및 개발 서버 실행

   ```bash
   npm install
   npm run dev
   ```

   [localhost:3000](http://localhost:3000)에서 확인.

## 주요 명령어

```bash
npm run dev          # 개발 서버
npm run build         # 프로덕션 빌드
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
npm run format        # Prettier 포맷팅 적용
npm run check-all     # typecheck && lint && format:check
```

DB 마이그레이션은 `supabase/migrations/`에서 관리한다.

## 문서

- [`docs/ROADMAP.md`](docs/ROADMAP.md) — 개발 로드맵 및 진행 상황
- [`CLAUDE.md`](CLAUDE.md) — 아키텍처 및 개발 가이드
