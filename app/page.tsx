import type { Metadata } from "next";
import OnePageMap from "./OnePageMap";
import { absoluteUrl, brand } from "@/lib/brand";
import { getAppData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Official City Food Guides and Restaurant Maps",
  description: brand.shortDescription,
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    title: `${brand.name} | ${brand.tagline}`,
    description: brand.shortDescription,
    url: absoluteUrl("/"),
    siteName: brand.name,
    type: "website",
  },
};

export default async function HomePage() {
  const { cities, restaurants, dishes } = await getAppData();
  return <OnePageMap cities={cities} restaurants={restaurants} dishes={dishes} />;
}
