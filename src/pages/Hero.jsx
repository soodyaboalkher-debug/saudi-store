
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      id="hero"
      className="grid min-h-[calc(100svh-64px)] w-full grid-cols-1 bg-[#F7F5F0] md:grid-cols-2 mt-19"
    >
      {/* Text */}
      <div className="flex flex-col items-start justify-center px-6 py-4 sm:px-10 md:py-4 lg:px-16">
        <p className="mb-8 text-xs font-medium uppercase tracking-[0.35em] text-[#A39585]">
          MODERN ESSENTIALS
        </p>

        <h1
          className="max-w-xl text-4xl font-normal leading-tight mb-8
          tracking-tight text-[#171717] sm:text-5xl lg:text-6xl xl:text-7xl"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Timeless Style
          <span className="mt-2 block text-[#A39585]">
            for Modern Men
          </span>
        </h1>

        <p className="mt-6 max-w-sm text-sm leading-7 text-[#737373] sm:text-base mb-6">
          Premium quality. Minimal design.
          Everyday essentials for a better you.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
          <Link
            to="/products"
            className="group inline-flex items-center justify-center gap-4 border border-[#171717] bg-[#171717] px-6 py-4 text-xs font-medium uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-black/80 sm:px-8"
          >
            Shop Collection
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>

          <Link
            to="/#"
            className="group inline-flex items-center justify-center gap-3 border-b border-[#171717] px-2 py-4 text-xs font-medium uppercase tracking-[0.18em] text-[#171717]"
          >
            Our Story
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <p className="mt-10 text-[10px] tracking-[0.3em] text-[#A39585]">
          LESS, BUT BETTER.
        </p>
      </div>

      {/* Image */}
      <div className="relative h-[65svh] min-h-[400px] overflow-hidden md:h-full md:min-h-[calc(100svh-64px)]">
        <img
          src="/heronew.jpg"
          alt="SAUDI men's collection"
          className="absolute inset-0 h-full w-full object-cover object-[45%_center] md:object-center"
        />

        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute bottom-8 left-6 text-white md:bottom-10 md:left-10">
          <p className="text-xs tracking-[0.3em]">
            SAUDI — MODERN ESSENTIALS
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
