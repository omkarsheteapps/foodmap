import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RestaurantStudioForm from "./RestaurantStudioForm";

const studioEnabled = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ENABLE_STUDIO === "true";

export const metadata: Metadata = {
  title: "Private Restaurant Studio",
  description: "Private Hidden Plates restaurant onboarding workspace.",
  robots: { index: false, follow: false },
};

export default function RestaurantStudioPage() {
  if (!studioEnabled) notFound();

  return <RestaurantStudioForm />;
}
