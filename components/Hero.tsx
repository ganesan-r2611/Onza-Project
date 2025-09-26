// components/Hero.tsx (Server Component)

interface HeroProps {
  hero: {
    title: string;
    subtitle: string;
  };
}

export default function Hero({ hero }: HeroProps) {
  const { title, subtitle } = hero;

  return (
    <section className="min-h-screen flex items-center">
      <div className="container mx-auto px-6 py-24 flex flex-col sm:flex-row items-center gap-8">
        {/* Left text */}
        <div className="flex-1 text-left">
          <h1 className="text-5xl sm:text-6xl font-light leading-tight whitespace-pre-line">
            {title}
          </h1>
        </div>

        {/* Center decorative frame */}
        <div className="flex-1 flex justify-center items-center">
          <div className="hero-frame">
            <div className="inner-shape" aria-hidden />
          </div>
        </div>

        {/* Right small text */}
        <div className="flex-1 hidden lg:block">
          <p className="text-sm text-white/60 max-w-xs">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}
