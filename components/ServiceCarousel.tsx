"use client";

import { useState, useEffect } from "react";
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
  horizontalProgress?: number;
  isScrolling?: boolean;
  showIntro?: boolean;
};

export default function ServicesCarouselSection({ data, horizontalProgress = 0, isScrolling = false, showIntro = false }: Props) {
  const { eyebrow, cta, items } = data;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className={`${!showIntro ? "py-10":''} w-full h-full flex items-center bg-[#E5D4C3] backdrop-blur-sm text-[#1a1a1a]`}>
      <div className="w-full h-full flex items-center">
        <div className="w-full flex items-center gap-8">
          {/* Desktop: Show intro text on left */}
          {showIntro && (
            <div className="hidden lg:block lg:w-5/12 flex-shrink-0 pl-4 sm:pl-6 lg:pl-8">
              <p className="text-[32px] lg:text-[38px] xl:text-[42px] leading-[1.2] font-light mb-8">
                {eyebrow}
              </p>
              <Link href={cta.href} className="inline-block">
                <button className="glass-border-button px-8 py-4 text-[16px] text-white hover:bg-white/10 transition-colors">
                  {cta.label}
                </button>
              </Link>
            </div>
          )}

          {/* Carousel - full width on mobile, right side on desktop */}
          <div className={`w-full ${showIntro ? 'lg:w-7/12 overflow-hidden' : 'overflow-x-auto no-scrollbar'}`}>
            <div
              className={`identifier flex ${isScrolling ? 'transition-none' : 'transition-transform duration-200 ease-out'}`}
              style={{
                transform: `translateX(-${horizontalProgress}px)`,
                willChange: 'transform',
              }}
            >
              {items.map((item, i) => (
                <div
                  key={i}
                  className={[
                    "shrink-0",
                    "w-[280px] sm:w-[300px] md:w-[340px] lg:w-[360px]",
                    i === 0 ? "ml-4 sm:ml-8" : "",
                    "mr-6 last:mr-8",
                  ].join(" ")}
                >
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <div className="relative h-[400px] sm:h-[420px] md:h-[440px] lg:h-[460px]">
                      <Image
                        src={imageMap[item.imageKey]}
                        alt={item.title}
                        fill
                        priority={i < 2}
                        className="object-cover"
                        sizes="(max-width: 640px) 280px, (max-width: 768px) 300px, (max-width: 1024px) 340px, 360px"
                      />
                    </div>
                  </div>

                  <h4 className="mt-4 text-[22px] sm:text-[24px] md:text-[28px] lg:text-[32px] font-medium">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px] leading-relaxed font-light opacity-90">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}