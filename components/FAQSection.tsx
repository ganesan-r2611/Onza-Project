// components/FAQSection.tsx (Server Component)
import Image from "next/image";
import Accordion from "./ui/Accordion";
import { imageMap } from "@/libs/imageMap";

type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

export interface FAQData  {
  title: string;
  subtitle: string;
  imageKey: keyof typeof imageMap;
  items: FAQItem[];
};

export default function FAQSection({ data }: { data: FAQData }) {
  const illustration = imageMap[data.imageKey];

  return (
    <section
      className="bg-[#121819] pt-10 md:pt-[78px] 2xl:pt-[4.33vw] pb-[78px] 2xl:pb-[4.33vw]"
      data-theme="light"
    >
      <div className="mx-auto px-3 sm:px-9 lg:px-10 2xl:px-[2.78vw]">
        <div className="mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-4 2xl:gap-[1.111vw] mb-10 2xl:mb-[2.78vw]">
            <h2 className="text-[18px] md:text-[20px] 2xl:text-[1.39vw] font-regular text-[#ffdc81]">
              {data.title}
            </h2>
            <p className="text-[24px] md:text-[38px] 2xl:text-[2.64vw] font-light 2xl:font-regular leading-none text-[#bbbbbb] w-full lg:w-[50%]">
              {data.subtitle}
            </p>
          </div>

          {/* Mobile: Image below header */}
          {illustration && (
            <div className="block lg:hidden w-full mb-10 2xl:mb-[2.78vw]">
              <div className="w-full rounded-[24px] 2xl:rounded-[1.67vw] overflow-hidden">
                <Image
                  src={illustration}
                  alt="FAQ Illustration"
                  className="w-full h-[459px] 2xl:h-[25.5vw] object-cover rounded-[24px] 2xl:rounded-[1.67vw]"
                  priority
                />
              </div>
            </div>
          )}

          {/* Content: Two-column layout for desktop */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 2xl:gap-[2.222vw]">
            {/* Left: Image - Hidden on mobile, shown on desktop */}
            {illustration && (
              <div className="hidden lg:flex w-full lg:w-[55%] justify-center lg:justify-start">
                <div className="w-full rounded-[24px] 2xl:rounded-[1.67vw] overflow-hidden">
                  <Image
                    src={illustration}
                    alt="FAQ Illustration"
                    className="lg:w-[708px] 2xl:w-[49.17vw] lg:h-[702px] 2xl:h-[48.75vw] w-full h-auto object-cover rounded-[24px] 2xl:rounded-[1.67vw]"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Right: Accordion */}
            <div className="w-full lg:w-[50%]">
              <Accordion items={data.items} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}