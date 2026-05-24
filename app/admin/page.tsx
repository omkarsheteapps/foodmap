import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brand } from "@/lib/brand";
import AdminMetrics from "./AdminMetrics";

function canViewAdmin(key?: string) {
  if (process.env.NODE_ENV !== "production") return true;
  const accessKey = process.env.ADMIN_ACCESS_KEY;
  return Boolean(accessKey && key && key === accessKey);
}

export const metadata: Metadata = {
  title: "Admin Console",
  description: `${brand.name} operations console for managing city guides, restaurant profiles, and submissions.`,
  robots: { index: false, follow: false },
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const { key } = await searchParams;
  if (!canViewAdmin(key)) notFound();

  return <main className="min-h-screen bg-zinc-950 p-8 text-white"><div className="mx-auto max-w-6xl space-y-6"><section className="animate-in rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"><p className="text-xs uppercase tracking-[0.25em] text-amber-300">{brand.name}</p><h1 className="mt-2 text-3xl font-semibold">Admin Console</h1><p className="mt-2 max-w-2xl text-zinc-300">Operational workspace for city guides, restaurant profiles, dish records, submissions, featured placements, and website traffic.</p></section><AdminMetrics accessKey={key} /></div></main>;
}
