import Link from "next/link";
import { cities, dishes, restaurants } from "@/data/mock-data";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#06070b] text-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-300">CraveMap</p>
        <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-tight">Discover Your City Through Its Best Dishes</h1>
        <p className="mt-6 max-w-2xl text-zinc-300">A premium editorial guide for signature food experiences across India.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          {cities.map((city) => <Link key={city.slug} href={`/${city.slug}`} className="rounded-full border border-white/20 px-4 py-2 hover:border-amber-300">{city.name}</Link>)}
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-12 md:grid-cols-3">
        {dishes.map((dish) => <article key={dish.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"><p className="text-xs uppercase text-amber-300">{dish.category}</p><h2 className="mt-2 text-xl">{dish.name}</h2><p className="mt-2 text-sm text-zinc-300">{dish.description}</p></article>)}
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-20"><h3 className="mb-4 text-2xl">Featured Restaurants</h3><div className="grid gap-4 md:grid-cols-3">{restaurants.map((r)=><Link key={r.id} href={`/${r.citySlug}/restaurant/${r.slug}`} className="rounded-xl border border-white/10 p-4 hover:bg-white/5"><h4>{r.name}</h4><p className="text-sm text-zinc-300">{r.cuisineType} · {r.priceCategory}</p></Link>)}</div></section>
    </main>
  );
}
