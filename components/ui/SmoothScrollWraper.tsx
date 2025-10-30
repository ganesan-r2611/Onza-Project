// components/ConditionalSmoothScroll.tsx
'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

interface ConditionalSmoothScrollProps {
  children: React.ReactNode;
  excludeHero?: boolean;
}

export default function ConditionalSmoothScroll({ 
  children, 
  excludeHero = true 
}: ConditionalSmoothScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    // Only enable ScrollSmoother if we're not excluding hero
    if (!excludeHero) {
      let ctx = gsap.context(() => {
        ScrollSmoother.create({
          wrapper: scrollRef.current,
          content: contentRef.current,
          smooth: 1.5,
          effects: true,
          normalizeScroll: true,
          ignoreMobileResize: true,
        });
      });

      return () => ctx.revert();
    }
  }, [excludeHero]);

  if (excludeHero) {
    // Return children without smooth scrolling wrapper
    return <>{children}</>;
  }

  return (
    <div
      ref={scrollRef}
      id="smooth-wrapper"
      className="fixed top-0 left-0 w-full h-screen overflow-hidden"
    >
      <div
        ref={contentRef}
        id="smooth-content"
        className="will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}