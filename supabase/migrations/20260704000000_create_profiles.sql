-- profiles 테이블: auth.users를 확장하는 공개 프로필 정보
create table public.profiles (
  id uuid not null primary key references auth.users(id) on delete cascade,
  email text not null,
  username text not null unique,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- 모든 인증된 사용자가 모든 프로필을 열람 가능 (공개 프로필 패턴)
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

-- 본인 프로필만 수정 가능
create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- INSERT/DELETE는 일반 사용자에게 허용하지 않음 (트리거를 통해서만 생성됨) -> 정책 미생성 시 기본적으로 차단됨

-- updated_at 자동 갱신 트리거
create function public.handle_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_profiles_updated
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- auth.users에 신규 사용자가 생기면 profiles를 자동 생성하는 트리거
-- security definer로 RLS를 우회해 INSERT할 수 있도록 함
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, username)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 8))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- PostgREST(anon/authenticated 롤)를 통해 두 함수가 RPC로 직접 호출되지 않도록 차단 (트리거 전용 함수)
-- PUBLIC 롤에서도 명시적으로 revoke해야 anon/authenticated의 상속된 기본 권한이 제거됨
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.handle_updated_at() from public, anon, authenticated;
