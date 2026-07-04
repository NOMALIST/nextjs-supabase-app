import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <nav className="flex h-16 w-full items-center justify-between border-b border-b-foreground/10 px-4 text-sm">
        <div className="flex items-center gap-5 font-semibold">
          <Link href={"/"}>Next.js Supabase Starter</Link>
          <div className="flex items-center gap-2">
            <DeployButton />
          </div>
        </div>
        {!hasEnvVars ? (
          <EnvVarWarning />
        ) : (
          <Suspense>
            <AuthButton />
          </Suspense>
        )}
      </nav>
      <div className="flex flex-1 flex-col gap-12 p-5">
        <Hero />
        <div className="flex flex-1 flex-col gap-6">
          <h2 className="mb-4 text-xl font-medium">Next steps</h2>
          {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
        </div>
      </div>

      <footer className="flex w-full flex-col items-center gap-4 border-t py-8 text-center text-xs">
        <p>
          Powered by{" "}
          <a
            href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Supabase
          </a>
        </p>
        <ThemeSwitcher />
      </footer>
    </main>
  );
}
