// components/ScrollZoomComponent.tsx
"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import ServicesCarouselSection from "./ServiceCarousel";
import { imageMap } from "@/libs/imageMap";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Pillar = { title: string; desc: string; imageKey: keyof typeof imageMap };

type Props = {
  data: {
    eyebrow: string;
    cta: { label: string; href: string };
    items: Pillar[];
  };
};

export default function SectionZoomComponent({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imageRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const getStageConfig = () => {
        const width = window.innerWidth;

        if (width <= 768) {
          return [1.2, 4, 7, 20];
        } else if (width <= 1180) {
          return [1.0, 3.5, 5.2, 9.0];
        } else {
          return [1.0, 3.5, 5.2, 9.0];
        }
      };

      const stages = getStageConfig();
      const sections = gsap.utils.toArray(".scroll-section") as HTMLElement[];

      const masterTL = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      sections.forEach((section, index) => {
        if (index < stages.length - 1) {
          masterTL.to(
            imageRef.current,
            {
              scale: stages[index + 1],
              duration: 1,
              ease: "power2.inOut",
            },
            `section-${index}`
          );
        }
      });

      // IMPORTANT: Refresh ScrollTrigger after setup
      ScrollTrigger.refresh();
    }, containerRef);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const imageStyle = {
    width: "min(65vw, 520px)",
    height: "auto",
  };

  return (
    <div ref={containerRef} className="relative w-full" data-speed="1">
      {/* Background */}
      <div
        className="fixed inset-0 -z-50"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #0f3333 0%, #0a2828 50%, #051a1a 80%, #020f0f 100%)",
        }}
      />

      {/* Zooming Image */}
      <div
        className="fixed inset-0 -z-30 flex items-center justify-center pointer-events-none"
        data-speed="0.5"
      >
        <div ref={imageRef} className="lg:mt-[200px]">
          <Image
            src={imageMap.onzaLgBG}
            alt="Onza Background"
            priority
            width={520}
            height={520}
            className="object-contain drop-shadow-2xl"
            style={imageStyle}
          />
        </div>
      </div>

      {/* Sections */}
      <section
        className="scroll-section min-h-screen relative flex flex-col md:flex-row justify-end md:justify-between items-start md:items-center"
        data-speed="1"
      >
        <div className="text-[#fbfbfb] max-w-lg lg:pl-[40px] lg:mt-[200px]">
          <h2 className="text-[40px] lg:text-[64px] leading-[72px] font-light drop-shadow-2xl pt-14 px-4 md:px-0 lg:pl-0">
            <span className="inline lg:block">Crafting</span>
            <span className="inline lg:hidden">&nbsp;</span>
            <span className="inline lg:block">Pathways,</span>
            <span className="block">That&nbsp;Endure</span>
          </h2>
        </div>
        <div className="max-w-md md:self-end px-4 md:px-0 lg:pl-[47px] lg:pr-[40px] lg:mt-[715px]">
          <p className="text-[18px] md:text-[18px] lg:text-[20px] font-light drop-shadow-lg leading-relaxed text-[#ffeec0]">
            Discreet and discerning guidance for those whose decisions define
            tomorrow&apos;s world.
          </p>
        </div>
      </section>

      <section
        className="scroll-section min-h-screen flex flex-col justify-center items-center"
        data-speed="1"
      >
        <div className="max-w-8xl lg:max-w-7xl p-[15px] lg:p-[178px] lg:mt-[-15px]">
          <p className="text-[18px] md:text-[24px] lg:text-[20px] font-regular mb-6 text-[#606060]">
            Our Ethos
          </p>
          <p className="text-[32px] md:text-[58px] lg:text-[64px] leading-[1.2] lg:leading-[1.156] font-light tracking-[0.8px] lg:tracking-[0px] text-[#0A0A0A]">
            Lorem ipsum dolor sit amet consectetur. Egestas urna faucibus sit
            nibh augue morbi diam aliquet aenean. Mattis volutpat maecenas
            placerat orci. Sapien morbi ut tempus facilisis.
          </p>
        </div>
      </section>

      <section
        className="scroll-section min-h-screen flex flex-col justify-center"
        data-speed="1"
      >
        <div className="max-w-8xl lg:max-w-8xl p-[15px] lg:p-[40px] lg:pl-[170px]">
          <p className="text-[18px] md:text-[24px] lg:text-[20px] font-regular mb-6 text-[#606060]">
            Our Advisory Philosophy
          </p>
          <p className="text-[32px] md:text-[58px] lg:text-[64px] leading-[1.1] lg:leading-[1.156] font-light tracking-[0.8px] text-[#0A0A0A]">
            Our approach begins with your real-life goals, not just financial
            metrics.
            <span className="hidden md:inline">
              <br />
            </span>
            Whether it&apos;s legacy building, education, lifestyle security, or
            intergenerational wealth, our strategies are:
          </p>
        </div>
      </section>

      <section
        className="scroll-section min-h-screen flex flex-col justify-center"
        data-speed="1"
      >
        <div className="relative z-10">
          <ServicesCarouselSection data={data} />
        </div>
      </section>
    </div>
  );
}
