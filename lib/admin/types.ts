// 관리자 콘솔 도메인 타입 - lib/events/types.ts의 Tables<"..."> 재사용 패턴을 따른다.
import { Tables } from "@/lib/supabase/database.types";
import { EventStatus } from "./event-status";

export type ProfileRow = Tables<"profiles">;

// 대시보드 핵심 지표 요약 카드
export interface AdminSummaryMetric {
  id: string;
  label: string;
  value: string;
}

// 이벤트 관리 테이블 행 - events 실 컬럼 + 집계/계산 파생 필드
export interface AdminEventRow {
  id: string;
  title: string;
  hostName: string;
  status: EventStatus;
  attendeeCount: number;
  capacity: number | null;
  eventAt: string;
  createdAt: string;
}

// 사용자(주최자/회원) 관리 테이블 행 - 활성/정지 상태는 대응 DB 컬럼이 없어 제외
export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  eventCount: number;
  joinedAt: string;
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
