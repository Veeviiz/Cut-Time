alter table public.videos
  add column if not exists rate numeric;

update public.videos
set rate = 20
where rate is null;

alter table public.videos
  alter column rate set default 20,
  alter column rate set not null;