// components/HomeComponent.tsx
'use client';

import { useEffect, useState } from "react";
import SnapScrollContent from "./Snapscrollcontent";
import ServicesCarouselSection from "./ServiceCarousel";
import ServicesSection, { ServicesData } from "./Service";
import TestimonialsSection, { TestimonialsData } from "./TestimonalSection";
import ContactSection, { ContactData } from "./ContactSection";
import FAQSection, { FAQData } from "./FAQSection";
import InsightsSection, { BlogsData } from "./InsightSection";
import ServiceCarouselIntro from "./ServiceCarouselIntro";

interface HomeComponentProps {
  staticData: {
    heroSectionData: {
        eyebrow: string;
        cta: {
            label: string;
            href: string;
        };
        items: {
            title: string;
            desc: string;
            imageKey: string;
        }[];
    };
    servicesData: ServicesData
    blogsData: BlogsData
    testimonialData: TestimonialsData
    contactData: ContactData
    faqData: FAQData
  };
}

export default function HomeComponent({ staticData }: HomeComponentProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const {
    heroSectionData,
    servicesData,
    blogsData,
    faqData,
    testimonialData,
    contactData,
  } = staticData;

  return (
    <main>
      <div className="relative">
        <section data-theme="dark">
          <SnapScrollContent data={{...heroSectionData, isMobile}}/>
        </section>
      </div>
      
      <div className="relative">
        <section 
          data-theme="dark" 
          id={isMobile ? 'additional-sections' : 'not-additional-sections'} 
          className={`${!isMobile ? 'hidden' : ''} bg-[#E5D4C3]`}
        >
          <ServiceCarouselIntro data={heroSectionData} />
          <ServicesCarouselSection data={heroSectionData} showIntro={false} />
        </section>
        
        <section 
          data-theme="dark" 
          id={isMobile ? 'non-additional-sections' : 'additional-sections'}
        >
          <ServicesSection services={servicesData} />
        </section>

        <section data-theme="light">
          <TestimonialsSection data={testimonialData} />
        </section>

        <section data-theme="dark">
          <ContactSection data={contactData} />
        </section>

        <section data-theme="light">
          <FAQSection data={faqData} />
        </section>

        <section data-theme="light">
          <InsightsSection blogs={blogsData} />
        </section>
      </div>
    </main>
  );
}