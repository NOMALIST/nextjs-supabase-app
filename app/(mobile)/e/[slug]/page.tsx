import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RsvpForm } from "@/components/rsvp-form";
import { calculateSettlement } from "@/lib/events/settlement";

async function PublicEventContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!event) {
    notFound();
  }

  const { count } = await supabase
    .from("rsvps_public")
    .select("*", { count: "exact", head: true })
    .eq("event_id", event.id)
    .eq("status", "참여");

  const confirmedCount = count ?? 0;

  return (
    <div className="flex w-full flex-col gap-6 p-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{event.title}</CardTitle>
          <CardDescription>{event.location}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <p>{new Date(event.event_at).toLocaleString("ko-KR")}</p>
          <p>{event.notice}</p>
          {event.fee_info && (
            <p className="text-muted-foreground">{event.fee_info}</p>
          )}
          <p>
            확정 인원: {confirmedCount}명
            {event.capacity != null ? ` / 정원 ${event.capacity}명` : ""}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>정산 요약</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          {event.total_cost == null ? (
            <p className="text-muted-foreground">정산 미확정</p>
          ) : (
            <div className="flex flex-col gap-1">
              <p>총비용: {event.total_cost.toLocaleString("ko-KR")}원</p>
              <p>확정 인원: {confirmedCount}명</p>
              <p>
                1인당 금액:{" "}
                {confirmedCount > 0
                  ? `${calculateSettlement(event.total_cost, confirmedCount).perPerson.toLocaleString("ko-KR")}원`
                  : "확정 인원 없음"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <RsvpForm eventId={event.id} />
    </div>
  );
}

export default function PublicEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense>
      <PublicEventContent params={params} />
    </Suspense>
  );
}
