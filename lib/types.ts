export type City = {
  id: number;
  name: string;
  slug: string;
  state: string;
  country: string;
  heroImage: string;
  seoTitle: string;
  seoDescription: string;
};

export type Restaurant = {
  id: number;
  citySlug: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  cuisineType: string;
  priceCategory: string;
  featured: boolean;
  verified: boolean;
  timings: string;
  heroImage: string;
  brandStory: string;
  phone: string;
  websiteUrl: string;
  instagramUrl: string;
  reservationUrl: string;
  googleMapsUrl: string;
  galleryImages: string[];
  highlights: string[];
  categories: string[];
};

export type Dish = {
  id: number;
  restaurantSlug: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  featured: boolean;
  displayOrder: number;
};
