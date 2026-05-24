import type { Metadata } from "next";
import { absoluteUrl, brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Restaurant Partner Onboarding",
  description: `Apply to list a restaurant, signature dish, or local food business on ${brand.name}.`,
  alternates: { canonical: absoluteUrl("/onboarding") },
  openGraph: {
    title: `Restaurant Partner Onboarding | ${brand.name}`,
    description: `Apply to list a restaurant, signature dish, or local food business on ${brand.name}.`,
    url: absoluteUrl("/onboarding"),
    siteName: brand.name,
    type: "website",
  },
};

export default function OnboardingPage() {
  return <main className="min-h-screen bg-black p-8 text-white"><section className="animate-in shimmer-top rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"><p className="text-xs uppercase tracking-[0.25em] text-amber-300">{brand.name} Partners</p><h1 className="mt-2 text-3xl font-semibold">Restaurant Partner Onboarding</h1><p className="mt-2 max-w-2xl text-zinc-300">Submit a restaurant, signature dish, or local food business for editorial review and city guide placement.</p><button className="mt-6 rounded-full border border-amber-300 px-5 py-2 text-amber-200 transition hover:bg-amber-300/10">Applications opening soon</button></section></main>;
}
