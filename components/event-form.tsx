"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { generateEventSlug } from "@/lib/events/slug";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventRow } from "@/lib/events/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

const UNIQUE_VIOLATION = "23505";

export const EVENT_CATEGORIES = [
  "스터디",
  "운동",
  "친목",
  "취미",
  "기타",
] as const;

export interface EventFormValues {
  title: string;
  eventAt: string;
  location: string;
  capacity: string;
  notice: string;
  feeInfo: string;
  category: string;
}

export type DuplicateValues = Pick<
  EventFormValues,
  "title" | "location" | "notice" | "feeInfo" | "category"
>;

function toDatetimeLocalValue(eventAt: string): string {
  const date = new Date(eventAt);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toFormValues(
  event?: EventRow,
  duplicateValues?: DuplicateValues
): EventFormValues {
  if (!event && duplicateValues) {
    return {
      title: duplicateValues.title,
      eventAt: "",
      location: duplicateValues.location,
      capacity: "",
      notice: duplicateValues.notice,
      feeInfo: duplicateValues.feeInfo,
      category: duplicateValues.category,
    };
  }

  return {
    title: event?.title ?? "",
    eventAt: event?.event_at ? toDatetimeLocalValue(event.event_at) : "",
    location: event?.location ?? "",
    capacity: event?.capacity != null ? String(event.capacity) : "",
    notice: event?.notice ?? "",
    feeInfo: event?.fee_info ?? "",
    category: event?.category ?? "",
  };
}

export function EventForm({
  initialValues,
  duplicateValues,
  className,
  ...props
}: {
  initialValues?: EventRow;
  duplicateValues?: DuplicateValues;
} & React.ComponentPropsWithoutRef<"div">) {
  const [values, setValues] = useState<EventFormValues>(
    toFormValues(initialValues, duplicateValues)
  );
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsSaving(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("로그인이 필요합니다.");
      setIsSaving(false);
      return;
    }

    const payload = {
      title: values.title,
      event_at: new Date(values.eventAt).toISOString(),
      location: values.location,
      capacity: values.capacity ? Number(values.capacity) : null,
      notice: values.notice,
      fee_info: values.feeInfo || null,
      category: values.category || null,
    };

    try {
      if (initialValues) {
        const { error } = await supabase
          .from("events")
          .update(payload)
          .eq("id", initialValues.id);
        if (error) throw error;
        router.push(`/events/${initialValues.id}`);
        return;
      }

      let slug = generateEventSlug(values.title);
      let { data, error } = await supabase
        .from("events")
        .insert({ ...payload, slug, host_id: user.id })
        .select("id")
        .single();

      if (error?.code === UNIQUE_VIOLATION) {
        slug = generateEventSlug(values.title);
        ({ data, error } = await supabase
          .from("events")
          .insert({ ...payload, slug, host_id: user.id })
          .select("id")
          .single());
      }

      if (error || !data) throw error ?? new Error("저장에 실패했습니다");
      router.push(`/events/${data.id}`);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "저장에 실패했습니다");
    } finally {
      setIsSaving(false);
    }
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
              <div className="grid gap-2">
                <Label htmlFor="category">카테고리 (선택)</Label>
                <Select
                  value={values.category}
                  onValueChange={(value) =>
                    setValues({ ...values, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
