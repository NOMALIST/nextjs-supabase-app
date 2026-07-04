import { LoginForm } from "@/components/login-form";

// 로그인 페이지 - (mobile) 라우트 그룹 밖에 위치해 430px 제약을 받지 않음
// 일반 사용자(주최자)와 관리자가 모두 이 화면 하나로 로그인한다
export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6">
      {/* 모바일은 좁은 카드 폭, 데스크톱은 조금 더 여유 있게 반응형 확장 */}
      <div className="w-full max-w-sm lg:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
