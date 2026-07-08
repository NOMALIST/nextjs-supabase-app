import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Suspense } from "react";
import { EventForm } from "@/components/event-form";

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
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .eq("host_id", data.claims.sub)
    .single();

  if (!event) {
    notFound();
  }

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
