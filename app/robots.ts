import type { MetadataRoute } from "next";
import { absoluteUrl, brand } from "@/lib/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: brand.domain,
  };
}
