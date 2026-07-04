"use client";

// 월별 이벤트 생성 수 / RSVP 수 추이 막대 차트 (Recharts)
// 정적 목업 단계 - mockMonthlyStats를 그대로 시각화만 함 (실통계 로직 없음)
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MonthlyEventStat } from "@/lib/admin/types";

interface MonthlyTrendChartProps {
  data: MonthlyEventStat[];
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  return (
    // 부모 Card 폭에 맞춰 반응형으로 렌더링, 높이는 고정값
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11 }}
          className="fill-muted-foreground"
          axisLine={{ stroke: "var(--border)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11 }}
          className="fill-muted-foreground"
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--popover)",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
            fontSize: 12,
          }}
          labelStyle={{ color: "var(--popover-foreground)" }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar
          dataKey="eventCount"
          name="이벤트 생성 수"
          fill="var(--chart-1)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="rsvpCount"
          name="RSVP 수"
          fill="var(--chart-2)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
