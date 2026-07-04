// Phase 2 실제 DB 타입(database.types.ts)으로 교체 예정인 화면 전용 임시 타입

export interface MockEvent {
  id: string;
  slug: string;
  title: string;
  eventAt: string;
  location: string;
  capacity: number | null;
  notice: string;
  feeInfo: string | null;
  totalCost: number | null;
  hostId: string;
  createdAt: string;
}

export interface MockRsvp {
  id: string;
  eventId: string;
  name: string;
  contact: string | null;
  status: "참여" | "불참";
  isPaid: boolean;
  createdAt: string;
}
