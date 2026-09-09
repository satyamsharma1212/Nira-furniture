import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Edit3,
  PackagePlus,
  Plus,
  Trash2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

type PageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

export default async function AdminProductsPage({
  searchParams,
}: PageProps) {
  const supabase = await createClient();

  const { category } = await searchParams;

  /* =========================================================
     AUTHENTICATION
  ========================================================= */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  /* =========================================================
     ADMIN CHECK
  ========================================================= */

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!admin) {
    redirect("/account");
  }

  /* =========================================================
     LOAD CATEGORIES
  ========================================================= */

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  /* =========================================================
     LOAD PRODUCTS
  ========================================================= */

  let productQuery = supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      status,
      featured,
      new_arrival,
      main_image_url,
      stock,
      created_at,
      categories(name)
    `);

  if (category) {
    productQuery = productQuery.eq("category_id", category);
  }

  const { data: products, error } = await productQuery.order(
    "created_at",
    { ascending: false }
  );

  /* =========================================================
     DELETE PRODUCT
  ========================================================= */

  async function deleteProduct(formData: FormData) {
    "use server";

    const id = String(formData.get("id") || "");

    if (!id) {
      return;
    }

    const client = await createClient();

    /* -------------------------------------------------------
       CHECK AUTHENTICATION
    ------------------------------------------------------- */

    const {
      data: { user: currentUser },
    } = await client.auth.getUser();

    if (!currentUser) {
      redirect("/admin/login");
    }

    /* -------------------------------------------------------
       CHECK ADMIN
    ------------------------------------------------------- */

    const { data: currentAdmin } = await client
      .from("admin_users")
      .select("id")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (!currentAdmin) {
      redirect("/account");
    }

    /* -------------------------------------------------------
       DELETE PRODUCT
    ------------------------------------------------------- */

    const { error } = await client
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    redirect("/admin/products");
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#171512]">
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-12 lg:py-16">

        {/* ===================================================
            PAGE HEADING
        =================================================== */}

        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-5 inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#171512]/45 transition-colors hover:text-[#765A32]"
            >
              <ArrowLeft size={14} />
              Dashboard
            </Link>

            <p className="mb-3 font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-[#765A32]">
              Catalog
            </p>

            <h1 className="font-serif text-5xl font-semibold tracking-[-0.03em] sm:text-6xl">
              Products
            </h1>
          </div>

          {/* PRODUCT COUNT */}

          <div className="flex items-center gap-3 border border-[#171512]/10 bg-white/40 px-5 py-4">
            <PackagePlus
              size={18}
              className="text-[#765A32]"
            />

            <span className="font-sans text-sm font-semibold">
              {products?.length ?? 0} products
            </span>
          </div>
        </div>

        {/* ===================================================
            ADD PRODUCT + CATEGORY FILTER
        =================================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* ADD PRODUCT */}

          <Link
            href="/admin/products/new"
            className="inline-flex w-fit items-center gap-2 bg-[#171512] px-5 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#765A32]"
          >
            <Plus size={15} />
            Add Product
          </Link>

          {/* CATEGORY FILTER */}

          <form
            method="GET"
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <select
              name="category"
              defaultValue={category || ""}
              className="min-w-[240px] border border-[#171512]/10 bg-white/60 px-4 py-3 font-sans text-sm font-medium text-[#171512] outline-none transition-colors focus:border-[#765A32]"
            >
              <option value="">
                All Categories
              </option>

              {categories?.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-[#171512] px-5 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#765A32]"
            >
              Filter
            </button>

            {category && (
              <Link
                href="/admin/products"
                className="px-2 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#765A32] transition-colors hover:text-[#171512]"
              >
                Clear
              </Link>
            )}
          </form>
        </div>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="mb-6 border border-red-900/15 bg-red-50 px-5 py-4 font-sans text-sm font-semibold text-red-700">
            {error.message}
          </div>
        )}

        {/* ===================================================
            PRODUCTS TABLE
        =================================================== */}

        <div className="overflow-hidden border border-[#171512]/10 bg-white/40">

          {/* TABLE HEADER */}

          <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-[#171512]/10 px-6 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#171512]/45 md:grid">
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {/* PRODUCTS */}

          {products && products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="grid gap-4 border-b border-[#171512]/10 px-5 py-5 last:border-0 md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-center md:px-6"
              >

                {/* PRODUCT */}

                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden border border-[#171512]/10 bg-[#EDE7DC]">
                    {product.main_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.main_image_url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center font-serif text-2xl text-[#765A32]">
                        N
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="font-serif text-xl font-semibold">
                      {product.name}
                    </h2>

                    <p className="mt-1 font-sans text-[10px] font-medium text-[#171512]/40">
                      /{product.slug}
                    </p>
                  </div>
                </div>

                {/* CATEGORY */}

                <div className="font-sans text-sm font-medium text-[#171512]/60">
                  {(
                    product.categories as unknown as {
                      name?: string;
                    } | null
                  )?.name || "Uncategorised"}
                </div>

                {/* PRICE */}

                <div className="font-sans text-sm font-semibold">
                  $
                  {Number(product.price || 0).toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </div>

                {/* STATUS */}

                <div>
                  <span className="inline-flex border border-[#171512]/10 px-3 py-2 font-sans text-[9px] font-bold uppercase tracking-[0.15em]">
                    {product.status}
                  </span>
                </div>

                {/* ACTIONS */}

                <div className="flex items-center gap-2">

                  {/* EDIT */}

                  <Link
                    href={`/admin/products/${product.id}`}
                    aria-label="Edit product"
                    className="border border-[#171512]/10 p-3 transition-colors hover:border-[#765A32] hover:text-[#765A32]"
                  >
                    <Edit3 size={15} />
                  </Link>

                  {/* DELETE */}

                  <form action={deleteProduct}>
                    <input
                      type="hidden"
                      name="id"
                      value={product.id}
                    />

                    <button
                      type="submit"
                      aria-label="Delete product"
                      className="border border-[#171512]/10 p-3 transition-colors hover:border-red-700 hover:text-red-700"
                    >
                      <Trash2 size={15} />
                    </button>
                  </form>

                </div>
              </div>
            ))
          ) : (

            /* =================================================
               EMPTY STATE
            ================================================= */

            <div className="px-6 py-20 text-center">
              <PackagePlus
                className="mx-auto text-[#765A32]"
                size={30}
              />

              <h2 className="mt-5 font-serif text-3xl font-semibold">
                No products found
              </h2>

              <p className="mt-2 font-sans text-sm text-[#171512]/50">
                No products are available in this category.
              </p>

              <Link
                href="/admin/products"
                className="mt-7 inline-flex items-center gap-2 bg-[#171512] px-6 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#765A32]"
              >
                View All Products
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}