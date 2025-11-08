"use client";
import { useState } from "react";
import Image from "next/image";
import { imageMap } from "@/libs/imageMap";

export interface TestimonialItem {
  text: string;
  author: string;
  position: string;
}
export interface ValueItem {
  icon: keyof typeof imageMap;
  label: string;
}
export interface TestimonialsData {
  subtitle: string;
  items: TestimonialItem[];
  values: ValueItem[];
  partnerLogos: (keyof typeof imageMap)[];
}

export default function TestimonialsSection({
  data,
}: {
  data: TestimonialsData;
}) {
  const items = data.items || [];
  const values = data.values || [];
  const partnerLogos = data.partnerLogos || [];

  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i > 0 ? i - 1 : items.length - 1));
  const next = () => setIndex((i) => (i < items.length - 1 ? i + 1 : 0));

  return (
    <section className="bg-[#FBFBFB] text-black" data-theme="light">
      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-start pt-[40px] md:pt-[120px] 2xl:pt-[8.33vw] pb-[10px] md:pb-[24px] 2xl:pb-[1.67vw] px-[16px] md:px-[140px] 2xl:px-[9.72vw]">
          {/* Left column - starts from left */}
          <div className="lg:col-span-5 lg:col-start-1 p-[12px] 2xl:p-[0.83vw]">
            <h3 className="text-[20px] 2xl:text-[1.39vw] mb-6 2xl:mb-[2.08vw] text-[#4A4A4A]">
              Why Choose Us?
            </h3>
            <p className="text-[26px] 2xl:text-[1.81vw] leading-none text-[#0A5060] md:px-0 max-w-[560px] 2xl:max-w-[38.89vw]">
              {data.subtitle}
            </p>

            {/* Values icons */}
            <div className="flex flex-wrap gap-12 lg:gap-16 2xl:gap-[1.11vw] mt-10 lg:mt-20 2xl:mt-[6.94vw]">
              {values.map((v: ValueItem) => (
                <div
                  key={v.label}
                  className="flex flex-col items-center gap-3 2xl:gap-[1.04vw]"
                >
                  <div className="w-8 2xl:w-[3.47vw] h-8 2xl:h-[3.47vw] rounded-md 2xl:rounded-[0.52vw] bg-[#3cc2cc10] flex items-center justify-center">
                    <div className="w-6 h-6 2xl:w-[1.94vw] 2xl:h-[1.94vw] relative">
  <Image
    src={imageMap[v.icon]}
    alt={v.label}
    fill
    className="object-contain"
  />
</div>
                  </div>
                  <div className="text-[20px] 2xl:text-[1.39vw] font-regular text-center lg:mt-1 2xl:mt-[0.278vw]">
                    {v.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - starts from right */}
          <div className="lg:col-span-5 lg:col-start-8 flex flex-col gap-6 2xl:gap-[2.08vw] md:items-end">
            {/* Testimonial card */}
            <div className="w-full md:w-3/4 lg:w-[528px] 2xl:w-[36.667vw]">
              <div
                className="
          rounded-[16px] 2xl:rounded-[1.111vw] border border-[#0A5060] shadow-md transition-all duration-300 p-5 lg:p-8 2xl:p-[2.78vw]
          flex flex-col justify-between
          h-[300px] sm:h-[263px] md:h-[263px] 2xl:h-[20.83vw]
        "
              >
                <p
                  className="text-[16px] md:text-[17px] 2xl:text-[1.11vw] font-light leading-7 2xl:leading-[2.43vw] text-[#0A0A0A]"
                  style={{
                    fontStyle: "italic",
                  }}
                >
                  {items[index].text}
                </p>

                {/* Author */}
                <div className="pt-1 2xl:pt-[0.35vw]">
                  <span className="text-[20px] 2xl:text-[1.39vw] text-[#28A0AA] font-regular">
                    {items[index].author}
                  </span>
                  <div className="text-[16px] 2xl:text-[1.11vw] text-light text-[#606060] mt-1 2xl:mt-[0.35vw]">
                    {items[index].position}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation arrows */}
            <div className="flex gap-[24px] 2xl:gap-[2.08vw] justify-end w-full md:w-3/4 lg:w-[520px] 2xl:w-[36.111vw]">
              <button
                onClick={prev}
                className="w-[44px] h-[44px] 2xl:w-[3.056vw] 2xl:h-[3.056vw] rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition"
                aria-label="Previous testimonial"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-custom-black w-[18px] h-[18px] 2xl:w-[1.25vw] 2xl:h-[1.25vw]"
                >
                  <path
                    d="M15 18l-6-6 6-6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              <button
                onClick={next}
                className="w-[44px] h-[44px] 2xl:w-[3.056vw] 2xl:h-[3.056vw] rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition"
                aria-label="Next testimonial"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-custom-black w-[18px] h-[18px] 2xl:w-[1.25vw] 2xl:h-[1.25vw]"
                >
                  <path
                    d="M9 6l6 6-6 6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="mt-[20px] 2xl:mt-[1.39vw] pt-[32px] 2xl:pt-[2.22vw]">
          <div className="grid grid-cols-2 sm:flex sm:flex-row justify-center items-center gap-6 lg:gap-[13vw] 2xl:gap-[14.56vw] pl-9 lg:pl-0">
            {partnerLogos.map((key: string) => (
              <div
                key={key}
                className="w-[180px]  2xl:w-[12.5vw] h-[100px] sm:h-[140px] 2xl:h-[9.72vw] flex items-center justify-center flex-shrink-0"
              >
                <Image
                  src={imageMap[key]}
                  alt={key}
                  className="object-contain max-w-full max-h-full "
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
