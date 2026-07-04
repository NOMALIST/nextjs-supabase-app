import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { EventForm } from "@/components/event-form";
import { mockEvents } from "@/lib/events/mock-data";

async function EditEventContent({
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

  return (
    <div className="w-full max-w-sm">
      <EventForm initialValues={event} />
    </div>
  );
}

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense>
      <EditEventContent params={params} />
    </Suspense>
  );
}
