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
    links: { general: { label: string; href: string }[]; services: { label: string; href: string }[] };
    legal: { label: string; href: string }[];
    icons?: { location?: string };
  };
}) {
  return (
    <footer className="bg-black border-[#d1b67c]/40 text-white">
      <div className="mx-auto px-6 py-12 grid md:grid-cols-3 gap-12">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Image src={imageMap.logo} alt="Onza Logo" width={120} height={48} />
          </div>

          <p className="text-sm text-gray-300 mb-6">{data.description}</p>
          <p className="font-medium mb-3">{data.contactText}</p>

          <div className="flex space-x-3 mb-6">
            {data.socials.map((s, idx) => (
              <Link key={idx} href={s.href} aria-label={s.icon} target="_blank" rel="noopener noreferrer">
                <span className="inline-block rounded-md bg-gray-800 hover:bg-gray-700 transition">
                  <Image src={imageMap[s.icon]} alt={s.icon} width={28} height={28} />
                </span>
              </Link>
            ))}
          </div>

          <div className="flex-row items-start space-x-2 text-sm text-gray-400">
            {data.icons?.location && imageMap[data.icons.location] && (
              <div className="flex-shrink-0 mt-0.5">
                <Image src={imageMap[data.icons.location]} alt="location" width={30} height={25} />
              </div>
            )}
            <span>{data.address}</span>
          </div>
        </div>

        <div className="md:col-span-2 grid sm:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-lg mb-4">Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {data.links.general.map((l) => (
                <li key={l.label}><Link href={l.href} className="hover:text-white transition">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {data.links.services.map((s) => (
                <li key={s.label}><Link href={s.href} className="hover:text-white transition">{s.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#d1b67c]/40 py-4 text-sm">
        <div className="mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-400">2025 Onza. All Rights Reserved</p>
          <div className="flex space-x-4">
            {data.legal.map((l) => (
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
