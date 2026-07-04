// 모바일 전용 라우트 그룹 레이아웃 - 주최자/참여자용 화면은 430px 폭으로 고정
// (mobile)은 Route Group이라 URL 경로에는 노출되지 않는다
export default function MobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px] border-x border-border">
      {children}
    </div>
  );
}
