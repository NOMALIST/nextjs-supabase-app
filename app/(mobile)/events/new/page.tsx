import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { EventForm, type DuplicateValues } from "@/components/event-form";

async function NewEventContent({
  searchParams,
}: {
  searchParams: Promise<{ duplicateFrom?: string }>;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/auth/login");
  }

  const { duplicateFrom } = await searchParams;
  let duplicateValues: DuplicateValues | undefined;

  if (duplicateFrom) {
    const { data: source } = await supabase
      .from("events")
      .select("title, location, notice, fee_info, category")
      .eq("id", duplicateFrom)
      .eq("host_id", data.claims.sub)
      .single();

    if (source) {
      duplicateValues = {
        title: source.title,
        location: source.location,
        notice: source.notice,
        feeInfo: source.fee_info ?? "",
        category: source.category ?? "",
      };
    }
  }

  return (
    <div className="w-full max-w-sm">
      <EventForm duplicateValues={duplicateValues} />
    </div>
  );
}

export default function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ duplicateFrom?: string }>;
}) {
  return (
    <Suspense>
      <NewEventContent searchParams={searchParams} />
    </Suspense>
  );
}
