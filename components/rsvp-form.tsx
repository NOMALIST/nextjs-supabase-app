"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function RsvpForm({
  eventId,
  className,
  ...props
}: { eventId: string } & React.ComponentPropsWithoutRef<"div">) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"참여" | "불참" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (!status) {
      setError("참여 여부를 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from("rsvps").insert({
      event_id: eventId,
      name: name.trim(),
      contact: contact.trim() || null,
      status,
      is_paid: false,
    });
    setIsSubmitting(false);

    if (error) {
      setError("제출에 실패했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">제출 완료</CardTitle>
            <CardDescription>
              {status === "참여"
                ? "참여로 등록되었습니다."
                : "불참으로 등록되었습니다."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">참석 여부 알려주기</CardTitle>
          <CardDescription>이름과 참여 여부를 입력해주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact">연락처 (선택)</Label>
                <Input
                  id="contact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>참여 여부</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={status === "참여" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setStatus("참여")}
                  >
                    참여
                  </Button>
                  <Button
                    type="button"
                    variant={status === "불참" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => setStatus("불참")}
                  >
                    불참
                  </Button>
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "제출 중..." : "제출"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
