import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, SlidersHorizontal } from "lucide-react";
import { notFound } from "next/navigation";

import { furnitureCategories } from "@/data/categories";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

type PageProps = {
  params: Promise<{
    category: string;
  }>;
};

export async function generateStaticParams() {
  const outdoorCategory = furnitureCategories.find(
    (category) => category.slug === "outdoor-furniture"
  );

  return (
    outdoorCategory?.subcategories.map((category) => ({
      category: category.slug,
    })) ?? []
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { category: categorySlug } = await params;

  const outdoorCategory = furnitureCategories.find(
    (category) => category.slug === "outdoor-furniture"
  );

  const category = outdoorCategory?.subcategories.find(
    (item) => item.slug === categorySlug
  );

  if (!category) {
    return {
      title: "Outdoor Furniture | NIRA Furniture",
    };
  }

  return {
    title: `${category.name} | NIRA Furniture`,
    description: `Explore premium ${category.name.toLowerCase()} from NIRA Furniture. Crafted in India with refined design, comfort and enduring craftsmanship.`,
  };
}

export default async function OutdoorCategoryPage({
  params,
}: PageProps) {
  const { category: categorySlug } = await params;

  const outdoorCategory = furnitureCategories.find(
    (category) => category.slug === "outdoor-furniture"
  );

  const category = outdoorCategory?.subcategories.find(
    (item) => item.slug === categorySlug
  );

  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter(
    (product) =>
      product.active &&
      product.category === "Outdoor Furniture" &&
      product.subcategory === category.name
  );

  return (
    <main className="min-h-screen bg-[#FAF8F2] text-[#241F18]">

      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <section className="border-b border-[#B8860B]/15 pt-[90px]">

        <div className="mx-auto grid max-w-[1480px] lg:grid-cols-[0.85fr_1.15fr]">

          {/* Content */}
          <div className="flex items-center px-6 py-16 sm:px-10 lg:px-16 lg:py-24">

            <div className="max-w-xl">

              {/* Breadcrumb */}
              <div className="mb-8 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8A8174]">

                <Link
                  href="/outdoor-furniture"
                  className="transition-colors hover:text-[#B8860B]"
                >
                  Outdoor Furniture
                </Link>

                <span className="text-[#B8860B]">
                  /
                </span>

                <span className="text-[#B8860B]">
                  {category.name}
                </span>

              </div>

              {/* Eyebrow */}
              <div className="mb-6 flex items-center gap-4">

                <span className="h-px w-12 bg-[#B8860B]" />

                <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#B8860B]">
                  NIRA Outdoor Collection
                </span>

              </div>

              {/* Heading */}
              <h1 className="font-serif text-5xl font-normal leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">

                {category.name}

                <span className="mt-3 block font-serif text-2xl font-normal italic text-[#B8860B] sm:text-3xl">
                  Collection
                </span>

              </h1>

              {/* Description */}
              <p className="mt-7 max-w-lg text-sm leading-7 text-[#756B5B] sm:text-[15px]">
                Discover thoughtfully designed {category.name.toLowerCase()}
                created for refined outdoor spaces, combining comfort,
                contemporary aesthetics and lasting craftsmanship.
              </p>

              {/* Details */}
              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 border-t border-[#241F18]/10 pt-6">

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">
                    Crafted
                  </p>
                  <p className="mt-1 text-[11px] text-[#756B5B]">
                    In India
                  </p>
                </div>

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">
                    Custom
                  </p>
                  <p className="mt-1 text-[11px] text-[#756B5B]">
                    Available
                  </p>
                </div>

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">
                    Delivery
                  </p>
                  <p className="mt-1 text-[11px] text-[#756B5B]">
                    Pan-India
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* Image */}
          <div className="relative min-h-[420px] overflow-hidden lg:min-h-[590px]">

            <Image
              src="/hero/nira-hero.jpg"
              alt={`NIRA ${category.name}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 hover:scale-[1.02]"
            />

            <div className="absolute inset-0 bg-linear-to-r from-[#FAF8F2] via-transparent to-transparent opacity-80 lg:opacity-100" />

            {/* Image label */}
            <div className="absolute bottom-7 right-7 border border-white/30 bg-black/20 px-5 py-4 backdrop-blur-md">

              <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-white/70">
                NIRA Furniture
              </p>

              <p className="mt-1 font-serif text-lg text-white">
                Outdoor Living
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* ================================================= */}
      {/* PRODUCT SECTION */}
      {/* ================================================= */}

      <section className="mx-auto max-w-[1480px] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">

        {/* Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-[#241F18]/10 pb-8 md:flex-row md:items-end">

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#B8860B]">
              NIRA Collection
            </p>

            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
              {category.name}
            </h2>

          </div>

          <div className="flex items-center gap-4">

            <span className="text-[10px] uppercase tracking-[0.15em] text-[#8A8174]">
              {categoryProducts.length}{" "}
              {categoryProducts.length === 1
                ? "Piece"
                : "Pieces"}
            </span>

            <button
              type="button"
              className="flex h-10 items-center gap-2 border border-[#B8860B]/25 bg-white px-4 text-[9px] font-bold uppercase tracking-[0.15em] text-[#5D5549] transition-all duration-300 hover:border-[#B8860B] hover:text-[#B8860B]"
            >
              <SlidersHorizontal size={14} />
              Filter
            </button>

          </div>

        </div>


        {/* ================================================= */}
        {/* PRODUCTS */}
        {/* ================================================= */}

        {categoryProducts.length > 0 ? (

          <div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {categoryProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>

        ) : (

          /* Empty state */
          <div className="flex min-h-[360px] flex-col items-center justify-center border border-[#B8860B]/15 bg-white px-6 text-center">

            <span className="font-serif text-5xl italic text-[#B8860B]/25">
              N
            </span>

            <h3 className="mt-4 font-serif text-2xl">
              Collection Coming Soon
            </h3>

            <p className="mt-3 max-w-md text-sm leading-6 text-[#756B5B]">
              We are currently curating pieces for this collection.
              Contact our team for custom requirements or upcoming
              designs.
            </p>

            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-3 border border-[#B8860B] bg-[#B8860B] px-6 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#241F18] hover:border-[#241F18]"
            >
              Enquire Now
              <ArrowRight size={14} />
            </Link>

          </div>

        )}

      </section>


      {/* ================================================= */}
      {/* BACK TO COLLECTION */}
      {/* ================================================= */}

      <section className="border-t border-[#241F18]/10 bg-white">

        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-6 py-7 sm:px-10 lg:px-16">

          <Link
            href="/outdoor-furniture"
            className="group flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#756B5B] transition-colors hover:text-[#B8860B]"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            Back to Outdoor Furniture
          </Link>

          <Link
            href="/custom-furniture"
            className="group hidden items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#B8860B] sm:flex"
          >
            Customise Your Piece

            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

        </div>

      </section>

    </main>
  );
}