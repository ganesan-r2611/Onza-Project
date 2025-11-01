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
    <section className="relative text-[#1a1a1a]" data-theme="light">
      <div className="sticky top-0 flex items-center overflow-hidden">
        <div className="mx-auto px-2 lg:pl-6 sm:px-6 lg:px-[30px] py-10 sm:py-20 lg:pt-[120px] w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-7 items-start">
            {/* Left copy - from old code */}
            {showIntro && (
              <div className="lg:col-span-5 px-1 pl-3 pr-2">
                <p className="text-[28px] sm:text-2xl md:text-[34px] lg:text-[38px] leading-[1.2] sm:leading-[1.2] font-light">
                  {eyebrow}
                </p>

                {/* Non–full-width CTA on mobile (override global .glass-border-button width) */}
                <div className="mt-16 sm:mt-8">
                  <Link href={cta.href} className="inline-block">
                    <button className="glass-border-button w-[20px] px-6 py-3 text-[15px] sm:text-[16px] text-white">
                      {cta.label}
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* Right carousel - FIXED: Added overflow-hidden container */}
            <div className={`${showIntro ? 'lg:col-span-7 lg:-mr-[30px]' : 'w-full'} overflow-hidden`}>
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
                      "w-[272px] xs:w-[272px] sm:w-[272px] md:w-[320px] lg:w-[322px] xl:w-[322px]",
                      i === 0 ? "ml-2 sm:ml-8 lg:ml-14" : "",
                      "mr-4 sm:mr-6 last:mr-2 sm:last:mr-0",
                    ].join(" ")}
                  >
                    <div className="rounded-2xl overflow-hidden shadow-md">
                      <div className="relative h-[393px] xs:h-[393px] sm:h-[393px] md:h-[320px] lg:h-[438px] xl:h-[438px]">
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

                    <h4 className="mt-3 pb-1 text-[20px] sm:text-[20px] md:text-[22px] lg:text-[32px] font-regular leading-none">
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