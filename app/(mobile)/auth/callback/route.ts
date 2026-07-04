import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const errorParam =
    searchParams.get("error_description") ?? searchParams.get("error");
  let next = searchParams.get("next") ?? "/protected";
  if (!next.startsWith("/")) {
    next = "/protected";
  }

  if (errorParam) {
    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent(errorParam)}`
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // 프록시/로드밸런서 뒤에서는 origin이 실제 접속 도메인과 다를 수 있어
      // x-forwarded-host를 우선 사용한다 (Supabase 공식 예시 패턴).
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent(error.message)}`
    );
  }

  return NextResponse.redirect(
    `${origin}/auth/error?error=${encodeURIComponent("No code provided")}`
  );
}
