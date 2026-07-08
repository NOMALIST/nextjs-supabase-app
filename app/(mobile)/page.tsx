import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

async function HomeContent() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = !!data?.claims;

  return (
    <>
      {isLoggedIn ? (
        <>
          <h1 className="text-2xl font-bold">다시 오셨네요</h1>
          <p className="text-muted-foreground">
            내가 만든 모임의 공지와 정산 현황을 확인해보세요.
          </p>
          <Button asChild>
            <Link href="/events">내 이벤트 보기</Link>
          </Button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold">
            모임 공지부터 정산까지, 링크 하나로
          </h1>
          <p className="text-muted-foreground">
            정기 모임의 공지, 참여자 관리(RSVP), 정산을 한 번에 처리하세요.
          </p>
          <Button asChild>
            <Link href="/auth/login">로그인하기</Link>
          </Button>
        </>
      )}
    </>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-5 text-center">
      <Suspense>
        <HomeContent />
      </Suspense>
    </main>
  );
}
