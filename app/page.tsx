import OnePageMap from "./OnePageMap";
import { getAppData } from "@/lib/data";

export default async function HomePage() {
  const { cities, restaurants, dishes } = await getAppData();
  return <OnePageMap cities={cities} restaurants={restaurants} dishes={dishes} />;
}
