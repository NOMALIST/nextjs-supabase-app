import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EventRowActions } from "@/components/admin/event-row-actions";
import { mockAdminEvents } from "@/lib/admin/mock-data";
import { AdminEventRow } from "@/lib/admin/types";

// 이벤트 상태별 배지 색상 매핑
const statusVariant: Record<
  AdminEventRow["status"],
  "default" | "secondary" | "outline"
> = {
  예정: "outline",
  진행중: "default",
  종료: "secondary",
};

export default function AdminEventsPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">이벤트 관리</h1>
        <p className="text-sm text-muted-foreground">
          전체 이벤트 목록을 검색하고 상태별로 확인하세요.
        </p>
      </div>

      {/* 검색 + 상태 필터 - 정적 마크업, 실제 검색/필터 로직 없음 */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          placeholder="이벤트 제목 또는 주최자 검색"
          className="sm:flex-1"
        />
        {/* TODO: 상태 필터 선택 시 목록 필터링 로직 구현 필요 */}
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-32">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="upcoming">예정</SelectItem>
            <SelectItem value="ongoing">진행중</SelectItem>
            <SelectItem value="ended">종료</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 이벤트 테이블 - 좁은 화면에서는 가로 스크롤 처리 */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>주최자</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>참여인원</TableHead>
              <TableHead>일시</TableHead>
              <TableHead>생성일</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAdminEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="max-w-[160px] truncate font-medium">
                  {event.title}
                </TableCell>
                <TableCell>{event.hostName}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[event.status]}>
                    {event.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {event.attendeeCount}
                  {event.capacity != null ? ` / ${event.capacity}` : ""}
                </TableCell>
                <TableCell>
                  {new Date(event.eventAt).toLocaleDateString("ko-KR")}
                </TableCell>
                <TableCell>
                  {new Date(event.createdAt).toLocaleDateString("ko-KR")}
                </TableCell>
                <TableCell className="text-right">
                  <EventRowActions />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
