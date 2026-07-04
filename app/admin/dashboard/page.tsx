import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockAdminEvents, mockSummaryMetrics } from "@/lib/admin/mock-data";
import { AdminEventRow } from "@/lib/admin/types";

// 이벤트 상태별 배지 색상 매핑
const statusVariant: Record<
  AdminEventRow["status"],
  "default" | "secondary" | "outline"
> = {
  예정: "outline",
  진행중: "default",
  종료: "secondary",
};

export default function AdminDashboardPage() {
  // 최근 현황 섹션에는 최신 4건만 노출
  const recentEvents = mockAdminEvents.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">대시보드</h1>
        <p className="text-muted-foreground text-sm">
          전체 서비스 핵심 지표와 최근 이벤트 현황을 확인하세요.
        </p>
      </div>

      {/* 핵심 지표 요약 카드 그리드 - 데스크톱 폭 활용을 위해 화면 크기별 컬럼 수 확장 */}
      <section
        aria-label="핵심 지표 요약"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      >
        {mockSummaryMetrics.map((metric) => {
          const isUp = metric.trend === "up";
          const isDown = metric.trend === "down";
          const TrendIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
          const trendColor = isUp
            ? "text-emerald-600 dark:text-emerald-400"
            : isDown
              ? "text-red-600 dark:text-red-400"
              : "text-muted-foreground";

          return (
            <Card key={metric.id}>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">
                  {metric.label}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-2xl font-bold tracking-tight">
                  {metric.value}
                </p>
                <p
                  className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}
                >
                  <TrendIcon className="size-3.5 shrink-0" />
                  <span className="truncate">{metric.change}</span>
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* 최근 현황 - 최신 이벤트 리스트 */}
      <section aria-label="최근 이벤트 현황">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">최근 현황</CardTitle>
            <CardDescription>최근 등록/진행 중인 이벤트입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between gap-3 border-b pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium">
                    {event.title}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    주최자 {event.hostName}
                  </span>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Badge variant={statusVariant[event.status]}>
                    {event.status}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {event.attendeeCount}
                    {event.capacity != null ? ` / ${event.capacity}` : ""}명
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
