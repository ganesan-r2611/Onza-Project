'use client';

import { useState, useEffect } from 'react';
import ServicesCarouselSection from './ServiceCarousel';
import ServiceCarouselIntro from './ServiceCarouselIntro';
import SectionZoomComponent from './SectionZoomComponent';
import VerticalSnapScroll, { SnapItem } from './VerticalSnapScroll';

export default function SnapScrollContent({ data }: { data: any }) {
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 769); // Mobile/tablet < 769px
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile: Separate intro + carousel sections
  const mobileSnapItems: SnapItem[] = [
    {
      id: 'intro',
      type: 'simple',
      content: (
      <section 
        className="scroll-section min-h-screen relative flex flex-col md:flex-row justify-end md:justify-between items-start md:items-center"
        data-speed="1"
      >
        <div className="text-white max-w-lg px-6">
          <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl leading-relaxed drop-shadow-2xl pt-24">
            <span className="inline lg:block">Crafting</span>
            <span className="inline lg:hidden">&nbsp;</span>
            <span className="inline lg:block">Pathways,</span>
            <span className="block">That&nbsp;Endure</span>
          </h2>
        </div>
        <div className="max-w-md md:self-end px-6 md:pb-8 mt-12 md:mt-0">
          <p className="text-lg md:text-xl lg:text-2xl drop-shadow-lg leading-relaxed text-[#ffdc81]">
            Discreet and discerning guidance for those whose decisions define
            tomorrow&apos;s world.
          </p>
        </div>
      </section>
      ),
    },
    {
      id: 'simple-section',
      type: 'simple',
      content: (
      <section 
        className="scroll-section min-h-screen flex flex-col justify-center items-center"
        data-speed="1"
      >
        <div className="max-w-8xl lg:max-w-7xl p-[40px] lg:p-[230px]">
          <p className="text-[18px] md:text-[24px] lg:text-xl font-regular lg:font-light mb-6 text-[#606060]">
            Our Ethos
          </p>
          <p className="text-[32px] md:text-2xl lg:text-6xl font-light text-[#000000]">
            Lorem ipsum dolor sit amet consectetur. Egestas urna faucibus sit
            nibh augue morbi diam aliquet aenean. Mattis volutpat maecenas
            placerat orci. Sapien morbi ut tempus facilisis.
          </p>
        </div>
      </section>
      ),
    },
    {
      id: 'another-simple',
      type: 'simple',
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
      id: 'services-intro',
      type: 'simple',
      content: <ServiceCarouselIntro data={data} />,
    },
    {
      id: 'services-carousel',
      type: 'horizontal-scroll',
      content: <ServicesCarouselSection data={data} showIntro={false} />,
    },
  ];

  // Desktop: Combined intro + carousel section (no separate intro snap)
  const desktopSnapItems: SnapItem[] = [
    {
      id: 'intro',
      type: 'simple',
      content: (
      <section 
        className="scroll-section min-h-screen relative flex flex-col md:flex-row justify-end md:justify-between items-start md:items-center"
        data-speed="1"
      >
        <div className="text-white max-w-lg px-6">
          <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl leading-relaxed drop-shadow-2xl pt-24">
            <span className="inline lg:block">Crafting</span>
            <span className="inline lg:hidden">&nbsp;</span>
            <span className="inline lg:block">Pathways,</span>
            <span className="block">That&nbsp;Endure</span>
          </h2>
        </div>
        <div className="max-w-md md:self-end px-6 md:pb-8 mt-12 md:mt-0">
          <p className="text-lg md:text-xl lg:text-2xl drop-shadow-lg leading-relaxed text-[#ffdc81]">
            Discreet and discerning guidance for those whose decisions define
            tomorrow&apos;s world.
          </p>
        </div>
      </section>
      ),
    },
    {
      id: 'simple-section',
      type: 'simple',
      content: (
        <section 
        className="scroll-section min-h-screen flex flex-col justify-center items-center"
        data-speed="1"
      >
        <div className="max-w-8xl lg:max-w-7xl p-[40px] lg:p-[230px]">
          <p className="text-[18px] md:text-[24px] lg:text-xl font-regular lg:font-light mb-6 text-[#606060]">
            Our Ethos
          </p>
          <p className="text-[32px] md:text-2xl lg:text-6xl font-light text-[#000000]">
            Lorem ipsum dolor sit amet consectetur. Egestas urna faucibus sit
            nibh augue morbi diam aliquet aenean. Mattis volutpat maecenas
            placerat orci. Sapien morbi ut tempus facilisis.
          </p>
        </div>
      </section>
      ),
    },
    {
      id: 'another-simple',
      type: 'simple',
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
      id: 'services-carousel',
      type: 'horizontal-scroll',
      content: <ServicesCarouselSection data={data} showIntro={true} />,
    },
  ];

  const snapItems = isMobile ? mobileSnapItems : desktopSnapItems;

  return (
    <div className="relative w-full" style={{ height: `${snapItems.length * 100}vh` }}>
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