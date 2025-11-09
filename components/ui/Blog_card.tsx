import React from "react";
import { imageMap } from "@/libs/imageMap";

interface BlogCardProps {
  post: {
    id: number;
    category: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    imageKey: string;
    author?: string;
    isFeatured?: boolean;
  };
  variant?: "featured" | "standard" | "discover";
  placeholderImage?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  post,
  variant = "standard",
  placeholderImage = "/blog-card-placeholder.jpg",
}) => {
  const imageSrc =
    imageMap[post.imageKey as keyof typeof imageMap] || placeholderImage;

  if (variant === "featured") {
    return (
      <div className="group w-full lg:w-[23.33vw] flex-1 rounded-[4.44vw] lg:rounded-[1.11vw] overflow-hidden relative bg-cover bg-center bg-no-repeat cursor-pointer">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-150"
          style={{
            backgroundImage: `url(${
              typeof imageSrc === "string"
                ? imageSrc
                : imageSrc?.src || placeholderImage
            })`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-all duration-700 ease-out group-hover:from-black/40 group-hover:to-black/20"></div>
        <div className="relative flex h-[443px] lg:min-h-[30.76vw] flex-col justify-between p-[4.44vw] lg:p-[1.67vw]">
          {/* Top: Category and Date */}
          <div className="flex justify-between items-center">
            <div className="backdrop-filter backdrop-blur-[9.81vw] lg:backdrop-blur-[9.81vw] rounded-[2.22vw] lg:rounded-[0.44vw] border-[#ffeec0] border-[0.14vw] lg:border-[0.07vw] px-[2.22vw] lg:px-[0.83vw] py-[1.11vw] lg:py-[0.28vw] inline-flex items-center justify-center">
              <span className="text-[2.78vw] lg:text-[0.69vw] font-medium text-[#ffeec0] leading-[3.89vw] lg:leading-[1.04vw]">
                {post.category}
              </span>
            </div>
            <div className="flex items-center gap-[2.22vw] lg:gap-[0.56vw] text-[10px] lg:text-[0.69vw] font-medium text-[#fbfbfb]">
              <span>{post.date}</span>
              <div className="w-[4px] lg:w-[0.28vw] h-[4px] lg:h-[0.28vw] rounded-full bg-[#fbfbfb]"></div>
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Bottom: Content */}
          <div
            className="absolute inset-x-0 bottom-0 top-1/3 backdrop-blur-[2px] pointer-events-none"
            style={{
              maskImage: "linear-gradient(to top, black 0%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to top, black 0%, transparent 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 top-1/4 backdrop-blur-[4px] pointer-events-none"
            style={{
              maskImage: "linear-gradient(to top, black 20%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to top, black 20%, transparent 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 top-[16.666%] backdrop-blur-[6px] pointer-events-none"
            style={{
              maskImage: "linear-gradient(to top, black 40%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to top, black 40%, transparent 100%)",
            }}
          />
          <div className="relative flex flex-col gap-[8px] lg:gap-[1.11vw]">
            <h3 className="text-[20px] lg:text-[1.25vw] font-regular text-[#fbfbfb] leading-[24px] lg:leading-[1.67vw]">
              {post.title}
            </h3>
            <p className="text-[14px] lg:text-[0.83vw] font-light text-[#e8e8e8] leading-[21px] lg:leading-[1.46vw]">
              {post.excerpt}
            </p>
            <div className="flex flex-col items-start gap-[1.11vw] lg:gap-[0.14vw] group cursor-pointer">
              <div className="flex flex-col items-center transition-all duration-300 ease-in-out group-hover:text-[#ffeec0]">
                <span className="text-[14px] lg:text-[0.97vw] font-light text-[#fbfbfb] leading-[21px] lg:leading-[1.46vw] transition-all duration-300 ease-in-out group-hover:text-[#ffeec0]">
                  Read More
                </span>
                <div className="w-full h-[0.56vw] lg:h-[0.14vw] rounded-[0.28vw] lg:rounded-[0.07vw] bg-[#fbfbfb] transition-all duration-300 ease-in-out group-hover:bg-[#ffeec0]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard variant for discover section
  return (
    <div className="group w-full flex-1 rounded-[4.44vw] lg:rounded-[1.11vw] overflow-hidden relative bg-cover bg-center bg-no-repeat cursor-pointer">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-150"
        style={{
          backgroundImage: `url(${
            typeof imageSrc === "string"
              ? imageSrc
              : imageSrc?.src || placeholderImage
          })`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-all duration-700 ease-out group-hover:from-black/40 group-hover:to-black/20"></div>
      <div className="relative flex h-[443px] lg:min-h-[30.76vw] flex-col justify-between p-[16px] lg:p-[1.67vw]">
        {/* Top: Category and Date */}
        <div className="flex justify-between items-center">
          <div className="backdrop-filter backdrop-blur-[9.81vw] lg:backdrop-blur-[9.81vw] rounded-[2.22vw] lg:rounded-[0.44vw] border-[#ffeec0] border-[0.14vw] lg:border-[0.07vw] px-[2.22vw] lg:px-[0.83vw] py-[1.11vw] lg:py-[0.28vw] inline-flex items-center justify-center">
            <span className="text-[10px] lg:text-[0.76vw] font-medium text-[#ffeec0] leading-[15px] lg:leading-[1.04vw]">
              {post.category}
            </span>
          </div>
          <div className="flex items-center gap-[2.22vw] lg:gap-[0.56vw] text-[10px] lg:text-[0.76vw] font-medium text-[#fbfbfb]">
            <span>{post.date}</span>
            <div className="w-[4px] lg:w-[0.28vw] h-[4px] lg:h-[0.28vw] rounded-full bg-[#fbfbfb]"></div>
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Bottom: Content */}
        <div
          className="absolute inset-x-0 bottom-0 top-1/3 backdrop-blur-[2px] pointer-events-none"
          style={{
            maskImage: "linear-gradient(to top, black 0%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, black 0%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 top-1/4 backdrop-blur-[4px] pointer-events-none"
          style={{
            maskImage: "linear-gradient(to top, black 20%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, black 20%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 top-[16.666%] backdrop-blur-[6px] pointer-events-none"
          style={{
            maskImage: "linear-gradient(to top, black 40%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, black 40%, transparent 100%)",
          }}
        />
        <div className="relative flex flex-col gap-[4.44vw] lg:gap-[1.11vw]">
          <h3 className="text-[20px] 2xl:text-[1.39vw]  font-regular text-[#fbfbfb] leading-[24px] lg:leading-[1.67vw]">
            {post.title}
          </h3>
          <p className="text-[14px] lg:text-[0.97vw] 2xl:text-[0.97vw] font-light text-[#e8e8e8] leading-[24px] lg:leading-[1.46vw]">
            {post.excerpt}
          </p>
          <div className="flex flex-col items-start gap-[1.11vw] lg:gap-[0.14vw] group cursor-pointer">
            <div className="flex flex-col items-center transition-all duration-300 ease-in-out group-hover:text-[#ffeec0]">
              <span className="text-[14px] lg:text-[0.97vw] font-light text-[#fbfbfb] leading-[21px] lg:leading-[1.46vw] transition-all duration-300 ease-in-out group-hover:text-[#ffeec0]">
                Read More
              </span>
              <div className="w-full h-[0.56vw] lg:h-[0.14vw] rounded-[0.28vw] lg:rounded-[0.07vw] bg-[#fbfbfb] transition-all duration-300 ease-in-out group-hover:bg-[#ffeec0]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
