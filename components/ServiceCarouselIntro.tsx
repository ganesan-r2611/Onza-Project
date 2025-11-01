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
    <div className="w-full h-full flex items-center bg-[#E5D4C3] backdrop-blur-sm text-[#1a1a1a]">
      <div className="w-full h-full flex items-center justify-center px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl text-left">
          <p className="text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] leading-[1.2] font-light mb-8">
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