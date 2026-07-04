"use client";

import { cn } from "@/lib/utils";
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
import { Textarea } from "@/components/ui/textarea";
import { MockEvent } from "@/lib/events/types";
import { useState } from "react";

export interface EventFormValues {
  title: string;
  eventAt: string;
  location: string;
  capacity: string;
  notice: string;
  feeInfo: string;
}

function toFormValues(event?: MockEvent): EventFormValues {
  return {
    title: event?.title ?? "",
    eventAt: event?.eventAt ?? "",
    location: event?.location ?? "",
    capacity: event?.capacity != null ? String(event.capacity) : "",
    notice: event?.notice ?? "",
    feeInfo: event?.feeInfo ?? "",
  };
}

export function EventForm({
  initialValues,
  className,
  ...props
}: {
  initialValues?: MockEvent;
} & React.ComponentPropsWithoutRef<"div">) {
  const [values, setValues] = useState<EventFormValues>(
    toFormValues(initialValues)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 저장 로직은 Phase 3(Task 007)에서 연동
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {initialValues ? "이벤트 수정" : "이벤트 생성"}
          </CardTitle>
          <CardDescription>
            제목, 일시, 장소 등 이벤트 정보를 입력해주세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  required
                  value={values.title}
                  onChange={(e) =>
                    setValues({ ...values, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="eventAt">일시</Label>
                <Input
                  id="eventAt"
                  type="datetime-local"
                  required
                  value={values.eventAt}
                  onChange={(e) =>
                    setValues({ ...values, eventAt: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">장소</Label>
                <Input
                  id="location"
                  required
                  value={values.location}
                  onChange={(e) =>
                    setValues({ ...values, location: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">정원 (선택)</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  value={values.capacity}
                  onChange={(e) =>
                    setValues({ ...values, capacity: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notice">공지</Label>
                <Textarea
                  id="notice"
                  value={values.notice}
                  onChange={(e) =>
                    setValues({ ...values, notice: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="feeInfo">참가비 안내 (선택)</Label>
                <Textarea
                  id="feeInfo"
                  value={values.feeInfo}
                  onChange={(e) =>
                    setValues({ ...values, feeInfo: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                저장
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
