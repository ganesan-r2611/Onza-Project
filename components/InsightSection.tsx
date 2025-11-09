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

/** FIXED CARD: clip + content locked inside the image box, safe truncation */
function Card({ post }: { post: BlogPost }) {
  const img = imageMap[post.imageKey];
  return (
    <article className="relative min-w-0">
      <div
        className={`
    relative isolate rounded-[18px] 2xl:rounded-[1.25vw] overflow-hidden box-border
    w-full aspect-[472/450]               
    max-w-[412.92px]                      
    md:max-w-[437.33px]
    lg:max-w-[437.33px]
    2xl:w-[30.37vw] 2xl:max-w-none         
    2xl:aspect-[472/450]
  `}
      >
        <Image src={img} alt={post.title} fill className="object-cover" />

        <div className="card-overlay pointer-events-none" />
        {/* <div className="card-highlight pointer-events-none" /> */}

        <div
          className="absolute inset-x-0 bottom-0 top-1/3 backdrop-blur-[2px] 2xl:backdrop-blur-[0.14vw] pointer-events-none"
          style={{
            maskImage: "linear-gradient(to top, black 0%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, black 0%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 top-1/4 backdrop-blur-[4px] 2xl:backdrop-blur-[0.28vw] pointer-events-none"
          style={{
            maskImage: "linear-gradient(to top, black 20%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, black 20%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 top-[16.666%] backdrop-blur-[6px] 2xl:backdrop-blur-[0.42vw] pointer-events-none"
          style={{
            maskImage: "linear-gradient(to top, black 40%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, black 40%, transparent 100%)",
          }}
        />

        <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-4 2xl:p-[1.39vw] box-border overflow-hidden">
          <div className="flex justify-between items-start z-10 gap-3 2xl:gap-[1.04vw] w-full min-w-0">
            <div className="inline-block text-[10px] 2xl:text-[0.69vw] px-3 2xl:px-[1.04vw] py-1 2xl:py-[0.35] rounded-[10px] 2xl:rounded-[0.69vw] font-medium transition backdrop-blur-md border border-[#d1b67c]/40 bg-white/10 text-[#ffdc81] hover:bg-white/20 whitespace-nowrap overflow-hidden text-ellipsis max-w-[60%]">
              {post.category}
            </div>
            <p className="text-[#FBFBFB] text-[10px] 2xl:text-[0.69vw] font-regular truncate max-w-[40%]">
              {post.date} &bull; {post.readTime}
            </p>
          </div>

          <div className="relative flex flex-col justify-end flex-1 min-h-0 overflow-hidden">
            <div className="relative z-10 w-full min-w-0">
              <h3 className="text-[18px] md:text-[20px] lg:text-[22px] 2xl:text-[1.53vw] leading-[1.2] text-white font-light mb-2 2xl:mb-[0.69vw] line-clamp-2">
                {post.title}
              </h3>
              <p className="text-[12px] md:text-[13px] lg:text-[14px] 2xl:text-[0.97vw] text-white/80 mb-3 2xl:mb-[1.04vw] line-clamp-2">
                {post.excerpt}
              </p>
              <Link
                href={""}
                onClick={(e) => e.preventDefault()}
                className="inline-block underline underline-offset-4 decoration-2 text-[12px] md:text-[13px] lg:text-[14px] 2xl:text-[0.97vw] font-light text-[#F2E9DA] hover:text-[#ffdc81] whitespace-nowrap"
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

/** SECTION: adds min-w-0 on columns/containers to prevent overflow, keeps content fixed */
export default function InsightsSection({ blogs }: { blogs: BlogsData }) {
  const posts = blogs.posts || [];
  const p = (i: number) => posts[i] ?? null;

  return (
    <section className="bg-[#121819] pt-16 2xl:pt-[5.56vw] pb-20 2xl:pb-[6.94vw]" data-theme="light">
      <div
        className="mx-auto px-3 sm:px-4 md:px-6 lg:px-10 2xl:px-[3.47vw]
                   max-w-[1440px] xl:max-w-[1536px] 2xl:max-w-[100vw]
                   min-w-0"
      >
        {/* Mobile */}
        <div className="flex flex-col gap-4 sm:gap-6 2xl:gap-[2.08vw] md:hidden min-w-0">
          <h2 className="text-[24px] sm:text-[28px] 2xl:text-[1.94vw] font-light text-[#FBFBFB] leading-tight">
            Insights <br /> Unlocked
          </h2>
          <p className="text-[16px] sm:text-[18px] 2xl:text-[1.25vw] text-[#bbbbbb] max-w-full sm:max-w-[362px] 2xl:max-w-[25.14vw]">
            {blogs.sectionSubtitle}
          </p>
          {[0, 1, 2, 3, 4, 5].map(
            (i) => p(i) && <Card key={p(i)!.id ?? i} post={p(i)!} />
          )}
          <div className="glass-card items-center pt-1 mt-3">
            <div className="rounded-[16px] p-4 sm:p-6 bg-gradient-to-br from-white/6 to-black/10">
              <Link
                href={""}
                onClick={(e) => e.preventDefault()}
                className="w-full"
              >
                <button className="glass-btn w-full rounded-[24px] py-3 text-sm text-white/95">
                  {blogs.cta?.label || "View All Blogs"}
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tablet */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-4 lg:gap-6 mx-auto min-w-0">
          <div className="flex flex-col gap-4 lg:gap-6 min-w-0">
            <div className="flex flex-col gap-3 lg:gap-4 mb-4 min-w-0">
              <h2 className="text-[28px] lg:text-[32px] font-light text-[#FBFBFB] leading-tight">
                <span className="block">Insights</span>
                <span className="block">Unlocked</span>
              </h2>
              <p className="text-[16px] lg:text-[18px] text-[#bbbbbb] max-w-full lg:max-w-[300px]">
                {blogs.sectionSubtitle}
              </p>
            </div>
            {p(0) && <Card post={p(0)!} />}
            {p(1) && <Card post={p(1)!} />}
            {p(2) && <Card post={p(2)!} />}
          </div>

          <div className="flex flex-col gap-6 lg:gap-8 min-w-0">
            {p(3) && <Card post={p(3)!} />}
            {p(4) && <Card post={p(4)!} />}
            {p(5) && <Card post={p(5)!} />}
            <div className="glass-card items-center pt-1 mt-3">
              <div className="rounded-[16px] p-4 lg:p-6 bg-gradient-to-br from-white/6 to-black/10">
                <Link
                  href={""}
                  onClick={(e) => e.preventDefault()}
                  className="w-full"
                >
                  <button className="glass-btn w-full rounded-[24px] py-3 text-sm text-white/95">
                    {blogs.cta?.label || "View All Blogs"}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden lg:grid grid-cols-3 gap-6 2xl:gap-[2.08vw] mx-auto min-w-0 items-start">
          <div className="flex flex-col gap-6 2xl:gap-[2.08vw] min-w-0">
            <h2
              className="text-[32px] xl:text-[38px] 2xl:text-[2.64vw]
                         font-light text-[#FBFBFB] leading-tight
                         max-w-full xl:max-w-[437px] pb-4 xl:pb-6 2xl:pb-[2.08vw]"
            >
              <span className="block">Insights</span>
              <span className="block">Unlocked</span>
            </h2>
            {p(0) && <Card post={p(0)!} />}
            {p(1) && <Card post={p(1)!} />}
          </div>

          <div className="flex flex-col gap-6 2xl:gap-[2.08vw] min-w-0">
            {p(2) && <Card post={p(2)!} />}
            {p(3) && <Card post={p(3)!} />}
            <div className="glass-card items-center pt-1 2xl:pt-[0.35vw] mt-3 2xl:mt-[1.04vw]">
              <div className="rounded-[16px] p-6 xl:p-8 bg-gradient-to-br from-white/6 to-black/10 items-center justify-center flex">
                <Link
                  href={""}
                  onClick={(e) => e.preventDefault()}
                  className="w-full"
                >
                  <button className="glass-btn w-full rounded-[24px] 2xl:rounded-[1.67vw] py-3 xl:py-4 2xl:py-[1.39vw] text-sm xl:text-base 2xl:text-[1.39vw] text-white/95">
                    {blogs.cta?.label || "View All Blogs"}
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 2xl:gap-[2.08vw] min-w-0">
            <p className="text-[18px] xl:text-[20px] 2xl:text-[1.39vw] text-[#bbbbbb] max-w-full xl:max-w-[362px] leading-[2.08vw] self-end text-left">
              {blogs.sectionSubtitle}
            </p>
            {p(4) && <Card post={p(4)!} />}
            {p(5) && <Card post={p(5)!} />}
          </div>
        </div>
      </div>
    </section>
  );
}