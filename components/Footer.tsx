"use client";

import Image from "next/image";
import Link from "next/link";
import footerData from "@/json/footer.json";
import { imageMap } from "@/libs/imageMap";

export default function Footer() {
  const { description, contactText, socials, address, links, legal, icons } = footerData;

  return (
    <footer className="bg[#121819] border-b border-[#d1b67c]/40 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-12">
        {/* Left column */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Image src={imageMap.logo} alt="Onza Logo" width={120} height={48} />
          </div>

          <p className="text-sm text-gray-300 mb-6">{description}</p>

          <p className="font-medium mb-3">{contactText}</p>

          <div className="flex space-x-3 mb-6">
            {socials.map((s, idx) => {
              const iconKey = s.icon;
              const img = imageMap[iconKey];
              if (!img) return null;
              return (
                <Link key={idx} href={s.href} aria-label={iconKey} target="_blank" rel="noopener noreferrer">
                  <span className="inline-block p-1 rounded-md bg-gray-800 hover:bg-gray-700 transition">
                    <Image src={img} alt={iconKey} width={28} height={28} />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-start space-x-2 text-sm text-gray-400">
            {/* location icon */}
            {icons?.location && imageMap[icons.location] && (
              <div className="flex-shrink-0 mt-0.5">
                <Image src={imageMap[icons.location]} alt="location" width={18} height={18} />
              </div>
            )}
            <span>{address}</span>
          </div>
        </div>

        {/* Right columns */}
        <div className="md:col-span-2 grid sm:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-lg mb-4">Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {links.general.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-white transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {links.services.map((s) => (
                <li key={s.label}>
                  <Link href={s.href} className="hover:text-white transition">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#d1b67c]/40 py-4 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-400">2025 Onza. All Rights Reserved</p>
          <div className="flex space-x-4">
            {legal.map((l) => (
              <Link key={l.label} href={l.href} className="text-gray-400 hover:text-white transition">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
