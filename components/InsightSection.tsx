// components/InsightSection.tsx (SERVER)
import Image from "next/image";
import Link from "next/link";
import { imageMap } from "@/libs/imageMap";

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  imageKey: keyof typeof imageMap;
}
export interface BlogsData {
  sectionTitle: string;
  sectionSubtitle: string;
  cta?: { label: string; href: string };
  posts: BlogPost[];
}

const CARD_H = "h-[439px]";

function Card({ post }: { post: BlogPost }) {
  const img = imageMap[post.imageKey];
  return (
    <article className="relative rounded-[18px] overflow-hidden card-border">
      <div className={`relative ${CARD_H} w-full`}>
        <Image src={img} alt={post.title} fill className="object-cover" />
        <div className="card-overlay" />
        <div className="card-highlight" />
        <div className="absolute inset-0 grid grid-rows-2 gap-3">
          <div className="p-6 z-10 flex flex-row justify-between">
            <div>
              <div className="inline-block text-[10px] px-4 py-1 w-fit rounded-[10px] font-medium transition backdrop-blur-md border border-[#d1b67c]/40 bg-white/10 text-[#ffdc81] hover:bg-white/20">
                {post.category}
              </div>
            </div>
            <div>
              <p className="text-[#FBFBFB] text-[10px] font-regular mt-2">
                {post.date} &bull; {post.readTime}
              </p>
            </div>
          </div>

          <div className="relative flex flex-col justify-end p-6">
            {/* Multiple blur layers for gradient effect */}
            <div
              className="absolute inset-0 backdrop-blur-[2px]"
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, black 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, black 100%)",
              }}
            />
            <div
              className="absolute inset-0 backdrop-blur-[4px]"
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 50%, black 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 50%, black 100%)",
              }}
            />
            <div
              className="absolute inset-0 backdrop-blur-[6px]"
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 70%, black 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 70%, black 100%)",
              }}
            />

            {/* Content */}
            <div className="relative">
              <h3 className="text-[22px] md:text-[24px] leading-[28px] text-white font-light">
                {post.title}
              </h3>
              <p className="text-[14px] text-white/80 mt-2 mb-4 max-w-[95%]">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.id}`}
                className="block w-full underline underline-offset-8 decoration-4 text-[14px] font-light text-[#F2E9DA] hover:text-[#ffdc81]"
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function InsightsSection({ blogs }: { blogs: BlogsData }) {
  const posts = blogs.posts || [];
  const p = (i: number) => posts[i] ?? null;

  return (
    <section className="bg-[#121819] pt-16 pb-20" data-theme="light">
      <div className="mx-auto px-6">
        {/* Mobile Layout (flex-col) */}
        <div className="lg:hidden flex flex-col gap-6">
          {/* Title */}
          <h2 className="text-[34px] md:text-[38px] lg:text-[38px] font-light text-[#FBFBFB] leading-tight">
            {blogs.sectionTitle}
          </h2>

          {/* Subtitle */}
          <p className="text-[20px] text-[#bbbbbb] max-w-[362px]">
            {blogs.sectionSubtitle}
          </p>

          {/* All blogs stacked */}
          {[0, 1, 2, 3, 4, 5].map(
            (i) => p(i) && <Card key={p(i).id || i} post={p(i)} />
          )}

          {/* CTA Button */}
          <div className="glass-card items-center pt-1 mt-3">
            <div className="rounded-[16px] p-6 bg-gradient-to-br from-white/6 to-black/10">
              <Link href={blogs.cta?.href || "/blogs"} className="w-full">
                <button className="glass-btn w-full rounded-[24px] py-3 text-sm text-white/95">
                  {blogs.cta?.label || "View All Blogs"}
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Layout (grid-cols-3) */}
        <div className="hidden lg:grid grid-cols-3 gap-8 mx-auto">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <h2 className="text-[34px] md:text-[38px] lg:text-[38px] font-light text-[#FBFBFB] leading-tight max-w-[437px] pb-6">
              <span className="block">Insights</span>
              <span className="block">Unlocked</span>
            </h2>
            {p(0) && <Card post={p(0)} />}
            {p(1) && <Card post={p(1)} />}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            {p(2) && <Card post={p(2)} />}
            {p(3) && <Card post={p(3)} />}

            {/* CTA (desktop only) */}
            <div className="glass-card items-center pt-1 mt-3">
              <div className="rounded-[16px] p-6 bg-gradient-to-br from-white/6 to-black/10 items-center justify-center flex">
                <Link href={blogs.cta?.href || "/blogs"} className="w-full">
                  <button className="glass-btn w-full rounded-[24px] py-3 text-sm text-white/95">
                    {blogs.cta?.label || "View All Blogs"}
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            <p className="text-[20px] text-[#bbbbbb] max-w-[362px]">
              {blogs.sectionSubtitle}
            </p>
            {p(4) && <Card post={p(4)} />}
            {p(5) && <Card post={p(5)} />}
          </div>
        </div>
      </div>
    </section>
  );
}
