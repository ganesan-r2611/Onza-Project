"use client";

import React, { useState } from "react";
import Image from "next/image";
import faqData from "@/json/faq.json";
import { imageMap } from "@/libs/imageMap";

type FAQItem = {
  id: number;
  question: string;
  answer: string;
};

export default function FAQSection() {
  const items: FAQItem[] = faqData.items;
  // open first by default; set null to have all closed
  const [activeId, setActiveId] = useState<number | null>(items[0]?.id ?? null);

  const toggle = (id: number) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  const illustration = imageMap[faqData.imageKey]; // uses your imageMap.meditation

  return (
    <section className="w-full bg-[#121819] pt-[78px] pb-[78px]">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-8 justify-start items-start w-full max-w-[1360px] mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-[18px] justify-start items-start w-full">
            <h2 className="text-[20px] font-normal leading-[27px] text-[#ffdc81]">
              {faqData.title}
            </h2>
            <p className="text-[20px] sm:text-[24px] md:text-[26px] font-light leading-[24px] sm:leading-[28px] md:leading-[30px] text-[#bbbbbb] w-full lg:w-[48%]">
              {faqData.subtitle}
            </p>
          </div>

          {/* Content: align to start so image doesn't move when right column expands */}
          <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-8">
            {/* Image (left) — keeps a stable height and won't be affected by right column) */}
            <div className="w-full lg:w-[48%] self-start lg:sticky lg:top-24">
              {illustration ? (
                <div className="rounded-[24px] overflow-hidden w-full">
                  <Image
                    src={illustration}
                    alt="FAQ illustration"
                    width={652}
                    height={444}
                    className="w-full h-auto object-cover rounded-[24px]"
                    priority
                  />
                </div>
              ) : null}
            </div>

            {/* FAQ list (right) */}
            <div className="flex flex-col gap-4 w-full lg:w-[46%]">
              {items.map((faq) => {
                const expanded = activeId === faq.id;
                return (
                  <div key={faq.id} className="w-full">
                    <div
                      className={`transition-all duration-200 overflow-hidden ${
                        expanded ? "" : ""
                      }`}
                    >
                      <div
                        className={`bg-[#0a0a0a] rounded-[24px] px-4 py-5 ${
                          expanded ? "shadow-lg" : "cursor-pointer"
                        }`}
                        role="button"
                        tabIndex={0}
                        aria-expanded={expanded}
                        aria-controls={`faq-panel-${faq.id}`}
                        onClick={() => toggle(faq.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            toggle(faq.id);
                          }
                        }}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-[18px] font-light leading-[24px] text-[#fafafa]">
                            {faq.question}
                          </span>

                          <span className="ml-4 flex-shrink-0">
                            <svg
                              className={`w-6 h-6 transform transition-transform duration-200 ${
                                expanded ? "rotate-180" : "rotate-0"
                              }`}
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden
                            >
                              <path
                                d="M6 9l6 6 6-6"
                                stroke="#fafafa"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </div>

                        {/* Answer */}
                        {expanded && (
                          <div
                            id={`faq-panel-${faq.id}`}
                            className="mt-4 text-[14px] font-normal leading-[21px] text-[#bbbbbb]"
                          >
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
