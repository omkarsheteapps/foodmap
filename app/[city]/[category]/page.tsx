import type { Metadata } from "next";
import Link from "next/link";
import { dishes, restaurants } from "@/data/mock-data";

export function generateMetadata({ params }: { params: { city: string; category: string } }): Metadata {
  return { title: `Best ${params.category} in ${params.city}`, description: `Curated ${params.category} picks in ${params.city}.` };
}

export default function CategoryPage({ params }: { params: { city: string; category: string } }) {
  const hits = dishes.filter((d) => d.category === params.category).map((d) => ({ ...d, restaurant: restaurants.find((r) => r.slug === d.restaurantSlug) })).filter((d) => d.restaurant?.citySlug === params.city);
  return <main className="min-h-screen bg-black p-8 text-white"><h1 className="text-3xl font-semibold capitalize">Best {params.category} in {params.city}</h1><div className="mt-8 grid gap-4 md:grid-cols-2">{hits.map((dish)=><Link key={dish.id} href={`/${params.city}/restaurant/${dish.restaurantSlug}`} className="rounded-xl border border-white/10 p-4"><h2>{dish.name}</h2><p className="text-zinc-300">{dish.description}</p></Link>)}</div></main>;
}
