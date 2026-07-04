import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Suspense } from "react";
import { mockEvents, mockRsvps } from "@/lib/events/mock-data";
import { EventDashboard } from "@/components/event-dashboard";

async function EventDashboardContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/auth/login");
  }

  const { id } = await params;
  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    notFound();
  }

  const rsvps = mockRsvps.filter((r) => r.eventId === id);

  return <EventDashboard event={event} rsvps={rsvps} />;
}

export default function EventDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense>
      <EventDashboardContent params={params} />
    </Suspense>
  );
}
