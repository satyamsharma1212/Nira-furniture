"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Check,
  Loader2,
} from "lucide-react";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

export type CollectionProduct = {
  id?: string;
  slug: string;
  name: string;

  category?: string;
  categorySlug?: string;

  description?: string;

  image?: string;
  images?: string[];

  price?: number | string;

  material?: string;
  dimensions?: string;
  weight?: string;

  featured?: boolean;
  new_arrival?: boolean;

  [key: string]: any;
};

function inferMaterial(product: CollectionProduct) {
  const text = `
    ${product.name}
    ${product.description ?? ""}
    ${product.material ?? ""}
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

  if (text.includes("walnut")) {
    return "Fumed Walnut";
  }

  if (
    text.includes("cord") ||
    text.includes("braided")
  ) {
    return "Braided Cord";
  }

  return "Premium Finish";
}

export default function CollectionProductCard({
  product,
}: {
  product: CollectionProduct;
}) {
  const supabase = createClient();

  /* =========================================================
     STATES
  ========================================================= */

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const [wishlistLoading, setWishlistLoading] =
    useState(false);

  const [wishlisted, setWishlisted] =
    useState(false);

  /* =========================================================
     PRODUCT IMAGE
  ========================================================= */

  const image =
    product.image ||
    product.images?.[0] ||
    "/placeholder.jpg";

  /* =========================================================
     CATEGORY
  ========================================================= */

  const category =
    product.category ||
    "NIRA COLLECTION";

  /* =========================================================
     MATERIAL
  ========================================================= */

  const material =
    product.material ||
    inferMaterial(product);

  /* =========================================================
     DIMENSIONS
  ========================================================= */

  const dimensions =
    product.dimensions ||
    "Dimensions available on request";

  /* =========================================================
     PRICE
  ========================================================= */

  const price =
    typeof product.price === "number"
      ? `₹${product.price.toLocaleString("en-IN")}`
      : product.price || "Price on Request";

  /* =========================================================
     PRODUCT URL
  ========================================================= */

  const productUrl =
    `/products/${product.slug}`;

  /* =========================================================
     GET PRODUCT ID
  ========================================================= */

  async function getProductId() {
    if (product.id) {
      return product.id;
    }

    const { data, error } = await supabase
      .from("products")
      .select("id")
      .eq("slug", product.slug)
      .single();

    if (error || !data) {
      throw new Error("Product not found.");
    }

    return data.id;
  }

  /* =========================================================
     ADD TO CART
  ========================================================= */

  async function handleAddToCart() {
    if (adding || added) return;

    setAdding(true);

    try {
      /* -------------------------------------------------------
         CHECK LOGIN
      ------------------------------------------------------- */

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href =
          `/login?next=${encodeURIComponent(
            window.location.pathname,
          )}`;

        return;
      }

      /* -------------------------------------------------------
         GET PRODUCT ID
      ------------------------------------------------------- */

      const productId =
        await getProductId();

      /* -------------------------------------------------------
         CHECK EXISTING CART ITEM
      ------------------------------------------------------- */

      const {
        data: existingItem,
        error: existingError,
      } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      /* -------------------------------------------------------
         UPDATE EXISTING ITEM
      ------------------------------------------------------- */

      if (existingItem) {
        const { error } =
          await supabase
            .from("cart_items")
            .update({
              quantity:
                existingItem.quantity + 1,
              updated_at:
                new Date().toISOString(),
            })
            .eq("id", existingItem.id);

        if (error) {
          throw error;
        }
      }

      /* -------------------------------------------------------
         ADD NEW ITEM
      ------------------------------------------------------- */

      else {
        const { error } =
          await supabase
            .from("cart_items")
            .insert({
              user_id: user.id,
              product_id: productId,
              quantity: 1,
            });

        if (error) {
          throw error;
        }
      }

      /* -------------------------------------------------------
         SUCCESS
      ------------------------------------------------------- */

      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Add to cart error:",
        error,
      );

      alert(
        "Unable to add this product to your cart. Please try again.",
      );
    } finally {
      setAdding(false);
    }
  }

  /* =========================================================
     WISHLIST
  ========================================================= */

  async function handleWishlist() {
    if (wishlistLoading) return;

    setWishlistLoading(true);

    try {
      /* -------------------------------------------------------
         CHECK LOGIN
      ------------------------------------------------------- */

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href =
          `/login?next=${encodeURIComponent(
            window.location.pathname,
          )}`;

        return;
      }

      /* -------------------------------------------------------
         GET PRODUCT ID
      ------------------------------------------------------- */

      const productId =
        await getProductId();

      /* -------------------------------------------------------
         CHECK EXISTING WISHLIST ITEM
      ------------------------------------------------------- */

      const {
        data: existingItem,
        error: existingError,
      } = await supabase
        .from("wishlist_items")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      /* -------------------------------------------------------
         REMOVE FROM WISHLIST
      ------------------------------------------------------- */

      if (existingItem) {
        const { error } =
          await supabase
            .from("wishlist_items")
            .delete()
            .eq("id", existingItem.id);

        if (error) {
          throw error;
        }

        setWishlisted(false);
      }

      /* -------------------------------------------------------
         ADD TO WISHLIST
      ------------------------------------------------------- */

      else {
        const { error } =
          await supabase
            .from("wishlist_items")
            .insert({
              user_id: user.id,
              product_id: productId,
            });

        if (error) {
          throw error;
        }

        setWishlisted(true);
      }
    } catch (error) {
      console.error(
        "Wishlist error:",
        error,
      );

      alert(
        "Unable to update your wishlist. Please try again.",
      );
    } finally {
      setWishlistLoading(false);
    }
  }

  return (
    <article className="group overflow-hidden rounded-[6px] bg-[#F0EDE6] shadow-[0_10px_40px_rgba(23,21,18,0.035)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(23,21,18,0.10)]">

      {/* =====================================================
          IMAGE
      ====================================================== */}

      <Link
        href={productUrl}
        className="relative block aspect-[1.22/1] overflow-hidden bg-[#DDD8CE]"
      >
        <Image
          src={image}
          alt={product.name}
          fill
          unoptimized
          sizes="(min-width: 1280px) 31vw, (min-width: 1024px) 30vw, (min-width: 640px) 48vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
        />

        {/* IMAGE GRADIENT */}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/40 to-transparent" />

        {/* CATEGORY */}

        <div className="absolute left-4 top-4 bg-[#F7F4EE]/95 px-3.5 py-2.5">
          <span className="font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-[#765A32]">
            {category}
          </span>
        </div>

        {/* DELIVERY */}

        <div className="absolute left-4 top-[53px] bg-[#F4E4C8]/95 px-3.5 py-2.5">
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.12em] text-[#765A32]">
            White-Glove Delivery
          </span>
        </div>

        {/* =================================================
            WISHLIST HEART
        ================================================== */}

        <button
          type="button"
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name} to wishlist`
          }
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            handleWishlist();
          }}
          disabled={wishlistLoading}
          className={`
            absolute right-4 top-4
            flex h-10 w-10 items-center justify-center
            rounded-full
            backdrop-blur-sm
            transition-all duration-500
            hover:scale-110
            hover:rotate-3
            active:scale-90
            disabled:cursor-wait
            disabled:opacity-70
            ${
              wishlisted
                ? "bg-[#765A32] text-white"
                : "bg-[#F7F4EE]/90 text-[#171512] hover:bg-[#171512] hover:text-white"
            }
          `}
        >
          {wishlistLoading ? (
            <Loader2
              size={15}
              strokeWidth={1.5}
              className="animate-spin"
            />
          ) : (
            <Heart
              size={16}
              strokeWidth={
                wishlisted ? 2 : 1.2
              }
              fill={
                wishlisted
                  ? "currentColor"
                  : "none"
              }
            />
          )}
        </button>

        {/* IMAGE INFO */}

        <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 bg-black/50 px-3.5 py-3 font-sans text-[11px] uppercase tracking-[0.11em] text-white backdrop-blur-sm">
          <span className="truncate">
            {dimensions}
          </span>

          <span className="shrink-0">
            {category
              .toLowerCase()
              .includes("outdoor")
              ? "Atelier Crafted"
              : "Made to Order"}
          </span>
        </div>
      </Link>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="px-6 pb-7 pt-6 sm:px-7">

        {/* CATEGORY + MATERIAL */}

        <div className="flex items-center justify-between gap-4">

          <span className="font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-[#765A32]">
            {category}
          </span>

          <span className="truncate font-sans text-[11px] tracking-[0.04em] text-[#171512]/45">
            ● FSC® {material}
          </span>

        </div>

        {/* PRODUCT NAME */}

        <Link
          href={productUrl}
          className="mt-4 block font-serif text-[31px] font-normal leading-[1.08] tracking-[-0.025em] text-[#171512] transition-opacity hover:opacity-60 sm:text-[34px]"
        >
          {product.name}
        </Link>

        {/* DESCRIPTION */}

        <p className="mt-4 line-clamp-2 min-h-[52px] font-sans text-[13px] leading-[1.7] text-[#171512]/55 sm:text-[14px]">
          {product.description ||
            "Thoughtfully crafted from exceptional materials for refined residential and hospitality spaces."}
        </p>

        {/* MATERIAL CHIPS */}

        <div className="mt-5 flex flex-wrap gap-2">

          {[
            material,
            "Hand Finished",
            "Made to Order",
          ].map((chip) => (
            <span
              key={chip}
              className="border border-[#171512]/10 bg-[#F7F4EE] px-3 py-1.5 font-sans text-[11px] uppercase tracking-[0.1em] text-[#171512]/60 transition-colors group-hover:border-[#765A32]/20"
            >
              {chip}
            </span>
          ))}

        </div>

        {/* PRICE */}

        <div className="mt-7 flex items-end justify-between gap-5 border-t border-[#171512]/10 pt-5">

          <div>
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.15em] text-[#765A32]">
              Acquisition Value
            </p>

            <p className="mt-1.5 font-sans text-[19px] font-medium tracking-[-0.01em] text-[#171512]">
              {price}
            </p>
          </div>

          <div className="text-right">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.15em] text-[#765A32]">
              Concierge Desk
            </p>

            <p className="mt-1.5 font-sans text-[12px] text-[#171512]/55">
              12 month plan
            </p>
          </div>

        </div>

        {/* =====================================================
            ACTIONS
        ====================================================== */}

        <div className="mt-5 grid grid-cols-[1fr_auto] gap-2.5">

          {/* ADD TO CART */}

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={adding}
            className={`
              inline-flex
              items-center
              justify-center
              gap-2
              px-4
              py-3.5
              font-sans
              text-[12px]
              font-medium
              uppercase
              tracking-[0.13em]
              text-white
              transition-all
              duration-300
              ${
                added
                  ? "bg-[#765A32]"
                  : "bg-[#171512] hover:bg-[#765A32]"
              }
              disabled:cursor-not-allowed
              disabled:opacity-70
            `}
          >

            {adding ? (
              <>
                <Loader2
                  size={14}
                  className="animate-spin"
                />

                Adding...
              </>
            ) : added ? (
              <>
                <Check size={14} />

                Added
              </>
            ) : (
              <>
                <ShoppingBag size={14} />

                Add to Cart
              </>
            )}

          </button>

          {/* REQUEST SWATCHES */}

          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-[#171512]/10 bg-[#F7F4EE] px-4 py-3.5 text-center font-sans text-[11px] font-medium uppercase tracking-[0.1em] text-[#171512]/70 transition-all duration-300 hover:border-[#765A32]/40 hover:text-[#765A32]"
          >
            Request
            <br />
            Swatches
          </Link>

        </div>

        {/* VIEW PRODUCT */}

        <Link
          href={productUrl}
          className="mt-3 flex items-center justify-center gap-2 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#765A32] transition-opacity hover:opacity-60"
        >
          View Product

          <ArrowRight
            size={12}
            strokeWidth={1.3}
          />
        </Link>

      </div>
    </article>
  );
}