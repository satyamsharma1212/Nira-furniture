"use client";

import { useEffect, useMemo, useState } from "react";

import Image from "next/image";

import Link from "next/link";

import {

  ChevronDown,

  ChevronRight,

  SlidersHorizontal,

  X,

  Heart,

  ShoppingBag,

  Check,

  Loader2,

} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

/* ============================================================

   TYPES

============================================================ */

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

  price: number | null;

  financing: string | null;

  material: string | null;

  materials: string[] | null;

  dimensions: string | null;

  weight: string | null;

  stock: number | null;

  status: string | null;

  featured: boolean | null;

  new_arrival: boolean | null;

  main_image_url: string | null;

  category_id: string | null;

  collection_type:

    | "outdoor"

    | "outdoor"

    | null;

  categories:

    | Category

    | Category[]

    | null;

};

/* ============================================================

   CATEGORY HELPER

============================================================ */

function getProductCategory(

  product: Product

): Category | null {

  if (!product.categories) {

    return null;

  }

  if (Array.isArray(product.categories)) {

    return product.categories[0] ?? null;

  }

  return product.categories;

}

/*\* Materials shown in the Outdoor Collection filter. */

const NIRA_MATERIALS = [

  "Teak Wood",

  "Aluminium",

  "Rope",

  "Wicker",

  "Outdoor Fabric",

  "Stainless Steel",

  "Synthetic Weaving",

  "Powder Coating",

] as const;

/*\* Normalize spelling/capitalization variations from existing product records. */

function normalizeMaterialName(value: string): string {

  const cleaned = value.trim().replace(/\s+/g, " ");

  const key = cleaned.toLowerCase().replace(/[^a-z0-9]/g, "");

  const aliases: Record<string, string> = {

    teakwood: "Teak Wood",

    aluminium: "Aluminium",

    aluminum: "Aluminium",

    rope: "Rope",

    roping: "Rope",

    wicker: "Wicker",

    fabric: "Outdoor Fabric",

    outdoorfabric: "Outdoor Fabric",

    jindalstainlesssteel: "Stainless Steel",

    stainlesssteel: "Stainless Steel",

    stainlesssteal: "Stainless Steel",

    syntheticweaving: "Synthetic Weaving",

    powdercoating: "Powder Coating",

    powercoating: "Powder Coating",

  };

  return aliases[key] ?? cleaned;

}

/*\* Read materials from the Supabase `materials` array (with legacy text fallback). */

function getProductMaterials(product: Product): string[] {

  const storedMaterials = Array.isArray(product.materials)

    ? product.materials

    : [];

  // Older records may still use the singular `material` text column.

  const legacyMaterials = (product.material ?? "")

    .split(/[,;|+\n\r]+/)

    .filter(Boolean);

  const values = [...storedMaterials, ...legacyMaterials];

  const normalized = values.map((value) => {

    const cleaned = String(value).trim();

    const key = cleaned.toLowerCase().replace(/[^a-z0-9]/g, "");

    const canonical = NIRA_MATERIALS.find(

      (material) => material.toLowerCase().replace(/[^a-z0-9]/g, "") === key,

    );

    return canonical ?? normalizeMaterialName(cleaned);

  });

  return Array.from(new Set(normalized.filter(Boolean)));

}

/* ============================================================

   PAGE

============================================================ */

export default function OutdoorCollectionPage() {

  /* ==========================================================

     STATE

  ========================================================== */

  const [products, setProducts] =

    useState<Product[]>([]);

  const [loading, setLoading] =

    useState(true);

  const [error, setError] =

    useState("");

  const [selectedCategory, setSelectedCategory] =

    useState("All Outdoor");

  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  const [sortBy, setSortBy] =

    useState("Featured");

  const [mobileFilters, setMobileFilters] =

    useState(false);

  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => new Set());

  const [wishlistLoading, setWishlistLoading] = useState(true);

  const [wishlistUpdatingId, setWishlistUpdatingId] = useState<string | null>(null);

  const [addingCartId, setAddingCartId] = useState<string | null>(null);

  const [cartAddedId, setCartAddedId] = useState<string | null>(null);

  /* ==========================================================

      FETCH CURRENT USER WISHLIST

  ========================================================== */

  useEffect(() => {

    let mounted = true;

    async function fetchWishlist() {

      try {

        setWishlistLoading(true);

        const supabase = createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {

          if (mounted) setWishlistIds(new Set());

          return;

        }

        const { data, error } = await supabase

          .from("wishlist_items")

          .select("product_id")

          .eq("user_id", user.id);

        if (error) {

          console.error("Wishlist fetch error:", error);

          if (mounted) setWishlistIds(new Set());

          return;

        }

        if (mounted) {

          setWishlistIds(

            new Set(

              (data ?? [])

                .map((item) => item.product_id)

                .filter((id): id is string => Boolean(id))

            )

          );

        }

      } catch (error) {

        console.error("Unexpected wishlist fetch error:", error);

        if (mounted) setWishlistIds(new Set());

      } finally {

        if (mounted) setWishlistLoading(false);

      }

    }

    void fetchWishlist();

    return () => {

      mounted = false;

    };

  }, []);

    /* ==========================================================

      ADD TO CART

  ========================================================== */

  const addToCart = async (product: Product) => {

    if (addingCartId === product.id) return;

    try {

      setAddingCartId(product.id);

      const supabase = createClient();

      const {

        data: { user },

      } = await supabase.auth.getUser();

      if (!user) {

        window.location.href = `/login?next=${encodeURIComponent(

          window.location.pathname,

        )}`;

        return;

      }

      const { data: existingItem, error: existingError } = await supabase

        .from("cart_items")

        .select("id, quantity")

        .eq("user_id", user.id)

        .eq("product_id", product.id)

        .maybeSingle();

      if (existingError) throw existingError;

      if (existingItem) {

        const { error } = await supabase

          .from("cart_items")

          .update({

            quantity: Number(existingItem.quantity ?? 0) + 1,

            updated_at: new Date().toISOString(),

          })

          .eq("id", existingItem.id);

        if (error) throw error;

      } else {

        const { error } = await supabase.from("cart_items").insert({

          user_id: user.id,

          product_id: product.id,

          quantity: 1,

        });

        if (error) throw error;

      }

      setCartAddedId(product.id);

      window.setTimeout(() => {

        setCartAddedId((current) =>

          current === product.id ? null : current,

        );

      }, 2000);

    } catch (error) {

      console.error("Add to cart error:", error);

      alert("Unable to add this product to your cart. Please try again.");

    } finally {

      setAddingCartId(null);

    }

  };

/* ==========================================================

      WISHLIST TOGGLE

  ========================================================== */

  const toggleWishlist = async (productId: string) => {

    if (wishlistUpdatingId) return;

    try {

      setWishlistUpdatingId(productId);

      const supabase = createClient();

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {

        window.location.href = "/login?next=/wishlist";

        return;

      }

      if (wishlistIds.has(productId)) {

        const { error } = await supabase

          .from("wishlist_items")

          .delete()

          .eq("user_id", user.id)

          .eq("product_id", productId);

        if (error) throw error;

        setWishlistIds((current) => {

          const next = new Set(current);

          next.delete(productId);

          return next;

        });

      } else {

        const { error } = await supabase

          .from("wishlist_items")

          .insert({ user_id: user.id, product_id: productId });

        if (error) throw error;

        setWishlistIds((current) => {

          const next = new Set(current);

          next.add(productId);

          return next;

        });

      }

    } catch (error) {

      console.error("Wishlist update error:", error);

    } finally {

      setWishlistUpdatingId(null);

    }

  };

  /* ==========================================================

     FETCH REAL OUTDOOR PRODUCTS

  ========================================================== */

  useEffect(() => {

    let mounted = true;

    async function fetchOutdoorProducts() {

      try {

        setLoading(true);

        setError("");

        const supabase = createClient();

        const {

          data,

          error: fetchError,

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

            materials,

            dimensions,

            weight,

            stock,

            status,

            featured,

            new_arrival,

            main_image_url,

            category_id,

            collection_type,

            categories (

              id,

              name,

              slug

            )

          `)

          .eq(

            "collection_type",

            "outdoor"

          )

          .eq(

            "status",

            "active"

          )

          .order(

            "featured",

            {

              ascending: false,

            }

          )

          .order(

            "created_at",

            {

              ascending: false,

            }

          );

        if (fetchError) {

          console.error(

            "Outdoor products fetch error:",

            fetchError

          );

          if (mounted) {

            setError(

              fetchError.message

            );

            setProducts([]);

          }

          return;

        }

        if (mounted) {

          setProducts(

            (data ?? []) as Product[]

          );

        }

      } catch (err) {

        console.error(

          "Unexpected outdoor products error:",

          err

        );

        if (mounted) {

          setError(

            "Unable to load outdoor products."

          );

          setProducts([]);

        }

      } finally {

        if (mounted) {

          setLoading(false);

        }

      }

    }

    fetchOutdoorProducts();

    return () => {

      mounted = false;

    };

  }, []);

  /* ==========================================================

     REAL OUTDOOR CATEGORIES

  ========================================================== */

  const outdoorCategories = useMemo(() => {

    const categoryNames = products

      .map(

        (product) =>

          getProductCategory(product)?.name

      )

      .filter(

        (

          name

        ): name is string =>

          Boolean(name)

      );

    return [

      "All Outdoor",

      ...Array.from(

        new Set(categoryNames)

      ),

    ];

  }, [products]);

  /* ==========================================================

     REAL MATERIALS

  ========================================================== */

  // Keep the requested NIRA materials visible at all times.

  const availableMaterials = useMemo<string[]>(

    () => [...NIRA_MATERIALS],

    [],

  );

  /* ==========================================================

     FILTER + SORT

  ========================================================== */

  const filteredProducts =

    useMemo(() => {

      let result =

        products.filter(

          (product) => {

            const category =

              getProductCategory(

                product

              );

            const categoryMatch =

              selectedCategory ===

                "All Outdoor" ||

              category?.name ===

                selectedCategory;

            const productMaterials = getProductMaterials(product);

            const selectedMaterialKeys = selectedMaterials.map(

              (material) => normalizeMaterialName(material).toLowerCase(),

            );

            const productMaterialKeys = productMaterials.map(

              (material) => normalizeMaterialName(material).toLowerCase(),

            );

            const materialMatch =

              selectedMaterialKeys.length === 0 ||

              selectedMaterialKeys.some((material) =>

                productMaterialKeys.includes(material),

              );

            return (

              categoryMatch &&

              materialMatch

            );

          }

        );

      /* FEATURED */

      if (

        sortBy ===

        "Featured"

      ) {

        result = [

          ...result,

        ].sort(

          (a, b) =>

            Number(

              b.featured ??

                false

            ) -

            Number(

              a.featured ??

                false

            )

        );

      }

      /* PRICE LOW → HIGH */

      if (

        sortBy ===

        "Price: Low to High"

      ) {

        result = [

          ...result,

        ].sort(

          (a, b) =>

            Number(

              a.price ?? 0

            ) -

            Number(

              b.price ?? 0

            )

        );

      }

      /* PRICE HIGH → LOW */

      if (

        sortBy ===

        "Price: High to Low"

      ) {

        result = [

          ...result,

        ].sort(

          (a, b) =>

            Number(

              b.price ?? 0

            ) -

            Number(

              a.price ?? 0

            )

        );

      }

      return result;

    }, [

      products,

      selectedCategory,

      selectedMaterials,

      sortBy,

    ]);

  /* ==========================================================

     CLEAR FILTERS

  ========================================================== */

  const clearFilters = () => {

    setSelectedCategory(

      "All Outdoor"

    );

    setSelectedMaterials([]);

  };

  /* ==========================================================

     RENDER

  ========================================================== */

  return (

    <main className="min-h-screen bg-[#F8F5EF] text-[#171717]">

      {/* =====================================================

          HERO

      ===================================================== */}

      <section className="relative overflow-hidden">

        <div className="relative h-[70vh] min-h-[520px] w-full">

          <Image

            src="/images/outdoor-hero.jpg"

            alt="NIRA Outdoor Furniture Collection"

            fill

            priority

            className="object-cover"

          />

          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute inset-0 flex items-end">

            <div className="mx-auto w-full max-w-7xl px-6 pb-14 md:px-10 lg:pb-20">

              <div className="max-w-2xl text-white">

                <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#E4C27A]">

                  NIRA Haute Living

                </p>

                <h1 className="font-serif text-5xl leading-[0.95] md:text-7xl lg:text-8xl">

                  Outdoor

                  <br />

                  Collection

                </h1>

                <p className="mt-6 max-w-xl text-sm leading-7 text-white/80 md:text-base">

                  Timeless furniture crafted

                  to bring warmth, character

                  and refined comfort into

                  every interior.

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================

          INTRO

      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">

        <div className="grid gap-10 md:grid-cols-[1fr_1.5fr] md:items-end">

          <div>

            <p className="text-xs uppercase tracking-[0.3em] text-[#A9823A]">

              The Outdoor Edit

            </p>

            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">

              Designed for

              <br />

              open-air living.

            </h2>

          </div>

          <p className="max-w-2xl text-sm leading-7 text-black/60 md:text-base">

            Explore NIRA&apos;s outdoor

            collection, bringing together

            sophisticated silhouettes,

            natural materials and exceptional

            craftsmanship for spaces designed

            to last.

          </p>

        </div>

      </section>

      {/* =====================================================

          PRODUCTS

      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">

        {/* ===================================================

            TOP BAR

        =================================================== */}

        <div className="mb-10 flex flex-col gap-5 border-b border-black/10 pb-6 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="text-xs uppercase tracking-[0.3em] text-[#A9823A]">

              Collection

            </p>

            <h2 className="mt-2 font-serif text-3xl md:text-4xl">

              {selectedCategory}

            </h2>

            <p className="mt-2 text-xs text-black/45">

              {loading

                ? "Loading products..."

                : `${filteredProducts.length} products`}

            </p>

          </div>

          <div className="flex items-center gap-3">

            {/* MOBILE FILTER */}

            <button

              onClick={() =>

                setMobileFilters(

                  true

                )

              }

              className="flex items-center gap-2 border border-black/15 px-4 py-3 text-xs uppercase tracking-[0.15em] md:hidden"

            >

              <SlidersHorizontal

                size={14}

              />

              Filters

            </button>

            {/* SORT */}

            <div className="relative">

              <select

                value={sortBy}

                onChange={(e) =>

                  setSortBy(

                    e.target.value

                  )

                }

                className="appearance-none border border-black/15 bg-transparent py-3 pl-4 pr-10 text-xs uppercase tracking-[0.12em] outline-none"

              >

                <option>

                  Featured

                </option>

                <option>

                  Price: Low to High

                </option>

                <option>

                  Price: High to Low

                </option>

              </select>

              <ChevronDown

                size={14}

                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"

              />

            </div>

          </div>

        </div>

        {/* ===================================================

            FILTER + PRODUCTS

        =================================================== */}

        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">

          {/* =================================================

              DESKTOP FILTER

          ================================================= */}

          <aside className="hidden lg:block">

            <FilterSection

              title="Category"

              options={

                outdoorCategories

              }

              selected={

                selectedCategory

              }

              onChange={

                setSelectedCategory

              }

            />

            <MultiSelectFilterSection

              title="Material"

              options={availableMaterials}

              selected={selectedMaterials}

              onChange={setSelectedMaterials}

            />

            <button

              onClick={

                clearFilters

              }

              className="mt-5 text-[13px] uppercase tracking-[0.2em] text-[#9C722A] underline underline-offset-4"

            >

              Clear all filters

            </button>

          </aside>

          {/* =================================================

              PRODUCT AREA

          ================================================= */}

          <div>

            {/* =================================================

                LOADING

            ================================================= */}

            {loading ? (

              <div className="flex min-h-[400px] items-center justify-center border border-black/10">

                <div className="text-center">

                  <div className="mx-auto mb-5 h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-[#A9823A]" />

                  <p className="font-serif text-2xl">

                    Loading outdoor collection

                  </p>

                  <p className="mt-2 text-xs text-black/45">

                    Discovering outdoor pieces from NIRA.

                  </p>

                </div>

              </div>

            ) : error ? (

              /* =================================================

                  ERROR

              ================================================= */

              <div className="flex min-h-[400px] items-center justify-center border border-red-200">

                <div className="max-w-md px-6 text-center">

                  <p className="font-serif text-2xl">

                    Unable to load products

                  </p>

                  <p className="mt-3 text-sm leading-6 text-black/50">

                    {error}

                  </p>

                  <button

                    onClick={() =>

                      window.location.reload()

                    }

                    className="mt-6 bg-[#171717] px-6 py-3 text-xs uppercase tracking-[0.2em] text-white"

                  >

                    Try Again

                  </button>

                </div>

              </div>

            ) : filteredProducts.length ===

              0 ? (

              /* =================================================

                  EMPTY

              ================================================= */

              <div className="flex min-h-[400px] items-center justify-center border border-black/10">

                <div className="text-center">

                  <p className="font-serif text-2xl">

                    No products found

                  </p>

                  <p className="mt-2 text-sm text-black/45">

                    There are no outdoor

                    products matching

                    your selected filters.

                  </p>

                  <button

                    onClick={

                      clearFilters

                    }

                    className="mt-5 bg-[#171717] px-6 py-3 text-xs uppercase tracking-[0.2em] text-white"

                  >

                    Clear Filters

                  </button>

                </div>

              </div>

            ) : (

              /* =================================================

                  PREMIUM PRODUCT GRID

              ================================================= */

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {filteredProducts.map(

                  (product) => {

                    const category =

                      getProductCategory(

                        product

                      );

                    const image =

                      product.main_image_url ||

                      "/hero/nira-hero.jpg";

                    const materialTags = getProductMaterials(product).slice(0, 3);

                    return (

                      <div

                        key={

                          product.id

                        }

                        className="group overflow-hidden bg-[#F1EEE7] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"

                      >

                        {/* =================================================

                            PRODUCT IMAGE

                        ================================================= */}

                        <div className="relative aspect-[1.12/1] overflow-hidden bg-[#DED8CB]">

                          <Link

                            href={`/products/${product.slug}`}

                            className="absolute inset-0 z-10"

                            aria-label={`View ${product.name}`}

                          />

                          <Image

                            src={

                              image

                            }

                            alt={

                              product.name

                            }

                            fill

                            sizes="(max-width: 768px) 100vw, 50vw"

                            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.035]"

                          />

                          {/* IMAGE GRADIENT */}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

                          {/* =================================================

                              CATEGORY BADGE

                          ================================================= */}

                          <div className="absolute left-3 top-3 z-20 max-w-[70%]">

                            <div className="inline-block bg-[#F8F5EF]/95 px-3 py-2">

                              <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#80643A]">

                                {category?.name ||

                                  "Outdoor Furniture"}

                              </p>

                            </div>

                            <div className="mt-1 inline-block bg-[#F8F5EF]/95 px-3 py-2">

                              <p className="text-[13px] font-medium uppercase tracking-[0.15em] text-[#80643A]">

                                White-Glove Delivery

                              </p>

                            </div>

                          </div>

                          {/* =================================================

                              WISHLIST

                          ================================================= */}

                          <button

                              type="button"

                              onClick={(event) => {

                                event.preventDefault();

                                event.stopPropagation();

                                void toggleWishlist(product.id);

                              }}

                              disabled={wishlistLoading || wishlistUpdatingId === product.id}

                              className={`absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 disabled:cursor-wait ${

                                wishlistIds.has(product.id)

                                  ? "bg-[#80643A] text-white hover:bg-[#6F542E]"

                                  : "bg-[#F8F5EF]/95 text-black/70 hover:bg-white hover:text-[#80643A]"

                              }`}

                              aria-label={

                                wishlistIds.has(product.id)

                                  ? "Remove from wishlist"

                                  : "Add to wishlist"

                              }

                              aria-pressed={wishlistIds.has(product.id)}

                            >

                              {wishlistUpdatingId === product.id ? (

                                <Loader2 size={15} className="animate-spin" />

                              ) : (

                                <Heart

                                  size={15}

                                  strokeWidth={1.5}

                                  fill={wishlistIds.has(product.id) ? "currentColor" : "none"}

                                />

                              )}

                            </button>

                          {/* =================================================

                              NIRA MARK

                          ================================================= */}

                          <div className="absolute right-4 top-14 z-20">

                            <span className="font-serif text-sm text-white/90">

                              N

                            </span>

                          </div>

                          {/* =================================================

                              IMAGE BOTTOM BAR

                          ================================================= */}

                          <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-3 bg-[#211F1B]/90 px-3 py-3 text-white">

                            <p className="min-w-0 truncate text-[13px] font-medium uppercase tracking-[0.16em]">

                              {product.dimensions ||

                                "Dimensions available on request"}

                            </p>

                            <p className="shrink-0 text-[13px] font-medium uppercase tracking-[0.16em]">

                              Made to Order

                            </p>

                          </div>

                        </div>

                        {/* =================================================

                            PRODUCT INFORMATION

                        ================================================= */}

                        <div className="px-5 pb-5 pt-5 md:px-6 md:pb-6">

                          {/* CATEGORY + MATERIAL */}

                          <div className="flex items-start justify-between gap-4">

                            <p className="max-w-[55%] text-[13px] font-medium uppercase tracking-[0.2em] leading-4 text-[#80643A]">

                              {category?.name ||

                                "Outdoor Furniture"}

                            </p>

                            <p className="max-w-[45%] truncate text-right text-[13px] tracking-[0.08em] text-black/35">

                              {materialTags.length >

                              0

                                ? `• ${materialTags.join(

                                    ", "

                                  )}`

                                : "• Premium craftsmanship"}

                            </p>

                          </div>

                          {/* PRODUCT NAME */}

                          <Link

                            href={`/products/${product.slug}`}

                          >

                            <h3 className="mt-3 max-w-[90%] font-serif text-[26px] leading-[1.05] text-[#171717] transition-colors duration-300 group-hover:text-[#80643A] md:text-[29px]">

                              {

                                product.name

                              }

                            </h3>

                          </Link>

                          {/* DESCRIPTION */}

                          <p className="mt-3 line-clamp-2 max-w-[95%] text-[13px] leading-5 text-black/45 md:text-xs">

                            {product.short_description ||

                              product.description ||

                              "Designed with refined proportions, premium materials and exceptional craftsmanship for sophisticated interiors."}

                          </p>

                          {/* MATERIAL TAGS */}

                          <div className="mt-4 flex flex-wrap gap-2">

                            {materialTags.map(

                              (

                                material,

                                index

                              ) => (

                                <span

                                  key={`${material}-${index}`}

                                  className="border border-black/10 bg-[#F8F5EF] px-2.5 py-1.5 text-xs uppercase tracking-[0.12em] text-black/55"

                                >

                                  {

                                    material

                                  }

                                </span>

                              )

                            )}

                            <span className="border border-black/10 bg-[#F8F5EF] px-2.5 py-1.5 text-xs uppercase tracking-[0.12em] text-black/55">

                              Hand Finished

                            </span>

                            <span className="border border-black/10 bg-[#F8F5EF] px-2.5 py-1.5 text-xs uppercase tracking-[0.12em] text-black/55">

                              Made to Order

                            </span>

                          </div>

                          {/* DIVIDER */}

                          <div className="my-5 border-t border-black/10" />

                          {/* PRICE / CONCIERGE */}

                          <div className="flex items-end justify-between gap-4">

                            <div>

                              <p className="text-[13px] uppercase tracking-[0.2em] text-[#80643A]">

                                Acquisition

                              </p>

                              <p className="mt-2 font-serif text-xl text-[#171717]">
                                  {product.price != null
                                    ? new Intl.NumberFormat("en-IN", {
                                        style: "currency",
                                        currency: "INR",
                                        maximumFractionDigits: 0,
                                      }).format(product.price)
                                    : "Price on Request"}
                                </p>

                              <p className="mt-1 max-w-[240px] text-[12px] leading-5 text-black/45">
                                  {product.price != null
                                    ? "Inclusive of applicable taxes unless stated otherwise."
                                    : "Connect with our team for personalized pricing and bespoke options."}
                                </p>

                            </div>

                            <div className="text-right">

                              <p className="text-[13px] uppercase tracking-[0.18em] text-[#80643A]">

                                Design Consultation

                              </p>

                              <p className="mt-2 text-[13px] text-black/45">

                                "Personalised guidance"

                              </p>

                            </div>

                          </div>

                          {/* ACTIONS */}

                          <div className="mt-5 grid grid-cols-[1fr_76px] gap-2">

                                                      <button

                            type="button"

                            onClick={(event) => {

                              event.preventDefault();

                              event.stopPropagation();

                              void addToCart(product);

                            }}

                            disabled={addingCartId === product.id}

                            className={`flex h-12 items-center justify-center gap-2 bg-[#171513] px-3 text-[13px] font-medium uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-[#6F542E] disabled:cursor-not-allowed disabled:opacity-70 ${

                              cartAddedId === product.id ? "bg-[#80643A]" : ""

                            }`}

                          >

                            {addingCartId === product.id ? (

                              <>

                                <Loader2 size={13} className="animate-spin" />

                                Adding...

                              </>

                            ) : cartAddedId === product.id ? (

                              <>

                                <Check size={13} />

                                Added

                              </>

                            ) : (

                              <>

                                <ShoppingBag size={13} strokeWidth={1.5} />

                                Add to Cart

                              </>

                            )}

                          </button>

                            <button

                              type="button"

                              onClick={(

                                event

                              ) => {

                                event.preventDefault();

                                event.stopPropagation();

                                console.log(

                                  "Request swatches:",

                                  product.id

                                );

                              }}

                              className="flex h-12 items-center justify-center border border-black/10 bg-[#F8F5EF] px-2 text-center text-[13px] uppercase tracking-[0.1em] text-black/60 transition-colors hover:border-[#80643A] hover:text-[#80643A]"

                            >

                              Request

                              <br />

                              Swatches

                            </button>

                          </div>

                          {/* VIEW PRODUCT */}

                          <Link

                            href={`/products/${product.slug}`}

                            className="mt-5 flex items-center justify-center gap-2 text-[13px] font-medium uppercase tracking-[0.2em] text-[#80643A] transition-all duration-300 hover:gap-3"

                          >

                            View Product

                            <ChevronRight

                              size={

                                12

                              }

                            />

                          </Link>

                        </div>

                      </div>

                    );

                  }

                )}

              </div>

            )}

          </div>

        </div>

      </section>

      {/* =====================================================

          MOBILE FILTER DRAWER

      ===================================================== */}

      {mobileFilters && (

        <div className="fixed inset-0 z-[100] lg:hidden">

          {/* OVERLAY */}

          <div

            className="absolute inset-0 bg-black/40"

            onClick={() =>

              setMobileFilters(

                false

              )

            }

          />

          {/* DRAWER */}

          <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm overflow-y-auto bg-[#F8F5EF] p-6">

            <div className="mb-10 flex items-center justify-between">

              <div>

                <p className="text-[13px] uppercase tracking-[0.25em] text-[#A9823A]">

                  Refine

                </p>

                <h2 className="mt-1 font-serif text-2xl">

                  Filters

                </h2>

              </div>

              <button

                onClick={() =>

                  setMobileFilters(

                    false

                  )

                }

                className="flex h-9 w-9 items-center justify-center border border-black/10"

              >

                <X size={16} />

              </button>

            </div>

            {/* CATEGORY */}

            <FilterSection

              title="Category"

              options={

                outdoorCategories

              }

              selected={

                selectedCategory

              }

              onChange={

                setSelectedCategory

              }

            />

            {/* MATERIAL */}

            <MultiSelectFilterSection

              title="Material"

              options={availableMaterials}

              selected={selectedMaterials}

              onChange={setSelectedMaterials}

            />

            {/* CLEAR */}

            <button

              onClick={() => {

                clearFilters();

                setMobileFilters(

                  false

                );

              }}

              className="mt-8 w-full bg-[#171717] py-4 text-xs uppercase tracking-[0.2em] text-white"

            >

              Clear Filters

            </button>

            {/* VIEW */}

            <button

              onClick={() =>

                setMobileFilters(

                  false

                )

              }

              className="mt-3 w-full border border-black/15 py-4 text-xs uppercase tracking-[0.2em]"

            >

              View Products

            </button>

          </div>

       </div>

      )}

      <section className="bg-[#191815] px-6 py-20 text-center text-white md:py-28">

        <p className="text-xs uppercase tracking-[0.35em] text-[#D9B76A]">

          NIRA Haute Living

        </p>

        <h2 className="mx-auto mt-5 max-w-2xl font-serif text-4xl leading-tight md:text-6xl">

          Outdoor spaces with

          <br />

          timeless character.

        </h2>

       <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/55">

          Work with our design team to create

          an outdoor setting that reflects your style,

          personality and way of living.

        </p>

        <Link

          href="/contact"

          className="mt-8 inline-flex items-center gap-3 border border-[#C9A45A] px-7 py-4 text-xs uppercase tracking-[0.25em] text-[#D9B76A] transition-colors hover:bg-[#C9A45A] hover:text-black"

        >

          Enquire Now

          <ChevronRight

            size={14}

          />

       </Link>

      </section>

    </main>

  );

}

function FilterSection({

  title,

  options,

  selected,

  onChange,

}: {

  title: string;

  options: string[];

  selected: string;

  onChange: (

    value: string

  ) => void;

}) {

  return (

    <div className="border-b border-black/10 py-5">

      <div className="mb-4 flex items-center justify-between">

        <p className="text-base uppercase tracking-[0.2em] text-black/70">

          {title}

        </p>

        <ChevronDown

          size={13}

          className="text-black/40"

        />

      </div>

      <div className="space-y-2.5">

        {options.map(

          (option) => {

            const active =

              selected === option;

            return (

              <button

                key={option}

                onClick={() =>

                  onChange(

                    option

                  )

                }

                className={`block w-full text-left text-sm transition-colors ${

                  active

                    ? "font-medium text-[#9C722A]"

                    : "text-black/50 hover:text-black"

                }`}

              >

               <span className="mr-2">

                  {active

                    ? "●"

                    : "○"}

               </span>

                {option}

              </button>

            );

          }

        )}

      </div>

    </div>

  );

}

function MultiSelectFilterSection({

  title,

  options,

  selected,

  onChange,

}: {

  title: string;

  options: string[];

  selected: string[];

  onChange: (values: string[]) => void;

}) {

  const toggleOption = (option: string) => {

    onChange(

      selected.includes(option)

        ? selected.filter((item) => item !== option)

        : [...selected, option],

    );

  };

  return (

    <div className="border-b border-black/10 py-5">

      <div className="mb-4 flex items-center justify-between">

        <p className="text-base uppercase tracking-[0.2em] text-black/70">

          {title}

        </p>

        <ChevronDown size={13} className="text-black/40" />

      </div>

      {selected.length > 0 && (

        <button

          type="button"

          onClick={() => onChange([])}

          className="mb-3 text-[13px] uppercase tracking-[0.15em] text-[#9C722A] underline underline-offset-4"

        >

          Clear material selection ({selected.length})

        </button>

      )}

      <div className="space-y-2.5">

        {options.map((option) => {

          const active = selected.includes(option);

          return (

            <button

              type="button"

              key={option}

              aria-pressed={active}

              onClick={() => toggleOption(option)}

              className={`flex w-full items-center gap-2 text-left text-sm transition-colors ${

                active

                  ? "font-medium text-[#9C722A]"

                  : "text-black/50 hover:text-black"

              }`}

            >

              <span

                className={`flex h-4 w-4 shrink-0 items-center justify-center border ${

                  active

                    ? "border-[#9C722A] bg-[#9C722A] text-white"

                    : "border-black/25 text-transparent"

                }`}

              >

                {active ? <Check size={11} strokeWidth={2.5} /> : null}

              </span>

              <span>{option}</span>

            </button>

          );

        })}

      </div>

    </div>

  );

}
