import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Ruler, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";

import { products } from "@/data/products";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return products
    .filter((product) => product.active)
    .map((product) => ({
      slug: product.slug,
    }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  const product = products.find(
    (item) => item.slug === slug && item.active
  );

  if (!product) {
    return {
      title: "Product | NIRA Furniture",
    };
  }

  return {
    title:
      product.seoTitle ||
      `${product.name} | NIRA Furniture`,
    description:
      product.seoDescription ||
      product.shortDescription,
  };
}

export default async function ProductPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const product = products.find(
    (item) => item.slug === slug && item.active
  );

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter(
      (item) =>
        item.active &&
        item.slug !== product.slug &&
        item.category === product.category
    )
    .slice(0, 4);

  const mainImage =
    product.images?.[0] || "/hero/nira-hero.jpg";

  return (
    <main className="min-h-screen bg-[#FAF8F2] text-[#241F18]">

      {/* ================================================= */}
      {/* PRODUCT */}
      {/* ================================================= */}

      <section className="border-b border-[#B8860B]/15 pt-[90px]">

        <div className="mx-auto max-w-[1480px] px-6 py-10 sm:px-10 lg:px-16 lg:py-16">

          {/* Breadcrumb */}
          <div className="mb-10 flex flex-wrap items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.17em] text-[#8A8174]">

            <Link
              href="/"
              className="hover:text-[#B8860B]"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              href={
                product.category === "Outdoor Furniture"
                  ? "/outdoor-furniture"
                  : "/indoor-furniture"
              }
              className="hover:text-[#B8860B]"
            >
              {product.category}
            </Link>

            <span>/</span>

            <span className="text-[#B8860B]">
              {product.name}
            </span>

          </div>


          {/* Main Grid */}
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 xl:gap-20">

            {/* ================================================= */}
            {/* IMAGE */}
            {/* ================================================= */}

            <div>

              <div className="relative aspect-[4/4.2] overflow-hidden bg-[#F1EDE3]">

                <Image
                  src={mainImage}
                  alt={
                    product.altText ||
                    product.name
                  }
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />

                {product.featured && (
                  <div className="absolute left-5 top-5 border border-[#B8860B]/40 bg-[#FAF8F2]/90 px-4 py-2 backdrop-blur-sm">
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#8A5F08]">
                      Featured Collection
                    </span>
                  </div>
                )}

              </div>


              {/* Image thumbnails */}
              {product.images &&
                product.images.length > 1 && (
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {product.images.map(
                      (image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="relative aspect-square overflow-hidden border border-[#241F18]/10 bg-[#F1EDE3]"
                        >
                          <Image
                            src={image}
                            alt={
                              product.altText ||
                              `${product.name} view ${index + 1}`
                            }
                            fill
                            sizes="150px"
                            className="object-cover"
                          />
                        </div>
                      )
                    )}
                  </div>
                )}

            </div>


            {/* ================================================= */}
            {/* PRODUCT INFORMATION */}
            {/* ================================================= */}

            <div className="flex flex-col justify-center">

              {/* Eyebrow */}
              <div className="mb-5 flex items-center gap-4">

                <span className="h-px w-12 bg-[#B8860B]" />

                <span className="text-[9px] font-bold uppercase tracking-[0.27em] text-[#B8860B]">
                  NIRA Furniture
                </span>

              </div>


              {/* Product Name */}
              <h1 className="max-w-2xl font-serif text-4xl font-normal leading-[1.05] tracking-[-0.025em] sm:text-5xl lg:text-6xl">
                {product.name}
              </h1>


              {/* Category */}
              {product.subcategory && (
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8A8174]">
                  {product.subcategory}
                </p>
              )}


              {/* Description */}
              <p className="mt-7 max-w-xl text-sm leading-7 text-[#756B5B]">
                {product.description}
              </p>


              {/* Short description */}
              {product.shortDescription && (
                <p className="mt-4 text-[12px] leading-6 text-[#8A8174]">
                  {product.shortDescription}
                </p>
              )}


              {/* Divider */}
              <div className="my-8 h-px bg-[#241F18]/10" />


              {/* Product Features */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-7">

                {/* Materials */}
                {product.materials &&
                  product.materials.length > 0 && (
                    <InfoBlock title="Materials">
                      {product.materials.map(
                        (material) => (
                          <p
                            key={material}
                            className="text-[11px] leading-5 text-[#5D5549]"
                          >
                            {material}
                          </p>
                        )
                      )}
                    </InfoBlock>
                  )}


                {/* Fabrics */}
                {product.fabrics &&
                  product.fabrics.length > 0 && (
                    <InfoBlock title="Fabrics">
                      {product.fabrics.map(
                        (fabric) => (
                          <p
                            key={fabric}
                            className="text-[11px] leading-5 text-[#5D5549]"
                          >
                            {fabric}
                          </p>
                        )
                      )}
                    </InfoBlock>
                  )}


                {/* Colours */}
                {product.colors &&
                  product.colors.length > 0 && (
                    <InfoBlock title="Colours">
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map(
                          (color) => (
                            <span
                              key={color}
                              className="border border-[#B8860B]/20 bg-white px-2.5 py-1 text-[10px] text-[#5D5549]"
                            >
                              {color}
                            </span>
                          )
                        )}
                      </div>
                    </InfoBlock>
                  )}


                {/* Dimensions */}
                {product.dimensions && (
                  <InfoBlock title="Dimensions">
                    <div className="space-y-1.5">

                      {product.dimensions.width && (
                        <p className="flex items-center gap-2 text-[11px] text-[#5D5549]">
                          <span className="text-[#B8860B]">
                            W
                          </span>
                          {product.dimensions.width}
                        </p>
                      )}

                      {product.dimensions.depth && (
                        <p className="flex items-center gap-2 text-[11px] text-[#5D5549]">
                          <span className="text-[#B8860B]">
                            D
                          </span>
                          {product.dimensions.depth}
                        </p>
                      )}

                      {product.dimensions.height && (
                        <p className="flex items-center gap-2 text-[11px] text-[#5D5549]">
                          <span className="text-[#B8860B]">
                            H
                          </span>
                          {product.dimensions.height}
                        </p>
                      )}

                    </div>
                  </InfoBlock>
                )}

              </div>


              {/* Customization */}
              {product.customization &&
                product.customization.length > 0 && (
                  <div className="mt-8 border-t border-[#241F18]/10 pt-7">

                    <div className="flex items-center gap-3">

                      <Ruler
                        size={17}
                        className="text-[#B8860B]"
                      />

                      <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#40382E]">
                        Customization Available
                      </h2>

                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {product.customization.map(
                        (option) => (
                          <div
                            key={option}
                            className="flex items-center gap-2 text-[11px] text-[#756B5B]"
                          >
                            <Check
                              size={13}
                              className="text-[#B8860B]"
                            />
                            {option}
                          </div>
                        )
                      )}
                    </div>

                  </div>
                )}


              {/* Warranty */}
              <div className="mt-8 flex items-center gap-4 border-y border-[#B8860B]/15 py-5">

                <ShieldCheck
                  size={22}
                  strokeWidth={1.3}
                  className="text-[#B8860B]"
                />

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#40382E]">
                    Quality Assurance
                  </p>

                  <p className="mt-1 text-[11px] text-[#756B5B]">
                    Selected outdoor furniture includes a 4-year warranty.
                  </p>
                </div>

              </div>


              {/* CTA */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <Link
                  href={`/contact?product=${encodeURIComponent(
                    product.name
                  )}`}
                  className="group inline-flex min-h-14 flex-1 items-center justify-center gap-3 border border-[#B8860B] bg-[#B8860B] px-7 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-[#241F18] hover:bg-[#241F18]"
                >
                  Request a Quote

                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex min-h-14 items-center justify-center border border-[#B8860B]/30 bg-white px-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#5D5549] transition-all duration-300 hover:border-[#B8860B] hover:text-[#B8860B]"
                >
                  Contact NIRA
                </Link>

              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ================================================= */}
      {/* CUSTOMIZATION BANNER */}
      {/* ================================================= */}

      <section className="bg-[#241F18]">

        <div className="mx-auto grid max-w-[1200px] gap-8 px-6 py-16 sm:px-10 lg:grid-cols-[1fr_auto] lg:items-center lg:py-20">

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#E0B84F]">
              Made For Your Space
            </p>

            <h2 className="mt-3 font-serif text-3xl text-[#FAF8F2] sm:text-4xl">
              Need a custom size or finish?
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-[#FAF8F2]/60">
              NIRA can customize dimensions, fabrics, colours,
              weaving, wood, metal finishes and cushion configurations
              according to your requirements.
            </p>

          </div>

          <Link
            href={`/contact?product=${encodeURIComponent(
              product.name
            )}`}
            className="inline-flex min-h-12 items-center justify-center gap-3 border border-[#E0B84F] bg-[#E0B84F] px-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#241F18] transition-all duration-300 hover:bg-transparent hover:text-[#E0B84F]"
          >
            Discuss Your Requirements
            <ArrowRight size={15} />
          </Link>

        </div>

      </section>


      {/* ================================================= */}
      {/* RELATED PRODUCTS */}
      {/* ================================================= */}

      {relatedProducts.length > 0 && (
        <section className="mx-auto max-w-[1480px] px-6 py-20 sm:px-10 lg:px-16 lg:py-24">

          <div className="flex items-end justify-between border-b border-[#241F18]/10 pb-7">

            <div>

              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#B8860B]">
                You May Also Like
              </p>

              <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                More from NIRA
              </h2>

            </div>

            <Link
              href={
                product.category === "Outdoor Furniture"
                  ? "/outdoor-furniture"
                  : "/indoor-furniture"
              }
              className="hidden items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#B8860B] sm:flex"
            >
              View Collection
              <ArrowRight size={14} />
            </Link>

          </div>


          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {relatedProducts.map((relatedProduct) => (
              <ProductCardSimple
                key={relatedProduct.id}
                product={relatedProduct}
              />
            ))}

          </div>

        </section>
      )}


      {/* Back */}
      <div className="border-t border-[#241F18]/10 bg-white">

        <div className="mx-auto max-w-[1480px] px-6 py-7 sm:px-10 lg:px-16">

          <Link
            href={
              product.category === "Outdoor Furniture"
                ? "/outdoor-furniture"
                : "/indoor-furniture"
            }
            className="group inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#756B5B] hover:text-[#B8860B]"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            Back to Collection
          </Link>

        </div>

      </div>

    </main>
  );
}


/* ========================================================= */
/* INFO BLOCK                                                  */
/* ========================================================= */

function InfoBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.2em] text-[#B8860B]">
        {title}
      </p>

      {children}
    </div>
  );
}


/* ========================================================= */
/* RELATED PRODUCT CARD                                       */
/* ========================================================= */

function ProductCardSimple({
  product,
}: {
  product: (typeof products)[number];
}) {
  const image =
    product.images?.[0] || "/hero/nira-hero.jpg";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
    >
      <div className="relative aspect-[4/4.5] overflow-hidden bg-[#F1EDE3]">

        <Image
          src={image}
          alt={product.altText || product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />

        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="pt-4">

        {product.subcategory && (
          <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">
            {product.subcategory}
          </p>
        )}

        <h3 className="mt-1 font-serif text-xl text-[#241F18]">
          {product.name}
        </h3>

        <span className="mt-2 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#8A8174] transition-colors group-hover:text-[#B8860B]">
          View Details
          <ArrowRight
            size={12}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </span>

      </div>
    </Link>
  );
}