"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Restaurant } from "@/lib/types";

type Props = {
  city: string;
  restaurants: Restaurant[];
};

export default function CityMapCanvas({ city, restaurants }: Props) {
  const [activeId, setActiveId] = useState(restaurants[0]?.id ?? "");
  const [zoom, setZoom] = useState(1);

  const bounds = useMemo(() => {
    const lats = restaurants.map((r) => r.latitude);
    const lngs = restaurants.map((r) => r.longitude);
    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };
  }, [restaurants]);

  const points = useMemo(() => restaurants.map((r) => {
    const x = ((r.longitude - bounds.minLng) / Math.max(bounds.maxLng - bounds.minLng, 0.001)) * 100;
    const y = (1 - (r.latitude - bounds.minLat) / Math.max(bounds.maxLat - bounds.minLat, 0.001)) * 100;
    return { ...r, x, y };
  }), [bounds, restaurants]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="map-shell relative overflow-hidden rounded-3xl border border-white/10 bg-[#080c19]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(245,158,11,0.18),transparent_30%),radial-gradient(circle_at_80%_90%,rgba(34,211,238,0.2),transparent_40%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:44px_44px]" />

        <div className="relative h-[65vh] overflow-hidden" style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}>
          {points.map((r, index) => (
            <button
              key={r.id}
              onMouseEnter={() => setActiveId(r.id)}
              onFocus={() => setActiveId(r.id)}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${r.x}%`, top: `${r.y}%`, animationDelay: `${index * 120}ms` }}
            >
              <span className={`map-ping ${activeId === r.id ? "active" : ""}`} />
              <span className={`map-dot ${activeId === r.id ? "active" : ""}`} />
            </button>
          ))}
        </div>

        <div className="absolute left-4 top-4 z-10 rounded-full border border-white/20 bg-black/55 px-3 py-1 text-xs text-zinc-200 backdrop-blur">Live plotted hotspots</div>
        <div className="absolute bottom-4 right-4 z-10 flex gap-2">
          <button onClick={() => setZoom((z) => Math.min(1.8, z + 0.1))} className="rounded-full border border-white/20 bg-black/55 px-3 py-1 text-sm">+</button>
          <button onClick={() => setZoom((z) => Math.max(1, z - 0.1))} className="rounded-full border border-white/20 bg-black/55 px-3 py-1 text-sm">-</button>
        </div>
      </div>

      <aside className="space-y-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm backdrop-blur">{city} plotted restaurants: <span className="rounded-full bg-amber-400/20 px-2 py-1 text-amber-200">{restaurants.length}</span></div>
        {restaurants.map((r, index) => (
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
