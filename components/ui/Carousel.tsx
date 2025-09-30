"use client";

import { useRef } from "react";
import Image from "next/image";
import { imageMap } from "@/libs/imageMap";

type Item = { title: string; desc: string; imageKey: keyof typeof imageMap };

export default function Carousel({ items }: { items: Item[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full">
      {/* Horizontal scroll track */}
      <div
        ref={trackRef}
        className="
          flex gap-6 overflow-x-auto scroll-smooth px-2
          touch-pan-x
          scrollbar-hide
        "
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorX: "contain",
          overscrollBehaviorY: "auto",
        }}
      >
        {items.map((it, i) => (
          <article
            key={it.title + i}
            className="
              shrink-0
              w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[320px]
              snap-start
              flex-shrink-0
            "
          >
            <div
              className="
                rounded-[18px] overflow-hidden shadow-md border border-black/10
                bg-white/70
              "
            >
              <div className="relative h-[50vh] sm:h-[55vh] lg:h-[60vh]">
                <Image
                  src={imageMap[it.imageKey]}
                  alt={it.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 80vw, 360px"
                  priority={i < 2}
                />
              </div>
            </div>
            <h4 className="mt-4 text-[22px] sm:text-[24px] text-[#1e1e1e]">
              {it.title}
            </h4>
            <p className="mt-2 text-[14px] sm:text-[16px] leading-[22px] text-[#4a4a4a]">
              {it.desc}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
