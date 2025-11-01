"use client";

import { useState, useEffect } from "react";
import ServicesCarouselSection from "./ServiceCarousel";
import ServiceCarouselIntro from "./ServiceCarouselIntro";
import SectionZoomComponent from "./SectionZoomComponent";
import VerticalSnapScroll, { SnapItem } from "./VerticalSnapScroll";

interface SnapScrollContentProps {
  data: {
    isMobile?: boolean;
    eyebrow: string;
    cta: { label: string; href: string };
    items: Array<{ title: string; desc: string; imageKey: string }>;
  };
}

export default function SnapScrollContent({ data }: SnapScrollContentProps) {
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0);
 
  // Mobile: Separate intro + carousel sections
  const mobileSnapItems: SnapItem[] = [
    {
      id: "intro",
      type: "simple",
      content: (
        <section
          className="scroll-section min-h-screen relative flex flex-col md:flex-row justify-end md:justify-between items-start md:items-center"
          data-speed="1"
        >
          <div className="text-[#fbfbfb] max-w-lg">
            <h2 className="text-[40px] leading-[40px] font-light drop-shadow-2xl px-3 pb-2">
              <span className="inline lg:block">Crafting</span>
              <span className="inline lg:hidden">&nbsp;</span>
              <span className="inline lg:block">Pathways,</span>
              <span className="block">That&nbsp;Endure</span>
            </h2>
          </div>
          <div className="max-w-md md:self-end px-4 md:px-0 lg:pl-[47px] lg:pr-[40px] lg:mt-[715px]">
            <p className="text-[18px] font-light drop-shadow-lg leading-1 text-[#ffeec0]">
              Discreet and discerning guidance for those whose decisions define
              tomorrow&apos;s world.
            </p>
          </div>
        </section>
      ),
    },
    {
      id: "simple-section",
      type: "simple",
      content: (
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
      ),
    },
    {
      id: "another-simple",
      type: "simple",
      content: (
        <section
          className="scroll-section min-h-screen flex flex-col justify-center"
          data-speed="1"
        >
          <div className="max-w-8xl lg:max-w-8xl p-[15px] lg:p-[40px] lg:pl-[170px]">
            <p className="text-[18px] md:text-[24px] lg:text-[20px] font-regular mb-6 text-[#606060]">
              Our Advisory Philosophy
            </p>
            <p className="text-[31px] md:text-[58px] lg:text-[64px] leading-[1.1] lg:leading-[1.156] font-light tracking-[0.8px] text-[#0A0A0A]">
              Our approach begins with your real-life goals, not just financial
              metrics.
              <span className="hidden md:inline">
                <br />
              </span>
              Whether it&apos;s legacy building, education, lifestyle security,
              or intergenerational wealth, our strategies are:
            </p>
          </div>
        </section>
      ),
    },
    {
      id: "services-intro",
      type: "simple",
      content: <ServiceCarouselIntro data={data} />,
    }
    // {
    //   id: 'services-carousel',
    //   type: 'horizontal-scroll',
    //   content: <ServicesCarouselSection data={data} showIntro={false} />,
    // },
  ];

  // Desktop: Combined intro + carousel section (no separate intro snap)
  const desktopSnapItems: SnapItem[] = [
    {
      id: "intro",
      type: "simple",
      content: (
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
      ),
    },
    {
      id: "simple-section",
      type: "simple",
      content: (
        <section
          className="scroll-section min-h-screen flex flex-col justify-center items-center"
          data-speed="1"
        >
          <div className="max-w-8xl lg:max-w-7xl p-[15px] lg:p-[178px] lg:mt-[-50px]">
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
      ),
    },
    {
      id: "another-simple",
      type: "simple",
      content: (
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
      ),
    },
    {
      id: "services-carousel",
      type: "horizontal-scroll",
      content: <ServicesCarouselSection data={data} showIntro={true} />,
    },
  ];

  const snapItems = data?.isMobile ? mobileSnapItems : desktopSnapItems;

  return (
    <div
      className="relative w-full"
      style={{ height: `${snapItems.length * 100}vh` }}
    >
      {/* Background zoom component - sticky within this container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <SectionZoomComponent
          data={data}
          currentSnapIndex={currentSnapIndex}
          totalSnapItems={snapItems.length}
        />
      </div>

      {/* Snap container with content - on top of background */}
      <div className="absolute inset-0 z-10">
        <VerticalSnapScroll
          items={snapItems}
          scrollSpeed={0.4}
          snapThreshold={{ min: 100, max: 400 }}
          onIndexChange={setCurrentSnapIndex}
        />
      </div>
    </div>
  );
}
