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

export default function ServicesCarouselSection({
  data,
  horizontalProgress = 0,
  isScrolling = false,
  showIntro = false,
}: Props) {
  const { eyebrow, cta, items } = data;
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div
      className={`${
        !showIntro ? "py-10" : ""
      } w-full h-full flex items-center bg-[#E5D4C3] backdrop-blur-sm text-[#1a1a1a]`}
    >
      <div className="w-full h-full flex items-center">
        <div className="w-full flex items-center">
          {/* Desktop: Show intro text on left */}
          {showIntro && (
            <div className="hidden lg:block lg:w-5/12 flex-shrink-0 pl-4 sm:pl-6 lg:pl-12">
              <p className="text-[32px] lg:text-[38px] xl:text-[38px] leading-[1.2] font-light mb-8">
                {eyebrow}
              </p>
              <Link
                // href={cta.href}
                href={""}
                onClick={(e) => e.preventDefault()}
                className="inline-block"
              >
                <button className="glass-border-button px-8 py-4 text-[16px] text-white hover:bg-white/10 transition-colors">
                  {cta.label}
                </button>
              </Link>
            </div>
          )}

          {/* Carousel - full width on mobile, right side on desktop */}
          <div className={`${showIntro ? 'lg:col-span-10 md:pt-16 lg:-mr-[20px]' : 'w-full'} overflow-hidden`}>
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
                      "w-[272px] xs:w-[272px] sm:w-[272px] md:w-[322px] lg:w-[322px] xl:w-[322px]",
                      i === 0 ? "ml-2 sm:ml-8 lg:ml-10" : "",
                      "mr-4 sm:mr-6 last:mr-2 sm:last:mr-0",
                    ].join(" ")}
                  >
                    <div className="rounded-2xl overflow-hidden shadow-md">
                      <div className="relative h-[393px] xs:h-[393px] sm:h-[393px] md:h-[438px] lg:h-[438px] xl:h-[438px]">
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

                    <h4 className="mt-3 pb-1 text-[20px] sm:text-[20px] md:text-[30px] lg:text-[32px] font-regular leading-none">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-[18px] sm:text-[18px] md:text-[18px] lg:text-[20px] leading-[20px] sm:leading-[22px] font-light">
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
