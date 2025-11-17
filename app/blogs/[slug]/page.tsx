import { getStaticData } from "@/libs/getStaticData";
import BlogDetailClient from "./BlogDetailClient";

export default async function BlogDetailPage() {
  const staticData = await getStaticData();

  return <BlogDetailClient staticData={staticData} />;
}