import type { Metadata } from "next";
import Link from "next/link";
import { getDishes, getRestaurants } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ city: string; category: string }> }): Promise<Metadata> {
  const { city, category } = await params;
  return { title: `Best ${category} in ${city}`, description: `Curated ${category} picks in ${city}.` };
}

export default async function CategoryPage({ params }: { params: Promise<{ city: string; category: string }> }) {
  const { city, category } = await params;
  const [restaurants, dishes] = await Promise.all([getRestaurants(), getDishes()]);
  const hits = dishes.filter((d) => d.category === category).map((d) => ({ ...d, restaurant: restaurants.find((r) => r.slug === d.restaurantSlug) })).filter((d) => d.restaurant?.citySlug === city);
  return <main className="min-h-screen bg-black p-8 text-white"><h1 className="text-3xl font-semibold capitalize">Best {category} in {city}</h1><div className="mt-8 grid gap-4 md:grid-cols-2">{hits.map((dish)=><Link key={dish.id} href={`/${city}/restaurant/${dish.restaurantSlug}`} className="rounded-xl border border-white/10 p-4"><h2>{dish.name}</h2><p className="text-zinc-300">{dish.description}</p></Link>)}</div></main>;
}
