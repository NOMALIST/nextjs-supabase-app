-- get_advisors(performance)의 auth_rls_initplan 경고 해소.
-- 20260704000001_create_events_rsvps.sql에서 만든 정책들이 auth.uid()를 행마다
-- 재평가하고 있어, (select auth.uid())로 감싸 initplan 단계에서 한 번만 평가되도록 최적화한다.
-- 정책의 논리적 조건은 동일하며 평가 방식만 바뀐다.

drop policy "Hosts can insert their own events" on public.events;
create policy "Hosts can insert their own events"
  on public.events for insert
  to authenticated
  with check (host_id = (select auth.uid()));

drop policy "Hosts can update their own events" on public.events;
create policy "Hosts can update their own events"
  on public.events for update
  to authenticated
  using (host_id = (select auth.uid()))
  with check (host_id = (select auth.uid()));

drop policy "Hosts can delete their own events" on public.events;
create policy "Hosts can delete their own events"
  on public.events for delete
  to authenticated
  using (host_id = (select auth.uid()));

drop policy "Hosts can update rsvps of their own events" on public.rsvps;
create policy "Hosts can update rsvps of their own events"
  on public.rsvps for update
  to authenticated
  using (
    exists (
      select 1 from public.events e
      where e.id = rsvps.event_id
        and e.host_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.events e
      where e.id = rsvps.event_id
        and e.host_id = (select auth.uid())
    )
  );
