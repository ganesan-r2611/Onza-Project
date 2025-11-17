import { getStaticData } from "@/libs/getStaticData";
import BlogClient from "./BlogClient";

export default async function Blog() {
  const staticData = await getStaticData();

  return <BlogClient staticData={staticData} />;
}