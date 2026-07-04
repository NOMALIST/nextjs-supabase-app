"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateSettlement } from "@/lib/events/settlement";
import { MockEvent, MockRsvp } from "@/lib/events/types";
import { useState } from "react";

export function EventDashboard({
  event,
  rsvps,
}: {
  event: MockEvent;
  rsvps: MockRsvp[];
}) {
  const [totalCost, setTotalCost] = useState(
    event.totalCost != null ? String(event.totalCost) : ""
  );

  const attending = rsvps.filter((r) => r.status === "참여");
  const notAttending = rsvps.filter((r) => r.status === "불참");
  const isOverCapacity =
    event.capacity != null && attending.length > event.capacity;

  const totalCostNumber = Number(totalCost) || 0;
  const { perPerson } = calculateSettlement(totalCostNumber, attending.length);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/e/${event.slug}`
      : `/e/${event.slug}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">{event.title}</h1>
        {isOverCapacity && <Badge variant="destructive">정원 초과</Badge>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>공유 링크</CardTitle>
          <CardDescription>이 링크를 참여자에게 공유하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input readOnly value={shareUrl} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            참여 현황 ({attending.length}명 참여
            {event.capacity != null ? ` / 정원 ${event.capacity}명` : ""})
          </CardTitle>
          <CardDescription>불참 {notAttending.length}명</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {rsvps.length === 0 && (
              <p className="text-sm text-muted-foreground">
                아직 RSVP가 없습니다.
              </p>
            )}
            {rsvps.map((rsvp) => (
              <div
                key={rsvp.id}
                className="flex items-center justify-between border-b py-2 text-sm last:border-b-0"
              >
                <div className="flex flex-col">
                  <span>{rsvp.name}</span>
                  {rsvp.contact && (
                    <span className="text-xs text-muted-foreground">
                      {rsvp.contact}
                    </span>
                  )}
                </div>
                <Badge variant={rsvp.status === "참여" ? "default" : "outline"}>
                  {rsvp.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>정산</CardTitle>
          <CardDescription>
            총비용을 입력하면 1인당 금액이 자동 계산됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="totalCost">총비용</Label>
            <Input
              id="totalCost"
              type="number"
              min={0}
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
            />
          </div>
          <p className="text-sm">
            1인당 금액:{" "}
            {attending.length > 0
              ? `${perPerson.toLocaleString("ko-KR")}원`
              : "확정 인원 없음"}
          </p>
          <div className="flex flex-col gap-2">
            {attending.map((rsvp) => (
              <div key={rsvp.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  id={`paid-${rsvp.id}`}
                  checked={rsvp.isPaid}
                  onCheckedChange={() => {
                    // 입금 상태 변경 연동은 Phase 5(Task 012)에서 처리
                  }}
                />
                <Label htmlFor={`paid-${rsvp.id}`}>{rsvp.name} 입금 여부</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
