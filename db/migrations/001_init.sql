create table if not exists cities (
  id bigserial primary key,
  name text not null,
  slug text unique not null,
  state text not null,
  country text not null default 'India',
  hero_image text,
  seo_title text,
  seo_description text,
  created_at timestamptz default now()
);
-- restaurants, signature_dishes, categories, restaurant_categories, users, payments, submissions to be expanded in production migration chain.
