-- rsvps_public view: 참여자 개인정보(contact) 비노출용 공개 열람 뷰
--
-- 목적:
-- - Task 013(정산 내역 공개 페이지)에서 비회원에게 참여 현황을 노출할 때
--   contact(연락처) 컬럼이 응답에 포함되지 않도록 컬럼 자체를 제거한 뷰를 제공한다.
-- - 기존에는 애플리케이션 쿼리의 select 컬럼 제한으로만 contact 비노출을 보장했으나(20260704000001 참고),
--   이 뷰를 사용하면 DB 레벨에서 한 번 더 방어선을 추가할 수 있다.
--
-- security_invoker = true 설정 근거:
-- - 이 옵션이 없으면 PostgreSQL은 뷰를 소유자 권한으로 평가한다(Security Definer 뷰와 유사한 동작).
--   이 경우 Supabase 보안 어드바이저가 "Security Definer View" 경고를 발생시킨다.
-- - security_invoker = true로 설정하면 뷰를 호출하는 사용자의 권한(및 RLS)으로 평가되므로,
--   기반 테이블 public.rsvps에 이미 걸려 있는 "Rsvps are viewable by everyone"(anon+authenticated 전체 허용) 정책을
--   그대로 상속받는다. 따라서 이 뷰에는 별도의 RLS 정책을 추가하지 않는다.
create view public.rsvps_public
with (security_invoker = true)
as
select
  id,
  event_id,
  name,
  status,
  is_paid,
  created_at
from public.rsvps;
