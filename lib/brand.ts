export const brand = {
  name: "Hidden Plates",
  tagline: "India's guide to signature dishes and underrated food spots",
  shortDescription:
    "Discover signature dishes, underrated restaurants, and crave-worthy local food stories across India's most exciting cities.",
  longDescription:
    "Hidden Plates is a premium dish-first food discovery guide for finding the cravings a city is known for, mapped to trusted restaurants, underrated local spots, and cinematic food context.",
  domain: process.env.NEXT_PUBLIC_APP_URL || "https://hiddenplates.in",
};

export function absoluteUrl(path = "/") {
  const baseUrl = brand.domain.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

export function titleCaseSlug(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
