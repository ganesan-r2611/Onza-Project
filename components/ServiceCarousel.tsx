"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { imageMap } from "@/libs/imageMap";

type Pillar = { title: string; desc: string; imageKey: keyof typeof imageMap };

type Props = {
  data: {
    eyebrow: string;
    cta: { label: string; href: string };
    items: Pillar[];
  };
};

export default function ServicesCarouselSection({ data }: Props) {
  const { eyebrow, cta, items } = data;
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [targetHorizontalScroll, setTargetHorizontalScroll] = useState(0);
  const [currentHorizontalScroll, setCurrentHorizontalScroll] = useState(0);
  const [mounted, setMounted] = useState(false);
    // Calculate based on actual carousel content
  const isMobileDevice = typeof window !== "undefined" && (window.innerWidth < 768);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate target scroll position based on vertical scroll
  useEffect(() => {
    if (!mounted) return;

    let rafId: number;

    const handleScroll = () => {
      if (!sectionRef.current || !carouselRef.current) {
        rafId = requestAnimationFrame(handleScroll);
        return;
      }

      const section = sectionRef.current;
      const carousel = carouselRef.current;
      const rect = section.getBoundingClientRect();

      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const scrollableHeight = sectionHeight - viewportHeight;

      if (sectionTop <= 0 && Math.abs(sectionTop) <= scrollableHeight) {
        const scrollProgress = Math.abs(sectionTop) / scrollableHeight;
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        const targetScroll = scrollProgress * maxScroll;
        
        setTargetHorizontalScroll(targetScroll);
      }

      rafId = requestAnimationFrame(handleScroll);
    };

    rafId = requestAnimationFrame(handleScroll);
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [mounted]);

  // Smooth scrolling animation (rubber band effect)
  useEffect(() => {
    if (!mounted) return;

    let rafId: number;

    const smoothScroll = () => {
      setCurrentHorizontalScroll((prev) => {
        const diff = targetHorizontalScroll - prev;
        const speed = isMobileDevice ? 0.15 : 0.09; // Adjust for smoothness (0.03-0.15)
        
        if (Math.abs(diff) < 0.5) {
          return targetHorizontalScroll;
        }
        
        return prev + diff * speed;
      });

      rafId = requestAnimationFrame(smoothScroll);
    };

    rafId = requestAnimationFrame(smoothScroll);
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [mounted, targetHorizontalScroll]);

  // Apply smooth scroll to carousel
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = currentHorizontalScroll;
    }
  }, [currentHorizontalScroll]);

  const getSectionHeight = () => {
  if (typeof window === "undefined") return "100vh";
  
  // Adjust item width and gap based on device
  const itemWidth = isMobileDevice ? 280 : 360;
  const gap = 24;
  const totalCarouselWidth = (items.length * itemWidth) + ((items.length - 1) * gap);
  
  // Viewport width - more conservative on mobile
  const viewportWidthRatio = isMobileDevice ? 0.8 : 0.4; // 80% on mobile, 40% on desktop
  const viewportWidth = window.innerWidth * viewportWidthRatio;
  
  // Scrollable distance needed
  const scrollableDistance = Math.max(0, totalCarouselWidth - viewportWidth);
  
  // Add viewport height plus extra buffer (more buffer on mobile)
  const buffer = isMobileDevice ? 1800 : 800;
  return `${scrollableDistance + window.innerHeight + buffer}px`;
};

  return (
    <section
      ref={sectionRef}
      className="relative w-full text-[#1a1a1a]"
      style={mounted ? { minHeight: getSectionHeight() } : { minHeight: "100svh" }}
      data-theme="light"
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden w-full">
       <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[30px] py-8 sm:py-12">
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-16 items-start">
    {/* Left copy - stays fixed */}
<div className="lg:col-span-5">
  <p className="text-2xl sm:text-xl md:text-2xl lg:text-[26px] leading-[1.4] sm:leading-[1.5] text-[#fff] whitespace-pre-line">
    {eyebrow}
  </p>

  <div className="mt-6 sm:mt-8">
    <Link href={cta.href} className="inline-block">
      <button className="glass-border-button border border-black/10 rounded-full px-5 py-2.5 sm:px-6 sm:py-3 text-[15px] sm:text-[16px] text-[#fff]">
        {cta.label}
      </button>
    </Link>
  </div>
</div>

    {/* Right carousel - scrolls horizontally */}
    <div className="lg:col-span-7 w-full">
      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-hidden w-full"
        style={{ scrollBehavior: 'auto' }}
      >
        {items.map((item, i) => (
  <div
    key={i}
    className={`shrink-0 w-[280px] sm:w-[320px] md:w-[360px] ${
      i === 0 ? 'ml-4 sm:ml-8 lg:ml-14' : ''
    } ${
      i === items.length - 1 ? 'mr-4 sm:mr-8 lg:mr-14' : ''
    }`}
  >
    <div className="rounded-2xl overflow-hidden bg-white/70 border border-black/10 shadow-md">
      <div className="relative h-[300px] sm:h-[350px] md:h-[400px]">
        <Image
          src={imageMap[item.imageKey]}
          alt={item.title}
          fill
          priority={i < 2}
          className="object-cover"
          sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 360px"
        />
      </div>
    </div>

    <h4 className="mt-4 text-[20px] sm:text-[20px] md:text-[24px] text-[#fff] font-normal">
      {item.title}
    </h4>
    <p className="mt-2 text-[15px] sm:text-[14px] md:text-[16px] leading-[22px] sm:leading-[22px] text-[#fafafa]">
      {item.desc}
    </p>
  </div>
))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}