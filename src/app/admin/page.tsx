import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  ArrowUpRight,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id, email")
    .eq("id", user.id)
    .maybeSingle();

  if (!admin) {
    redirect("/account");
  }

  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#171512]">

      {/* HEADER */}
    

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-12 lg:py-16">

        <div className="mb-12">
          <p className="mb-4 font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-[#765A32]">
            Administration
          </p>

          <h1 className="font-serif text-5xl font-semibold tracking-[-0.03em] sm:text-6xl lg:text-7xl">
            Dashboard
          </h1>

          <p className="mt-5 max-w-2xl font-sans text-base font-medium leading-7 text-[#171512]/55">
            Manage your NIRA furniture collection, categories, orders and
            customers.
          </p>
        </div>

        {/* MANAGEMENT CARDS */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          <AdminCard
            href="/admin/products"
            icon={Package}
            label="Products"
            description="Add, edit and remove furniture products."
          />

          <AdminCard
            href="/admin/categories"
            icon={FolderTree}
            label="Categories"
            description="Manage your product categories."
          />

          <AdminCard
            href="/admin/orders"
            icon={ShoppingBag}
            label="Orders"
            description="View and manage customer orders."
          />

          <AdminCard
            href="/admin/customers"
            icon={Users}
            label="Customers"
            description="View registered NIRA customers."
          />

        </div>

        {/* QUICK ACTION */}
        <div className="mt-10 border border-[#171512]/10 bg-white/40 p-7 sm:p-10">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#765A32]">
                Quick Action
              </p>

              <h2 className="mt-3 font-serif text-3xl font-semibold">
                Add a new product
              </h2>

              <p className="mt-2 max-w-xl font-sans text-sm font-medium leading-6 text-[#171512]/50">
                Add a new furniture piece to your NIRA collection.
              </p>
            </div>

            <Link
              href="/admin/products/new"
              className="inline-flex shrink-0 items-center justify-center gap-3 bg-[#171512] px-7 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#765A32]"
            >
              Add Product
              <ArrowUpRight size={15} />
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

function AdminCard({
  href,
  icon: Icon,
  label,
  description,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group border border-[#171512]/10 bg-white/40 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#B88A2B]/40 hover:bg-white/70"
    >
      <Icon
        size={25}
        strokeWidth={1.5}
        className="text-[#765A32]"
      />

      <h2 className="mt-10 font-serif text-3xl font-semibold">
        {label}
      </h2>

      <p className="mt-3 font-sans text-sm font-medium leading-6 text-[#171512]/50">
        {description}
      </p>

      <div className="mt-8 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#171512]/40 transition-colors group-hover:text-[#765A32]">
        Manage →
      </div>
    </Link>
  );
}