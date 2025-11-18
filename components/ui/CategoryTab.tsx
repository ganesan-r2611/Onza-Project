// components/CategoryTabs.tsx
"use client";

import React, { useState, useRef } from "react";
import BlogCard from "@/components/ui/Blog_card";

interface Post {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  imageKey: string;
  author?: string;
  isFeatured?: boolean;
}

interface Category {
  id: number;
  name: string;
  isActive: boolean;
}

interface CategoryTabsProps {
  categories: Category[];
  posts: Post[];
  ctaText: string;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  posts,
  ctaText,
}) => {
  const [activeCategory, setActiveCategory] = useState("All Blogs");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visiblePostsCount, setVisiblePostsCount] = useState(4);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showEndMessage, setShowEndMessage] = useState(false);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const postsGridRef = useRef<HTMLDivElement | null>(null);
  const loadMoreButtonRef = useRef<HTMLButtonElement | null>(null);

  const mobileTabsRef = useRef<HTMLDivElement | null>(null);
  const desktopTabsRef = useRef<HTMLDivElement | null>(null);
  const tabsOuterRef = useRef<HTMLDivElement | null>(null);

  const filteredPosts =
    activeCategory === "All Blogs"
      ? posts
      : posts.filter((post) => post.category === activeCategory);

  const displayedPosts = filteredPosts.slice(0, visiblePostsCount);

  const hasMorePosts = visiblePostsCount < filteredPosts.length;

  const handleCategoryClick = async (categoryName: string, index: number) => {
    if (categoryName === activeCategory || isTransitioning) return;

    setIsTransitioning(true);
    setShowEndMessage(false);

    if (postsGridRef.current) {
      postsGridRef.current.style.opacity = "0.5";
      postsGridRef.current.style.transform = "translateY(20px)";
    }

    await new Promise((res) => setTimeout(res, 120));

    setActiveCategory(categoryName);
    setVisiblePostsCount(4);

    const container = scrollContainerRef.current;
    const tab = tabRefs.current[index];

    if (container && tab) {
      const prevPointer = container.style.pointerEvents;
      container.style.pointerEvents = "none";

      try {
        tab.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      } catch (e) {
        const tabLeft = tab.offsetLeft;
        const tabWidth = tab.offsetWidth;
        const containerWidth = container.offsetWidth;
        let scrollPosition = tabLeft - containerWidth / 2 + tabWidth / 2;
        const maxScroll = Math.max(
          0,
          container.scrollWidth - container.clientWidth
        );
        if (scrollPosition < 0) scrollPosition = 0;
        if (scrollPosition > maxScroll) scrollPosition = maxScroll;
        container.scrollTo({ left: scrollPosition, behavior: "smooth" });
      }

      setTimeout(() => {
        container.style.pointerEvents = prevPointer || "";
      }, 400);
    }

    setTimeout(() => {
      if (postsGridRef.current) {
        postsGridRef.current.style.opacity = "1";
        postsGridRef.current.style.transform = "translateY(0)";
      }
      setIsTransitioning(false);
    }, 350);
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMorePosts) return;

    setIsLoadingMore(true);

    if (loadMoreButtonRef.current) {
      loadMoreButtonRef.current.style.transform = "scale(0.95)";
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    const newCount = visiblePostsCount + 4;
    setVisiblePostsCount(newCount);

    if (newCount >= filteredPosts.length) {
      setShowEndMessage(true);
    }

    setTimeout(() => {
      setIsLoadingMore(false);
      if (loadMoreButtonRef.current) {
        loadMoreButtonRef.current.style.transform = "scale(1)";
      }
    }, 200);
  };

  return (
    <div className="w-full min-h-full flex flex-col items-start text-[#4a4a4a]">
      <div
        ref={tabsOuterRef}
        className="w-full backdrop-filter backdrop-blur-[176.6px] bg-[#f2e9da] border border-[rgba(255,255,255,0.13)] relative"
      >
        <div
          ref={scrollContainerRef}
          className="lg:hidden overflow-x-auto scrollbar-hide whitespace-nowrap scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div ref={mobileTabsRef} className="inline-flex min-w-full px-4 pt-4">
            {categories.map((category, index) => (
              <button
                key={category.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                onClick={() => handleCategoryClick(category.name, index)}
                className={`inline-flex rounded-tl-[4.44vw] rounded-tr-[4.44vw] items-center justify-center py-4 px-6 pt-4 pb-2 transition-all duration-300 ease-in-out cursor-pointer text-nowrap mx-1 first:ml-0 last:mr-0 flex-shrink-0 ${
                  activeCategory === category.name
                    ? "bg-[#ffdc81] text-[#0a0a0a] transform scale-105"
                    : "text-[#4a4a4a] hover:bg-[#ffdc81]/50 hover:scale-102"
                } ${isTransitioning ? "pointer-events-none opacity-70" : ""}`}
                disabled={isTransitioning}
              >
                <div className="text-[4vw] font-medium transition-all duration-300">
                  {category.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Tabs (non-scrollable) */}
        <div className="hidden lg:flex items-center px-[40px] lg:px-[2.78vw] pt-4 lg:pt-[1.11vw]">
          <div className="w-full flex items-center" ref={desktopTabsRef}>
            {categories.map((category, index) => (
              <button
                key={category.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                onClick={() => handleCategoryClick(category.name, index)}
                className={`flex-1 rounded-tl-[4.44vw] lg:rounded-tl-[1.11vw] rounded-tr-[4.44vw] lg:rounded-tr-[1.11vw] flex items-center justify-center py-4 lg:py-[1.11vw] px-4 lg:px-[1.67vw] pt-4 lg:pt-[1.5vw] pb-2 lg:pb-[1.5vw] transition-all duration-500 ease-out cursor-pointer text-nowrap ${
                  activeCategory === category.name
                    ? "bg-[#ffdc81] text-[#0a0a0a] transform scale-105 pb-4 lg:pb-[1.5vw]"
                    : "text-[#4a4a4a] hover:bg-[#ffdc81]/30 hover:scale-105 pb-4 lg:pb-[1.5vw]"
                } ${isTransitioning ? "pointer-events-none opacity-70" : ""}`}
                disabled={isTransitioning}
              >
                <div className="lg:text-[1.39vw] leading-5 lg:leading-[1.39vw] font-medium transition-all duration-300">
                  {category.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Baseline + Yellow underline inside same outer so positions are consistent */}
        <div
          className="absolute left-0 right-0 top-full mt-0 pointer-events-none"
          aria-hidden
        >
          <div
            className="absolute h-[2px] transition-transform duration-300"
            style={{
              width: `100%`,
              backgroundColor: "rgba(255, 220, 129, 0.4)",
            }}
          />
          {/* <div
            className="absolute h-[3px] rounded-full transition-transform duration-300"
            style={{
              transform: `translateX(${underline.left}px)`,
              width: `${underline.width}px`,
              backgroundColor: "#ffdc81",
            }}
          /> */}
        </div>
      </div>

      {/* Blog Cards Grid */}
      <div className="w-full bg-[#f2e9da] border border-[rgba(255,255,255,0.13)] flex flex-col items-center justify-center py-10 lg:py-[2.78vw] px-4 lg:px-[2.78vw] pb-20 lg:pb-[5.56vw] gap-10 lg:gap-[2.78vw]">
        {/* Blog Cards Grid with Smooth Transitions */}
        <div
          ref={postsGridRef}
          className={`w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-[1.67vw] transition-all duration-500 ease-out ${
            isTransitioning
              ? "opacity-70 transform translate-y-4"
              : "opacity-100 transform translate-y-0"
          }`}
        >
          {displayedPosts.map((post, index) => (
            <div
              key={post.id}
              className="transition-all duration-500 ease-out"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: isTransitioning
                  ? "none"
                  : `fadeInUp 0.6s ease-out ${index * 100}ms both`,
              }}
            >
              <BlogCard post={post} variant="standard" />
            </div>
          ))}
        </div>

        {/* Loading Animation */}
        {isLoadingMore && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 lg:h-[2.22vw] lg:w-[2.22vw] border-b-2 border-[#ffdc81]"></div>
          </div>
        )}

        {/* View More Button - Only show if there are more posts */}
        {hasMorePosts && !isLoadingMore && (
          <button
            ref={loadMoreButtonRef}
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="w-full max-w-[404.6px] lg:max-w-[28.1vw] backdrop-filter backdrop-blur-[176.6px] lg:backdrop-blur-[12.26vw] rounded-lg lg:rounded-[0.56vw] bg-[#ffdc81] border border-[#ffdc81] overflow-hidden flex items-center justify-center py-3 lg:py-[0.83vw] px-5 lg:px-[1.39vw] gap-1 lg:gap-[0.28vw] text-center text-sm lg:text-[0.97vw] text-[#0a0a0a] transition-all duration-300 ease-out hover:bg-[#ffdc81]/90 hover:scale-105 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="flex flex-col items-start">
              <div className="w-full flex flex-col items-center">
                <div className="leading-[27px] lg:leading-[1.88vw] uppercase font-medium">
                  {isLoadingMore ? "Loading..." : ctaText}
                </div>
              </div>
            </div>
            {!isLoadingMore && (
              <div className="w-6 lg:w-[1.67vw] h-6 lg:h-[1.67vw] overflow-hidden flex-col items-center justify-center hidden lg:flex">
                <div className="w-full h-6 lg:h-[1.67vw] relative transition-transform duration-300 group-hover:translate-x-1"></div>
              </div>
            )}
          </button>
        )}

        {/* End Message with Smooth Appearance */}
        {showEndMessage && filteredPosts.length > 0 && (
          <div className="text-center text-[#4a4a4a] text-sm lg:text-[0.97vw] font-light py-4 transition-all duration-500 ease-out animate-fadeIn">
            <div className="flex items-center justify-center gap-3">
              <span>
                You&apos;ve seen all {filteredPosts.length} posts in{" "}
                {activeCategory.toLowerCase()}
              </span>
            </div>
            <button
              onClick={() => {
                setVisiblePostsCount(4);
                setShowEndMessage(false);
                // Smooth scroll to top
                postsGridRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-3 text-[#0a5060] hover:text-[#0a5060]/80 underline transition-colors duration-300 text-xs lg:text-[0.83vw]"
            >
              Back to top
            </button>
          </div>
        )}

        {/* No Posts Message */}
        {filteredPosts.length === 0 && (
          <div className="text-center text-[#4a4a4a] text-sm lg:text-[0.97vw] font-light py-8 transition-all duration-500">
            <div className="flex flex-col items-center gap-3">
              <span className="text-4xl">📝</span>
              <p>No posts found in {activeCategory}</p>
              <p className="text-xs lg:text-[0.69vw] opacity-70">
                Try selecting a different category
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CategoryTabs;
