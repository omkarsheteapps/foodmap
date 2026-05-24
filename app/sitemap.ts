import type { MetadataRoute } from "next";
import { getCities, getRestaurants } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cities, restaurants] = await Promise.all([getCities(), getRestaurants()]);
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
