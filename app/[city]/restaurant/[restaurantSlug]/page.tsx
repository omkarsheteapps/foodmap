import { dishes, restaurants } from "@/data/mock-data";

export default function RestaurantPage({ params }: { params: { city: string; restaurantSlug: string } }) {
  const restaurant = restaurants.find((r) => r.slug === params.restaurantSlug && r.citySlug === params.city);
  const menu = dishes.filter((d) => d.restaurantSlug === params.restaurantSlug);
  if (!restaurant) return <main className="p-8 text-white bg-black min-h-screen">Not found.</main>;
  return <main className="min-h-screen bg-zinc-950 px-8 py-10 text-white"><h1 className="text-4xl font-semibold">{restaurant.name}</h1><p className="mt-2 text-zinc-300">{restaurant.description}</p><p className="mt-2 text-sm">{restaurant.address} · {restaurant.timings}</p><section className="mt-8 grid gap-4 md:grid-cols-2">{menu.map((dish)=><article key={dish.id} className="rounded-xl border border-white/10 p-4"><h2>{dish.name}</h2><p className="text-zinc-300">{dish.description}</p></article>)}</section></main>;
}
