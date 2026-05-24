import type { MetadataRoute } from "next";
import { absoluteUrl, brand } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${brand.name} - City Food Guides`,
    short_name: brand.name,
    description: brand.shortDescription,
    start_url: absoluteUrl("/"),
    scope: absoluteUrl("/"),
    display: "standalone",
    background_color: "#05060a",
    theme_color: "#f59e0b",
    categories: ["food", "travel", "lifestyle"],
  };
}
