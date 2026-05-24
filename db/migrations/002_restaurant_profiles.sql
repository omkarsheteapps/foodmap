alter table restaurants
  add column if not exists brand_story text,
  add column if not exists phone text,
  add column if not exists website_url text,
  add column if not exists instagram_url text,
  add column if not exists reservation_url text,
  add column if not exists google_maps_url text,
  add column if not exists gallery_images text[] not null default '{}',
  add column if not exists highlights text[] not null default '{}';

alter table signature_dishes
  add column if not exists display_order integer not null default 0;

create index if not exists signature_dishes_restaurant_order_idx
  on signature_dishes (restaurant_id, featured desc, display_order asc, id asc);
