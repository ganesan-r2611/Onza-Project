"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { imageMap } from "@/libs/imageMap";

type Pillar = { title: string; desc: string; imageKey: keyof typeof imageMap };
type Props = { data: { eyebrow: string; cta: { label: string; href: string }; items: Pillar[] } };

export default function ServicesCarouselSection({ data }: Props) {
  const { eyebrow, cta, items } = data;
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [targetHorizontalScroll, setTargetHorizontalScroll] = useState(0);
  const [currentHorizontalScroll, setCurrentHorizontalScroll] = useState(0);
  const [mounted, setMounted] = useState(false);

  const isMobileDevice = typeof window !== "undefined" && window.innerWidth < 768;
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    let rafId: number;
    const tick = () => {
      if (!sectionRef.current || !carouselRef.current) { rafId = requestAnimationFrame(tick); return; }
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const vh = window.innerHeight;
      const scrollable = sectionHeight - vh;

      if (sectionTop <= 0 && Math.abs(sectionTop) <= scrollable) {
        const progress = Math.abs(sectionTop) / scrollable;
        const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
        setTargetHorizontalScroll(progress * maxScroll);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    let rafId: number;
    const smooth = () => {
      setCurrentHorizontalScroll(prev => {
        const diff = targetHorizontalScroll - prev;
        const speed = isMobileDevice ? 0.20 : 0.10;
        if (Math.abs(diff) < 0.5) return targetHorizontalScroll;
        return prev + diff * speed;
      });
      rafId = requestAnimationFrame(smooth);
    };
    rafId = requestAnimationFrame(smooth);
    return () => cancelAnimationFrame(rafId);
  }, [mounted, targetHorizontalScroll]);

  useEffect(() => {
    if (carouselRef.current) carouselRef.current.scrollLeft = currentHorizontalScroll;
  }, [currentHorizontalScroll]);

  const CARD_W_DESKTOP = 322;
  const CARD_H_DESKTOP = 438;

  const getSectionHeight = () => {
    if (typeof window === "undefined") return "100vh";
    const gap = 24;
    const itemWidth = isMobileDevice ? 280 : CARD_W_DESKTOP;
    const totalCarouselWidth = items.length * itemWidth + (items.length - 1) * gap;
    const viewportWidthRatio = isMobileDevice ? 0.95 : 0.5; // a touch more visible on phones
    const viewportWidth = window.innerWidth * viewportWidthRatio;
    const scrollableDistance = Math.max(0, totalCarouselWidth - viewportWidth);
    const buffer = isMobileDevice ? 1200 : 800;
    return `${scrollableDistance + window.innerHeight + buffer}px`;
  };

  return (
    <section
      ref={sectionRef}
      className="relative text-[#1a1a1a]"
      style={mounted ? { minHeight: getSectionHeight() } : { minHeight: "100svh" }}
      data-theme="light"
    >
      <div className="sticky top-0 flex items-center overflow-hidden">
        <div className="mx-auto pl-6 sm:px-6 lg:px-[30px] py-10 sm:py-20 lg:pt-[150px] w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-14 items-start">
            {/* Left copy */}
            <div className="lg:col-span-5 px-1">
              <p className="text-[28px] sm:text-2xl md:text-3xl lg:text-[38px] leading-[1.45] sm:leading-[1.4] font-light">
                {eyebrow}
              </p>

              {/* Non–full-width CTA on mobile (override global .glass-border-button width) */}
              <div className="mt-5 sm:mt-8">
                <Link href={cta.href} className="inline-block">
                  <button className="glass-border-button w-[20px] px-6 py-3 text-[15px] sm:text-[16px] text-white">
                    {cta.label}
                  </button>
                </Link>
              </div>
            </div>

            {/* Right carousel (desktop unchanged) */}
            <div className="lg:col-span-7 lg:-mr-[30px]">
              <div
                ref={carouselRef}
                className="flex gap-4 sm:gap-6 overflow-x-scroll scrollbar-hide pe-0"
                style={{ scrollBehavior: "auto" }}
              >
                {items.map((item, i) => (
                  <div
                    key={i}
                    className={[
                      "shrink-0",
                      "w-[272px] xs:w-[272px] sm:w-[272px] md:w-[320px] lg:w-[322px] xl:w-[322px]",
                      i === 0 ? "ml-2 sm:ml-8 lg:ml-14" : "",
                      "mr-4 sm:mr-6 last:mr-2 sm:last:mr-0",
                    ].join(" ")}
                  >
                    <div className="rounded-2xl overflow-hidden shadow-md">
                      <div className="relative h-[496px] xs:h-[496px] sm:h-[496px] md:h-[320px] lg:h-[438px] xl:h-[438px]">
                        <Image
                          src={imageMap[item.imageKey]}
                          alt={item.title}
                          fill
                          priority={i < 2}
                          className="object-cover"
                          sizes="(max-width: 480px) 260px, (max-width: 640px) 300px, (max-width: 1024px) 320px, 322px"
                        />
                      </div>
                    </div>

                    <h4 className="mt-3 pb-1 text-[20px] sm:text-[20px] md:text-[22px] lg:text-[32px] font-normal">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-[18px] sm:text-[18px] md:text-[15px] lg:text-[20px] leading-[20px] sm:leading-[22px] font-light">
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
