import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/brand";
import { getCities, getRestaurants } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cities, restaurants] = await Promise.all([getCities(), getRestaurants()]);
  return [
    { url: absoluteUrl("/"), lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...cities.flatMap((city) => [
      { url: absoluteUrl(`/${city.slug}`), lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
      { url: absoluteUrl(`/${city.slug}/map`), lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    ]),
    ...restaurants.map((restaurant) => ({
      url: absoluteUrl(`/${restaurant.citySlug}/restaurant/${restaurant.slug}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
