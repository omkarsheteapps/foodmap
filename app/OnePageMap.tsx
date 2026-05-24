"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import CityMapCanvas from "@/app/[city]/map/CityMapCanvas";
import { brand } from "@/lib/brand";
import { imageOrFallback } from "@/lib/images";
import type { City, Dish, Restaurant } from "@/lib/types";

const DEFAULT_CITY_SLUG = "pune";

type Props = { cities: City[]; restaurants: Restaurant[]; dishes: Dish[] };

export default function OnePageMap({ cities, restaurants, dishes }: Props) {
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY_SLUG);

  const activeCity = useMemo(() => {
    return cities.find((city) => city.slug === selectedCity) ?? cities[0];
  }, [cities, selectedCity]);

  const cityRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => restaurant.citySlug === activeCity.slug);
  }, [activeCity.slug, restaurants]);

  const cityDishStories = useMemo(() => {
    return dishes
      .map((dish) => {
        const restaurant = cityRestaurants.find((item) => item.slug === dish.restaurantSlug);
        return restaurant ? { dish, restaurant } : null;
      })
      .filter((item): item is { dish: Dish; restaurant: Restaurant } => Boolean(item))
      .sort((a, b) => Number(b.dish.featured) - Number(a.dish.featured) || a.dish.displayOrder - b.dish.displayOrder)
      .slice(0, 6);
  }, [cityRestaurants, dishes]);

  const leadStory = cityDishStories[0];

  return (
    <main className="cinematic-shell min-h-screen px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="animate-in shimmer-top mobile-edge grid min-h-[72vh] overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)]">
          <div className="flex flex-col justify-end p-6 md:p-10">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-300">{brand.name}</p>
            <h1 className="mt-3 max-w-3xl text-5xl font-semibold leading-[0.95] md:text-7xl">
              Discover cravings, not directories.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-200 md:text-lg">{brand.shortDescription}</p>

            <div className="mt-8 flex flex-col gap-2 sm:max-w-sm">
              <label htmlFor="city" className="text-sm text-zinc-300">Explore a city guide</label>
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
          </div>

          <div className="relative min-h-[420px] overflow-hidden">
            {leadStory ? (
              <Image
                src={imageOrFallback(leadStory.dish.image)}
                alt={leadStory.dish.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="dish-card-image object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            {leadStory ? (
              <Link
                href={`/${activeCity.slug}/dish/${leadStory.dish.slug}`}
                className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-black/45 p-4 backdrop-blur transition hover:border-amber-300"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Featured craving</p>
                <h2 className="mt-1 text-2xl font-semibold">{leadStory.dish.name}</h2>
                <p className="mt-1 text-sm text-zinc-200">{leadStory.restaurant.name}</p>
              </Link>
            ) : null}
          </div>
        </section>

        <section className="reveal-soft delay-2">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Dish-first discovery</p>
              <h2 className="mt-2 text-3xl font-semibold md:text-5xl">What should you eat in {activeCity.name}?</h2>
            </div>
            <Link href={`/${activeCity.slug}`} className="w-fit rounded-full border border-white/20 px-4 py-2 text-sm text-zinc-100 transition hover:border-amber-300">
              View city edit
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cityDishStories.map(({ dish, restaurant }) => (
              <Link
                key={`${restaurant.slug}-${dish.slug}`}
                href={`/${activeCity.slug}/dish/${dish.slug}`}
                className="lift-card reveal-soft overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={imageOrFallback(dish.image)}
                    alt={dish.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="dish-card-image object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-amber-300">{dish.category.replaceAll("-", " ")}</p>
                  <h3 className="mt-1 text-xl font-semibold">{dish.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-300">{dish.description}</p>
                  <p className="mt-3 text-sm text-zinc-400">{restaurant.name} - {restaurant.cuisineType}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <CityMapCanvas city={activeCity.slug} restaurants={restaurants} dishes={dishes} />
      </div>
    </main>
  );
}
