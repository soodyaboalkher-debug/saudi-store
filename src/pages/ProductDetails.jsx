
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabase";
import { useState, useEffect } from "react";
import {
  LoaderCircle,
  Heart,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setError("");
      setProduct(null);
      setSelectedSize("");

      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setProduct(data);
      } catch (err) {
        console.error(err.message);
        setError("Unable to load this product.");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F5F0]">
        <div className="flex flex-col items-center gap-5">
          <LoaderCircle className="h-8 w-8 animate-spin text-[#171717]" />
          <p className="text-[10px] tracking-[0.35em] text-[#737373]">
            SAUDI — LOADING
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#F7F5F0] px-6">
        <p className="text-sm tracking-wider text-[#737373]">
          {error || "Product not found."}
        </p>

        <Link
          to="/products"
          className="border-b border-[#171717] pb-2 text-xs tracking-widest text-[#171717]"
        >
          BACK TO COLLECTION
        </Link>
      </div>
    );
  }

  const sizes = ["S", "M", "L", "XL"];

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 pb-16 pt-28 sm:px-8 md:px-12 lg:px-16">
      <div className="mx-auto max-w-[1440px]">

        {/* Breadcrumb */}
        <div className="mb-7 flex items-center gap-3 text-[10px] tracking-[0.16em] text-[#858078] sm:mb-10">
          <Link
            to="/"
            className="transition hover:text-[#171717]"
          >
            HOME
          </Link>

          <span>/</span>

          <Link
            to="/products"
            className="transition hover:text-[#171717]"
          >
            COLLECTION
          </Link>

          <span>/</span>

          <span className="max-w-[150px] truncate text-[#171717]">
            {product.name}
          </span>
        </div>

        <div className="grid grid-cols-1 items-start gap-9 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16 xl:gap-24">

          {/* Image Section */}
          <section className="min-w-0">
            <div className="group relative overflow-hidden bg-[#EAE6DF]">

              <img
                src={product.image_url}
                alt={product.name}
                className="aspect-[4/5] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
              />

              <div className="absolute left-4 top-4 border border-white/50 bg-[#F7F5F0]/90 px-4 py-2 backdrop-blur-sm sm:left-6 sm:top-6">
                <p className="text-[9px] tracking-[0.22em] text-[#171717]">
                  SAUDI ESSENTIALS
                </p>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between sm:bottom-6 sm:left-6 sm:right-6">
                <p className="text-[9px] tracking-[0.2em] text-white drop-shadow-md">
                  TIMELESS BY DESIGN
                </p>

                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 text-white backdrop-blur-sm">
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-[#DED9D0] py-4">
              <p className="text-[9px] tracking-[0.2em] text-[#777168]">
                CONSIDERED DETAILS. LASTING STYLE.
              </p>

              <span className="text-[10px] tracking-widest text-[#777168]">
                01 / 01
              </span>
            </div>
          </section>

          {/* Product Information */}
          <section className="flex min-w-0 flex-col pt-2 sm:pt-5 lg:pt-10">

            <p className="text-[10px] tracking-[0.32em] text-[#8B8172]">
              THE SAUDI COLLECTION
            </p>

            <h1
              className="mt-5 max-w-xl text-4xl font-normal leading-[1.15] tracking-[-0.04em] text-[#171717] sm:text-5xl xl:text-[58px]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {product.name}
            </h1>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-[10px] tracking-[0.18em] text-[#777168]">
                EGP
              </span>

              <span className="text-xl font-medium tracking-wide text-[#171717]">
                {product.price}
              </span>
            </div>

            <div className="my-8 h-px w-full bg-[#DED9D0]" />

            <p className="max-w-md text-sm leading-8 text-[#706C65]">
              Designed for the modern gentleman. A refined essential
              that brings understated elegance to everyday dressing.
            </p>

            {/* Decorative colors only */}
            <div className="mt-9">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[10px] tracking-[0.2em] text-[#393630]">
                  COLOUR PALETTE
                </p>

                <span className="text-[10px] text-[#8B857B]">
                  Curated tones
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  aria-label="Warm beige"
                  className="h-7 w-7 rounded-full bg-[#C7B69C] ring-1 ring-[#C7B69C] ring-offset-4 ring-offset-[#F7F5F0]"
                />

                <span
                  aria-label="Black"
                  className="h-7 w-7 rounded-full bg-[#252525]"
                />

                <span
                  aria-label="Soft cream"
                  className="h-7 w-7 rounded-full border border-[#D8D2C8] bg-[#EAE6DF]"
                />
              </div>
            </div>

            {/* Size Selection */}
            <div className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[10px] tracking-[0.2em] text-[#393630]">
                  SELECT SIZE
                </p>

                <button
                  type="button"
                  className="border-b border-[#A9A195] pb-1 text-[10px] text-[#777168] transition hover:text-[#171717]"
                >
                  SIZE GUIDE
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex h-12 items-center justify-center border text-xs tracking-widest transition duration-200 ${
                      selectedSize === size
                        ? "border-[#171717] bg-[#171717] text-white"
                        : "border-[#D8D2C8] bg-transparent text-[#393630] hover:border-[#171717]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!selectedSize) {
                    alert("Please select a size first.");
                    return;
                  }

                  alert(`Selected size: ${selectedSize}`);
                }}
                className="group flex min-h-14 w-full items-center justify-center gap-3 bg-[#171717] px-6 text-[10px] tracking-[0.24em] text-white transition duration-300 hover:bg-[#34312C]"
              >
                ADD TO BAG

                <ArrowLeft className="h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                className="flex min-h-14 w-full items-center justify-center gap-3 border border-[#D8D2C8] px-6 text-[10px] tracking-[0.2em] text-[#171717] transition hover:border-[#171717]"
              >
                <Heart className="h-4 w-4" strokeWidth={1.4} />
                ADD TO WISHLIST
              </button>
            </div>

            {/* Service Details */}
            <div className="mt-9 border-t border-[#DED9D0]">
              <div className="flex items-center gap-4 border-b border-[#DED9D0] py-5">
                <Truck className="h-4 w-4 shrink-0 text-[#777168]" strokeWidth={1.4} />

                <div>
                  <p className="text-[10px] tracking-[0.12em] text-[#393630]">
                    DELIVERY
                  </p>

                  <p className="mt-1 text-xs text-[#858078]">
                    Delivery options available at checkout.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-b border-[#DED9D0] py-5">
                <RotateCcw className="h-4 w-4 shrink-0 text-[#777168]" strokeWidth={1.4} />

                <div>
                  <p className="text-[10px] tracking-[0.12em] text-[#393630]">
                    RETURNS & EXCHANGES
                  </p>

                  <p className="mt-1 text-xs text-[#858078]">
                    See our returns policy for more details.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 py-5">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#777168]" strokeWidth={1.4} />

                <div>
                  <p className="text-[10px] tracking-[0.12em] text-[#393630]">
                    THE SAUDI STANDARD
                  </p>

                  <p className="mt-1 text-xs text-[#858078]">
                    Understated style. Thoughtful design.
                  </p>
                </div>
              </div>
            </div>

          </section>
        </div>

        {/* Bottom Brand Statement */}
        <section className="mt-20 border-t border-[#DED9D0] py-12 text-center sm:mt-28 sm:py-16">
          <p className="text-[9px] tracking-[0.35em] text-[#8B8172]">
            SAUDI — MODERN ESSENTIALS
          </p>

          <p
            className="mt-5 text-2xl font-normal text-[#171717] sm:text-3xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Less, but better.
          </p>
        </section>

      </div>
    </main>
  );
};

export default ProductDetails;
