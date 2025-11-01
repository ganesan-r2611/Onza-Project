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
              className={`bg-[#0a0a0a] w-[328px] md:w-[628px] rounded-[24px] p-8 cursor-pointer transition-all duration-500 ease-in-out ${
                expanded ? "shadow-lg" : ""
              }`}
              style={{
                height: expanded ? '166px' : '91px',
                transition: 'height 500ms ease-in-out, box-shadow 500ms ease-in-out'
              }}
              onClick={() => toggle(faq.id)}
            >
              <div className="flex justify-between items-start">
                <span
                  className={`text-[16px] md:text-[22px] font-regular leading-[20px] transition-colors duration-300 ${
                    expanded ? "text-[#FFDC81]" : "text-white"
                  }`}
                >
                  {faq.question}
                </span>

                {/* Icon with rotation animation */}
                <div className={`transform transition-transform duration-500 ${expanded ? 'rotate-180' : 'rotate-0'}`}>
                  <svg
                    className="w-5 h-5 flex-shrink-0"
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
                </div>
              </div>

              {/* Answer with fade-in animation */}
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  expanded ? 'max-h-32 opacity-100 mt-3' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="text-[14px] text-[#bbbbbb] font-light leading-[16px]">
                  {faq.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}