"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { imageMap } from "@/libs/imageMap";

type NavItem = { label: string; href: string; children?: NavItem[] };
export interface NavbarData {
  nav: NavItem[];
  cta: { href: string; label: string };
}

export default function NavBar({ data }: { data: NavbarData }) {
  const [darkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);

  // Theme detection
  useEffect(() => {
    const handleScroll = () => {
      const section = document
        .elementFromPoint(window.innerWidth / 2, 100)
        ?.closest("[data-theme]");
      setDarkMode(section?.getAttribute("data-theme") === "light");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close dropdown when clicking outside (optional enhancement)
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

  const shell =
    "rounded-full px-6 2xl:px-[1.667vw] py-3 2xl:py-[0.833vw] transition-colors duration-500 backdrop-blur-md shadow-sm";
  const shellTheme = darkMode
    ? "bg-white/70 text-black"
    : "bg-black/30 text-white";

  const pillBtn =
    "rounded-full px-6 2xl:px-[1.667vw] py-2 2xl:py-[0.556vw] font-medium transition backdrop-blur-md border";
  const pillTheme = darkMode
    ? "border-[#d1b67c]/40 bg-white/10 text-[#ffdc81] hover:bg-white/20"
    : "border-[#ffdc81]/40 bg-[#ffffff0a] text-[#ffdc81] hover:bg-[#ffffff1a]";

  const dropTheme = darkMode
    ? "border-black/10 bg-white/80 text-black"
    : "border-white/10 bg-black/70 text-white";

  const iconTheme = darkMode ? "text-black" : "text-white";

  return (
    <header className="fixed top-6 2xl:top-[1.667vw] w-full z-50 px-4 sm:px-6 lg:px-10 2xl:px-[2.778vw]">
      <nav
        className={`max-w-[1440px] mx-auto flex items-center justify-between ${shell} ${shellTheme}`}
      >
        {/* Logo */}
        <Link
          href={""}
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-2 2xl:gap-[0.556vw]"
        >
          <Image
            src={imageMap.logo}
            alt="ONZA Logo"
            width={120}
            height={40}
            priority
            className="2xl:w-[8.333vw] 2xl:h-[2.778vw]"
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-10 2xl:gap-[2.778vw]">
          {data.nav.map((item) => (
            <li key={item.label} className="relative dropdown-container">
              {item.children ? (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === item.label ? null : item.label
                      )
                    }
                    className="flex items-center gap-1 2xl:gap-[0.278vw] hover:opacity-80 transition text-[16px] 2xl:text-[1.111vw]"
                  >
                    {item.label}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform 2xl:w-[1.111vw] 2xl:h-[1.111vw] ${
                        activeDropdown === item.label ? "rotate-180" : ""
                      }`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  {activeDropdown === item.label && (
                    <div
                      className={`absolute left-0 mt-3 2xl:mt-[0.833vw] rounded-xl 2xl:rounded-[0.833vw] border p-3 2xl:p-[0.833vw] min-w-[260px] 2xl:min-w-[18.056vw] ${dropTheme} backdrop-blur-md`}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={""}
                          onClick={(e) => e.preventDefault()}
                          className="block px-3 2xl:px-[0.833vw] py-2 2xl:py-[0.556vw] rounded-md 2xl:rounded-[0.417vw] hover:bg-white/10 text-[14px] 2xl:text-[0.972vw]"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={""}
                  onClick={(e) => e.preventDefault()}
                  className="hover:opacity-80 transition text-[16px] 2xl:text-[1.111vw]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href={""}
            onClick={(e) => e.preventDefault()}
            className={`${pillBtn} ${pillTheme} text-[14px] 2xl:text-[0.972vw]`}
          >
            {data.cta.label}
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setOpen((s) => !s)}
          aria-label="Toggle menu"
          className={`md:hidden p-2 2xl:p-[0.556vw] rounded-full border ${iconTheme} ${
            darkMode
              ? "border-black/10 bg-white/50"
              : "border-white/15 bg-white/10"
          } backdrop-blur-md`}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="stroke-current 2xl:w-[1.528vw] 2xl:h-[1.528vw]"
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
      </nav>

      {/* Mobile Panel */}
      <div
        className={`md:hidden transition-[max-height,opacity] duration-300 ease-out overflow-hidden px-4 sm:px-6 lg:px-10 2xl:px-[2.778vw] ${
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`max-w-[1440px] mx-auto mt-3 2xl:mt-[0.833vw] rounded-2xl 2xl:rounded-[1.111vw] border px-4 2xl:px-[1.111vw] py-4 2xl:py-[1.111vw] ${dropTheme} backdrop-blur-md`}
        >
          <ul className="flex flex-col gap-2 2xl:gap-[0.556vw]">
            {data.nav.map((item) => (
              <li key={item.label} className="py-1 2xl:py-[0.278vw]">
                {item.children ? (
                  <>
                    <button
                      className="flex justify-between w-full py-2 2xl:py-[0.556vw] text-[16px] 2xl:text-[1.111vw]"
                      onClick={() =>
                        setMobileDropdown(
                          mobileDropdown === item.label ? null : item.label
                        )
                      }
                    >
                      <span>{item.label}</span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform 2xl:w-[1.250vw] 2xl:h-[1.250vw] ${
                          mobileDropdown === item.label ? "rotate-180" : ""
                        }`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-[max-height] duration-300 ${
                        mobileDropdown === item.label ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <ul className="pl-3 2xl:pl-[0.833vw]">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={""}
                              className="block py-2 2xl:py-[0.556vw] text-sm 2xl:text-[0.972vw] opacity-90"
                              onClick={() => setOpen(false)}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link
                    href={""}
                    onClick={(e) => e.preventDefault()}
                    className="block py-2 2xl:py-[0.556vw] text-[16px] 2xl:text-[1.111vw]"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}

            {/* CTA */}
            <li className="pt-2 2xl:pt-[0.556vw]">
              <Link
                href={""}
                onClick={(e) => e.preventDefault()}
                className={`w-full inline-flex justify-center ${pillBtn} ${pillTheme} text-[14px] 2xl:text-[0.972vw]`}
              >
                {data.cta.label}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}