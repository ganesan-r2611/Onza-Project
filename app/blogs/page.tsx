// app/blog/page.tsx
import Image from "next/image";
import { imageMap } from "@/libs/imageMap";
import { getStaticData } from "@/libs/getStaticData";
import BlogCard from "@/components/ui/Blog_card";
import CategoryTabs from "@/components/ui/CategoryTab";
import NewsletterForm from "@/components/ui/NewsletterForm";

export default async function Blog() {
  const staticData = await getStaticData();
  const data = staticData.blogData;

  return (
    <div className="relative w-full min-h-screen bg-[#CCC1B4]">
      {/* Unified Hero Section */}
      <section
        className="w-full flex flex-col lg:flex-row items-center justify-between px-[16px] lg:px-[2.78vw] py-[80px] lg:py-[11.11vw] gap-[40px] lg:gap-[1.39vw]"
        style={{
          backgroundImage: `url(${
            typeof imageMap[
              data.heroSection.backgroundImage as keyof typeof imageMap
            ] === "string"
              ? imageMap[
                  data.heroSection.backgroundImage as keyof typeof imageMap
                ]
              : (
                  imageMap[
                    data.heroSection.backgroundImage as keyof typeof imageMap
                  ] as any
                )?.src || "/fallback-image.jpg"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Hero Image - Top on mobile, Right on desktop */}
        <Image
          src={
            imageMap[data.heroSection.image as keyof typeof imageMap] ||
            "/blog-hero-placeholder.jpg"
          }
          alt="Onza Wealth Journal"
          width={688}
          height={346}
          className="w-full lg:w-[47.78vw] h-[53.33vw] lg:h-[24.03vw] rounded-[4.44vw] lg:rounded-[1.67vw] object-cover lg:order-2"
        />

        {/* Content Container */}
        <div className="w-full lg:w-[38.33vw] flex flex-col items-start justify-center gap-[4.44vw] lg:gap-[1.67vw] max-w-full lg:max-w-[52.08vw] lg:order-1">
          <div className="w-full text-[18px] lg:text-[1.25vw] font-regular text-[#0a0a0a] leading-[24px] lg:leading-[1.67vw]">
            {data.heroSection.title}
          </div>

          {/* Main Heading */}
          <div className="w-full flex flex-col items-start justify-center">
            <div className="w-full text-[32px] lg:text-[2.22vw] font-light text-[#0a0a0a] leading-[36px] lg:leading-[2.5vw]">
              <p className="m-0">
                {data.heroSection.heading.split(" ")[0]}{" "}
                {data.heroSection.heading.split(" ")[1]}
              </p>
              <p className="m-0">
                {data.heroSection.heading.split(" ")[2]}{" "}
                {data.heroSection.heading.split(" ")[3]}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="w-full lg:w-[34.24vw] flex flex-col items-start">
            <div className="w-full lg:w-[34.24vw] text-[14px] lg:text-[0.97vw] font-light text-[#4a4a4a] leading-[16px] lg:leading-[1.11vw]">
              {data.heroSection.description}
            </div>
          </div>

          {/* Hidden CTA */}
          <div className="w-[31.11vw] lg:w-[7.85vw] h-[10vw] lg:h-[2.5vw] hidden flex-col items-start" />

          {/* Read More Link */}
          <div className="flex flex-col items-center justify-center gap-[1.11vw] lg:gap-[0.14vw]">
            <div className="text-[18px] lg:text-[1.11vw] font-regular text-[#0a0a0a] leading-[24px] lg:leading-[1.67vw]">
              {data.heroSection.cta.text}
            </div>
            <div className="w-full h-[0.56vw] lg:h-[0.28vw] rounded-[0.28vw] lg:rounded-[0.07vw] bg-[#0a0a0a]" />
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="w-full bg-gradient-to-br from-[#13181c] to-[#0a5060] px-[16px] lg:px-[2.78vw] py-[80px] lg:py-[8.33vw]">
        <div className="mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-[24px] lg:gap-[1.67vw] mb-[16px] lg:mb-[5.83vw]">
            <h2 className="text-[24px] lg:text-[2.64vw] font-light text-[#fbfbfb] leading-[24.6px] lg:leading-[3.06vw]">
              {data.featuredSection.title.split(" ")[0]}{" "}
              <br className="hidden lg:inline" />
              {data.featuredSection.title.split(" ")[1]}
            </h2>
            <p className="text-[18px] lg:text-[1.25vw] font-light text-[#fbfbfb] leading-[24px] lg:leading-[1.67vw] lg:w-[30.35vw]">
              {data.featuredSection.description}
            </p>
          </div>

          {/* Featured Cards Container */}
          <div className="flex flex-col lg:flex-row gap-[16px] lg:gap-[1.11vw]">
            {/* Main Featured Card */}
            <div className="rounded-[4.44vw] lg:rounded-[1.67vw] overflow-hidden flex flex-col lg:flex-row bg-[#f2e9da]">
              {/* Image Section - Top on mobile, Right on desktop */}
              <div className="w-full lg:w-[23.33vw] lg:order-2">
                <Image
                  src={
                    imageMap[
                      data.featuredSection.featuredPosts[0]
                        .imageKey as keyof typeof imageMap
                    ] || "/blog-placeholder.jpg"
                  }
                  alt="Featured Blog"
                  width={336}
                  height={443}
                  className="w-full h-full object-cover rounded-t-[4.44vw] lg:rounded-t-none lg:rounded-r-[1.11vw]"
                />
              </div>

              {/* Content Section - Bottom on mobile, Left on desktop */}
              <div className="w-full lg:w-[23.33vw] flex flex-col justify-between p-[16px] lg:p-[1.67vw] gap-[4.44vw] lg:gap-[1.67vw] lg:order-1">
                {/* Top: Category and Date */}
                <div className="flex justify-between items-center">
                  <div className="backdrop-filter backdrop-blur-[9.81vw] lg:backdrop-blur-[9.81vw] rounded-[2.22vw] lg:rounded-[0.44vw] bg-[#0a5060] border-[#ffeec0] border-[0.14vw] lg:border-[0.07vw] px-[2.22vw] lg:px-[0.83vw] py-[1.11vw] lg:py-[0.28vw] inline-flex items-center justify-center">
                    <span className="text-[2.78vw] lg:text-[0.69vw] font-medium text-[#ffeec0] leading-[3.89vw] lg:leading-[1.04vw]">
                      {data.featuredSection.featuredPosts[0].category}
                    </span>
                  </div>
                  <div className="flex items-center gap-[2.22vw] lg:gap-[0.56vw] text-[2.78vw] lg:text-[0.69vw] font-medium text-[#0a0a0a]">
                    <span>{data.featuredSection.featuredPosts[0].date}</span>
                    <div className="w-[1.11vw] lg:w-[0.28vw] h-[1.11vw] lg:h-[0.28vw] rounded-full bg-[#0a0a0a]"></div>
                    <span>
                      {data.featuredSection.featuredPosts[0].readTime}
                    </span>
                  </div>
                </div>

                {/* Bottom: Read More */}
                <div className="flex flex-col gap-[4.44vw] lg:gap-[1.11vw]">
                  <h3 className="text-[4.44vw] lg:text-[1.25vw] font-regular text-[#0a0a0a] leading-[6.67vw] lg:leading-[1.67vw]">
                    {data.featuredSection.featuredPosts[0].title}
                  </h3>
                  <p className="text-[3.33vw] lg:text-[0.83vw] font-light text-[#4a4a4a] leading-[4.44vw] lg:leading-[1.46vw]">
                    {data.featuredSection.featuredPosts[0].excerpt}
                  </p>
                  <div className="flex flex-col items-start gap-[1.11vw] lg:gap-[0.14vw] group cursor-pointer">
                    <div className="flex flex-col items-center transition-all duration-300 ease-in-out group-hover:text-[#0a5060]">
                      <span className="text-[3.89vw] lg:text-[0.97vw] font-light text-[#0a0a0a] leading-[5.56vw] lg:leading-[1.46vw] transition-all duration-300 ease-in-out group-hover:text-[#0a5060]">
                        Read More
                      </span>
                      <div className="w-full h-[0.56vw] lg:h-[0.14vw] rounded-[0.28vw] lg:rounded-[0.07vw] bg-[#0a0a0a] transition-all duration-300 ease-in-out group-hover:bg-[#0a5060]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Blog Cards */}
            <div className="flex flex-col lg:flex-row gap-[4.44vw] lg:gap-[1.11vw]">
              {/* Blog Card 1 */}
              <BlogCard
                post={data.featuredSection.featuredPosts[1]}
                variant="featured"
              />

              {/* Blog Card 2 */}
              <BlogCard
                post={data.featuredSection.featuredPosts[2]}
                variant="featured"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Discover Knowledge Section */}
      <section className="w-full bg-[#fbfbfb] px-0 pt-[80px]">
        <div className="w-full flex flex-col items-start gap-[40px]">
          {/* Header Section */}
          <div className="w-full flex flex-col items-center gap-[24px]">
            <div className="w-full text-[20px] lg:text-[1.39vw] text-[#0a0a0a] text-center leading-[24px] lg:leading-[1.67vw]">
              {data.discoverSection.title}
            </div>
            <div className="w-full lg:w-[700px] 2xl:w-[50vw] text-[24px] lg:text-[2.64vw] text-[#0a5060] text-center font-light leading-[24.6px] lg:leading-[3.06vw] px-4">
              {data.discoverSection.subtitle}
            </div>
          </div>

          {/* Categories and Blog Cards */}
          <CategoryTabs
            categories={data.discoverSection.categories}
            posts={data.discoverSection.posts}
            ctaText={data.discoverSection.cta.text}
          />
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section className="relative w-full h-full py-20 md:py-16 lg:py-20 2xl:py-[6.94vw]">
        {/* Background with overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${
              typeof imageMap.subscribe_bg === "string"
                ? imageMap.subscribe_bg
                : imageMap.subscribe_bg?.src || "/subscribe_bg.png"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Black overlay - only on the background */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                      to bottom,
                      rgba(0, 0, 0, 0.2) 0%,
                      rgba(0, 0, 0, 0.2) 33%,
                      rgba(0, 0, 0, 0.2) 66%,
                      rgba(0, 0, 0, 1) 100%
                    )`,
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full mx-auto px-6 sm:px-8 lg:px-[120px] 2xl:px-[8.33vw] flex flex-col lg:flex-row items-center gap-16 lg:gap-24 2xl:gap-[8.33vw]">
          {/* Left: Text Content */}
          <div className="w-full lg:w-[540px] 2xl:w-[37.5vw] flex flex-col items-start gap-6 2xl:gap-[2.08vw]">
            <div className="w-full">
              <div className="text-[20px] 2xl:text-[1.39vw] font-regular text-[#ffdc81] leading-[24px] 2xl:leading-[1.67vw]">
                Keen to connect?
              </div>
            </div>

            <div className="w-full">
              <div className="text-[clamp(2rem,5vw,3.5rem)] 2xl:text-[3.33vw]  font-light text-[#fbfbfb] leading-[52.9px] 2xl:leading-[3.67vw]">
                <p className="m-0">Get More Insights Delivered Straight to</p>
                <p className="m-0">Your Inbox</p>
              </div>
            </div>
          </div>

          {/* Right: Email Subscription Form */}
          <div className="w-full lg:flex-1 flex items-center">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
