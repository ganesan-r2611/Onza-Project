"use client";

import Link from "next/link";
import GlobalButton from "./ui/GlobalButton";

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
      <div className="w-full h-full flex px-4 2xl:px-4-[1.111vw] pt-20 2xl:pt-20-[5.556vw]">
        <div className="max-w-2xl text-left">
          <p className="text-[28px] leading-[1.2] font-light mb-8">{eyebrow}</p>
          <GlobalButton
            href={data.cta.href}
            width={186}
            height={61}
            paddingX={32}
            paddingY={16}
            fontSize={18}
            variant="primary"
          >
            {cta.label}
          </GlobalButton>
        </div>
      </div>
    </div>
  );
}
