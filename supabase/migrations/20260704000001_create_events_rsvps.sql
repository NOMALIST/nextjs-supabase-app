-- events/rsvps 테이블: 모임 이벤트 관리 MVP 핵심 도메인 테이블
--
-- RLS 설계 근거:
-- - events.select는 anon+authenticated 전체 허용(using true). 공개 페이지(app/e/[slug])가
--   비회원도 slug로 이벤트 상세를 조회해야 하기 때문(F007). "타 주최자 이벤트가 대시보드 등에서
--   노출되면 안 된다"는 요구사항은 이 정책이 아니라, 애플리케이션 쿼리가 host_id로 필터링하는
--   책임으로 분리한다(RLS는 공개 조회 허용, 목록 필터링은 앱 레이어 담당).
-- - rsvps.select도 anon+authenticated 전체 허용. 공개 페이지에서 참여 인원 수/정산 요약을
--   보여줘야 하기 때문(F010). contact(연락처) 컬럼이 비회원에게 노출되지 않도록 하는 책임은
--   RLS가 아니라 애플리케이션 쿼리의 select 컬럼 제한(예: contact 제외 select)에 있다.
-- - rsvps.update는 해당 rsvp가 속한 event의 host_id가 본인인 경우만 허용(입금 확인 체크, F009).

create table public.events (
  id uuid not null primary key default gen_random_uuid(),
  host_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  title text not null,
  event_at timestamptz not null,
  location text not null,
  capacity integer null check (capacity is null or capacity > 0),
  notice text not null default '',
  fee_info text null,
  total_cost numeric null,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

-- 공개 페이지(slug 조회)를 위해 비회원 포함 전체 열람 허용
-- 주최자별 목록 필터링은 애플리케이션 쿼리(host_id = 로그인 사용자)가 책임진다
create policy "Events are viewable by everyone"
  on public.events for select
  to anon, authenticated
  using (true);

create policy "Hosts can insert their own events"
  on public.events for insert
  to authenticated
  with check (host_id = auth.uid());

create policy "Hosts can update their own events"
  on public.events for update
  to authenticated
  using (host_id = auth.uid())
  with check (host_id = auth.uid());

create policy "Hosts can delete their own events"
  on public.events for delete
  to authenticated
  using (host_id = auth.uid());

create index events_host_id_idx on public.events (host_id);

create table public.rsvps (
  id uuid not null primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  contact text null,
  status text not null check (status in ('참여', '불참')),
  is_paid boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;

-- 비회원 RSVP 제출 허용(F004)
create policy "Anyone can submit an rsvp"
  on public.rsvps for insert
  to anon, authenticated
  with check (true);

-- 공개 페이지의 참여 인원/정산 요약 노출을 위해 전체 열람 허용(F010)
-- contact 컬럼 비노출은 애플리케이션 쿼리의 select 컬럼 제한 책임
create policy "Rsvps are viewable by everyone"
  on public.rsvps for select
  to anon, authenticated
  using (true);

-- 입금 확인(is_paid) 체크는 해당 이벤트의 주최자만 가능(F009)
create policy "Hosts can update rsvps of their own events"
  on public.rsvps for update
  to authenticated
  using (
    exists (
      select 1 from public.events e
      where e.id = rsvps.event_id
        and e.host_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.events e
      where e.id = rsvps.event_id
        and e.host_id = auth.uid()
    )
  );

-- delete 정책은 만들지 않음(MVP 범위 아님, 정책 미생성 시 기본 차단됨)

create index rsvps_event_id_idx on public.rsvps (event_id);
