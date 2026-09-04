"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

import { products } from "@/data/products";

/* =========================================================
   TYPES
========================================================= */

type Product = {
  slug: string;
  name: string;
  category?: string;
  description?: string;
  image?: string;
  images?: string[];
  price?: number | string;
  material?: string;
  [key: string]: any;
};

/* =========================================================
   MATERIALS
========================================================= */

const materials = [
  "All Materials",
  "Aged Teak",
  "Travertine",
  "Pure Bouclé",
  "Braided Cord",
  "Fumed Walnut",
];

/* =========================================================
   CATEGORIES
========================================================= */

const categories = [
  {
    label: "All Pieces",
    value: "all",
  },
  {
    label: "Indoor Furniture",
    value: "Indoor Furniture",
  },
  {
    label: "Outdoor Furniture",
    value: "Outdoor Furniture",
  },
  {
    label: "Seating",
    value: "seating",
  },
  {
    label: "Dining",
    value: "dining",
  },
  {
    label: "Accents",
    value: "accents",
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeMaterial, setActiveMaterial] =
    useState("All Materials");

  const [sortBy, setSortBy] = useState("curated");

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 6;

  /* =======================================================
     FILTER PRODUCTS
  ======================================================= */

  const filteredProducts = useMemo(() => {
    let result = [...(products as Product[])];

    /* Category */

    if (activeCategory !== "all") {
      if (
        activeCategory === "seating" ||
        activeCategory === "dining" ||
        activeCategory === "accents"
      ) {
        result = result.filter((product) => {
          const text = `
            ${product.name}
            ${product.description}
            ${product.category}
          `.toLowerCase();

          return text.includes(activeCategory);
        });
      } else {
        result = result.filter(
          (product) =>
            product.category === activeCategory
        );
      }
    }

    /* Material */

    if (activeMaterial !== "All Materials") {
      result = result.filter((product) => {
        const text = `
          ${product.name}
          ${product.description}
          ${product.material}
        `.toLowerCase();

        return text.includes(
          activeMaterial.toLowerCase()
        );
      });
    }

    /* Sort */

    if (sortBy === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    }

    return result;
  }, [
    activeCategory,
    activeMaterial,
    sortBy,
  ]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length / productsPerPage
    )
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safePage - 1) * productsPerPage;

  const visibleProducts =
    filteredProducts.slice(
      startIndex,
      startIndex + productsPerPage
    );

  function changeCategory(value: string) {
    setActiveCategory(value);
    setCurrentPage(1);
  }

  function changeMaterial(value: string) {
    setActiveMaterial(value);
    setCurrentPage(1);
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen w-full bg-[#F7F4EE] text-[#171512]">

      {/* ===================================================
          EDITORIAL HEADER
      ==================================================== */}

   <section
  className="
    border-b
    border-[#171512]/10
    px-5
    pb-10
    pt-[105px]
    sm:px-7
    sm:pb-12
    sm:pt-[115px]
    lg:px-9
    lg:pb-14
    lg:pt-[125px]
    xl:px-10
  "
>
  <div className="mx-auto max-w-[1380px]">

    {/* Breadcrumb */}

    <div
      className="
        mb-9
        flex
        flex-wrap
        items-center
        gap-3
        text-[10px]
        font-medium
        uppercase
        tracking-[0.18em]
        text-[#171512]/45
        sm:text-[12px]
      "
    >
      <Link
        href="/"
        className="hover:text-[#171512]"
      >
        Haute Living
      </Link>

      <span>/</span>

      <Link
        href="/collections"
        className="hover:text-[#171512]"
      >
        All Collections
      </Link>

      <span>/</span>

      <span className="text-[#765A32]">
        Curated Edition 2025
      </span>
    </div>

    {/* Main Header */}

    <div
      className="
        grid
        gap-10
        lg:grid-cols-[minmax(0,1fr)_auto]
        lg:items-end
      "
    >
      <div>

        {/* Eyebrow */}

        <p
          className="
            mb-5
            text-[10px]
            font-medium
            uppercase
            tracking-[0.25em]
            text-[#765A32]
            sm:text-[11px]
          "
        >
          Architectural Masterworks
        </p>

        {/* Main Heading */}

        <h1
          className="
            max-w-[950px]
            font-serif
            text-[50px]
            font-normal
            leading-[0.95]
            tracking-[-0.045em]
            sm:text-[60px]
            md:text-[70px]
            lg:text-[82px]
            xl:text-[88px]
          "
        >
          Permanent Collections
          <br />
          &amp; Haute Living
          <br className="sm:hidden" />
          Suites
        </h1>

        {/* Description */}

    <p
  className="
    mt-7
    max-w-[700px]
    text-[20px]
    leading-[1.7]
    text-[#171512]/55
    sm:text-[20px]
    sm:leading-[1.7]
  "
>
  Handcrafted furniture shaped by natural teak,
  honed travertine, premium fabrics and refined
  metalwork. Sculptural silhouettes conceived to
  bring grandeur, comfort and enduring character
  to sophisticated spaces.
</p>

      </div>

      {/* Availability */}

      <div
        className="
          flex
          items-center
          gap-6
          lg:pb-3
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            rounded-full
            bg-[#EEEAE2]
            px-5
            py-3
          "
        >
          <span
            className="
              h-2
              w-2
              rounded-full
              bg-[#765A32]
            "
          />

          <span
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-[#765A32]
              sm:text-[10px]
            "
          >
            Atelier Guild Capacity:
            Available
          </span>
        </div>

        <span
          className="
            whitespace-nowrap
            text-[11px]
            tracking-[0.08em]
            text-[#171512]/70
            sm:text-[12px]
          "
        >
          {filteredProducts.length || 0}{" "}
          Bespoke Pieces
        </span>
      </div>
    </div>
  </div>
</section>

      {/* ===================================================
          CATEGORY FILTER
      ==================================================== */}

      <section
  className="
    overflow-hidden
    border-b
    border-[#171512]/10
    bg-[#F7F4EE]
    px-5
    py-5
    sm:px-8
    sm:py-6
    lg:px-12
    lg:py-7
    xl:px-16
  "
>
  <div
    className="
      mx-auto
      flex
      max-w-[1380px]
      gap-3
      overflow-x-auto
      pb-1
      scrollbar-hide
    "
  >
  {categories.map((category) => {
  const active = activeCategory === category.value;

  return (
   <button
  key={category.value}
  type="button"
  onClick={() => changeCategory(category.value)}
  className={`
    group relative
    flex shrink-0
    items-center justify-center
    gap-3
    overflow-hidden
    rounded-full
    border
    px-7
    py-3.5
    text-[11px]
    font-medium
    uppercase
    tracking-[0.16em]
    transition-all
    duration-500
    ease-[cubic-bezier(0.22,1,0.36,1)]
    sm:px-8
    sm:py-4
    sm:text-[12px]

    ${
      active
        ? `
          border-[#171512]
          bg-[#171512]
          text-white
          shadow-[0_8px_25px_rgba(23,21,18,0.12)]
        `
        : `
          border-[#171512]/10
          bg-[#F0EDE6]
          text-[#171512]/60
          hover:-translate-y-[1px]
          hover:border-[#765A32]/40
          hover:bg-[#EAE5DC]
          hover:text-[#171512]
          hover:shadow-[0_8px_22px_rgba(23,21,18,0.06)]
        `
    }
  `}
>
  {/* Subtle active/hover shine */}
  <span
    className={`
      pointer-events-none
      absolute inset-0
      bg-gradient-to-r
      from-transparent
      via-white/[0.06]
      to-transparent
      transition-transform
      duration-700
      ${
        active
          ? "translate-x-0"
          : "-translate-x-full group-hover:translate-x-full"
      }
    `}
  />

  <span className="relative z-10 whitespace-nowrap">
    {category.label}
  </span>

  {category.value === "all" && (
    <span
      className={`
        relative z-10
        flex
        min-w-[24px]
        items-center
        justify-center
        rounded-full
        px-1.5
        py-0.5
        text-[9px]
        tracking-normal
        ${
          active
            ? "bg-white/10 text-white/65"
            : "bg-[#171512]/[0.05] text-[#171512]/35"
        }
      `}
    >
      {products.length}
    </span>
  )}
</button> 

  );
})}
  </div>
</section>

      {/* ===================================================
          MATERIAL PALETTE + SORT
      ==================================================== */}

      <section className="px-5 py-7 sm:px-8 lg:px-12 xl:px-16">
        <div
          className="
            mx-auto
            flex
            max-w-[1380px]
            flex-col
            gap-6
            rounded-[3px]
            bg-[#F0EDE6]
            px-5
            py-5
            sm:px-6
            lg:flex-row
            lg:items-center
            lg:justify-between
            lg:px-7
          "
        >
          {/* Materials */}

          <div>
            <p
              className="
                mb-3
                text-[10px]
                font-medium
                uppercase
                tracking-[0.25em]
                text-[#765A32]
              "
            >
              Material Palette
            </p>

            <div
              className="
                flex
                flex-wrap
                gap-2
              "
            >
              {materials.map((material) => {
                const active =
                  activeMaterial === material;

                return (
                  <button
                    key={material}
                    type="button"
                    onClick={() =>
                      changeMaterial(material)
                    }
                    className={`
                      border
                      px-3
                      py-2
                      text-[10px]
                      transition-all
                      duration-300
                      ${
                        active
                          ? "border-[#765A32] bg-[#765A32] text-white"
                          : "border-[#171512]/10 bg-[#F7F4EE] text-[#171512]/60 hover:border-[#765A32]/50"
                      }
                    `}
                  >
                    {material}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.2em]
                text-[#171512]/50
              "
            >
              Sort
            </span>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(event) => {
                  setSortBy(event.target.value);
                  setCurrentPage(1);
                }}
                className="
                  appearance-none
                  border
                  border-[#171512]/10
                  bg-[#F7F4EE]
                  py-2.5
                  pl-4
                  pr-10
                  text-[10px]
                  text-[#171512]/75
                  outline-none
                "
              >
                <option value="curated">
                  Curated Heritage Order
                </option>

                <option value="price-low">
                  Price — Low to High
                </option>

                <option value="price-high">
                  Price — High to Low
                </option>
              </select>

              <ArrowDown
                size={11}
                strokeWidth={1.2}
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-[#171512]/50
                "
              />
            </div>

            <button
              type="button"
              className="
                hidden
                items-center
                gap-2
                border
                border-[#765A32]/20
                bg-[#F4E4C8]
                px-4
                py-2.5
                text-[10px]
                font-medium
                uppercase
                tracking-[0.14em]
                text-[#765A32]
                lg:flex
              "
            >
              <Sparkles
                size={10}
                strokeWidth={1.2}
              />

              Show Concierge Plan
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================
          PRODUCT GRID
      ==================================================== */}

      <section
        className="
          px-5
          pb-20
          sm:px-8
          lg:px-12
          xl:px-16
        "
      >
        <div className="mx-auto max-w-[1380px]">

          {visibleProducts.length > 0 ? (
            <div
              className="
                grid
                grid-cols-1
                gap-8
                sm:grid-cols-2
                lg:grid-cols-3
                lg:gap-7
                xl:gap-8
              "
            >
              {visibleProducts.map(
                (product, index) => (
                  <CollectionProductCard
                    key={`${product.slug}-${index}`}
                    product={product}
                  />
                )
              )}
            </div>
          ) : (
            <div
              className="
                flex
                min-h-[300px]
                items-center
                justify-center
                border
                border-[#171512]/10
                bg-[#F0EDE6]
              "
            >
              <div className="text-center">
                <p
                  className="
                    font-serif
                    text-[30px]
                  "
                >
                  No pieces found
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("all");
                    setActiveMaterial(
                      "All Materials"
                    );
                  }}
                  className="
                    mt-5
                    text-[10px]
                    uppercase
                    tracking-[0.2em]
                    text-[#765A32]
                    underline
                    underline-offset-4
                  "
                >
                  Reset Collection
                </button>
              </div>
            </div>
          )}

          {/* =================================================
              PAGINATION
          ================================================== */}

          <div
            className="
              mt-12
              flex
              flex-col
              gap-5
              border-t
              border-[#171512]/10
              bg-[#F0EDE6]
              px-5
              py-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-center gap-4">
              <span
                className="
                  text-[9px]
                  text-[#171512]/70
                "
              >
                Showing{" "}
                {filteredProducts.length
                  ? startIndex + 1
                  : 0}
                {" – "}
                {Math.min(
                  startIndex +
                    visibleProducts.length,
                  filteredProducts.length
                )}{" "}
                of{" "}
                {filteredProducts.length}{" "}
                Pieces
              </span>

              <span
                className="
                  hidden
                  h-[2px]
                  w-20
                  bg-[#171512]/10
                  sm:block
                "
              >
                <span
                  className="block h-full bg-[#765A32]"
                  style={{
                    width: `${
                      filteredProducts.length
                        ? (visibleProducts.length /
                            filteredProducts.length) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </span>
            </div>

            <div
              className="
                flex
                items-center
                gap-4
              "
            >
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.max(1, page - 1)
                  )
                }
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-[#E9E5DD]
                  text-[#171512]
                  transition-all
                  hover:bg-[#171512]
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
              >
                <ChevronLeft
                  size={14}
                  strokeWidth={1.2}
                />
              </button>

              <span
                className="
                  text-[10px]
                  font-medium
                  tracking-[0.2em]
                "
              >
                {String(safePage).padStart(
                  2,
                  "0"
                )}{" "}
                /{" "}
                {String(totalPages).padStart(
                  2,
                  "0"
                )}
              </span>

              <button
                type="button"
                disabled={
                  safePage >= totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    (page) =>
                      Math.min(
                        totalPages,
                        page + 1
                      )
                  )
                }
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-[#E9E5DD]
                  text-[#171512]
                  transition-all
                  hover:bg-[#171512]
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
              >
                <ChevronRight
                  size={14}
                  strokeWidth={1.2}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          MATERIAL ARCHIVES
      ==================================================== */}

      <section
        className="
          px-5
          pb-20
          sm:px-8
          lg:px-12
          lg:pb-28
          xl:px-16
        "
      >
        <div
          className="
            mx-auto
            max-w-[1380px]
            rounded-[4px]
            bg-[#F0EDE6]
            p-6
            sm:p-8
            lg:p-10
            xl:p-12
          "
        >
          <div
            className="
              grid
              gap-10
              lg:grid-cols-[0.9fr_1.1fr]
              lg:items-center
            "
          >
            {/* LEFT */}

            <div>
              <p
                className="
                  mb-5
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.25em]
                  text-[#765A32]
                "
              >
                The Material Archives
              </p>

              <h2
                className="
                  max-w-[500px]
                  font-serif
                  text-[32px]
                  font-normal
                  leading-[1.02]
                  tracking-[-0.035em]
                  sm:text-[38px]
                "
              >
                Authentic Provenance
                <br />
                &amp; Tactile Mastery
              </h2>

              <p
                className="
                  mt-5
                  max-w-[520px]
                  text-[11px]
                  leading-6
                  text-[#171512]/55
                  sm:text-[11px]
                "
              >
                Every piece in the NIRA living
                collection begins in selected
                quarries and sustainable forests.
                We invite discerning clients to
                understand the materials that give
                each piece its character.
              </p>

              <div className="mt-6 space-y-3">
                <MaterialPoint>
                  Century Teak Crafting — Timber
                  seasoned in low-humidity kilns
                  for deep tonal character.
                </MaterialPoint>

                <MaterialPoint>
                  100% Travertine Vein Matching —
                  Hand-cut blocks selected for
                  continuous directional veins.
                </MaterialPoint>
              </div>

              <button
                type="button"
                className="
                  mt-7
                  inline-flex
                  items-center
                  gap-4
                  bg-[#171512]
                  px-5
                  py-3
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.16em]
                  text-white
                  transition-colors
                  hover:bg-[#765A32]
                "
              >
                Order Material
                Archive Kit

                <ArrowRight
                  size={11}
                  strokeWidth={1}
                />
              </button>
            </div>

            {/* MATERIAL CARDS */}

            <div
              className="
                grid
                grid-cols-3
                gap-3
              "
            >
              <MaterialCard
                image="/material-stone.jpg"
                eyebrow="STONE"
                title="Honed Tivoli Travertine"
                description="Natural open pores, wax-buffed finish."
              />

              <MaterialCard
                image="/material-fabric.jpg"
                eyebrow="TEXTURE"
                title="Bouclé & Wool"
                description="Soft tactile fibres selected for comfort."
              />

              <MaterialCard
                image="/material-wood.jpg"
                eyebrow="TIMBER"
                title="Aged Hardwood Teak"
                description="High natural resin, weather resistant."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          ARCHITECTURAL GUILD CTA
      ==================================================== */}

      <section className="px-5 pb-24 sm:px-8 lg:px-12 xl:px-16">
        <div
          className="
            relative
            mx-auto
            max-w-[1380px]
            overflow-hidden
            rounded-[5px]
            bg-[#100E0B]
            px-7
            py-12
            text-white
            sm:px-10
            lg:px-12
            lg:py-14
          "
        >
          {/* Glow */}

          <div
            className="
              pointer-events-none
              absolute
              right-[-100px]
              top-[-150px]
              h-[400px]
              w-[400px]
              rounded-full
              bg-[#765A32]/15
              blur-[100px]
            "
          />

          <div
            className="
              relative
              grid
              gap-10
              lg:grid-cols-[1fr_auto]
              lg:items-center
            "
          >
            <div>
              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#D0B27A]/20
                  bg-[#D0B27A]/5
                  px-3
                  py-1.5
                "
              >
                <span className="h-1 w-1 rounded-full bg-[#D0B27A]" />

                <span
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-[#D0B27A]
                  "
                >
                  Architectural Guild Desk
                </span>
              </div>

              <h2
                className="
                  max-w-[700px]
                  font-serif
                  text-[30px]
                  font-normal
                  leading-[1.05]
                  tracking-[-0.025em]
                  sm:text-[38px]
                "
              >
                Cannot find your exact
                architectural specifications?
              </h2>

              <p
                className="
                  mt-5
                  max-w-[700px]
                  text-[10px]
                  leading-6
                  text-white/45
                  sm:text-[11px]
                "
              >
                Our bespoke dimensional guild
                can tailor any piece in our
                catalogue to the millimetre.
                From sectional layouts to
                hospitality specifications,
                every commission is developed
                around your space.
              </p>

              <div
                className="
                  mt-6
                  flex
                  flex-wrap
                  gap-x-7
                  gap-y-3
                  text-[10px]
                  uppercase
                  tracking-[0.14em]
                  text-white/50
                "
              >
                <span>
                  ◇ CAD / BIM Models Supplied
                </span>

                <span>
                  ◇ Dedicated Private Architect Partner
                </span>

                <span>
                  ◇ Global White-Glove Installation
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/custom-furniture"
                className="
                  inline-flex
                  items-center
                  gap-3
                  bg-[#F4D8AD]
                  px-6
                  py-3.5
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.15em]
                  text-[#171512]
                  transition-colors
                  hover:bg-white
                "
              >
                Bespoke Commission

                <ArrowRight
                  size={12}
                  strokeWidth={1.1}
                />
              </Link>

              <Link
                href="/materials"
                className="
                  inline-flex
                  items-center
                  gap-3
                  bg-white/5
                  px-6
                  py-3.5
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.15em]
                  text-white/80
                  transition-colors
                  hover:bg-white/10
                "
              >
                View Provenance
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          FOOTER
      ==================================================== */}

  
    </main>
  );
}


/* =========================================================
   PRODUCT CARD
========================================================= */

function CollectionProductCard({
  product,
}: {
  product: Product;
}) {
  const image =
    product.image ||
    product.images?.[0] ||
    "/placeholder.jpg";

  const category =
    product.category ||
    "NIRA COLLECTION";

  const material =
    product.material ||
    inferMaterial(product);

  const price =
    typeof product.price === "number"
      ? `₹${product.price.toLocaleString(
          "en-IN"
        )}`
      : product.price ||
        "Price on Request";

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-[5px]
        bg-[#F0EDE6]
      "
    >
      {/* Image */}

      <Link
        href={`/products/${product.slug}`}
        className="
          relative
          block
          aspect-[1.22/1]
          overflow-hidden
          bg-[#DDD8CE]
        "
      >
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="
            (min-width: 1280px) 31vw,
            (min-width: 1024px) 30vw,
            (min-width: 640px) 48vw,
            100vw
          "
          className="
            object-cover
            transition-transform
            duration-700
            ease-[cubic-bezier(0.22,1,0.36,1)]
            group-hover:scale-[1.045]
          "
        />

        {/* Image gradient */}

        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-24
            bg-gradient-to-t
            from-black/35
            to-transparent
          "
        />

        {/* Top badge */}

        <div
          className="
            absolute
            left-3
            top-3
            bg-[#F7F4EE]/95
            px-3
            py-2
          "
        >
          <span
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.14em]
              text-[#765A32]
            "
          >
            {category}
          </span>
        </div>

        {/* Second badge */}

        <div
          className="
            absolute
            left-3
            top-[43px]
            bg-[#F4E4C8]/95
            px-3
            py-2
          "
        >
          <span
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.12em]
              text-[#765A32]
            "
          >
            White-Glove
            Delivery
          </span>
        </div>

        {/* Wishlist */}

        <button
          type="button"
          aria-label={`Save ${product.name}`}
          onClick={(event) =>
            event.preventDefault()
          }
          className="
            absolute
            right-3
            top-3
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-[#F7F4EE]/90
            text-[#171512]
            backdrop-blur-sm
            transition-all
            hover:bg-[#171512]
            hover:text-white
          "
        >
          <Heart
            size={13}
            strokeWidth={1.2}
          />
        </button>

        {/* Dimensions / availability */}

        <div
          className="
            absolute
            inset-x-3
            bottom-3
            flex
            items-center
            justify-between
            gap-3
            bg-black/50
            px-3
            py-2
            text-[10px]
            uppercase
            tracking-[0.12em]
            text-white
            backdrop-blur-sm
          "
        >
          <span>
            W 240cm × D 115cm × H 78cm
          </span>

          <span>
            {category
              .toLowerCase()
              .includes("outdoor")
              ? "Atelier Crafted"
              : "Made to Order"}
          </span>
        </div>
      </Link>

      {/* Details */}

      <div className="px-5 pb-5 pt-5 sm:px-6">

        {/* Meta */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <span
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-[#765A32]
            "
          >
            {category}
          </span>

          <span
            className="
              text-[10px]
              text-[#171512]/40
            "
          >
            ● FSC® Aged Teak
          </span>
        </div>

        {/* Name */}

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
            transition-opacity
            hover:opacity-60
            sm:text-[26px]
          "
        >
          {product.name}
        </Link>

        {/* Description */}

        <p
          className="
            mt-3
            line-clamp-2
            min-h-[40px]
            text-[9px]
            leading-5
            text-[#171512]/50
          "
        >
          {product.description ||
            "Thoughtfully crafted from exceptional materials for refined residential and hospitality spaces."}
        </p>

        {/* Material chips */}

        <div
          className="
            mt-4
            flex
            flex-wrap
            gap-1.5
          "
        >
          <span
            className="
              border
              border-[#171512]/10
              bg-[#F7F4EE]
              px-2
              py-1
              text-[9px]
              uppercase
              tracking-[0.1em]
              text-[#171512]/55
            "
          >
            {material}
          </span>

          <span
            className="
              border
              border-[#171512]/10
              bg-[#F7F4EE]
              px-2
              py-1
              text-[9px]
              uppercase
              tracking-[0.1em]
              text-[#171512]/55
            "
          >
            Hand Finished
          </span>

          <span
            className="
              border
              border-[#171512]/10
              bg-[#F7F4EE]
              px-2
              py-1
              text-[9px]
              uppercase
              tracking-[0.1em]
              text-[#171512]/55
            "
          >
            Made to Order
          </span>
        </div>

        {/* Price */}

        <div
          className="
            mt-6
            flex
            items-end
            justify-between
            gap-4
            border-t
            border-[#171512]/10
            pt-4
          "
        >
          <div>
            <p
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.15em]
                text-[#765A32]
              "
            >
              Acquisition Value
            </p>

            <p
              className="
                mt-1
                text-[13px]
                font-medium
                text-[#171512]
              "
            >
              {price}
            </p>
          </div>

          <div className="text-right">
            <p
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.15em]
                text-[#765A32]
              "
            >
              Concierge Desk
            </p>

            <p
              className="
                mt-1
                text-[10px]
                text-[#171512]/55
              "
            >
              12 month plan
            </p>
          </div>
        </div>

        {/* Actions */}

        <div
          className="
            mt-4
            grid
            grid-cols-[1fr_auto]
            gap-2
          "
        >
          <Link
            href={`/products/${product.slug}`}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              bg-[#171512]
              px-4
              py-3
              text-[10px]
              font-medium
              uppercase
              tracking-[0.13em]
              text-white
              transition-colors
              hover:bg-[#765A32]
            "
          >
            Inquire Piece

            <ArrowRight
              size={10}
              strokeWidth={1}
            />
          </Link>

          <Link
            href="/contact"
            className="
              inline-flex
              items-center
              justify-center
              border
              border-[#171512]/10
              bg-[#F7F4EE]
              px-3
              py-3
              text-center
              text-[9px]
              font-medium
              uppercase
              tracking-[0.1em]
              text-[#171512]/70
              transition-colors
              hover:border-[#171512]/30
            "
          >
            Request
            <br />
            Swatches
          </Link>
        </div>
      </div>
    </article>
  );
}


/* =========================================================
   MATERIAL POINT
========================================================= */

function MaterialPoint({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        flex
        gap-3
        text-[10px]
        leading-5
        text-[#171512]/65
      "
    >
      <span className="mt-1 text-[#765A32]">
        ◇
      </span>

      <span>{children}</span>
    </div>
  );
}


/* =========================================================
   MATERIAL CARD
========================================================= */

function MaterialCard({
  image,
  eyebrow,
  title,
  description,
}: {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        overflow-hidden
        rounded-[4px]
        bg-[#F7F4EE]
      "
    >
      <div
        className="
          relative
          aspect-square
          overflow-hidden
        "
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1024px) 20vw, 30vw"
          className="
            object-cover
            transition-transform
            duration-700
            hover:scale-[1.04]
          "
        />
      </div>

      <div className="p-3 sm:p-4">
        <p
          className="
            text-[9px]
            uppercase
            tracking-[0.18em]
            text-[#765A32]
          "
        >
          {eyebrow}
        </p>

        <h3
          className="
            mt-2
            font-serif
            text-[13px]
            leading-[1.1]
            sm:text-[15px]
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-2
            text-[10px]
            leading-4
            text-[#171512]/45
            sm:text-[10px]
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}


/* =========================================================
   FOOTER COLUMN
========================================================= */

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p
        className="
          mb-5
          text-[10px]
          font-medium
          uppercase
          tracking-[0.2em]
          text-[#765A32]
        "
      >
        {title}
      </p>

      <div className="space-y-2.5">
        {children}
      </div>
    </div>
  );
}


/* =========================================================
   FOOTER ITEM
========================================================= */

function FooterItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span
      className="
        block
        text-[10px]
        leading-4
        text-[#171512]/55
      "
    >
      {children}
    </span>
  );
}


/* =========================================================
   MATERIAL INFERENCE
========================================================= */

function inferMaterial(product: Product) {
  const text = `
    ${product.name}
    ${product.description}
  `.toLowerCase();

  if (text.includes("teak")) {
    return "Aged Teak";
  }

  if (text.includes("travertine")) {
    return "Travertine";
  }

  if (
    text.includes("boucle") ||
    text.includes("bouclé")
  ) {
    return "Pure Bouclé";
  }

  if (
    text.includes("walnut")
  ) {
    return "Fumed Walnut";
  }

  if (
    text.includes("cord")
  ) {
    return "Braided Cord";
  }

  return "Premium Finish";
}