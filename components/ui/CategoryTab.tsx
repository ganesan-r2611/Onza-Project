// components/CategoryTabs.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
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
  const [indicatorPosition, setIndicatorPosition] = useState({
    left: 0,
    width: 0,
  });
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (categoryName: string, index: number) => {
    if (categoryName === activeCategory || isTransitioning) return;

    setIsTransitioning(true);
    setActiveCategory(categoryName);

    // Calculate indicator position based on actual tab element
    const tabElement = tabRefs.current[index];
    if (tabElement && tabsContainerRef.current) {
      const containerRect = tabsContainerRef.current.getBoundingClientRect();
      const tabRect = tabElement.getBoundingClientRect();

      const left = tabRect.left - containerRect.left;
      const width = tabRect.width;

      setIndicatorPosition({ left, width });
    }

    // Scroll to center the active tab on mobile
    if (scrollContainerRef.current && tabRefs.current[index]) {
      const tab = tabRefs.current[index];
      if (tab) {
        const container = scrollContainerRef.current;
        const tabLeft = tab.offsetLeft;
        const tabWidth = tab.offsetWidth;
        const containerWidth = container.offsetWidth;
        
        const scrollPosition = tabLeft - (containerWidth / 2) + (tabWidth / 2);
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  // Initialize indicator position on first render
  useEffect(() => {
    const initialIndex = categories.findIndex(
      (cat) => cat.name === "All Blogs"
    );
    if (initialIndex !== -1) {
      const tabElement = tabRefs.current[initialIndex];
      if (tabElement && tabsContainerRef.current) {
        const containerRect = tabsContainerRef.current.getBoundingClientRect();
        const tabRect = tabElement.getBoundingClientRect();

        const left = tabRect.left - containerRect.left;
        const width = tabRect.width;

        setIndicatorPosition({ left, width });
      }
    }
  }, [categories]);

  const filteredPosts =
    activeCategory === "All Blogs"
      ? posts
      : posts.filter((post) => post.category === activeCategory);

  return (
    <div className="w-full min-h-full flex flex-col items-start text-[#4a4a4a]">
      {/* Categories Navigation with Horizontal Scroll */}
      <div className="w-full backdrop-filter backdrop-blur-[176.6px] bg-[#f2e9da] border border-[rgba(255,255,255,0.13)] relative">
        {/* Scrollable Container for Mobile */}
        <div 
          ref={scrollContainerRef}
          className="lg:hidden overflow-x-auto scrollbar-hide whitespace-nowrap scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <div className="inline-flex min-w-full px-4 pt-4">
            {categories.map((category, index) => (
              <button
                key={category.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                onClick={() => handleCategoryClick(category.name, index)}
                className={`inline-flex rounded-tl-[4.44vw] rounded-tr-[4.44vw] items-center justify-center py-4 px-6 pt-4 pb-2 transition-all duration-300 ease-in-out cursor-pointer text-nowrap mx-1 first:ml-0 last:mr-0 flex-shrink-0 ${
                  activeCategory === category.name
                    ? "bg-[#ffdc81] text-[#0a0a0a] transform scale-100"
                    : ""
                } ${isTransitioning ? "pointer-events-none" : ""}`}
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
        <div
          ref={tabsContainerRef}
          className="hidden lg:flex items-center px-[40px] lg:px-[2.78vw] pt-4 lg:pt-[1.11vw]"
        >
          <div className="w-full flex items-center">
            {categories.map((category, index) => (
              <button
                key={category.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                onClick={() => handleCategoryClick(category.name, index)}
                className={`flex-1 rounded-tl-[4.44vw] lg:rounded-tl-[1.11vw] rounded-tr-[4.44vw] lg:rounded-tr-[1.11vw] flex items-center justify-center py-4 lg:py-[1.11vw] px-4 lg:px-[1.67vw] pt-4 lg:pt-[1.11vw] pb-2 lg:pb-[0.56vw] transition-all duration-300 ease-in-out cursor-pointer text-nowrap ${
                  activeCategory === category.name
                    ? "bg-[#ffdc81] text-[#0a0a0a] transform scale-100"
                    : ""
                } ${isTransitioning ? "pointer-events-none" : ""}`}
                disabled={isTransitioning}
              >
                <div className="lg:text-[1.39vw] leading-5 lg:leading-[1.39vw] font-medium transition-all duration-300">
                  {category.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Indicator Line - Only for Desktop */}
        {/* <div className="hidden lg:block w-full h-0.5 lg:h-[0.14vw] relative bg-[rgba(255,220,129,0.4)]">
          <div
            className="absolute top-0 h-0.5 lg:h-[0.14vw] bg-[#ffdc81] transition-all duration-300 ease-in-out"
            style={{
              left: `${indicatorPosition.left}px`,
              width: `${indicatorPosition.width}px`,
            }}
          />
        </div> */}
      </div>

      {/* Blog Cards Grid */}
      <div className="w-full bg-[#f2e9da] border border-[rgba(255,255,255,0.13)] flex flex-col items-center justify-center py-10 lg:py-[2.78vw] px-4 lg:px-[2.78vw] pb-20 lg:pb-[5.56vw] gap-10 lg:gap-[2.78vw]">
        {/* Blog Cards Grid */}
        <div
          className={`w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-[1.67vw] transition-opacity duration-300 ${
            isTransitioning ? "opacity-50" : "opacity-100"
          }`}
        >
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} variant="standard" />
          ))}
        </div>

        {/* View More Button */}
        <button className="w-full max-w-[404.6px] lg:max-w-[28.1vw] backdrop-filter backdrop-blur-[176.6px] lg:backdrop-blur-[12.26vw] rounded-lg lg:rounded-[0.56vw] bg-[#ffdc81] border border-[#ffdc81] overflow-hidden flex items-center justify-center py-3 lg:py-[0.83vw] px-5 lg:px-[1.39vw] gap-1 lg:gap-[0.28vw] text-center text-sm lg:text-[0.97vw] text-[#0a0a0a] transition-all duration-300 ease-in-out hover:bg-[#ffdc81]/90 hover:scale-105 hover:shadow-lg active:scale-95">
          <div className="flex flex-col items-start">
            <div className="w-full flex flex-col items-center">
              <div className="leading-[27px] lg:leading-[1.88vw] uppercase font-medium">
                {ctaText}
              </div>
            </div>
          </div>
          <div className="w-6 lg:w-[1.67vw] h-6 lg:h-[1.67vw] overflow-hidden hidden flex-col items-center justify-center">
            <div className="w-full h-6 lg:h-[1.67vw] relative"></div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CategoryTabs;