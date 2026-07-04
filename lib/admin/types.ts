// 관리자 콘솔 전용 UI 타입 정의 (Task 018/019)
// 정적 목업 단계 - 실제 DB 스키마와 무관한 화면 전용 타입

// 대시보드 핵심 지표 요약 카드
export interface AdminSummaryMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
}

// 이벤트 관리 테이블 행
export interface AdminEventRow {
  id: string;
  title: string;
  hostName: string;
  status: "예정" | "진행중" | "종료";
  attendeeCount: number;
  capacity: number | null;
  eventAt: string;
  createdAt: string;
}

// 사용자(주최자/회원) 관리 테이블 행
export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  eventCount: number;
  joinedAt: string;
  status: "활성" | "정지";
}

// 통계 분석 - 월별 이벤트 생성 추이 (막대/선 차트용)
export interface MonthlyEventStat {
  month: string;
  eventCount: number;
  rsvpCount: number;
}

// 통계 분석 - 카테고리별 분포 (파이 차트용)
export interface CategoryDistribution {
  name: string;
  value: number;
}
