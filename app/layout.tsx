import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
