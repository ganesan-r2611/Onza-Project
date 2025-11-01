'use client';

// app/page.tsx
import { getStaticData } from "@/libs/getStaticData";
import NavBar from "@/components/NavBar";
import ScrollZoomComponent from "@/components/Scroll";
import ServicesSection from "@/components/Service";
import TestimonialsSection from "@/components/TestimonalSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import InsightsSection from "@/components/InsightSection";
import Footer from "@/components/Footer";
import SnapScrollContent from '../components/Snapscrollcontent';

export default async function HomePage() {
  const {
    navbarData,
    heroSectionData,
    servicesData,
    blogsData,
    faqData,
    testimonialData,
    contactData,
    footerData,
  } = await getStaticData();

  return (
    <>
      {/* Navbar - will appear over scroll component */}
      {/* <NavBar data={navbarData} /> */}

      <main>
        {/* Scroll Hero Section - NO pt-28, starts at top */}
        <div className="relative">
          {/* <section data-theme="dark">
            <ScrollZoomComponent data={heroSectionData} />
          </section> */}
          <section data-theme="dark">
             <SnapScrollContent data={heroSectionData}/>
          </section>
        </div>
        
        {/* Additional sections - scroll will automatically continue here after snap container */}
        <div className="relative">
          {/* Who We Serve */}
          <section data-theme="dark" id="additional-sections">
            <ServicesSection services={servicesData} />
          </section>

          {/* Testimonials */}
          <section data-theme="light">
            <TestimonialsSection data={testimonialData} />
          </section>

          {/* Contact */}
          <section data-theme="dark">
            <ContactSection data={contactData} />
          </section>

          {/* FAQ */}
          <section data-theme="light">
            <FAQSection data={faqData} />
          </section>

          {/* Insights */}
          <section data-theme="light">
            <InsightsSection blogs={blogsData} />
          </section>
        </div>
      </main>

      <Footer data={footerData} />
    </>
  );
}