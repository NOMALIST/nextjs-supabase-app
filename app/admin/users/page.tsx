import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockAdminUsers } from "@/lib/admin/mock-data";

export default function AdminUsersPage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">사용자 관리</h1>
        <p className="text-sm text-muted-foreground">
          주최자(회원) 목록을 검색하고 상태를 확인하세요.
        </p>
      </div>

      {/* 검색 입력 - 정적 마크업, 실제 검색 로직 없음 */}
      <Input placeholder="이름 또는 이메일 검색" />

      {/* 사용자 테이블 - 좁은 화면에서는 가로 스크롤 처리 */}
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>개최 이벤트</TableHead>
              <TableHead>가입일</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAdminUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      {/* 이니셜 폴백만 사용 - 실제 프로필 이미지 연동 없음 */}
                      <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell>{user.eventCount}건</TableCell>
                <TableCell>
                  {new Date(user.joinedAt).toLocaleDateString("ko-KR")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.status === "활성" ? "default" : "destructive"}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
