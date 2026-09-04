"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { products } from "@/data/products";

export default function Collections() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const curatedProducts = useMemo(() => {
    return [
      ...products.filter(
        (product) => product.category === "Outdoor Furniture"
      ),
      ...products.filter(
        (product) => product.category === "Indoor Furniture"
      ),
    ];
  }, []);

  const totalProducts = curatedProducts.length;

  function nextSlide() {
    if (isAnimating || totalProducts <= 1) return;

    setIsAnimating(true);

    setActiveIndex((current) => (current + 1) % totalProducts);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  }

  function previousSlide() {
    if (isAnimating || totalProducts <= 1) return;

    setIsAnimating(true);

    setActiveIndex((current) =>
      current === 0 ? totalProducts - 1 : current - 1
    );

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  }

  /*
   * We show 3 products at a time on desktop.
   * The active index represents the first visible product.
   */
  const visibleProducts = Array.from(
    { length: Math.min(3, totalProducts) },
    (_, offset) => {
      return curatedProducts[
        (activeIndex + offset) % totalProducts
      ];
    }
  );

  if (!totalProducts) {
    return null;
  }

  return (
    <section
      className="
        relative
        overflow-hidden
        border-t
        border-[#171512]/10
        bg-[#F7F4EE]
        py-24
        text-[#171512]
        sm:py-28
        lg:py-32
        xl:py-36
      "
    >
      {/* =====================================================
          TOP GOLD LINE
      ====================================================== */}

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-[2px]
          bg-[#8B6B3F]
        "
      />

      {/* =====================================================
          SUBTLE BACKGROUND DETAIL
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-220px]
          top-[-220px]
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#D7C29A]/10
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-250px]
          left-[-200px]
          h-[550px]
          w-[550px]
          rounded-full
          bg-[#D7C29A]/10
          blur-[140px]
        "
      />

      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div
        className="
          relative
          mx-auto
          w-[calc(100%-32px)]
          max-w-[1480px]
          sm:w-[calc(100%-48px)]
          lg:w-[calc(100%-70px)]
          xl:w-[calc(100%-96px)]
        "
      >
        {/* =================================================
            SECTION HEADER
        ================================================== */}

        <div
          className="
            mb-14
            flex
            flex-col
            gap-8
            sm:mb-16
            lg:mb-20
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          {/* LEFT */}

          <div>
            <div className="mb-5">
              <span
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.24em]
                  text-[#765A32]
                  sm:text-[10px]
                "
              >
                Collection No. IV
              </span>
            </div>

            <h2
              className="
                max-w-[850px]
                font-serif
                text-[45px]
                font-normal
                leading-[0.94]
                tracking-[-0.045em]
                text-[#171512]
                sm:text-[55px]
                md:text-[66px]
                lg:text-[76px]
                xl:text-[86px]
              "
            >
              The Curated
              <br />
              Masterpieces
            </h2>
          </div>

          {/* =================================================
              CAROUSEL CONTROLS
          ================================================== */}

          <div
            className="
              flex
              items-center
              gap-4
              lg:pb-2
            "
          >
            <span
              className="
                mr-2
                min-w-[42px]
                text-[10px]
                font-medium
                tracking-[0.12em]
                text-[#171512]
              "
            >
              {String((activeIndex % totalProducts) + 1).padStart(
                2,
                "0"
              )}{" "}
              /{" "}
              {String(totalProducts).padStart(2, "0")}
            </span>

            <button
              type="button"
              onClick={previousSlide}
              disabled={isAnimating}
              aria-label="Previous collection"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-[#ECE9E2]
                text-[#171512]
                transition-all
                duration-300
                hover:bg-[#171512]
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <ArrowLeft
                size={17}
                strokeWidth={1.2}
              />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              disabled={isAnimating}
              aria-label="Next collection"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-[#ECE9E2]
                text-[#171512]
                transition-all
                duration-300
                hover:bg-[#171512]
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <ArrowRight
                size={17}
                strokeWidth={1.2}
              />
            </button>
          </div>
        </div>

        {/* =================================================
            TOP RULE
        ================================================== */}

        <div
          className="
            mb-6
            h-px
            w-full
            bg-[#171512]/10
          "
        />

        {/* =================================================
            DESKTOP CAROUSEL
        ================================================== */}

        <div className="hidden overflow-hidden lg:block">
          <div
            className={`
              grid
              grid-cols-3
              gap-8
              transition-all
              duration-500
              ease-[cubic-bezier(0.22,1,0.36,1)]
              ${
                isAnimating
                  ? "translate-x-3 opacity-70"
                  : "translate-x-0 opacity-100"
              }
            `}
          >
            {visibleProducts.map((product, index) => (
              <ProductCard
                key={`${product.slug}-${activeIndex}-${index}`}
                product={product}
              />
            ))}
          </div>
        </div>

        {/* =================================================
            TABLET
        ================================================== */}

        <div className="hidden overflow-hidden sm:block lg:hidden">
          <div
            className={`
              grid
              grid-cols-2
              gap-6
              transition-all
              duration-500
              ${
                isAnimating
                  ? "translate-x-3 opacity-70"
                  : "translate-x-0 opacity-100"
              }
            `}
          >
            {visibleProducts.slice(0, 2).map((product, index) => (
              <ProductCard
                key={`${product.slug}-${activeIndex}-${index}`}
                product={product}
              />
            ))}
          </div>
        </div>

        {/* =================================================
            MOBILE
        ================================================== */}

        <div className="overflow-hidden sm:hidden">
          <div
            className={`
              transition-all
              duration-500
              ease-[cubic-bezier(0.22,1,0.36,1)]
              ${
                isAnimating
                  ? "translate-x-3 opacity-70"
                  : "translate-x-0 opacity-100"
              }
            `}
          >
            <ProductCard
              product={visibleProducts[0]}
            />
          </div>
        </div>

        {/* =================================================
            CAROUSEL INDICATOR
        ================================================== */}

        <div
          className="
            mt-10
            flex
            items-center
            justify-center
            gap-2
          "
        >
          {curatedProducts.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                if (!isAnimating) {
                  setActiveIndex(index);
                }
              }}
              aria-label={`Go to product ${index + 1}`}
              className="
                group
                flex
                h-5
                items-center
              "
            >
              <span
                className={`
                  block
                  h-px
                  transition-all
                  duration-500
                  ${
                    index === activeIndex
                      ? "w-8 bg-[#8B6B3F]"
                      : "w-3 bg-[#171512]/20 group-hover:w-5 group-hover:bg-[#171512]/50"
                  }
                `}
              />
            </button>
          ))}
        </div>

        {/* =================================================
            BOTTOM COLLECTION LINK
        ================================================== */}

        <div
          className="
            mt-12
            flex
            justify-end
            border-t
            border-[#171512]/10
            pt-6
          "
        >
          <Link
            href="/collections"
            className="
              group
              inline-flex
              items-center
              gap-4
              border-b
              border-[#171512]/30
              pb-2
              text-[9px]
              font-medium
              uppercase
              tracking-[0.22em]
              text-[#171512]
              transition-all
              duration-300
              hover:border-[#171512]
            "
          >
            View All Collections

            <ArrowRight
              size={14}
              strokeWidth={1}
              className="
                transition-transform
                duration-500
                group-hover:translate-x-1
              "
            />
          </Link>
        </div>
      </div>
    </section>
  );
}


/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({
  product,
}: {
  product: any;
}) {
  /*
   * Supports the common image field names used in furniture
   * product data.
   */
  const image =
    product.image ||
    product.images?.[0] ||
    product.thumbnail ||
    "/placeholder.jpg";

  const price =
    typeof product.price === "number"
      ? `₹${product.price.toLocaleString("en-IN")}`
      : product.price || "Price on Request";

  const category =
    product.category === "Outdoor Furniture"
      ? "OUTDOOR SANCTUARY"
      : "INDOOR GRAND SALON";

  return (
    <article
      className="
        group
        min-w-0
        bg-[#F1EEE7]
      "
    >
      {/* =================================================
          IMAGE
      ================================================== */}

      <Link
        href={`/products/${product.slug}`}
        className="
          relative
          block
          aspect-[1.18/1]
          overflow-hidden
          bg-[#E7E2D8]
        "
      >
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="
            (min-width: 1280px) 30vw,
            (min-width: 1024px) 32vw,
            100vw
          "
          className="
            object-cover
            transition-transform
            duration-700
            ease-[cubic-bezier(0.22,1,0.36,1)]
            group-hover:scale-[1.035]
          "
        />

        {/* Image shade */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-24
            bg-gradient-to-t
            from-black/20
            to-transparent
            opacity-70
          "
        />

        {/* Category label */}

        <div
          className="
            absolute
            left-4
            top-4
            bg-[#F7F4EE]/95
            px-3
            py-2
          "
        >
          <span
            className="
              text-[8px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-[#765A32]
            "
          >
            {category}
          </span>
        </div>
      </Link>

      {/* =================================================
          PRODUCT DETAILS
      ================================================== */}

      <div
        className="
          px-6
          pb-7
          pt-6
          sm:px-7
          sm:pb-8
        "
      >
        {/* Material */}

        <p
          className="
            min-h-[38px]
            text-[11px]
            leading-5
            text-[#171512]/55
          "
        >
          {product.material ||
            product.description ||
            "Premium materials & refined craftsmanship"}
        </p>

        {/* Product name */}

        <Link
          href={`/products/${product.slug}`}
          className="
            mt-3
            block
            font-serif
            text-[24px]
            font-normal
            leading-[1.08]
            tracking-[-0.025em]
            text-[#171512]
            transition-opacity
            duration-300
            hover:opacity-60
            sm:text-[26px]
          "
        >
          {product.name}
        </Link>

        {/* Bottom */}

        <div
          className="
            mt-8
            flex
            items-end
            justify-between
            gap-5
          "
        >
          <div>
            <p
              className="
                text-[19px]
                font-medium
                tracking-[-0.01em]
                text-[#171512]
              "
            >
              {price}
            </p>

            <p
              className="
                mt-1
                text-[11px]
                text-[#171512]/50
              "
            >
              Direct Atelier Shipping
            </p>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="
              inline-flex
              shrink-0
              items-center
              justify-center
              bg-[#171512]
              px-5
              py-3
              text-[12px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-white
              transition-all
              duration-300
              hover:bg-[#765A32]
            "
          >
            Inquire Atelier
          </Link>
        </div>
      </div>
    </article>
  );
}