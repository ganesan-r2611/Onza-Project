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
    <footer className="bg-black text-[#E6E0DA] pt-6 2xl:pt-[2.08vw] px-4 2xl:px-[1.39vw] md:px-6 lg:px-0">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-full">
        {/* Top Row - Logo, Home, Services, Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 2xl:gap-[2.78vw] md:gap-10 lg:gap-12 2xl:gap-[4.17vw] mb-12 2xl:mb-[4.1vw] md:px-8 md:py-10 lg:px-24 lg:py-16 2xl:px-[8.33vw] 2xl:py-[5.56vw]">
          {/* Logo - Full width on mobile, 2 columns on tablet */}
          <div className="md:col-span-2 lg:col-span-1">
            <Image
              src={imageMap.footerlogo}
              alt="ONZA Logo"
              width={268}
              height={75}
              className="w-auto h-15 md:h-18 lg:h-auto 2xl:h-[5.21vw] 2xl:w-[18.61vw]"
            />
          </div>

          {/* Home Links */}
          <div className="md:col-span-1 lg:ml-28 2xl:ml-[9.72vw] pl-0 md:pl-4 2xl:pl-[1.39vw]">
            <ul className="space-y-3 2xl:space-y-[1.04vw]">
              {data.links.general.map((link, index) => (
                <li key={index}>
                  <Link
                    href={""}
                    onClick={(e) => e.preventDefault()}
                    className="text-[14px] 2xl:text-[0.972vw] font-medium text-[#E6E0DA] hover:text-[#ffdc81] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className="md:col-span-1 lg:ml-4 2xl:ml-[1.39vw] pl-0 md:pl-4 2xl:pl-[1.39vw]">
            <h4 className="text-[14px] 2xl:text-[0.972vw] font-medium text-[#E6E0DA] mb-4 2xl:mb-[1.39vw]">
              SERVICES
            </h4>
            <ul className="space-y-3 2xl:space-y-[1.04vw]">
              {data.links.services.map((service, index) => (
                <li key={index}>
                  <Link
                    href={""}
                    onClick={(e) => e.preventDefault()}
                    className="text-[12px] 2xl:text-[0.833vw] text-[#E6E0DA] hover:text-[#ffdc81] transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Full width on mobile, 2 columns on tablet */}
          <div className="md:col-span-2 lg:col-span-1 lg:ml-20 2xl:ml-[6.94vw] pl-0 md:pl-4 2xl:pl-[1.39vw] mt-6 md:mt-0">
            <h4 className="text-[16px] 2xl:text-[1.111vw] font-medium text-[#E6E0DA] mb-4 2xl:mb-[1.39vw]">
              CONTACT INFO
            </h4>

            <div className="mb-6 2xl:mb-[2.08vw]">
              <h5 className="text-[14px] 2xl:text-[0.972vw] font-medium text-[#E6E0DA] mb-3 2xl:mb-[1.04vw]">
                Registered Office
              </h5>
              <p className="text-[12px] 2xl:text-[0.833vw] font-medium text-[#E6E0DA] leading-relaxed">
                Onza Private Limited
                <br />
                118, Okhla Industrial Estate Phase-III <br /> Bengaluru 560033
                <br />
                Tel: +91 123-486-8423
              </p>
            </div>

            {/* Follow Us */}
            <div>
              <h5 className="text-[14px] 2xl:text-[0.972vw] font-medium text-[#E6E0DA] mb-4 2xl:mb-[1.39vw]">
                Follow Us
              </h5>
              <div className="flex space-x-4 2xl:space-x-[1.39vw]">
                {data.socials.map((social, index) => (
                  <Link
                    key={index}
                    href={""}
                    onClick={(e) => e.preventDefault()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 2xl:w-[2.78vw] h-8 2xl:h-[2.78vw] md:w-10 2xl:w-[3.47vw] md:h-10 2xl:h-[3.47vw] flex items-center justify-center hover:bg-[#ffdc81] transition-colors"
                  >
                    <Image
                      src={imageMap[social.icon]}
                      alt={social.icon}
                      width={20}
                      height={20}
                      className="filter brightness-0 invert w-[20px] 2xl:w-[1.389vw] h-[20px] 2xl:h-[1.389vw]"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Company Info Section */}
        <div className="border-t border-[#d1b67c]/40 pt-8 2xl:pt-[2.78vw]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 2xl:gap-[2.08vw] md:gap-8 2xl:gap-[2.78vw] mb-8 2xl:mb-[2.78vw] md:px-8 md:py-10 lg:px-20 2xl:px-[6.94vw] lg:py-12 2xl:py-[4.17vw]">
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
        <div className="border-t border-[#d1b67c]/40 pt-8 2xl:pt-[2.78vw] lg:px-20 2xl:px-[6.94vw] lg:py-12 2xl:py-[4.17vw] md:px-8 2xl:px-[2.78vw] md:py-10 2xl:py-[3.47vw]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 2xl:gap-[1.39vw] md:gap-6 2xl:gap-[2.08vw]">
            <p className="text-[14px] 2xl:text-[0.972vw] text-gray-400 text-center md:text-left">
              © 2025 Onza. All Rights Reserved
            </p>

            <div className="flex flex-wrap justify-center gap-4 2xl:gap-[1.39vw] md:gap-6 2xl:gap-[2.08vw]">
              {data.legal.map((legal, index) => (
                <Link
                  key={index}
                  href={""}
                  onClick={(e) => e.preventDefault()}
                  className="text-[14px] 2xl:text-[0.972vw] text-gray-400 hover:text-[#ffdc81] transition-colors"
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