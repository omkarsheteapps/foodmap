import { NextResponse } from "next/server";

type VisitRow = {
  visited_at: string;
  path: string | null;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function canReadMetrics(req: Request) {
  if (process.env.NODE_ENV !== "production") return true;
  const accessKey = process.env.ADMIN_ACCESS_KEY;
  const requestKey = new URL(req.url).searchParams.get("key");
  return Boolean(accessKey && requestKey && requestKey === accessKey);
}

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || null;
}

function getDayKey(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

async function supabaseRequest(path: string, init: RequestInit) {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase configuration for metrics.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const path = typeof body.path === "string" ? body.path.slice(0, 500) : "/";
    const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : null;

    await supabaseRequest("site_visits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        path,
        referrer,
        user_agent: req.headers.get("user-agent"),
        ip_address: getClientIp(req),
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Visit tracking failed", error);
    return NextResponse.json({ ok: false }, { status: 202 });
  }
}

export async function GET(req: Request) {
  if (!canReadMetrics(req)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const start = new Date();
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);

    const query = new URLSearchParams({
      select: "visited_at,path",
      visited_at: `gte.${start.toISOString()}`,
      order: "visited_at.asc",
      limit: "5000",
    });

    const response = await supabaseRequest(`site_visits?${query.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const rows = (await response.json()) as VisitRow[];
    const byDay = new Map<string, { date: string; visits: number; topPath: string }>();
    const pathCounts = new Map<string, Map<string, number>>();

    for (let index = 0; index < 30; index += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const key = getDayKey(date.toISOString());
      byDay.set(key, { date: key, visits: 0, topPath: "/" });
      pathCounts.set(key, new Map());
    }

    for (const row of rows) {
      const day = getDayKey(row.visited_at);
      const entry = byDay.get(day);
      if (!entry) continue;

      const path = row.path || "/";
      const dayPaths = pathCounts.get(day);
      entry.visits += 1;
      dayPaths?.set(path, (dayPaths.get(path) || 0) + 1);
    }

    for (const [day, entry] of byDay) {
      const sortedPaths = [...(pathCounts.get(day)?.entries() || [])].sort((a, b) => b[1] - a[1]);
      entry.topPath = sortedPaths[0]?.[0] || "/";
    }

    const days = [...byDay.values()];
    const total = days.reduce((sum, item) => sum + item.visits, 0);

    return NextResponse.json({ total, days });
  } catch (error) {
    console.error("Metrics fetch failed", error);
    return NextResponse.json({ total: 0, days: [], error: "Metrics are not available yet." }, { status: 200 });
  }
}
