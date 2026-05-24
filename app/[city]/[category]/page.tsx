import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { absoluteUrl, brand, titleCaseSlug } from "@/lib/brand";
import { getDishes, getRestaurants } from "@/lib/data";
import { imageOrFallback } from "@/lib/images";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; category: string }>;
}): Promise<Metadata> {
  const { city, category } = await params;
  const cityName = titleCaseSlug(city);
  const categoryName = titleCaseSlug(category);
  const description = `Find the best ${categoryName.toLowerCase()} in ${cityName}, including signature dishes, trusted restaurants, photos, and mapped local picks from ${brand.name}.`;

  return {
    title: `Best ${categoryName} in ${cityName}`,
    description,
    alternates: { canonical: absoluteUrl(`/${city}/${category}`) },
    openGraph: {
      title: `Best ${categoryName} in ${cityName}`,
      description,
      url: absoluteUrl(`/${city}/${category}`),
      siteName: brand.name,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ city: string; category: string }> }) {
  const { city, category } = await params;
  const [restaurants, dishes] = await Promise.all([getRestaurants(), getDishes()]);
  const hits = dishes
    .filter((dish) => dish.category === category)
    .map((dish) => {
      const restaurant = restaurants.find((item) => item.slug === dish.restaurantSlug);
      return restaurant?.citySlug === city ? { dish, restaurant } : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => Number(b.dish.featured) - Number(a.dish.featured) || a.dish.displayOrder - b.dish.displayOrder);
  const lead = hits[0];

  return (
    <main className="cinematic-shell min-h-screen px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="animate-in shimmer-top mobile-edge grid overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]">
          <div className="flex min-h-[500px] flex-col justify-end p-6 md:p-10">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-300">{brand.name} Craving Guide</p>
            <h1 className="mt-3 text-5xl font-semibold leading-none md:text-7xl">
              Best {titleCaseSlug(category)} in {titleCaseSlug(city)}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-200">
              A curated shortlist of dishes selected for memory, flavour, and local relevance.
            </p>
          </div>
          <div className="relative min-h-[390px]">
            {lead ? (
              <Image
                src={imageOrFallback(lead.dish.image)}
                alt={lead.dish.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="dish-card-image object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            {lead ? (
              <Link href={`/${city}/dish/${lead.dish.slug}`} className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-black/45 p-4 backdrop-blur transition hover:border-amber-300">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Most iconic pick</p>
                <h2 className="mt-1 text-2xl font-semibold">{lead.dish.name}</h2>
                <p className="mt-1 text-sm text-zinc-200">{lead.restaurant.name}</p>
              </Link>
            ) : null}
          </div>
        </section>

        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hits.map(({ dish, restaurant }, index) => (
              <Link key={`${restaurant.slug}-${dish.slug}`} href={`/${city}/dish/${dish.slug}`} className="lift-card reveal-soft overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={imageOrFallback(dish.image)}
                    alt={dish.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="dish-card-image object-cover"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-xs text-zinc-100 backdrop-blur">
                    Pick {index + 1}
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{dish.name}</h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-300">{dish.description}</p>
                  <p className="mt-3 text-sm text-zinc-400">{restaurant.name} - {restaurant.address}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
