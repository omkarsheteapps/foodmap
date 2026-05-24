"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { titleCaseSlug } from "@/lib/brand";
import type { Dish, Restaurant } from "@/lib/types";

type Props = {
  city: string;
  restaurants: Restaurant[];
  dishes: Dish[];
};

type Bounds = {
  west: number;
  south: number;
  east: number;
  north: number;
};

export default function CityMapCanvas({ city, restaurants, dishes }: Props) {
  const [category, setCategory] = useState("all");

  // null means: show all restaurants
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const cityRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => restaurant.citySlug === city);
  }, [city, restaurants]);

  const categoryOptions = useMemo(() => {
    return ["all", ...new Set(cityRestaurants.flatMap((r) => r.categories))];
  }, [cityRestaurants]);

  const filteredRestaurants = useMemo(() => {
    if (category === "all") return cityRestaurants;

    return cityRestaurants.filter((restaurant) =>
      restaurant.categories.includes(category),
    );
  }, [category, cityRestaurants]);

  const selectedRestaurant =
    filteredRestaurants.find(
      (restaurant) => restaurant.slug === selectedSlug,
    ) ?? null;

  const overviewBounds = useMemo<Bounds>(() => {
    if (!filteredRestaurants.length) {
      return {
        west: 73.8,
        south: 18.48,
        east: 73.92,
        north: 18.58,
      };
    }

    const latitudes = filteredRestaurants.map((r) => Number(r.latitude));
    const longitudes = filteredRestaurants.map((r) => Number(r.longitude));

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const latPadding = Math.max((maxLat - minLat) * 0.35, 0.015);
    const lngPadding = Math.max((maxLng - minLng) * 0.35, 0.015);

    return {
      west: minLng - lngPadding,
      south: minLat - latPadding,
      east: maxLng + lngPadding,
      north: maxLat + latPadding,
    };
  }, [filteredRestaurants]);

  const mapEmbedUrl = useMemo(() => {
    if (selectedRestaurant) {
      const latitude = Number(selectedRestaurant.latitude);
      const longitude = Number(selectedRestaurant.longitude);

      const west = (longitude - 0.015).toFixed(6);
      const south = (latitude - 0.012).toFixed(6);
      const east = (longitude + 0.015).toFixed(6);
      const north = (latitude + 0.012).toFixed(6);

      return `https://www.openstreetmap.org/export/embed.html?bbox=${west}%2C${south}%2C${east}%2C${north}&layer=mapnik&marker=${latitude.toFixed(
        6,
      )}%2C${longitude.toFixed(6)}`;
    }

    return `https://www.openstreetmap.org/export/embed.html?bbox=${overviewBounds.west.toFixed(
      6,
    )}%2C${overviewBounds.south.toFixed(6)}%2C${overviewBounds.east.toFixed(
      6,
    )}%2C${overviewBounds.north.toFixed(6)}&layer=mapnik`;
  }, [selectedRestaurant, overviewBounds]);

  const spotlightDishes = selectedRestaurant
    ? dishes
        .filter((dish) => dish.restaurantSlug === selectedRestaurant.slug)
        .slice(0, 2)
    : [];

  const getPointPosition = (restaurant: Restaurant) => {
    const latitude = Number(restaurant.latitude);
    const longitude = Number(restaurant.longitude);

    const left =
      ((longitude - overviewBounds.west) /
        (overviewBounds.east - overviewBounds.west)) *
      100;

    const top =
      ((overviewBounds.north - latitude) /
        (overviewBounds.north - overviewBounds.south)) *
      100;

    return {
      left: `${left}%`,
      top: `${top}%`,
    };
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setCategory(option);
                setSelectedSlug(null);
              }}
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

        <div className="map-shell reveal-soft relative h-[65vh] overflow-hidden rounded-3xl border border-white/10 bg-[#080c19]">
          {mapEmbedUrl ? (
            <iframe
              key={
                selectedRestaurant
                  ? `selected-${selectedRestaurant.slug}`
                  : `overview-${category}-${filteredRestaurants.length}`
              }
              title={
                selectedRestaurant
                  ? `${selectedRestaurant.name} map`
                  : `${city} restaurants map`
              }
              src={mapEmbedUrl}
              className={`h-full w-full border-0 ${
                selectedRestaurant ? "" : "pointer-events-none"
              }`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-400">
              No restaurant coordinates found.
            </div>
          )}

          {!selectedRestaurant &&
            filteredRestaurants.map((restaurant) => (
              <button
                key={restaurant.slug}
                type="button"
                onClick={() => setSelectedSlug(restaurant.slug)}
                className="group absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={getPointPosition(restaurant)}
                title={restaurant.name}
              >
                <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-200 bg-amber-400 shadow-[0_0_0_8px_rgba(251,191,36,0.25)] transition group-hover:scale-125" />

                <span className="absolute left-1/2 top-[-36px] hidden -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-black/75 px-3 py-1 text-xs text-white backdrop-blur group-hover:block">
                  {restaurant.name}
                </span>
              </button>
            ))}

          <div className="pointer-events-none absolute left-4 top-4 z-30 rounded-full border border-white/20 bg-black/55 px-3 py-1 text-xs text-zinc-200 backdrop-blur">
            {selectedRestaurant
              ? "Selected restaurant marker"
              : "Showing all restaurant points"}
          </div>

          {selectedRestaurant && (
            <button
              type="button"
              onClick={() => setSelectedSlug(null)}
              className="absolute right-4 top-4 z-30 rounded-full border border-white/20 bg-black/70 px-3 py-1 text-xs uppercase tracking-[0.12em] text-white backdrop-blur hover:border-amber-300"
            >
              Show all
            </button>
          )}
        </div>
      </div>

      <aside className="relative z-50 space-y-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm backdrop-blur">
          {titleCaseSlug(city)} mapped restaurants:{" "}
          <span className="rounded-full bg-amber-400/20 px-2 py-1 text-amber-200">
            {filteredRestaurants.length}
          </span>
        </div>

        {selectedRestaurant ? (
          <div className="reveal-soft rounded-2xl border border-cyan-300/35 bg-cyan-300/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">
              Selected restaurant
            </p>

            <h3 className="mt-1 text-xl font-semibold">
              {selectedRestaurant.name}
            </h3>

            <p className="mt-1 text-sm text-zinc-200">
              {selectedRestaurant.cuisineType} - {selectedRestaurant.timings}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {spotlightDishes.map((dish) => (
                <span
                  key={dish.id}
                  className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs text-zinc-100"
                >
                  {dish.name}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setSelectedSlug(null)}
              className="mt-4 rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.12em] text-zinc-200 hover:border-amber-300"
            >
              Clear selection
            </button>
          </div>
        ) : (
          <div className="reveal-soft rounded-2xl border border-amber-300/25 bg-amber-300/10 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-amber-200">
              Overview mode
            </p>
            <h3 className="mt-1 text-xl font-semibold">
              City guide overview
            </h3>
            <p className="mt-1 text-sm text-zinc-300">
              Select a point or use Show on map to focus one restaurant.
            </p>
          </div>
        )}

        {filteredRestaurants.map((restaurant) => {
          const isActive = selectedRestaurant?.slug === restaurant.slug;

          return (
            <div
              key={restaurant.slug}
              className={`lift-card reveal-soft rounded-2xl border p-4 transition ${
                isActive
                  ? "border-amber-300/60 bg-amber-300/10"
                  : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10"
              }`}
            >
              <button
                type="button"
                onClick={() => setSelectedSlug(restaurant.slug)}
                className="block w-full text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg">{restaurant.name}</h2>

                  {restaurant.verified && (
                    <span className="rounded-full bg-emerald-400/20 px-2 py-1 text-xs text-emerald-300">
                      Verified
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm text-zinc-300">
                  {restaurant.cuisineType} - {restaurant.priceCategory}
                </p>

                <p className="mt-1 text-xs text-zinc-400">
                  {restaurant.address}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  {restaurant.latitude}, {restaurant.longitude}
                </p>
              </button>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSlug(restaurant.slug)}
                  className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.12em] ${
                    isActive
                      ? "border-amber-300/70 bg-amber-300/20 text-amber-100"
                      : "border-white/25 text-zinc-200 hover:border-white/40"
                  }`}
                >
                  Show on map
                </button>

                <Link
                  href={`/${city}/restaurant/${restaurant.slug}`}
                  className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.12em] text-zinc-200 hover:border-white/40"
                >
                  Open
                </Link>
              </div>
            </div>
          );
        })}
      </aside>
    </div>
  );
}
