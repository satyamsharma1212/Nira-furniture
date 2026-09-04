import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { furnitureCategories } from "@/data/categories";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const outdoorCollection = furnitureCategories.find(
  (category) => category.slug === "outdoor-furniture"
);

export const metadata = {
  title: "Outdoor Furniture",
  description:
    "Explore NIRA Furniture's premium outdoor furniture collection, crafted in India for luxury residences, hospitality spaces and contemporary outdoor living.",
};

export default function OutdoorFurniturePage() {
  const outdoorProducts = products.filter(
    (product) =>
      product.category === "Outdoor Furniture" && product.active
  );

  return (
    <main className="bg-[#FAF8F2] text-[#241F18]">

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="relative overflow-hidden border-b border-[#B8860B]/15 pt-[90px]">

        <div className="mx-auto grid min-h-[620px] max-w-[1480px] lg:grid-cols-2">

          {/* Content */}
          <div className="flex items-center px-6 py-20 sm:px-10 lg:px-16 lg:py-24">

            <div className="max-w-xl">

              <div className="mb-7 flex items-center gap-4">
                <span className="h-px w-14 bg-[#B8860B]" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
                  NIRA Collection
                </span>
              </div>

              <h1 className="font-serif text-5xl font-normal leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Outdoor
                <br />

                <span className="italic text-[#B8860B]">
                  Furniture.
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-sm leading-7 text-[#756B5B] sm:text-[15px]">
                Designed to bring comfort, character and refined
                aesthetics to outdoor spaces. Discover furniture
                crafted for beautiful moments under the open sky.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">

                <Link
                  href="#collections"
                  className="group inline-flex min-h-12 items-center gap-3 border border-[#B8860B] bg-[#B8860B] px-6 text-[10px] font-bold uppercase tracking-[0.17em] text-white transition-all duration-300 hover:bg-[#241F18] hover:border-[#241F18]"
                >
                  Explore Collection

                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/custom-furniture"
                  className="inline-flex min-h-12 items-center border border-[#B8860B]/35 bg-white/60 px-6 text-[10px] font-bold uppercase tracking-[0.17em] text-[#5D5549] transition-all duration-300 hover:border-[#B8860B] hover:text-[#B8860B]"
                >
                  Custom Furniture
                </Link>

              </div>

            </div>
          </div>

          {/* Hero Image */}
          <div className="relative min-h-[420px] lg:min-h-full">

            <Image
              src="/hero/nira-hero.jpg"
              alt="NIRA premium outdoor furniture"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-linear-to-r from-[#FAF8F2] via-transparent to-transparent lg:block" />

            <div className="absolute bottom-6 left-6 border border-white/40 bg-black/20 px-5 py-4 backdrop-blur-md sm:left-10">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/70">
                Premium Outdoor Living
              </p>

              <p className="mt-1 font-serif text-lg text-white">
                Crafted in India
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* ================================================= */}
      {/* INTRO */}
      {/* ================================================= */}

      <section className="border-b border-[#241F18]/10 bg-white">

        <div className="mx-auto max-w-[1200px] px-6 py-16 text-center sm:px-10 lg:py-20">

          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#B8860B]">
            The Outdoor Collection
          </p>

          <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
            Designed for the
            <span className="italic text-[#B8860B]">
              {" "}open air.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#756B5B]">
            From sophisticated lounge settings to relaxed poolside
            retreats, every NIRA outdoor piece combines contemporary
            design, comfort and enduring craftsmanship.
          </p>

        </div>
      </section>


      {/* ================================================= */}
      {/* CATEGORIES */}
      {/* ================================================= */}

      <section
        id="collections"
        className="mx-auto max-w-[1480px] px-6 py-20 sm:px-10 lg:px-16 lg:py-28"
      >

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#B8860B]">
              Explore Categories
            </p>

            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
              Outdoor Collections
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-[#756B5B] md:text-right">
            Discover carefully designed pieces for terraces,
            gardens, balconies, resorts and hospitality spaces.
          </p>

        </div>


        {/* Category Grid */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">

          {outdoorCollection?.subcategories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/outdoor-furniture/${category.slug}`}
              className="group relative min-h-[190px] overflow-hidden border border-[#B8860B]/15 bg-[#F7F3EA] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[#B8860B]/50 hover:shadow-[0_20px_45px_rgba(80,60,20,0.10)] sm:min-h-[220px] sm:p-6"
            >

              {/* Number */}
              <span className="absolute right-5 top-5 font-serif text-3xl text-[#B8860B]/15 transition-colors duration-300 group-hover:text-[#B8860B]/30">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Gold detail */}
              <div className="absolute left-0 top-0 h-px w-0 bg-[#B8860B] transition-all duration-500 group-hover:w-full" />

              <div className="flex h-full flex-col justify-end">

                <span className="mb-4 h-px w-8 bg-[#B8860B] transition-all duration-300 group-hover:w-12" />

                <h3 className="max-w-[180px] font-serif text-xl leading-tight text-[#241F18] sm:text-2xl">
                  {category.name}
                </h3>

                <div className="mt-4 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#8A8174] transition-colors duration-300 group-hover:text-[#B8860B]">
                  Explore

                  <ArrowUpRight
                    size={13}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>

              </div>
            </Link>
          ))}

        </div>
      </section>


      {/* ================================================= */}
      {/* PRODUCTS */}
      {/* ================================================= */}

      {outdoorProducts.length > 0 && (
        <section className="border-t border-[#241F18]/10 bg-white">

          <div className="mx-auto max-w-[1480px] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">

            <div className="flex items-end justify-between gap-6">

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#B8860B]">
                  Featured Pieces
                </p>

                <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                  Selected Outdoor Furniture
                </h2>
              </div>

              <Link
                href="/collections"
                className="hidden items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#B8860B] transition-colors hover:text-[#8A5F08] sm:flex"
              >
                View All
                <ArrowRight size={14} />
              </Link>

            </div>


            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {outdoorProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}

            </div>

          </div>
        </section>
      )}


      {/* ================================================= */}
      {/* CUSTOM CTA */}
      {/* ================================================= */}

      <section className="bg-[#241F18]">

        <div className="mx-auto max-w-[1200px] px-6 py-20 text-center sm:px-10 lg:py-24">

          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#E0B84F]">
            Made For Your Space
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl font-serif text-3xl leading-tight text-[#FAF8F2] sm:text-4xl lg:text-5xl">
            Your Space.
            <br />

            <span className="italic text-[#E0B84F]">
              Your Design. Your Furniture.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#FAF8F2]/60">
            Create a piece that fits your dimensions, materials,
            fabrics, colours and design requirements.
          </p>

          <Link
            href="/custom-furniture"
            className="mt-8 inline-flex min-h-13 items-center gap-3 border border-[#E0B84F] bg-[#E0B84F] px-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#241F18] transition-all duration-300 hover:bg-transparent hover:text-[#E0B84F]"
          >
            Explore Custom Furniture
            <ArrowRight size={15} />
          </Link>

        </div>
      </section>

    </main>
  );
}