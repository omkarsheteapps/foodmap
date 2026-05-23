create table if not exists cities (
  id bigserial primary key,
  name text not null,
  slug text unique not null,
  state text not null,
  country text not null default 'India',
  hero_image text,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now()
);

create table if not exists restaurants (
  id bigserial primary key,
  city_id bigint not null references cities(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  address text not null,
  latitude numeric(9,6) not null,
  longitude numeric(9,6) not null,
  cuisine_type text,
  price_category text,
  featured boolean not null default false,
  verified boolean not null default false,
  timings text,
  hero_image text,
  created_at timestamptz not null default now(),
  unique(city_id, slug)
);

create table if not exists signature_dishes (
  id bigserial primary key,
  restaurant_id bigint not null references restaurants(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  image text,
  category text not null,
  tags text[] not null default '{}',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  unique(restaurant_id, slug)
);

create table if not exists categories (
  id bigserial primary key,
  name text not null,
  slug text unique not null,
  icon text,
  created_at timestamptz not null default now()
);

create table if not exists restaurant_categories (
  id bigserial primary key,
  restaurant_id bigint not null references restaurants(id) on delete cascade,
  category_id bigint not null references categories(id) on delete cascade,
  unique(restaurant_id, category_id)
);

create table if not exists users (
  id uuid primary key,
  email text unique not null,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id bigserial primary key,
  restaurant_id bigint not null references restaurants(id) on delete cascade,
  amount integer not null,
  payment_type text not null,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists submissions (
  id bigserial primary key,
  restaurant_name text not null,
  city text not null,
  owner_name text,
  email text not null,
  phone text,
  dishes text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
