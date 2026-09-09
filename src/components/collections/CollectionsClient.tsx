"use client";

import { useEffect, useMemo, useState } from "react";

import {
  type CollectionCategory,
  type MaterialFilter as MaterialFilterValue,
} from "@/lib/collections";

import { createClient } from "@/lib/supabase/client";

import ArchitecturalGuildCTA from "./ArchitecturalGuildCTA";
import CategoryNav from "./CategoryNav";
import CollectionsHero from "./CollectionsHero";
import CollectionsPagination from "./CollectionsPagination";
import MaterialArchive from "./MaterialArchive";
import MaterialFilter from "./MaterialFilter";
import ProductGrid from "./ProductGrid";
import type { CollectionProduct } from "./CollectionProductCard";

type SupabaseProduct = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  short_description: string | null;
  price: number | string | null;
  material: string | null;
  dimensions: string | null;
  weight: string | null;
  main_image_url: string | null;
  status: string;
  featured: boolean;
  new_arrival: boolean;
  category_id: string | null;
  categories:
    | {
        id: string;
        name: string;
        slug: string;
      }
    | {
        id: string;
        name: string;
        slug: string;
      }[]
    | null;
};

type Product = CollectionProduct & {
  categorySlug?: string;
  dimensions?: string;
  weight?: string;
  featured?: boolean;
  new_arrival?: boolean;
};

type Props = {
  initialCategory: CollectionCategory;
};

type SortOption =
  | "curated"
  | "price-low"
  | "price-high";

export default function CollectionsClient({
  initialCategory,
}: Props) {
  const supabase = createClient();

  /*
   * ---------------------------------------------------------
   * PRODUCTS FROM SUPABASE
   * ---------------------------------------------------------
   */

  const [products, setProducts] = useState<Product[]>(
    [],
  );

  const [loading, setLoading] = useState(true);

  const [fetchError, setFetchError] =
    useState("");

  /*
   * ---------------------------------------------------------
   * FILTER STATE
   * ---------------------------------------------------------
   */

  const [activeMaterial, setActiveMaterial] =
    useState<MaterialFilterValue>(
      "All Materials",
    );

  const [sortBy, setSortBy] =
    useState<SortOption>("curated");

  const [currentPage, setCurrentPage] =
    useState(1);

  const productsPerPage = 6;

  /*
   * ---------------------------------------------------------
   * FETCH ACTIVE PRODUCTS
   * ---------------------------------------------------------
   */

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setFetchError("");

      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          slug,
          name,
          description,
          short_description,
          price,
          material,
          dimensions,
          weight,
          main_image_url,
          status,
          featured,
          new_arrival,
          category_id,
          categories (
            id,
            name,
            slug
          )
        `)
        .eq("status", "active")
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "Failed to fetch products:",
          error,
        );

        setFetchError(error.message);
        setProducts([]);
        setLoading(false);

        return;
      }

      const formattedProducts: Product[] = (
        (data as SupabaseProduct[]) || []
      ).map((product) => {
        const category = Array.isArray(
          product.categories,
        )
          ? product.categories[0]
          : product.categories;

        return {
          slug: product.slug,
          name: product.name,

          category:
            category?.name ||
            "NIRA COLLECTION",

          categorySlug:
            category?.slug || "",

          description:
            product.description ||
            product.short_description ||
            "",

          image:
            product.main_image_url ||
            "/placeholder.jpg",

          images: product.main_image_url
            ? [product.main_image_url]
            : [],

          price:
            product.price ?? "Price on Request",

          material:
            product.material || undefined,

          dimensions:
            product.dimensions || undefined,

          weight:
            product.weight || undefined,

          featured:
            product.featured,

          new_arrival:
            product.new_arrival,
        };
      });

      setProducts(formattedProducts);
      setLoading(false);
    }

    fetchProducts();
  }, []);

  /*
   * ---------------------------------------------------------
   * FILTER PRODUCTS
   * ---------------------------------------------------------
   */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    /*
     * CATEGORY
     */

    if (initialCategory !== "all") {
      result = result.filter((product) => {
        const categoryName =
          product.category?.toLowerCase() || "";

        const categorySlug =
          product.categorySlug?.toLowerCase() ||
          "";

        const productText = `
          ${product.name}
          ${product.description ?? ""}
          ${product.category ?? ""}
          ${product.categorySlug ?? ""}
        `.toLowerCase();

        const requestedCategory =
          initialCategory.toLowerCase();

        /*
         * DIRECT CATEGORY MATCH
         *
         * Example:
         * outdoor-chairs
         * outdoor sofa set
         */

        if (
          categorySlug === requestedCategory ||
          categoryName === requestedCategory
        ) {
          return true;
        }

        /*
         * OUTDOOR FURNITURE
         */

        if (
          requestedCategory ===
          "outdoor-furniture"
        ) {
          return (
            categorySlug.includes("outdoor") ||
            categoryName.includes("outdoor") ||
            productText.includes("outdoor")
          );
        }

        /*
         * INDOOR FURNITURE
         */

        if (
          requestedCategory ===
          "indoor-furniture"
        ) {
          return (
            categorySlug.includes("indoor") ||
            categoryName.includes("indoor") ||
            productText.includes("indoor")
          );
        }

        /*
         * SEATING
         */

        if (
          requestedCategory === "seating"
        ) {
          return (
            categorySlug.includes("chair") ||
            categorySlug.includes("sofa") ||
            categorySlug.includes("swing") ||
            categorySlug.includes("lounger") ||
            categorySlug.includes("stool") ||
            categoryName.includes("chair") ||
            categoryName.includes("sofa") ||
            categoryName.includes("swing") ||
            categoryName.includes("lounger") ||
            categoryName.includes("stool") ||
            productText.includes("seating")
          );
        }

        /*
         * DINING
         */

        if (
          requestedCategory === "dining"
        ) {
          return (
            categorySlug.includes("dining") ||
            categorySlug.includes("table") ||
            categorySlug.includes("stool") ||
            categoryName.includes("dining") ||
            categoryName.includes("table") ||
            categoryName.includes("stool") ||
            productText.includes("dining")
          );
        }

        /*
         * ACCENTS
         */

        if (
          requestedCategory === "accents"
        ) {
          return (
            categorySlug.includes("tray") ||
            categorySlug.includes("console") ||
            categorySlug.includes("accessor") ||
            categorySlug.includes("umbrella") ||
            categoryName.includes("tray") ||
            categoryName.includes("console") ||
            categoryName.includes("accessor") ||
            categoryName.includes("umbrella")
          );
        }

        return false;
      });
    }

    /*
     * -------------------------------------------------------
     * MATERIAL FILTER
     * -------------------------------------------------------
     */

    if (
      activeMaterial !== "All Materials"
    ) {
      const material =
        activeMaterial.toLowerCase();

      result = result.filter((product) => {
        const text = `
          ${product.name}
          ${product.description ?? ""}
          ${product.material ?? ""}
          ${product.category ?? ""}
        `.toLowerCase();

        /*
         * MATERIAL ALIASES
         */

        if (
          material === "aged teak"
        ) {
          return text.includes("teak");
        }

        if (
          material === "travertine"
        ) {
          return text.includes("travertine");
        }

        if (
          material === "pure bouclé"
        ) {
          return (
            text.includes("boucle") ||
            text.includes("bouclé")
          );
        }

        if (
          material === "braided cord"
        ) {
          return (
            text.includes("cord") ||
            text.includes("braided")
          );
        }

        if (
          material === "fumed walnut"
        ) {
          return text.includes("walnut");
        }

        return text.includes(material);
      });
    }

    /*
     * -------------------------------------------------------
     * SORT
     * -------------------------------------------------------
     */

    if (sortBy === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0),
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0),
      );
    }

    /*
     * CURATED
     *
     * Featured products first,
     * then new arrivals,
     * then the remaining products.
     */

    if (sortBy === "curated") {
      result.sort((a, b) => {
        const aScore =
          (a.featured ? 2 : 0) +
          (a.new_arrival ? 1 : 0);

        const bScore =
          (b.featured ? 2 : 0) +
          (b.new_arrival ? 1 : 0);

        return bScore - aScore;
      });
    }

    return result;
  }, [
    products,
    initialCategory,
    activeMaterial,
    sortBy,
  ]);

  /*
   * ---------------------------------------------------------
   * PAGINATION
   * ---------------------------------------------------------
   */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length /
        productsPerPage,
    ),
  );

  const safePage = Math.min(
    currentPage,
    totalPages,
  );

  const startIndex =
    (safePage - 1) *
    productsPerPage;

  const visibleProducts =
    filteredProducts.slice(
      startIndex,
      startIndex + productsPerPage,
    );

  /*
   * ---------------------------------------------------------
   * HANDLERS
   * ---------------------------------------------------------
   */

  function handleMaterialChange(
    material: MaterialFilterValue,
  ) {
    setActiveMaterial(material);
    setCurrentPage(1);
  }

  function handleSortChange(
    sort: SortOption,
  ) {
    setSortBy(sort);
    setCurrentPage(1);
  }

  function resetCollection() {
    setActiveMaterial(
      "All Materials",
    );

    setSortBy("curated");

    setCurrentPage(1);
  }

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-[#F7F4EE] text-[#171512]">
        <CollectionsHero itemCount={0} />

        <div className="flex min-h-[420px] items-center justify-center px-5">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border border-[#765A32]/20 border-t-[#765A32]" />

            <p className="mt-6 font-serif text-2xl">
              Curating the collection
            </p>

            <p className="mt-2 font-sans text-[11px] uppercase tracking-[0.18em] text-[#171512]/45">
              Loading NIRA pieces
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  return (
    <main className="min-h-screen w-full bg-[#F7F4EE] text-[#171512]">
      {/* GLOBAL COLLECTION ANIMATIONS */}
      <style jsx global>{`
        @keyframes niraPulse {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(1);
          }

          50% {
            opacity: 1;
            transform: scale(1.18);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* HERO */}
      <CollectionsHero
        itemCount={
          filteredProducts.length
        }
      />

      {/* CATEGORY ROUTES */}
      <CategoryNav
        activeCategory={
          initialCategory
        }
      />

      {/* MATERIAL + SORT */}
      <MaterialFilter
        activeMaterial={
          activeMaterial
        }
        sortBy={sortBy}
        onMaterialChange={
          handleMaterialChange
        }
        onSortChange={
          handleSortChange
        }
      />

      {/* DATABASE ERROR */}
      {fetchError && (
        <section className="px-5 pb-8 sm:px-8 lg:px-12 xl:px-16">
          <div className="mx-auto max-w-[1380px] border border-red-900/15 bg-red-50 px-5 py-4">
            <p className="font-sans text-sm font-semibold text-red-700">
              Unable to load products:
            </p>

            <p className="mt-1 font-sans text-xs text-red-700/80">
              {fetchError}
            </p>
          </div>
        </section>
      )}

      {/* PRODUCT GRID */}
      <section className="px-5 pb-20 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-[1380px]">
          <ProductGrid
            products={visibleProducts}
            onReset={
              resetCollection
            }
          />

          {/* PAGINATION */}
          <CollectionsPagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={
              filteredProducts.length
            }
            visibleCount={
              visibleProducts.length
            }
            startIndex={startIndex}
            onPageChange={
              setCurrentPage
            }
          />
        </div>
      </section>

      {/* MATERIAL ARCHIVE */}
      <MaterialArchive />

      {/* ARCHITECTURAL GUILD CTA */}
      <ArchitecturalGuildCTA />
    </main>
  );
}