"use client";
import React from "react";
import ServicesTabs, { ServiceTab } from "./Tabs";
import servicesData from "@/json/who-we-serve.json";

export default function ServicesSection() {
  const tabs: ServiceTab[] = servicesData.items;

  return (
    <section className="w-full pt-[80px] pb-[80px]">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-6">
        <div className="flex flex-col gap-[80px] justify-start items-center w-full">
          {/* Section heading */}
          <div className="flex flex-col lg:flex-row justify-between items-start w-full max-w-[1360px] mx-auto mt-[102px]">
            <h2 className="text-[20px] font-normal leading-[27px] text-[#fafafa] ml-[80px] mb-6 lg:mb-0">
              {servicesData.title}
            </h2>
            <p className="text-[32px] sm:text-[38px] md:text-[46px] font-light leading-tight text-[#fafafa] w-full lg:w-[52%] self-center">
              {servicesData.subtitle}
            </p>
          </div>

          {/* Tabs */}
          <ServicesTabs tabs={tabs} />
        </div>
      </div>
    </section>
  );
}
