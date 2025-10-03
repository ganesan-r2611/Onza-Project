"use client";

import { useRef } from "react";
import Image from "next/image";
import { imageMap } from "@/libs/imageMap";

type Item = { title: string; desc: string; imageKey: keyof typeof imageMap };

export default function Carousel({ items }: { items: Item[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full">
      <div
        ref={trackRef}
        className="
          flex gap-6 overflow-x-auto scroll-smooth px-2
          snap-x snap-proximity             /* friendlier than mandatory */
          [&>*]:snap-center
          scrollbar-hide
        "
        style={{
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorX: "contain",
          overscrollBehaviorY: "auto",      
          touchAction: "pan-y pan-x",       
        }}
      >
        {items.map((it, i) => (
          <article
            key={it.title + i}
            className="
              shrink-0
              w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[320px]
              snap-start
            "
          >
            <div className="rounded-[18px] overflow-hidden shadow-md border border-black/10 bg-white/70">
              <div className="relative h-[50vh] sm:h-[55vh] lg:h-[60vh]">
                <Image
                  src={imageMap[it.imageKey]}
                  alt={it.title}
                  fill
                  priority={i < 2}
                  draggable={false}                          
                  className="object-cover pointer-events-none select-none"  
                  sizes="(max-width: 1024px) 80vw, 360px"
                />
              </div>
            </div>

            <h4 className="mt-4 text-[22px] sm:text-[24px] text-[#fff]">
              {it.title}
            </h4>
            <p className="mt-2 text-[14px] sm:text-[16px] leading-[22px] text-[#fafafa]">
              {it.desc}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
