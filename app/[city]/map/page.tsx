import type { Metadata } from "next";
import Link from "next/link";
import { restaurants } from "@/data/mock-data";

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  return {
    title: `Food Map in ${params.city} | CraveMap`,
    description: `Explore verified restaurants and signature dishes on an interactive map in ${params.city}.`,
    alternates: { canonical: `/${params.city}/map` },
  };
}

export default function CityMapPage({ params }: { params: { city: string } }) {
  const cityRestaurants = restaurants.filter((restaurant) => restaurant.citySlug === params.city);
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const embed = token
    ? `https://api.mapbox.com/styles/v1/mapbox/dark-v11.html?title=false&zoomwheel=true&access_token=${token}#11/${cityRestaurants[0]?.latitude ?? 18.52}/${cityRestaurants[0]?.longitude ?? 73.85}`
    : null;

  return (
    <main className="min-h-screen bg-[#05060a] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="animate-in mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-300">Interactive map</p>
            <h1 className="mt-2 text-4xl font-semibold capitalize">{params.city} food map</h1>
            <p className="mt-2 text-zinc-300">Zoom, pan, and discover curated signature dishes by neighborhood.</p>
          </div>
          <Link href={`/${params.city}`} className="rounded-full border border-white/20 px-4 py-2 text-sm transition hover:border-amber-300">Back to city guide</Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="map-shell relative overflow-hidden rounded-3xl border border-white/10 bg-black/40">
            <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-white/20 bg-black/55 px-3 py-1 text-xs text-zinc-200 backdrop-blur">Cinematic Dark Mode</div>
            {embed ? (
              <iframe title={`${params.city} map`} src={embed} className="h-[65vh] w-full animate-in" loading="lazy" />
            ) : (
              <div className="flex h-[65vh] items-center justify-center p-8 text-center text-zinc-300">Add <code className="mx-1 rounded bg-white/10 px-2 py-1">NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code> to enable the live map.</div>
            )}
          </div>

          <aside className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm backdrop-blur">Filters: <span className="rounded-full bg-amber-400/20 px-2 py-1 text-amber-200">All</span> <span className="ml-2 rounded-full bg-white/10 px-2 py-1">Desserts</span> <span className="ml-2 rounded-full bg-white/10 px-2 py-1">Pizza</span></div>
            {cityRestaurants.map((r, index) => (
              <Link
                key={r.id}
                href={`/${params.city}/restaurant/${r.slug}`}
                className="animate-in block rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:-translate-y-1 hover:bg-white/10"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="flex items-start justify-between gap-2"><h2 className="text-lg">{r.name}</h2>{r.verified && <span className="rounded-full bg-emerald-400/20 px-2 py-1 text-xs text-emerald-300">Verified</span>}</div>
                <p className="mt-2 text-sm text-zinc-300">{r.cuisineType} · {r.priceCategory}</p>
                <p className="mt-1 text-xs text-zinc-400">{r.address}</p>
              </Link>
            ))}
          </aside>
        </div>
      </div>
    </main>
  );
}
