import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowRight, ShoppingBag, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type WishlistProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  main_image_url: string | null;
  short_description: string | null;
  material: string | null;
};

type WishlistItem = {
  id: string;
  product_id: string;
  products: WishlistProduct | WishlistProduct[] | null;
};

export default async function WishlistPage() {
  const supabase = await createClient();

  /* =========================================================
     AUTH
  ========================================================= */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /* =========================================================
     NOT SIGNED IN
  ========================================================= */

  if (!user) {
    return (
      <main className="min-h-screen bg-[#F7F4EE]">
        <section className="flex min-h-[75vh] items-center justify-center px-5 py-20 sm:px-8">

          <div className="w-full max-w-lg text-center">

            {/* ICON */}

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#B88A2B]/20 bg-[#FBF9F3]">
              <Heart
                size={30}
                strokeWidth={1.2}
                className="text-[#765A32]"
              />
            </div>

            {/* EYEBROW */}

            <p
              className="
                mt-8
                font-sans
                text-[10px]
                font-bold
                uppercase
                tracking-[0.28em]
                text-[#765A32]
              "
            >
              Wishlist
            </p>

            {/* HEADING */}

            <h1
              className="
                mt-3
                font-serif
                text-4xl
                font-medium
                tracking-[-0.035em]
                text-[#171512]
                sm:text-5xl
              "
            >
              Please sign in first
            </h1>

            {/* MESSAGE */}

            <p
              className="
                mx-auto
                mt-5
                max-w-md
                font-sans
                text-sm
                font-medium
                leading-7
                text-[#6F685D]
              "
            >
              You need to sign in to view your
              wishlist and save your favourite
              NIRA furniture pieces.
            </p>

            {/* SIGN IN */}

            <Link
              href="/login?next=/wishlist"
              className="
                group
                mx-auto
                mt-8
                inline-flex
                h-12
                items-center
                gap-3
                bg-[#171512]
                px-7
                font-sans
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-white
                transition-all
                duration-300
                hover:bg-[#765A32]
              "
            >
              <LogIn
                size={15}
                strokeWidth={1.5}
              />

              Go to Sign In

              <ArrowRight
                size={15}
                strokeWidth={1.5}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>

            {/* CONTINUE SHOPPING */}

            <Link
              href="/collections"
              className="
                mt-5
                inline-flex
                font-sans
                text-[9px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#765A32]
                transition-colors
                duration-300
                hover:text-[#171512]
              "
            >
              Continue Shopping
            </Link>

          </div>

        </section>
      </main>
    );
  }

  /* =========================================================
     FETCH WISHLIST
  ========================================================= */

  const { data, error } = await supabase
    .from("wishlist_items")
    .select(`
      id,
      product_id,
      products (
        id,
        name,
        slug,
        price,
        main_image_url,
        short_description,
        material
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Wishlist fetch error:",
      error,
    );
  }

  const wishlistItems: WishlistItem[] =
    (data as WishlistItem[]) || [];

  /* =========================================================
     EMPTY WISHLIST
  ========================================================= */

  if (wishlistItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#F7F4EE]">
        <section className="mx-auto flex min-h-[75vh] max-w-7xl items-center justify-center px-5 py-20 sm:px-8 lg:px-12">
          <div className="w-full max-w-xl text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#B88A2B]/20 bg-[#FBF9F3]">
              <Heart
                size={30}
                strokeWidth={1.2}
                className="text-[#765A32]"
              />
            </div>

            <p
              className="
                mt-8
                font-sans
                text-[10px]
                font-bold
                uppercase
                tracking-[0.28em]
                text-[#765A32]
              "
            >
              Your Collection
            </p>

            <h1
              className="
                mt-3
                font-serif
                text-4xl
                font-medium
                tracking-[-0.035em]
                text-[#171512]
                sm:text-5xl
              "
            >
              Your wishlist is empty
            </h1>

            <p
              className="
                mx-auto
                mt-5
                max-w-md
                font-sans
                text-sm
                font-medium
                leading-7
                text-[#6F685D]
              "
            >
              Save pieces you love and return to
              them whenever you are ready.
            </p>

            <Link
              href="/collections"
              className="
                group
                mx-auto
                mt-8
                inline-flex
                h-12
                items-center
                gap-4
                bg-[#171512]
                px-7
                font-sans
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-white
                transition-all
                duration-300
                hover:bg-[#765A32]
              "
            >
              Explore Collections

              <ArrowRight
                size={15}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>
        </section>
      </main>
    );
  }

  /* =========================================================
     NORMAL WISHLIST
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#F7F4EE]">

      <section className="border-b border-[#171512]/10">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8 sm:pb-16 sm:pt-20 lg:px-12">

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <div>
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.28em] text-[#765A32]">
                Saved Pieces
              </p>

              <h1 className="mt-3 font-serif text-5xl font-medium leading-none tracking-[-0.04em] text-[#171512] sm:text-6xl lg:text-7xl">
                Wishlist
              </h1>

              <p className="mt-5 max-w-xl font-sans text-sm font-medium leading-7 text-[#6F685D]">
                A private collection of pieces
                you have saved for later.
              </p>
            </div>

            <div className="flex items-center gap-3 border border-[#B88A2B]/20 bg-[#FBF9F3] px-4 py-3">

              <Heart
                size={16}
                strokeWidth={1.3}
                className="text-[#765A32]"
              />

              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-[#765A32]">
                {wishlistItems.length}{" "}
                {wishlistItems.length === 1
                  ? "Piece"
                  : "Pieces"}
              </span>

            </div>

          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">

          {wishlistItems.map((item) => {

            const product = Array.isArray(item.products)
              ? item.products[0]
              : item.products;

            if (!product) return null;

            return (
              <article
                key={item.id}
                className="group"
              >

                <Link
                  href={`/products/${product.slug}`}
                  className="relative block aspect-[4/5] overflow-hidden bg-[#E9E3D9]"
                >

                  {product.main_image_url ? (
                    <Image
                      src={product.main_image_url}
                      alt={product.name}
                      fill
                      sizes="
                        (max-width: 640px) 100vw,
                        (max-width: 1024px) 50vw,
                        33vw
                      "
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#E9E3D9]">
                      <ShoppingBag
                        size={32}
                        strokeWidth={1}
                        className="text-[#765A32]/40"
                      />
                    </div>
                  )}

                  <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#765A32] text-white shadow-sm">
                    <Heart
                      size={15}
                      strokeWidth={1.5}
                      fill="currentColor"
                    />
                  </div>

                  <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center bg-[#F7F4EE]/95 text-[#171512] opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <ArrowRight
                      size={16}
                      strokeWidth={1.3}
                    />
                  </div>

                </Link>

                <div className="pt-5">

                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">

                      <Link
                        href={`/products/${product.slug}`}
                        className="font-serif text-[22px] font-medium leading-tight tracking-[-0.015em] text-[#241F18] transition-colors duration-300 hover:text-[#765A32]"
                      >
                        {product.name}
                      </Link>

                      {product.material && (
                        <p className="mt-2 font-sans text-[10px] font-semibold uppercase tracking-[0.13em] text-[#8A8174]">
                          {product.material}
                        </p>
                      )}

                    </div>

                    <span className="shrink-0 font-sans text-sm font-bold text-[#765A32]">
                      $
                      {Number(product.price).toLocaleString("en-US")}
                    </span>

                  </div>

                  {product.short_description && (
                    <p className="mt-3 line-clamp-2 font-sans text-[12px] font-medium leading-5 text-[#777066]">
                      {product.short_description}
                    </p>
                  )}

                  <Link
                    href={`/products/${product.slug}`}
                    className="group/link mt-5 inline-flex items-center gap-3 border-b border-[#765A32]/30 pb-1.5 font-sans text-[9px] font-bold uppercase tracking-[0.18em] text-[#765A32] transition-all duration-300 hover:border-[#765A32]"
                  >
                    View Product

                    <ArrowRight
                      size={13}
                      strokeWidth={1.4}
                      className="transition-transform duration-300 group-hover/link:translate-x-1"
                    />
                  </Link>

                </div>

              </article>
            );
          })}

        </div>

      </section>

    </main>
  );
}