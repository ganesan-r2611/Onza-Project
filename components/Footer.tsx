// components/Footer.tsx
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
    <footer className="bg-black text-[#E6E0DA] pt-6 px-4 2xl:px-4-[1.111vw] md:px-6 2xl:px-6-[1.667vw] lg:px-0">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-full">
        {/* Top Row - Logo, Home, Services, Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 2xl:gap-8 2xl:gap-8-[2.222vw]-[2.222vw] md:gap-10 lg:gap-12 mb-12 lg:px-20 lg:py-12 md:px-8 md:py-10">
          {/* Logo - Full width on mobile, 2 columns on tablet */}
          <div className="md:col-span-2 lg:col-span-1">
            <Image
              src={imageMap.footerlogo}
              alt="ONZA Logo"
              width={268}
              height={70}
              className="w-auto h-16 md:h-18 lg:h-auto"
            />
          </div>

          {/* Home Links */}
          <div className="md:col-span-1 lg:ml-28 pl-0 md:pl-4">
            <ul className="space-y-3">
              {data.links.general.map((link, index) => (
                <li key={index}>
                  <Link
                    href={""}
                    onClick={(e) => e.preventDefault()}
                    className="text-[14px] font-medium text-[#E6E0DA] hover:text-[#ffdc81] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className="md:col-span-1 lg:ml-4 pl-0 md:pl-4">
            <h4 className="text-[14px] font-medium text-[#E6E0DA] mb-4 2xl:mb-4 2xl:mb-4 2xl:mb-4-[1.111vw]-[1.111vw]-[1.111vw]">
              SERVICES
            </h4>
            <ul className="space-y-3">
              {data.links.services.map((service, index) => (
                <li key={index}>
                  <Link
                    href={""}
                    onClick={(e) => e.preventDefault()}
                    className="text-[12px] text-[#E6E0DA] hover:text-[#ffdc81] transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Full width on mobile, 2 columns on tablet */}
          <div className="md:col-span-2 lg:col-span-1 lg:ml-20 pl-0 md:pl-4 mt-6 md:mt-0">
            <h4 className="text-[16px] font-medium text-[#E6E0DA] mb-4 2xl:mb-4 2xl:mb-4 2xl:mb-4-[1.111vw]-[1.111vw]-[1.111vw]">
              CONTACT INFO
            </h4>

            <div className="mb-6 2xl:mb-6-[1.667vw]">
              <h5 className="text-[14px] font-medium text-[#E6E0DA] mb-3 2xl:mb-3-[0.833vw]">
                Registered Office
              </h5>
              <p className="text-[12px] font-medium text-[#E6E0DA] leading-relaxed">
                Onza Private Limited
                <br />
                118, Okhla Industrial Estate Phase-III <br /> Bengaluru 560033
                <br />
                Tel: +91 123-486-8423
              </p>
            </div>

            {/* Follow Us */}
            <div>
              <h5 className="text-[14px] font-medium text-[#E6E0DA] mb-4 2xl:mb-4 2xl:mb-4 2xl:mb-4-[1.111vw]-[1.111vw]-[1.111vw]">
                Follow Us
              </h5>
              <div className="flex space-x-4">
                {data.socials.map((social, index) => (
                  <Link
                    key={index}
                    href={""}
                    onClick={(e) => e.preventDefault()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 md:w-10 2xl:w-10-[2.778vw] md:h-10 2xl:h-10-[2.778vw] flex items-center justify-center hover:bg-[#ffdc81] transition-colors"
                  >
                    <Image
                      src={imageMap[social.icon]}
                      alt={social.icon}
                      width={20}
                      height={20}
                      className="filter brightness-0 invert"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Company Info Section */}
        <div className="border-t border-[#d1b67c]/40 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 2xl:gap-6 2xl:gap-6 2xl:gap-6-[1.667vw]-[1.667vw]-[1.667vw] md:gap-8 2xl:gap-8 2xl:gap-8-[2.222vw]-[2.222vw] mb-8 lg:px-20 lg:py-12 md:px-8 md:py-10">
            {data.companyInfo.map((company, index) => (
              <div key={index} className="pl-0 md:pl-4">
                <h5 className="text-[18px] md:text-[20px] font-regular text-[#E6E0DA] mb-2">
                  {company.name}
                </h5>
                <p className="text-[12px] font-medium text-[#E6E0DA] mb-1">
                  {company.registration}
                </p>
                <p className="text-[12px] font-medium text-[#E6E0DA]">
                  {company.cin}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#d1b67c]/40 pt-8 lg:px-20 lg:py-12 md:px-8 md:py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 2xl:gap-4 2xl:gap-4-[1.111vw]-[1.111vw] md:gap-6 2xl:gap-6 2xl:gap-6 2xl:gap-6-[1.667vw]-[1.667vw]-[1.667vw]">
            <p className="text-[14px] text-gray-400 text-center md:text-left">
              © 2025 Onza. All Rights Reserved
            </p>

            <div className="flex flex-wrap justify-center gap-4 2xl:gap-4 2xl:gap-4-[1.111vw]-[1.111vw] md:gap-6 2xl:gap-6 2xl:gap-6 2xl:gap-6-[1.667vw]-[1.667vw]-[1.667vw]">
              {data.legal.map((legal, index) => (
                <Link
                  key={index}
                  href={""}
                  onClick={(e) => e.preventDefault()}
                  className="text-[14px] text-gray-400 hover:text-[#ffdc81] transition-colors"
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