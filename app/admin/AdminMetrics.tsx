"use client";

import { useEffect, useMemo, useState } from "react";

type DayMetric = {
  date: string;
  visits: number;
  topPath: string;
};

type MetricsResponse = {
  total: number;
  days: DayMetric[];
  error?: string;
};

export default function AdminMetrics({ accessKey }: { accessKey?: string }) {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);

  useEffect(() => {
    const query = accessKey ? `?key=${encodeURIComponent(accessKey)}` : "";
    fetch(`/api/metrics/visit${query}`, { cache: "no-store" })
      .then((response) => response.json())
      .then((data: MetricsResponse) => setMetrics(data))
      .catch(() => setMetrics({ total: 0, days: [], error: "Metrics are not available yet." }));
  }, [accessKey]);

  const maxVisits = useMemo(() => {
    return Math.max(...(metrics?.days.map((day) => day.visits) || [0]), 1);
  }, [metrics]);

  if (!metrics) {
    return (
      <section className="animate-in rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-zinc-300">Loading visit metrics...</p>
      </section>
    );
  }

  return (
    <section className="animate-in delay-2 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Website metrics</p>
          <h2 className="mt-1 text-2xl font-semibold">Daily visits</h2>
          <p className="mt-1 text-sm text-zinc-300">Last 30 days of recorded page visits.</p>
        </div>
        <div className="rounded-xl border border-amber-300/25 bg-amber-300/10 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.16em] text-amber-200">Total</p>
          <p className="text-2xl font-semibold">{metrics.total}</p>
        </div>
      </div>

      {metrics.error ? <p className="mt-4 text-sm text-zinc-400">{metrics.error}</p> : null}

      <div className="mt-6 space-y-3">
        {metrics.days.slice(-14).map((day) => (
          <div key={day.date} className="grid gap-2 sm:grid-cols-[110px_minmax(0,1fr)_70px] sm:items-center">
            <p className="text-xs text-zinc-400">{day.date}</p>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-amber-300 transition-all duration-700 ease-out"
                style={{ width: `${Math.max((day.visits / maxVisits) * 100, day.visits ? 8 : 0)}%` }}
              />
            </div>
            <p className="text-right text-sm text-zinc-200">{day.visits}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-zinc-300">
        Latest top path: {metrics.days.at(-1)?.topPath || "/"}
      </div>
    </section>
  );
}
