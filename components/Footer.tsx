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
        <div className="flex flex-col md:flex-row items-start justify-between px-8 2xl:px-[5.56vw] md:px-12 2xl:md:px-[8.33vw] lg:px-20 2xl:lg:px-[8.33vw] py-12 2xl:py-[5vw] md:py-16 2xl:md:py-[6.67vw] lg:py-20 2xl:lg:py-[8.33vw] gap-8 2xl:gap-[2.22vw] md:gap-10 2xl:md:gap-[4.17vw] lg:gap-12 2xl:lg:gap-[5vw]">
          
          {/* Logo */}
          <div className="w-full md:w-auto">
            <Image
              src={imageMap.footerlogo}
              alt="ONZA Logo"
              width={268}
              height={75}
              className="w-auto h-15 md:h-18 lg:h-auto 2xl:h-[5.21vw] 2xl:w-[18.61vw]"
            />
          </div>

          {/* Home Links */}
          <div className="w-full md:w-auto">
            <div className="flex flex-col items-start">
              {data.links.general.map((link, index) => (
                <div key={index} className="w-full rounded-[999px] 2xl:rounded-[69.44vw] flex items-center py-2 2xl:py-[0.56vw]">
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
                <div key={index} className="w-full rounded-[999px] 2xl:rounded-[69.44vw] flex items-center py-2 2xl:py-[0.56vw]">
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
                    <p className="mb-1 2xl:mb-[0.28vw]">Onza Private Limited</p>
                    <p className="mb-1 2xl:mb-[0.28vw]">118, Okhla Industrial Estate Phase-III</p>
                    <p className="mb-1 2xl:mb-[0.28vw]">Bengaluru 560033</p>
                    <p className="mb-0">
                      Tel: +91 123-486-8423
                    </p>
                  </div>
                </div>
              </div>

              {/* Follow Us */}
              <div className="flex flex-col items-start gap-2 2xl:gap-[0.56vw]">
                <div className="text-[12px] 2xl:text-[0.83vw] font-medium text-[#FBFBFB] leading-[18px] 2xl:leading-[1.25vw]">
                  Follow Us
                </div>
                <div className="flex gap-4 2xl:gap-[1.11vw]">
                  {data.socials.map((social, index) => (
                    <Link
                      key={index}
                      href={""}
                      onClick={(e) => e.preventDefault()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 2xl:w-[1.67vw] h-6 2xl:h-[1.67vw] flex items-center justify-center hover:bg-[#ffdc81] transition-colors"
                    >
                      <Image
                        src={imageMap[social.icon]}
                        alt={social.icon}
                        width={18}
                        height={18}
                        className="w-[18px] 2xl:w-[1.25vw] h-[18px] 2xl:h-[1.25vw] filter brightness-0 invert"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Info Section */}
        <div className="border-t border-[#d1b67c]/40 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 2xl:gap-6-[1.667vw]-[1.667vw]-[1.667vw] md:gap-8 2xl:gap-8 2xl:gap-8-[2.222vw]-[2.222vw] mb-8 px-4 lg:px-20 lg:py-12 md:px-8 md:py-10">
            {data.companyInfo.map((company, index) => (
              <div key={index} className="pl-0 md:pl-4 2xl:pl-[1.39vw]">
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
        <div className="px-8 2xl:px-[5.56vw] md:px-12 2xl:md:px-[8.33vw] lg:px-20 2xl:lg:px-[8.33vw] pt-6 2xl:pt-[1.67vw]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 2xl:gap-[1.11vw]">
            <div className="text-[14px] 2xl:text-[0.97vw] font-light text-[#e8e8e8] leading-[21px] 2xl:leading-[1.46vw] whitespace-pre-wrap flex-1">
              2025 Onza.  All Rights Reserved
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