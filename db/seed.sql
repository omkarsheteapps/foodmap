-- Seed data for Hidden Plates MVP
-- Run this in Supabase SQL Editor after db/migrations/001_init.sql

-- Cities
insert into cities (name, slug, state, country, hero_image, seo_title, seo_description)
values
  ('Pune', 'pune', 'Maharashtra', 'India', 'https://images.unsplash.com/photo-1590845947670-c009801ffa74', 'Best signature dishes in Pune | Hidden Plates', 'Discover Pune''s trusted restaurants, underrated spots, signature dishes, and local food stories.'),
  ('Mumbai', 'mumbai', 'Maharashtra', 'India', 'https://images.unsplash.com/photo-1566552881560-0be862a7c445', 'Best signature dishes in Mumbai | Hidden Plates', 'Explore iconic Mumbai food experiences, underrated local plates, and mapped picks.'),
  ('Bangalore', 'bangalore', 'Karnataka', 'India', 'https://images.unsplash.com/photo-1588416499018-d00dc4063903', 'Best signature dishes in Bangalore | Hidden Plates', 'Find top cafes, pizza, bowls, underrated kitchens, and local food stories in Bangalore.')
on conflict (slug) do update set
  name = excluded.name,
  state = excluded.state,
  country = excluded.country,
  hero_image = excluded.hero_image,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description;

-- Categories
insert into categories (name, slug, icon)
values
  ('Desserts', 'desserts', '🍰'),
  ('Date Night', 'date-night', '❤️'),
  ('Fine Dining', 'fine-dining', '🍽️'),
  ('Pizza', 'pizza', '🍕'),
  ('Italian', 'italian', '🇮🇹'),
  ('Healthy', 'healthy', '🥗'),
  ('Cafes', 'cafes', '☕'),
  ('Breakfast', 'breakfast', '🥐'),
  ('Budget Eats', 'budget-eats', '💸'),
  ('Asian', 'asian', '🥢'),
  ('Burgers', 'burgers', '🍔'),
  ('Late Night', 'late-night', '🌙'),
  ('Non Veg', 'non-veg', '🍗')
on conflict (slug) do update set
  name = excluded.name,
  icon = excluded.icon;

-- Restaurants
insert into restaurants (city_id, name, slug, description, address, latitude, longitude, cuisine_type, price_category, featured, verified, timings, hero_image)
values
  ((select id from cities where slug = 'pune'), 'Le Plaisir', 'le-plaisir', 'European bistro for soulful comfort food.', 'Prabhat Road, Pune', 18.513000, 73.829000, 'European', '₹₹₹', true, true, '12 PM - 11 PM', 'https://images.unsplash.com/photo-1559339352-11d035aa65de'),
  ((select id from cities where slug = 'mumbai'), 'Queen Margherita''s', 'queen-margheritas', 'Wood-fired Neapolitan pizza studio.', 'Bandra West, Mumbai', 19.060000, 72.836000, 'Italian', '₹₹₹', true, true, '1 PM - 12 AM', 'https://images.unsplash.com/photo-1513104890138-7c749659a591'),
  ((select id from cities where slug = 'bangalore'), 'Green Theory', 'green-theory', 'Plant-forward cafe and healthy bowls.', 'Residency Road, Bangalore', 12.968000, 77.602000, 'Healthy', '₹₹', true, true, '9 AM - 10 PM', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'),
  ((select id from cities where slug = 'pune'), 'Cafe GoodLuck', 'cafe-goodluck', 'Iconic Irani cafe serving legendary bun maska and chai.', 'Fergusson College Road, Pune', 18.519500, 73.841800, 'Cafe / Irani', '₹', true, true, '7 AM - 11:30 PM', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'),
  ((select id from cities where slug = 'pune'), 'Malaka Spice', 'malaka-spice', 'Beloved Pan-Asian restaurant known for regional Southeast Asian plates.', 'Koregaon Park, Pune', 18.536200, 73.893200, 'Asian', '₹₹₹', true, true, '12 PM - 11 PM', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'),
  ((select id from cities where slug = 'pune'), 'Burger Craft', 'burger-craft', 'Juicy smashed burgers with gourmet sauces and loaded fries.', 'Aundh, Pune', 18.559000, 73.807000, 'Burgers', '₹₹', false, true, '11 AM - 1 AM', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd')
on conflict (city_id, slug) do update set
  name = excluded.name,
  description = excluded.description,
  address = excluded.address,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  cuisine_type = excluded.cuisine_type,
  price_category = excluded.price_category,
  featured = excluded.featured,
  verified = excluded.verified,
  timings = excluded.timings,
  hero_image = excluded.hero_image;

-- Signature dishes
insert into signature_dishes (restaurant_id, name, slug, description, image, category, tags, featured)
values
  ((select id from restaurants where slug = 'le-plaisir'), 'Biscoff Cheesecake', 'biscoff-cheesecake', 'Silky baked cheesecake with caramel crunch.', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad', 'desserts', array['creamy','signature'], true),
  ((select id from restaurants where slug = 'queen-margheritas'), 'Truffle Burrata Pizza', 'truffle-burrata-pizza', 'Charred crust topped with burrata and truffle oil.', 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47', 'pizza', array['wood-fired','luxury'], true),
  ((select id from restaurants where slug = 'green-theory'), 'Miso Tofu Power Bowl', 'miso-tofu-power-bowl', 'Protein-rich bowl with fermented umami dressing.', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 'healthy', array['high-protein','fresh'], true),
  ((select id from restaurants where slug = 'cafe-goodluck'), 'Bun Maska & Irani Chai', 'bun-maska-irani-chai', 'Toasted bun with creamy maska paired with strong Irani chai.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085', 'breakfast', array['heritage','budget'], true),
  ((select id from restaurants where slug = 'malaka-spice'), 'Khao Suey', 'khao-suey', 'Creamy coconut curry noodles finished with bold condiments.', 'https://images.unsplash.com/photo-1559847844-5315695dadae', 'asian', array['comfort','signature'], true),
  ((select id from restaurants where slug = 'burger-craft'), 'Smoked Jalapeño Smash Burger', 'smoked-jalapeno-smash-burger', 'Crisp-edged double smash patty with smoked jalapeño aioli.', 'https://images.unsplash.com/photo-1550317138-10000687a72b', 'burgers', array['late-night','juicy'], false)
on conflict (restaurant_id, slug) do update set
  name = excluded.name,
  description = excluded.description,
  image = excluded.image,
  category = excluded.category,
  tags = excluded.tags,
  featured = excluded.featured;

-- Restaurant/category mappings
insert into restaurant_categories (restaurant_id, category_id)
select r.id, c.id from restaurants r join categories c on c.slug = 'desserts' where r.slug = 'le-plaisir'
on conflict (restaurant_id, category_id) do nothing;
insert into restaurant_categories (restaurant_id, category_id)
select r.id, c.id from restaurants r join categories c on c.slug = 'date-night' where r.slug = 'le-plaisir'
on conflict (restaurant_id, category_id) do nothing;
insert into restaurant_categories (restaurant_id, category_id)
select r.id, c.id from restaurants r join categories c on c.slug = 'fine-dining' where r.slug = 'le-plaisir'
on conflict (restaurant_id, category_id) do nothing;

insert into restaurant_categories (restaurant_id, category_id)
select r.id, c.id from restaurants r join categories c on c.slug = 'pizza' where r.slug = 'queen-margheritas'
on conflict (restaurant_id, category_id) do nothing;
insert into restaurant_categories (restaurant_id, category_id)
select r.id, c.id from restaurants r join categories c on c.slug = 'italian' where r.slug = 'queen-margheritas'
on conflict (restaurant_id, category_id) do nothing;
insert into restaurant_categories (restaurant_id, category_id)
select r.id, c.id from restaurants r join categories c on c.slug = 'date-night' where r.slug = 'queen-margheritas'
on conflict (restaurant_id, category_id) do nothing;

insert into restaurant_categories (restaurant_id, category_id)
select r.id, c.id from restaurants r join categories c on c.slug = 'healthy' where r.slug = 'green-theory'
on conflict (restaurant_id, category_id) do nothing;
insert into restaurant_categories (restaurant_id, category_id)
select r.id, c.id from restaurants r join categories c on c.slug = 'cafes' where r.slug = 'green-theory'
on conflict (restaurant_id, category_id) do nothing;
insert into restaurant_categories (restaurant_id, category_id)
select r.id, c.id from restaurants r join categories c on c.slug = 'breakfast' where r.slug = 'green-theory'
on conflict (restaurant_id, category_id) do nothing;

insert into restaurant_categories (restaurant_id, category_id)
select r.id, c.id from restaurants r join categories c on c.slug = 'cafes' where r.slug = 'cafe-goodluck'
on conflict (restaurant_id, category_id) do nothing;
insert into restaurant_categories (restaurant_id, category_id)
select r.id, c.id from restaurants r join categories c on c.slug = 'breakfast' where r.slug = 'cafe-goodluck'
on conflict (restaurant_id, category_id) do nothing;
insert into restaurant_categories (restaurant_id, category_id)
select r.id, c.id from restaurants r join categories c on c.slug = 'budget-eats' where r.slug = 'cafe-goodluck'
on conflict (restaurant_id, category_id) do nothing;

insert into restaurant_categories (restaurant_id, category_id)
select r.id, c.id from restaurants r join categories c on c.slug = 'asian' where r.slug = 'malaka-spice'
on conflict (restaurant_id, category_id) do nothing;
insert into restaurant_categories (restaurant_id, category_id)
select r.id, c.id from restaurants r join categories c on c.slug = 'fine-dining' where r.slug = 'malaka-spice'
on conflict (restaurant_id, category_id) do nothing;
insert into restaurant_categories (restaurant_id, category_id)
select r.id, c.id from restaurants r join categories c on c.slug = 'date-night' where r.slug = 'malaka-spice'
on conflict (restaurant_id, category_id) do nothing;

insert into restaurant_categories (restaurant_id, category_id)
select r.id, c.id from restaurants r join categories c on c.slug = 'burgers' where r.slug = 'burger-craft'
on conflict (restaurant_id, category_id) do nothing;
insert into restaurant_categories (restaurant_id, category_id)
select r.id, c.id from restaurants r join categories c on c.slug = 'late-night' where r.slug = 'burger-craft'
on conflict (restaurant_id, category_id) do nothing;
insert into restaurant_categories (restaurant_id, category_id)
select r.id, c.id from restaurants r join categories c on c.slug = 'non-veg' where r.slug = 'burger-craft'
on conflict (restaurant_id, category_id) do nothing;
