# Development Guidelines

## 프로젝트 개요

- Next.js 15(App Router) + Supabase Auth(SSR). 스타터킷 위에 "모임 이벤트 관리 웹 MVP" 개발 중
- 제품 요구사항: `docs/RRD.md` / 개발 순서: `docs/ROADMAP.md` — 신규 기능 작업 전 필독
- 테스트 러너 없음. API/비즈니스 로직은 Playwright MCP E2E로 검증

## 필수 명령

- 커밋/PR 전: `npm run check-all`
- 스키마 변경 후: `generate_typescript_types` 재생성 (수동 편집 금지)
- 코드 수정 전 DB 이슈 의심 시: `list_tables`/`list_migrations`/`get_advisors`/`get_logs` 우선 확인

## 인증 (변경 금지 영역)

- 이중 방어 구조 유지: `proxy.ts` 세션 갱신 + 페이지 레벨 `getClaims()` 재확인. 한쪽만 구현 금지
- `lib/supabase/proxy.ts`의 `createServerClient`~`getClaims()` 구간: 코드 삽입 금지
- `updateSession()` 반환값(`supabaseResponse`)과 쿠키: 그대로 유지, 임의 변경 금지
- 신규 공개(비인증) 경로 추가 시: `proxy.ts` 리다이렉트 예외 조건에 해당 경로 반영
- `app/protected/layout.tsx`: 인증 체크 금지 (nav/footer 전용). 인증은 `page.tsx`에서

## Supabase 클라이언트 3종 (교차 사용 금지)

- `lib/supabase/client.ts` — Client Component 전용
- `lib/supabase/server.ts` — Server Component / Route Handler 전용
- `lib/supabase/proxy.ts` — `proxy.ts` 전용, 타 위치 import 금지
- 모든 클라이언트: `Database` 제네릭 명시 필수

## Server/Client Component 분리

- `app/`: Server Component 기본, `"use client"` 금지
- 인터랙션 로직: `components/` 별도 Client Component로 분리 (`login-form.tsx` 위임 패턴 재사용)
- 신규 OAuth 프로바이더: `google-login-button.tsx` 패턴 재사용, 콜백 라우트 신규 생성 금지

## 데이터베이스 / 마이그레이션

- `supabase/migrations/`: 기존 파일 수정 금지, 항상 다음 순번 신규 파일 추가
- 신규 테이블: RLS 활성화 + 정책 필수, anon 권한은 최소 권한 원칙
- 트리거 전용 함수: `security definer` + `revoke execute ... from public, anon, authenticated` 패턴 유지
- 마이그레이션 적용 후: `get_advisors` 보안 점검 필수

## 신규 기능(이벤트/RSVP) 개발

- `docs/ROADMAP.md` Phase 순서 준수 (건너뛰기 금지)
- 주최자 라우트: `app/protected/` 인증 패턴 재사용
- 공개 참여자 라우트: 무인증, `proxy.ts` 예외 경로 정합 확인 필수
- 진행 상황: `docs/ROADMAP.md` 체크박스·상태 배지 갱신
- API/비즈니스 로직: Playwright MCP 테스트 체크리스트 실행 필수

## UI

- shadcn/ui(`new-york`) + TailwindCSS v3 + `cn()` 고정, 신규 UI 라이브러리 도입 금지
- 신규 shadcn 컴포넌트: `mcp__shadcn` 도구로 추가
- `docs/guides/` 문서: 원칙만 참고 (구조/버전은 실제 코드 기준, 타 템플릿 가정 다수)
- 폼 검증 라이브러리: `docs/ROADMAP.md` 초기 결정 사항 확인 후 전체 폼에 통일 적용

## 금지 사항

- 인증 이중 방어 구조 단순화 금지
- `database.types.ts` 수동 편집 금지
- Supabase 클라이언트 3종 교차 사용 금지
- 기존 마이그레이션 파일 수정 금지
- `docs/RRD.md` MVP 제외 범위 임의 구현 금지 (카풀, PG 연동, 참여자 회원가입 등)
