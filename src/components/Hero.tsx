"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Gem,
  Award,
} from "lucide-react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

const slides = [
  {
    image: "/pexels-capturedbyaugustine-14333989.jpg",
    eyebrow: "ARCHITECTURAL MASTERY & ROYAL COMFORTS",
    title: (
      <>
        Haute living for
        <br />
        discerning spaces.
      </>
    ),
    description:
      "Handcrafted indoor & outdoor furniture collections crafted from natural teak, travertine, refined metals, and premium fabrics.",
  },

  {
    image: "/pexels-kampus-6838721.jpg",
    eyebrow: "CRAFTED FOR MODERN LIVING",
    title: (
      <>
        Spaces designed
        <br />
        to be remembered.
      </>
    ),
    description:
      "Timeless silhouettes, exceptional materials and meticulous craftsmanship come together to create furniture with presence.",
  },

  {
    image: "/pexels-keeganjchecks-12715508.jpg",
    eyebrow: "THE ART OF GATHERING",
    title: (
      <>
        Where comfort
        <br />
        becomes an art.
      </>
    ),
    description:
      "Thoughtfully proportioned furniture designed for long afternoons, intimate gatherings and effortless living.",
  },

  {
    image: "/pexels-naresh99-8041135.jpg",
    eyebrow: "BESPOKE FURNITURE COLLECTION",
    title: (
      <>
        Crafted for
        <br />
        your sanctuary.
      </>
    ),
    description:
      "From private residences to hospitality spaces, every NIRA piece is created with purpose, precision and enduring beauty.",
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentSlide = slides[activeSlide];

  /* =========================================================
     AUTO PLAY
  ========================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 7000);

    return () => clearInterval(interval);
  }, [activeSlide]);

  /* =========================================================
     SLIDE FUNCTIONS
  ========================================================= */

  function goToSlide(index: number) {
    if (index === activeSlide || isTransitioning) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setActiveSlide(index);
      setIsTransitioning(false);
    }, 350);
  }

  function nextSlide() {
    const next = (activeSlide + 1) % slides.length;
    goToSlide(next);
  }

  function previousSlide() {
    const previous =
      (activeSlide - 1 + slides.length) % slides.length;

    goToSlide(previous);
  }

  return (
    <section
      id="top"
      className="
        relative
        min-h-[900px]
        h-[100svh]
        w-full
        overflow-hidden
        bg-[#171512]
        text-white
      "
    >
      {/* =====================================================
          BACKGROUND IMAGE
      ====================================================== */}

      <div
        className={`
          absolute
          inset-0
          transition-opacity
          duration-700
          ease-out
          ${isTransitioning ? "opacity-0" : "opacity-100"}
        `}
      >
        <Image
          key={currentSlide.image}
          src={currentSlide.image}
          alt="NIRA Furniture luxury interior"
          fill
          priority
          sizes="100vw"
          className="
            object-cover
            object-center
            scale-[1.02]
          "
        />
      </div>

      {/* =====================================================
          CINEMATIC OVERLAY
      ====================================================== */}

      {/* Overall darkening */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-black/30
        "
      />

      {/* Strong top shade */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-[230px]
          bg-gradient-to-b
          from-black/70
          via-black/35
          to-transparent
        "
      />

      {/* Left content shade */}

      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          left-0
          w-[75%]
          bg-gradient-to-r
          from-black/55
          via-black/25
          to-transparent
        "
      />

      {/* Bottom shade */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-[48%]
          bg-gradient-to-t
          from-black/70
          via-black/25
          to-transparent
        "
      />

      {/* =====================================================
          HERO CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          h-full
          w-full
          max-w-[1500px]
          items-center
          px-6
          pt-20
          pb-32
          sm:px-9
          lg:px-14
        "
      >
        <div
          className={`
            max-w-[850px]
            transition-all
            duration-700
            ease-out
            ${
              isTransitioning
                ? "translate-y-4 opacity-0"
                : "translate-y-0 opacity-100"
            }
          `}
        >
          {/* =================================================
              EYEBROW
          ================================================= */}

          <div
            className="
              mb-7
              inline-flex
              items-center
              gap-3
              border
              border-white/15
              bg-black/25
              px-4
              py-2.5
              backdrop-blur-sm
            "
          >
            <span className="h-1 w-1 rounded-full bg-[#D0B27A]" />

            <p
              className="
                text-[11px]
                font-medium
                uppercase
                tracking-[0.34em]
                text-[#E3D7C2]
                sm:text-[9px]
              "
            >
              {currentSlide.eyebrow}
            </p>
          </div>

          {/* =================================================
              HEADING
          ================================================= */}

          <h1
            className="
              max-w-[900px]
              font-serif
              text-[51px]
              font-normal
              leading-[0.88]
              tracking-[-0.045em]
              text-white
              sm:text-[64px]
              md:text-[78px]
              lg:text-[91px]
              xl:text-[104px]
            "
          >
            {currentSlide.title}
          </h1>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <p
            className="
              mt-7
              max-w-[590px]
              text-[12px]
              leading-6
              text-white/70
              sm:text-[13px]
              sm:leading-7
            "
          >
            {currentSlide.description}
          </p>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/collections"
              className="
                inline-flex
                h-11
                items-center
                justify-center
                border
                border-white
                bg-white
                px-7
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[#201D19]
                transition-all
                duration-300
                hover:bg-transparent
                hover:text-white
              "
            >
              Explore Collections
            </Link>

            <Link
              href="/enquiry"
              className="
                inline-flex
                h-11
                items-center
                justify-center
                border
                border-white/45
                bg-black/20
                px-7
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-white
                backdrop-blur-sm
                transition-all
                duration-300
                hover:border-white
                hover:bg-white
                hover:text-[#201D19]
              "
            >
              Bespoke Furniture
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          PREMIUM FEATURE STRIP
      ====================================================== */}

      <div
        className="
          absolute
          inset-x-6
          bottom-[85px]
          z-20
          hidden
          min-h-[110px]
          border
          border-white/10
          bg-black/5
          backdrop-blur-md
          lg:block
        "
      >
        <div className="grid grid-cols-3">

          {/* Feature 1 */}

          <div className="flex items-center gap-5 px-9 py-8">
            <Sparkles
              size={20}
              strokeWidth={1.2}
              className="shrink-0 text-[#D0B27A]"
            />

            <div>
              <p
                className={`
                  ${playfair.className}
                  text-[20px]
                  font-medium
                  leading-[30px]
                  tracking-[0.22px]
                  text-white
                `}
              >
                100% Solid
              </p>

              <p
                className="
                  mt-0.5
                  text-[12px]
                  uppercase
                  tracking-[0.15em]
                  text-white/50
                "
              >
                Italian Honed Travertine & FSC® Teak
              </p>
            </div>
          </div>

          {/* Feature 2 */}

          <div className="flex items-center gap-5 px-9 py-8">
            <Gem
              size={20}
              strokeWidth={1.2}
              className="shrink-0 text-[#D0B27A]"
            />

            <div>
              <p
                className={`
                  ${playfair.className}
                  text-[20px]
                  font-medium
                  leading-[30px]
                  tracking-[0.22px]
                  text-white
                `}
              >
                Dual Craft
              </p>

              <p
                className="
                  mt-0.5
                  text-[12px]
                  uppercase
                  tracking-[0.15em]
                  text-white/50
                "
              >
                Traditional craft & contemporary design
              </p>
            </div>
          </div>

          {/* Feature 3 */}

          <div className="flex items-center gap-5 px-9 py-8">
            <Award
              size={20}
              strokeWidth={1.2}
              className="shrink-0 text-[#D0B27A]"
            />

            <div>
              <p
                className={`
                  ${playfair.className}
                  text-[20px]
                  font-medium
                  leading-[30px]
                  tracking-[0.22px]
                  text-white
                `}
              >
                Made to Order
              </p>

              <p
                className="
                  mt-0.5
                  text-[12px]
                  uppercase
                  tracking-[0.15em]
                  text-white/50
                "
              >
                Bespoke dimensional tailoring
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* =====================================================
          CAROUSEL CONTROLS
      ====================================================== */}

      <div
        className="
          absolute
          bottom-[58px]
          right-6
          z-50
          flex
          items-center
          gap-4
          sm:right-9
        "
      >
        {/* Previous */}

        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous slide"
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            border
            border-white/30
            bg-black/20
            text-white
            backdrop-blur-sm
            transition-all
            duration-300
            hover:border-white
            hover:bg-white
            hover:text-[#201D19]
          "
        >
          <ArrowLeft
            size={14}
            strokeWidth={1}
          />
        </button>

        {/* Counter */}

        <div
          className="
            flex
            items-center
            gap-2
            text-[9px]
            tracking-[0.18em]
            text-white
          "
        >
          <span>
            {String(activeSlide + 1).padStart(2, "0")}
          </span>

          <span className="h-px w-8 bg-white/40" />

          <span className="text-white/40">
            {String(slides.length).padStart(2, "0")}
          </span>
        </div>

        {/* Next */}

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next slide"
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            border
            border-white/30
            bg-black/20
            text-white
            backdrop-blur-sm
            transition-all
            duration-300
            hover:border-white
            hover:bg-white
            hover:text-[#201D19]
          "
        >
          <ArrowRight
            size={14}
            strokeWidth={1}
          />
        </button>
      </div>

      {/* =====================================================
          SLIDE DOTS
      ====================================================== */}

      <div
        className="
          absolute
          bottom-[62px]
          left-1/2
          z-50
          hidden
          -translate-x-1/2
          items-center
          gap-2
          sm:flex
        "
      >
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className="group flex h-4 items-center"
          >
            <span
              className={`
                block
                h-px
                transition-all
                duration-500
                ${
                  index === activeSlide
                    ? "w-9 bg-[#D0B27A]"
                    : "w-3 bg-white/40 group-hover:w-6 group-hover:bg-white/80"
                }
              `}
            />
          </button>
        ))}
      </div>

      {/* =====================================================
          BOTTOM BRAND DETAILS
      ====================================================== */}

      <div
        className="
          absolute
          bottom-[58px]
          left-6
          z-50
          hidden
          items-center
          gap-4
          text-[11px]
          uppercase
          tracking-[0.2em]
          text-white/55
          md:flex
          lg:left-9
        "
      >
        <span>Made in India</span>

        <span className="h-1 w-1 rounded-full bg-[#D0B27A]" />

        <span>Custom Made</span>

        <span className="h-1 w-1 rounded-full bg-[#D0B27A]" />

        <span>Pan India Delivery</span>
      </div>

      {/* =====================================================
          ANNOUNCEMENT MARQUEE
      ====================================================== */}

      <div
        className="
          absolute
          bottom-0
          inset-x-0
          z-40
          h-[40px]
          overflow-hidden
          border-t
          border-[#D0B27A]/30
          bg-[#171512]/90
        "
      >
        <div
          className="
            flex
            h-full
            w-max
            animate-marquee
            items-center
            whitespace-nowrap
          "
        >
          {/* FIRST SET */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-12
              pr-10
              text-[11px]
              font-medium
              uppercase
              tracking-[0.20em]
              text-white/80
            "
          >
            <span>
              Summer Atelier Event: Receive a bespoke marble side table with select
              commissions
            </span>

            <span className="text-[#D0B27A]">
              ◆
            </span>

            <span>
              Complimentary white-glove air freight worldwide
            </span>

            <span className="text-[#D0B27A]">
              ◆
            </span>

            <span>
              Bespoke furniture crafted for extraordinary spaces
            </span>

            <span className="text-[#D0B27A]">
              ◆
            </span>

            <span>
              NIRA Furniture — Made in India
            </span>

            <span className="text-[#D0B27A]">
              ◆
            </span>
          </div>

          {/* SECOND SET */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-12
              pr-10
              text-[12px]
              font-medium
              uppercase
              tracking-[0.20em]
              text-white/80
            "
          >
            <span>
              Summer Atelier Event: Receive a bespoke marble side table with select
              commissions
            </span>

            <span className="text-[#D0B27A]">
              ◆
            </span>

            <span>
              Complimentary white-glove air freight worldwide
            </span>

            <span className="text-[#D0B27A]">
              ◆
            </span>

            <span>
              Bespoke furniture crafted for extraordinary spaces
            </span>

            <span className="text-[#D0B27A]">
              ◆
            </span>

            <span>
              NIRA Furniture — Made in India
            </span>

            <span className="text-[#D0B27A]">
              ◆
            </span>
          </div>

        </div>
      </div>

    </section>
  );
}