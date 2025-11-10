// app/blog/[slug]/page.tsx
import Image from "next/image";
import { imageMap } from "@/libs/imageMap";
import { getStaticData } from "@/libs/getStaticData";
import BlogCard from "@/components/ui/Blog_card";
import NewsletterForm from "@/components/ui/NewsletterForm";

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const staticData = await getStaticData();
  const data = staticData.blogDetails;

  return (
    <section className="relative w-full bg-[#f2e9da]">
      {/* Banner Image Section */}
      <div className="w-full h-[136.67vw] lg:h-[62.5vw] 2xl:h-[62.5vw] overflow-hidden">
        <Image
          src={
            imageMap?.[data.blogDetails.banner.image] || "/fallback-image.jpg"
          }
          alt={data.blogDetails.banner.alt}
          width={data.blogDetails.banner.width}
          height={data.blogDetails.banner.height}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Blog Content Section */}
      <div className="w-full pt-[11.11vw] lg:pt-[2.78vw] 2xl:pt-[2.78vw] lg:pb-[8.33vw] 2xl:pb-[8.33vw]">
        {/* Author Info Section */}
        <div className="flex flex-col lg:flex-row 2xl:flex-row lg:h-[6.81vw] 2xl:h-[6.81vw] justify-between items-start lg:items-center 2xl:items-center gap-[4.44vw] lg:gap-0 2xl:gap-0 mb-[4.44vw] lg:mb-[2.78vw] 2xl:mb-[2.78vw] px-[4.44vw] lg:px-[18.82vw] 2xl:px-[18.82vw] ">
          <div className="flex items-center gap-[2.78vw] lg:gap-[1.39vw] 2xl:gap-[1.39vw]">
            <div className="w-[13.89vw] lg:w-[3.47vw] 2xl:w-[3.47vw] h-[13.89vw] lg:h-[3.47vw] 2xl:h-[3.47vw] rounded-full bg-[#fbfbfb] shadow-lg overflow-hidden">
              <Image
                src={
                  imageMap?.[data.blogDetails.author.avatar] ||
                  "/fallback-image.jpg"
                }
                alt={data.blogDetails.author.name}
                width={46}
                height={46}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[2.78vw] lg:text-[0.69vw] 2xl:text-[0.69vw] text-[#777] leading-[5vw] lg:leading-[1.04vw] 2xl:leading-[1.04vw]">
                {data.blogDetails.author.role}
              </span>
              <span className="text-[2.78vw] lg:text-[0.83vw] 2xl:text-[0.83vw] font-medium text-[#777] leading-[6.67vw] lg:leading-[1.25vw] 2xl:leading-[1.25vw] text-nowrap">
                {data.blogDetails.author.name}
              </span>
            </div>
          </div>

          <div className="flex flex-row justify-between items-center w-full lg:flex-col 2xl:flex-col lg:h-[51px] 2xl:h-[51px] lg:items-end 2xl:items-end lg:justify-between 2xl:justify-between">
            <span className="text-[2.78vw] lg:text-[0.83vw] 2xl:text-[0.83vw] font-medium text-[#777] leading-[3.19vw] lg:leading-[1.25vw] 2xl:leading-[1.25vw]">
              {data.blogDetails.author.date}
            </span>
            <div className="flex items-center gap-[1.11vw] lg:gap-[0.56vw] 2xl:gap-[0.56vw] text-[2.78vw] lg:text-[0.83vw] 2xl:text-[0.83vw] font-regular text-[#777]">
              <span>{data.blogDetails.author.share.text}</span>
              <Image
                src={
                  imageMap?.[data.blogDetails.author.share.image] ||
                  "/fallback-image.jpg"
                }
                alt="Share"
                width={16}
                height={16}
                className="w-[4.44vw] lg:w-[1.11vw] 2xl:w-[1.11vw] h-[4.44vw] lg:h-[1.11vw] 2xl:h-[1.11vw]"
              />
            </div>
          </div>
        </div>

        {/* Blog Title Section */}
        <div className=" w-full flex flex-col gap-[4.44vw] lg:gap-[1.11vw] 2xl:gap-[1.11vw] mb-[8.33vw] lg:mb-[2.22vw] 2xl:mb-[2.22vw] px-[4.44vw] lg:px-[18.82vw] 2xl:px-[18.82vw]">
          <div className="backdrop-filter backdrop-blur-[9.81vw] lg:backdrop-blur-[9.81vw] 2xl:backdrop-blur-[9.81vw] rounded-[2.22vw] lg:rounded-[0.56vw] 2xl:rounded-[0.56vw] bg-[#ffdc81] border border-[#ffeec0] px-[4.33vw] lg:px-[0.83vw] 2xl:px-[0.83vw] py-[0.11vw] lg:py-[0.28vw] 2xl:py-[0.28vw] w-max">
            <span className="text-[3.33vw] lg:text-[0.69vw] 2xl:text-[0.69vw] font-medium text-[#0a0a0a] leading-[4vw] lg:leading-[0.04vw] 2xl:leading-[0.04vw]">
              {data.blogDetails.metadata.category}
            </span>
          </div>

          <span className=" relative text-[11.11vw] lg:text-[4.44vw] 2xl:text-[4.44vw] font-light text-[#0a5060] leading-[6.78vw] lg:leading-[48px] 2xl:leading-[48px]">
            {data.blogDetails.metadata.mainTitle}
          </span>

          <span className="text-[11.11vw] lg:text-[4.44vw] 2xl:text-[4.44vw] font-light text-[#0a5060] leading-[12.78vw] lg:leading-[48px] 2xl:leading-[48px]">
            {data.blogDetails.metadata.subtitle}
          </span>
        </div>

        {/* Introduction Paragraph */}
        <div className="mb-[11.11vw] lg:mb-[5.56vw] 2xl:mb-[5.56vw] px-[4.44vw] lg:px-[2.78vw] 2xl:px-[2.78vw]">
          <div className="lg:pl-[24.03vw] 2xl:pl-[24.03vw] lg:pr-[18.82vw] 2xl:pr-[18.82vw]">
            <p className="lg:w-[667px] 2xl:w-[667px] text-[5vw] lg:text-[1.81vw] 2xl:text-[1.81vw] font-light text-[#0a0a0a] leading-[5.75vw] lg:leading-[2.08vw] 2xl:leading-[2.08vw] lg:text-left 2xl:text-left">
              {data.blogDetails.introduction.content}
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="flex flex-col gap-[11.11vw] lg:gap-[2.78vw] 2xl:gap-[2.78vw] px-[4.44vw] lg:px-[2.78vw] 2xl:px-[2.78vw] mb-[11.11vw] lg:mb-[2.78vw] 2xl:mb-[2.78vw]">
          {data.blogDetails.sections.map((section) => (
            <div
              key={section.id}
              className="lg:px-[24.03vw] 2xl:px-[24.03vw] flex flex-col gap-[4.44vw] lg:gap-[1.11vw] 2xl:gap-[1.11vw]"
            >
              <h3 className="text-[7.78vw] lg:text-[3.19vw] 2xl:text-[3.19vw] font-light text-[#0a0a0a] leading-[8.94vw] lg:leading-[3.67vw] 2xl:leading-[3.67vw]">
                {section.title}
              </h3>
              <p className="text-[3.89vw] lg:text-[1.11vw] 2xl:text-[1.11vw] font-regular lg:font-light 2xl:font-light text-[#606060] leading-[4.44vw] lg:leading-[1.67vw] 2xl:leading-[1.67vw]">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Full Width Image with Quote */}
        <div className="my-[11.11vw] lg:my-[2.78vw] 2xl:my-[2.78vw] px-[4.44vw] lg:px-[18.82vw] 2xl:px-[18.82vw]">
          <div className="w-full h-[79.44vw] lg:h-[20.07vw] 2xl:h-[20.07vw] overflow-hidden mb-[11.11vw] lg:mb-[2.78vw] 2xl:mb-[2.78vw]">
            <Image
              src={
                imageMap?.[data.blogDetails.fullWidthQuote.image] ||
                "/fallback-image.jpg"
              }
              alt={data.blogDetails.fullWidthQuote.alt}
              width={data.blogDetails.fullWidthQuote.width}
              height={data.blogDetails.fullWidthQuote.height}
              className="w-full h-full object-cover scale-[2]"
            />
          </div>

          <div className="lg:px-[7.99vw] 2xl:px-[7.99vw]">
            <div className="border-l-[0.56vw] lg:border-l-[0.07vw] 2xl:border-l-[0.07vw] border-[#ffdc81] pl-[4.44vw] lg:pl-[1.67vw] 2xl:pl-[1.67vw]">
              <blockquote className="text-[5.56vw] lg:text-[2.22vw] 2xl:text-[2.22vw] font-light text-[#0a5060] leading-[5.39vw] lg:leading-[3.06vw] 2xl:leading-[3.06vw] mb-[4.44vw] lg:mb-[1.39vw] 2xl:mb-[1.39vw]">
                <span className="text-[#0a5060] italic">“ </span>
                {data.blogDetails.fullWidthQuote.quote}
                <span className="text-[#0a5060] italic">”</span>
              </blockquote>
              <cite className="text-[3.89vw] lg:text-[0.97vw] 2xl:text-[0.97vw] font-light text-[#777] leading-[5.56vw] lg:leading-[1.46vw] 2xl:leading-[1.46vw] not-italic">
                {data.blogDetails.fullWidthQuote.author}
              </cite>
            </div>
          </div>
        </div>

        {/* Additional Content */}
        <div className="lg:pt-[2.78vw] 2xl:pt-[2.78vw] px-[4.44vw] lg:px-[2.78vw] 2xl:px-[2.78vw] lg:pb-[1.39vw] 2xl:pb-[1.39vw]">
          <div className="flex flex-col gap-[4.44vw] lg:gap-[1.11vw] 2xl:gap-[1.11vw] lg:px-[24.03vw] 2xl:px-[24.03vw]">
            {data.blogDetails.additionalContent.map((content) => (
              <p
                key={content.id}
                className="text-[3.89vw] lg:text-[1.11vw] 2xl:text-[1.11vw] font-regular lg:font-light 2xl:font-light text-[#606060] leading-[4.44vw] lg:leading-[1.67vw] 2xl:leading-[1.67vw]"
              >
                {content.content}
              </p>
            ))}
          </div>
        </div>

        {/* Side by Side Image and Quote */}
        <div className="px-[4.44vw] py-[11.11vw] lg:py-[2.78vw] 2xl:py-[2.78vw] lg:px-[18.82vw] 2xl:px-[18.82vw]">
          <div className="flex flex-col lg:flex-row 2xl:flex-row gap-[11.11vw] lg:gap-[2.78vw] 2xl:gap-[2.78vw]">
            <div className="lg:flex-1 2xl:flex-1 h-[106.67vw] lg:h-[26.67vw] 2xl:h-[26.67vw] overflow-hidden">
              <Image
                src={
                  imageMap?.[data.blogDetails.sideBySideSection.image] ||
                  "/fallback-image.jpg"
                }
                alt={data.blogDetails.sideBySideSection.alt}
                width={data.blogDetails.sideBySideSection.width}
                height={data.blogDetails.sideBySideSection.height}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:flex-1 2xl:flex-1 border-l-[0.56vw] lg:border-l-[0.07vw] 2xl:border-l-[0.07vw] border-[#ffdc81] pl-[4.44vw] lg:pl-[1.67vw] 2xl:pl-[1.67vw] gap-[4.44vw] lg:gap-0 2xl:gap-0 flex flex-col justify-between">
              <blockquote className="text-[5.56vw] lg:text-[2.22vw] 2xl:text-[2.22vw] text-left font-regular text-[#0a5060] leading-[6.39vw] lg:leading-[2.64vw] 2xl:leading-[2.64vw]">
                <span className="text-[#0a5060] italic">“ </span>
                {data.blogDetails.sideBySideSection.quote}
                <span className="text-[#0a5060] italic">”</span>
              </blockquote>

              <cite className="text-[3.89vw] lg:text-[0.97vw] 2xl:text-[0.97vw] font-light text-[#777] leading-[5.56vw] lg:leading-[1.46vw] 2xl:leading-[1.46vw] not-italic">
                {data.blogDetails.sideBySideSection.author}
              </cite>
            </div>
          </div>
        </div>

        {/* Final Content Sections */}
        <div className="px-[4.44vw] lg:px-[2.78vw] 2xl:px-[2.78vw] pb-[11.11vw] lg:pb-[2.78vw] 2xl:pb-[2.78vw]">
          <div className="flex flex-col gap-[11.11vw] lg:gap-[2.78vw] 2xl:gap-[2.78vw] lg:px-[24.03vw] 2xl:px-[24.03vw] pt-[5.56vw] lg:pt-[1.39vw] 2xl:pt-[1.39vw]">
            {data.blogDetails.finalSections.map((section) => (
              <div
                key={section.id}
                className="flex flex-col gap-[4.44vw] lg:gap-[1.11vw] 2xl:gap-[1.11vw]"
              >
                {section.type === "heading" && (
                  <h3 className="text-[7.78vw] lg:text-[3.19vw] 2xl:text-[3.19vw] font-light text-[#0a0a0a] leading-[8.94vw] lg:leading-[3.67vw] 2xl:leading-[3.67vw]">
                    {section.title}
                  </h3>
                )}

                {section.type === "paragraphs" &&
                Array.isArray(section.content) ? (
                  section.content.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-[3.89vw] lg:text-[1.11vw] 2xl:text-[1.11vw] font-regular lg:font-light 2xl:font-light text-[#606060] leading-[4.44vw] lg:leading-[1.67vw] 2xl:leading-[1.67vw]"
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-[3.89vw] lg:text-[1.11vw] 2xl:text-[1.11vw] font-regular lg:font-light 2xl:font-light text-[#606060] leading-[4.44vw] lg:leading-[1.67vw] 2xl:leading-[1.67vw]">
                    {typeof section.content === "string" ? section.content : ""}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Author Footer */}
        <div className="flex flex-col lg:flex-row 2xl:flex-row lg:h-[6.81vw] 2xl:h-[6.81vw] justify-between items-start lg:items-center 2xl:items-center gap-[4.44vw] lg:gap-0 2xl:gap-0 mb-[4.44vw] lg:mb-[2.78vw] 2xl:mb-[2.78vw] px-[4.44vw] lg:px-[18.82vw] 2xl:px-[18.82vw] ">
          <div className="flex items-center gap-[2.78vw] lg:gap-[1.39vw] 2xl:gap-[1.39vw]">
            <div className="w-[13.89vw] lg:w-[3.47vw] 2xl:w-[3.47vw] h-[13.89vw] lg:h-[3.47vw] 2xl:h-[3.47vw] rounded-full bg-[#fbfbfb] shadow-lg overflow-hidden">
              <Image
                src={
                  imageMap?.[data.blogDetails.author.avatar] ||
                  "/fallback-image.jpg"
                }
                alt={data.blogDetails.author.name}
                width={46}
                height={46}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[2.78vw] lg:text-[0.69vw] 2xl:text-[0.69vw] text-[#777] leading-[5vw] lg:leading-[1.04vw] 2xl:leading-[1.04vw]">
                {data.blogDetails.author.role}
              </span>
              <span className="text-[2.78vw] lg:text-[0.83vw] 2xl:text-[0.83vw] font-medium text-[#777] leading-[6.67vw] lg:leading-[1.25vw] 2xl:leading-[1.25vw]">
                {data.blogDetails.author.name}
              </span>
            </div>
          </div>

          <div className="flex flex-row justify-between items-center w-full lg:flex-col 2xl:flex-col lg:h-[51px] 2xl:h-[51px] lg:items-end 2xl:items-end lg:justify-between 2xl:justify-between">
            <span className="text-[2.78vw] lg:text-[0.83vw] 2xl:text-[0.83vw] font-medium text-[#777] leading-[3.19vw] lg:leading-[1.25vw] 2xl:leading-[1.25vw]">
              {data.blogDetails.author.date}
            </span>
            <div className="flex items-center gap-[1.11vw] lg:gap-[0.56vw] 2xl:gap-[0.56vw] text-[2.78vw] lg:text-[0.83vw] 2xl:text-[0.83vw] font-regular text-[#777]">
              <span>{data.blogDetails.author.share.text}</span>
              <Image
                src={
                  imageMap?.[data.blogDetails.author.share.image] ||
                  "/fallback-image.jpg"
                }
                alt="Share"
                width={16}
                height={16}
                className="w-[4.44vw] lg:w-[1.11vw] 2xl:w-[1.11vw] h-[4.44vw] lg:h-[1.11vw] 2xl:h-[1.11vw]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Similar Blogs */}
      <section className="hidden lg:block 2xl:block w-full bg-[#121819] px-[16px] lg:px-[8.33vw] 2xl:px-[8.33vw] py-[80px] lg:py-[5.56vw] 2xl:py-[5.56vw]">
        <div className="mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row 2xl:flex-row lg:items-start 2xl:items-start lg:justify-between 2xl:justify-between mb-[16px] lg:mb-[3.89vw] 2xl:mb-[3.89vw]">
            <h2 className="text-[24px] lg:text-[2.64vw] 2xl:text-[2.64vw] font-light text-[#fbfbfb] leading-[24.6px] lg:leading-[3.06vw] 2xl:leading-[3.06vw] lg:w-[20.63vw] 2xl:w-[20.63vw]">
              {data?.featuredSection?.title?.split(" ")[0] || "Similar"}{" "}
              {data?.featuredSection?.title?.split(" ")[1] || "Reads"}
            </h2>
            <p className="text-[18px] lg:text-[1.25vw] 2xl:text-[1.25vw] font-light text-[#BBBBBB] leading-[24px] lg:leading-[1.67vw] 2xl:leading-[1.67vw] lg:w-[30.35vw] 2xl:w-[30.35vw]">
              {data?.featuredSection?.description ||
                "Fresh ideas and strategies"}
            </p>
          </div>

          {/* Featured Cards Container */}
          <div className="flex flex-col lg:flex-row 2xl:flex-row gap-[16px] lg:gap-[1.67vw] 2xl:gap-[1.67vw]">
            {/* Side Blog Cards */}
            <div className="flex flex-col lg:flex-row 2xl:flex-row gap-[4.44vw] lg:gap-[1.67vw] 2xl:gap-[1.67vw]">
              {/* Blog Card 1 */}
              {data?.featuredSection?.featuredPosts?.[0] && (
                <BlogCard
                  post={data.featuredSection.featuredPosts[0]}
                  variant="similar"
                />
              )}

              {/* Blog Card 2 */}
              {data?.featuredSection?.featuredPosts?.[1] && (
                <BlogCard
                  post={data.featuredSection.featuredPosts[1]}
                  variant="similar"
                />
              )}

              {/* Blog Card 3 */}
              {data?.featuredSection?.featuredPosts?.[2] && (
                <BlogCard
                  post={data.featuredSection.featuredPosts[2]}
                  variant="similar"
                />
              )}
            </div>
          </div>
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
        <div className="relative z-10 w-full mx-auto px-6 sm:px-8 lg:px-[120px] 2xl:px-[8.33vw] flex flex-col lg:flex-row 2xl:flex-row items-center gap-16 lg:gap-24 2xl:gap-[8.33vw]">
          {/* Left: Text Content */}
          <div className="w-full lg:w-[540px] 2xl:w-[37.5vw] flex flex-col items-start gap-6 2xl:gap-[2.08vw]">
            <div className="w-full">
              <div className="text-[20px] 2xl:text-[1.39vw] font-regular text-[#ffdc81] leading-[24px] 2xl:leading-[1.67vw]">
                Keen to connect?
              </div>
            </div>

            <div className="w-full">
              <div className="text-[clamp(2rem,5vw,3.5rem)] 2xl:text-[3.33vw]  font-light text-[#fbfbfb] leading-[8.94vw] 2xl:leading-[3.67vw]">
                <p className="m-0">Get More Insights Delivered Straight to</p>
                <p className="m-0">Your Inbox</p>
              </div>
            </div>
          </div>

          {/* Right: Email Subscription Form */}
          <div className="w-full lg:flex-1 2xl:flex-1 flex items-center">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </section>
  );
}