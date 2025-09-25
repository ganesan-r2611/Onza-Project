"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import testimonialsData from "@/json/testimonial.json";
import { imageMap } from "@/libs/imageMap";

export default function TestimonialsSection() {
  const items = testimonialsData.items;
  const values = testimonialsData.values;
  const partnerLogos = testimonialsData.partnerLogos || [];

  const [index, setIndex] = useState(0);
  const autoRef = useRef<number | null>(null);

  // auto advance every 6s
  useEffect(() => {
    autoRef.current = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => {
      if (autoRef.current) window.clearInterval(autoRef.current);
    };
  }, [items.length]);

  const prev = () => setIndex((i) => (i > 0 ? i - 1 : items.length - 1));
  const next = () => setIndex((i) => (i < items.length - 1 ? i + 1 : 0));

  return (
    <section className="w-full bg-white text-black">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left column: heading, subtitle, icons */}
          <div className="lg:col-span-6">
            <h3 className="text-sm text-gray-500 mb-3">Why Choose Us?</h3>
            <p className="text-lg md:text-xl leading-relaxed text-gray-800 max-w-xl">
              {testimonialsData.subtitle}
            </p>

            {/* Values row */}
            <div className="flex gap-8 mt-8">
              {values.map((v) => (
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
                  <div className="text-sm text-gray-700">{v.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: testimonial card + nav */}
          <div className="lg:col-span-6 flex flex-col items-end gap-6">
            {/* Testimonial card */}
            <div className="w-full md:w-3/4 lg:w-[520px]">
              <div
                className="rounded-xl border border-[#cdeff0] p-6 bg-white shadow-md"
                style={{ borderWidth: 1, borderColor: "rgba(11,134,134,0.18)" }}
              >
                <p className="text-base leading-7 text-gray-700 italic">
                  “{items[index].text}”
                </p>

                <div className="mt-6">
                  <span className="text-cyan-600 font-medium">
                    {items[index].author}
                  </span>
                  <div className="text-sm text-gray-500 mt-1">
                    {items[index].position}
                  </div>
                </div>
              </div>
            </div>

            {/* Prev/Next buttons (separated) */}
            <div className="flex gap-6 justify-end w-full md:w-3/4 lg:w-[520px]">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
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
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
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

        {/* Horizontal marquee of partner logos (continuous scroll only) */}
        <div className="mt-16 border-t pt-8">
          <div className="overflow-hidden">
            <div className="marquee whitespace-nowrap will-change-transform">
              {[...partnerLogos, ...partnerLogos].map((key, idx) => (
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
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Only partner logos animate */}
      <style jsx>{`
        .marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
