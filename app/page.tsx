import Link from "next/link";
import { cities, dishes, restaurants } from "@/data/mock-data";

export default function HomePage() {
  const featuredDishes = dishes.filter((dish) => dish.featured);
  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(245,158,11,0.2),transparent_40%),radial-gradient(circle_at_90%_20%,rgba(59,130,246,0.2),transparent_35%),linear-gradient(180deg,#090b12_0%,#040405_100%)]" />
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">CraveMap</p>
        <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight md:text-7xl">Discover Your City Through Its Best Dishes</h1>
        <p className="mt-6 max-w-2xl text-zinc-300">A cinematic dish-first discovery guide for iconic flavors and hidden gems across India.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {cities.map((city) => <Link key={city.slug} href={`/${city.slug}`} className="rounded-full border border-white/20 bg-white/5 px-4 py-2 backdrop-blur transition hover:border-amber-300">{city.name}</Link>)}
          <Link href="/pune/map" className="rounded-full border border-amber-300 bg-amber-300/10 px-4 py-2 text-amber-100">Open Food Map</Link>
        </div>
      </section>

      <section className="relative mx-auto grid max-w-6xl gap-5 px-6 pb-12 md:grid-cols-3">
        {featuredDishes.map((dish) => <article key={dish.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"><p className="text-xs uppercase text-amber-300">{dish.category}</p><h2 className="mt-2 text-xl">{dish.name}</h2><p className="mt-2 text-sm text-zinc-300">{dish.description}</p></article>)}
      </section>

      <section className="relative mx-auto max-w-6xl px-6 pb-20"><h3 className="mb-4 text-2xl">Featured Restaurants</h3><div className="grid gap-4 md:grid-cols-3">{restaurants.map((r)=><Link key={r.id} href={`/${r.citySlug}/restaurant/${r.slug}`} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur hover:bg-white/10"><h4>{r.name}</h4><p className="text-sm text-zinc-300">{r.cuisineType} · {r.priceCategory}</p></Link>)}</div></section>
    </main>
  );
}
