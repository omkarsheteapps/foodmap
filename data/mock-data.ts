import type { City, Dish, Restaurant } from "@/lib/types";

export const cities: City[] = [
  { id: 1, name: "Pune", slug: "pune", state: "Maharashtra", country: "India", heroImage: "https://images.unsplash.com/photo-1590845947670-c009801ffa74", seoTitle: "Best dishes in Pune | CraveMap", seoDescription: "Discover Pune's best signature dishes and hidden gems." },
  { id: 2, name: "Mumbai", slug: "mumbai", state: "Maharashtra", country: "India", heroImage: "https://images.unsplash.com/photo-1566552881560-0be862a7c445", seoTitle: "Best dishes in Mumbai | CraveMap", seoDescription: "Explore iconic Mumbai food experiences." },
  { id: 3, name: "Bangalore", slug: "bangalore", state: "Karnataka", country: "India", heroImage: "https://images.unsplash.com/photo-1588416499018-d00dc4063903", seoTitle: "Best dishes in Bangalore | CraveMap", seoDescription: "Find top cafes, pizza, bowls and more in Bangalore." },
];

export const restaurants: Restaurant[] = [
  { id: 1, citySlug: "pune", name: "Le Plaisir", slug: "le-plaisir", description: "European bistro for soulful comfort food.", address: "Prabhat Road, Pune", latitude: 18.513, longitude: 73.829, cuisineType: "European", priceCategory: "₹₹₹", featured: true, verified: true, timings: "12 PM - 11 PM", heroImage: "https://images.unsplash.com/photo-1559339352-11d035aa65de", categories: ["desserts", "date-night", "fine-dining"] },
  { id: 2, citySlug: "mumbai", name: "Queen Margherita's", slug: "queen-margheritas", description: "Wood-fired Neapolitan pizza studio.", address: "Bandra West, Mumbai", latitude: 19.060, longitude: 72.836, cuisineType: "Italian", priceCategory: "₹₹₹", featured: true, verified: true, timings: "1 PM - 12 AM", heroImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591", categories: ["pizza", "italian", "date-night"] },
  { id: 3, citySlug: "bangalore", name: "Green Theory", slug: "green-theory", description: "Plant-forward cafe and healthy bowls.", address: "Residency Road, Bangalore", latitude: 12.968, longitude: 77.602, cuisineType: "Healthy", priceCategory: "₹₹", featured: true, verified: true, timings: "9 AM - 10 PM", heroImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", categories: ["healthy", "cafes", "breakfast"] },
];

export const dishes: Dish[] = [
  { id: 1, restaurantSlug: "le-plaisir", name: "Biscoff Cheesecake", slug: "biscoff-cheesecake", description: "Silky baked cheesecake with caramel crunch.", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad", category: "desserts", tags: ["creamy", "signature"], featured: true },
  { id: 2, restaurantSlug: "queen-margheritas", name: "Truffle Burrata Pizza", slug: "truffle-burrata-pizza", description: "Charred crust topped with burrata and truffle oil.", image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47", category: "pizza", tags: ["wood-fired", "luxury"], featured: true },
  { id: 3, restaurantSlug: "green-theory", name: "Miso Tofu Power Bowl", slug: "miso-tofu-power-bowl", description: "Protein-rich bowl with fermented umami dressing.", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd", category: "healthy", tags: ["high-protein", "fresh"], featured: true },
];
