import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MonthlyTrendChart } from "@/components/admin/monthly-trend-chart";
import { CategoryPieChart } from "@/components/admin/category-pie-chart";
import { createClient } from "@/lib/supabase/server";
import { MonthlyEventStat, CategoryDistribution } from "@/lib/admin/types";

function toMonthKey(dateString: string): string {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function toMonthLabel(monthKey: string): string {
  const [, month] = monthKey.split("-");
  return `${Number(month)}월`;
}

async function StatsContent() {
  const supabase = await createClient();

  const [{ data: events }, { data: rsvps }] = await Promise.all([
    supabase.from("events").select("created_at, category"),
    supabase.from("rsvps").select("created_at"),
  ]);

  const allEvents = events ?? [];
  const allRsvps = rsvps ?? [];

  const eventCountByMonth = new Map<string, number>();
  for (const event of allEvents) {
    const key = toMonthKey(event.created_at);
    eventCountByMonth.set(key, (eventCountByMonth.get(key) ?? 0) + 1);
  }

  const rsvpCountByMonth = new Map<string, number>();
  for (const rsvp of allRsvps) {
    const key = toMonthKey(rsvp.created_at);
    rsvpCountByMonth.set(key, (rsvpCountByMonth.get(key) ?? 0) + 1);
  }

  const monthKeys = [
    ...new Set([...eventCountByMonth.keys(), ...rsvpCountByMonth.keys()]),
  ].sort();

  const monthlyStats: MonthlyEventStat[] = monthKeys.map((key) => ({
    month: toMonthLabel(key),
    eventCount: eventCountByMonth.get(key) ?? 0,
    rsvpCount: rsvpCountByMonth.get(key) ?? 0,
  }));

  const categoryCount = new Map<string, number>();
  for (const event of allEvents) {
    if (event.category) {
      categoryCount.set(
        event.category,
        (categoryCount.get(event.category) ?? 0) + 1
      );
    }
  }

  const categoryDistribution: CategoryDistribution[] = [
    ...categoryCount.entries(),
  ].map(([name, value]) => ({ name, value }));

  const totalEvents = allEvents.length;
  const totalRsvps = allRsvps.length;

  return (
    <>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section aria-label="월별 이벤트 추이">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">월별 이벤트 추이</CardTitle>
              <CardDescription>
                이벤트 생성 수와 RSVP 수의 월별 추이입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {monthlyStats.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  집계할 데이터가 없습니다.
                </p>
              ) : (
                <MonthlyTrendChart data={monthlyStats} />
              )}
            </CardContent>
          </Card>
        </section>

        <section aria-label="카테고리별 분포">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">카테고리별 분포</CardTitle>
              <CardDescription>
                카테고리가 지정된 이벤트의 비중입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categoryDistribution.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  카테고리가 지정된 이벤트가 없습니다.
                </p>
              ) : (
                <CategoryPieChart data={categoryDistribution} />
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}

export default function AdminStatsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">통계 분석</h1>
        <p className="text-muted-foreground text-sm">
          월별 이벤트 추이와 카테고리별 분포를 확인하세요.
        </p>
      </div>

      <Suspense>
        <StatsContent />
      </Suspense>
    </div>
  );
}
