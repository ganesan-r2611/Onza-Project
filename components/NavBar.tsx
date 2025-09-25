"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import homeData from "@/json/navbar.json";
import { imageMap } from "@/libs/imageMap";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const nav = homeData.nav;
  const cta = homeData.cta;

  return (
    <header className="w-full fixed top-6 z-40 px-6">
      <nav className="max-w-8xl mx-auto flex items-center justify-between glass-border rounded-full p-4 gap-16">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src={imageMap.logo}
              alt="ONZA Logo"
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center">
          <ul className="flex items-center gap-16 text-sm">
            {nav.map((n) => (
              <li key={n.label} className="relative group">
                <Link href={n.href} className="hover:underline">
                  {n.label}
                </Link>
                {n.children && (
                  <div className="absolute left-0 mt-2 hidden group-hover:block bg-white/6 backdrop-blur-sm glass-border rounded-md p-3">
                    {n.children.map((c: any) => (
                      <Link
                        key={c.label}
                        href={c.href}
                        className="block px-3 py-1 text-sm"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA button (desktop) */}
        <div className="hidden sm:flex items-center">
          <Link
            href={cta.href}
            className="px-5 py-2 rounded-full glass-border text-sm text-[#FFDC81]"
          >
            {cta.label}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="sm:hidden flex items-center">
          <button
            onClick={() => setOpen(!open)}
            aria-label="toggle menu"
            className="p-2 nav-pill glass-border"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              className="stroke-white/90"
            >
              {open ? (
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      <div
        className={`sm:hidden mt-4 transition-max-h duration-300 overflow-hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="mx-auto max-w-md glass-border rounded-2xl py-4 px-4">
          <ul className="flex flex-col gap-4">
            {nav.map((n) => (
              <li key={n.label}>
                <Link href={n.href} className="block py-2 text-white/90">
                  {n.label}
                </Link>
                {n.children && (
                  <ul className="pl-4">
                    {n.children.map((c: any) => (
                      <li key={c.label}>
                        <Link
                          href={c.href}
                          className="block py-1 text-sm text-white/70"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="pt-3">
              <Link
                href={cta.href}
                className="w-full inline-block text-center py-2 nav-pill glass-border"
              >
                {cta.label}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
