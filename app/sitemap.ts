import type { MetadataRoute } from "next";
import { cities } from "@/data/mock-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://cravemap.example.com";
  return [{ url: base, lastModified: new Date() }, ...cities.map((c) => ({ url: `${base}/${c.slug}`, lastModified: new Date() }))];
}
