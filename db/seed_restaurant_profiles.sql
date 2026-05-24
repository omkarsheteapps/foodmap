-- Enrich restaurant profile pages with dummy branding, socials, galleries, and top dishes.
-- Run after db/migrations/002_restaurant_profiles.sql.

update restaurants
set
  description = 'A warm European bistro known for polished comfort food, thoughtful desserts, and a steady loyal crowd.',
  brand_story = 'Le Plaisir is built around slow meals, precise baking, and a room that feels relaxed without losing its special-occasion energy. The profile is ideal for a restaurant that wants to highlight craft, consistency, and a few signature plates rather than a huge menu.',
  phone = '+91 98765 41001',
  website_url = 'https://example.com/le-plaisir',
  instagram_url = 'https://instagram.com/leplaisirpune',
  reservation_url = 'https://example.com/le-plaisir/reserve',
  google_maps_url = 'https://maps.google.com/?q=Le+Plaisir+Pune',
  gallery_images = array[
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80'
  ],
  highlights = array['European bistro', 'Dessert focused', 'Date night', 'Reservations recommended']
where slug = 'le-plaisir';

update restaurants
set
  description = 'Wood-fired pizza, burrata-led plates, and an easy Bandra mood for relaxed Italian nights.',
  brand_story = 'Queen Margherita''s is made for guests who care about crust, cheese, and a lively dinner table. Keep the page focused on its top pizzas and creamy starters so the restaurant brand feels memorable at a glance.',
  phone = '+91 98765 41002',
  website_url = 'https://example.com/queen-margheritas',
  instagram_url = 'https://instagram.com/queenmargheritas',
  reservation_url = 'https://example.com/queen-margheritas/book',
  google_maps_url = 'https://maps.google.com/?q=Queen+Margheritas+Mumbai',
  gallery_images = array[
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=80'
  ],
  highlights = array['Wood-fired pizza', 'Italian', 'Bandra dinners', 'Burrata specials']
where slug = 'queen-margheritas';

update restaurants
set
  description = 'A calm plant-forward cafe with bowls, smoothies, and lighter plates that still feel complete.',
  brand_story = 'Green Theory is for diners who want bright, nourishing food without making the meal feel clinical. The profile should sell freshness, calm interiors, and two or three dependable bowls instead of trying to list everything.',
  phone = '+91 98765 41003',
  website_url = 'https://example.com/green-theory',
  instagram_url = 'https://instagram.com/greentheoryblr',
  reservation_url = 'https://example.com/green-theory/reserve',
  google_maps_url = 'https://maps.google.com/?q=Green+Theory+Bangalore',
  gallery_images = array[
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80'
  ],
  highlights = array['Healthy bowls', 'Vegetarian friendly', 'Cafe', 'Lunch friendly']
where slug = 'green-theory';

update restaurants
set
  description = 'A Pune institution for bun maska, Irani chai, quick breakfasts, and old-school cafe comfort.',
  brand_story = 'Cafe GoodLuck is strongest when the page celebrates heritage and repeat rituals: chai, bun maska, kheema, and the familiar bustle of FC Road. It should feel iconic, simple, and deeply local.',
  phone = '+91 98765 41004',
  website_url = 'https://example.com/cafe-goodluck',
  instagram_url = 'https://instagram.com/cafegoodluckpune',
  reservation_url = 'https://example.com/cafe-goodluck',
  google_maps_url = 'https://maps.google.com/?q=Cafe+GoodLuck+Pune',
  gallery_images = array[
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80'
  ],
  highlights = array['Irani cafe', 'Breakfast', 'Budget friendly', 'Pune classic']
where slug = 'cafe-goodluck';

update restaurants
set
  description = 'A colorful Pan-Asian favourite for Khao Suey, curries, grills, and group dinners in Koregaon Park.',
  brand_story = 'Malaka Spice should be positioned around generous plates, bright flavours, and the comfort of a trusted city favourite. Keep the restaurant story energetic and let the top dishes carry the memory.',
  phone = '+91 98765 41005',
  website_url = 'https://example.com/malaka-spice',
  instagram_url = 'https://instagram.com/malakaspice',
  reservation_url = 'https://example.com/malaka-spice/reserve',
  google_maps_url = 'https://maps.google.com/?q=Malaka+Spice+Pune',
  gallery_images = array[
    'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1548940740-204726a19be3?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80'
  ],
  highlights = array['Pan-Asian', 'Group dinners', 'Koregaon Park', 'Signature curries']
where slug = 'malaka-spice';

update restaurants
set
  description = 'A casual burger stop built around smashed patties, bold sauces, loaded fries, and late-night cravings.',
  brand_story = 'Burger Craft should feel direct and appetite-led: crisp-edged patties, a small set of signature burgers, and easy ordering. The page gives the brand enough polish without making it feel too formal.',
  phone = '+91 98765 41006',
  website_url = 'https://example.com/burger-craft',
  instagram_url = 'https://instagram.com/burgercraftpune',
  reservation_url = 'https://example.com/burger-craft/order',
  google_maps_url = 'https://maps.google.com/?q=Burger+Craft+Pune',
  gallery_images = array[
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80'
  ],
  highlights = array['Smashed burgers', 'Late night', 'Loaded fries', 'Casual']
where slug = 'burger-craft';

insert into signature_dishes (restaurant_id, name, slug, description, image, category, tags, featured, display_order)
values
  ((select id from restaurants where slug = 'le-plaisir'), 'Biscoff Cheesecake', 'biscoff-cheesecake', 'Silky baked cheesecake with a caramel biscuit crust and a clean, rich finish.', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80', 'desserts', array['famous-for','dessert','signature'], true, 1),
  ((select id from restaurants where slug = 'le-plaisir'), 'Herbed Roast Chicken', 'herbed-roast-chicken', 'Golden roast chicken with pan jus, herbs, and bistro-style sides.', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=80', 'fine-dining', array['comfort','main-course'], true, 2),
  ((select id from restaurants where slug = 'le-plaisir'), 'Mushroom Stroganoff', 'mushroom-stroganoff', 'Creamy mushrooms, buttered rice, and a deeply savoury European-style sauce.', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=900&q=80', 'fine-dining', array['vegetarian','comfort'], true, 3),

  ((select id from restaurants where slug = 'queen-margheritas'), 'Truffle Burrata Pizza', 'truffle-burrata-pizza', 'Wood-fired crust topped with burrata, truffle oil, basil, and blistered edges.', 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=900&q=80', 'pizza', array['famous-for','wood-fired','signature'], true, 1),
  ((select id from restaurants where slug = 'queen-margheritas'), 'Classic Margherita', 'classic-margherita', 'Tomato, basil, mozzarella, olive oil, and a properly charred Neapolitan-style base.', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80', 'pizza', array['classic','italian'], true, 2),
  ((select id from restaurants where slug = 'queen-margheritas'), 'Burrata Caprese', 'burrata-caprese', 'Soft burrata with tomatoes, basil oil, and a simple Italian finish.', 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=900&q=80', 'italian', array['starter','burrata'], true, 3),

  ((select id from restaurants where slug = 'green-theory'), 'Miso Tofu Power Bowl', 'miso-tofu-power-bowl', 'Tofu, greens, grains, pickles, and a fermented miso dressing with real depth.', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80', 'healthy', array['famous-for','high-protein','fresh'], true, 1),
  ((select id from restaurants where slug = 'green-theory'), 'Avocado Millet Bowl', 'avocado-millet-bowl', 'Millets, avocado, crunchy vegetables, seeds, and a bright citrus dressing.', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=80', 'healthy', array['vegetarian','lunch'], true, 2),
  ((select id from restaurants where slug = 'green-theory'), 'Berry Smoothie Bowl', 'berry-smoothie-bowl', 'Cold berry smoothie base with granola, fruit, and nut butter.', 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&w=900&q=80', 'breakfast', array['breakfast','fresh'], true, 3),

  ((select id from restaurants where slug = 'cafe-goodluck'), 'Bun Maska and Irani Chai', 'bun-maska-irani-chai', 'Toasted bun with creamy maska paired with strong Irani chai.', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80', 'breakfast', array['famous-for','heritage','budget'], true, 1),
  ((select id from restaurants where slug = 'cafe-goodluck'), 'Cheese Omelette', 'cheese-omelette', 'A quick, comforting cafe omelette with soft cheese and toast.', 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=80', 'breakfast', array['classic','breakfast'], true, 2),
  ((select id from restaurants where slug = 'cafe-goodluck'), 'Kheema Pav', 'kheema-pav', 'Spiced minced meat served with soft pav for a proper old-school cafe meal.', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=80', 'non-veg', array['heritage','local'], true, 3),

  ((select id from restaurants where slug = 'malaka-spice'), 'Khao Suey', 'khao-suey', 'Creamy coconut curry noodles finished with crunchy, spicy, and citrusy condiments.', 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80', 'asian', array['famous-for','comfort','signature'], true, 1),
  ((select id from restaurants where slug = 'malaka-spice'), 'Thai Green Curry', 'thai-green-curry', 'Aromatic green curry with vegetables, herbs, coconut milk, and rice.', 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=900&q=80', 'asian', array['curry','comfort'], true, 2),
  ((select id from restaurants where slug = 'malaka-spice'), 'Chicken Satay', 'chicken-satay', 'Grilled skewers with peanut sauce and a bright, smoky finish.', 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?auto=format&fit=crop&w=900&q=80', 'asian', array['starter','grill'], true, 3),

  ((select id from restaurants where slug = 'burger-craft'), 'Smoked Jalapeno Smash Burger', 'smoked-jalapeno-smash-burger', 'Crisp-edged double smash patty with smoked jalapeno aioli and melted cheese.', 'https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=900&q=80', 'burgers', array['famous-for','late-night','juicy'], true, 1),
  ((select id from restaurants where slug = 'burger-craft'), 'Classic Cheese Smash', 'classic-cheese-smash', 'A simple double cheeseburger with pickles, sauce, and a soft bun.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80', 'burgers', array['classic','cheese'], true, 2),
  ((select id from restaurants where slug = 'burger-craft'), 'Loaded Masala Fries', 'loaded-masala-fries', 'Crisp fries loaded with house sauce, cheese, and a spicy masala dusting.', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80', 'late-night', array['sides','late-night'], true, 3)
on conflict (restaurant_id, slug) do update set
  name = excluded.name,
  description = excluded.description,
  image = excluded.image,
  category = excluded.category,
  tags = excluded.tags,
  featured = excluded.featured,
  display_order = excluded.display_order;
