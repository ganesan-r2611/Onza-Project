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
      <div className="max-w-7xl mx-auto pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start px-6">
          {/* Left column */}
          <div className="lg:col-span-6">
            <h3 className="text-[20px] font-regular mb-3 text-[#4A4A4A]">
              Why Choose Us?
            </h3>
            <p className="text-[26px] md:text-xl font-light leading-relaxed text-[#0A5060] max-w-xl">
              {data.subtitle}
            </p>

            {/* Values icons */}
            <div className="flex flex-wrap gap-8 mt-28">
              {values.map((v: ValueItem) => (
                <div key={v.label} className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-md bg-[rgba(60,194,204,0.1)] flex items-center justify-center">
                    <Image
                      src={imageMap[v.icon]}
                      alt={v.label}
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  <div className="text-sm text-gray-700 text-center">
                    {v.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-6 flex flex-col items-end gap-6">
            {/* Testimonial card */}
            <div className="w-full md:w-3/4 lg:w-[528px]">
              <div
                className="
        rounded-[16px] border border-[#0A5060] shadow-md transition-all duration-300 p-8
        flex flex-col justify-between
        h-[260px] sm:h-[280px] md:h-[280px]
      "
              >
                <p
                  className="text-[18px] text-italic leading-7 text-[#0A0A0A]"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 6,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {items[index].text}
                </p>

                {/* Author */}
                <div className="pt-1">
                  <span className="text-[20px] text-[#28A0AA] font-regular">
                    {items[index].author}
                  </span>
                  <div className="text-[16px] text-light text-[#606060] mt-1">
                    {items[index].position}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation arrows */}
            <div className="flex gap-6 justify-end w-full md:w-3/4 lg:w-[520px]">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition"
                aria-label="Previous testimonial"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-gray-700"
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
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-100 transition"
                aria-label="Next testimonial"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="stroke-gray-700"
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
        <div className="mt-5 pt-8">
          <div className="grid grid-cols-2 sm:flex sm:flex-row justify-center items-center gap-6 sm:gap-[80px] lg:gap-[210px] pl-12 lg:pl-0">
            {partnerLogos.map((key: string) => (
              <div
                key={key}
                className="w-28 sm:w-36 h-[100px] sm:h-[140px] flex items-center justify-center flex-shrink-0"
              >
                <Image
                  src={imageMap[key]}
                  alt={key}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
