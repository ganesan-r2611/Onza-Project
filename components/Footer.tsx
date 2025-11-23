// components/Footer.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { imageMap } from "@/libs/imageMap";

export interface FooterData {
  description: string;
  contactText: string;
  address: string;
  socials: { icon: string; href: string }[];
  links: {
    general: { label: string; href: string }[];
    services: { label: string; href: string }[];
  };
  legal: { label: string; href: string }[];
  companyInfo: {
    name: string;
    registration: string;
    cin: string;
  }[];
}

export default function Footer({ data }: { data: FooterData }) {
  return (
    <footer className="bg-[#0a0a0a] text-[#E6E0DA] pb-6 2xl:pb-[1.67vw]">
      {/* Main Footer Content - 4 column layout */}
      <div className="flex flex-col">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-start justify-between px-8 md:px-[8.33vw] 2xl:px-[8.33vw] py-12 2xl:py-[5vw] md:py-16 2xl:md:py-[6.67vw] lg:py-20 2xl:lg:py-[8.33vw] gap-[40px] lg:gap-[5.56vw] 2xl:gap-[5.56vw] ">
          {/* Logo */}
          <div className="flex-1 flex flex-col items-start gap-[80px]">
            <div className="self-stretch flex flex-col items-start gap-[16px]">
              <div className="flex items-start">
                <Image
                  src={imageMap.footerlogo}
                  alt="ONZA Logo"
                  width={268}
                  height={75}
                  className="w-full h-15 md:h-18 lg:h-auto 2xl:h-[5.21vw] lg:w-[18.61vw] 2xl:w-[18.61vw]"
                />
              </div>
              <div className="self-stretch text-[18px] text-[#FBFBFB] font-light leading-[27px]">
                {data.description}
              </div>
            </div>

            {/* Follow Us Section */}
            <div className="self-stretch flex flex-col items-start justify-center gap-[8px]">
              <div className="text-[12px] font-medium text-[#FBFBFB] leading-[18px]">
                Follow Us
              </div>
              <div className="flex items-start gap-[16px]">
                {data.socials.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-6 h-6 flex items-center justify-center hover:bg-[#ffdc81] transition-colors"
                  >
                    <Image
                      src={imageMap[social.icon]}
                      alt={social.icon}
                      width={18}
                      height={18}
                      className="w-[18px] h-[18px] filter brightness-0 invert"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-[40px] lg:gap-[4.44vw] 2xl:gap-[4.44vw]">
            {/* Home Links */}
            <div className="w-full md:w-auto">
              <div className="flex flex-col items-start">
                {data.links.general.map((link, index) => (
                  <div
                    key={index}
                    className="w-full rounded-[999px] 2xl:rounded-[69.44vw] flex items-center py-2 2xl:py-[0.56vw]"
                  >
                    <Link
                      href={link.href}
                      className="text-[14px] 2xl:text-[0.97vw] font-medium text-[#E6E0DA] hover:text-[#ffdc81] transition-colors uppercase leading-[21px] 2xl:leading-[1.46vw]"
                    >
                      {link.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Links */}
            <div className="w-full md:w-auto">
              <div className="flex flex-col items-start">
                <div className="w-full rounded-[999px] 2xl:rounded-[69.44vw] flex items-center py-2 2xl:py-[0.56vw] mb-2 2xl:mb-[0.56vw]">
                  <span className="text-[14px] 2xl:text-[0.97vw] font-medium text-[#E6E0DA] uppercase leading-[21px] 2xl:leading-[1.46vw]">
                    Services
                  </span>
                </div>
                {data.links.services.map((service, index) => (
                  <div
                    key={index}
                    className="w-full rounded-[999px] 2xl:rounded-[69.44vw] flex items-center py-2 2xl:py-[0.56vw]"
                  >
                    <Link
                      href={""}
                      onClick={(e) => e.preventDefault()}
                      className="text-[12px] 2xl:text-[0.83vw] font-medium text-[#E6E0DA] hover:text-[#ffdc81] transition-colors leading-[18px] 2xl:leading-[1.25vw]"
                    >
                      {service.label}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="w-full md:w-[238px] 2xl:md:w-[16.53vw]">
              <div className="flex flex-col items-start gap-10 2xl:gap-[4.17vw]">
                <div className="flex flex-col items-start">
                  <div className="w-full rounded-[999px] 2xl:rounded-[69.44vw] flex items-center py-2 2xl:py-[0.56vw] mb-2 2xl:mb-[0.56vw]">
                    <span className="text-[14px] 2xl:text-[0.97vw] font-medium text-[#E6E0DA] uppercase leading-[21px] 2xl:leading-[1.46vw]">
                      Contact Info
                    </span>
                  </div>
                  <div className="w-full rounded-[999px] 2xl:rounded-[69.44vw] flex items-center pt-2 2xl:pt-[0.56vw]">
                    <div className="text-[12px] 2xl:text-[0.83vw] font-medium text-[#E6E0DA] leading-[18px] 2xl:leading-[1.25vw]">
                      <p className="mb-1 2xl:mb-[0.28vw]">Registered Office</p>
                      <p className="mb-1 2xl:mb-[0.28vw]">
                        Onza Private Limited
                      </p>
                      <p className="mb-1 2xl:mb-[0.28vw]">
                        118, Okhla Industrial Estate Phase-III
                      </p>
                      <p className="mb-1 2xl:mb-[0.28vw]">Bengaluru 560033</p>
                      <p className="mb-0">Tel: +91 123-486-8423</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Info Section */}
        <div className="border-t border-b border-[#d1b67c]/40 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 2xl:gap-[2.22vw] mb-8 px-4 lg:px-[8.33vw] lg:py-12 md:px-8 md:py-10">
            {data.companyInfo.map((company, index) => (
              <div key={index}>
                <h5 className="text-[18px] 2xl:text-[1.25vw] md:text-[20px] 2xl:md:text-[1.389vw] font-regular text-[#E6E0DA] mb-2 2xl:mb-[0.69vw]">
                  {company.name}
                </h5>
                <p className="text-[12px] 2xl:text-[0.833vw] font-medium text-[#E6E0DA] mb-1 2xl:mb-[0.35vw]">
                  {company.registration}
                </p>
                <p className="text-[12px] 2xl:text-[0.833vw] font-medium text-[#E6E0DA]">
                  {company.cin}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="px-8 lg:px-[8.33vw] 2xl:px-[8.33vw] pt-6 2xl:pt-[1.67vw]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 2xl:gap-[1.11vw]">
            <div className="text-[14px] 2xl:text-[0.97vw] font-light text-[#e8e8e8] leading-[21px] 2xl:leading-[1.46vw] whitespace-pre-wrap flex-1">
              2025 Onza. All Rights Reserved
            </div>
            <div className="flex gap-10 md:gap-[40px] 2xl:gap-[2.78vw]">
              {data.legal.map((legal, index) => (
                <Link
                  key={index}
                  href={""}
                  onClick={(e) => e.preventDefault()}
                  className="text-[14px] 2xl:text-[0.97vw] font-light text-[#e8e8e8] hover:text-[#ffdc81] transition-colors leading-[21px] 2xl:leading-[1.46vw]"
                >
                  {legal.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
