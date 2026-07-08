import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EventRowActions } from "@/components/admin/event-row-actions";
import { createClient } from "@/lib/supabase/server";
import { computeEventStatus, EventStatus } from "@/lib/admin/event-status";

const statusVariant: Record<EventStatus, "default" | "secondary" | "outline"> =
  {
    예정: "outline",
    진행중: "default",
    종료: "secondary",
  };

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "예정", label: "예정" },
  { value: "진행중", label: "진행중" },
  { value: "종료", label: "종료" },
];

async function AdminEventsContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = "", status = "all" } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("events")
    .select("id, title, event_at, capacity, host_id, created_at")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  const { data: events } = await query;
  const allEvents = events ?? [];

  const eventIds = allEvents.map((event) => event.id);
  const hostIds = [...new Set(allEvents.map((event) => event.host_id))];

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

  const rows = allEvents
    .map((event) => ({
      ...event,
      status: computeEventStatus(event.event_at),
      attendeeCount: attendeeCountByEvent.get(event.id) ?? 0,
      hostName: usernameByHostId.get(event.host_id) ?? "알 수 없음",
    }))
    .filter((event) => status === "all" || event.status === status);

  return (
    <>
      <form method="get" className="flex flex-col gap-2 sm:flex-row">
        <Input
          name="q"
          placeholder="이벤트 제목 검색"
          defaultValue={q}
          className="sm:flex-1"
        />
        <Select name="status" defaultValue={status}>
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit">검색</Button>
      </form>

      {rows.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <p className="text-muted-foreground text-sm">
            조건에 맞는 이벤트가 없습니다.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>제목</TableHead>
                <TableHead>주최자</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>참여인원</TableHead>
                <TableHead>일시</TableHead>
                <TableHead>생성일</TableHead>
                <TableHead className="text-right">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="max-w-[160px] truncate font-medium">
                    {event.title}
                  </TableCell>
                  <TableCell>{event.hostName}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[event.status]}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {event.attendeeCount}
                    {event.capacity != null ? ` / ${event.capacity}` : ""}
                  </TableCell>
                  <TableCell>
                    {new Date(event.event_at).toLocaleDateString("ko-KR")}
                  </TableCell>
                  <TableCell>
                    {new Date(event.created_at).toLocaleDateString("ko-KR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <EventRowActions />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}

export default function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">이벤트 관리</h1>
        <p className="text-muted-foreground text-sm">
          전체 이벤트 목록을 검색하고 상태별로 확인하세요.
        </p>
      </div>

      <Suspense>
        <AdminEventsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
