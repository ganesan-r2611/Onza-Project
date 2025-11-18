import { getStaticData } from "@/libs/getStaticData";
import BlogDetailClient from "./BlogDetailClient";

export default async function BlogDetailPage() {
  const staticData = await getStaticData();

  const { blogDetails, ...rest } = staticData;
  const correctStaticData = {
    ...rest,
    blogDetails: blogDetails?.blogDetails ?? blogDetails,
  };

  return <BlogDetailClient staticData={correctStaticData} />;
}