-- profiles.is_admin: 관리자(operator) 판별 컬럼
--
-- 관리자 판별 기준: is_admin = true 단일 boolean (다단계 role 불필요, MVP 범위상
-- 주최자/관리자 이분법으로 충분). 최초 관리자 계정은 UI 없이 SQL로 직접 부여한다:
--   update public.profiles set is_admin = true where email = '...';
--
-- RLS 정책에서 is_admin을 참조하는 곳은 없다(profiles/events/rsvps SELECT가 이미
-- anon+authenticated 전체 허용 상태). 따라서 SECURITY DEFINER 판별 함수는 만들지
-- 않고, 애플리케이션 레이어(admin layout, 관리자 로그인 폼)가 로그인한 사용자 본인의
-- profiles.is_admin을 직접 select해서 확인한다.
alter table public.profiles
  add column is_admin boolean not null default false;

-- 기존 UPDATE 정책의 auth.uid() 호출이 initplan 단계에서 재평가되지 않도록
-- (select auth.uid())로 감싼다. 20260704000002에서 events/rsvps에 적용한 것과
-- 동일한 최적화를 profiles에도 일관되게 적용한다(논리적 조건은 동일).
drop policy "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
