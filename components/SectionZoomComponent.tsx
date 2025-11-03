"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  const [vp, setVp] = useState<{
    w: number;
    h: number;
    ar: number;
    mounted: boolean;
  }>({
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

    const isMobileSmall = w <= 375; // Small phones
    const isMobile = w <= 428; // Modern phones
    const isMobileLarge = w <= 480; // Large phones
    const isTabletSmall = w <= 600; // Small tablets
    const isTablet = w <= 768; // Standard tablets
    const isTabletLarge = w <= 1024; // Large tablets
    const isLaptop = w <= 1366; // Laptops
    const isLaptopLarge = w <= 1440; // Large laptops
    const isDesktop = w <= 1920; // Full HD
    const isDesktopLarge = w <= 2560; // 2K screens
    const isUltraWide = w > 2560;

    const isVeryShort = h < 600;
    const isShort = h < 720;
    const isTall = h > 1200;

    // Mobile categories
    if (isMobileSmall) return "mobile-small";
    if (isMobile) return "mobile";
    if (isMobileLarge) return "mobile-large";

    // Tablet categories
    if (isTabletSmall) return isShort ? "tablet-small-short" : "tablet-small";
    if (isTablet) return isShort ? "tablet-short" : "tablet";
    if (isTabletLarge) return isShort ? "tablet-large-short" : "tablet-large";

    // Laptop categories
    if (isLaptop)
      return isShort ? "laptop-short" : isTall ? "laptop-tall" : "laptop";
    if (isLaptopLarge)
      return isShort
        ? "laptop-large-short"
        : isTall
        ? "laptop-large-tall"
        : "laptop-large";

    // Desktop categories
    if (isDesktop)
      return isShort ? "desktop-short" : isTall ? "desktop-tall" : "desktop";
    if (isDesktopLarge)
      return isShort
        ? "desktop-large-short"
        : isTall
        ? "desktop-large-tall"
        : "desktop-large";

    // Ultrawide categories
    if (isUltraWide) {
      if (isVeryShort) return "ultrawide-very-short";
      if (isShort) return "ultrawide-short";
      if (isTall) return "ultrawide-tall";
      return "ultrawide";
    }

    return "desktop"; // fallback
  }, [vp]);

  return {
    category,
    mounted: vp.mounted,
    width: vp.w,
    height: vp.h,
    aspect: vp.ar,
  };
}

/** Choose per-section scale arrays based on viewport category */
function useScaleStages(category: string, totalItems: number) {
  // Adjust scales based on number of snap items
  const base = {
    // Mobile devices
    "mobile-small": [1.0, 1.1, 8.2, 11],
    mobile: [1.1, 1.3, 7.3, 10],
    "mobile-large": [1.1, 1.4, 5.7, 9],

    // Small tablets
    "tablet-small": [0, 3.2, 6.2],
    "tablet-small-short": [0.9, 4.2, 6.4],

    // Standard tablets
    tablet: [0.9, 2.5, 5.8],
    "tablet-short": [0.92, 2.5, 6.0],

    // Large tablets
    "tablet-large": [0.8, 5, 6],
    "tablet-large-short": [0.9, 5.2, 6.2],

    // Laptops
    laptop: [1.0, 2.5, 6.0, 9.0],
    "laptop-short": [1.0, 2.5, 4.0, 9.0],
    "laptop-tall": [1.0, 2.9, 4.4, 9.0],

    "laptop-large": [1.0, 3, 4.6, 9.0],
    "laptop-large-short": [1.0, 3.1, 4.9, 9.0],
    "laptop-large-tall": [1.0, 3.4, 5.3, 9.0],

    // Desktops
    desktop: [1, 3.5, 4.0, 16],
    "desktop-short": [1, 3.5, 4.2, 17],
    "desktop-tall": [1, 3.5, 3.8, 15],

    "desktop-large": [1, 3.5, 3.5, 14],
    "desktop-large-short": [0.67, 3.5, 3.7, 15],
    "desktop-large-tall": [0.63, 3.5, 3.3, 13],

    // Ultrawide
    ultrawide: [1.0, 3.2, 5.4, 8.4],
    "ultrawide-short": [1.0, 3.2, 5.4, 8.4],
    "ultrawide-tall": [1.0, 3.2, 5.4, 8.4],
    "ultrawide-very-short": [1.0, 3.2, 5.4, 8.4],
  };

  let stages: number[];

  switch (category) {
    // Mobile categories
    case "mobile-small":
      stages = base["mobile-small"];
      break;
    case "mobile":
      stages = base.mobile;
      break;
    case "mobile-large":
      stages = base["mobile-large"];
      break;

    // Small tablet categories
    case "tablet-small":
      stages = base["tablet-small"];
      break;
    case "tablet-small-short":
      stages = base["tablet-small-short"];
      break;

    // Standard tablet categories
    case "tablet":
      stages = base.tablet;
      break;
    case "tablet-short":
      stages = base["tablet-short"];
      break;

    // Large tablet categories
    case "tablet-large":
      stages = base["tablet-large"];
      break;
    case "tablet-large-short":
      stages = base["tablet-large-short"];
      break;

    // Laptop categories
    case "laptop":
      stages = base.laptop;
      break;
    case "laptop-short":
      stages = base["laptop-short"];
      break;
    case "laptop-tall":
      stages = base["laptop-tall"];
      break;
    case "laptop-large":
      stages = base["laptop-large"];
      break;
    case "laptop-large-short":
      stages = base["laptop-large-short"];
      break;
    case "laptop-large-tall":
      stages = base["laptop-large-tall"];
      break;

    // Desktop categories
    case "desktop":
      stages = base.desktop;
      break;
    case "desktop-short":
      stages = base["desktop-short"];
      break;
    case "desktop-tall":
      stages = base["desktop-tall"];
      break;
    case "desktop-large":
      stages = base["desktop-large"];
      break;
    case "desktop-large-short":
      stages = base["desktop-large-short"];
      break;
    case "desktop-large-tall":
      stages = base["desktop-large-tall"];
      break;

    // Ultrawide categories
    case "ultrawide":
      stages = base.ultrawide;
      break;
    case "ultrawide-short":
      stages = base["ultrawide-short"];
      break;
    case "ultrawide-tall":
      stages = base["ultrawide-tall"];
      break;
    case "ultrawide-very-short":
      stages = base["ultrawide-very-short"];
      break;

    default:
      stages = base.desktop;
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

export default function SectionZoomComponent({
  currentSnapIndex = 0,
  totalSnapItems = 4,
}: Props) {
  // 🔹 Lens flare animation
  const [flarePositions, setFlarePositions] = useState<FlarePosition[]>([
    { x: 20, y: 30, time: 0 },
    { x: 60, y: 50, time: (2 * Math.PI) / 3 },
    { x: 40, y: 70, time: (4 * Math.PI) / 3 },
  ]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // For mouse hover parallax

  // Track mouse position for hover parallax effect (first snap only)
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      // Only track if on first snap section
      if (currentSnapIndex !== 0) return;

      // Use the entire viewport for tracking
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      // Clamp values between 0 and 1
      const clampedX = Math.max(0, Math.min(1, x));
      const clampedY = Math.max(0, Math.min(1, y));

      setMousePosition({
        x: clampedX,
        y: clampedY,
      });
    };

    if (currentSnapIndex === 0) {
      window.addEventListener("mousemove", updateMousePosition, {
        passive: true,
      });
    }

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, [currentSnapIndex]);

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

  const parallaxX = currentSnapIndex === 0 ? (mousePosition.x - 0.5) * 30 : 0; // Move left/right up to 15px
  const parallaxY = currentSnapIndex === 0 ? (mousePosition.y - 0.5) * 30 : 0; // Move up/down up to 15px
  const parallaxScale =
    currentSnapIndex === 0
      ? 1 +
        (Math.abs(mousePosition.x - 0.5) + Math.abs(mousePosition.y - 0.5)) *
          0.05
      : 1; // Slight scale

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
            transform: (() => {
              const transformValue =
                currentSnapIndex === 0
                  ? `scale(${
                      mounted ? imageScale : 1
                    }) translate3d(${parallaxX}px, ${parallaxY}px, 0)`
                  : `scale(${mounted ? imageScale : 1})`;
              return transformValue;
            })(),
            transition:
              currentSnapIndex === 0
                ? "transform 0.8s ease-out"
                : "transform 1200ms cubic-bezier(0.45,0,0.25,1)",
            willChange: currentSnapIndex === 0 ? "transform" : "auto",
            width: "min(65vw, 560px)",
            height: "auto",
            filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.35))",
          }}
        />
      </div>
    </div>
  );
}
