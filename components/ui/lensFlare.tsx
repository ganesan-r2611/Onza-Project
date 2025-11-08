"use client";

import React, { useEffect, useMemo, useState } from "react";

type FlarePosition = { x: number; y: number; t: number };

export type LensFlareBackgroundProps = {
  count?: number;
  radius?: number;
  speed?: number;
  tickMs?: number;
  gradients?: string[];
  className?: string;
  withSpaceGradient?: boolean;
};

const DEFAULT_GRADIENTS: string[] = [
  "radial-gradient(circle, rgba(125, 214, 221, 0.65) 0%, rgba(125, 214, 221, 0.45) 35%, rgba(125, 214, 221, 0.25) 60%, transparent 80%)",
  "radial-gradient(circle, rgba(60, 194, 204, 0.55) 0%, rgba(60, 194, 204, 0.4) 35%, rgba(60, 194, 204, 0.22) 60%, transparent 80%)",
  "radial-gradient(circle, rgba(10, 80, 96, 0.5) 0%, rgba(10, 80, 96, 0.35) 35%, rgba(10, 80, 96, 0.18) 60%, transparent 80%)",
  "radial-gradient(circle, rgba(190, 235, 238, 0.7) 0%, rgba(190, 235, 238, 0.5) 35%, rgba(190, 235, 238, 0.3) 60%, transparent 80%)",
  "radial-gradient(circle, rgba(10, 10, 10, 0.6) 0%, rgba(10, 10, 10, 0.4) 35%, rgba(10, 10, 10, 0.2) 60%, transparent 80%)",
];

export default function LensFlareBackground({
  count = 5,
  radius = 65,
  speed = 0.015,
  tickMs = 50,
  gradients = DEFAULT_GRADIENTS,
  className = "",
  withSpaceGradient = true,
}: LensFlareBackgroundProps) {
  const [positions, setPositions] = useState<FlarePosition[]>(
    Array.from({ length: count }, (_, i) => ({
      x: 50,
      y: 50,
      t: (i * (2 * Math.PI)) / Math.max(1, count),
    }))
  );

  // Calculate capped viewport width (max at 1440px)
  // const getCappedVw = (pxValue: number) => {
  //   if (typeof window === "undefined") return `${pxValue}px`;
  //   const actualVw = window.innerWidth;
  //   if (actualVw > 1440) {
  //     // Convert vw to px based on 1440px viewport
  //     const pxValue = (vwValue / 100) * 1440;
  //     return `${pxValue}px`;
  //   }
  //   return `${pxValue}px`;
  // };

  // const [flareSize, setFlareSize] = useState(getCappedVw(75));
  // const [blurSize, setBlurSize] = useState(getCappedVw(3.33));

  // Update sizes on window resize
  // useEffect(() => {
  //   const handleResize = () => {
  //     setFlareSize(getCappedVw(75));
  //     setBlurSize(getCappedVw(3.33));
  //   };

  //   handleResize(); // Set initial values
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);


  // Reduce motion preference support
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => {
      setPositions((prev) =>
        prev.map((f) => {
          const t = f.t + speed;
          return {
            t,
            x: 50 + Math.cos(t) * radius,
            y: 50 + Math.sin(t) * radius,
          };
        })
      );
    }, tickMs);
    return () => clearInterval(id);
  }, [speed, tickMs, radius, prefersReducedMotion]);

  return (
    <div className={`absolute inset-0 ${className}`}>
      {withSpaceGradient && (
        <div
          className="absolute inset-0 -z-10 transition-opacity duration-[700ms]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, #0A0A0A 0%, #0A0A0A 50%, #051a1a 80%, #020f0f 100%)",
          }}
        />
      )}

      {positions.map((p, i) => {
        const gradient = gradients[i] ?? DEFAULT_GRADIENTS[i % DEFAULT_GRADIENTS.length];
        return (
          <div
            key={i}
            className="absolute rounded-full blur-3xl 2xl:blur-[4.44vw] opacity-60 pointer-events-none"
            style={{
              width: "clamp(750px, 75vw, 100vw)",
              height: "clamp(750px, 75vw, 100vw)",
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: "translate(-50%, -50%)",
              background: gradient,
              transition: prefersReducedMotion ? undefined : "transform 0.5s ease-out",
            }}
          />
        );
      })}
    </div>
  );
}