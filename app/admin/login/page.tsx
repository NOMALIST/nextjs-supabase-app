import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminLoginForm } from "@/components/admin-login-form";

async function AdminAlreadyAuthenticatedGuard() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", data.claims.sub)
    .single();

  if (profile?.is_admin) {
    redirect("/admin/dashboard");
  }

  return null;
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Suspense>
          <AdminAlreadyAuthenticatedGuard />
        </Suspense>
        <AdminLoginForm />
      </div>
    </div>
  );
}
