import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { absoluteUrl, brand, titleCaseSlug } from "@/lib/brand";
import { getDishes, getRestaurants } from "@/lib/data";
import { fallbackDishImage, fallbackRestaurantImage, imageOrFallback } from "@/lib/images";
import type { Dish, Restaurant } from "@/lib/types";

function getHeroImage(restaurant?: Restaurant) {
  return restaurant?.heroImage || restaurant?.galleryImages[0] || fallbackRestaurantImage;
}

function getTopDishes(menu: Dish[]) {
  return menu
    .filter((dish) => dish.featured)
    .sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id)
    .slice(0, 3);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; restaurantSlug: string }>;
}): Promise<Metadata> {
  const { city, restaurantSlug } = await params;
  const restaurants = await getRestaurants();
  const restaurant = restaurants.find((r) => r.slug === restaurantSlug && r.citySlug === city);
  const cityName = titleCaseSlug(city);
  const restaurantName = restaurant?.name ?? titleCaseSlug(restaurantSlug);
  const description =
    restaurant?.description ||
    `View ${restaurantName} in ${cityName}, including famous dishes, photos, socials, contact details, and local food guide context from ${brand.name}.`;

  return {
    title: `${restaurantName} in ${cityName}`,
    description,
    alternates: { canonical: absoluteUrl(`/${city}/restaurant/${restaurantSlug}`) },
    openGraph: {
      title: `${restaurantName} in ${cityName}`,
      description,
      url: absoluteUrl(`/${city}/restaurant/${restaurantSlug}`),
      siteName: brand.name,
      type: "article",
      images: [{ url: getHeroImage(restaurant), width: 1200, height: 630, alt: restaurantName }],
    },
  };
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ city: string; restaurantSlug: string }>;
}) {
  const { city, restaurantSlug } = await params;
  const [restaurants, dishes] = await Promise.all([getRestaurants(), getDishes()]);
  const restaurant = restaurants.find((r) => r.slug === restaurantSlug && r.citySlug === city);

  if (!restaurant) {
    return <main className="min-h-screen bg-black p-8 text-white">Not found.</main>;
  }

  const menu = dishes.filter((dish) => dish.restaurantSlug === restaurantSlug);
  const topDishes = getTopDishes(menu);
  const heroImage = getHeroImage(restaurant);
  const gallery = [heroImage, ...restaurant.galleryImages].filter(Boolean).slice(0, 4);
  const highlights = restaurant.highlights.length
    ? restaurant.highlights
    : [restaurant.cuisineType, restaurant.priceCategory, "Local favourite"].filter(Boolean);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    description: restaurant.description,
    image: gallery,
    url: absoluteUrl(`/${city}/restaurant/${restaurant.slug}`),
    telephone: restaurant.phone,
    sameAs: [restaurant.websiteUrl, restaurant.instagramUrl].filter(Boolean),
    address: restaurant.address,
    servesCuisine: restaurant.cuisineType,
    priceRange: restaurant.priceCategory,
    openingHours: restaurant.timings,
    geo: {
      "@type": "GeoCoordinates",
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
    },
    hasMenuItem: topDishes.map((dish) => ({
      "@type": "MenuItem",
      name: dish.name,
      description: dish.description,
      image: dish.image,
    })),
  };

  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="relative min-h-[72vh] overflow-hidden px-5 py-6 md:px-8">
        <Image
          src={imageOrFallback(heroImage, fallbackRestaurantImage)}
          alt={restaurant.name}
          fill
          priority
          sizes="100vw"
          className="dish-card-image object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,10,0.96)_0%,rgba(5,6,10,0.76)_42%,rgba(5,6,10,0.28)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[64vh] max-w-7xl flex-col justify-end">
          <Link href={`/${city}`} className="mb-8 w-fit rounded-full border border-white/20 bg-black/35 px-4 py-2 text-sm text-zinc-100 backdrop-blur transition hover:border-amber-300">
            Back to {titleCaseSlug(city)}
          </Link>

          <div className="animate-in max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-amber-300">{brand.name} Restaurant Profile</p>
            <h1 className="mt-3 text-5xl font-semibold md:text-7xl">{restaurant.name}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-100">{restaurant.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {highlights.map((highlight) => (
                <span key={highlight} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-zinc-100 backdrop-blur">
                  {highlight}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {restaurant.reservationUrl ? (
                <a href={restaurant.reservationUrl} className="rounded-full bg-amber-300 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-amber-200">
                  Reserve / Order
                </a>
              ) : null}
              {restaurant.instagramUrl ? (
                <a href={restaurant.instagramUrl} className="rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm text-white backdrop-blur transition hover:border-amber-300">
                  Instagram
                </a>
              ) : null}
              {restaurant.googleMapsUrl ? (
                <a href={restaurant.googleMapsUrl} className="rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm text-white backdrop-blur transition hover:border-amber-300">
                  Get directions
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 md:px-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <section className="reveal-soft shimmer-top rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-300">Famous for</p>
            <h2 className="mt-2 text-3xl font-semibold">Only the dishes people should remember.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
              Keep the restaurant brand sharp with two or three signature dishes instead of a crowded menu.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {topDishes.map((dish, index) => (
                <Link key={dish.id} href={`/${city}/dish/${dish.slug}`} className="lift-card reveal-soft overflow-hidden rounded-2xl border border-white/10 bg-black/25">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={imageOrFallback(dish.image, fallbackDishImage)}
                      alt={dish.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="dish-card-image object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-amber-300">Top {index + 1}</p>
                    <h3 className="mt-1 text-xl font-semibold">{dish.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">{dish.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="reveal-soft delay-2 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Brand story</p>
            <h2 className="mt-2 text-3xl font-semibold">About {restaurant.name}</h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-zinc-300">
              {restaurant.brandStory || restaurant.description}
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-4">
            {gallery.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className={`reveal-soft relative min-h-52 overflow-hidden rounded-2xl border border-white/10 ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
              >
                <Image
                  src={imageOrFallback(image, fallbackRestaurantImage)}
                  alt={`${restaurant.name} gallery ${index + 1}`}
                  fill
                  sizes={index === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                  className="dish-card-image object-cover"
                />
              </div>
            ))}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="reveal-soft delay-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-300">Details</p>
            <div className="mt-4 space-y-4 text-sm text-zinc-300">
              <div>
                <p className="text-zinc-500">Cuisine</p>
                <p className="text-white">{restaurant.cuisineType || "Restaurant"}</p>
              </div>
              <div>
                <p className="text-zinc-500">Price</p>
                <p className="text-white">{restaurant.priceCategory || "Contact restaurant"}</p>
              </div>
              <div>
                <p className="text-zinc-500">Timings</p>
                <p className="text-white">{restaurant.timings || "Hours not listed"}</p>
              </div>
              <div>
                <p className="text-zinc-500">Address</p>
                <p className="text-white">{restaurant.address}</p>
              </div>
              {restaurant.phone ? (
                <div>
                  <p className="text-zinc-500">Phone</p>
                  <a href={`tel:${restaurant.phone.replaceAll(" ", "")}`} className="text-white hover:text-amber-200">
                    {restaurant.phone}
                  </a>
                </div>
              ) : null}
            </div>
          </section>

          <section className="reveal-soft delay-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Brand links</p>
            <div className="mt-4 grid gap-2">
              {restaurant.websiteUrl ? (
                <a href={restaurant.websiteUrl} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-100 transition hover:border-amber-300 hover:bg-white/10">
                  Website
                </a>
              ) : null}
              {restaurant.instagramUrl ? (
                <a href={restaurant.instagramUrl} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-100 transition hover:border-amber-300 hover:bg-white/10">
                  Instagram
                </a>
              ) : null}
              {restaurant.reservationUrl ? (
                <a href={restaurant.reservationUrl} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-100 transition hover:border-amber-300 hover:bg-white/10">
                  Reservations / Ordering
                </a>
              ) : null}
              {restaurant.googleMapsUrl ? (
                <a href={restaurant.googleMapsUrl} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-100 transition hover:border-amber-300 hover:bg-white/10">
                  Google Maps
                </a>
              ) : null}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}
