import type { City, Dish, Restaurant } from "@/lib/types";

export const cities: City[] = [
  { id: 1, name: "Pune", slug: "pune", state: "Maharashtra", country: "India", heroImage: "https://images.unsplash.com/photo-1590845947670-c009801ffa74", seoTitle: "Best signature dishes in Pune | Hidden Plates", seoDescription: "Discover Pune's trusted restaurants, underrated spots, signature dishes, and local food stories." },
  { id: 2, name: "Mumbai", slug: "mumbai", state: "Maharashtra", country: "India", heroImage: "https://images.unsplash.com/photo-1566552881560-0be862a7c445", seoTitle: "Best signature dishes in Mumbai | Hidden Plates", seoDescription: "Explore iconic Mumbai food experiences and underrated local plates." },
  { id: 3, name: "Bangalore", slug: "bangalore", state: "Karnataka", country: "India", heroImage: "https://images.unsplash.com/photo-1588416499018-d00dc4063903", seoTitle: "Best signature dishes in Bangalore | Hidden Plates", seoDescription: "Find top cafes, pizza, bowls, underrated kitchens, and more in Bangalore." },
];

const profileDefaults = {
  brandStory: "A focused restaurant profile with room for brand story, social links, photos, and signature dishes.",
  phone: "+91 98765 41000",
  websiteUrl: "https://example.com",
  instagramUrl: "https://instagram.com/foodmap",
  reservationUrl: "https://example.com/reserve",
  googleMapsUrl: "https://maps.google.com",
  galleryImages: [
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
  ],
  highlights: ["Signature dishes", "Verified", "Local favourite"],
};

export const restaurants: Restaurant[] = [
  { id: 1, citySlug: "pune", name: "Le Plaisir", slug: "le-plaisir", description: "European bistro for soulful comfort food.", address: "Prabhat Road, Pune", latitude: 18.513, longitude: 73.829, cuisineType: "European", priceCategory: "Premium", featured: true, verified: true, timings: "12 PM - 11 PM", heroImage: "https://images.unsplash.com/photo-1559339352-11d035aa65de", ...profileDefaults, categories: ["desserts", "date-night", "fine-dining"] },
  { id: 2, citySlug: "mumbai", name: "Queen Margherita's", slug: "queen-margheritas", description: "Wood-fired Neapolitan pizza studio.", address: "Bandra West, Mumbai", latitude: 19.06, longitude: 72.836, cuisineType: "Italian", priceCategory: "Premium", featured: true, verified: true, timings: "1 PM - 12 AM", heroImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591", ...profileDefaults, categories: ["pizza", "italian", "date-night"] },
  { id: 3, citySlug: "bangalore", name: "Green Theory", slug: "green-theory", description: "Plant-forward cafe and healthy bowls.", address: "Residency Road, Bangalore", latitude: 12.968, longitude: 77.602, cuisineType: "Healthy", priceCategory: "Mid-range", featured: true, verified: true, timings: "9 AM - 10 PM", heroImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", ...profileDefaults, categories: ["healthy", "cafes", "breakfast"] },
  { id: 4, citySlug: "pune", name: "Cafe GoodLuck", slug: "cafe-goodluck", description: "Iconic Irani cafe serving legendary bun maska and chai.", address: "Fergusson College Road, Pune", latitude: 18.5195, longitude: 73.8418, cuisineType: "Cafe / Irani", priceCategory: "Budget", featured: true, verified: true, timings: "7 AM - 11:30 PM", heroImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836", ...profileDefaults, categories: ["cafes", "breakfast", "budget-eats"] },
  { id: 5, citySlug: "pune", name: "Malaka Spice", slug: "malaka-spice", description: "Beloved Pan-Asian restaurant known for regional Southeast Asian plates.", address: "Koregaon Park, Pune", latitude: 18.5362, longitude: 73.8932, cuisineType: "Asian", priceCategory: "Premium", featured: true, verified: true, timings: "12 PM - 11 PM", heroImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", ...profileDefaults, categories: ["asian", "fine-dining", "date-night"] },
  { id: 6, citySlug: "pune", name: "Burger Craft", slug: "burger-craft", description: "Juicy smashed burgers with gourmet sauces and loaded fries.", address: "Aundh, Pune", latitude: 18.559, longitude: 73.807, cuisineType: "Burgers", priceCategory: "Mid-range", featured: false, verified: true, timings: "11 AM - 1 AM", heroImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd", ...profileDefaults, categories: ["burgers", "late-night", "non-veg"] },
];

export const dishes: Dish[] = [
  { id: 1, restaurantSlug: "le-plaisir", name: "Biscoff Cheesecake", slug: "biscoff-cheesecake", description: "Silky baked cheesecake with caramel crunch.", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad", category: "desserts", tags: ["creamy", "signature"], featured: true, displayOrder: 1 },
  { id: 2, restaurantSlug: "queen-margheritas", name: "Truffle Burrata Pizza", slug: "truffle-burrata-pizza", description: "Charred crust topped with burrata and truffle oil.", image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47", category: "pizza", tags: ["wood-fired", "luxury"], featured: true, displayOrder: 1 },
  { id: 3, restaurantSlug: "green-theory", name: "Miso Tofu Power Bowl", slug: "miso-tofu-power-bowl", description: "Protein-rich bowl with fermented umami dressing.", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd", category: "healthy", tags: ["high-protein", "fresh"], featured: true, displayOrder: 1 },
  { id: 4, restaurantSlug: "cafe-goodluck", name: "Bun Maska & Irani Chai", slug: "bun-maska-irani-chai", description: "Toasted bun with creamy maska paired with strong Irani chai.", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085", category: "breakfast", tags: ["heritage", "budget"], featured: true, displayOrder: 1 },
  { id: 5, restaurantSlug: "malaka-spice", name: "Khao Suey", slug: "khao-suey", description: "Creamy coconut curry noodles finished with bold condiments.", image: "https://images.unsplash.com/photo-1559847844-5315695dadae", category: "asian", tags: ["comfort", "signature"], featured: true, displayOrder: 1 },
  { id: 6, restaurantSlug: "burger-craft", name: "Smoked Jalapeno Smash Burger", slug: "smoked-jalapeno-smash-burger", description: "Crisp-edged double smash patty with smoked jalapeno aioli.", image: "https://images.unsplash.com/photo-1550317138-10000687a72b", category: "burgers", tags: ["late-night", "juicy"], featured: false, displayOrder: 1 },
];
