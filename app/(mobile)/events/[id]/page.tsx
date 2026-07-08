import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Suspense } from "react";
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
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("host_id", data.claims.sub)
    .single();

  if (!event) {
    notFound();
  }

  const { data: rsvps } = await supabase
    .from("rsvps")
    .select("*")
    .eq("event_id", id);

  return <EventDashboard event={event} rsvps={rsvps ?? []} />;
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
