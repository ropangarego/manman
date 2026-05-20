alter table public.profiles
add column if not exists role text not null default 'user';

do $$
begin
  alter table public.profiles
  add constraint profiles_role_check check (role in ('user', 'admin'));
exception
  when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.prevent_profile_role_self_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.role is distinct from new.role
    and auth.uid() is not null
    and not public.is_admin()
  then
    raise exception 'Only admins can change profile roles.';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_self_update on public.profiles;
create trigger profiles_prevent_role_self_update
before update on public.profiles
for each row execute function public.prevent_profile_role_self_update();

create table if not exists public.content_qa_reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid references auth.users(id) on delete set null,
  pack_id text not null,
  item_type text not null check (item_type in ('hanzi', 'word', 'sentence', 'pattern')),
  item_id text not null,
  status text not null default 'unchecked' check (status in ('unchecked', 'ok', 'needs_fix', 'rejected')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (pack_id, item_type, item_id)
);

create table if not exists public.issue_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  page text,
  pack_id text,
  item_type text,
  item_id text,
  message text,
  metadata jsonb default '{}'::jsonb,
  status text not null default 'open' check (status in ('open', 'reviewing', 'fixed', 'rejected')),
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists content_qa_reviews_set_updated_at on public.content_qa_reviews;
create trigger content_qa_reviews_set_updated_at
before update on public.content_qa_reviews
for each row execute function public.set_updated_at();

drop trigger if exists issue_reports_set_updated_at on public.issue_reports;
create trigger issue_reports_set_updated_at
before update on public.issue_reports
for each row execute function public.set_updated_at();

alter table public.content_qa_reviews enable row level security;
alter table public.issue_reports enable row level security;

drop policy if exists "admins select qa reviews" on public.content_qa_reviews;
drop policy if exists "admins insert qa reviews" on public.content_qa_reviews;
drop policy if exists "admins update qa reviews" on public.content_qa_reviews;
drop policy if exists "users insert own issue reports" on public.issue_reports;
drop policy if exists "admins select issue reports" on public.issue_reports;
drop policy if exists "admins update issue reports" on public.issue_reports;

create policy "admins select qa reviews"
on public.content_qa_reviews
for select
using (public.is_admin());

create policy "admins insert qa reviews"
on public.content_qa_reviews
for insert
with check (public.is_admin());

create policy "admins update qa reviews"
on public.content_qa_reviews
for update
using (public.is_admin())
with check (public.is_admin());

create policy "users insert own issue reports"
on public.issue_reports
for insert
with check (auth.uid() = user_id);

create policy "admins select issue reports"
on public.issue_reports
for select
using (public.is_admin());

create policy "admins update issue reports"
on public.issue_reports
for update
using (public.is_admin())
with check (public.is_admin());

grant select, insert, update on public.content_qa_reviews to authenticated;
grant select, insert, update on public.issue_reports to authenticated;

comment on column public.profiles.role is 'Internal access role. Promote admins with: update public.profiles set role = ''admin'' where email = ''MY_EMAIL_HERE''; If email is unavailable, update by id = auth user id.';
