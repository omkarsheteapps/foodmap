export const fallbackDishImage =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80";

export const fallbackRestaurantImage =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80";

export function imageOrFallback(image: string | undefined, fallback = fallbackDishImage) {
  return image?.trim() || fallback;
}
