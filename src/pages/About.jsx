
import { Link } from "react-router-dom";
import {  Mail, MessageCircle, ArrowRight, Truck, ShieldCheck, Headset } from "lucide-react";

export default function About() {
  // حط بيانات التواصل الحقيقية هنا
  const whatsapp = "";
  const email = "";
  const instagram = "";

  return (
    <main className="bg-[#F7F5F0] text-[#292722]">

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-[url('/pabout2.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 text-center text-white px-6 max-w-3xl">
          <p className="uppercase tracking-[5px] text-sm mb-6">
            Welcome to SAUDI
          </p>

          <h1 className="text-5xl md:text-7xl font-serif mb-6">
            Style That Speaks
          </h1>

          <p className="text-sm md:text-lg text-white/85 leading-8 max-w-xl mx-auto">
            Discover a world of timeless style, effortless elegance,
            and carefully selected fashion made for everyday life.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-3 mt-9 bg-white text-[#292722] px-8 py-4 text-xs tracking-[2px] uppercase hover:bg-[#E7E2D9] transition"
          >
            Explore Collection
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[4px] uppercase text-[#A39585] mb-5">
            Our Story
          </p>

          <h2 className="text-3xl md:text-5xl font-serif mb-8">
            Fashion Beyond Trends
          </h2>

          <p className="text-[#737373] leading-8 text-sm md:text-base">
            At SAUDI, we believe that style is more than what you wear.
            It's a reflection of who you are.

            Our vision is to make discovering your personal style
            simple, enjoyable, and inspiring through carefully
            selected fashion pieces.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-[#E7E2D9] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[4px] uppercase text-[#A39585] mb-4">
              What We Believe
            </p>

            <h2 className="text-3xl md:text-4xl font-serif">
              The SAUDI Philosophy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

            <div>
              <h3 className="font-serif text-2xl mb-4">
                Timeless Style
              </h3>
              <p className="text-sm text-[#737373] leading-7">
                Styles that go beyond temporary trends
                and stay relevant through time.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-2xl mb-4">
                Attention to Detail
              </h3>
              <p className="text-sm text-[#737373] leading-7">
                We believe the little details make
                a meaningful difference.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-2xl mb-4">
                Everyday Elegance
              </h3>
              <p className="text-sm text-[#737373] leading-7">
                Fashion that brings confidence
                and elegance into everyday life.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Why SAUDI */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[4px] uppercase text-[#A39585] mb-4">
            The Experience
          </p>

          <h2 className="text-3xl md:text-4xl font-serif">
            Why Shop With SAUDI?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

          <div className="flex flex-col items-center">
            <Truck size={30} strokeWidth={1} />
            <h3 className="font-serif text-xl mt-5 mb-3">
              Easy Shopping
            </h3>
            <p className="text-sm text-[#737373] leading-7">
              A simple and smooth shopping experience
              from browsing to checkout.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <ShieldCheck size={30} strokeWidth={1} />
            <h3 className="font-serif text-xl mt-5 mb-3">
              Secure Orders
            </h3>
            <p className="text-sm text-[#737373] leading-7">
              Clear order details and the ability
              to follow your order.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <Headset size={30} strokeWidth={1} />
            <h3 className="font-serif text-xl mt-5 mb-3">
              Customer Support
            </h3>
            <p className="text-sm text-[#737373] leading-7">
              We're here to help you with your
              questions and inquiries.
            </p>
          </div>

        </div>
      </section>

      {/* Contact */}
      <section className="bg-[#292722] text-white py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">

          <p className="text-xs tracking-[4px] uppercase text-[#A39585] mb-5">
            Get In Touch
          </p>

          <h2 className="text-3xl md:text-5xl font-serif mb-6">
            We'd Love to Hear From You
          </h2>

          <p className="text-sm text-white/60 leading-7 max-w-xl mx-auto mb-12">
            Have a question about an order or need help?
            Reach out to us. We'd be happy to assist you.
          </p>

          <div className="flex flex-wrap justify-center gap-5">

            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 border border-white/30 px-6 py-4 text-sm hover:bg-white hover:text-[#292722] transition"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            )}

            {email && (
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 border border-white/30 px-6 py-4 text-sm hover:bg-white hover:text-[#292722] transition"
              >
                <Mail size={18} />
                Email Us
              </a>
            )}

            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 border border-white/30 px-6 py-4 text-sm hover:bg-white hover:text-[#292722] transition"
              >
                
                Instagram
              </a>
            )}

          </div>

        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-serif mb-6">
          Discover Your Style
        </h2>

        <p className="text-sm text-[#737373] mb-8">
          Your next favorite piece is waiting for you.
        </p>

        <Link
          to="/products"
          className="inline-flex items-center gap-3 bg-[#292722] text-white px-9 py-4 text-xs tracking-[2px] uppercase hover:bg-[#A39585] transition"
        >
          Shop Now
          <ArrowRight size={16} />
        </Link>
      </section>

    </main>
  );
}
