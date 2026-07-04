# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Next.js 15 (App Router) + Supabase Auth(SSR) 스타터킷. Supabase 공식 `with-supabase` 템플릿을 기반으로 하며, 쿠키 기반 인증 세션을 App Router의 Server/Client Component, Route Handler, Proxy(미들웨어) 전반에서 공유한다.

## 명령어

```bash
npm run dev      # 개발 서버 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint (next/core-web-vitals + next/typescript)
```

별도의 테스트 러너나 typecheck 스크립트는 구성되어 있지 않다. 타입 체크가 필요하면 `npx tsc --noEmit`을 사용한다.

Supabase 마이그레이션은 `supabase/migrations/`에 SQL 파일로 관리한다. 로컬 Supabase 스택이나 CLI 마이그레이션 적용이 필요하면 Supabase MCP 도구(`apply_migration`, `list_migrations` 등)를 사용한다.

## 아키텍처

### 인증 흐름 (이중 방어 구조)

1. **`proxy.ts`(루트)** — Next.js 15의 middleware 대체 파일(이름만 다르고 역할은 동일). `lib/supabase/proxy.ts`의 `updateSession()`을 호출한다.
   - `createServerClient`로 요청/응답 쿠키를 동기화하며 `supabase.auth.getClaims()`로 세션을 갱신한다.
   - **주의**: `createServerClient` 호출과 `getClaims()` 호출 사이에 다른 코드를 넣지 말 것(세션 버그 유발, 파일 내 주석으로 경고되어 있음).
   - 미인증 사용자가 `/`, `/login*`, `/auth*` 이외 경로에 접근하면 `/auth/login`으로 redirect.
   - 반환하는 `supabaseResponse` 객체를 그대로 사용해야 쿠키 동기화가 유지된다(다른 `NextResponse`로 감싸거나 재생성 금지).
2. **개별 페이지 레벨** — 예: `app/protected/page.tsx`에서도 다시 `getClaims()`로 인증 체크 후 실패 시 `redirect("/auth/login")` (defense-in-depth).

`app/protected/layout.tsx`는 공통 nav/footer만 담당하며 자체 인증 체크는 하지 않는다 — 인증 체크는 반드시 페이지(`page.tsx`) 또는 proxy에서 수행한다.

`app/auth/confirm/route.ts`는 이메일 OTP 확인용 GET Route Handler. `verifyOtp` 성공 시 `next` 파라미터로 redirect, 실패 시 `/auth/error?error=...`로 redirect.

### Supabase 클라이언트 3종 (`lib/supabase/`)

컨텍스트에 맞는 클라이언트를 선택해서 써야 한다 — 서로 교차 사용 금지.

- `client.ts` — `createBrowserClient<Database>()`. Client Component(`"use client"`)에서만 사용.
- `server.ts` — `createServerClient<Database>()`. `next/headers`의 `cookies()`로 쿠키를 읽는다. Server Component에서 `setAll` 실패는 의도적으로 무시(세션 갱신은 proxy가 담당하므로 무해).
- `proxy.ts` — `NextRequest`/`NextResponse` 쿠키를 직접 조작하는 미들웨어 전용 클라이언트. `proxy.ts`(루트)의 `updateSession()`에서만 사용.

`lib/supabase/database.types.ts`는 Supabase에서 생성한 타입(`Database` 제네릭)이며, 스키마 변경 시 Supabase MCP의 `generate_typescript_types`로 재생성해야 한다. 모든 클라이언트 생성 함수는 `createClient<Database>(...)` 형태로 이 타입을 사용한다.

### Server/Client Component 분리 패턴

`app/` 아래 모든 파일은 Server Component이며 `"use client"`가 전혀 없다. 인터랙션이 필요한 부분은 `components/` 루트의 별도 Client Component로 분리되어 있다 (`login-form.tsx`, `sign-up-form.tsx`, `forgot-password-form.tsx`, `update-password-form.tsx`, `logout-button.tsx`, `theme-switcher.tsx` 등). 새 인증/폼 관련 기능을 추가할 때도 이 패턴(Server page → Client form 컴포넌트 위임)을 따른다.

### 데이터베이스

`supabase/migrations/`에 마이그레이션이 순서대로 쌓인다. 현재:

- `20260704000000_create_profiles.sql` — `public.profiles` 테이블(`auth.users` FK, `username` unique, RLS 활성화). `handle_new_user()` 트리거(security definer)가 `auth.users` INSERT 시 프로필을 자동 생성. RLS 정책상 INSERT/DELETE는 직접 허용되지 않고(트리거로만 생성), UPDATE는 본인만 가능.

`app/instruments/`는 Supabase `instruments` 테이블을 조회하는 데모/튜토리얼 페이지(Server Component + Suspense) — 스타터킷의 학습용 예제.

### 환경 변수

`.env.local`에 두 개만 필요: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. `lib/utils.ts`의 `hasEnvVars`가 두 값의 존재 여부를 확인하며, 미설정 시 `proxy.ts`의 세션 갱신 로직과 랜딩 페이지의 env 경고 배너가 이를 참조한다.

### UI

shadcn/ui (`new-york` 스타일, `components/ui/`) + TailwindCSS v3 + `next-themes` 다크모드. 경로 별칭은 `@/*` → 프로젝트 루트(`components.json`에 `@/components`, `@/lib`, `@/hooks` 등 정의). `lib/utils.ts`의 `cn()`으로 클래스를 병합한다.

## 참고 문서

`docs/guides/`에 Next.js 15, 컴포넌트 패턴, React Hook Form, 스타일링에 대한 일반 가이드 문서가 있다. **주의**: 이 문서들은 다른 프로젝트 템플릿(`src/app` 구조, react-hook-form/zod 스택, Tailwind v4 가정)을 기준으로 작성되어 이 저장소의 실제 구조(루트 `app/`, react-hook-form 미설치, Tailwind v3)와 다른 부분이 있다 — 코드 스타일/원칙(단일 책임, Server Component 우선, `cn()` 사용 등)은 참고하되 구체적 경로나 패키지 버전은 실제 코드를 기준으로 판단할 것.
