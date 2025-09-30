import navbarData from "@/public/json/navbar.json";
import servicesData from "@/public/json/who-we-serve.json";
import blogsData from "@/public/json/insight-blog.json";
import faqData from "@/public/json/faq.json";
import testimonialData from "@/public/json/testimonial.json";
import contactData from "@/public/json/contact.json";
import footerData from "@/public/json/footer.json";

export async function getStaticData() {
  return {
    navbarData,
    servicesData,
    blogsData,
    faqData,
    testimonialData,
    contactData,
    footerData,
  };
}



// export async function getStaticData() {
//   const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

//   const [
//     navbarRes,
//     heroSectionRes,
//     servicesRes,
//     blogsRes,
//     faqRes,
//     testimonialRes,
//     contactRes,
//     footerRes,
//   ] = await Promise.all([
//     fetch(`${base}/json/navbar.json`, { next: { revalidate: 3600 } }),
//     fetch(`${base}/json/hero-service.json`, { next: { revalidate: 3600 } }),
//     fetch(`${base}/json/who-we-serve.json`, { next: { revalidate: 3600 } }),
//     fetch(`${base}/json/insight-blog.json`, { next: { revalidate: 3600 } }),
//     fetch(`${base}/json/faq.json`, { next: { revalidate: 3600 } }),
//     fetch(`${base}/json/testimonial.json`, { next: { revalidate: 3600 } }),
//     fetch(`${base}/json/contact.json`, { next: { revalidate: 3600 } }),
//     fetch(`${base}/json/footer.json`, { next: { revalidate: 3600 } }),
//   ]);

//   if (
//     !navbarRes.ok ||
//     !heroSectionRes.ok ||
//     !servicesRes.ok ||
//     !blogsRes.ok ||
//     !faqRes.ok ||
//     !testimonialRes.ok ||
//     !contactRes.ok ||
//     !footerRes.ok
//   ) {
//     throw new Error("Failed to load static data");
//   }

//   const [
//     navbarData,
//     heroSectionData,
//     servicesData,
//     blogsData,
//     faqData,
//     testimonialData,
//     contactData,
//     footerData,
//   ] = await Promise.all([
//     navbarRes.json(),
//     heroSectionRes.json(),
//     servicesRes.json(),
//     blogsRes.json(),
//     faqRes.json(),
//     testimonialRes.json(),
//     contactRes.json(),
//     footerRes.json(),
//   ]);

//   return {
//     navbarData,
//     heroSectionData,
//     servicesData,
//     blogsData,
//     faqData,
//     testimonialData,
//     contactData,
//     footerData,
//   };
// }


