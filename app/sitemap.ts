import type { MetadataRoute } from "next";
import { cities, restaurants } from "@/data/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://cravemap.example.com";
  return [
    { url: base, lastModified: new Date() },
    ...cities.flatMap((city) => [
      { url: `${base}/${city.slug}`, lastModified: new Date() },
      { url: `${base}/${city.slug}/map`, lastModified: new Date() },
    ]),
    ...restaurants.map((restaurant) => ({
      url: `${base}/${restaurant.citySlug}/restaurant/${restaurant.slug}`,
      lastModified: new Date(),
    })),
  ];
}
