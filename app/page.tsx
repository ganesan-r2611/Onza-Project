import { getStaticData } from "@/libs/getStaticData";

import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/Service";
import TestimonialsSection from "@/components/TestimonalSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import InsightsSection from "@/components/InsightSection";
import Footer from "@/components/Footer";

export default async function HomePage() {
  const {
    navbarData,
    servicesData,
    blogsData,
    faqData,
    testimonialData,
    contactData,
    footerData,
  } = await getStaticData();

  return (
    <>
      {/* Navbar stays client — receives data */}
      <NavBar data={navbarData} />

      <main className="pt-28">
        {/* Hero Section */}
        <section data-theme="dark">
          <Hero hero={navbarData.hero} />
        </section>

        {/* Who We Serve */}
        <section data-theme="dark">
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
      </main>

      <Footer data={footerData} />
    </>
  );
}
