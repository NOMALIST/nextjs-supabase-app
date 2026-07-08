"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { createClient } from "@/lib/supabase/client";
import { EventRow, RsvpRow } from "@/lib/events/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function EventDashboard({
  event,
  rsvps,
}: {
  event: EventRow;
  rsvps: RsvpRow[];
}) {
  const [totalCost, setTotalCost] = useState(
    event.total_cost != null ? String(event.total_cost) : ""
  );
  const [isCopied, setIsCopied] = useState(false);
  const [paidError, setPaidError] = useState<string | null>(null);
  const [costError, setCostError] = useState<string | null>(null);
  const router = useRouter();

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

  // 공유 링크를 클립보드에 복사하고 2초간 "복사됨" 피드백을 표시한다
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // 클립보드 권한 거부 등 실패 시 다른 상태는 건드리지 않고 조용히 무시
    }
  };

  // 입금 여부를 토글하고 성공 시 router.refresh()로 Server Component를 재조회한다
  // RLS 정책 "Hosts can update rsvps of their own events"가 host_id 검증을 전담하므로
  // 클라이언트에서는 별도 권한 확인 없이 호출하고 실패 시 에러 문구만 표시한다
  const handleTogglePaid = async (rsvp: RsvpRow) => {
    setPaidError(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("rsvps")
      .update({ is_paid: !rsvp.is_paid })
      .eq("id", rsvp.id);

    if (error) {
      setPaidError("입금 상태 변경에 실패했습니다.");
      return;
    }

    router.refresh();
  };

  // 총비용 입력란에서 포커스가 벗어날 때 events.total_cost를 저장한다
  const handleTotalCostBlur = async () => {
    setCostError(null);
    const value = totalCost === "" ? null : Number(totalCost);

    if (value === event.total_cost) {
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("events")
      .update({ total_cost: value })
      .eq("id", event.id);

    if (error) {
      setCostError("총비용 저장에 실패했습니다.");
      return;
    }

    router.refresh();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{event.title}</h1>
          {isOverCapacity && <Badge variant="destructive">정원 초과</Badge>}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => router.push(`/events/new?duplicateFrom=${event.id}`)}
        >
          이 이벤트 복제하기
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>공유 링크</CardTitle>
          <CardDescription>이 링크를 참여자에게 공유하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input readOnly value={shareUrl} />
            <Button type="button" variant="secondary" onClick={handleCopyLink}>
              {isCopied ? "복사됨" : "복사"}
            </Button>
          </div>
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
              <p className="text-muted-foreground text-sm">
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
                    <span className="text-muted-foreground text-xs">
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
              onBlur={handleTotalCostBlur}
            />
          </div>
          <p className="text-sm">
            1인당 금액:{" "}
            {attending.length > 0
              ? `${perPerson.toLocaleString("ko-KR")}원`
              : "확정 인원 없음"}
          </p>
          {costError && <p className="text-sm text-red-500">{costError}</p>}
          {paidError && <p className="text-sm text-red-500">{paidError}</p>}
          <div className="flex flex-col gap-2">
            {attending.length === 0 && (
              <p className="text-muted-foreground text-sm">
                참여 확정 인원이 없습니다.
              </p>
            )}
            {attending.map((rsvp) => (
              <div key={rsvp.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  id={`paid-${rsvp.id}`}
                  checked={rsvp.is_paid}
                  onCheckedChange={() => handleTogglePaid(rsvp)}
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
