# 모임 이벤트 관리 웹 MVP 개발 로드맵

정기 모임 주최자의 공지·참여자 관리(RSVP)·정산을 하나의 링크로 대체하는 서비스. 기존 Next.js 15 + Supabase Auth 스타터킷 위에 이어서 개발.

## 개요

대상: 정기 모임 주최자(Primary) + 링크 초대 참여자(Secondary)

- **공지 자동화**: 이벤트 생성 → slug 공유 링크 자동 발급 (F001, F002, F007)
- **비회원 RSVP**: 로그인 없이 이름 입력 → 참여/불참, 주최자 실시간 명단·정원 확인 (F004, F005, F006)
- **자동 정산**: 총비용 → 확정 인원 1/N 자동 계산, 입금 체크 (F008, F009, F010)
- **반복 업무 제거**: 지난 이벤트 복제 (F003, F012)

> **인증(F011) 구현 완료** — `proxy.ts` + 페이지 레벨 이중 체크, `app/auth/*`, `login-form.tsx` 등 그대로 재사용. 신규 인증 시스템 불필요.

> **개발 순서: UI 먼저** — 정적 목업으로 주요 화면 완성 → 필요 필드/구조 확인 → DB 스키마(events/rsvps) 확정 → 실연동 부착.

## 아키텍처 원칙 (CLAUDE.md 준수)

- 인증: `updateSession()` + 페이지별 `getClaims()` 재확인, 공개 페이지는 `proxy.ts` 예외 경로 정합
- Server Component 우선, 인터랙션만 Client Component 분리
- Supabase 클라이언트 3종 분리 (교차 사용 금지)
- DB 마이그레이션: 기존 파일 다음 순번 추가, RLS 필수
- 타입 재생성: 스키마 변경 후 `generate_typescript_types` (수동 편집 금지)
- UI: shadcn/ui(new-york) + TailwindCSS v3 + `cn()`

## 초기 결정 사항

- [x] **폼 검증 라이브러리 선택**: (B) 네이티브 폼 + `useState` 경량 검증 채택 (Task 003-B, `components/event-form.tsx`)
  - 신규 의존성 추가 없이 기존 `login-form.tsx` 패턴과 통일

## 상태 배지

- 🔴 미착수 · 🟡 진행중 · 🟢 완료(`See: /tasks/XXX-*.md`)

## 개발 워크플로우

1. **작업 계획** — 코드베이스 파악 → `ROADMAP.md` 갱신
2. **작업 생성** — `/tasks/XXX-description.md` 명세 작성. API/비즈니스 로직 태스크는 테스트 체크리스트 필수
3. **작업 구현** — Playwright MCP E2E 테스트 수행, 태스크 파일 진행 상황 갱신
4. **로드맵 업데이트** — 완료 태스크 🟢 표시 + `See:` 경로 추가

---

## Phase 1: UI/UX 골격 (정적 목업) 🟢

**목표**: DB 연동 없이 주요 화면 완성, 필요 필드 조기 발견

> **관리자페이지(운영자) 정적 UI 목업 추가** (Task 017~019). 주최자(호스트)와 별개인 시스템 운영자(operator) 역할. **범위: 정적 UI만** — 실제 관리자 인증/권한 체계, 실데이터 연동, 실통계 API는 이번 범위 아님(향후 Phase 후보).

- [x] **Task 001: 라우트 골격 및 주최자 레이아웃** 🟢
  - [x] 주최자 라우트 껍데기 (목록/생성·수정/관리 대시보드)
  - [x] 공개 페이지 라우트 껍데기 (slug 기반, 무인증)
  - [x] 주최자 라우트 `getClaims()` 페이지 인증 배치
  - [x] `proxy.ts` 예외 경로에 공개 페이지 반영
  - [x] 빌드/라우팅 확인
  - [x] 전체 앱 모바일 폭(430px) 고정 공통 레이아웃 적용 (`app/layout.tsx`)

- [x] **Task 002: 더미 데이터 & UI 타입 정의** 🟢
  - [x] 화면용 이벤트/RSVP 임시 타입 정의
  - [x] 목업 데이터 유틸 작성
  - [x] 정산 계산 순수 함수 스캐폴드

- [x] **Task 003: 주최자 화면 정적 UI** 🟢
  - [x] 이벤트 목록/이력 UI (F003) — Task 003-A
  - [x] 생성/수정 폼 UI (F001) — Task 003-B
  - [x] 관리 대시보드 UI (F002/F005/F006/F008/F009) — Task 003-C
  - [x] 폼 검증 방식 확정 — (B) 네이티브 폼 + `useState`
  - [x] Phase 2 스키마 입력용 필드 도출 — Task 005 항목에 반영

- [x] **Task 004: 공개(참여자) 화면 정적 UI** 🟢
  - [x] slug 공개 페이지 UI (F007/F002) — Task 004-A
  - [x] 비회원 RSVP 폼 UI (F004) — Task 004-B
  - [x] 정산 요약 공개 UI (F010) — Task 004-C
  - [x] 무인증 렌더 확인

- [x] **Task 017: 관리자 로그인 & 라우트 골격 (정적 UI)** 🟢
  - [x] 관리자 라우트 껍데기 (로그인/대시보드/이벤트·사용자 관리/통계, 주최자 라우트와 분리)
  - [x] 관리자 로그인 페이지 정적 UI (F013) — 주최자 로그인과 별개 화면
  - [x] 관리자 전용 레이아웃 골격 (사이드바/헤더, 관리자 메뉴 트리)
  - [x] 목업 상태이므로 실제 인증/권한 체크 없음 (향후 Phase에서 별도 설계)
  - [x] 빌드/라우팅 확인

- [x] **Task 018: 관리자 대시보드 & 관리 테이블 정적 UI** 🟢
  - [x] 대시보드 메인 UI — 핵심 지표 요약 카드, 최근 현황 (F014)
  - [x] 이벤트 관리 테이블 UI — 전체 이벤트 목록/검색/필터 목업 (F015)
  - [x] 사용자(주최자/회원) 관리 테이블 UI — 회원 목록 목업, 참여자(RSVP)는 대상 아님 (F016)
  - [x] 하드코딩 더미 데이터로 렌더 (실데이터 연동 아님)
  - [x] 반응형/모바일 폭 정합 확인

- [x] **Task 019: 통계 분석 페이지 & Recharts 더미 차트** 🟢
  - [x] Recharts 라이브러리 설치 (신규 의존성 추가)
  - [x] 통계 분석 페이지 정적 UI 레이아웃 (F017)
  - [x] 더미 데이터 기반 차트 컴포넌트 구현 (막대/파이) — 실통계 API 연동 아님
  - [x] 차트 반응형/다크모드 스타일 정합
  - [x] 빌드/렌더 확인

---

## Phase 2: DB 스키마 확정 & 타입 재생성 🟢

**목표**: Phase 1 UI 기준 events/rsvps 스키마·RLS 확정, 타입 재생성

- [x] **Task 005: events / rsvps 마이그레이션 및 RLS 설계** 🟢
  - [x] Phase 1 UI 도출 필드 기준 스키마 확정
    - 참고(Task 003 UI 실사용 필드): `events` — title, eventAt, location, capacity(nullable), notice, feeInfo(nullable), totalCost(nullable), slug, hostId / `rsvps` — name, contact(nullable), status(참여|불참), isPaid
  - [x] 신규 마이그레이션 SQL 작성 (`supabase/migrations/20260704000001_create_events_rsvps.sql`)
  - [x] `events`/`rsvps` 테이블 설계
  - [x] RLS 정책 설계 (본인 CRUD, anon SELECT/INSERT 범위)
  - [x] `slug` 유일성 보장
  - [x] 적용 후 `get_advisors` 점검 (initplan 성능 경고 보정 `20260704000002_optimize_events_rsvps_rls_initplan.sql`)

- [x] **Task 006: 타입 재생성 및 도메인 타입 정의** 🟢
  - [x] `generate_typescript_types` 재생성
  - [x] Phase 1 임시 타입 → 실제 DB 타입 교체
  - [x] 정산 계산 함수 타입 정리

---

## Phase 3: 주최자 이벤트 CRUD & 공유 링크 연동 🟢

**목표**: 생성 → 목록 → 공유 링크 발급 실동작

- [x] **Task 020: 홈 화면 신설 및 로그인 리다이렉트 정리, 전체 한국어화** 🟢
  - [x] 홈(`/`)을 이벤트 목록(`/events`)과 별개인 서비스 소개/환영 화면으로 신설 (`(mobile)` 라우트 그룹, 스타터킷 데모 대체)
  - [x] 로그인/회원가입/비번변경/OAuth 콜백 성공 리다이렉트를 홈(`/`)으로 통일
  - [x] `/protected` 스타터킷 데모 페이지 및 빈 라우트 폴더 잔재 정리
  - [x] 스타터킷 전용 미사용 컴포넌트(Hero, DeployButton 등) 정리
  - [x] 전체 UI 텍스트 한국어화 (`app/layout.tsx` lang/metadata, `instruments` 데모 페이지 삭제, `auth/error`·`auth/sign-up-success` 한국어화 포함)
  - [x] `CLAUDE.md`의 실제 구조와 어긋난 `app/protected/*` 언급 정정
  - [x] 테스트 체크리스트: 미로그인/로그인 상태 홈 분기 노출 / 로그인 성공 후 `/` 이동 / `/events` 기존 플로우 회귀 확인 (Playwright MCP로 검증 완료)

- [x] **Task 007: 이벤트 생성/수정 폼 저장 로직 연동** 🟢
  - [x] slug 자동 생성 + `events` INSERT/UPDATE (`lib/events/slug.ts`, `unique_violation` 1회 재시도)
  - [x] `lib/events/types.ts`에 `RsvpStatus = "참여" | "불참"` 리터럴 타입 추가
  - [x] 저장 성공/실패 처리
  - [x] 폼 검증 방식 실제 적용
  - [x] 테스트 체크리스트: 로그인→생성→slug 발급 / 필수값 검증 / 수정 반영 (Playwright MCP로 검증 완료)

- [x] **Task 008: 이벤트 목록/이력 실데이터 연동** 🟢
  - [x] 본인 이벤트 최신순 실조회 (`host_id` 필터 + RLS)
  - [x] 상세 이동, 빈 상태 처리
  - [x] 테스트 체크리스트: 최신순 노출 / 타 주최자 미노출 / 상세 이동 (Playwright MCP로 검증 완료)

---

## Phase 4: 참여자 공개 페이지 & RSVP 연동 🟢

**목표**: slug 접속 → 공지 확인 → RSVP 제출 실동작

- [x] **Task 009: 공개 페이지 공지 실데이터 연동** 🟢
  - [x] slug 기반 실조회, 미존재 slug 404 (`app/(mobile)/e/[slug]/page.tsx`)
  - [x] anon SELECT RLS 정합 확인 (마이그레이션 변경 없이 기존 정책으로 충족)
  - [x] 테스트 체크리스트: 공지 노출 / 잘못된 slug 404 / 로그인 리다이렉트 미발생 (Playwright MCP로 검증 완료)

- [x] **Task 010: 비회원 RSVP 제출 연동** 🟢
  - [x] `rsvps` INSERT 연동 (`components/rsvp-form.tsx`)
  - [x] anon INSERT RLS 검증 (마이그레이션 변경 없이 기존 정책으로 충족)
  - [x] 테스트 체크리스트: 참여/불참 제출 / 이름 누락 검증 / 완료 상태 표시 (Playwright MCP로 검증 완료, 주최자 대시보드 반영 확인)

---

## Phase 5: 대시보드 집계 · 정원 경고 · 정산 연동 🟢

**목표**: 실시간 현황 + 정산 처리

- [x] **Task 011: 참여 현황 & 링크 복사 연동** 🟢 — 우선순위
  - [x] 신규 마이그레이션: `public.rsvps_public` view 생성 (`contact` 제외, Task 013 선행 작업)
  - [x] 실데이터 명단 조회 (F005) — Phase 3/4에서 이미 실연동 완료된 상태 확인(주최자 대시보드는 기존 `rsvps` 테이블 그대로 사용)
  - [x] 링크 복사 동작 (F002)
  - [x] 정원 초과 경고 배지 (F006)
  - [x] 테스트 체크리스트: 대시보드 반영 / 경고 노출 / 링크 복사 / 접근 차단 (Playwright MCP로 검증 완료)

- [x] **Task 012: 정산 자동 계산 & 입금 체크 연동** 🟢
  - [x] 1/N 자동 계산 (F008)
  - [x] 입금 체크 → `is_paid` UPDATE (F009)
  - [x] 확정 인원 0명 엣지 케이스
  - [x] 테스트 체크리스트: 계산 정확성 / 토글 반영 / 0명 엣지 / RLS 차단 (Playwright MCP로 검증 완료)

---

## Phase 6: 정산 공개 노출 & 이벤트 복제 연동 🟢

**목표**: 정산 요약 공개 + 반복 업무 제거

- [x] **Task 013: 정산 요약 공개 노출 연동** 🟢
  - [x] 실데이터 공개 노출 (F010) — 확정 인원 count 쿼리를 `rsvps_public` view로 전환(`app/(mobile)/e/[slug]/page.tsx`), `contact` 컬럼 비노출 DB 레벨 확보
  - [x] 미확정 상태 표시 (기존 구현 유지, 회귀 없음 확인)
  - [x] 테스트 체크리스트: 비로그인 열람 / 입금 반영 / 미입력 안내 / `contact` 미노출 확인 (Playwright MCP로 검증 완료)

- [x] **Task 014: 지난 이벤트 복제 (F012)** 🟢
  - [x] 텍스트 정보만 복사, slug 신규 발급, 일시/정원/정산 비움 (`components/event-form.tsx`의 `duplicateValues` prop)
  - [x] "이 이벤트 복제하기" 버튼 → 생성 페이지 진입 (`components/event-dashboard.tsx`)
  - [x] 본인 이벤트 검증 (`app/(mobile)/events/new/page.tsx`의 `host_id` 필터, `?duplicateFrom=` 쿼리 파라미터)
  - [x] 테스트 체크리스트: 텍스트만 복사 / 새 slug / 독립 동작 (Playwright MCP로 검증 완료)

---

## Phase 7: 관리자페이지 실연동 🟢

**목표**: 정적 목업(F013~F017)을 실제 관리자 인증·권한·데이터로 전환. 익명 접근 가능한 현 상태 차단.

> **선행 조건**: 정적 UI 목업(Task 017~019)은 완료됨. 관리자(operator) 역할은 주최자(host)와 별개. 현재 `/admin/*`은 인증/권한 체크가 전혀 없어 익명 접근이 열려 있음 — 본 Phase에서 폐쇄.

- [x] **Task 021: 관리자 역할 스키마 · RLS 재설계** 🟢
  - [x] `profiles.is_admin` boolean 컬럼 신규 마이그레이션 (`supabase/migrations/20260704000004_add_profiles_is_admin.sql`), UPDATE 정책 initplan 최적화 동시 적용
  - [x] `events.category` 컬럼 신규 마이그레이션 (`supabase/migrations/20260704000005_add_events_category.sql`), 한국어 고정값 체크 제약
  - [x] 관리자 판별 기준: 단순 boolean(`is_admin = true`), 최초 관리자 부여는 SQL 수동 UPDATE (승격 UI 없음)
  - [x] events/rsvps/profiles SELECT가 이미 anon+authenticated 전체 허용 상태라 admin 전용 RLS 예외는 불필요 판정(과설계 방지) — 애플리케이션 레이어에서 `profiles.is_admin` 직접 조회
  - [x] 적용 후 `get_advisors` 점검(신규 경고 없음), `generate_typescript_types` 재생성
  - [x] 테스트 체크리스트: 컬럼 존재/기본값 확인, 체크 제약 동작 확인 (Playwright MCP + Supabase MCP로 검증 완료)

- [x] **Task 022: 관리자 로그인 페이지 실제 구현** 🟢
  - [x] `app/admin/login/page.tsx`(Server) + `components/admin-login-form.tsx`(Client) 신규 작성
  - [x] 기존 `login-form.tsx` 마크업 패턴을 참고해 별도 컴포넌트로 분리(성공 후 role 분기 로직이 다르므로 재사용 대신 패턴 복제)
  - [x] 비관리자 로그인 시 `signOut()` + "관리자 권한이 없습니다" 표시로 접근 거부
  - [x] `components/event-form.tsx`에 `category` 선택 필드 추가(이벤트 생성/수정/복제 반영)
  - [x] 테스트 체크리스트: 관리자 계정 로그인 성공 / 일반 회원 계정 거부+세션종료 / 이미 인증된 관리자 재방문 시 자동 리다이렉트 (Playwright MCP로 검증 완료)

- [x] **Task 023: 관리자 라우트 접근 제어 (proxy 예외 축소 + role 이중 체크)** 🟢
  - [x] `lib/supabase/proxy.ts`의 `/admin` 예외를 `/admin/login`만 남기고 축소, 미인증 `/admin/*` 접근은 `/admin/login`으로 리다이렉트
  - [x] `app/admin/layout.tsx`+하위 4개 페이지를 `app/admin/(authenticated)/` 라우트 그룹으로 이동, layout에서 `getClaims()` + `profiles.is_admin` 이중 체크
  - [x] Next.js 16 Cache Components 환경의 blocking-route 이슈를 Suspense+async 컴포넌트 분리로 해결(이후 모든 admin 페이지에 동일 패턴 적용)
  - [x] 테스트 체크리스트: 비로그인/일반회원/관리자 3역할 × 4개 admin 페이지 접근 매트릭스 전부 기대대로 동작 (Playwright MCP로 검증 완료)

- [x] **Task 024: 대시보드 · 이벤트 관리 실데이터 연동** 🟢
  - [x] 대시보드 요약 카드 실집계 연동(이벤트/주최자/RSVP 총수) — `lib/admin/mock-data.ts` 하드코딩 대체
  - [x] 이벤트 관리 테이블 전체 이벤트 실조회 + 제목 검색(GET 폼) + 상태 필터(예정/진행중/종료, `lib/admin/event-status.ts` 계산)
  - [x] `events`↔`profiles` PostgREST embedded join이 자동 추론되지 않는 문제(호스트 FK가 `auth.users` 참조) 발견 → host_id 목록으로 profiles 별도 조회 후 JS 매핑하는 패턴으로 해결
  - [x] 테스트 체크리스트: 실데이터 렌더 / 검색·필터 동작 / 비관리자 접근 차단 (Playwright MCP로 검증 완료)

- [x] **Task 025: 사용자(주최자) 관리 실데이터 연동** 🟢
  - [x] 회원(주최자) 관리 테이블 `profiles` 전체 실조회 + 이름/이메일 검색, 개최 이벤트 수는 `events.host_id` 별도 집계로 매핑
  - [x] 활성/정지 상태 배지는 대응 DB 컬럼이 없어 스코프 제외(타입/UI 모두 제거)
  - [x] 테스트 체크리스트: 회원 목록 실데이터 렌더 / 검색 동작 / 비관리자 접근 차단 (Playwright MCP로 검증 완료)

- [x] **Task 026: 통계 분석 실데이터 연동** 🟢
  - [x] 월별 이벤트/RSVP 추이, 카테고리별 분포(`events.category`) 모두 실집계로 교체(RPC/view 없이 Server Component에서 JS 집계, MVP 데이터 규모 고려)
  - [x] 차트 컴포넌트(`MonthlyTrendChart`/`CategoryPieChart`)는 기존 props 인터페이스 유지로 수정 불필요
  - [x] 테스트 체크리스트: 실집계 반영 / 카테고리 지정 반영 / 데이터 없음 상태 처리 / 비관리자 접근 차단 (Playwright MCP + Supabase MCP로 검증 완료)
  - [x] 통합 검증: `lib/admin/mock-data.ts` 삭제, `npm run check-all`(소스 코드 범위) 통과, `get_advisors` 최종 점검(신규 경고 없음)

---

## Phase 8: 통합 검증 · 최적화 · 배포 🔴

**목표**: 전체 플로우 E2E 검증 + 배포 준비

- [ ] **Task 015: 전체 플로우 통합 E2E 테스트** 🔴
  - [ ] 주최자/참여자 여정 E2E
  - [ ] 에러/엣지 케이스 검증
  - [ ] `get_advisors` 최종 점검

- [ ] **Task 016: 최적화 및 배포** 🔴
  - [ ] `npm run check-all` 통과
  - [ ] 캐싱/재검증 전략 정리
  - [ ] 기존 스타터킷 데모 잔존 정리 판단

---

## MVP 제외 범위

- 카풀/이동 조율
- 실제 결제/송금(PG) 연동
- 참여자 회원가입/로그인
- 반복 모임 그룹화 및 정기 알림
- 참여자 개인별 비공개 정산 확인
- 대기열/자동 정원 관리

## Post-MVP 확장 아이디어

- 카풀 매칭
- 실제 송금/PG 결제 연동
- 반복 모임 그룹화 및 정기 알림
- 참여자 계정화
- 대기열 및 자동 정원 관리

---

**최종 수정**: 2026-07-07 (Phase 7 완료 — profiles.is_admin/events.category 마이그레이션, 관리자 라우트 인증·권한 이중 체크, 대시보드/이벤트/사용자/통계 실데이터 연동, Playwright MCP E2E 검증 완료)
