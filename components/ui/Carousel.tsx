"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { imageMap } from "@/libs/imageMap";

type Item = { title: string; desc: string; imageKey: keyof typeof imageMap };

export default function Carousel({
  items
}: {
  items: Item[];
  preserveAspect?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const goTo = (i: number) => {
    const el = trackRef.current?.children[i] as HTMLElement | undefined;
    if (!el || !trackRef.current) return;
    el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setIndex(i);
  }

  useEffect(() => {
    const wrap = trackRef.current;
    if (!wrap) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (!wrap) return;
        const slides = Array.from(wrap.children) as HTMLElement[];
        const center = wrap.scrollLeft + wrap.clientWidth / 2;
        let closest = 0;
        let best = Number.POSITIVE_INFINITY;
        slides.forEach((s, i) => {
          const mid = s.offsetLeft + s.clientWidth / 2;
          const d = Math.abs(mid - center);
          if (d < best) { best = d; closest = i; }
        });
        setIndex(closest);
        ticking = false;
      });
    };
    wrap.addEventListener("scroll", onScroll, { passive: true });
    return () => wrap.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const wrap = trackRef.current;
    if (!wrap) return;
    const snap = () => {
      const slides = Array.from(wrap.children) as HTMLElement[];
      const center = wrap.scrollLeft + wrap.clientWidth / 2;
      let closest = 0, best = Number.POSITIVE_INFINITY;
      slides.forEach((s, i) => {
        const mid = s.offsetLeft + s.clientWidth / 2;
        const d = Math.abs(mid - center);
        if (d < best) { best = d; closest = i; }
      });
      goTo(closest);
    };
    wrap.addEventListener("touchend", snap);
    wrap.addEventListener("mouseup", snap);
    return () => {
      wrap.removeEventListener("touchend", snap);
      wrap.removeEventListener("mouseup", snap);
    };
  }, []);

  const dots = useMemo(() => new Array(items.length).fill(0), [items.length]);

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="
          flex gap-8 overflow-x-auto scroll-smooth px-1
          snap-x snap-mandatory
          [&>*]:snap-center
          scrollbar-hide
        "
      >
        {items.map((it, i) => (
          <article
            key={it.title + i}
            className="
              shrink-0
              w-[75vw] sm:w-[60vw] md:w-[45vw] lg:w-[280px] xl:w-[320px]
            "
          >
            <div
              className="
                rounded-[18px] overflow-hidden shadow-sm border border-black/10
                bg-white/70
              "
            >
              <div
                className="
                  relative 
                  h-[50vh] sm:h-[55vh] lg:h-[60vh]
                "
              >
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
            <h4 className="mt-4 text-[26px] md:text-[32px]text-[#1e1e1e]">
              {it.title}
            </h4>
            <p className="mt-2 text-[14px] md:text-[16px] leading-[16px] text-[#4a4a4a]">
              {it.desc}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
