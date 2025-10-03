// components/ContactSection.tsx (SERVER)
import Image from "next/image";
import { imageMap } from "@/libs/imageMap";
import ContactForm from "./ui/ContactForm.client";

export interface ContactFormData {
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  submitText: string;
}
export interface ContactData {
  title: string;
  subtitle: string;
  emailLabel: string;
  email: string;
  form: ContactFormData;
}

export default function ContactSection({ data }: { data: ContactData }) {
  return (
    <section className="relative w-full" data-theme="dark">
      {/* Background */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={imageMap.bannerContact}
          alt="contact background"
          fill
          style={{ objectFit: "cover", objectPosition: "center" }}
          priority
        />
      </div>
      <div className="absolute inset-0 -z-20 bg-black/30" />

      {/* Content Wrapper */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-14 pt-[70px] pb-[70px]">
        <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-10 lg:gap-16">
          {/* Left: Title and Email */}
          <div className="w-full lg:w-[60%] flex flex-col">
            <h2 className="text-[18px] sm:text-[20px] font-normal text-[#e6e0da]">
              {data.title}
            </h2>
            <p className="text-[26px] sm:text-[32px] md:text-[38px] font-light leading-[34px] md:leading-[44px] text-[#ffdc81] w-full lg:w-[80%] mt-3">
              {data.subtitle}
            </p>

            <div className="mt-12 sm:mt-16">
              <p className="text-[18px] sm:text-[20px] text-[#fafafa] mb-2">
                {data.emailLabel}
              </p>
              <a
                href={`mailto:${data.email}`}
                className="text-[18px] sm:text-[20px] text-[#ffdc81] underline hover:text-[#ffeec0]"
              >
                {data.email}
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="w-full lg:w-[38%] flex justify-center lg:justify-end">
            <div className="glass-border rounded-[24px] p-[2px] w-full max-w-[480px]">
              <div className="backdrop-blur-md bg-white/5 rounded-[22px] p-6 sm:p-8 md:p-10">
                <ContactForm data={data.form} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
