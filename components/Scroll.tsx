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
  // Single state object to prevent flickering
// Replace the existing scrollState declaration
const [scrollState, setScrollState] = useState({
  scrollY: 0,
  targetScrollY: 0,
  section2Progress: 0,
  section3Progress: 0,
  targetSection2Progress: 0, // Add these
  targetSection3Progress: 0, // Add these
});

  const containerRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);

  const [flarePositions, setFlarePositions] = useState<FlarePosition[]>([
    { x: 20, y: 30, time: 0 },
    { x: 60, y: 50, time: (2 * Math.PI) / 3 },
    { x: 40, y: 70, time: (4 * Math.PI) / 3 },
  ]);

// After the mounted state, add mobile detection
const [mounted, setMounted] = useState(false);
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  setMounted(true);
  setIsMobile(window.innerWidth < 768);
}, []);

  // Consolidated RAF loop for all scroll calculations
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

  const updateAllScrollValues = () => {
  // 1. Update scroll position
  let scrollTop = 0;
  if (scrollElement === window) {
    scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;
  } else if (scrollElement instanceof HTMLElement) {
    scrollTop = scrollElement.scrollTop;
  }

  let newTargetScrollY = 0;
  if (containerRef.current) {
    const rect = containerRef.current.getBoundingClientRect();
    const relativeScroll = Math.max(0, -rect.top);
    newTargetScrollY = relativeScroll;
  }

  // 2. Calculate section2Progress
  let newSection2Progress = 0;
  if (section2Ref.current) {
    const rect = section2Ref.current.getBoundingClientRect();
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    const distance = elementCenter - viewportCenter;
    const transitionRange = isMobile ? 300 : 600; // Faster on mobile
    newSection2Progress = Math.max(
      0,
      Math.min(1, (transitionRange - distance) / (transitionRange * 2))
    );
  }

  // 3. Calculate section3Progress
  let newSection3Progress = 0;
  if (section3Ref.current) {
    const rect = section3Ref.current.getBoundingClientRect();
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    const distance = elementCenter - viewportCenter;
    const transitionRange = isMobile ? 300 : 600; // Faster on mobile
    newSection3Progress = Math.max(
      0,
      Math.min(1, (transitionRange - distance) / (transitionRange * 2))
    );
  }

  // Single state update
  setScrollState((prev) => ({
    ...prev,
    targetScrollY: newTargetScrollY,
    targetSection2Progress: newSection2Progress,
    targetSection3Progress: newSection3Progress,
  }));

  // Continue the loop
  rafId = requestAnimationFrame(updateAllScrollValues);
};

  rafId = requestAnimationFrame(updateAllScrollValues);
  return () => cancelAnimationFrame(rafId);
}, []);

  // Smooth scroll with delay using RAF
useEffect(() => {
  let rafId: number;
  const smoothScroll = () => {
    setScrollState((prev) => {
      const diff = prev.targetScrollY - prev.scrollY;
      const speed = diff * (isMobile ? 0.2 : 0.03); // Faster on mobile
      if (Math.abs(diff) < 0.5) {
        return { ...prev, scrollY: prev.targetScrollY };
      }
      return { ...prev, scrollY: prev.scrollY + speed };
    });
    rafId = requestAnimationFrame(smoothScroll);
  };

  rafId = requestAnimationFrame(smoothScroll);
  return () => cancelAnimationFrame(rafId);
}, [isMobile]);

    // Smooth text transition progress (rubber band effect)
// Smooth text transition progress (rubber band effect)
useEffect(() => {
  let rafId: number;
  const smoothTransition = () => {
    setScrollState((prev) => {
      const section2Diff = prev.targetSection2Progress - prev.section2Progress;
      const section3Diff = prev.targetSection3Progress - prev.section3Progress;
      const speed = isMobile ? 0.25 : 0.08; // Faster on mobile

      let newSection2Progress = prev.section2Progress;
      let newSection3Progress = prev.section3Progress;

      if (Math.abs(section2Diff) > 0.001) {
        newSection2Progress = prev.section2Progress + section2Diff * speed;
      } else {
        newSection2Progress = prev.targetSection2Progress;
      }

      if (Math.abs(section3Diff) > 0.001) {
        newSection3Progress = prev.section3Progress + section3Diff * speed;
      } else {
        newSection3Progress = prev.targetSection3Progress;
      }

      return {
        ...prev,
        section2Progress: newSection2Progress,
        section3Progress: newSection3Progress,
      };
    });
    rafId = requestAnimationFrame(smoothTransition);
  };

  rafId = requestAnimationFrame(smoothTransition);
  return () => cancelAnimationFrame(rafId);
}, [isMobile]);

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
    if (typeof window === "undefined") return 1000;
    const vv = (window as Window).visualViewport?.height;
    return vv ? Math.round(vv) : window.innerHeight;
  };

  const viewportH = getViewportH();
  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1600;

  // const isMobile = viewportW < 768;

  const baseCircleSize = isMobile
    ? Math.min(Math.max(viewportW * 0.7, 260), 500)
    : Math.min(viewportW * 0.4, 500);

  const viewportDiagonal =
    typeof window !== "undefined"
      ? Math.sqrt(viewportW * viewportW + viewportH * viewportH)
      : 1800;

  const coverScale = Math.max(1, (viewportDiagonal * 1.1) / baseCircleSize);

  const stageCount = 4;
  const componentHeight = viewportH * stageCount;
  const stageHeight = componentHeight / 4;

  const clampedScroll = Math.max(0, Math.min(scrollState.scrollY, componentHeight));
  const currentStage = Math.min(Math.floor(clampedScroll / stageHeight), 3);
  const stageProgress = Math.min(
    1,
    Math.max(0, (clampedScroll - currentStage * stageHeight) / stageHeight)
  );

  const s1 = 1;
  const s2 = s1 + (coverScale - s1) / 3;
  const s3 = s1 + ((coverScale - s1) * 2) / 3;
  const s4 = coverScale;
  const stageScales = [s1, s2, s3, s4];

  const startScale = stageScales[currentStage];
  const endScale = stageScales[Math.min(currentStage + 1, 3)];

  const easeInOut = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  // Separate progress for image zoom (faster)
  const imageStageHeight = componentHeight / 3;
  const imageClampedScroll = Math.max(0, Math.min(scrollState.scrollY, componentHeight));
  const imageCurrentStage = Math.min(Math.floor(imageClampedScroll / imageStageHeight), 2);
  const imageStageProgress = Math.min(
    1,
    Math.max(0, (imageClampedScroll - imageCurrentStage * imageStageHeight) / imageStageHeight)
  );

  const imageStageScales = [s1, s3, s4];
  const imageStartScale = imageStageScales[imageCurrentStage];
  const imageEndScale = imageStageScales[Math.min(imageCurrentStage + 1, 2)];

  const imageScale =
    imageCurrentStage === 2
      ? s4
      : imageStartScale + (imageEndScale - imageStartScale) * easeInOut(imageStageProgress);

  const textStageHeight = componentHeight / 4;
  const textClampedScroll = Math.max(0, Math.min(scrollState.scrollY, componentHeight));
  const textCurrentStage = Math.min(Math.floor(textClampedScroll / textStageHeight), 3);
  const textStageProgress = Math.min(
    1,
    Math.max(0, (textClampedScroll - textCurrentStage * textStageHeight) / textStageHeight)
  );
// Replace the image opacity calculation section with this:

// Image opacity - fade out only at the very end, when approaching "Who We Serve"
let imageOpacity = 1;

// Calculate when we're near the end of the scroll component
const scrollProgress = scrollState.scrollY / componentHeight;

// Start fading when we're 85% through the scroll component
// Fully faded by 95%
const fadeStartProgress = 0.85;
const fadeEndProgress = 0.95;

if (scrollProgress < fadeStartProgress) {
  imageOpacity = 1;
} else if (scrollProgress < fadeEndProgress) {
  const fadeProgress = (scrollProgress - fadeStartProgress) / (fadeEndProgress - fadeStartProgress);
  imageOpacity = 1 - easeInOut(fadeProgress);
} else {
  imageOpacity = 0;
}

  let fixedOpacity = 1;
  if (textCurrentStage < 3) {
    fixedOpacity = 1;
  } else {
    const fade = 1 - easeInOut(textStageProgress);
    fixedOpacity = Math.max(0, Math.min(1, fade * 0.2));
  }

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
          pointerEvents: fixedOpacity === 0 ? "none" : "auto",
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
          opacity: imageOpacity,
          visibility: imageOpacity === 0 ? "hidden" : "visible",
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
            // transition: "transform 0.1s linear",
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
  style={{ minHeight: isMobile ? "100svh" : "120svh" }}
>
  <div className="text-white max-w-lg">
    <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-5xl xl:text-6xl leading-relaxed drop-shadow-2xl">
      <span className="inline lg:block">Crafting</span>
      <span className="inline lg:hidden">&nbsp;</span>
      <span className="inline lg:block">Pathways,</span>
      <span className="block">That&nbsp;Endure</span>
    </h2>
  </div>

  <div className="text-white max-w-md md:self-end md:pb-8">
    <p
      className="
        text-lg sm:text-lg md:text-xl lg:text-2xl 
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
            {/* Section 2 */}
<div className="relative" ref={section2Ref}>
  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl drop-shadow-lg text-black">
    Our Ethos
  </p>
  <p
    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl drop-shadow-lg mb-4 text-white absolute top-0 left-0"
    style={{
      clipPath: `inset(0 ${100 - scrollState.section2Progress * 100}% 0 0)`,
    }}
  >
    Our Ethos
  </p>
</div>

<div className="relative mt-10">
  <p className="text-3xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl drop-shadow-lg mb-4 text-black">
    Lorem ipsum dolor sit amet consectetur. Egestas urna faucibus
    sit nibh augue morbi diam aliquet aenean. Mattis volutpat
    maecenas placerat orci. Sapien morbi ut tempus facilisis.
  </p>
  <p
    className="text-3xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl drop-shadow-lg mb-4 text-white absolute top-0 left-0"
    style={{
      clipPath: `inset(0 ${100 - scrollState.section2Progress * 100}% 0 0)`,
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
    <div className="relative" ref={section3Ref}>
      <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl drop-shadow-lg mb-4 text-black">
        Our Advisory Philosophy
      </p>
      <p
        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl drop-shadow-lg mb-4 text-white absolute top-0 left-0"
        style={{
          clipPath: `inset(0 ${100 - scrollState.section3Progress * 100}% 0 0)`,
        }}
      >
        Our Advisory Philosophy
      </p>
    </div>

    <div className="relative mt-10">
      <p className="text-3xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl drop-shadow-lg mb-4 text-black">
        Our approach begins with your real-life goals, not just
        financial metrics. Whether it&apos;s legacy building, education,
        lifestyle security, or intergenerational wealth, our strategies
        are:
      </p>
      <p
        className="text-3xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl drop-shadow-lg mb-4 text-white absolute top-0 left-0"
        style={{
          clipPath: `inset(0 ${100 - scrollState.section3Progress * 100}% 0 0)`,
        }}
      >
        Our approach begins with your real-life goals, not just
        financial metrics. Whether it&apos;s legacy building, education,
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