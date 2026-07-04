import { Suspense } from "react";
import { notFound } from "next/navigation";
import { mockEvents, mockRsvps } from "@/lib/events/mock-data";
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
  const event = mockEvents.find((e) => e.slug === slug);

  if (!event) {
    notFound();
  }

  const confirmedCount = mockRsvps.filter(
    (r) => r.eventId === event.id && r.status === "참여"
  ).length;

  return (
    <div className="flex w-full flex-col gap-6 p-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{event.title}</CardTitle>
          <CardDescription>{event.location}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <p>{new Date(event.eventAt).toLocaleString("ko-KR")}</p>
          <p>{event.notice}</p>
          {event.feeInfo && (
            <p className="text-muted-foreground">{event.feeInfo}</p>
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
          {event.totalCost == null ? (
            <p className="text-muted-foreground">정산 미확정</p>
          ) : (
            <div className="flex flex-col gap-1">
              <p>총비용: {event.totalCost.toLocaleString("ko-KR")}원</p>
              <p>확정 인원: {confirmedCount}명</p>
              <p>
                1인당 금액:{" "}
                {confirmedCount > 0
                  ? `${calculateSettlement(event.totalCost, confirmedCount).perPerson.toLocaleString("ko-KR")}원`
                  : "확정 인원 없음"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <RsvpForm />
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
