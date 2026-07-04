import Link from "next/link";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BarChart3,
  ShieldAlert,
} from "lucide-react";

// 관리자 콘솔 공통 레이아웃 - 헤더 + 사이드바(좁은 폭에서는 상단 가로 스크롤 탭) 골격
// 정적 UI 목업 단계: 실제 인증/권한 체크 없음 (Post-MVP)
const adminNavItems = [
  { href: "/admin/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/events", label: "이벤트 관리", icon: CalendarDays },
  { href: "/admin/users", label: "사용자 관리", icon: Users },
  { href: "/admin/stats", label: "통계", icon: BarChart3 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh w-full flex-col">
      {/* 헤더: 관리자 콘솔 타이틀 + 목업 경고 배지 */}
      <header className="flex h-14 w-full shrink-0 items-center justify-between border-b px-4">
        <span className="text-sm font-semibold">관리자 콘솔</span>
        <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          <ShieldAlert className="size-3" />
          목업
        </span>
      </header>

      {/* 사이드바 내비게이션: 430px 좁은 폭 대응을 위해 상단 가로 스크롤 탭 형태로 구성 */}
      <nav className="flex w-full shrink-0 gap-1 overflow-x-auto border-b bg-muted/40 px-2 py-2">
        {adminNavItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Icon className="size-3.5" />
            {label}
          </Link>
        ))}
      </nav>

      <main className="flex flex-1 flex-col gap-6 p-4">{children}</main>
    </div>
  );
}
