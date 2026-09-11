"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Masterpiece = {
  name: string;
  material: string;
  shipping?: string;
  image: string;
  badge?: string;

  // Additional product information
  category?: string;
  subcategory?: string;
  description?: string;
  features?: string[];
  seating?: string;
  style?: string;
  collection?: string;
  color?: string;
  alt?: string;
  slug?: string;
};

const masterpieces: Masterpiece[] = [
  {
    name: "The Amali Sovereign Outdoor Lounge Suite",

    material:
      "Aged Weathered Teak & Hand-Woven Weatherproof Cord",

    image:
      "https://images.unsplash.com/photo-1786654026766-8c6422fcbb84?auto=format&fit=crop&fm=jpg&q=85&w=1600",

    badge: "OUTDOOR SANCTUARY",

    category: "Outdoor Furniture",

    subcategory: "Outdoor Lounge Suites",

    description:
      "A refined outdoor sanctuary designed for elevated alfresco living. The Amali Sovereign pairs the natural character of aged weathered teak with hand-woven weatherproof cord, creating a sophisticated lounge setting that balances enduring craftsmanship with contemporary comfort.",

    features: [
      "Aged weathered teak frame",
      "Hand-woven weatherproof cord detailing",
      "Deep, generously cushioned lounge seating",
      "Designed for luxurious outdoor entertaining",
      "Sophisticated neutral upholstery",
      "Crafted for premium outdoor environments",
    ],

    seating:
      "2 Lounge Chairs + 1 Coffee Table",

    style:
      "Luxury Contemporary",

    collection:
      "Outdoor Sanctuary",

    color:
      "Natural Teak & Warm Ivory",

    alt:
      "NIRA Furniture luxury outdoor lounge chairs and coffee table on a stone patio",

    slug:
      "amali-sovereign-outdoor-lounge-suite",
  },

  {
    name: "The Amali Grand Outdoor Lounge Collection",

    material:
      "Weathered Teak & Hand-Woven Weatherproof Rope",

    image:
      "https://images.unsplash.com/photo-1776186243330-1cbe52d10509?auto=format&fit=crop&fm=jpg&q=85&w=1600",

    badge: "OUTDOOR SANCTUARY",

    category:
      "Outdoor Furniture",

    subcategory:
      "Outdoor Lounge Sets",

    description:
      "An expansive outdoor lounge collection designed for sophisticated alfresco entertaining. The Amali Grand combines warm teak accents with hand-woven weatherproof rope and plush light-toned cushions, creating a refined yet inviting setting for luxury terraces, gardens, and outdoor living spaces.",

    features: [
      "Weathered teak accents",
      "Hand-woven weatherproof rope construction",
      "Plush outdoor cushions",
      "Generous L-shaped sectional seating",
      "Matching lounge chairs",
      "Teak-accented side tables",
      "Designed for luxury outdoor entertaining",
      "Contemporary resort-inspired design",
    ],

    seating:
      "L-Shaped Sectional Sofa + 2 Lounge Chairs + Accent Tables",

    style:
      "Luxury Contemporary",

    collection:
      "Outdoor Sanctuary",

    color:
      "Natural Teak, Charcoal Rope & Ivory",

    alt:
      "NIRA Furniture luxury outdoor lounge chairs and table surrounded by greenery",

    slug:
      "amali-grand-outdoor-lounge-collection",
  },

  {
    name: "The Amali Haven Hanging Swing Sofa",

    material:
      "Hand-Woven Weatherproof Rattan & Natural Teak",

    image:
      "https://images.unsplash.com/photo-1645142955215-9b6ad786c05a?auto=format&fit=crop&fm=jpg&q=85&w=1600",

    badge: "OUTDOOR SANCTUARY",

    category:
      "Outdoor Furniture",

    subcategory:
      "Hanging Swing Sofas",

    description:
      "A beautifully crafted hanging swing sofa designed to bring resort-inspired comfort to outdoor spaces. The Amali Haven combines hand-woven weatherproof rattan with warm natural teak detailing and plush cushions, creating an inviting retreat for relaxed outdoor living.",

    features: [
      "Hand-woven weatherproof rattan construction",
      "Natural teak frame and detailing",
      "Suspended swing design",
      "Plush outdoor seat cushion",
      "Decorative botanical accent cushions",
      "Ideal for patios, terraces, gardens, and verandas",
      "Resort-inspired luxury design",
    ],

    seating:
      "2–3 Person Hanging Swing Sofa",

    style:
      "Luxury Resort Contemporary",

    collection:
      "Outdoor Sanctuary",

    color:
      "Natural Rattan, Teak & Sage Green",

    alt:
      "NIRA Furniture luxury outdoor furniture overlooking a swimming pool",

    slug:
      "amali-haven-hanging-swing-sofa",
  },
];

export default function CuratedMasterpieces() {
  const [current, setCurrent] = useState(0);

  const [isTransitioning, setIsTransitioning] =
    useState(true);

  /*
   * Duplicate the products so the carousel
   * can continue moving forward.
   */
  const carouselItems = [
    ...masterpieces,
    ...masterpieces,
  ];

  /* ================================================= */
  /* AUTO PLAY                                         */
  /* ================================================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => prev + 1);
      setIsTransitioning(true);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  /* ================================================= */
  /* RESET AFTER DUPLICATE SET                         */
  /* ================================================= */

  useEffect(() => {
    if (current !== masterpieces.length) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsTransitioning(false);
      setCurrent(0);
    }, 750);

    return () => clearTimeout(timeout);
  }, [current]);

  /* ================================================= */
  /* NEXT                                              */
  /* ================================================= */

  const next = () => {
    setIsTransitioning(true);

    setCurrent((prev) => {
      if (prev >= masterpieces.length) {
        return 1;
      }

      return prev + 1;
    });
  };

  /* ================================================= */
  /* PREVIOUS                                          */
  /* ================================================= */

  const previous = () => {
    setIsTransitioning(true);

    setCurrent((prev) => {
      if (prev <= 0) {
        return masterpieces.length - 1;
      }

      return prev - 1;
    });
  };

  return (
    <section
      className="
        w-full
        overflow-hidden
        bg-[#EEEAE4]
        py-20
        md:py-24
        lg:py-28
        xl:py-32
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1600px]
          px-5
          md:px-8
          lg:px-10
          xl:px-12
        "
      >
        {/* ================================================= */}
        {/* HEADER                                            */}
        {/* ================================================= */}

        <div
          className="
            mb-10
            flex
            items-end
            justify-between
            md:mb-12
            lg:mb-14
          "
        >
          <div>
            {/* COLLECTION NUMBER */}

            <p
              className="
                mb-4
                font-sans
                text-[12px]
                font-medium
                uppercase
                tracking-[0.24em]
                text-[#8B7352]
                md:text-[13px]
              "
            >
              Collection No. IV
            </p>

            {/* HEADING */}

            <h2
              className="
                font-serif
                text-[42px]
                font-normal
                leading-[0.95]
                tracking-[-0.03em]
                text-[#171717]
                sm:text-[50px]
                md:text-[58px]
                lg:text-[68px]
                xl:text-[74px]
              "
            >
              The Curated Masterpieces
            </h2>
          </div>

          {/* ================================================= */}
          {/* DESKTOP CONTROLS                                 */}
          {/* ================================================= */}

          <div
            className="
              hidden
              items-center
              gap-3
              md:flex
            "
          >
            <span
              className="
                mr-2
                font-sans
                text-[11px]
                font-medium
                uppercase
                tracking-[0.18em]
                text-[#6D6259]
              "
            >
              {String(
                (current % masterpieces.length) + 1
              ).padStart(2, "0")}{" "}
              / 03
            </span>

            <button
              type="button"
              onClick={previous}
              aria-label="Previous collection"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-black/[0.06]
                bg-[#F8F6F1]
                text-[#171717]
                shadow-[0_8px_25px_rgba(40,34,28,0.04)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-white
                hover:shadow-[0_12px_30px_rgba(40,34,28,0.08)]
              "
            >
              <ChevronLeft
                size={19}
                strokeWidth={1.25}
              />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Next collection"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-black/[0.06]
                bg-[#F8F6F1]
                text-[#171717]
                shadow-[0_8px_25px_rgba(40,34,28,0.04)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-white
                hover:shadow-[0_12px_30px_rgba(40,34,28,0.08)]
              "
            >
              <ChevronRight
                size={19}
                strokeWidth={1.25}
              />
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* MOBILE CONTROLS                                   */}
        {/* ================================================= */}

        <div
          className="
            mb-8
            flex
            items-center
            justify-between
            md:hidden
          "
        >
          <span
            className="
              font-sans
              text-[11px]
              uppercase
              tracking-[0.18em]
              text-[#6D6259]
            "
          >
            {String(
              (current % masterpieces.length) + 1
            ).padStart(2, "0")}{" "}
            / 03
          </span>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={previous}
              aria-label="Previous"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-black/[0.06]
                bg-[#F8F6F1]
                text-[#171717]
                shadow-[0_8px_20px_rgba(40,34,28,0.04)]
              "
            >
              <ChevronLeft
                size={18}
                strokeWidth={1.25}
              />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-black/[0.06]
                bg-[#F8F6F1]
                text-[#171717]
                shadow-[0_8px_20px_rgba(40,34,28,0.04)]
              "
            >
              <ChevronRight
                size={18}
                strokeWidth={1.25}
              />
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* CAROUSEL VIEWPORT                                  */}
        {/* ================================================= */}

        <div
          className="
            relative
            w-full
            overflow-hidden
          "
        >
          {/* ================================================= */}
          {/* CAROUSEL TRACK                                    */}
          {/* ================================================= */}

          <div
            className={`
              flex
              [--slide-width:100%]
              md:[--slide-width:50%]
              lg:[--slide-width:33.333333%]
              ${
                isTransitioning
                  ? "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  : ""
              }
            `}
            style={{
              transform:
                "translateX(calc(-1 * " +
                current +
                " * var(--slide-width)))",
            }}
          >
            {carouselItems.map(
              (product, index) => (
                <div
                  key={`${product.name}-${index}`}
                  className="
                    w-full
                    shrink-0
                    px-2.5
                    md:w-1/2
                    lg:w-1/3
                  "
                >
                  {/* ================================================= */}
                  {/* PRODUCT CARD                                      */}
                  {/* ================================================= */}

                  <article
                    className={`
                      group
                      h-full
                      overflow-hidden
                      border
                      border-black/[0.055]
                      shadow-[0_18px_50px_rgba(40,34,28,0.055)]
                      transition-all
                      duration-500
                      hover:-translate-y-1
                      hover:shadow-[0_24px_60px_rgba(40,34,28,0.10)]
                      ${
                        index % 3 === 0
                          ? "bg-white"
                          : index % 3 === 1
                          ? "bg-[#FAF9F6]"
                          : "bg-[#F6F4EF]"
                      }
                    `}
                  >
                    {/* ================================================= */}
                    {/* IMAGE                                             */}
                    {/* ================================================= */}

                    <div
                      className="
                        relative
                        aspect-[1.48/1]
                        overflow-hidden
                        bg-[#E3DED5]
                      "
                    >
                      <Image
                        src={product.image}
                        alt={
                          product.alt ||
                          product.name
                        }
                        fill
                        sizes="
                          (max-width: 768px) 100vw,
                          (max-width: 1200px) 50vw,
                          33vw
                        "
                        className="
                          object-cover
                          transition-transform
                          duration-700
                          ease-out
                          group-hover:scale-[1.025]
                        "
                        quality={85}
                      />

                      {/* SOFT IMAGE LIGHT */}

                      <div
                        className="
                          pointer-events-none
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/[0.10]
                          via-transparent
                          to-white/[0.08]
                          opacity-70
                          transition-opacity
                          duration-500
                          group-hover:opacity-100
                        "
                      />

                      {/* BADGE */}

                      {product.badge && (
                        <div
                          className="
                            absolute
                            left-4
                            top-4
                            border
                            border-white/40
                            bg-white/[0.92]
                            px-3
                            py-2
                            shadow-[0_8px_20px_rgba(0,0,0,0.06)]
                            backdrop-blur-md
                          "
                        >
                          <span
                            className="
                              font-sans
                              text-[10px]
                              font-medium
                              uppercase
                              tracking-[0.12em]
                              text-[#62574D]
                            "
                          >
                            {product.badge}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ================================================= */}
                    {/* CONTENT                                           */}
                    {/* ================================================= */}

                    <div
                      className="
                        px-5
                        pb-7
                        pt-6
                        md:px-6
                        md:pb-8
                        md:pt-7
                      "
                    >
                      {/* MATERIAL */}

                      <p
                        className="
                          mb-3
                          line-clamp-2
                          font-sans
                          text-[12px]
                          leading-[1.55]
                          text-[#81766C]
                          md:text-[13px]
                        "
                      >
                        {product.material}
                      </p>

                      {/* PRODUCT NAME */}

                      <h3
                        className="
                          min-h-[70px]
                          max-w-[94%]
                          font-serif
                          text-[26px]
                          font-normal
                          leading-[1.08]
                          tracking-[-0.018em]
                          text-[#171717]
                          md:text-[29px]
                        "
                      >
                        {product.name}
                      </h3>

                      {/* ================================================= */}
                      {/* INQUIRE BUTTON                                    */}
                      {/* ================================================= */}

                      <div
                        className="
                          mt-8
                          flex
                          justify-end
                        "
                      >
                        <button
                          type="button"
                          className="
                            shrink-0
                            border
                            border-[#171717]
                            bg-[#171717]
                            px-5
                            py-3
                            font-sans
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-[0.12em]
                            text-white
                            transition-all
                            duration-300
                            hover:border-[#8B7352]
                            hover:bg-[#8B7352]
                            hover:tracking-[0.15em]
                          "
                        >
                          Inquire Atelier
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              )
            )}
          </div>
        </div>

        {/* ================================================= */}
        {/* CAROUSEL PROGRESS                                 */}
        {/* ================================================= */}

        <div className="mt-9 flex justify-center">
          <div className="flex items-center gap-2">
            {masterpieces.map(
              (_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to slide ${
                    index + 1
                  }`}
                  onClick={() => {
                    setIsTransitioning(true);
                    setCurrent(index);
                  }}
                  className={`
                    h-[2px]
                    transition-all
                    duration-500
                    ${
                      current %
                        masterpieces.length ===
                      index
                        ? "w-12 bg-[#8B7352]"
                        : "w-5 bg-[#C8C0B5]"
                    }
                  `}
                />
              )
            )}
          </div>
        </div>

        {/* ================================================= */}
        {/* BOTTOM DETAIL                                     */}
        {/* ================================================= */}

        <div
          className="
            mt-10
            flex
            items-center
            justify-center
            gap-3
            text-center
          "
        >
          <span
            className="
              h-px
              w-8
              bg-[#B9AA95]
            "
          />

          <p
            className="
              font-sans
              text-[15px]
              font-medium
              uppercase
              tracking-[0.25em]
              text-[#8B7352]
            "
          >
            Crafted for Distinguished Living
          </p>

          <span
            className="
              h-px
              w-8
              bg-[#B9AA95]
            "
          />
        </div>
      </div>
    </section>
  );
}