// Phase 2: database.types.ts의 실제 DB 타입을 재사용하는 도메인 타입
import { Tables } from "@/lib/supabase/database.types";

export type EventRow = Tables<"events">;
export type RsvpRow = Tables<"rsvps">;

export type RsvpStatus = "참여" | "불참";
