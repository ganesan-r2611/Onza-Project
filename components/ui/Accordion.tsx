"use client";

import { useState } from "react";

type AccordionItem = {
  id: number;
  question: string;
  answer: string;
};

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [activeId, setActiveId] = useState<number | null>(items[0]?.id ?? null);

  const toggle = (id: number) =>
    setActiveId((prev) => (prev === id ? null : id));

  return (
    <div className="flex flex-col gap-4">
      {items.map((faq) => {
        const expanded = activeId === faq.id;

        return (
          <div key={faq.id}>
            <div
              className={`bg-[#0a0a0a] rounded-[24px] px-6 py-5 cursor-pointer transition-all duration-200 ${
                expanded ? "shadow-lg" : ""
              }`}
              onClick={() => toggle(faq.id)}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`text-[22px] font-regular leading-[24px] transition-colors duration-300 ${
                    expanded ? "text-[#FFDC81]" : "text-white"
                  }`}
                >
                  {faq.question}
                </span>

                {/* Icon changes based on expanded state */}
                {expanded ? (
                  // ✕ Close icon
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 6l12 12M6 18L18 6"
                      stroke="#ffffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  // ▼ Chevron icon
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="#ffffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              {expanded && (
                <div className="mt-3 text-[14px] text-[#bbbbbb] font-light leading-[22px]">
                  {faq.answer}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
