import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  FolderTree,
  Home,
  TreePine,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

const mainCategories = [
  {
    name: "Indoor",
    description:
      "Manage categories and furniture collections designed for refined indoor living.",
    href: "/admin/categories/indoor",
    icon: Home,
  },
  {
    name: "Outdoor",
    description:
      "Manage categories and furniture collections created for elegant outdoor spaces.",
    href: "/admin/categories/outdoor",
    icon: TreePine,
  },
];

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  // =========================
  // ADMIN AUTHENTICATION
  // =========================

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

  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#171512]">
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-12 lg:py-16">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

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

            <p className="mt-4 max-w-xl font-sans text-sm leading-6 text-[#171512]/50">
              Choose a furniture collection to manage its subcategories.
            </p>
          </div>

          {/* CATEGORY COUNT */}

          <div className="flex items-center gap-3 border border-[#171512]/10 bg-white/40 px-5 py-4">
            <FolderTree
              size={18}
              className="text-[#765A32]"
            />

            <span className="font-sans text-sm font-semibold">
              2 collections
            </span>
          </div>

        </div>

        {/* =========================
            MAIN CATEGORIES
        ========================= */}

        <div className="grid gap-6 md:grid-cols-2">

          {mainCategories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={category.href}
                className="group relative overflow-hidden border border-[#171512]/10 bg-white/50 p-7 transition-all duration-500 hover:border-[#765A32]/40 hover:bg-white hover:shadow-[0_20px_60px_rgba(23,21,18,0.08)] sm:p-9"
              >
                {/* Decorative background */}

                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-[#765A32]/10 transition-transform duration-700 group-hover:scale-125" />

                <div className="relative flex min-h-[280px] flex-col justify-between">

                  {/* ICON */}

                  <div className="flex items-start justify-between">

                    <div className="flex h-14 w-14 items-center justify-center border border-[#765A32]/20 bg-[#F7F4EE] text-[#765A32] transition-all duration-500 group-hover:border-[#765A32] group-hover:bg-[#765A32] group-hover:text-white">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center border border-[#171512]/10 transition-all duration-300 group-hover:border-[#765A32] group-hover:bg-[#765A32] group-hover:text-white">
                      <ChevronRight
                        size={17}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>

                  </div>

                  {/* CONTENT */}

                  <div>

                    <p className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#765A32]">
                      Collection
                    </p>

                    <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
                      {category.name}
                    </h2>

                    <p className="mt-4 max-w-md font-sans text-sm leading-6 text-[#171512]/50">
                      {category.description}
                    </p>

                  </div>

                  {/* FOOTER */}

                  <div className="mt-8 flex items-center justify-between border-t border-[#171512]/10 pt-5">

                    <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#171512]/40">
                      Manage Subcategories
                    </span>

                    <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#765A32]">
                      Open Collection
                    </span>

                  </div>

                </div>
              </Link>
            );
          })}

        </div>

        {/* =========================
            INFORMATION
        ========================= */}

        <div className="mt-8 border border-[#171512]/10 bg-[#EDE7DC]/50 px-6 py-5">

          <div className="flex gap-4">

            <FolderTree
              size={18}
              className="mt-0.5 shrink-0 text-[#765A32]"
            />

            <div>
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#765A32]">
                Category Structure
              </p>

              <p className="mt-2 font-sans text-sm leading-6 text-[#171512]/50">
                Indoor and Outdoor are the two primary furniture collections.
                Select a collection above to manage its individual
                subcategories.
              </p>
            </div>

          </div>

        </div>

      </section>
    </main>
  );
}