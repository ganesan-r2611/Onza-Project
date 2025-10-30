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
      t: (i * (2 * Math.PI)) / Math.max(1, count), // evenly spaced angles
    }))
  );

  // Reduce motion preference support
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return; // keep static if user prefers less motion
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
          className="absolute inset-0 -z-10 transition-opacity duration-700"
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
            className="absolute rounded-full blur-3xl opacity-60 pointer-events-none"
            style={{
              width: "clamp(750px, 75vw, 1200px)",
              height: "clamp(750px, 75vw, 1200px)",
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