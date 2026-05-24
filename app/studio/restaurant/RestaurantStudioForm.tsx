"use client";

import Image from "next/image";
import { useState } from "react";
import { brand } from "@/lib/brand";
import { imageOrFallback } from "@/lib/images";

type DishInput = {
  name: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  tags: string;
};

type FormState = {
  cityName: string;
  citySlug: string;
  state: string;
  restaurantName: string;
  restaurantSlug: string;
  description: string;
  brandStory: string;
  address: string;
  latitude: string;
  longitude: string;
  cuisineType: string;
  priceCategory: string;
  timings: string;
  phone: string;
  websiteUrl: string;
  instagramUrl: string;
  reservationUrl: string;
  googleMapsUrl: string;
  heroImage: string;
  galleryImages: string;
  highlights: string;
  categories: string;
  underratedReason: string;
  featurePitch: string;
};

const initialDishes: DishInput[] = [
  { name: "", slug: "", category: "", description: "", image: "", tags: "signature,famous-for" },
  { name: "", slug: "", category: "", description: "", image: "", tags: "signature" },
  { name: "", slug: "", category: "", description: "", image: "", tags: "signature" },
];

const initialForm: FormState = {
  cityName: "Pune",
  citySlug: "pune",
  state: "Maharashtra",
  restaurantName: "",
  restaurantSlug: "",
  description: "",
  brandStory: "",
  address: "",
  latitude: "",
  longitude: "",
  cuisineType: "",
  priceCategory: "",
  timings: "",
  phone: "",
  websiteUrl: "",
  instagramUrl: "",
  reservationUrl: "",
  googleMapsUrl: "",
  heroImage: "",
  galleryImages: "",
  highlights: "",
  categories: "",
  underratedReason: "",
  featurePitch: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function listFromText(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function sqlString(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

function sqlArray(items: string[]) {
  if (!items.length) return "'{}'";
  return `array[${items.map(sqlString).join(", ")}]`;
}

function buildSql(form: FormState, dishes: DishInput[]) {
  const categories = listFromText(form.categories);
  const galleryImages = listFromText(form.galleryImages);
  const highlights = listFromText(form.highlights);
  const cleanDishes = dishes.filter((dish) => dish.name.trim() && dish.slug.trim());

  return `-- Hidden Plates private restaurant intake
-- Review before running in Supabase SQL Editor.

insert into cities (name, slug, state, country)
values (${sqlString(form.cityName)}, ${sqlString(form.citySlug)}, ${sqlString(form.state)}, 'India')
on conflict (slug) do update set
  name = excluded.name,
  state = excluded.state;

insert into restaurants (
  city_id, name, slug, description, address, latitude, longitude,
  cuisine_type, price_category, featured, verified, timings, hero_image,
  brand_story, phone, website_url, instagram_url, reservation_url,
  google_maps_url, gallery_images, highlights
)
values (
  (select id from cities where slug = ${sqlString(form.citySlug)}),
  ${sqlString(form.restaurantName)},
  ${sqlString(form.restaurantSlug)},
  ${sqlString(form.description)},
  ${sqlString(form.address)},
  ${form.latitude || "0"},
  ${form.longitude || "0"},
  ${sqlString(form.cuisineType)},
  ${sqlString(form.priceCategory)},
  false,
  true,
  ${sqlString(form.timings)},
  ${sqlString(form.heroImage)},
  ${sqlString(`${form.brandStory}${form.underratedReason ? `\n\nWhy it is underrated: ${form.underratedReason}` : ""}${form.featurePitch ? `\n\nFeature pitch: ${form.featurePitch}` : ""}`)},
  ${sqlString(form.phone)},
  ${sqlString(form.websiteUrl)},
  ${sqlString(form.instagramUrl)},
  ${sqlString(form.reservationUrl)},
  ${sqlString(form.googleMapsUrl)},
  ${sqlArray(galleryImages)},
  ${sqlArray(highlights)}
)
on conflict (city_id, slug) do update set
  name = excluded.name,
  description = excluded.description,
  address = excluded.address,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  cuisine_type = excluded.cuisine_type,
  price_category = excluded.price_category,
  verified = excluded.verified,
  timings = excluded.timings,
  hero_image = excluded.hero_image,
  brand_story = excluded.brand_story,
  phone = excluded.phone,
  website_url = excluded.website_url,
  instagram_url = excluded.instagram_url,
  reservation_url = excluded.reservation_url,
  google_maps_url = excluded.google_maps_url,
  gallery_images = excluded.gallery_images,
  highlights = excluded.highlights;

${categories
  .map((category) => {
    const slug = slugify(category);
    return `insert into categories (name, slug)
values (${sqlString(category)}, ${sqlString(slug)})
on conflict (slug) do update set name = excluded.name;

insert into restaurant_categories (restaurant_id, category_id)
select r.id, c.id
from restaurants r
join cities city on city.id = r.city_id
join categories c on c.slug = ${sqlString(slug)}
where city.slug = ${sqlString(form.citySlug)} and r.slug = ${sqlString(form.restaurantSlug)}
on conflict (restaurant_id, category_id) do nothing;`;
  })
  .join("\n\n")}

${cleanDishes
  .map((dish, index) => {
    const tags = listFromText(dish.tags);
    return `insert into signature_dishes (
  restaurant_id, name, slug, description, image, category, tags, featured, display_order
)
values (
  (select r.id from restaurants r join cities c on c.id = r.city_id where c.slug = ${sqlString(form.citySlug)} and r.slug = ${sqlString(form.restaurantSlug)}),
  ${sqlString(dish.name)},
  ${sqlString(dish.slug)},
  ${sqlString(dish.description)},
  ${sqlString(dish.image)},
  ${sqlString(dish.category)},
  ${sqlArray(tags)},
  true,
  ${index + 1}
)
on conflict (restaurant_id, slug) do update set
  name = excluded.name,
  description = excluded.description,
  image = excluded.image,
  category = excluded.category,
  tags = excluded.tags,
  featured = excluded.featured,
  display_order = excluded.display_order;`;
  })
  .join("\n\n")}`;
}

export default function RestaurantStudioForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [dishes, setDishes] = useState<DishInput[]>(initialDishes);

  const gallery = listFromText(form.galleryImages);
  const sql = buildSql(form, dishes);
  const json = JSON.stringify({ restaurant: form, dishes }, null, 2);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateDish = (index: number, field: keyof DishInput, value: string) => {
    setDishes((current) => current.map((dish, dishIndex) => (dishIndex === index ? { ...dish, [field]: value } : dish)));
  };

  return (
    <main className="cinematic-shell min-h-screen px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="animate-in shimmer-top rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-300">{brand.name} Private Studio</p>
          <h1 className="mt-2 text-4xl font-semibold md:text-6xl">Restaurant intake workspace</h1>
          <p className="mt-3 max-w-3xl text-zinc-300">
            Private local-only form for collecting restaurant profile data, images, socials, underrated notes, and 2-3 signature dishes.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <section className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-2xl font-semibold">Restaurant basics</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Input label="City name" value={form.cityName} onChange={(value) => updateField("cityName", value)} />
                <Input label="City slug" value={form.citySlug} onChange={(value) => updateField("citySlug", slugify(value))} />
                <Input label="State" value={form.state} onChange={(value) => updateField("state", value)} />
                <Input label="Restaurant name" value={form.restaurantName} onChange={(value) => updateField("restaurantName", value)} onBlur={() => !form.restaurantSlug && updateField("restaurantSlug", slugify(form.restaurantName))} />
                <Input label="Restaurant slug" value={form.restaurantSlug} onChange={(value) => updateField("restaurantSlug", slugify(value))} />
                <Input label="Cuisine type" value={form.cuisineType} onChange={(value) => updateField("cuisineType", value)} />
                <Input label="Price category" value={form.priceCategory} onChange={(value) => updateField("priceCategory", value)} />
                <Input label="Timings" value={form.timings} onChange={(value) => updateField("timings", value)} />
                <Input label="Latitude" value={form.latitude} onChange={(value) => updateField("latitude", value)} />
                <Input label="Longitude" value={form.longitude} onChange={(value) => updateField("longitude", value)} />
              </div>
              <TextArea label="Short description" value={form.description} onChange={(value) => updateField("description", value)} />
              <TextArea label="Brand story / about restaurant" value={form.brandStory} onChange={(value) => updateField("brandStory", value)} />
              <TextArea label="Address" value={form.address} onChange={(value) => updateField("address", value)} />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-2xl font-semibold">Images and socials</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Input label="Hero image URL" value={form.heroImage} onChange={(value) => updateField("heroImage", value)} />
                <Input label="Phone" value={form.phone} onChange={(value) => updateField("phone", value)} />
                <Input label="Website URL" value={form.websiteUrl} onChange={(value) => updateField("websiteUrl", value)} />
                <Input label="Instagram URL" value={form.instagramUrl} onChange={(value) => updateField("instagramUrl", value)} />
                <Input label="Reservation/order URL" value={form.reservationUrl} onChange={(value) => updateField("reservationUrl", value)} />
                <Input label="Google Maps URL" value={form.googleMapsUrl} onChange={(value) => updateField("googleMapsUrl", value)} />
              </div>
              <TextArea label="Gallery image URLs, comma or one per line" value={form.galleryImages} onChange={(value) => updateField("galleryImages", value)} />
              <TextArea label="Highlights, comma or one per line" value={form.highlights} onChange={(value) => updateField("highlights", value)} />
              <TextArea label="Categories, comma or one per line" value={form.categories} onChange={(value) => updateField("categories", value)} />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-2xl font-semibold">Underrated and featuring notes</h2>
              <TextArea label="Why is this place underrated?" value={form.underratedReason} onChange={(value) => updateField("underratedReason", value)} />
              <TextArea label="Why should it be considered for paid featuring?" value={form.featurePitch} onChange={(value) => updateField("featurePitch", value)} />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-2xl font-semibold">Top 2-3 dishes only</h2>
              <div className="mt-4 space-y-4">
                {dishes.map((dish, index) => (
                  <div key={index} className="rounded-xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Dish {index + 1}</p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <Input label="Dish name" value={dish.name} onChange={(value) => updateDish(index, "name", value)} onBlur={() => !dish.slug && updateDish(index, "slug", slugify(dish.name))} />
                      <Input label="Dish slug" value={dish.slug} onChange={(value) => updateDish(index, "slug", slugify(value))} />
                      <Input label="Category slug" value={dish.category} onChange={(value) => updateDish(index, "category", slugify(value))} />
                      <Input label="Dish image URL" value={dish.image} onChange={(value) => updateDish(index, "image", value)} />
                    </div>
                    <TextArea label="Dish description" value={dish.description} onChange={(value) => updateDish(index, "description", value)} />
                    <Input label="Tags" value={dish.tags} onChange={(value) => updateDish(index, "tags", value)} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="relative h-64">
                <Image src={imageOrFallback(form.heroImage)} alt="Restaurant preview" fill sizes="420px" className="object-cover" />
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-300">Preview</p>
                <h2 className="mt-1 text-2xl font-semibold">{form.restaurantName || "Restaurant name"}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{form.description || "Short restaurant description will appear here."}</p>
              </div>
            </section>

            {gallery.length ? (
              <section className="grid grid-cols-2 gap-3">
                {gallery.slice(0, 4).map((image, index) => (
                  <div key={`${image}-${index}`} className="relative h-28 overflow-hidden rounded-xl border border-white/10">
                    <Image src={imageOrFallback(image)} alt={`Gallery ${index + 1}`} fill sizes="200px" className="object-cover" />
                  </div>
                ))}
              </section>
            ) : null}

            <Output title="Generated SQL" value={sql} />
            <Output title="Generated JSON" value={json} />
          </aside>
        </div>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  onBlur,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-amber-300"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="mt-4 block">
      <span className="text-xs uppercase tracking-[0.16em] text-zinc-400">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-1 w-full resize-y rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-amber-300"
      />
    </label>
  );
}

function Output({ title, value }: { title: string; value: string }) {
  const copyValue = async () => {
    await navigator.clipboard.writeText(value);
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button type="button" onClick={copyValue} className="rounded-full border border-white/20 px-3 py-1 text-xs text-zinc-100 transition hover:border-amber-300">
          Copy
        </button>
      </div>
      <pre className="mt-3 max-h-80 overflow-auto rounded-xl bg-black/40 p-3 text-xs leading-5 text-zinc-300">{value}</pre>
    </section>
  );
}
