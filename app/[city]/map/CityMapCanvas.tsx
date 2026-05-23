"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type { Dish, Restaurant } from "@/lib/types";

type Props = {
  city: string;
  restaurants: Restaurant[];
  dishes: Dish[];
};

export default function CityMapCanvas({ city, restaurants, dishes }: Props) {
  const [activeId, setActiveId] = useState(restaurants[0]?.id ?? 0);
  const [viewMode, setViewMode] = useState<"hotspots" | "map">("map");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [mapZoom, setMapZoom] = useState(1);
  const [failedMapIndex, setFailedMapIndex] = useState(0);
  const [category, setCategory] = useState("all");
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

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

  const mapImageUrls = useMemo(() => {
    if (!Number.isFinite(bounds.minLat) || !Number.isFinite(bounds.minLng)) return [];

    const centerLat = (bounds.minLat + bounds.maxLat) / 2;
    const centerLng = (bounds.minLng + bounds.maxLng) / 2;
    const latSpan = Math.max(bounds.maxLat - bounds.minLat, 0.02);
    const lngSpan = Math.max(bounds.maxLng - bounds.minLng, 0.02);
    const citySpan = Math.max(latSpan, lngSpan);
    const nextZoom = Math.round(Math.min(16.8, Math.max(10.4, 12.4 - Math.log2(citySpan * 95) + (mapZoom - 1) * 0.65)));

    const markerParams = filteredRestaurants
      .map((restaurant) => `markers=${restaurant.latitude.toFixed(6)},${restaurant.longitude.toFixed(6)},lightblue1`)
      .join("&");

    return [
      `https://staticmap.openstreetmap.de/staticmap.php?center=${centerLat.toFixed(6)},${centerLng.toFixed(6)}&zoom=${nextZoom}&size=1600x900&maptype=mapnik&${markerParams}`,
      `https://staticmap.openstreetmap.fr/?center=${centerLat.toFixed(6)},${centerLng.toFixed(6)}&zoom=${nextZoom}&size=1600x900&maptype=mapnik&${markerParams}`,
    ];
  }, [bounds, filteredRestaurants, mapZoom]);


  const activeMapIndex = Math.min(failedMapIndex, Math.max(0, mapImageUrls.length - 1));
  const mapImageUrl = mapImageUrls[activeMapIndex] ?? null;
  const showStreetMap = viewMode === "map" && Boolean(mapImageUrl);


  const activeRestaurant = points.find((r) => r.id === activeId) ?? points[0];
  const spotlightDishes = activeRestaurant
    ? dishes.filter((dish) => dish.restaurantSlug === activeRestaurant.slug).slice(0, 2)
    : [];

  const clampPan = (nextX: number, nextY: number, nextZoom: number) => {
    const maxOffsetX = ((nextZoom - 1) * 100) / 2;
    const maxOffsetY = ((nextZoom - 1) * 65) / 2;
    return {
      x: Math.min(maxOffsetX, Math.max(-maxOffsetX, nextX)),
      y: Math.min(maxOffsetY, Math.max(-maxOffsetY, nextY)),
    };
  };

  const updateZoom = (nextZoom: number) => {
    const clampedZoom = Math.max(1, Math.min(2.4, nextZoom));
    setZoom(clampedZoom);
    setPan((prev) => clampPan(prev.x, prev.y, clampedZoom));
  };

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
        <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-1 text-xs uppercase tracking-[0.16em]">
          <button
            onClick={() => setViewMode("map")}
            className={`rounded-full px-3 py-1 transition ${viewMode === "map" ? "bg-cyan-300/20 text-cyan-100" : "text-zinc-300"}`}
          >
            Street map
          </button>
          <button
            onClick={() => setViewMode("hotspots")}
            className={`rounded-full px-3 py-1 transition ${viewMode === "hotspots" ? "bg-amber-300/20 text-amber-100" : "text-zinc-300"}`}
          >
            Hotspot view
          </button>
        </div>

        <div className="map-shell relative overflow-hidden rounded-3xl border border-white/10 bg-[#080c19]">
          {showStreetMap ? (
            <div className="relative h-[65vh]">
              <img
                src={mapImageUrl}
                alt={`${city} street map`}
                className="h-full w-full object-cover"
                onError={() => setFailedMapIndex((idx) => Math.min(idx + 1, mapImageUrls.length))}
                onLoad={() => setFailedMapIndex((idx) => idx)}
              />
              <div className="pointer-events-none absolute inset-0">
                {points.map((r, index) => (
                  <button
                    key={r.id}
                    onMouseEnter={() => setActiveId(r.id)}
                    onFocus={() => setActiveId(r.id)}
                    aria-label={`Highlight ${r.name}`}
                    className="group pointer-events-auto absolute z-10 h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ left: `${r.x}%`, top: `${r.y}%`, animationDelay: `${index * 120}ms` }}
                  >
                    <span className={`map-ping ${activeId === r.id ? "active" : ""}`} />
                    <span className={`map-dot ${activeId === r.id ? "active" : ""}`} />
                    <span className="map-label">{r.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_5%,rgba(245,158,11,0.22),transparent_30%),radial-gradient(circle_at_85%_85%,rgba(34,211,238,0.25),transparent_40%)]" />
              <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:44px_44px]" />

              <div
                className="relative h-[65vh] overflow-hidden"
                onWheel={(event) => {
                  event.preventDefault();
                  const delta = event.deltaY > 0 ? -0.08 : 0.08;
                  updateZoom(zoom + delta);
                }}
                onPointerDown={(event) => {
                  if (zoom <= 1) return;
                  event.currentTarget.setPointerCapture(event.pointerId);
                  dragStartRef.current = {
                    x: event.clientX,
                    y: event.clientY,
                    panX: pan.x,
                    panY: pan.y,
                  };
                }}
                onPointerMove={(event) => {
                  if (!dragStartRef.current || zoom <= 1) return;
                  const nextX = dragStartRef.current.panX + (event.clientX - dragStartRef.current.x) / 8;
                  const nextY = dragStartRef.current.panY + (event.clientY - dragStartRef.current.y) / 8;
                  setPan(clampPan(nextX, nextY, zoom));
                }}
                onPointerUp={(event) => {
                  dragStartRef.current = null;
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }}
                onPointerCancel={(event) => {
                  dragStartRef.current = null;
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }}
                style={{
                  transform: `translate(${pan.x}%, ${pan.y}%) scale(${zoom})`,
                  transformOrigin: "center",
                  cursor: zoom > 1 ? "grab" : "default",
                  touchAction: "none",
                }}
              >
                {points.map((r, index) => (
                  <button
                    key={r.id}
                    onMouseEnter={() => setActiveId(r.id)}
                    onFocus={() => setActiveId(r.id)}
                    aria-label={`Highlight ${r.name}`}
                    className="group pointer-events-auto absolute z-10 h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ left: `${r.x}%`, top: `${r.y}%`, animationDelay: `${index * 120}ms` }}
                  >
                    <span className={`map-ping ${activeId === r.id ? "active" : ""}`} />
                    <span className={`map-dot ${activeId === r.id ? "active" : ""}`} />
                    <span className="map-label">{r.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-white/20 bg-black/55 px-3 py-1 text-xs text-zinc-200 backdrop-blur">Live plotted hotspots</div>
          {showStreetMap && (
            <div className="absolute bottom-4 right-4 z-10 flex gap-2">
              <button onClick={() => setMapZoom((z) => Math.min(6, z + 1))} className="rounded-full border border-white/20 bg-black/55 px-3 py-1 text-sm">+</button>
              <button onClick={() => setMapZoom((z) => Math.max(1, z - 1))} className="rounded-full border border-white/20 bg-black/55 px-3 py-1 text-sm">-</button>
            </div>
          )}
          {showStreetMap && (
            <div className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-full border border-white/20 bg-black/55 px-3 py-1 text-xs text-zinc-200">
              OpenStreetMap static tiles · hotspot overlays stay interactive
            </div>
          )}
          {viewMode === "hotspots" && (
            <div className="absolute bottom-4 right-4 z-10 flex gap-2">
              <button onClick={() => updateZoom(zoom + 0.12)} className="rounded-full border border-white/20 bg-black/55 px-3 py-1 text-sm">+</button>
              <button onClick={() => updateZoom(zoom - 0.12)} className="rounded-full border border-white/20 bg-black/55 px-3 py-1 text-sm">-</button>
            </div>
          )}
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
