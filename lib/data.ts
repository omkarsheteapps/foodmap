import type { City, Dish, Restaurant } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function assertSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase config. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
}

async function querySupabase<T>(path: string): Promise<T[]> {
  assertSupabaseConfig();

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    headers: {
      apikey: supabaseAnonKey!,
      Authorization: `Bearer ${supabaseAnonKey!}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase query failed for ${path}: ${response.status} ${errorText}`);
  }

  return (await response.json()) as T[];
}

type RestaurantRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  address: string;
  latitude: number;
  longitude: number;
  cuisine_type: string | null;
  price_category: string | null;
  featured: boolean;
  verified: boolean;
  timings: string | null;
  hero_image: string | null;
  city: { slug: string } | null;
  restaurant_categories: Array<{ category: { slug: string } | null }>;
};

type DishRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  category: string;
  tags: string[];
  featured: boolean;
  restaurant: { slug: string } | null;
};

export async function getCities(): Promise<City[]> {
  const rows = await querySupabase<{
    id: number;
    name: string;
    slug: string;
    state: string;
    country: string;
    hero_image: string | null;
    seo_title: string | null;
    seo_description: string | null;
  }>("cities?select=id,name,slug,state,country,hero_image,seo_title,seo_description&order=id.asc");

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    state: row.state,
    country: row.country,
    heroImage: row.hero_image ?? "",
    seoTitle: row.seo_title ?? `Best dishes in ${row.name} | CraveMap`,
    seoDescription: row.seo_description ?? `Discover ${row.name}'s best signature dishes and hidden gems.`,
  }));
}

export async function getRestaurants(): Promise<Restaurant[]> {
  const rows = await querySupabase<RestaurantRow>("restaurants?select=id,name,slug,description,address,latitude,longitude,cuisine_type,price_category,featured,verified,timings,hero_image,city:cities(slug),restaurant_categories(category:categories(slug))&order=id.asc");

  return rows.map((row) => ({
    id: row.id,
    citySlug: row.city?.slug ?? "",
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    address: row.address,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    cuisineType: row.cuisine_type ?? "",
    priceCategory: row.price_category ?? "",
    featured: row.featured,
    verified: row.verified,
    timings: row.timings ?? "",
    heroImage: row.hero_image ?? "",
    categories: row.restaurant_categories.map((item) => item.category?.slug).filter((value): value is string => Boolean(value)),
  }));
}

export async function getDishes(): Promise<Dish[]> {
  const rows = await querySupabase<DishRow>("signature_dishes?select=id,name,slug,description,image,category,tags,featured,restaurant:restaurants(slug)&order=id.asc");

  return rows.map((row) => ({
    id: row.id,
    restaurantSlug: row.restaurant?.slug ?? "",
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    image: row.image ?? "",
    category: row.category,
    tags: row.tags ?? [],
    featured: row.featured,
  }));
}

export async function getAppData() {
  const [cities, restaurants, dishes] = await Promise.all([getCities(), getRestaurants(), getDishes()]);
  return { cities, restaurants, dishes };
}
