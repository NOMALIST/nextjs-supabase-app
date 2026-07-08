-- events.category: 관리자 통계(카테고리별 분포) 실데이터 확보용 컬럼
--
-- nullable로 두어 기존 이벤트와의 호환성을 보장한다(카테고리 미지정 이벤트 허용).
-- 허용값은 rsvps.status 컨벤션(text + check)과 동일하게 한국어 고정값으로 제한한다.
--
-- RLS 정책 변경 없음: 기존 events SELECT/INSERT/UPDATE 정책은 컬럼과 무관하게
-- 그대로 적용된다.
alter table public.events
  add column category text null
  check (category is null or category in ('스터디', '운동', '친목', '취미', '기타'));
