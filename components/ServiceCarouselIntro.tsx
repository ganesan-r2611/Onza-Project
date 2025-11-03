"use client";

import Link from "next/link";

type Props = {
  data: {
    eyebrow: string;
    cta: { label: string; href: string };
  };
};

export default function ServiceCarouselIntro({ data }: Props) {
  const { eyebrow, cta } = data;

  return (
     <div className="w-full flex items-center backdrop-blur-sm text-[#1a1a1a] bg-[#E5D4C3]">
              <div className="w-full h-full flex px-4 pt-20">
                <div className="max-w-2xl text-left">
                  <p className="text-[28px] leading-[1.2] font-light mb-8">
                    {eyebrow}
                  </p>

                  <Link href={cta.href} className="inline-block">
                    <button className="glass-border-button px-8 py-4 text-[16px] sm:text-[18px] text-white hover:bg-white/10 transition-colors">
                      {cta.label}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
  );
}