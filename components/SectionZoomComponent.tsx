"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { imageMap } from "@/libs/imageMap";

type Pillar = { title: string; desc: string; imageKey: keyof typeof imageMap };

type Props = {
  data: {
    eyebrow: string;
    cta: { label: string; href: string };
    items: Pillar[];
  };
  currentSnapIndex?: number;
  totalSnapItems?: number;
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
    update();
    window.addEventListener("resize", run);
    window.addEventListener("orientationchange", run);
    return () => {
      window.removeEventListener("resize", run);
      window.removeEventListener("orientationchange", run);
    };
  }, []);

  const category = useMemo(() => {
    if (!vp.mounted) return "server";
    const { w, h, ar } = vp;

    const isMobile = w <= 768;
    const isTablet = w > 768 && w <= 1180;
    const isDesktop = w > 1180 && ar <= 2.0;
    const isUltraWide = w > 1440 && ar > 2.0;

    const isShort = h < 720;
    const isVeryShort = h < 600;

    if (isMobile) return "mobile";
    if (isTablet) return isShort ? "tablet-short" : "tablet";
    if (isUltraWide) return isVeryShort ? "ultrawide-very-short" : "ultrawide";
    return isShort ? "desktop-short" : isDesktop ? "desktop" : "desktop";
  }, [vp]);

  return { category, mounted: vp.mounted, width: vp.w, height: vp.h, aspect: vp.ar };
}

/** Choose per-section scale arrays based on viewport category */
function useScaleStages(category: string, totalItems: number) {
  // Adjust scales based on number of snap items
  const base = {
    mobile:       [1.2, 4, 7, 20],
    tablet:       [1.0, 4.2, 5.8, 8.2],
    desktop:      [1.0, 3.5, 6.0, 9.0],
    desktopShort: [0.95, 3.2, 5.4, 8.2],
    ultrawide:    [1.0, 3.2, 5.4, 8.4],
    ultraVery:    [0.92, 3.0, 5.0, 7.8],
  };

  let stages: number[];
  
  switch (category) {
    case "mobile": stages = base.mobile; break;
    case "tablet": 
    case "tablet-short": stages = base.tablet; break;
    case "desktop": stages = base.desktop; break;
    case "desktop-short": stages = base.desktopShort; break;
    case "ultrawide": stages = base.ultrawide; break;
    case "ultrawide-very-short": stages = base.ultraVery; break;
    default: stages = base.desktop;
  }

  // If we have more or fewer items, adjust
  if (totalItems !== 4) {
    // Interpolate or extend stages to match totalItems
    const result: number[] = [];
    for (let i = 0; i < totalItems; i++) {
      const ratio = i / Math.max(1, totalItems - 1);
      const idx = ratio * (stages.length - 1);
      const lower = Math.floor(idx);
      const upper = Math.ceil(idx);
      const frac = idx - lower;
      result.push(stages[lower] * (1 - frac) + stages[upper] * frac);
    }
    return result;
  }

  return stages;
}

export default function SectionZoomComponent({ data, currentSnapIndex = 0, totalSnapItems = 4 }: Props) {
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

  const { category, mounted, height } = useViewportCategory();
  const stages = useScaleStages(category, totalSnapItems);
  
  // Use the snap index directly from parent
  const effectiveSection = currentSnapIndex;

  const shortBoost = mounted && height < 640 ? 0.92 : 1;
  const imageScale = (stages[effectiveSection] ?? stages[0] ?? 1) * shortBoost;

  return (
    <div className="relative w-full h-full">
      {/* 🔹 Gradient background - Absolute to parent container */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #0f3333 0%, #0a2828 50%, #051a1a 80%, #020f0f 100%)",
        }}
      />

      {/* 🔹 Lens flares - Absolute to parent container */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-700 ease-in-out overflow-hidden">
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

      {/* 🔹 Scalable image - Absolute to parent container */}
      <div className="absolute inset-0 flex items-center justify-center transition-all duration-[1200ms] ease-[cubic-bezier(0.45,0,0.25,1)] pointer-events-none">
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
    </div>
  );
}