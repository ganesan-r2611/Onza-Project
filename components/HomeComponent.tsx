'use client';

// components/HomeContent.tsx
import { useEffect, useState } from "react";
import SnapScrollContent from "./Snapscrollcontent";
import ServicesCarouselSection from "./ServiceCarousel";
import ServicesSection, { ServicesData } from "./Service";
import Footer, { FooterData } from "./Footer";
import TestimonialsSection, { TestimonialsData } from "./TestimonalSection";
import ContactSection, { ContactData } from "./ContactSection";
import FAQSection, { FAQData } from "./FAQSection";
import InsightsSection, { BlogsData } from "./InsightSection";
import NavBar,{NavbarData} from "./NavBar";

interface HomeContentProps {
  staticData: {
    navbarData: NavbarData
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
    footerData: FooterData
    faqData:FAQData
  };
}

export default function HomeContent({ staticData }: HomeContentProps) {
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
    navbarData,
    heroSectionData,
    servicesData,
    blogsData,
    faqData,
    testimonialData,
    contactData,
    footerData,
  } = staticData;

  return (
    <>
    <NavBar data={navbarData} />
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
            className={`${!isMobile ? 'hidden' : ''}`}
          >
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

      <Footer data={footerData} />
    </>
  );
}