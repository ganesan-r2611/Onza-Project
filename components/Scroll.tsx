"use client";

import React, { useState, useEffect, useRef } from "react";
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

export default function ScrollZoomComponent({ data }: Props) {
  const [scrollY, setScrollY] = useState(0);
  const [targetScrollY, setTargetScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [flarePositions, setFlarePositions] = useState<FlarePosition[]>([
    { x: 20, y: 30, time: 0 },
    { x: 60, y: 50, time: (2 * Math.PI) / 3 },
    { x: 40, y: 70, time: (4 * Math.PI) / 3 },
  ]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Find the actual scrolling element
  useEffect(() => {
    const findScrollParent = () => {
      let element: HTMLElement | null = containerRef.current;
      while (element) {
        const style = window.getComputedStyle(element);
        const overflowY = style.overflowY;
        const scrollHeight = element.scrollHeight;
        const clientHeight = element.clientHeight;

        if (
          (overflowY === "auto" || overflowY === "scroll") &&
          scrollHeight > clientHeight
        ) {
          return element;
        }
        element = element.parentElement;
      }
      return window;
    };

    const scrollElement = findScrollParent();
    let rafId: number;

    const checkScroll = () => {
      let scrollTop = 0;

      if (scrollElement === window) {
        scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;
      } else if (scrollElement instanceof HTMLElement) {
        scrollTop = scrollElement.scrollTop;
      }

      if (!containerRef.current) {
        rafId = requestAnimationFrame(checkScroll);
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const relativeScroll = Math.max(0, -rect.top);
      setTargetScrollY(relativeScroll);

      rafId = requestAnimationFrame(checkScroll);
    };

    rafId = requestAnimationFrame(checkScroll);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Smooth scroll with delay using RAF
  useEffect(() => {
    let rafId: number;
    const smoothScroll = () => {
      setScrollY((prev) => {
        const diff = targetScrollY - prev;
        const speed = diff * 0.03;
        if (Math.abs(diff) < 0.5) return targetScrollY;
        return prev + speed;
      });
      rafId = requestAnimationFrame(smoothScroll);
    };

    rafId = requestAnimationFrame(smoothScroll);
    return () => cancelAnimationFrame(rafId);
  }, [targetScrollY]);

  // Animate lens flares
  useEffect(() => {
    const interval = setInterval(() => {
      setFlarePositions((prev) =>
        prev.map((flare, index) => {
          const speed = 0.015;
          const newTime = flare.time + speed;
          const baseAngle = index * ((2 * Math.PI) / 3) + newTime;
          const orbitRadius = 65;
          const x = 50 + Math.cos(baseAngle) * orbitRadius;
          const y = 50 + Math.sin(baseAngle) * orbitRadius;
          return { x, y, time: newTime };
        })
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // =========================
  // Viewport + 4-stage scaling (mobile-safe)
  // =========================
  const getViewportH = () => {
    if (typeof window === "undefined") return 1000; // SSR-safe default
    const vv = (window as Window).visualViewport?.height;
    return vv ? Math.round(vv) : window.innerHeight;
  };

  const viewportH = getViewportH();
  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1600;

  const isMobile = viewportW < 768;

  // Base circle size: Tailwind handles actual element size;
  // this is only for computing the cover scale.
  const baseCircleSize = isMobile
    ? Math.min(Math.max(viewportW * 0.7, 260), 500)
    : Math.min(viewportW * 0.4, 500);

  // Scale so the circle fully covers viewport at Stage 4
  const viewportDiagonal =
    typeof window !== "undefined"
      ? Math.sqrt(viewportW * viewportW + viewportH * viewportH)
      : 1800;

  const coverScale = Math.max(1, (viewportDiagonal * 1.02) / baseCircleSize);

  // Component height: 400 * safe vh
  const stageCount = 3; // or 4 if you really need four scroll stages
  const componentHeight = viewportH * stageCount;
  const stageHeight = componentHeight / 4;

  const clampedScroll = Math.max(0, Math.min(scrollY, componentHeight));
  const currentStage = Math.min(Math.floor(clampedScroll / stageHeight), 3);
  const stageProgress = Math.min(
    1,
    Math.max(0, (clampedScroll - currentStage * stageHeight) / stageHeight)
  );

  // Stage scales: 1 → coverScale
  const s1 = 1;
  const s2 = s1 + (coverScale - s1) / 3;
  const s3 = s1 + ((coverScale - s1) * 2) / 3;
  const s4 = coverScale;
  const stageScales = [s1, s2, s3, s4];

  const startScale = stageScales[currentStage];
  const endScale = stageScales[Math.min(currentStage + 1, 3)];

  const easeInOut = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  const imageScale =
    currentStage === 3
      ? s4
      : startScale + (endScale - startScale) * easeInOut(stageProgress);

  // Background opacity (hidden during Stage 4)
  let fixedOpacity = 1;
  if (currentStage < 3) {
    fixedOpacity = 1;
  } else {
    const fade = 1 - easeInOut(stageProgress);
    fixedOpacity = Math.max(0, Math.min(1, fade * 0.2));
  }

  // Section color transitions (unchanged)
  const section2Start = viewportH * 0.5;
  const section2Transition = viewportH * 0.4;
  const section2Progress = Math.max(
    0,
    Math.min(1, (clampedScroll - section2Start) / section2Transition)
  );

  const section3Start = viewportH * 1.5;
  const section3Transition = viewportH * 0.4;
  const section3Progress = Math.max(
    0,
    Math.min(1, (clampedScroll - section3Start) / section3Transition)
  );

  return (
    <div
      ref={containerRef}
      id="scroll-zoom-container"
      className="relative"
      style={mounted ? { minHeight: `${componentHeight}px` } : undefined}
      suppressHydrationWarning
    >
      <div
        className="fixed inset-0 -z-30 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #0f3333, #0a2828, #051a1a, #020f0f)",
          opacity: fixedOpacity,
          pointerEvents: fixedOpacity === 0 ? "none" : "auto",
          visibility: fixedOpacity === 0 ? "hidden" : "visible",
        }}
      >
        {/* Lens flares */}
        <div
          className="absolute rounded-full blur-3xl opacity-70 z-0"
          style={{
            width: "clamp(750px, 75vw, 1200px)",
            height: "clamp(750px, 75vw, 1200px)",
            left: `${flarePositions[0].x}%`,
            top: `${flarePositions[0].y}%`,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(120, 240, 240, 0.8) 0%, rgba(100, 220, 220, 0.6) 30%, rgba(80, 180, 180, 0.3) 60%, transparent 80%)",
            transition: "all 0.5s ease-out",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-60 z-0"
          style={{
            width: "clamp(750px, 75vw, 1200px)",
            height: "clamp(750px, 75vw, 1200px)",
            left: `${flarePositions[1].x}%`,
            top: `${flarePositions[1].y}%`,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(140, 250, 250, 0.7) 0%, rgba(120, 230, 230, 0.5) 30%, rgba(90, 190, 190, 0.3) 60%, transparent 80%)",
            transition: "all 0.5s ease-out",
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-50 z-0"
          style={{
            width: "clamp(750px, 75vw, 1200px)",
            height: "clamp(750px, 75vw, 1200px)",
            left: `${flarePositions[2].x}%`,
            top: `${flarePositions[2].y}%`,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(100, 220, 220, 0.6) 0%, rgba(80, 200, 200, 0.4) 30%, rgba(70, 170, 170, 0.2) 60%, transparent 80%)",
            transition: "all 0.5s ease-out",
          }}
        />
      </div>

      {/* Image section - circular, zooms to fill viewport */}
      <div
        className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden -z-30 transition-opacity duration-500"
        style={{
          opacity: fixedOpacity,
          visibility: fixedOpacity === 0 ? "hidden" : "visible",
        }}
      >
        <div
          className="
            relative overflow-hidden rounded-full shadow-2xl
            w-[40vw] h-[40vw] max-w-[500px] max-h-[500px]
            sm:w-[70vw] sm:h-[70vw]
          "
          style={{
            transform: `scale(${imageScale})`,
            transition: "transform 0.1s linear",
          }}
        >
          {/* Overlays */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #3cc2cc 0%, #13181c 100%)",
              mixBlendMode: "multiply",
              opacity: 0.7,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(225deg, #3cc2cc 0%, #13181c 100%)",
              mixBlendMode: "multiply",
              opacity: 0.7,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 120% 80% at 50% 0%, #3cc2cc 0%, rgba(60, 194, 204, 0.5) 40%, transparent 70%)",
              mixBlendMode: "lighten",
              opacity: 0.8,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 50% 35% at 50% 100%, #3cc2cc 0%, rgba(60, 194, 204, 0.7) 20%, rgba(60, 194, 204, 0.4) 40%, rgba(60, 194, 204, 0.15) 65%, transparent 85%)",
              mixBlendMode: "lighten",
              opacity: 0.8,
            }}
          />
          {/* Diamond */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              style={{
                width: "65%",
                height: "65%",
                background:
                  "linear-gradient(135deg, rgb(59, 104, 108) 0%, rgb(39, 84, 88) 50%, rgb(19, 64, 68) 100%)",
                transform: "rotate(45deg)",
                borderRadius: "8%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Content container */}
      <div className="relative z-20">
        {/* Section 1 */}
        <div
          className="
            relative flex flex-col md:flex-row 
            items-start md:items-center 
            justify-end md:justify-between 
            z-10 px-6 sm:px-8 
            text-left 
            gap-6 md:gap-8
          "
          style={{ minHeight: "100svh" }}
        >
          <div className="text-white max-w-lg">
            <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl leading-relaxed drop-shadow-2xl">
              <span className="inline lg:block">Crafting</span>
              <span className="inline lg:hidden">&nbsp;</span>
              <span className="inline lg:block">Pathways,</span>
              <span className="block">That&nbsp;Endure</span>
            </h2>
          </div>

          <div className="text-white max-w-md md:self-end md:pb-8">
            <p
              className="
                text-lg md:text-xl lg:text-2xl 
                drop-shadow-lg leading-relaxed 
                text-[#ffdc81]
              "
            >
              Discreet and discerning guidance for those whose decisions define
              tomorrow&apos;s world.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div
          className="
            relative flex flex-col
            items-start justify-start
            md:items-center md:justify-center
            z-10
            pl-6 sm:pl-8
            text-left
            min-h-0 md:min-h-[100svh]
            py-6 md:py-0
            md:mt-[10vh]
          "
        >
          <div className="max-w-5xl pt-[25vh] pb-[22vh]">
            <div className="relative">
              <p className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl drop-shadow-lg text-black">
                Our Ethos
              </p>
              <p
                className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl drop-shadow-lg mb-4 text-white absolute top-0 left-0"
                style={{
                  clipPath: `inset(0 ${100 - section2Progress * 100}% 0 0)`,
                }}
              >
                Our Ethos
              </p>
            </div>

            <div className="relative mt-10">
              <p className="text-4xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl drop-shadow-lg mb-4 text-black">
                Lorem ipsum dolor sit amet consectetur. Egestas urna faucibus
                sit nibh augue morbi diam aliquet aenean. Mattis volutpat
                maecenas placerat orci. Sapien morbi ut tempus facilisis.
              </p>
              <p
                className="text-4xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl drop-shadow-lg mb-4 text-white absolute top-0 left-0"
                style={{
                  clipPath: `inset(0 ${100 - section2Progress * 100}% 0 0)`,
                }}
              >
                Lorem ipsum dolor sit amet consectetur. Egestas urna faucibus
                sit nibh augue morbi diam aliquet aenean. Mattis volutpat
                maecenas placerat orci. Sapien morbi ut tempus facilisis.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div
          className="
            relative flex flex-col
            items-start justify-start
            md:items-center md:justify-center
            z-10
            pl-6 sm:pl-8
            text-left
            min-h-0 md:min-h-[100svh]
            py-6 md:py-0
          "
        >
          <div className="max-w-5xl pt-[25vh] pb-[22vh]">
            <div className="relative">
              <p className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl drop-shadow-lg mb-4 text-black">
                Our Advisory Philosophy
              </p>
              <p
                className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl drop-shadow-lg mb-4 text-white absolute top-0 left-0"
                style={{
                  clipPath: `inset(0 ${100 - section3Progress * 100}% 0 0)`,
                }}
              >
                Our Advisory Philosophy
              </p>
            </div>

            <div className="relative">
              <p className="text-4xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl drop-shadow-lg mb-4 text-black">
                Our approach begins with your real-life goals, not just
                financial metrics. Whether it&apos;s legacy building, education,
                lifestyle security, or intergenerational wealth, our strategies
                are:
              </p>
              <p
                className="text-4xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl drop-shadow-lg mb-4 text-white absolute top-0 left-0"
                style={{
                  clipPath: `inset(0 ${100 - section3Progress * 100}% 0 0)`,
                }}
              >
                Our approach begins with your real-life goals, not just
                financial metrics. Whether it&apos;s legacy building legacy building, education,
                lifestyle security, or intergenerational wealth, our strategies
                are:
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <section data-theme="light">
        <ServicesCarouselSection data={data} />
      </section>
    </div>
  );
}
