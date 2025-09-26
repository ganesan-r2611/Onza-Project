// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "ONZA – Crafting Pathways",
  description: "ONZA homepage",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
