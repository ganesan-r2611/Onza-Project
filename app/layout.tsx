// app/layout.tsx
import "./globals.css";
import { Hanken_Grotesk } from "next/font/google";
import { getStaticData } from "@/libs/getStaticData";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// This layout will be applied to ALL pages
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the static data that contains navbar and footer data
  const staticData = await getStaticData();
  const { navbarData, footerData } = staticData;

  return (
    <html lang="en" className={hanken.className}>
      <body className="flex flex-col min-h-screen">
        <NavBar data={navbarData} />
        <main className="flex-1">
          {children}
        </main>
        <Footer data={footerData} />
      </body>
    </html>
  );
}