import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LayoutDashboard, CalendarDays, Users, BarChart3 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";

// 관리자 콘솔 공통 레이아웃 - 좌측 고정 사이드바 + 메인 콘텐츠 2단 데스크톱 레이아웃
// 이 레이아웃이 /admin/(authenticated) 하위 전체 페이지의 인증/권한 공통 관문 역할을 한다.
const adminNavItems = [
  { href: "/admin/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/events", label: "이벤트 관리", icon: CalendarDays },
  { href: "/admin/users", label: "사용자 관리", icon: Users },
  { href: "/admin/stats", label: "통계", icon: BarChart3 },
];

async function AdminAuthGuard() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", data.claims.sub)
    .single();

  if (!profile?.is_admin) {
    redirect("/admin/login");
  }

  return null;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh w-full">
      {/* 좌측 고정 사이드바 - 데스크톱 전용, 폭 제약 없이 넓은 화면 활용 */}
      <aside className="bg-muted/20 flex h-svh w-64 shrink-0 flex-col border-r">
        <div className="flex h-14 shrink-0 items-center px-4">
          <span className="text-sm font-semibold">관리자 콘솔</span>
        </div>

        <Separator />

        {/* 사이드바 내비게이션: 세로 메뉴 목록 */}
        <nav aria-label="관리자 메뉴" className="flex flex-col gap-1 p-2">
          {adminNavItems.map(({ href, label, icon: Icon }) => (
            // TODO: 현재 경로와 일치 시 활성 스타일(bg-accent 등) 적용 로직 구현 필요
            <Link
              key={href}
              href={href}
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors"
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* 메인 콘텐츠 영역 - 넓은 폭 컨테이너 */}
      <main className="flex min-w-0 flex-1 justify-center overflow-y-auto">
        <div className="w-full max-w-screen-xl flex-1 p-6 lg:p-8">
          <Suspense>
            <AdminAuthGuard />
          </Suspense>
          {children}
        </div>
      </main>
    </div>
  );
}
