// 관리자 콘솔 정적 목업 데이터 (Task 018/019)
// 실데이터 연동 아님 - 화면 렌더링 확인용 하드코딩 데이터
import {
  AdminEventRow,
  AdminSummaryMetric,
  AdminUserRow,
  CategoryDistribution,
  MonthlyEventStat,
} from "./types";

export const mockSummaryMetrics: AdminSummaryMetric[] = [
  {
    id: "total-events",
    label: "전체 이벤트",
    value: "128",
    change: "+12건 (지난 주 대비)",
    trend: "up",
  },
  {
    id: "active-events",
    label: "진행중 이벤트",
    value: "23",
    change: "+3건 (지난 주 대비)",
    trend: "up",
  },
  {
    id: "total-users",
    label: "전체 주최자",
    value: "342",
    change: "+18명 (지난 주 대비)",
    trend: "up",
  },
  {
    id: "total-rsvps",
    label: "누적 RSVP",
    value: "2,847",
    change: "-4% (지난 주 대비)",
    trend: "down",
  },
];

export const mockAdminEvents: AdminEventRow[] = [
  {
    id: "1",
    title: "여름 수영 모임",
    hostName: "김주최",
    status: "예정",
    attendeeCount: 8,
    capacity: 10,
    eventAt: "2026-07-20T10:00:00+09:00",
    createdAt: "2026-07-01T00:00:00+09:00",
  },
  {
    id: "2",
    title: "7월 스터디 모임",
    hostName: "이영희",
    status: "예정",
    attendeeCount: 5,
    capacity: null,
    eventAt: "2026-07-15T19:00:00+09:00",
    createdAt: "2026-06-25T00:00:00+09:00",
  },
  {
    id: "3",
    title: "친구들 모임",
    hostName: "박민수",
    status: "진행중",
    attendeeCount: 2,
    capacity: 2,
    eventAt: "2026-07-05T18:00:00+09:00",
    createdAt: "2026-07-02T00:00:00+09:00",
  },
  {
    id: "4",
    title: "6월 정기 독서모임",
    hostName: "최지우",
    status: "종료",
    attendeeCount: 12,
    capacity: 15,
    eventAt: "2026-06-10T14:00:00+09:00",
    createdAt: "2026-05-28T00:00:00+09:00",
  },
  {
    id: "5",
    title: "주말 등산 모임",
    hostName: "정하늘",
    status: "종료",
    attendeeCount: 20,
    capacity: 20,
    eventAt: "2026-06-01T08:00:00+09:00",
    createdAt: "2026-05-20T00:00:00+09:00",
  },
  {
    id: "6",
    title: "보드게임 카페 모임",
    hostName: "한소희",
    status: "예정",
    attendeeCount: 4,
    capacity: 8,
    eventAt: "2026-07-25T15:00:00+09:00",
    createdAt: "2026-07-04T00:00:00+09:00",
  },
];

export const mockAdminUsers: AdminUserRow[] = [
  {
    id: "u1",
    name: "김주최",
    email: "host.kim@example.com",
    eventCount: 6,
    joinedAt: "2026-01-15T00:00:00+09:00",
    status: "활성",
  },
  {
    id: "u2",
    name: "이영희",
    email: "younghee.lee@example.com",
    eventCount: 3,
    joinedAt: "2026-02-20T00:00:00+09:00",
    status: "활성",
  },
  {
    id: "u3",
    name: "박민수",
    email: "minsu.park@example.com",
    eventCount: 1,
    joinedAt: "2026-06-30T00:00:00+09:00",
    status: "활성",
  },
  {
    id: "u4",
    name: "최지우",
    email: "jiwoo.choi@example.com",
    eventCount: 9,
    joinedAt: "2025-11-05T00:00:00+09:00",
    status: "활성",
  },
  {
    id: "u5",
    name: "정하늘",
    email: "haneul.jung@example.com",
    eventCount: 4,
    joinedAt: "2026-03-10T00:00:00+09:00",
    status: "정지",
  },
  {
    id: "u6",
    name: "한소희",
    email: "sohee.han@example.com",
    eventCount: 2,
    joinedAt: "2026-06-01T00:00:00+09:00",
    status: "활성",
  },
];

// 통계 분석 페이지용 더미 데이터
export const mockMonthlyStats: MonthlyEventStat[] = [
  { month: "1월", eventCount: 12, rsvpCount: 84 },
  { month: "2월", eventCount: 18, rsvpCount: 120 },
  { month: "3월", eventCount: 15, rsvpCount: 96 },
  { month: "4월", eventCount: 22, rsvpCount: 168 },
  { month: "5월", eventCount: 28, rsvpCount: 210 },
  { month: "6월", eventCount: 25, rsvpCount: 194 },
  { month: "7월", eventCount: 8, rsvpCount: 52 },
];

export const mockCategoryDistribution: CategoryDistribution[] = [
  { name: "스터디", value: 34 },
  { name: "운동/스포츠", value: 28 },
  { name: "친목/모임", value: 22 },
  { name: "취미", value: 16 },
  { name: "기타", value: 8 },
];
