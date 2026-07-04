"use client";

// 카테고리별 이벤트 분포 파이 차트 (Recharts)
// 정적 목업 단계 - mockCategoryDistribution을 그대로 시각화만 함 (실통계 로직 없음)
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CategoryDistribution } from "@/lib/admin/types";

interface CategoryPieChartProps {
  data: CategoryDistribution[];
}

// 프로젝트 CSS 변수(app/globals.css)에 정의된 차트 팔레트 - 라이트/다크 모두 대응
const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  return (
    // 부모 Card 폭에 맞춰 반응형으로 렌더링, 높이는 고정값
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="45%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.name}
              fill={CHART_COLORS[index % CHART_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--popover)",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
            fontSize: 12,
          }}
          labelStyle={{ color: "var(--popover-foreground)" }}
        />
        <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
