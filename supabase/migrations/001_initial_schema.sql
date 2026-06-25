create extension if not exists pgcrypto;

create type meal_type as enum ('breakfast', 'lunch', 'dinner');
create type dining_status as enum ('selecting', 'confirmed');

create table families (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  name text not null,
  icon text not null default '🍽️',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (family_id, name)
);

create table dishes (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  category_id uuid not null references categories(id) on delete restrict,
  name text not null,
  description text,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  is_recommended boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (family_id, name)
);

create table dining_tables (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  dining_date date not null,
  meal_type meal_type not null,
  status dining_status not null default 'selecting',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (family_id, dining_date, meal_type)
);

create table dining_table_items (
  id uuid primary key default gen_random_uuid(),
  dining_table_id uuid not null references dining_tables(id) on delete cascade,
  dish_id uuid not null references dishes(id) on delete restrict,
  sort_order integer not null default 0,
  created_by_client_id text,
  created_by_name text,
  created_at timestamptz not null default now(),
  unique (dining_table_id, dish_id)
);

create table confirmed_menus (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references families(id) on delete cascade,
  dining_table_id uuid not null references dining_tables(id) on delete cascade,
  dining_date date not null,
  meal_type meal_type not null,
  version integer not null default 1,
  confirmed_by_client_id text,
  confirmed_by_name text,
  confirmed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table confirmed_menu_items (
  id uuid primary key default gen_random_uuid(),
  confirmed_menu_id uuid not null references confirmed_menus(id) on delete cascade,
  dish_id uuid references dishes(id) on delete set null,
  dish_name_snapshot text not null,
  image_url_snapshot text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index categories_family_sort_idx on categories (family_id, sort_order);
create index dishes_family_category_sort_idx on dishes (family_id, category_id, sort_order) where is_active = true;
create index dining_tables_family_date_meal_idx on dining_tables (family_id, dining_date, meal_type);
create index dining_items_table_sort_idx on dining_table_items (dining_table_id, sort_order);
create index confirmed_menus_family_date_idx on confirmed_menus (family_id, dining_date desc, meal_type);
create index confirmed_menu_items_menu_sort_idx on confirmed_menu_items (confirmed_menu_id, sort_order);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger families_updated_at before update on families for each row execute function set_updated_at();
create trigger categories_updated_at before update on categories for each row execute function set_updated_at();
create trigger dishes_updated_at before update on dishes for each row execute function set_updated_at();
create trigger dining_tables_updated_at before update on dining_tables for each row execute function set_updated_at();
create trigger confirmed_menus_updated_at before update on confirmed_menus for each row execute function set_updated_at();

alter table families enable row level security;
alter table categories enable row level security;
alter table dishes enable row level security;
alter table dining_tables enable row level security;
alter table dining_table_items enable row level security;
alter table confirmed_menus enable row level security;
alter table confirmed_menu_items enable row level security;

create policy "dev anon read families" on families for select to anon using (true);
create policy "dev anon write families" on families for all to anon using (true) with check (true);
create policy "dev anon read categories" on categories for select to anon using (true);
create policy "dev anon write categories" on categories for all to anon using (true) with check (true);
create policy "dev anon read dishes" on dishes for select to anon using (true);
create policy "dev anon write dishes" on dishes for all to anon using (true) with check (true);
create policy "dev anon read dining_tables" on dining_tables for select to anon using (true);
create policy "dev anon write dining_tables" on dining_tables for all to anon using (true) with check (true);
create policy "dev anon read dining_table_items" on dining_table_items for select to anon using (true);
create policy "dev anon write dining_table_items" on dining_table_items for all to anon using (true) with check (true);
create policy "dev anon read confirmed_menus" on confirmed_menus for select to anon using (true);
create policy "dev anon write confirmed_menus" on confirmed_menus for all to anon using (true) with check (true);
create policy "dev anon read confirmed_menu_items" on confirmed_menu_items for select to anon using (true);
create policy "dev anon write confirmed_menu_items" on confirmed_menu_items for all to anon using (true) with check (true);

alter publication supabase_realtime add table categories;
alter publication supabase_realtime add table dishes;
alter publication supabase_realtime add table dining_tables;
alter publication supabase_realtime add table dining_table_items;
alter publication supabase_realtime add table confirmed_menus;
alter publication supabase_realtime add table confirmed_menu_items;
