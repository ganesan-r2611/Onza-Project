import "./globals.css";
import { Hanken_Grotesk } from "next/font/google";

import ConditionalSmoothScroll from "@/components/ui/SmoothScrollWraper";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={hanken.className}>
      <body>
        <ConditionalSmoothScroll>{children}</ConditionalSmoothScroll>
      </body>
    </html>
  );
}
