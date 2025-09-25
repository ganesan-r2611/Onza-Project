import Head from "next/head";
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import ServicesSection from "../components/Service";
import Footer from "../components/Footer";
import TestimonialsSection from "@/components/TestimonalSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import InsightsSection from "@/components/InsightSection";

export default function Home() {
  return (
    <>
      <Head>
        <title>ONZA – Crafting Pathways</title>
        <meta name="description" content="ONZA homepage" />
      </Head>
      <div className="min-h-screen">
        <NavBar />
        <main className="pt-32">
          <Hero />
          <ServicesSection />
          <TestimonialsSection/>
          <ContactSection />
          <FAQSection />
          <InsightsSection/>
        </main>
      </div>
      <Footer />
    </>
  );
}
