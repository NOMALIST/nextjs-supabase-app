import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MonthlyTrendChart } from "@/components/admin/monthly-trend-chart";
import { CategoryPieChart } from "@/components/admin/category-pie-chart";
import {
  mockCategoryDistribution,
  mockMonthlyStats,
} from "@/lib/admin/mock-data";

export default function AdminStatsPage() {
  // 상단 요약 텍스트용 합계 - 더미 데이터 단순 합산 (실통계 로직 아님)
  const totalEvents = mockMonthlyStats.reduce(
    (sum, stat) => sum + stat.eventCount,
    0
  );
  const totalRsvps = mockMonthlyStats.reduce(
    (sum, stat) => sum + stat.rsvpCount,
    0
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">통계 분석</h1>
        <p className="text-sm text-muted-foreground">
          월별 이벤트 추이와 카테고리별 분포를 확인하세요.
        </p>
      </div>

      {/* 상단 요약 - 최근 7개월 누적 합계, 데스크톱 폭에서는 2열 유지(카드 2개) */}
      <section
        aria-label="통계 요약"
        className="grid grid-cols-2 gap-3 lg:max-w-xl"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">
              누적 이벤트 생성 수
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tracking-tight">
              {totalEvents.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">누적 RSVP 수</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold tracking-tight">
              {totalRsvps.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 차트 2종 - 좁은 화면은 세로 스택, 데스크톱 폭에서는 2열 배치 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 월별 이벤트 추이 차트 */}
        <section aria-label="월별 이벤트 추이">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">월별 이벤트 추이</CardTitle>
              <CardDescription>
                최근 7개월간 이벤트 생성 수와 RSVP 수 추이입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MonthlyTrendChart data={mockMonthlyStats} />
            </CardContent>
          </Card>
        </section>

        {/* 카테고리별 분포 차트 */}
        <section aria-label="카테고리별 분포">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">카테고리별 분포</CardTitle>
              <CardDescription>
                전체 이벤트의 카테고리별 비중입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryPieChart data={mockCategoryDistribution} />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
