"use client";

// 이벤트 관리 테이블의 행별 관리 메뉴 (더보기 드롭다운)
// 정적 목업 - 실제 상세보기/수정/삭제 로직은 구현하지 않음
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function EventRowActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => {}}
          aria-label="이벤트 관리 메뉴 열기"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* TODO: 상세보기/수정/삭제 로직 구현 필요 */}
        <DropdownMenuItem onClick={() => {}}>상세보기</DropdownMenuItem>
        <DropdownMenuItem onClick={() => {}}>수정</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {}}
          className="text-destructive focus:text-destructive"
        >
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
