import { Suspense } from "react";
import { Button } from "@/components/ui/button";
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
import { createClient } from "@/lib/supabase/server";

async function AdminUsersContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select("id, username, email, created_at")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`username.ilike.%${q}%,email.ilike.%${q}%`);
  }

  const { data: users } = await query;
  const allUsers = users ?? [];

  const userIds = allUsers.map((user) => user.id);
  const { data: events } =
    userIds.length > 0
      ? await supabase.from("events").select("host_id").in("host_id", userIds)
      : { data: [] };

  const eventCountByHostId = new Map<string, number>();
  for (const event of events ?? []) {
    eventCountByHostId.set(
      event.host_id,
      (eventCountByHostId.get(event.host_id) ?? 0) + 1
    );
  }

  return (
    <>
      <form method="get" className="flex gap-2">
        <Input
          name="q"
          placeholder="이름 또는 이메일 검색"
          defaultValue={q}
          className="flex-1"
        />
        <Button type="submit">검색</Button>
      </form>

      {allUsers.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <p className="text-muted-foreground text-sm">
            조건에 맞는 회원이 없습니다.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>개최 이벤트</TableHead>
                <TableHead>가입일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarFallback>
                          {user.username.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    {eventCountByHostId.get(user.id) ?? 0}건
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString("ko-KR")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}

export default function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">사용자 관리</h1>
        <p className="text-muted-foreground text-sm">
          주최자(회원) 목록을 검색하고 개최 이벤트 수를 확인하세요.
        </p>
      </div>

      <Suspense>
        <AdminUsersContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
