"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import CityMapCanvas from "@/app/[city]/map/CityMapCanvas";
import { cities, dishes, restaurants } from "@/data/mock-data";

const DEFAULT_CITY_SLUG = "pune";

export default function OnePageMap() {
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY_SLUG);

  const activeCity = useMemo(() => {
    return cities.find((city) => city.slug === selectedCity) ?? cities[0];
  }, [selectedCity]);

  const cityRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => restaurant.citySlug === activeCity.slug);
  }, [activeCity.slug]);

  return (
    <main className="min-h-screen bg-[#05060a] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="animate-in rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-300">CraveMap</p>
          <h1 className="mt-2 text-4xl font-semibold">One-page food map</h1>
          <p className="mt-2 text-zinc-300">Start with Pune by default, switch city from the dropdown, and open a restaurant page only when you want details.</p>

          <div className="mt-5 flex flex-col gap-2 sm:max-w-sm">
            <label htmlFor="city" className="text-sm text-zinc-300">Choose city</label>
            <select
              id="city"
              name="city"
              value={activeCity.slug}
              onChange={(event) => setSelectedCity(event.target.value)}
              className="rounded-xl border border-white/20 bg-zinc-950 px-3 py-2 text-white outline-none transition focus:border-amber-300"
            >
              {cities.map((city) => (
                <option key={city.slug} value={city.slug}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        <CityMapCanvas city={activeCity.slug} restaurants={restaurants} dishes={dishes} />

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="text-2xl font-semibold">Restaurants in {activeCity.name}</h2>
          <p className="mt-2 text-sm text-zinc-300">Use this list only when you want to jump to a restaurant detail page.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {cityRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/${activeCity.slug}/restaurant/${restaurant.slug}`}
                className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-white/30 hover:bg-white/10"
              >
                <h3 className="text-lg">{restaurant.name}</h3>
                <p className="mt-1 text-sm text-zinc-300">{restaurant.cuisineType} · {restaurant.priceCategory}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
