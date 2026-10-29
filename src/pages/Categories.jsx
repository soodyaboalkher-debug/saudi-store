import { Link } from "react-router-dom";

const categories = [
  {
    title: "Suits & Blazers",
    subtitle: "Tailored Perfection",
    image:
      "/plizer.jpg",
    to: "/products?category=suits",
    alt: "Men's tailored suits and blazers",
  },
  {
    title: "Casual Luxury",
    subtitle: "Everyday Elegance",
    image:
      "/cauol.jpg",
    to: "/products?category=casual",
    alt: "Modern men's casual fashion",
  },
  {
    title: "Essential Trousers",
    subtitle: "Modern Craftsmanship",
    image:
      "/card3.jpg",
    to: "/products?category=trousers",
    alt: "Men's trousers collection",
  },
];




const Categories = () => {
  return (
    <section id="categories" className="bg-[#F7F5F0] px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-7xl">

        {/* Section heading */}
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-[#A39585]">
            Collections
          </p>

          <h2
            className="text-3xl font-normal text-[#111111] md:text-5xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Curated Categories
          </h2>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              to={cat.to}
              className="group relative block h-[420px] w-full 
              overflow-hidden bg-stone-200 focus-visible:outline 
              focus-visible:outline-2 focus-visible:outline-offset-4 
              focus-visible:outline-[#A39585] sm:h-[480px] md:h-[440px]
               lg:h-[500px]"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover 
                transition-transform duration-700 ease-out
                 group-hover:scale-105 motion-reduce:transition-none"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t 
               from-black/65 via-black/10 to-transparent transition-colors
               duration-300 group-hover:from-black/75" 
               />

              {/* Text */}
              <div className="absolute bottom-8 left-6 right-6 z-10 text-white sm:left-8 sm:right-8">
                <span className="mb-2 block text-xs font-light uppercase tracking-[0.2em] text-[#E7E2D9]">
                  {cat.subtitle}
                </span>

                <h3
                  className="mb-3 text-2xl font-normal tracking-wide"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {cat.title}
                </h3>

                <span className="inline-block border-b border-white/70 pb-1 text-xs uppercase tracking-widest text-white transition-colors duration-300 group-hover:border-white">
                  Explore Collection →
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Categories;
