import type { Metadata } from "next";
import Link from "next/link";
import { getCities, getRestaurants } from "@/lib/data";

export async function generateStaticParams() { const cities = await getCities(); return cities.map((city) => ({ city: city.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params;
  const cities = await getCities();
  const city = cities.find((c) => c.slug === citySlug);

  return { title: city?.seoTitle, description: city?.seoDescription, alternates: { canonical: `/${citySlug}` } };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const restaurants = await getRestaurants();
  const cityRestaurants = restaurants.filter((r) => r.citySlug === city);

  return <main className="min-h-screen bg-zinc-950 p-8 text-white"><h1 className="text-4xl font-semibold capitalize">{city}</h1><div className="mt-3 flex gap-3"><a href={`/${city}/map`} className="rounded-full border border-amber-300 px-4 py-2 text-sm text-amber-200">Open map</a></div><p className="mt-2 text-zinc-300">Curated dishes, hidden gems, and verified spots. Explore the live city map for dish-first discovery.</p><div className="mt-8 grid gap-4 md:grid-cols-2">{cityRestaurants.map((r)=><Link key={r.id} href={`/${city}/restaurant/${r.slug}`} className="rounded-xl border border-white/10 p-4"><h2>{r.name}</h2><p className="text-sm text-zinc-300">{r.description}</p></Link>)}</div></main>;
}
