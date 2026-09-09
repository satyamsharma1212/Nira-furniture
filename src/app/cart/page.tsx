import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function CartPage() {
  const supabase = await createClient();

  /* =========================================================
     CHECK LOGIN
  ========================================================= */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/cart");
  }

  /* =========================================================
     GET CART
  ========================================================= */

  const { data: cartItems, error } = await supabase
    .from("cart_items")
    .select(`
      id,
      quantity,
      product_id,
      products (
        id,
        name,
        slug,
        price,
        main_image_url,
        short_description
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Cart error:", error);
  }

  const items = cartItems || [];

  /* =========================================================
     TOTAL
  ========================================================= */

  const subtotal = items.reduce((total, item) => {
    const product = Array.isArray(item.products)
      ? item.products[0]
      : item.products;

    const price = Number(product?.price || 0);

    return total + price * item.quantity;
  }, 0);

  return (
    <main className="min-h-screen bg-[#FAF8F2] text-[#241F18]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="border-b border-[#B8860B]/15 pt-[90px]">

        <div className="mx-auto max-w-[1280px] px-6 py-14 sm:px-10 lg:px-16 lg:py-20">

          <Link
            href="/products"
            className="mb-10 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#756B5B] transition-colors hover:text-[#B8860B]"
          >
            <ArrowLeft size={15} />
            Continue Shopping
          </Link>

          <div className="flex items-center gap-5">

            <ShoppingBag
              size={30}
              strokeWidth={1.4}
              className="text-[#B8860B]"
            />

            <div>

              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#B8860B]">
                Your Selection
              </p>

              <h1 className="mt-2 font-serif text-5xl font-semibold tracking-[-0.03em] sm:text-6xl">
                Your Cart
              </h1>

            </div>

          </div>

          <p className="mt-6 max-w-2xl text-[16px] font-medium leading-7 text-[#756B5B]">
            Review the pieces you have selected
            before continuing with your enquiry.
          </p>

        </div>

      </section>

      {/* =====================================================
          CART
      ===================================================== */}

      <section className="mx-auto max-w-[1280px] px-6 py-14 sm:px-10 lg:px-16 lg:py-20">

        {items.length === 0 ? (

          /* =================================================
             EMPTY CART
          ================================================= */

          <div className="mx-auto max-w-2xl border border-[#241F18]/10 bg-white px-8 py-16 text-center sm:px-12">

            <ShoppingBag
              size={48}
              strokeWidth={1.3}
              className="mx-auto text-[#B8860B]"
            />

            <h2 className="mt-7 font-serif text-4xl font-semibold">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-[15px] font-medium leading-7 text-[#756B5B]">
              You have not added any furniture to
              your selection yet. Explore our collection
              and find something made for your space.
            </p>

            <Link
              href="/products"
              className="group mt-8 inline-flex min-h-14 items-center justify-center gap-3 bg-[#241F18] px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#B8860B]"
            >
              Explore Collection

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

          </div>

        ) : (

          <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">

            {/* =================================================
               ITEMS
            ================================================= */}

            <div>

              <div className="mb-6 flex items-center justify-between border-b border-[#241F18]/10 pb-5">

                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8A8174]">
                  {items.length}{" "}
                  {items.length === 1
                    ? "Item"
                    : "Items"}
                </p>

              </div>

              <div className="space-y-5">

                {items.map((item) => {

                  const product = Array.isArray(
                    item.products,
                  )
                    ? item.products[0]
                    : item.products;

                  if (!product) {
                    return null;
                  }

                  const price = Number(
                    product.price || 0,
                  );

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-5 border-b border-[#241F18]/10 pb-6 sm:flex-row"
                    >

                      {/* IMAGE */}

                      <Link
                        href={`/products/${product.slug}`}
                        className="relative block aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#F1EDE3] sm:h-40 sm:w-48"
                      >
                        <Image
                          src={
                            product.main_image_url ||
                            "/hero/nira-hero.jpg"
                          }
                          alt={product.name}
                          fill
                          unoptimized
                          sizes="192px"
                          className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                        />
                      </Link>

                      {/* DETAILS */}

                      <div className="flex flex-1 flex-col">

                        <Link
                          href={`/products/${product.slug}`}
                          className="font-serif text-2xl font-semibold leading-tight transition-colors hover:text-[#B8860B]"
                        >
                          {product.name}
                        </Link>

                        {product.short_description && (
                          <p className="mt-2 line-clamp-2 text-[13px] font-medium leading-6 text-[#756B5B]">
                            {product.short_description}
                          </p>
                        )}

                        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">

                          <div>

                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">
                              Quantity
                            </p>

                            <p className="mt-1 text-[14px] font-semibold text-[#5D5549]">
                              {item.quantity}
                            </p>

                          </div>

                          <div className="text-right">

                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">
                              Price
                            </p>

                            <p className="mt-1 text-[18px] font-semibold">
                              ₹
                              {price.toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                },
                              )}
                            </p>

                          </div>

                        </div>

                        {/* REMOVE */}

                        <div className="mt-4">

                          <button
                            type="button"
                            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A8174] transition-colors hover:text-red-700"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

            {/* =================================================
               SUMMARY
            ================================================= */}

            <aside>

              <div className="sticky top-28 border border-[#B8860B]/20 bg-[#F1EDE3] p-7 sm:p-9">

                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B8860B]">
                  Order Summary
                </p>

                <h2 className="mt-3 font-serif text-3xl font-semibold">
                  Your Selection
                </h2>

                <div className="my-7 h-px bg-[#241F18]/10" />

                <div className="flex items-center justify-between">

                  <span className="text-[13px] font-semibold text-[#756B5B]">
                    Items
                  </span>

                  <span className="text-[14px] font-semibold">
                    {items.reduce(
                      (total, item) =>
                        total + item.quantity,
                      0,
                    )}
                  </span>

                </div>

                <div className="mt-4 flex items-center justify-between">

                  <span className="text-[13px] font-semibold text-[#756B5B]">
                    Subtotal
                  </span>

                  <span className="text-[20px] font-semibold">
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                      },
                    )}
                  </span>

                </div>

                <p className="mt-5 text-[12px] font-medium leading-6 text-[#8A8174]">
                  Final pricing may vary depending
                  on customization, materials, finishes
                  and delivery requirements.
                </p>

                <Link
                  href="/quote"
                  className="group mt-7 inline-flex min-h-14 w-full items-center justify-center gap-3 bg-[#B8860B] px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#241F18]"
                >
                  Request a Quote

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/products"
                  className="mt-3 inline-flex min-h-12 w-full items-center justify-center border border-[#241F18]/15 bg-white px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#5D5549] transition-colors hover:border-[#B8860B] hover:text-[#B8860B]"
                >
                  Continue Shopping
                </Link>

              </div>

            </aside>

          </div>

        )}

      </section>

    </main>
  );
}