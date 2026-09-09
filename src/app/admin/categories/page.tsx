import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Edit3,
  FolderTree,
  Plus,
  Trash2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!admin) {
    redirect("/account");
  }

  const { data: categories, error } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      slug,
      description,
      image_url,
      active,
      sort_order,
      created_at
    `)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  async function deleteCategory(formData: FormData) {
    "use server";

    const id = String(formData.get("id") || "");

    if (!id) {
      return;
    }

    const client = await createClient();

    const {
      data: { user: currentUser },
    } = await client.auth.getUser();

    if (!currentUser) {
      redirect("/admin/login");
    }

    const { data: currentAdmin } = await client
      .from("admin_users")
      .select("id")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (!currentAdmin) {
      redirect("/account");
    }

    const { error } = await client
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    redirect("/admin/categories");
  }

  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#171512]">
      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-12 lg:py-16">
        {/* HEADING */}
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
              Categories
            </h1>
          </div>

          <div className="flex items-center gap-3 border border-[#171512]/10 bg-white/40 px-5 py-4">
            <FolderTree
              size={18}
              className="text-[#765A32]"
            />

            <span className="font-sans text-sm font-semibold">
              {categories?.length ?? 0} categories
            </span>
          </div>
        </div>

        {/* ADD CATEGORY */}
        <div className="mb-6">
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 bg-[#171512] px-5 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#765A32]"
          >
            <Plus size={15} />
            Add Category
          </Link>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 border border-red-900/15 bg-red-50 px-5 py-4 font-sans text-sm font-semibold text-red-700">
            {error.message}
          </div>
        )}

        {/* CATEGORY LIST */}
        <div className="overflow-hidden border border-[#171512]/10 bg-white/40">
          {/* TABLE HEADER */}
          <div className="hidden grid-cols-[1.5fr_1.5fr_2fr_1fr_auto] gap-4 border-b border-[#171512]/10 px-6 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#171512]/45 md:grid">
            <span>Category</span>
            <span>Slug</span>
            <span>Description</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {/* CATEGORIES */}
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="grid gap-4 border-b border-[#171512]/10 px-5 py-5 last:border-0 md:grid-cols-[1.5fr_1.5fr_2fr_1fr_auto] md:items-center md:px-6"
              >
                {/* CATEGORY */}
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden border border-[#171512]/10 bg-[#EDE7DC]">
                    {category.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FolderTree
                          size={20}
                          className="text-[#765A32]"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="font-serif text-xl font-semibold">
                      {category.name}
                    </h2>

                    <p className="mt-1 font-sans text-[10px] text-[#171512]/40">
                      Order: {category.sort_order}
                    </p>
                  </div>
                </div>

                {/* SLUG */}
                <div className="font-sans text-sm font-medium text-[#171512]/55">
                  /{category.slug}
                </div>

                {/* DESCRIPTION */}
                <div className="font-sans text-sm font-medium leading-6 text-[#171512]/50">
                  {category.description
                    ? category.description
                    : "No description"}
                </div>

                {/* STATUS */}
                <div>
                  <span
                    className={`inline-flex border px-3 py-2 font-sans text-[9px] font-bold uppercase tracking-[0.15em] ${
                      category.active
                        ? "border-[#765A32]/20 text-[#765A32]"
                        : "border-[#171512]/10 text-[#171512]/40"
                    }`}
                  >
                    {category.active ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/categories/${category.id}`}
                    aria-label="Edit category"
                    className="border border-[#171512]/10 p-3 transition-colors hover:border-[#765A32] hover:text-[#765A32]"
                  >
                    <Edit3 size={15} />
                  </Link>

                  <form action={deleteCategory}>
                    <input
                      type="hidden"
                      name="id"
                      value={category.id}
                    />

                    <button
                      type="submit"
                      aria-label="Delete category"
                      className="border border-[#171512]/10 p-3 transition-colors hover:border-red-700 hover:text-red-700"
                    >
                      <Trash2 size={15} />
                    </button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            /* EMPTY STATE */
            <div className="px-6 py-20 text-center">
              <FolderTree
                className="mx-auto text-[#765A32]"
                size={30}
              />

              <h2 className="mt-5 font-serif text-3xl font-semibold">
                No categories yet
              </h2>

              <p className="mt-2 font-sans text-sm text-[#171512]/50">
                Create your first NIRA product category.
              </p>

              <Link
                href="/admin/categories/new"
                className="mt-7 inline-flex bg-[#171512] px-6 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#765A32]"
              >
                Add Category
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}