// components/FAQSection.tsx (Server Component)
import Image from "next/image";
import Accordion from "./ui/Accordion";
import { imageMap } from "@/libs/imageMap";

type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

type FAQData = {
  title: string;
  subtitle: string;
  imageKey: keyof typeof imageMap;
  items: FAQItem[];
};

export default function FAQSection({ data }: { data: FAQData }) {
  const illustration = imageMap[data.imageKey];

  return (
    <section
      className="bg-[#121819] pt-[78px] pb-[78px]"
      data-theme="light"
    >
      <div className="mx-auto px-6 sm:px-8 lg:px-10">
        <div className="mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-4 mb-10">
            <h2 className="text-[20px] font-regular text-[#ffdc81]">
              {data.title}
            </h2>
            <p className="text-[20px] md:text-[38px] font-light text-[#bbbbbb] w-full lg:w-[48%]">
              {data.subtitle}
            </p>
          </div>

          {/* Content: Two-column layout */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
            {/* Left: Image */}
            {illustration && (
              <div className="w-full lg:w-[55%] flex justify-center lg:justify-start">
                <div className="w-full rounded-[24px] overflow-hidden">
                  <Image
                    src={illustration}
                    alt="FAQ Illustration"
                    className="lg:w-[652px] lg:h-[525px] w-full h-auto object-cover rounded-[24px]"
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
