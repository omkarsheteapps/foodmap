import type { Metadata } from "next";
import Link from "next/link";
import { getDishes, getRestaurants } from "@/lib/data";
import CityMapCanvas from "./CityMapCanvas";

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;

  return {
    title: `Food Map in ${city} | CraveMap`,
    description: `Explore verified restaurants and signature dishes on an interactive map in ${city}.`,
    alternates: { canonical: `/${city}/map` },
  };
}

export default async function CityMapPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const [restaurants, dishes] = await Promise.all([getRestaurants(), getDishes()]);
  const cityRestaurants = restaurants.filter((restaurant) => restaurant.citySlug === city);

  return (
    <main className="min-h-screen bg-[#05060a] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="animate-in mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-300">Interactive map</p>
            <h1 className="mt-2 text-4xl font-semibold capitalize">{city} food map</h1>
            <p className="mt-2 text-zinc-300">Animated hotspot pulses, smooth transitions, and a dish-first discovery experience.</p>
          </div>
          <Link href={`/${city}`} className="rounded-full border border-white/20 px-4 py-2 text-sm transition hover:border-amber-300">Back to city guide</Link>
        </div>
        <CityMapCanvas city={city} restaurants={cityRestaurants} dishes={dishes} />
      </div>
    </main>
  );
}
