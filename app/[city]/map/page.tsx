import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, brand, titleCaseSlug } from "@/lib/brand";
import { getDishes, getRestaurants } from "@/lib/data";
import CityMapCanvas from "./CityMapCanvas";

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const cityName = titleCaseSlug(city);
  const description = `Use the ${brand.name} food map to explore verified restaurants, signature dishes, and local dining clusters in ${cityName}.`;

  return {
    title: `${cityName} Food Map`,
    description,
    alternates: { canonical: absoluteUrl(`/${city}/map`) },
    openGraph: {
      title: `${cityName} Food Map`,
      description,
      url: absoluteUrl(`/${city}/map`),
      siteName: brand.name,
      type: "website",
    },
  };
}

export default async function CityMapPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const [restaurants, dishes] = await Promise.all([getRestaurants(), getDishes()]);
  const cityRestaurants = restaurants.filter((restaurant) => restaurant.citySlug === city);

  return (
    <main className="min-h-screen bg-[#05060a] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="animate-in shimmer-top mb-6 flex items-end justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-300">{brand.name} Map</p>
            <h1 className="mt-2 text-4xl font-semibold">{titleCaseSlug(city)} food map</h1>
            <p className="mt-2 text-zinc-300">Explore verified restaurants and signature dishes by neighborhood, category, and location.</p>
          </div>
          <Link href={`/${city}`} className="rounded-full border border-white/20 px-4 py-2 text-sm transition hover:border-amber-300">Back to city guide</Link>
        </div>
        <CityMapCanvas city={city} restaurants={cityRestaurants} dishes={dishes} />
      </div>
    </main>
  );
}
