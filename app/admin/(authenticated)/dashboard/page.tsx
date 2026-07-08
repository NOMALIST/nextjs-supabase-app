import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { computeEventStatus, EventStatus } from "@/lib/admin/event-status";

const statusVariant: Record<EventStatus, "default" | "secondary" | "outline"> =
  {
    예정: "outline",
    진행중: "default",
    종료: "secondary",
  };

async function DashboardContent() {
  const supabase = await createClient();

  const [eventsCountRes, rsvpsCountRes, usersCountRes, recentEventsRes] =
    await Promise.all([
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase.from("rsvps").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("events")
        .select("id, title, event_at, capacity, host_id")
        .order("created_at", { ascending: false })
        .limit(4),
    ]);

  const recentEvents = recentEventsRes.data ?? [];
  const eventIds = recentEvents.map((event) => event.id);
  const hostIds = [...new Set(recentEvents.map((event) => event.host_id))];

  const [{ data: rsvps }, { data: hosts }] = await Promise.all([
    eventIds.length > 0
      ? supabase
          .from("rsvps")
          .select("event_id, status")
          .in("event_id", eventIds)
      : Promise.resolve({ data: [] }),
    hostIds.length > 0
      ? supabase.from("profiles").select("id, username").in("id", hostIds)
      : Promise.resolve({ data: [] }),
  ]);

  const attendeeCountByEvent = new Map<string, number>();
  for (const rsvp of rsvps ?? []) {
    if (rsvp.status === "참여") {
      attendeeCountByEvent.set(
        rsvp.event_id,
        (attendeeCountByEvent.get(rsvp.event_id) ?? 0) + 1
      );
    }
  }

  const usernameByHostId = new Map(
    (hosts ?? []).map((host) => [host.id, host.username])
  );

  const summaryMetrics = [
    {
      id: "total-events",
      label: "전체 이벤트",
      value: String(eventsCountRes.count ?? 0),
    },
    {
      id: "total-users",
      label: "전체 주최자",
      value: String(usersCountRes.count ?? 0),
    },
    {
      id: "total-rsvps",
      label: "누적 RSVP",
      value: String(rsvpsCountRes.count ?? 0),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">대시보드</h1>
        <p className="text-muted-foreground text-sm">
          전체 서비스 핵심 지표와 최근 이벤트 현황을 확인하세요.
        </p>
      </div>

      <section
        aria-label="핵심 지표 요약"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      >
        {summaryMetrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">
                {metric.label}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold tracking-tight">
                {metric.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section aria-label="최근 이벤트 현황">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">최근 현황</CardTitle>
            <CardDescription>최근 등록/진행 중인 이벤트입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentEvents.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                등록된 이벤트가 없습니다.
              </p>
            ) : (
              recentEvents.map((event) => {
                const status = computeEventStatus(event.event_at);
                const attendeeCount = attendeeCountByEvent.get(event.id) ?? 0;

                return (
                  <div
                    key={event.id}
                    className="flex items-center justify-between gap-3 border-b pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-sm font-medium">
                        {event.title}
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        주최자{" "}
                        {usernameByHostId.get(event.host_id) ?? "알 수 없음"}
                      </span>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge variant={statusVariant[status]}>{status}</Badge>
                      <span className="text-muted-foreground text-xs">
                        {attendeeCount}
                        {event.capacity != null ? ` / ${event.capacity}` : ""}명
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
