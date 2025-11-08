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
    <section className="relative overflow-hidden lg:pt-[80px] 2xl:pt-[5.556vw] min-h-screen flex items-center justify-center">
      <LensFlareBackground
        className="-z-10"
        withSpaceGradient
      />
      <div className="relative z-10 w-full">
        <div className="mx-auto sm:px-8 2xl:px-[2.78vw] lg:pb-10 2xl:pb-[3.47vw]">
          <div className="flex flex-col gap-[64px] 2xl:gap-[4.44vw] items-center">
            <div className=" w-full flex flex-col lg:flex-row items-start mt-[64px] 2xl:mt-[4.444vw] ml-4 lg:ml-0">
                <h2 className="text-[18px] 2xl:text-[1.29vw] font-regular leading-[27px] 2xl:leading-[1.875vw] text-[#fbfbfb] mb-6 lg:mb-0 lg:ml-[80px] 2xl:ml-[5.556vw] lg:w-[165px] 2xl:w-[11.458vw]">
                {services.title}
              </h2>
              <p className="text-[28px] 2xl:text-[3.19vw] font-light leading-tight text-[#fafafa] w-full lg:w-[66%] lg:ml-[480px] 2xl:ml-[30vw]">
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
