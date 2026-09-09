"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ImagePlus, Save } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type CategoryForm = {
  name: string;
  slug: string;
  description: string;
  image_url: string;
  active: boolean;
  sort_order: string;
};

const emptyForm: CategoryForm = {
  name: "",
  slug: "",
  description: "",
  image_url: "",
  active: true,
  sort_order: "0",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CategoryFormPage({
  categoryId,
}: {
  categoryId?: string;
}) {
  const [form, setForm] = useState<CategoryForm>(emptyForm);

  const [loading, setLoading] = useState(Boolean(categoryId));
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategory() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/admin/login";
        return;
      }

      const { data: admin } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (!admin) {
        window.location.href = "/account";
        return;
      }

      if (categoryId) {
        const { data, error: categoryError } = await supabase
          .from("categories")
          .select("*")
          .eq("id", categoryId)
          .single();

        if (categoryError) {
          setError(categoryError.message);
        }

        if (data) {
          setForm({
            name: data.name || "",
            slug: data.slug || "",
            description: data.description || "",
            image_url: data.image_url || "",
            active: Boolean(data.active),
            sort_order: String(data.sort_order ?? 0),
          });
        }
      }

      setLoading(false);
    }

    loadCategory();
  }, [categoryId]);

  function handleChange(
    name: keyof CategoryForm,
    value: string | boolean
  ) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSave(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/admin/login";
      return;
    }

    const { data: admin } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!admin) {
      window.location.href = "/account";
      return;
    }

    const finalSlug =
      form.slug.trim() || slugify(form.name);

    const payload = {
      name: form.name.trim(),
      slug: finalSlug,
      description:
        form.description.trim() || null,
      image_url:
        form.image_url.trim() || null,
      active: form.active,
      sort_order: Number(form.sort_order || 0),
      updated_at: new Date().toISOString(),
    };

    let result;

    if (categoryId) {
      result = await supabase
        .from("categories")
        .update(payload)
        .eq("id", categoryId)
        .select("id")
        .single();
    } else {
      result = await supabase
        .from("categories")
        .insert(payload)
        .select("id")
        .single();
    }

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    setMessage(
      categoryId
        ? "Category updated successfully."
        : "Category created successfully."
    );

    setSaving(false);

    if (!categoryId && result.data?.id) {
      window.location.href =
        `/admin/categories/${result.data.id}`;
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F4EE]">
        <p className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-[#765A32]">
          Loading category...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#171512]">

      {/* HEADER */}
      <header className="border-b border-[#171512]/10">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-6 sm:px-10">

          <Link
            href="/admin/categories"
            className="font-serif text-3xl font-semibold tracking-[0.18em]"
          >
            NIRA
          </Link>

          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#171512]/45 transition-colors hover:text-[#765A32]"
          >
            <ArrowLeft size={14} />
            Categories
          </Link>

        </div>
      </header>

      {/* CONTENT */}
      <section className="mx-auto max-w-5xl px-6 py-12 sm:px-10 lg:py-16">

        <p className="mb-3 font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-[#765A32]">
          {categoryId ? "Edit Category" : "New Category"}
        </p>

        <h1 className="font-serif text-5xl font-semibold tracking-[-0.03em] sm:text-6xl">
          {categoryId
            ? "Edit collection category."
            : "Create a collection category."}
        </h1>

        <p className="mt-5 max-w-2xl font-sans text-base font-medium leading-7 text-[#171512]/55">
          Organize your NIRA furniture collection into
          clear and discoverable categories.
        </p>

        <form
          onSubmit={handleSave}
          className="mt-12 space-y-6"
        >

          {/* CATEGORY INFORMATION */}
          <section className="border border-[#171512]/10 bg-white/40 p-6 sm:p-10">

            <h2 className="mb-8 font-serif text-3xl font-semibold">
              Category Information
            </h2>

            <div className="space-y-6">

              {/* NAME */}
              <Field
                label="Category Name"
                value={form.name}
                onChange={(value) =>
                  handleChange("name", value)
                }
                placeholder="e.g. Outdoor Furniture"
                required
              />

              {/* SLUG */}
              <Field
                label="Slug"
                value={form.slug}
                onChange={(value) =>
                  handleChange("slug", value)
                }
                placeholder="Leave blank to generate automatically"
              />

              {/* DESCRIPTION */}
              <Textarea
                label="Description"
                value={form.description}
                onChange={(value) =>
                  handleChange(
                    "description",
                    value
                  )
                }
                placeholder="Describe this furniture category..."
              />

            </div>

          </section>

          {/* CATEGORY IMAGE */}
          <section className="border border-[#171512]/10 bg-white/40 p-6 sm:p-10">

            <h2 className="mb-8 font-serif text-3xl font-semibold">
              Category Image
            </h2>

            <Field
              label="Image URL"
              value={form.image_url}
              onChange={(value) =>
                handleChange(
                  "image_url",
                  value
                )
              }
              placeholder="Paste category image URL"
            />

            {form.image_url && (
              <div className="mt-5 overflow-hidden border border-[#171512]/10 bg-[#EDE7DC]">

                <img
                  src={form.image_url}
                  alt="Category preview"
                  className="h-72 w-full object-cover"
                />

              </div>
            )}

            <div className="mt-5 flex items-center gap-3 border border-dashed border-[#171512]/15 p-5">

              <ImagePlus
                size={20}
                className="shrink-0 text-[#765A32]"
              />

              <p className="font-sans text-xs font-medium leading-5 text-[#171512]/45">
                Supabase Storage image uploading will be
                connected after the catalog system is complete.
              </p>

            </div>

          </section>

          {/* DISPLAY SETTINGS */}
          <section className="border border-[#171512]/10 bg-white/40 p-6 sm:p-10">

            <h2 className="mb-8 font-serif text-3xl font-semibold">
              Display Settings
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              {/* SORT ORDER */}
              <Field
                label="Display Order"
                type="number"
                value={form.sort_order}
                onChange={(value) =>
                  handleChange(
                    "sort_order",
                    value
                  )
                }
                placeholder="0"
              />

            </div>

            {/* ACTIVE */}
            <label className="mt-8 flex cursor-pointer items-start gap-4">

              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) =>
                  handleChange(
                    "active",
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
                  Active categories can be displayed on
                  the storefront and selected for products.
                </span>

              </span>

            </label>

          </section>

          {/* MESSAGES */}
          {message && (
            <div className="border border-[#765A32]/20 bg-[#EEE8DE] px-5 py-4 font-sans text-sm font-semibold text-[#765A32]">
              {message}
            </div>
          )}

          {error && (
            <div className="border border-red-900/15 bg-red-50 px-5 py-4 font-sans text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-col gap-4 border border-[#171512]/10 bg-white/40 p-6 sm:flex-row sm:justify-end">

            <Link
              href="/admin/categories"
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
                ? "Saving..."
                : categoryId
                  ? "Update Category"
                  : "Create Category"}

            </button>

          </div>

        </form>

      </section>

    </main>
  );
}

/* =========================================================
   INPUT
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