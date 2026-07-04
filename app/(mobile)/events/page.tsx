import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockEvents } from "@/lib/events/mock-data";

async function EventsList() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/auth/login");
  }

  if (mockEvents.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-muted-foreground">아직 만든 이벤트가 없습니다.</p>
        <Button asChild>
          <Link href="/events/new">새 이벤트 만들기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">이벤트 목록</h1>
        <Button asChild>
          <Link href="/events/new">새 이벤트 만들기</Link>
        </Button>
      </div>
      <div className="grid gap-4">
        {mockEvents.map((event) => (
          <Link key={event.id} href={`/events/${event.id}`}>
            <Card className="hover:bg-accent h-full transition-colors">
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
                <CardDescription>{event.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {new Date(event.event_at).toLocaleString("ko-KR")}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense>
      <EventsList />
    </Suspense>
  );
}
