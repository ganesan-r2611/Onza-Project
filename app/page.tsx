// app/page.tsx
import { getStaticData } from "@/libs/getStaticData";
import HomeComponent from "@/components/HomeComponent";

export default async function HomePage() {
  const staticData = await getStaticData();

  return <HomeComponent staticData={staticData} />;
}