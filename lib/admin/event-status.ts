export type EventStatus = "예정" | "진행중" | "종료";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function computeEventStatus(
  eventAt: string,
  now: Date = new Date()
): EventStatus {
  const eventDate = new Date(eventAt).getTime();
  const nowMs = now.getTime();

  if (nowMs < eventDate) {
    return "예정";
  }

  if (nowMs < eventDate + ONE_DAY_MS) {
    return "진행중";
  }

  return "종료";
}
