import React from "react";
import ServicesTabs, { ServiceTab } from "./ui/Tabs";
import LensFlareBackground from "./ui/lensFlare";

export interface ServicesData {
  title: string;
  subtitle: string;
  items: ServiceTab[];
}

export default function ServicesSection({ services }: { services: ServicesData }) {
  const tabs = services.items;

  return (
    <section className="relative overflow-hidden lg:pt-[80px] min-h-screen flex items-center justify-center">
      <LensFlareBackground
        className="-z-10"
        withSpaceGradient
      />
      <div className="relative z-10 w-full">
        <div className="mx-auto sm:px-8 lg:pb-10">
          <div className="flex flex-col gap-[64px] items-center">
            <div className="flex flex-col lg:flex-row items-start mt-[64px] ml-3 lg:ml-0">
                <h2 className="text-[20px] font-regular leading-[27px] text-[#fbfbfb] mb-6 lg:mb-0 lg:ml-[80px] lg:w-[165px]">
                {services.title}
              </h2>
              <p className="text-[32px] sm:text-[38px] md:text-[46px] font-light leading-tight text-[#fafafa] w-full lg:w-[57%] lg:ml-[495px]">
                {services.subtitle}
              </p>
            </div>
            <ServicesTabs tabs={tabs} />
          </div>
        </div>
      </div>
    </section>
  );
}
