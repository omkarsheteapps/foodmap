import type { Metadata } from "next";
import Link from "next/link";
import { cities, restaurants } from "@/data/mock-data";

export function generateStaticParams() { return cities.map((city) => ({ city: city.slug })); }

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const city = cities.find((c) => c.slug === params.city);
  return { title: city?.seoTitle, description: city?.seoDescription, alternates: { canonical: `/${params.city}` } };
}

export default function CityPage({ params }: { params: { city: string } }) {
  const cityRestaurants = restaurants.filter((r) => r.citySlug === params.city);
  return <main className="min-h-screen bg-zinc-950 p-8 text-white"><h1 className="text-4xl font-semibold capitalize">{params.city}</h1><p className="mt-2 text-zinc-300">Curated dishes, hidden gems, and verified spots.</p><div className="mt-8 grid gap-4 md:grid-cols-2">{cityRestaurants.map((r)=><Link key={r.id} href={`/${params.city}/restaurant/${r.slug}`} className="rounded-xl border border-white/10 p-4"><h2>{r.name}</h2><p className="text-sm text-zinc-300">{r.description}</p></Link>)}</div></main>;
}
