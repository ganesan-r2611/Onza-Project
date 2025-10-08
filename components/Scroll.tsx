"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import ServicesCarouselSection from "./ServiceCarousel";
import { imageMap } from "@/libs/imageMap";

type Pillar = { title: string; desc: string; imageKey: keyof typeof imageMap };

type Props = {
  data: {
    eyebrow: string;
    cta: { label: string; href: string };
    items: Pillar[];
  };
};

interface FlarePosition {
  x: number;
  y: number;
  time: number;
}

/** Debounce helper */
function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number) {
  let t: number | undefined;
  return (...args: Parameters<T>) => {
    if (t) window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), ms);
  };
}

/** Viewport classifier */
function useViewportCategory() {
  const [vp, setVp] = useState<{ w: number; h: number; ar: number; mounted: boolean }>({
    w: 0,
    h: 0,
    ar: 1,
    mounted: false,
  });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setVp({ w, h, ar: w / Math.max(1, h), mounted: true });
    };
    const run = debounce(update, 120);
    update(); // initial after mount
    window.addEventListener("resize", run);
    window.addEventListener("orientationchange", run);
    return () => {
      window.removeEventListener("resize", run);
      window.removeEventListener("orientationchange", run);
    };
  }, []);

  // Categories
  const category = useMemo(() => {
    if (!vp.mounted) return "server"; // avoid SSR mismatch
    const { w, h, ar } = vp;

    // Base buckets
    const isMobile = w <= 768;
    const isTablet = w > 768 && w <= 1180;
    const isDesktop = w > 1180 && ar <= 2.0;
    const isUltraWide = w > 1440 && ar > 2.0;

    // Height-aware modifiers (landscape/short viewports)
    const isShort = h < 720; // e.g., 13" laptops, landscape phones
    const isVeryShort = h < 600;

    if (isMobile) return isShort ? "mobile-short" : "mobile";
    if (isTablet) return isShort ? "tablet-short" : "tablet";
    if (isUltraWide) return isVeryShort ? "ultrawide-very-short" : "ultrawide";
    return isShort ? "desktop-short" : isDesktop ? "desktop" : "desktop";
  }, [vp]);

  return { category, mounted: vp.mounted, width: vp.w, height: vp.h, aspect: vp.ar };
}

/** Choose per-section scale arrays based on viewport category */
function useScaleStages(category: string) {
  // Base scales for your 4 sections; tune as needed
  const base = {
    mobile:       [1.2, 4, 7, 20],
    mobileShort:  [1.2, 4, 7, 20],
    tablet:       [1.0, 4.2, 5.8, 8.2],
    tabletShort:  [0.95, 3.8, 5.2, 7.4],
    desktop:      [1.0, 3.5, 6.0, 9.0],
    desktopShort: [0.95, 3.2, 5.4, 8.2],
    ultrawide:    [1.0, 3.2, 5.4, 8.4],
    ultraVery:    [0.92, 3.0, 5.0, 7.8],
  } as const;

  switch (category) {
    case "mobile": return base.mobile;
    case "mobile-short": return base.mobileShort;
    case "tablet": return base.tablet;
    case "tablet-short": return base.tabletShort;
    case "desktop": return base.desktop;
    case "desktop-short": return base.desktopShort;
    case "ultrawide": return base.ultrawide;
    case "ultrawide-very-short": return base.ultraVery;
    case "server":
    default:
      // During SSR, return conservative desktop scales to avoid hydration drift
      return base.desktop;
  }
}

export default function SectionZoomComponent({ data }: Props) {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 🔹 Lens flare animation
  const [flarePositions, setFlarePositions] = useState<FlarePosition[]>([
    { x: 20, y: 30, time: 0 },
    { x: 60, y: 50, time: (2 * Math.PI) / 3 },
    { x: 40, y: 70, time: (4 * Math.PI) / 3 },
  ]);

  useEffect(() => {
    const id = setInterval(() => {
      setFlarePositions((prev) =>
        prev.map((f, i) => {
          const speed = 0.012;
          const t = f.time + speed;
          const baseAngle = i * ((2 * Math.PI) / 3) + t;
          const radius = 65;
          return {
            x: 50 + Math.cos(baseAngle) * radius,
            y: 50 + Math.sin(baseAngle) * radius,
            time: t,
          };
        })
      );
    }, 80);
    return () => clearInterval(id);
  }, []);

  // 🔹 Track active section
  useEffect(() => {
    const rootEl = containerRef.current;
    if (!rootEl) return;

    const sections = Array.from(
      rootEl.querySelectorAll<HTMLElement>(".scroll-section")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          const idx = Number(visible.target.getAttribute("data-index"));
          setActiveSection(idx);
        }
      },
      {
        root: null,
        threshold: Array.from({ length: 11 }, (_, i) => i / 10),
        rootMargin: "0px 0px -30% 0px",
      }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const { category, mounted, height } = useViewportCategory();
  const stages = useScaleStages(category);

  const shortBoost = mounted && height < 640 ? 0.92 : 1;
  const imageScale = (stages[activeSection] ?? 1) * shortBoost;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* 🔹 Gradient background */}
      <div
        className="fixed inset-0 -z-50 transition-opacity duration-1000 ease-in-out"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #0f3333 0%, #0a2828 50%, #051a1a 80%, #020f0f 100%)",
        }}
      />

      {/* 🔹 Lens flares */}
      <div className="fixed inset-0 -z-40 pointer-events-none transition-all duration-700 ease-in-out">
        {flarePositions.map((f, idx) => (
          <div
            key={idx}
            className="absolute rounded-full blur-3xl opacity-60 transition-transform duration-700 ease-in-out"
            style={{
              width: "clamp(750px, 75vw, 1200px)",
              height: "clamp(750px, 75vw, 1200px)",
              left: `${f.x}%`,
              top: `${f.y}%`,
              transform: "translate(-50%, -50%)",
              background:
                idx === 0
                  ? "radial-gradient(circle, rgba(120,240,240,0.65) 0%, rgba(100,220,220,0.45) 35%, rgba(80,180,180,0.25) 60%, transparent 80%)"
                  : idx === 1
                  ? "radial-gradient(circle, rgba(140,250,250,0.55) 0%, rgba(110,230,230,0.4) 35%, rgba(90,190,190,0.22) 60%, transparent 80%)"
                  : "radial-gradient(circle, rgba(100,220,220,0.5) 0%, rgba(80,200,200,0.35) 35%, rgba(70,170,170,0.18) 60%, transparent 80%)",
            }}
          />
        ))}
      </div>

      {/* 🔹 Scalable image */}
      <div className="fixed inset-0 -z-30 flex items-center justify-center transition-all duration-[1200ms] ease-[cubic-bezier(0.45,0,0.25,1)] pointer-events-none">
        <Image
          src={imageMap.onzaLgBG}
          alt="Onza Background"
          priority
          className="transition-all duration-[1200ms] ease-[cubic-bezier(0.45,0,0.25,1)] object-contain"
          style={{
            transform: mounted ? `scale(${imageScale})` : "scale(1)",
            width: "min(65vw, 520px)",
            height: "auto",
            filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.35))",
          }}
        />
      </div>

      {/* 🔹 Section 1 */}
      <section
        data-index={0}
        className="scroll-section snap-start relative flex flex-col md:flex-row justify-end md:justify-between items-start md:items-center min-h-screen transition-all duration-1000 ease-in-out"
      >
        <div className="text-white max-w-lg px-6">
          <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl leading-relaxed drop-shadow-2xl pt-24">
            <span className="inline lg:block">Crafting</span>
            <span className="inline lg:hidden">&nbsp;</span>
            <span className="inline lg:block">Pathways,</span>
            <span className="block">That&nbsp;Endure</span>
          </h2>
        </div>
        <div className="max-w-md md:self-end px-6 md:pb-8 mt-12 md:mt-0">
          <p className="text-lg md:text-xl lg:text-2xl drop-shadow-lg leading-relaxed text-[#ffdc81]">
            Discreet and discerning guidance for those whose decisions define tomorrow&apos;s world.
          </p>
        </div>
      </section>

      {/* 🔹 Section 2 */}
      <section
        data-index={1}
        className="scroll-section snap-start flex flex-col justify-center items-center min-h-screen text-white transition-all duration-1000 ease-in-out"
      >
        <div className="max-w-8xl lg:max-w-7xl p-[40px] lg:p-[230px]">
          <p className="text-[18px] md:text-[24px] lg:text-xl  font-regular lg:font-light mb-6 text-[#606060]">Our Ethos</p>
          <p className="text-[32px] md:text-2xl lg:text-6xl font-light text-[#000000]">
            Lorem ipsum dolor sit amet consectetur. Egestas urna faucibus sit nibh augue morbi diam aliquet aenean.
            Mattis volutpat maecenas placerat orci. Sapien morbi ut tempus facilisis.
          </p>
        </div>
      </section>

      {/* 🔹 Section 3 */}
      <section
        data-index={2}
        className="scroll-section snap-start flex flex-col justify-center min-h-screen text-white transition-all duration-1000 ease-in-out"
      >
        <div className=" max-w-8xl lg:max-w-7xl p-[40px] lg:p-[230px]">
          <p className="text-[18px] md:text-[24px] lg:text-xlfont-regular lg:font-light mb-6 text-[#606060]">Our Advisory Philosophy</p>
          <p className="text-[32px] md:text-2xl lg:text-6xl font-light text-[#000000]">
            Our approach begins with your real-life goals, not just financial metrics. <br />
            Whether it&apos;s legacy building, education, lifestyle security, or intergenerational wealth, our strategies are:
          </p>
        </div>
      </section>

      {/* 🔹 Section 4 (Services) */}
      <section
        data-index={3}
        className="scroll-section snap-start flex flex-col justify-center min-h-screen text-white transition-all duration-1000 ease-in-out"
      >
        <div className="relative z-10">
          <ServicesCarouselSection data={data} />
        </div>
      </section>
    </div>
  );
}
