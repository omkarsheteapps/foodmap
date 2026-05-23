"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Dish, Restaurant } from "@/lib/types";

type Props = {
  city: string;
  restaurants: Restaurant[];
  dishes: Dish[];
};

export default function CityMapCanvas({ city, restaurants, dishes }: Props) {
  const [activeId, setActiveId] = useState(restaurants[0]?.id ?? 0);

  const [category, setCategory] = useState("all");

  const categoryOptions = useMemo(
    () => ["all", ...new Set(restaurants.flatMap((r) => r.categories))],
    [restaurants],
  );

  const filteredRestaurants = useMemo(
    () =>
      category === "all"
        ? restaurants
        : restaurants.filter((restaurant) => restaurant.categories.includes(category)),
    [category, restaurants],
  );

  const bounds = useMemo(() => {
    const lats = filteredRestaurants.map((r) => r.latitude);
    const lngs = filteredRestaurants.map((r) => r.longitude);
    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };
  }, [filteredRestaurants]);

  const points = useMemo(() => {
    const MAP_PADDING = 8;
    const usableArea = 100 - MAP_PADDING * 2;

    return filteredRestaurants.map((r) => {
      const normalizedX = (r.longitude - bounds.minLng) / Math.max(bounds.maxLng - bounds.minLng, 0.001);
      const normalizedY = 1 - (r.latitude - bounds.minLat) / Math.max(bounds.maxLat - bounds.minLat, 0.001);

      return {
        ...r,
        x: MAP_PADDING + normalizedX * usableArea,
        y: MAP_PADDING + normalizedY * usableArea,
      };
    });
  }, [bounds, filteredRestaurants]);

  const mapEmbedUrl = useMemo(() => {
    if (!Number.isFinite(bounds.minLat) || !Number.isFinite(bounds.minLng) || filteredRestaurants.length === 0) return null;

    const latPad = Math.max((bounds.maxLat - bounds.minLat) * 0.22, 0.015);
    const lngPad = Math.max((bounds.maxLng - bounds.minLng) * 0.22, 0.015);
    const west = (bounds.minLng - lngPad).toFixed(6);
    const south = (bounds.minLat - latPad).toFixed(6);
    const east = (bounds.maxLng + lngPad).toFixed(6);
    const north = (bounds.maxLat + latPad).toFixed(6);
    const focus = filteredRestaurants[0];

    return `https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik&marker=${focus.latitude.toFixed(6)}%2C${focus.longitude.toFixed(6)}`;
  }, [bounds, filteredRestaurants]);

  const showStreetMap = Boolean(mapEmbedUrl);

  const activeRestaurant = points.find((r) => r.id === activeId) ?? points[0];
  const spotlightDishes = activeRestaurant
    ? dishes.filter((dish) => dish.restaurantSlug === activeRestaurant.slug).slice(0, 2)
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((option) => (
            <button
              key={option}
              onClick={() => setCategory(option)}
              className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.16em] transition ${
                category === option
                  ? "border-amber-300/70 bg-amber-300/10 text-amber-200"
                  : "border-white/15 bg-white/5 text-zinc-300 hover:border-white/30"
              }`}
            >
              {option.replaceAll("-", " ")}
            </button>
          ))}
        </div>

        <div className="map-shell relative overflow-hidden rounded-3xl border border-white/10 bg-[#080c19]">
          <div className="relative h-[65vh]">
            <iframe
              title={`${city} street map`}
              src={mapEmbedUrl ?? undefined}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {showStreetMap && (
              <div className="pointer-events-none absolute inset-0">
                {points.map((r) => (
                  <button
                    key={r.id}
                    onMouseEnter={() => setActiveId(r.id)}
                    onFocus={() => setActiveId(r.id)}
                    aria-label={`Highlight ${r.name}`}
                    className="group pointer-events-auto absolute z-10 -translate-x-1/2 -translate-y-full cursor-pointer"
                    style={{ left: `${r.x}%`, top: `${r.y}%` }}
                  >
                    <span className="relative block h-9 w-7">
                      <span className={`absolute left-1/2 top-[2px] h-5 w-5 -translate-x-1/2 rounded-full border ${activeId === r.id ? "border-amber-200 bg-amber-400" : "border-red-200 bg-red-500"}`} />
                      <span className={`absolute bottom-0 left-1/2 h-0 w-0 -translate-x-1/2 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent ${activeId === r.id ? "border-t-amber-400" : "border-t-red-500"}`} />
                    </span>
                    <span className="map-label">{r.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-white/20 bg-black/55 px-3 py-1 text-xs text-zinc-200 backdrop-blur">Live plotted restaurant pins</div>
        </div>
      </div>

      <aside className="space-y-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm backdrop-blur">{city} plotted restaurants: <span className="rounded-full bg-amber-400/20 px-2 py-1 text-amber-200">{filteredRestaurants.length}</span></div>

        {activeRestaurant && (
          <div className="animate-in rounded-2xl border border-cyan-300/35 bg-cyan-300/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Hover spotlight</p>
            <h3 className="mt-1 text-xl font-semibold">{activeRestaurant.name}</h3>
            <p className="mt-1 text-sm text-zinc-200">{activeRestaurant.cuisineType} · {activeRestaurant.timings}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {spotlightDishes.map((dish) => (
                <span key={dish.id} className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs text-zinc-100">{dish.name}</span>
              ))}
            </div>
          </div>
        )}

        {points.map((r, index) => (
          <Link key={r.id} href={`/${city}/restaurant/${r.slug}`} onMouseEnter={() => setActiveId(r.id)} className={`animate-in block rounded-2xl border p-4 transition hover:-translate-y-1 ${activeId === r.id ? "border-amber-300/60 bg-amber-300/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`} style={{ animationDelay: `${index * 120}ms` }}>
            <div className="flex items-start justify-between gap-2"><h2 className="text-lg">{r.name}</h2>{r.verified && <span className="rounded-full bg-emerald-400/20 px-2 py-1 text-xs text-emerald-300">Verified</span>}</div>
            <p className="mt-2 text-sm text-zinc-300">{r.cuisineType} · {r.priceCategory}</p>
            <p className="mt-1 text-xs text-zinc-400">{r.address}</p>
          </Link>
        ))}
      </aside>
    </div>
  );
}
