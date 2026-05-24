import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { absoluteUrl, brand, titleCaseSlug } from "@/lib/brand";
import { getDishes, getRestaurants } from "@/lib/data";
import { imageOrFallback } from "@/lib/images";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; dishSlug: string }>;
}): Promise<Metadata> {
  const { city, dishSlug } = await params;
  const [restaurants, dishes] = await Promise.all([getRestaurants(), getDishes()]);
  const dish = dishes.find((item) => item.slug === dishSlug);
  const cityHasDish = dish ? restaurants.some((item) => item.slug === dish.restaurantSlug && item.citySlug === city) : false;
  const dishName = dish?.name ?? titleCaseSlug(dishSlug);
  const cityName = titleCaseSlug(city);
  const description =
    dish && cityHasDish ? dish.description :
    `Discover ${dishName} in ${cityName}, including where to eat it, photos, and curated restaurant context from ${brand.name}.`;

  return {
    title: `${dishName} in ${cityName}`,
    description,
    alternates: { canonical: absoluteUrl(`/${city}/dish/${dishSlug}`) },
    openGraph: {
      title: `${dishName} in ${cityName}`,
      description,
      url: absoluteUrl(`/${city}/dish/${dishSlug}`),
      siteName: brand.name,
      type: "article",
      images: [{ url: imageOrFallback(dish?.image), width: 1200, height: 630, alt: dishName }],
    },
  };
}

export default async function DishPage({
  params,
}: {
  params: Promise<{ city: string; dishSlug: string }>;
}) {
  const { city, dishSlug } = await params;
  const [restaurants, dishes] = await Promise.all([getRestaurants(), getDishes()]);
  const dish = dishes.find((item) => item.slug === dishSlug);
  const restaurant = dish ? restaurants.find((item) => item.slug === dish.restaurantSlug && item.citySlug === city) : null;

  if (!dish || !restaurant) {
    return <main className="min-h-screen bg-black p-8 text-white">Not found.</main>;
  }

  const relatedDishes = dishes
    .filter((item) => item.category === dish.category && item.slug !== dish.slug)
    .map((item) => {
      const place = restaurants.find((restaurantItem) => restaurantItem.slug === item.restaurantSlug);
      return place?.citySlug === city ? { dish: item, restaurant: place } : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 3);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    image: dish.image,
    menuAddOn: dish.tags,
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Restaurant",
        name: restaurant.name,
        url: absoluteUrl(`/${city}/restaurant/${restaurant.slug}`),
      },
    },
  };

  return (
    <main className="cinematic-shell min-h-screen text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="relative min-h-[78vh] overflow-hidden px-4 py-6 md:px-8">
        <Image
          src={imageOrFallback(dish.image)}
          alt={dish.name}
          fill
          priority
          sizes="100vw"
          className="dish-card-image object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,6,10,0.98)_0%,rgba(5,6,10,0.78)_48%,rgba(5,6,10,0.20)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-end">
          <Link href={`/${city}`} className="mb-8 w-fit rounded-full border border-white/20 bg-black/35 px-4 py-2 text-sm text-zinc-100 backdrop-blur transition hover:border-amber-300">
            Back to {titleCaseSlug(city)}
          </Link>
          <div className="animate-in max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-amber-300">{dish.category.replaceAll("-", " ")}</p>
            <h1 className="mt-3 text-5xl font-semibold leading-none md:text-7xl">{dish.name}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-100">{dish.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {dish.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-zinc-100 backdrop-blur">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 md:px-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <section className="reveal-soft shimmer-top rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Why it matters</p>
            <h2 className="mt-2 text-3xl font-semibold">A dish-first pick, not a generic listing.</h2>
            <p className="mt-3 max-w-3xl text-base leading-8 text-zinc-300">
              This page gives the craving its own story first. The restaurant becomes the trusted place to try it, not the starting point.
            </p>
          </section>

          {relatedDishes.length ? (
            <section className="reveal-soft delay-2">
              <p className="text-xs uppercase tracking-[0.22em] text-amber-300">Keep exploring</p>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {relatedDishes.map(({ dish: relatedDish, restaurant: place }) => (
                  <Link key={relatedDish.slug} href={`/${city}/dish/${relatedDish.slug}`} className="lift-card overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={imageOrFallback(relatedDish.image)}
                        alt={relatedDish.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="dish-card-image object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{relatedDish.name}</h3>
                      <p className="mt-1 text-sm text-zinc-400">{place.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="reveal-soft delay-3 h-fit rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.22em] text-amber-300">Where to eat it</p>
          <h2 className="mt-2 text-2xl font-semibold">{restaurant.name}</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-300">{restaurant.description}</p>
          <div className="mt-5 space-y-3 text-sm text-zinc-300">
            <p>{restaurant.address}</p>
            <p>{restaurant.cuisineType} - {restaurant.priceCategory}</p>
            <p>{restaurant.timings}</p>
          </div>
          <Link href={`/${city}/restaurant/${restaurant.slug}`} className="mt-6 block rounded-full bg-amber-300 px-5 py-2.5 text-center text-sm font-medium text-black transition hover:bg-amber-200">
            Open restaurant profile
          </Link>
        </aside>
      </section>
    </main>
  );
}
