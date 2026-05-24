import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { absoluteUrl, brand, titleCaseSlug } from "@/lib/brand";
import { getCities, getDishes, getRestaurants } from "@/lib/data";
import { imageOrFallback } from "@/lib/images";

export async function generateStaticParams() {
  const cities = await getCities();
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params;
  const cities = await getCities();
  const city = cities.find((item) => item.slug === citySlug);
  const cityName = city?.name ?? titleCaseSlug(citySlug);
  const description =
    city?.seoDescription ??
    `Explore ${cityName}'s best signature dishes, cravings, verified restaurants, and local food districts on ${brand.name}.`;

  return {
    title: city?.seoTitle ?? `Best Signature Dishes in ${cityName}`,
    description,
    alternates: { canonical: absoluteUrl(`/${citySlug}`) },
    openGraph: {
      title: `${cityName} Dish Guide`,
      description,
      url: absoluteUrl(`/${citySlug}`),
      siteName: brand.name,
      type: "website",
    },
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const [restaurants, dishes] = await Promise.all([getRestaurants(), getDishes()]);
  const cityRestaurants = restaurants.filter((restaurant) => restaurant.citySlug === city);
  const cityDishStories = dishes
    .map((dish) => {
      const restaurant = cityRestaurants.find((item) => item.slug === dish.restaurantSlug);
      return restaurant ? { dish, restaurant } : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => Number(b.dish.featured) - Number(a.dish.featured) || a.dish.displayOrder - b.dish.displayOrder);
  const lead = cityDishStories[0];

  return (
    <main className="cinematic-shell min-h-screen px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="animate-in shimmer-top mobile-edge grid overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur lg:grid-cols-[minmax(0,0.8fr)_minmax(420px,1.2fr)]">
          <div className="flex min-h-[520px] flex-col justify-end p-6 md:p-10">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-300">{brand.name} City Edit</p>
            <h1 className="mt-3 text-5xl font-semibold leading-none md:text-7xl">{titleCaseSlug(city)}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-200">
              The dishes, cravings, and local favourites worth planning a day around.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/${city}/map`} className="rounded-full bg-amber-300 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-amber-200">
                Open food map
              </Link>
              <a href="#signature-dishes" className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-zinc-100 transition hover:border-amber-300">
                Browse dishes
              </a>
            </div>
          </div>
          <div className="relative min-h-[420px]">
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
                <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Start here</p>
                <h2 className="mt-1 text-2xl font-semibold">{lead.dish.name}</h2>
                <p className="mt-1 text-sm text-zinc-200">{lead.restaurant.name}</p>
              </Link>
            ) : null}
          </div>
        </section>

        <section id="signature-dishes" className="reveal-soft">
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Signature dishes</p>
          <h2 className="mt-2 text-3xl font-semibold md:text-5xl">Eat your way through {titleCaseSlug(city)}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cityDishStories.slice(0, 9).map(({ dish, restaurant }) => (
              <Link key={`${restaurant.slug}-${dish.slug}`} href={`/${city}/dish/${dish.slug}`} className="lift-card reveal-soft overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={imageOrFallback(dish.image)}
                    alt={dish.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="dish-card-image object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-amber-300">{dish.category.replaceAll("-", " ")}</p>
                  <h3 className="mt-1 text-xl font-semibold">{dish.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-300">{dish.description}</p>
                  <p className="mt-3 text-sm text-zinc-400">{restaurant.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="reveal-soft delay-2 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-amber-300">Restaurants behind the dishes</p>
              <h2 className="mt-2 text-2xl font-semibold">Verified spots in {titleCaseSlug(city)}</h2>
            </div>
            <Link href={`/${city}/map`} className="w-fit rounded-full border border-white/20 px-4 py-2 text-sm transition hover:border-amber-300">
              See map
            </Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {cityRestaurants.map((restaurant) => (
              <Link key={restaurant.id} href={`/${city}/restaurant/${restaurant.slug}`} className="lift-card rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-white/30">
                <h3 className="text-lg font-medium">{restaurant.name}</h3>
                <p className="mt-1 text-sm text-zinc-300">{restaurant.cuisineType} - {restaurant.priceCategory}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
