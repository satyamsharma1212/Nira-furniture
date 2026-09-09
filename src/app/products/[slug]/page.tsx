import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Ruler,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

/*
 * =========================================================
 * DYNAMIC PRODUCT PAGE
 * =========================================================
 */

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number | string | null;
  financing: string | null;
  material: string | null;
  dimensions: string | null;
  weight: string | null;
  stock: number | null;
  status: string;
  featured: boolean;
  new_arrival: boolean;
  main_image_url: string | null;
  category_id: string | null;

  categories:
    | Category
    | Category[]
    | null;
};

type ProductImage = {
  id: string;
  image_url: string;
  sort_order: number;
};

type ProductWithImages = Product & {
  product_images: ProductImage[] | null;
};

/*
 * =========================================================
 * CATEGORY HELPER
 * =========================================================
 */

function getCategory(
  product: Product,
): Category | null {
  if (Array.isArray(product.categories)) {
    return product.categories[0] || null;
  }

  return product.categories;
}

/*
 * =========================================================
 * DIMENSIONS HELPER
 * =========================================================
 */

function getDimensions(
  dimensionText: string | null,
) {
  if (!dimensionText) {
    return {
      width: "",
      depth: "",
      height: "",
    };
  }

  /*
   * Supports:
   *
   * W 240cm × D 115cm × H 78cm
   * 240 × 115 × 78 cm
   * 240cm x 115cm x 78cm
   */

  const matches = dimensionText.match(
    /(?:W\s*)?([\d.]+)\s*(?:cm|mm|in|")?\s*[×xX]\s*(?:D\s*)?([\d.]+)\s*(?:cm|mm|in|")?\s*[×xX]\s*(?:H\s*)?([\d.]+)\s*(?:cm|mm|in|")?/,
  );

  if (!matches) {
    return {
      width: dimensionText,
      depth: "",
      height: "",
    };
  }

  const unit =
    dimensionText.match(
      /(cm|mm|in|")/i,
    )?.[1] || "";

  return {
    width: `${matches[1]}${unit}`,
    depth: `${matches[2]}${unit}`,
    height: `${matches[3]}${unit}`,
  };
}

/*
 * =========================================================
 * GET PRODUCT
 * =========================================================
 */

async function getProduct(slug: string) {
  const supabase = await createClient();

  const decodedSlug =
    decodeURIComponent(slug).trim();

  console.log(
    "Looking for product:",
    decodedSlug,
  );

  const {
    data: product,
    error,
  } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      description,
      short_description,
      price,
      financing,
      material,
      dimensions,
      weight,
      stock,
      status,
      featured,
      new_arrival,
      main_image_url,
      category_id,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        image_url,
        sort_order
      )
    `)
    .eq("slug", decodedSlug)
    .maybeSingle();

  if (error) {
    console.error(
      "Supabase product error:",
      error,
    );

    return null;
  }

  if (!product) {
    console.error(
      "Product not found:",
      decodedSlug,
    );

    return null;
  }

  const formattedProduct =
    product as ProductWithImages;

  if (formattedProduct.product_images) {
    formattedProduct.product_images.sort(
      (a, b) =>
        (a.sort_order ?? 0) -
        (b.sort_order ?? 0),
    );
  }

  return formattedProduct;
}

/*
 * =========================================================
 * METADATA
 * =========================================================
 */

export async function generateMetadata({
  params,
}: PageProps) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product | NIRA Furniture",
      description:
        "Explore premium furniture from NIRA Furniture.",
    };
  }

  return {
    title: `${product.name} | NIRA Furniture`,
    description:
      product.short_description ||
      product.description ||
      `Discover ${product.name} from NIRA Furniture.`,
  };
}

/*
 * =========================================================
 * PRODUCT PAGE
 * =========================================================
 */

export default async function ProductPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const category = getCategory(product);

  /*
   * =======================================================
   * IMAGES
   * =======================================================
   */

  const galleryImages =
    product.product_images || [];

  const allImages = [
    ...(product.main_image_url
      ? [product.main_image_url]
      : []),

    ...galleryImages
      .map((image) => image.image_url)
      .filter(
        (image) =>
          image !== product.main_image_url,
      ),
  ];

  const images =
    allImages.length > 0
      ? allImages
      : ["/hero/nira-hero.jpg"];

  const mainImage = images[0];

  /*
   * =======================================================
   * RELATED PRODUCTS
   * =======================================================
   */

  let relatedProducts: Product[] = [];

  if (product.category_id) {
    const supabase = await createClient();

    const {
      data,
      error,
    } = await supabase
      .from("products")
      .select(`
        id,
        name,
        slug,
        description,
        short_description,
        price,
        financing,
        material,
        dimensions,
        weight,
        stock,
        status,
        featured,
        new_arrival,
        main_image_url,
        category_id,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq("status", "active")
      .eq(
        "category_id",
        product.category_id,
      )
      .neq("id", product.id)
      .order("featured", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      })
      .limit(4);

    if (!error && data) {
      relatedProducts =
        data as Product[];
    }
  }

  /*
   * =======================================================
   * DIMENSIONS
   * =======================================================
   */

  const dimensions = getDimensions(
    product.dimensions,
  );

  /*
   * =======================================================
   * CATEGORY URL
   * =======================================================
   */

  const collectionUrl = category
    ? `/collections/${category.slug}`
    : "/collections";

  /*
   * =======================================================
   * BUY NOW URL
   *
   * Sends this exact product to checkout.
   * The checkout page/API still validates the
   * actual product price and stock from Supabase.
   * =======================================================
   */

  const buyNowUrl =
    `/checkout?product=${encodeURIComponent(
      product.slug,
    )}`;

  const isAvailable =
    product.status === "active" &&
    product.price !== null &&
    Number(product.price) > 0 &&
    (product.stock === null ||
      product.stock > 0);

  return (
    <main className="min-h-screen bg-[#FAF8F2] text-[#241F18]">

      {/* ================================================= */}
      {/* PRODUCT */}
      {/* ================================================= */}

      <section className="border-b border-[#B8860B]/15 pt-[90px]">
        <div className="mx-auto max-w-[1480px] px-6 py-10 sm:px-10 lg:px-16 lg:py-16">

          {/* BREADCRUMB */}

          <div className="mb-10 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.17em] text-[#8A8174]">

            <Link
              href="/"
              className="transition-colors hover:text-[#B8860B]"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              href={collectionUrl}
              className="transition-colors hover:text-[#B8860B]"
            >
              {category?.name ||
                "Collections"}
            </Link>

            <span>/</span>

            <span className="text-[#B8860B]">
              {product.name}
            </span>

          </div>

          {/* MAIN GRID */}

          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 xl:gap-20">

            {/* ================================================= */}
            {/* IMAGE */}
            {/* ================================================= */}

            <div>

              <div className="relative aspect-[4/4.2] overflow-hidden bg-[#F1EDE3]">

                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />

                {product.featured && (
                  <div className="absolute left-5 top-5 border border-[#B8860B]/40 bg-[#FAF8F2]/90 px-4 py-2 backdrop-blur-sm">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A5F08]">
                      Featured Collection
                    </span>
                  </div>
                )}

                {product.new_arrival && (
                  <div className="absolute right-5 top-5 border border-[#B8860B]/40 bg-[#FAF8F2]/90 px-4 py-2 backdrop-blur-sm">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A5F08]">
                      New Arrival
                    </span>
                  </div>
                )}

              </div>

              {/* IMAGE THUMBNAILS */}

              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">

                  {images
                    .slice(0, 8)
                    .map(
                      (
                        image,
                        index,
                      ) => (
                        <div
                          key={`${image}-${index}`}
                          className="relative aspect-square overflow-hidden border border-[#241F18]/10 bg-[#F1EDE3]"
                        >

                          <Image
                            src={image}
                            alt={`${product.name} view ${
                              index + 1
                            }`}
                            fill
                            unoptimized
                            sizes="150px"
                            className="object-cover"
                          />

                        </div>
                      ),
                    )}

                </div>
              )}

            </div>

            {/* ================================================= */}
            {/* PRODUCT INFORMATION */}
            {/* ================================================= */}

            <div className="flex flex-col justify-center">

              {/* EYEBROW */}

              <div className="mb-5 flex items-center gap-4">

                <span className="h-px w-12 bg-[#B8860B]" />

                <span className="text-[11px] font-bold uppercase tracking-[0.27em] text-[#B8860B]">
                  NIRA Furniture
                </span>

              </div>

              {/* PRODUCT NAME */}

              <h1 className="max-w-2xl font-serif text-4xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-5xl lg:text-6xl">
                {product.name}
              </h1>

              {/* CATEGORY */}

              {category && (
                <Link
                  href={collectionUrl}
                  className="mt-4 inline-block w-fit text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A8174] transition-colors hover:text-[#B8860B]"
                >
                  {category.name}
                </Link>
              )}

              {/* DESCRIPTION */}

              {product.description && (
                <p className="mt-7 max-w-xl text-[15px] font-medium leading-7 text-[#756B5B]">
                  {product.description}
                </p>
              )}

              {/* SHORT DESCRIPTION */}

              {product.short_description && (
                <p className="mt-4 text-[13px] font-medium leading-6 text-[#8A8174]">
                  {product.short_description}
                </p>
              )}

              {/* PRICE */}

              <div className="mt-7">

                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B8860B]">
                  Acquisition Value
                </p>

                <p className="mt-2 text-3xl font-semibold text-[#241F18]">
                  {product.price !== null
                    ? `₹${Number(
                        product.price,
                      ).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        },
                      )}`
                    : "Price on Request"}
                </p>

                {product.financing && (
                  <p className="mt-2 text-[12px] font-medium text-[#8A8174]">
                    {product.financing}
                  </p>
                )}

              </div>

              {/* DIVIDER */}

              <div className="my-8 h-px bg-[#241F18]/10" />

              {/* PRODUCT FEATURES */}

              <div className="grid grid-cols-2 gap-x-8 gap-y-7">

                {/* MATERIAL */}

                {product.material && (
                  <InfoBlock title="Material">
                    <p className="text-[13px] font-medium leading-6 text-[#5D5549]">
                      {product.material}
                    </p>
                  </InfoBlock>
                )}

                {/* DIMENSIONS */}

                {product.dimensions && (
                  <InfoBlock title="Dimensions">

                    <div className="space-y-1.5">

                      {dimensions.width &&
                      dimensions.depth &&
                      dimensions.height ? (
                        <>
                          <p className="flex items-center gap-2 text-[13px] font-medium text-[#5D5549]">
                            <span className="font-bold text-[#B8860B]">
                              W
                            </span>
                            {dimensions.width}
                          </p>

                          <p className="flex items-center gap-2 text-[13px] font-medium text-[#5D5549]">
                            <span className="font-bold text-[#B8860B]">
                              D
                            </span>
                            {dimensions.depth}
                          </p>

                          <p className="flex items-center gap-2 text-[13px] font-medium text-[#5D5549]">
                            <span className="font-bold text-[#B8860B]">
                              H
                            </span>
                            {dimensions.height}
                          </p>
                        </>
                      ) : (
                        <p className="text-[13px] font-medium leading-6 text-[#5D5549]">
                          {product.dimensions}
                        </p>
                      )}

                    </div>

                  </InfoBlock>
                )}

                {/* WEIGHT */}

                {product.weight && (
                  <InfoBlock title="Weight">
                    <p className="text-[13px] font-medium leading-6 text-[#5D5549]">
                      {product.weight}
                    </p>
                  </InfoBlock>
                )}

                {/* AVAILABILITY */}

                <InfoBlock title="Availability">
                  <p className="text-[13px] font-medium leading-6 text-[#5D5549]">
                    {product.stock &&
                    product.stock > 0
                      ? `${product.stock} available`
                      : "Made to Order"}
                  </p>
                </InfoBlock>

              </div>

              {/* MATERIAL NOTE */}

              {product.material && (
                <div className="mt-8 border-t border-[#241F18]/10 pt-7">

                  <div className="flex items-center gap-3">

                    <Ruler
                      size={18}
                      className="text-[#B8860B]"
                    />

                    <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#40382E]">
                      Crafted Details
                    </h2>

                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">

                    <div className="flex items-center gap-3 text-[14px] font-semibold text-[#5D5549]">
                      <Check
                        size={17}
                        strokeWidth={2}
                        className="shrink-0 text-[#B8860B]"
                      />
                      <span>
                        Hand Finished
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[14px] font-semibold text-[#5D5549]">
                      <Check
                        size={17}
                        strokeWidth={2}
                        className="shrink-0 text-[#B8860B]"
                      />
                      <span>
                        Made to Order
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[14px] font-semibold text-[#5D5549]">
                      <Check
                        size={17}
                        strokeWidth={2}
                        className="shrink-0 text-[#B8860B]"
                      />
                      <span>
                        Premium Materials
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[14px] font-semibold text-[#5D5549]">
                      <Check
                        size={17}
                        strokeWidth={2}
                        className="shrink-0 text-[#B8860B]"
                      />
                      <span>
                        NIRA Quality
                      </span>
                    </div>

                  </div>

                </div>
              )}

              {/* WARRANTY */}

              <div className="mt-8 flex items-center gap-5 border-y border-[#B8860B]/15 py-6">

                <ShieldCheck
                  size={28}
                  strokeWidth={1.8}
                  className="shrink-0 text-[#B8860B]"
                />

                <div>

                  <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#40382E]">
                    Quality Assurance
                  </p>

                  <p className="mt-2 text-[15px] font-semibold leading-6 text-[#756B5B]">
                    Selected furniture includes a
                    4-year warranty.
                  </p>

                </div>

              </div>

              {/* ================================================= */}
              {/* CTA */}
              {/* ================================================= */}

              <div className="mt-8 flex flex-col gap-3">

                {/* BUY NOW */}

                {isAvailable ? (
                  <Link
                    href={buyNowUrl}
                    className="group inline-flex min-h-14 w-full items-center justify-center gap-3 bg-[#241F18] px-7 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#B8860B]"
                  >
                    <ShoppingBag
                      size={17}
                      strokeWidth={1.8}
                    />

                    Buy Now

                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                ) : (
                  <div className="inline-flex min-h-14 w-full cursor-not-allowed items-center justify-center gap-3 border border-[#241F18]/10 bg-[#EAE5DB] px-7 text-[12px] font-bold uppercase tracking-[0.18em] text-[#8A8174]">
                    Currently Unavailable
                  </div>
                )}

                {/* SECONDARY ACTIONS */}

                <div className="flex flex-col gap-3 sm:flex-row">

                  {/* REQUEST A QUOTE */}

                  <Link
                    href={`/quote?product=${product.id}`}
                    className="group inline-flex min-h-14 flex-1 items-center justify-center gap-3 border border-[#B8860B] bg-[#B8860B] px-7 text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:border-[#241F18] hover:bg-[#241F18]"
                  >
                    Request a Quote

                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>

                  {/* CONTACT NIRA */}

                  <Link
                    href="/contact"
                    className="inline-flex min-h-14 flex-1 items-center justify-center border border-[#B8860B]/30 bg-white px-7 text-[12px] font-bold uppercase tracking-[0.18em] text-[#5D5549] transition-all duration-300 hover:border-[#B8860B] hover:text-[#B8860B]"
                  >
                    Contact NIRA
                  </Link>

                </div>

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

            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#E0B84F]">
              Made For Your Space
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#FAF8F2] sm:text-4xl">
              Need a custom size or finish?
            </h2>

            <p className="mt-4 max-w-xl text-[15px] font-medium leading-7 text-[#FAF8F2]/70">
              NIRA can customize dimensions,
              fabrics, colours, weaving, wood,
              metal finishes and cushion
              configurations according to your
              requirements.
            </p>

          </div>

          <Link
            href={`/contact?product=${encodeURIComponent(
              product.name,
            )}`}
            className="inline-flex min-h-12 items-center justify-center gap-3 border border-[#E0B84F] bg-[#E0B84F] px-7 text-[11px] font-bold uppercase tracking-[0.18em] text-[#241F18] transition-all duration-300 hover:bg-transparent hover:text-[#E0B84F]"
          >
            Discuss Your Requirements

            <ArrowRight size={16} />
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

              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#B8860B]">
                You May Also Like
              </p>

              <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">
                More from NIRA
              </h2>

            </div>

            <Link
              href={collectionUrl}
              className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#B8860B] sm:flex"
            >
              View Collection

              <ArrowRight size={15} />
            </Link>

          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {relatedProducts.map(
              (relatedProduct) => (
                <ProductCardSimple
                  key={relatedProduct.id}
                  product={relatedProduct}
                />
              ),
            )}

          </div>

        </section>
      )}

      {/* ================================================= */}
      {/* BACK */}
      {/* ================================================= */}

      <div className="border-t border-[#241F18]/10 bg-white">

        <div className="mx-auto max-w-[1480px] px-6 py-7 sm:px-10 lg:px-16">

          <Link
            href={collectionUrl}
            className="group inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#756B5B] hover:text-[#B8860B]"
          >
            <ArrowLeft
              size={15}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            Back to Collection
          </Link>

        </div>

      </div>

    </main>
  );
}

/*
 * =========================================================
 * INFO BLOCK
 * =========================================================
 */

function InfoBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>

      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8860B]">
        {title}
      </p>

      {children}

    </div>
  );
}

/*
 * =========================================================
 * RELATED PRODUCT CARD
 * =========================================================
 */

function ProductCardSimple({
  product,
}: {
  product: Product;
}) {
  const image =
    product.main_image_url ||
    "/hero/nira-hero.jpg";

  const category = getCategory(product);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
    >

      <div className="relative aspect-[4/4.5] overflow-hidden bg-[#F1EDE3]">

        <Image
          src={image}
          alt={product.name}
          fill
          unoptimized
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />

        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      </div>

      <div className="pt-4">

        {category && (
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">
            {category.name}
          </p>
        )}

        <h3 className="mt-1 font-serif text-xl font-semibold text-[#241F18]">
          {product.name}
        </h3>

        <span className="mt-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#8A8174] transition-colors group-hover:text-[#B8860B]">

          View Details

          <ArrowRight
            size={13}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />

        </span>

      </div>

    </Link>
  );
}