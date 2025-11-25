// components/NavBar.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { imageMap } from "@/libs/imageMap";
import GlobalButton from "./ui/GlobalButton";
import { useThemeDetection } from "@/hooks/useThemeDetection";

type NavItem = { label: string; href: string; children?: NavItem[] };
export interface NavbarData {
  nav: NavItem[];
  cta: { href: string; label: string };
}

export default function NavBar({ data }: { data: NavbarData }) {
  const { currentTheme, isDark, isLight } = useThemeDetection();
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  useEffect(() => {
    console.log("Current theme:", currentTheme);
  }, [currentTheme]);

  // Theme-based styles
  const textColor = isLight ? "text-black" : "text-white";
  const navBackground = isLight
    ? "bg-white/70 backdrop-blur-[25.20px]"
    : "bg-black/30 backdrop-blur-[25.20px]";
  const borderColor = isLight ? "border-black/20" : "border-white/20";
  const dropdownBackground = isLight
    ? "bg-[rgba(255,255,255,0.15)] text-black border-black/20"
    : "bg-[rgba(0,0,0,0.15)] text-white border-white/20";
  const mobilePanelBackground = isLight
    ? "bg-white/70 backdrop-blur-[25.20px]"
    : "bg-black/30 backdrop-blur-[25.20px]";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="fixed w-full z-50">
      {/* Desktop Navigation */}
      <div className="hidden md:block mx-auto backdrop-blur-[25.20px]">
        <nav
          className={`${navBackground} ${borderColor} px-10 lg:px-[2.08vw] 2xl:px-[2.78vw] transition-all duration-300`}
        >
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="w-[174px] lg:w-[12.08vw] py-4 lg:py-[1.11vw] flex-shrink-0">
              <div className="h-12 lg:h-[3.33vw] 2xl:h-[3.33vw] py-2 lg:py-[0.56vw] bg-transparent rounded-[40px]">
                <Link href="/" className="flex">
                  <Image
                    src={isLight ? imageMap.logo_dark : imageMap.logo}
                    alt="ONZA Logo"
                    width={120}
                    height={40}
                    priority
                    className="w-auto h-8 lg:h-[2.22vw] 2xl:h-[2.22vw]"
                  />
                </Link>
              </div>
            </div>

            {/* Desktop Navigation Items - Center aligned */}
            <div className="flex h-full">
              {data.nav.map((item) => (
                <div
                  key={item.label}
                  className="relative dropdown-container h-full"
                >
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveDropdown(
                            activeDropdown === item.label ? null : item.label
                          )
                        }
                        className={`min-w-[116px] h-full px-3 lg:px-[0.83vw] 2xl:px-[0.83vw] py-7 lg:py-[1.94vw] 2xl:py-[1.94vw] flex items-center gap-2 lg:gap-[0.56vw] 2xl:gap-[0.56vw] hover:bg-white/10 transition-all duration-300 ${textColor}`}
                      >
                        <span className="text-[18px] lg:text-[1.25vw] 2xl:text-[1.25vw] font-light font-['Hanken_Grotesk'] leading-[27px] lg:leading-[1.88vw] 2xl:leading-[1.88vw]">
                          {item.label}
                        </span>
                        {/* Dropdown Icon */}
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          className={`transition-transform ${
                            activeDropdown === item.label ? "rotate-180" : ""
                          }`}
                        >
                          <path
                            d="M6 9L12 15L18 9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>

                      {activeDropdown === item.label && (
                        <div
                          className={`absolute left-0 top-full z-50 ${dropdownBackground} border-[4px] rounded-lg shadow-lg overflow-hidden`}
                        >
                          {/* Services Dropdown with Image and List */}
                          <div className="flex">
                            {/* Image Section */}
                            <div className="w-[322px] lg:w-[22.22vw] 2xl:w-[22.22vw] relative overflow-hidden">
                              <Image
                                src={imageMap.serviceDropDownBg}
                                alt="Our Services"
                                fill
                                className="object-cover"
                              />
                              {/* Gradient Overlay */}
                              <div
                                className="absolute inset-x-0 bottom-0 top-2/4 backdrop-blur-[4px] pointer-events-none"
                                style={{
                                  maskImage:
                                    "linear-gradient(to top, black 20%, transparent 100%)",
                                  WebkitMaskImage:
                                    "linear-gradient(to top, black 40%, transparent 100%)",
                                }}
                              />
                              <div
                                className="absolute inset-x-0 bottom-0 top-[50%] backdrop-blur-[6px] pointer-events-none"
                                style={{
                                  maskImage:
                                    "linear-gradient(to top, black 40%, transparent 100%)",
                                  WebkitMaskImage:
                                    "linear-gradient(to top, black 60%, transparent 100%)",
                                }}
                              />
                              {/* Content Overlay */}
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <div className="flex flex-col gap-4">
                                  <div className="flex flex-col gap-2">
                                    <h3 className="text-[20px] lg:text-[1.39vw] 2xl:text-[1.39vw] font-400 font-['Hanken_Grotesk'] leading-[24px] lg:leading-[1.67vw] 2xl:leading-[1.67vw] text-[#FBFBFB]">
                                      Our Services
                                    </h3>
                                    <p className="text-[14px] lg:text-[0.97vw] 2xl:text-[0.97vw] font-light font-['Hanken_Grotesk'] leading-[21px] lg:leading-[1.46vw] 2xl:leading-[1.46vw] text-[#E8E8E8]">
                                      Lorem ipsum dolor sit amet, consectetur
                                      adipisicing elite.
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className="flex flex-col items-center gap-0.5 lg:gap-[0.28vw] 2xl:gap-[0.28vw] group cursor-pointer">
                                      <span className="text-[14px] lg:text-[0.97vw] 2xl:text-[0.97vw] font-light font-['Hanken_Grotesk'] leading-[21px] lg:leading-[1.46vw] 2xl:leading-[1.46vw] text-[#E8E8E8] group-hover:text-[#FFDC81] group-hover:scale-105 transition-all duration-300">
                                        Know More
                                      </span>
                                      <div className="w-full h-1 bg-[#E8E8E8] group-hover:bg-[#FFDC81] group-hover:scale-105 transition-all duration-300 origin-center"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Services List */}
                            <div className="w-[322px] lg:w-[22.22vw] 2xl:w-[22.22vw] bg-[#0A5060] flex flex-col">
                              {item.children.map((child, index) => (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  className={`flex items-center justify-between px-6 lg:px-[0.83vw] 2xl:px-[0.83vw] py-4 lg:py-[1.11vw] 2xl:py-[1.11vw] text-[16px] lg:text-[0.97vw] 2xl:text-[0.97vw] font-light font-['Hanken_Grotesk'] leading-[19px] lg:leading-[1.46vw] 2xl:leading-[1.46vw] text-[#F2E9DA] hover:bg-[#FFDC81] hover:text-[#0A5060] transition-all duration-300 ${
                                    index === 0 ? "rounded-tr-lg" : ""
                                  } ${
                                    index ===
                                    (item.children && item.children.length
                                      ? item.children.length - 1
                                      : -1)
                                      ? "rounded-br-lg"
                                      : ""
                                  }`}
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  <span className="flex-1">{child.label}</span>
                                  {/* Hidden icon (opacity: 0) */}
                                  <div className="w-5 h-5 opacity-0">
                                    <div className="w-3.5 h-3.5 bg-[#F2E9DA] rounded-sm"></div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`min-w-[116px] lg:min-w-[8.89vw] 2xl:min-w-[8.89vw] h-full px-3 lg:px-[0.83vw] 2xl:px-[0.83vw] py-7 lg:py-[1.94vw] 2xl:py-[1.94vw] flex items-center justify-center hover:bg-white/10 transition-all duration-300 ${textColor}`}
                    >
                      <span className="text-[18px] lg:text-[1.25vw] 2xl:text-[1.25vw] font-light font-['Hanken_Grotesk'] leading-[27px] lg:leading-[1.88vw] 2xl:leading-[1.88vw]">
                        {item.label}
                      </span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop CTA Button */}
            <div className="flex items-center w-[190px] lg:w-[13.92vw]  flex-shrink-0">
              <GlobalButton
                href={data.cta.href}
                width={''}
                height={''}
                paddingX={""}
                paddingY={""}
                fontSize={""}
                variant={isLight ? "secondary" : "primary"}
                className="px-[32px] lg:px-[2.22vw] py-8 lg:py-[1.11vw] text-[16px] lg:text-[0.97vw] 2xl:text-[1.11vw] font-light font-['Hanken_Grotesk'] leading-[19px] lg:leading-[1.18vw] 2xl:leading-[1.32vw]"
              >
                {data.cta.label}
              </GlobalButton>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden mx-auto">
        {/* Mobile Header Bar */}
        <div
          className={`${navBackground} ${borderColor} px-4 transition-all duration-300`}
        >
          <div className="flex justify-between items-center py-4">
            {/* Mobile Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src={isLight ? imageMap.logo_dark : imageMap.logo}
                  alt="ONZA Logo"
                  width={120}
                  height={40}
                  priority
                  className="w-auto h-6"
                />
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button onClick={() => setOpen((s) => !s)} aria-label="Toggle menu">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className={`stroke-current ${textColor}`}
              >
                {open ? (
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            open ? "opacity-100 visible" : "hidden"
          }`}
        >
          <div
            className={`rounded-b-2xl backdrop-blur-md shadow-lg ${mobilePanelBackground}`}
          >
            {/* Mobile Navigation Items */}
            <div className="p-4 flex flex-col gap-2">
              {data.nav.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <>
                      {/* Show Services as back button when dropdown is open */}
                      {mobileDropdown === item.label ? (
                        <button
                          className={`flex justify-between w-full py-4 text-[14px] font-light font-['Hanken_Grotesk'] leading-[21px] items-center ${textColor}`}
                          onClick={() => setMobileDropdown(null)}
                        >
                          <div className="flex items-center gap-2">
                            {/* Left arrow for going back */}
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className={textColor}
                            >
                              <path
                                d="M15 18l-6-6 6-6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span>Services</span>
                          </div>
                        </button>
                      ) : (
                        // Show Services with right arrow when dropdown is closed
                        <button
                          className={`flex justify-between w-full py-4 text-[14px] font-light font-['Hanken_Grotesk'] leading-[21px] items-center ${textColor}`}
                          onClick={() => setMobileDropdown(item.label)}
                        >
                          <span>{item.label}</span>
                          {/* Right arrow for opening dropdown */}
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={textColor}
                          >
                            <path
                              d="M9 18l6-6-6-6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      )}

                      {/* Services Dropdown Content - Show only when Services is open */}
                      {mobileDropdown === item.label && (
                        <div className="overflow-hidden transition-all duration-300">
                          <div className="mb-2">
                            <div
                              className={`text-[14px] font-light font-['Hanken_Grotesk'] leading-[21px] py-2 ${textColor} opacity-90`}
                            >
                              Our Services
                            </div>
                            {item.children.map((child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                className={`block py-3 text-[14px] font-light font-['Hanken_Grotesk'] leading-[21px] opacity-90 hover:opacity-100 transition-opacity ${textColor}`}
                                onClick={() => {
                                  setOpen(false);
                                  setMobileDropdown(null);
                                }}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    // Show other nav links only when no dropdown is open
                    !mobileDropdown && (
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-between w-full py-4 text-[14px] font-light font-['Hanken_Grotesk'] leading-[21px] hover:opacity-80 transition-opacity ${textColor}`}
                      >
                        <span>{item.label}</span>
                      </Link>
                    )
                  )}
                </div>
              ))}
            </div>

            {/* Mobile CTA Button - Show only when no dropdown is open */}
            {!mobileDropdown && (
              <div className="p-4 items-center justify-center flex mt-[46px]">
                <GlobalButton
                  href={data.cta.href}
                  width="93.33vw"
                  height={48}
                  paddingX={32}
                  paddingY={16}
                  fontSize={16}
                  variant={isLight ? "secondary" : "primary"}
                  onClick={() => setOpen(false)}
                >
                  {data.cta.label}
                </GlobalButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
