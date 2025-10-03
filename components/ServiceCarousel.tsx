import Link from "next/link";
import { imageMap } from "@/libs/imageMap";
import Carousel from "./ui/Carousel";

type Pillar = { title: string; desc: string; imageKey: keyof typeof imageMap };

type Props = {
  data: {
    eyebrow: string;
    cta: { label: string; href: string };
    items: Pillar[];
  };
};

export default function ServicesCarouselSection({ data }: Props) {
  const { eyebrow, cta, items } = data;

  return (
    <section
      className="w-full text-[#1a1a1a] min-h-screen flex items-center"
      data-theme="light"
    >
      {/* Content container */}
      <div
        className="
          mx-auto 
          px-6 sm:px-10 lg:px-[30px] 
          py-12 sm:py-16 lg:py-[120px]
        "
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left copy */}
          <div className="lg:col-span-5">
            <p className="text-3xl md:text-[26px] leading-[1.5] text-[#fff] whitespace-pre-line">
              {eyebrow}
            </p>

            <div className="mt-8">
              <Link href={cta.href} className="inline-block">
                <button className="glass-border-button border border-black/10 rounded-full px-6 py-3 text-[16px] text-[#fff]">
                  {cta.label}
                </button>
              </Link>
            </div>
          </div>

          {/* Right carousel */}
          <div className=" lg:col-span-7">
            <Carousel items={items} />
          </div>
        </div>
      </div>
    </section>
  );
}
