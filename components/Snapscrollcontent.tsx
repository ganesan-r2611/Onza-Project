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
          className="scroll-section min-h-screen relative flex flex-col md:flex-row justify-end md:justify-between items-start md:items-center mt-[-50px] 2xl:mt-[-3.47vw] md:mt-0"
          data-speed="1"
        >
          <div className="text-[#fbfbfb] max-w-lg md:mt-[600px]">
            <h2 className="text-[40px] 2xl:text-[2.78vw] leading-[40px] 2xl:leading-[2.78vw] font-light drop-shadow-2xl px-3 2xl:px-[0.21vw] pb-2 2xl:pb-[0.14vw] md:px-4">
              <span className="inline lg:block">Crafting</span>
              <span className="inline lg:hidden">&nbsp;</span>
              <span className="inline lg:block">Pathways,</span>
              <span className="block">That&nbsp;Endure</span>
            </h2>
          </div>
          <div className="max-w-md px-4 2xl:px-[0.28vw] md:px-10 md:mt-[800px]">
            <p className="text-[18px] 2xl:text-[1.25vw] md:text-[24px] font-light drop-shadow-lg leading-1 2xl:leading-[0.07vw] text-[#ffeec0]">
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
          <div className="max-w-8xl lg:max-w-7xl p-[15px] 2xl:p-[1.04vw] lg:p-[178px] 2xl:p-[12.361vw] lg:mt-[-15px] 2xl:mt-[-1.042vw]">
            <p className="text-[18px] md:text-[24px] lg:text-[20px] 2xl:text-[1.389vw] font-regular mb-6 2xl:mb-[0.42vw] text-[#606060]">
              Our Ethos
            </p>
            <p className="text-[32px] md:text-[58px] lg:text-[64px] 2xl:text-[4.444vw] leading-[1.2] lg:leading-[1.156] 2xl:leading-[0.08vw] font-light tracking-[0.8px] 2xl:tracking-[0.06vw] lg:tracking-[0px] 2xl:tracking-[0vw] text-[#0A0A0A]">
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
          <div className="max-w-8xl lg:max-w-8xl p-[15px] lg:p-[40px] 2xl:p-[2.778vw] lg:pl-[170px] 2xl:pl-[11.806vw]">
            <p className="text-[18px] md:text-[24px] lg:text-[20px] 2xl:text-[1.389vw] font-regular mb-6 text-[#606060]">
              Our Advisory Philosophy
            </p>
            <p className="text-[31px] md:text-[58px] lg:text-[64px] 2xl:text-[4.444vw] leading-[1.1] lg:leading-[1.156] font-light tracking-[0.8px] 2xl:tracking-[0.056vw] text-[#0A0A0A]">
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
    }
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
          <div className="text-[#fbfbfb] max-w-lg lg:pl-[40px] 2xl:pl-[2.778vw] md:mt-[100px] lg:mt-[200px] 2xl:mt-[13.889vw]">
            <h2 className="text-[40px] lg:text-[64px] 2xl:text-[4.444vw] leading-[72px] 2xl:leading-[5.000vw] font-light drop-shadow-2xl pt-14 2xl:pt-[3.889vw] px-4 md:px-0 lg:pl-0">
              <span className="inline lg:block">Crafting</span>
              <span className="inline lg:hidden">&nbsp;</span>
              <span className="inline lg:block">Pathways,</span>
              <span className="block">That&nbsp;Endure</span>
            </h2>
          </div>
          <div className="max-w-md 2xl:max-w-[22.36vw] md:self-end px-4 md:px-0 lg:pl-[47px] 2xl:pl-[3.264vw] lg:pr-[40px] 2xl:pr-[2.778vw]">
            <p className="text-[18px] md:text-[18px] lg:text-[20px] 2xl:text-[1.389vw] font-light drop-shadow-lg leading-relaxed text-[#ffeec0]">
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
          <div className="max-w-8xl lg:max-w-7xl p-[15px] lg:p-[178px] 2xl:p-[12.361vw] lg:mt-[-50px] 2xl:mt-[-3.472vw]">
            <p className="text-[18px] md:text-[24px] lg:text-[20px] 2xl:text-[1.389vw] font-regular mb-6 text-[#606060]">
              Our Ethos
            </p>
            <p className="text-[32px] md:text-[58px] lg:text-[64px] 2xl:text-[4.444vw] leading-[1.2] lg:leading-[1.156] font-light tracking-[0.8px] lg:tracking-[0px] 2xl:tracking-[0vw] text-[#0A0A0A]">
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
          <div className="max-w-8xl lg:max-w-8xl p-[15px] lg:p-[40px] 2xl:p-[2.778vw] lg:pl-[170px] 2xl:pl-[11.806vw]">
            <p className="text-[18px] md:text-[24px] lg:text-[20px] 2xl:text-[1.389vw] font-regular mb-6 text-[#606060]">
              Our Advisory Philosophy
            </p>
            <p className="text-[32px] md:text-[58px] lg:text-[64px] 2xl:text-[4.444vw] leading-[1.1] lg:leading-[1.156] font-light tracking-[0.8px] 2xl:tracking-[0.056vw] text-[#0A0A0A]">
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