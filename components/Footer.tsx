// components/Footer.tsx
import Image from "next/image";
import Link from "next/link";
import { imageMap } from "@/libs/imageMap";

export default function Footer({
  data,
}: {
  data: {
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
  };
}) {
  return (
    <footer className="bg-black text-[#E6E0DA] pt-6 pl-4 lg:pl-0">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-full">
        {/* Top Row - Logo, Home, Services, Contact Info */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 mb-12 lg:px-20 lg:py-12">
          {/* Logo */}
          <div className="lg:col-span-1">
            <Image
              src={imageMap.footerlogo}
              alt="ONZA Logo"
              width={268}
              height={70}
            />
          </div>

          {/* Home Links */}
          <div className="lg:col-span-1 lg:ml-28 pl-4 lg:pl-0">
            <ul className="space-y-3">
              {data.links.general.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-[14px] font-medium text-[#E6E0DA] hover:text-[#ffdc81] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className="lg:col-span-1 lg:ml-4 pl-4 lg:pl-0">
            <h4 className="text-[14px] font-medium text-[#E6E0DA] mb-4">
              SERVICES
            </h4>
            <ul className="space-y-3">
              {data.links.services.map((service, index) => (
                <li key={index}>
                  <Link
                    href={service.href}
                    className="text-[12px] text-[#E6E0DA] hover:text-[#ffdc81] transition-colors"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1 lg:ml-20 pl-4 lg:pl-0">
            <h4 className="text-[16px] font-medium text-[#E6E0DA] mb-4">
              CONTACT INFO
            </h4>

            <div className="mb-6">
              <h5 className="text-[14px] font-medium text-[#E6E0DA] mb-3">
                Registered Office
              </h5>
              <p className="text-[12px] font-medium text-[#E6E0DA] leading-relaxed">
                Onza Private Limited
                <br />
                118, Okhla Industrial Estate Phase-III <br /> Bengaluru 560033
                <br />
                Tel: +91 123-486-8423
              </p>
            </div>

            {/* Follow Us */}
            <div>
              <h5 className="text-[14px] font-medium text-[#E6E0DA] mb-4">
                Follow Us
              </h5>
              <div className="flex space-x-4">
                {data.socials.map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-18 h-18 flex items-center justify-center hover:bg-[#ffdc81] transition-colors"
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

        {/* Company Info Section - Full width below */}
        <div className="border-t border-[#d1b67c]/40 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 lg:px-20 lg:py-12">
            {data.companyInfo.map((company, index) => (
              <div key={index} className="pl-4">
                <h5 className="text-[20px] font-regular text-[#E6E0DA] mb-2">
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
        <div className="border-t border-[#d1b67c]/40 pt-8 lg:px-20 lg:py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[14px] text-gray-400 text-center md:text-left">
              © 2025 Onza. All Rights Reserved
            </p>

            <div className="flex space-x-6">
              {data.legal.map((legal, index) => (
                <Link
                  key={index}
                  href={legal.href}
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
