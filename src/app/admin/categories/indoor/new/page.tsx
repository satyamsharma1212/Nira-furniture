"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  Save,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type IndoorDetails = {
  furniture_type: string;
  material: string;
  finish: string;
  color: string;
  upholstery: string;
  seating_capacity: string;
  style: string;
  usage: string;
};

const initialDetails: IndoorDetails = {
  furniture_type: "",
  material: "",
  finish: "",
  color: "",
  upholstery: "",
  seating_capacity: "",
  style: "",
  usage: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function NewIndoorCategoryPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [active, setActive] = useState(true);

  const [details, setDetails] =
    useState<IndoorDetails>(initialDetails);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateDetail(
    key: keyof IndoorDetails,
    value: string
  ) {
    setDetails((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    const supabase = createClient();

    // =====================================================
    // AUTH
    // =====================================================

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/admin/login";
      return;
    }

    // =====================================================
    // ADMIN CHECK
    // =====================================================

    const { data: admin } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!admin) {
      window.location.href = "/account";
      return;
    }

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!name.trim()) {
      setError("Category name is required.");
      setSaving(false);
      return;
    }

    // =====================================================
    // SLUG
    // =====================================================

    const finalSlug =
      slug.trim() || slugify(name);

    // =====================================================
    // INSERT
    // =====================================================

    const { error: insertError } =
      await supabase
        .from("categories")
        .insert({
          name: name.trim(),

          slug: finalSlug,

          description:
            description.trim() || null,

          image_url:
            imageUrl.trim() || null,

          active,

          sort_order:
            Number(sortOrder || 0),

          // ===============================================
          // IMPORTANT
          // ===============================================

          collection_type: "indoor",

          details,

          updated_at:
            new Date().toISOString(),
        });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    // =====================================================
    // REDIRECT
    // =====================================================

    window.location.href =
      "/admin/categories/indoor";
  }

  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#171512]">

      {/* ===================================================
          ADMIN HEADER
      =================================================== */}

      <header className="border-b border-[#171512]/10 bg-[#F7F4EE]">

        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-6 sm:px-10">

          {/* LOGO */}

          <Link
            href="/admin/categories/indoor"
            className="font-serif text-3xl font-semibold tracking-[0.18em]"
          >
            NIRA
          </Link>

          {/* BACK */}

          <Link
            href="/admin/categories/indoor"
            className="inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#171512]/45 transition-colors hover:text-[#765A32]"
          >
            <ArrowLeft size={14} />
            Categories
          </Link>

        </div>

      </header>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <section className="mx-auto max-w-5xl px-6 py-12 sm:px-10 lg:py-16">

        {/* EYEBROW */}

        <p className="mb-3 font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-[#765A32]">
          New Indoor Category
        </p>

        {/* TITLE */}

        <h1 className="font-serif text-5xl font-semibold leading-[0.95] tracking-[-0.03em] sm:text-6xl">
          Create an indoor
          <br />
          collection category.
        </h1>

        {/* DESCRIPTION */}

        <p className="mt-5 max-w-2xl font-sans text-base font-medium leading-7 text-[#171512]/55">
          Organize your NIRA indoor furniture collection
          into clear and discoverable categories.
        </p>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="mt-12 space-y-6"
        >

          {/* =================================================
              COLLECTION
          ================================================= */}

          <section className="border border-[#765A32]/15 bg-[#EEE8DE] p-6 sm:p-10">

            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#765A32]">
              Collection
            </p>

            <div className="mt-3 flex items-center justify-between">

              <div>

                <h2 className="font-serif text-3xl font-semibold">
                  Indoor
                </h2>

                <p className="mt-2 font-sans text-xs leading-5 text-[#171512]/50">
                  This category will automatically be
                  saved under the Indoor collection.
                </p>

              </div>

              <div className="border border-[#765A32]/20 bg-[#F7F4EE] px-4 py-3">

                <span className="font-sans text-[9px] font-bold uppercase tracking-[0.18em] text-[#765A32]">
                  INDOOR
                </span>

              </div>

            </div>

          </section>

          {/* =================================================
              CATEGORY INFORMATION
          ================================================= */}

          <section className="border border-[#171512]/10 bg-white/40 p-6 sm:p-10">

            <h2 className="mb-8 font-serif text-3xl font-semibold">
              Category Information
            </h2>

            <div className="space-y-6">

              {/* CATEGORY NAME */}

              <Field
                label="Category Name"
                value={name}
                onChange={setName}
                placeholder="e.g. Dining Chairs"
                required
              />

              {/* SLUG */}

              <Field
                label="Slug"
                value={slug}
                onChange={setSlug}
                placeholder="Leave blank to generate automatically"
              />

              {/* DESCRIPTION */}

              <Textarea
                label="Description"
                value={description}
                onChange={setDescription}
                placeholder="Describe this indoor furniture category..."
              />

            </div>

          </section>

          {/* =================================================
              INDOOR DETAILS
          ================================================= */}

         

          {/* =================================================
              CATEGORY IMAGE
          ================================================= */}

          <section className="border border-[#171512]/10 bg-white/40 p-6 sm:p-10">

            <h2 className="mb-8 font-serif text-3xl font-semibold">
              Category Image
            </h2>

            <Field
              label="Image URL"
              value={imageUrl}
              onChange={setImageUrl}
              placeholder="Paste category image URL"
            />

            {/* PREVIEW */}

            {imageUrl && (
              <div className="mt-5 overflow-hidden border border-[#171512]/10 bg-[#EDE7DC]">

                <img
                  src={imageUrl}
                  alt={
                    name ||
                    "Indoor category"
                  }
                  className="h-72 w-full object-cover"
                />

              </div>
            )}

            {/* IMAGE STORAGE */}

            <div className="mt-5 flex items-center gap-3 border border-dashed border-[#171512]/15 p-5">

              <ImagePlus
                size={20}
                className="shrink-0 text-[#765A32]"
              />

              <p className="font-sans text-xs font-medium leading-5 text-[#171512]/45">
                Supabase Storage image uploading
                will be connected after the catalog
                system is complete.
              </p>

            </div>

          </section>

          {/* =================================================
              DISPLAY SETTINGS
          ================================================= */}

          <section className="border border-[#171512]/10 bg-white/40 p-6 sm:p-10">

            <h2 className="mb-8 font-serif text-3xl font-semibold">
              Display Settings
            </h2>

            {/* DISPLAY ORDER */}

            <Field
              label="Display Order"
              type="number"
              value={sortOrder}
              onChange={setSortOrder}
              placeholder="0"
            />

            {/* ACTIVE */}

            <label className="mt-8 flex cursor-pointer items-start gap-4">

              <input
                type="checkbox"
                checked={active}
                onChange={(event) =>
                  setActive(
                    event.target.checked
                  )
                }
                className="mt-1 h-4 w-4 accent-[#765A32]"
              />

              <span>

                <span className="block font-sans text-sm font-semibold">
                  Active category
                </span>

                <span className="mt-1 block font-sans text-xs font-medium leading-5 text-[#171512]/45">
                  Active categories can be
                  displayed on the storefront
                  and selected for products.
                </span>

              </span>

            </label>

          </section>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="border border-red-900/15 bg-red-50 px-5 py-4 font-sans text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="flex flex-col gap-4 border border-[#171512]/10 bg-white/40 p-6 sm:flex-row sm:justify-end">

            <Link
              href="/admin/categories/indoor"
              className="inline-flex items-center justify-center px-6 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#171512]/50 transition-colors hover:text-[#765A32]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 bg-[#171512] px-8 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#765A32] disabled:cursor-not-allowed disabled:opacity-50"
            >

              <Save size={15} />

              {saving
                ? "Creating..."
                : "Create Indoor Category"}

            </button>

          </div>

        </form>

      </section>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="mt-16 bg-[#171310] text-[#F7F4EE]">

        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-12">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#B88A2B]">

              <span className="font-serif text-xl text-[#B88A2B]">
                N
              </span>

            </div>

            <span className="font-serif text-2xl">
              NIRA Furniture
            </span>

          </div>

          {/* BRAND DESCRIPTION */}

          <div className="mt-8 max-w-xl">

            <h2 className="font-serif text-3xl leading-tight">
              Classical royal grandeur,
              harmonised with serene
              architectural modernism.
            </h2>

            <p className="mt-6 font-sans text-sm leading-6 text-[#F7F4EE]/55">
              Hand-crafted furniture, refined
              materials and timeless design
              created for distinguished residences,
              estates, hospitality spaces and
              contemporary living.
            </p>

          </div>

          {/* =================================================
              FOOTER LINKS
          ================================================= */}

          <div className="mt-16 grid gap-12 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-4">

            {/* EXPLORE */}

            <div>

              <p className="mb-6 font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#B88A2B]">
                Explore NIRA
              </p>

              <div className="space-y-3 font-sans text-xs text-[#F7F4EE]/55">

                <Link
                  href="/"
                  className="block hover:text-white"
                >
                  Home
                </Link>

                <Link
                  href="/collections"
                  className="block hover:text-white"
                >
                  Collections
                </Link>

                <Link
                  href="/about"
                  className="block hover:text-white"
                >
                  About Atelier
                </Link>

                <Link
                  href="/collections/indoor"
                  className="block hover:text-white"
                >
                  Indoor Furniture
                </Link>

                <Link
                  href="/collections/outdoor"
                  className="block hover:text-white"
                >
                  Outdoor Furniture
                </Link>

              </div>

            </div>

            {/* SERVICES */}

            <div>

              <p className="mb-6 font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#B88A2B]">
                Atelier Services
              </p>

              <div className="space-y-3 font-sans text-xs text-[#F7F4EE]/55">

                <p>
                  Private Appointments
                </p>

                <p>
                  Bespoke Furniture
                </p>

                <p>
                  Material Library
                </p>

                <p>
                  Quality & Provenance
                </p>

              </div>

            </div>

            {/* LOCATIONS */}

            <div>

              <p className="mb-6 font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#B88A2B]">
                NIRA Locations
              </p>

              <div className="space-y-7">

                <div>

                  <p className="font-serif text-lg">
                    Surat
                  </p>

                  <p className="mt-2 font-sans text-xs leading-5 text-[#F7F4EE]/50">
                    NIRA Furniture
                    <br />
                    Gali Number 6, RJD Textile Market,
                    Ichhapor,
                    <br />
                    Hazira Road, Surat,
                    Gujarat 394510
                  </p>

                </div>

                <div>

                  <p className="font-serif text-lg">
                    Mumbai
                  </p>

                  <p className="mt-2 font-sans text-xs leading-5 text-[#F7F4EE]/50">
                    NIRA Furniture
                    <br />
                    B-2006, Omkareshwar,
                    Rajendra Nagar,
                    Borivali East,
                    <br />
                    Mumbai, Maharashtra 400066
                  </p>

                </div>

              </div>

            </div>

            {/* CONTACT */}

            <div>

              <p className="mb-6 font-sans text-[9px] font-bold uppercase tracking-[0.25em] text-[#B88A2B]">
                Correspondence
              </p>

              <p className="mb-2 font-sans text-[8px] font-bold uppercase tracking-[0.2em] text-[#F7F4EE]/35">
                General Enquiries
              </p>

              <Link
                href="/contact"
                className="font-sans text-xs text-[#F7F4EE]/55 hover:text-white"
              >
                Contact NIRA
              </Link>

            </div>

          </div>

          {/* =================================================
              COPYRIGHT
          ================================================= */}

          <div className="mt-14 border-t border-white/10 pt-8">

            <p className="font-sans text-[9px] uppercase tracking-[0.18em] text-[#F7F4EE]/30">
              © 2026 NIRA Furniture · All Rights Reserved
            </p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-sans text-[9px] uppercase tracking-[0.12em] text-[#F7F4EE]/30">

              <span>
                Returns & Refunds
              </span>

              <span>
                Shipping & Delivery
              </span>

              <span>
                Privacy Policy
              </span>

              <span>
                Terms & Conditions
              </span>

              <span>
                Contact & Support
              </span>

              <Link
                href="/admin/login"
                className="hover:text-[#B88A2B]"
              >
                Admin Login
              </Link>

            </div>

            {/* LARGE NIRA */}

            <div className="mt-12 overflow-hidden text-center">

              <span className="font-serif text-7xl font-semibold tracking-[0.15em] text-white/[0.025]">
                NIRA
              </span>

            </div>

          </div>

        </div>

      </footer>

    </main>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">

      <span className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#171512]/50">
        {label}
      </span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-14 w-full border border-[#171512]/15 bg-[#FBF9F3] px-4 font-sans text-base font-medium outline-none transition-colors focus:border-[#B88A2B]"
      />

    </label>
  );
}

/* =========================================================
   SELECT
========================================================= */

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block">

      <span className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#171512]/50">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-14 w-full border border-[#171512]/15 bg-[#FBF9F3] px-4 font-sans text-base font-medium outline-none transition-colors focus:border-[#B88A2B]"
      >

        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </label>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">

      <span className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#171512]/50">
        {label}
      </span>

      <textarea
        value={value}
        placeholder={placeholder}
        rows={7}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full resize-y border border-[#171512]/15 bg-[#FBF9F3] p-4 font-sans text-base font-medium outline-none transition-colors focus:border-[#B88A2B]"
      />

    </label>
  );
}