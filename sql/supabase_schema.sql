create table if not exists public.user_job_research_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  applicant_profile jsonb not null default '{}'::jsonb,
  personal_data jsonb not null default '{}'::jsonb,
  event_data jsonb not null default '{}'::jsonb,
  source_data jsonb not null default '{}'::jsonb,
  interested_companies jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_job_research_profiles enable row level security;

drop policy if exists "Users can read own job research profile" on public.user_job_research_profiles;
create policy "Users can read own job research profile"
on public.user_job_research_profiles
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own job research profile" on public.user_job_research_profiles;
create policy "Users can insert own job research profile"
on public.user_job_research_profiles
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own job research profile" on public.user_job_research_profiles;
create policy "Users can update own job research profile"
on public.user_job_research_profiles
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_job_research_profiles_updated_at on public.user_job_research_profiles;
create trigger set_user_job_research_profiles_updated_at
before update on public.user_job_research_profiles
for each row
execute function public.set_updated_at();
