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
    <section className="bg-white text-black" data-theme="light">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left column */}
          <div className="lg:col-span-6">
            <h3 className="text-sm text-gray-500 mb-3">Why Choose Us?</h3>
            <p className="text-lg md:text-xl leading-relaxed text-gray-800 max-w-xl">
              {data.subtitle}
            </p>

            {/* Values icons */}
            <div className="flex flex-wrap gap-8 mt-8">
              {values.map((v: ValueItem) => (
                <div key={v.label} className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-md bg-[#eafefe] flex items-center justify-center">
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
            <div className="w-full md:w-3/4 lg:w-[520px]">
              <div
                className="
        rounded-xl border border-[#cdeff0] bg-white shadow-md transition-all duration-300 p-6
        flex flex-col justify-between
        h-[260px] sm:h-[280px] md:h-[280px]
      "
                style={{ borderColor: "rgba(11,134,134,0.18)" }}
              >
                <p
                  className="text-base leading-7 text-gray-700 italic"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 6,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  “{items[index].text}”
                </p>

                {/* Author */}
                <div className="pt-4">
                  <span className="text-cyan-600 font-medium">
                    {items[index].author}
                  </span>
                  <div className="text-sm text-gray-500 mt-1">
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
        <div className="mt-16 border-t pt-8 overflow-hidden">
          <div className="marquee">
            {[...partnerLogos, ...partnerLogos].map(
              (key: string, idx: number) => (
                <div key={`${key}-${idx}`} className="inline-block px-8">
                  <div className="w-36 h-12 flex items-center justify-center opacity-70">
                    <Image
                      src={imageMap[key]}
                      alt={key}
                      width={140}
                      height={48}
                      className="object-contain opacity-60"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
