"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Category = {
  id: string;
  name: string;
};

type MaterialOption = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  sort_order: number;
};

type ProductForm = {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: string;
  financing: string;
  material: string;
  dimensions: string;
  weight: string;
  stock: string;
  status: "active" | "draft" | "out_of_stock";
  featured: boolean;
  new_arrival: boolean;
  category_id: string;
  main_image_url: string;
  materials: string[];
};

type ProductImage = {
  id: string;
  image_url: string;
  sort_order: number;
};

type ProductFormPageProps = {
  productId?: string;
};

const emptyForm: ProductForm = {
  name: "",
  slug: "",
  short_description: "",
  description: "",
  price: "",
  financing: "",
  material: "",
  dimensions: "",
  weight: "",
  stock: "0",
  status: "active",
  featured: false,
  new_arrival: false,
  category_id: "",
  main_image_url: "",
  materials: [],
};

export default function ProductFormPage({
  productId,
}: ProductFormPageProps) {
  const supabase = createClient();

  const isEditing = Boolean(productId);

  const [form, setForm] = useState<ProductForm>(emptyForm);

  const [categories, setCategories] = useState<Category[]>([]);

  const [materialOptions, setMaterialOptions] = useState<
    MaterialOption[]
  >([]);

  const [galleryImages, setGalleryImages] = useState<ProductImage[]>(
    [],
  );

  const [mainImageFile, setMainImageFile] = useState<File | null>(
    null,
  );

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  /*
   * LOAD DATA
   */
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");

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

      /*
       * LOAD CATEGORIES
       */
      const {
        data: categoryData,
        error: categoryError,
      } = await supabase
        .from("categories")
        .select("id, name")
        .order("sort_order", {
          ascending: true,
        });

      if (categoryError) {
        setError(categoryError.message);
      } else {
        setCategories(categoryData || []);
      }

      /*
       * LOAD MATERIALS
       */
      const {
        data: materialData,
        error: materialError,
      } = await supabase
        .from("materials")
        .select("id, name, slug, active, sort_order")
        .eq("active", true)
        .order("sort_order", {
          ascending: true,
        });

      if (materialError) {
        setError(materialError.message);
      } else {
        setMaterialOptions(materialData || []);
      }

      /*
       * LOAD PRODUCT FOR EDITING
       */
      if (productId) {
        const {
          data: product,
          error: productError,
        } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .single();

        if (productError) {
          setError(productError.message);
          setLoading(false);
          return;
        }

        setForm({
          name: product.name || "",
          slug: product.slug || "",
          short_description:
            product.short_description || "",
          description: product.description || "",
          price: String(product.price ?? ""),
          financing: product.financing || "",
          material: product.material || "",
          dimensions: product.dimensions || "",
          weight: product.weight || "",
          stock: String(product.stock ?? 0),
          status: product.status || "active",
          featured: Boolean(product.featured),
          new_arrival: Boolean(product.new_arrival),
          category_id: product.category_id || "",
          main_image_url: product.main_image_url || "",
          materials: Array.isArray(product.materials)
            ? product.materials
            : [],
        });

        /*
         * LOAD GALLERY IMAGES
         */
        const {
          data: images,
          error: imageError,
        } = await supabase
          .from("product_images")
          .select("id, image_url, sort_order")
          .eq("product_id", productId)
          .order("sort_order", {
            ascending: true,
          });

        if (imageError) {
          setError(imageError.message);
        } else {
          setGalleryImages(images || []);
        }
      }

      setLoading(false);
    }

    loadData();
  }, [productId]);

  /*
   * FORM HELPERS
   */
  function updateField<K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  /*
   * MATERIAL SELECTION
   */
  function toggleMaterial(materialName: string) {
    setForm((current) => {
      const alreadySelected =
        current.materials.includes(materialName);

      if (alreadySelected) {
        return {
          ...current,
          materials: current.materials.filter(
            (material) => material !== materialName,
          ),
        };
      }

      return {
        ...current,
        materials: [
          ...current.materials,
          materialName,
        ],
      };
    });
  }

  /*
   * MAIN IMAGE
   */
  function handleMainImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    setError("");
    setMainImageFile(file);
  }

  /*
   * GALLERY IMAGES
   */
  function handleGalleryChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const files = Array.from(event.target.files || []);

    const validFiles = files.filter((file) =>
      file.type.startsWith("image/"),
    );

    if (validFiles.length !== files.length) {
      setError("Only image files can be uploaded.");
      return;
    }

    setError("");

    setGalleryFiles((current) => [
      ...current,
      ...validFiles,
    ]);
  }

  /*
   * UPLOAD IMAGE TO SUPABASE STORAGE
   */
  async function uploadImage(
    file: File,
    productId: string,
    folder: string,
  ) {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `${crypto.randomUUID()}.${extension}`;

    const filePath =
      `${productId}/${folder}/${fileName}`;

    const { error: uploadError } =
      await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /*
   * SAVE PRODUCT
   */
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!form.name.trim()) {
        throw new Error("Product name is required.");
      }

      if (!form.slug.trim()) {
        throw new Error("Product slug is required.");
      }

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

      /*
       * INSERT / UPDATE PRODUCT
       */
      const productData = {
        name: form.name.trim(),

        slug: form.slug.trim(),

        short_description:
          form.short_description.trim() || null,

        description:
          form.description.trim() || null,

        price: Number(form.price) || 0,

        financing:
          form.financing.trim() || null,

        material:
          form.material.trim() || null,

        dimensions:
          form.dimensions.trim() || null,

        weight:
          form.weight.trim() || null,

        stock:
          Number(form.stock) || 0,

        status:
          form.status,

        featured:
          form.featured,

        new_arrival:
          form.new_arrival,

        category_id:
          form.category_id || null,

        main_image_url:
          form.main_image_url || null,

        /*
         * SELECTED MATERIALS
         */
        materials:
          form.materials,

        updated_at:
          new Date().toISOString(),
      };

      let savedProductId = productId;

      /*
       * UPDATE EXISTING PRODUCT
       */
      if (productId) {
        const {
          error: updateError,
        } = await supabase
          .from("products")
          .update(productData)
          .eq("id", productId);

        if (updateError) {
          throw new Error(updateError.message);
        }
      }

      /*
       * CREATE NEW PRODUCT
       */
      else {
        const {
          data: newProduct,
          error: insertError,
        } = await supabase
          .from("products")
          .insert(productData)
          .select("id")
          .single();

        if (insertError) {
          throw new Error(insertError.message);
        }

        savedProductId = newProduct.id;
      }

      if (!savedProductId) {
        throw new Error(
          "Could not determine product ID.",
        );
      }

      /*
       * UPLOAD MAIN IMAGE
       */
      if (mainImageFile) {
        const mainImageUrl =
          await uploadImage(
            mainImageFile,
            savedProductId,
            "main",
          );

        const {
          error: mainImageError,
        } = await supabase
          .from("products")
          .update({
            main_image_url: mainImageUrl,
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", savedProductId);

        if (mainImageError) {
          throw new Error(
            mainImageError.message,
          );
        }

        setForm((current) => ({
          ...current,
          main_image_url: mainImageUrl,
        }));

        setMainImageFile(null);
      }

      /*
       * UPLOAD GALLERY IMAGES
       */
      if (galleryFiles.length > 0) {
        const startingOrder =
          galleryImages.length;

        const uploadedImages: {
          product_id: string;
          image_url: string;
          sort_order: number;
        }[] = [];

        for (
          let i = 0;
          i < galleryFiles.length;
          i++
        ) {
          const imageUrl =
            await uploadImage(
              galleryFiles[i],
              savedProductId,
              "gallery",
            );

          uploadedImages.push({
            product_id: savedProductId,
            image_url: imageUrl,
            sort_order:
              startingOrder + i,
          });
        }

        const {
          data: insertedImages,
          error: galleryError,
        } = await supabase
          .from("product_images")
          .insert(uploadedImages)
          .select(
            "id, image_url, sort_order",
          );

        if (galleryError) {
          throw new Error(
            galleryError.message,
          );
        }

        setGalleryImages((current) => [
          ...current,
          ...(insertedImages || []),
        ]);

        setGalleryFiles([]);
      }

      setSuccess(
        isEditing
          ? "Product updated successfully."
          : "Product created successfully.",
      );

      if (!isEditing) {
        window.history.replaceState(
          null,
          "",
          `/admin/products/${savedProductId}`,
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * DELETE GALLERY IMAGE
   */
  async function deleteGalleryImage(
    image: ProductImage,
  ) {
    if (
      !window.confirm(
        "Delete this gallery image?",
      )
    ) {
      return;
    }

    setError("");

    const {
      error: deleteError,
    } = await supabase
      .from("product_images")
      .delete()
      .eq("id", image.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setGalleryImages((current) =>
      current.filter(
        (item) => item.id !== image.id,
      ),
    );
  }

  /*
   * LOADING
   */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F4EE]">
        <Loader2
          size={28}
          className="animate-spin text-[#765A32]"
        />
      </main>
    );
  }

  /*
   * PAGE
   */
  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#171512]">
      {/* HEADER */}
      <header className="border-b border-[#171512]/10">
        <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-5 px-6 sm:px-10">
          <div className="flex items-center gap-5">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#171512]/50 transition hover:text-[#765A32]"
            >
              <ArrowLeft size={14} />
              Products
            </Link>

            <span className="hidden h-5 w-px bg-[#171512]/10 sm:block" />

            <span className="hidden font-serif text-2xl font-semibold tracking-[0.15em] sm:block">
              NIRA
            </span>
          </div>

          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.22em] text-[#765A32]">
            {isEditing
              ? "Edit Product"
              : "New Product"}
          </span>
        </div>
      </header>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:py-16">
        {/* TITLE */}
        <div className="mb-10">
          <p className="mb-3 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#765A32]">
            Catalog Management
          </p>

          <h1 className="font-serif text-5xl font-semibold tracking-[-0.03em] sm:text-6xl">
            {isEditing
              ? "Edit Product"
              : "Create Product"}
          </h1>

          <p className="mt-4 max-w-2xl font-sans text-sm leading-7 text-[#171512]/55">
            Add the details, imagery and
            specifications for your NIRA
            furniture collection.
          </p>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="mb-6 border border-red-900/15 bg-red-50 px-5 py-4 font-sans text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 border border-green-900/15 bg-green-50 px-5 py-4 font-sans text-sm font-semibold text-green-700">
            {success}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* BASIC INFORMATION */}
          <section className="border border-[#171512]/10 bg-white/40 p-6 sm:p-8">
            <div className="mb-7">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#765A32]">
                01
              </p>

              <h2 className="mt-2 font-serif text-3xl font-semibold">
                Product Information
              </h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* NAME */}
              <div>
                <label className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.18em]">
                  Product Name
                </label>

                <input
                  value={form.name}
                  onChange={(event) => {
                    const name =
                      event.target.value;

                    updateField(
                      "name",
                      name,
                    );

                    if (!isEditing) {
                      updateField(
                        "slug",
                        createSlug(name),
                      );
                    }
                  }}
                  placeholder="The Amali Sovereign Outdoor Lounge Suite"
                  className="w-full border border-[#171512]/15 bg-[#F7F4EE] px-4 py-4 font-sans text-sm outline-none transition focus:border-[#765A32]"
                  required
                />
              </div>

              {/* SLUG */}
              <div>
                <label className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.18em]">
                  Slug
                </label>

                <input
                  value={form.slug}
                  onChange={(event) =>
                    updateField(
                      "slug",
                      createSlug(
                        event.target.value,
                      ),
                    )
                  }
                  placeholder="amali-sovereign-outdoor-lounge-suite"
                  className="w-full border border-[#171512]/15 bg-[#F7F4EE] px-4 py-4 font-sans text-sm outline-none transition focus:border-[#765A32]"
                  required
                />
              </div>

              {/* SHORT DESCRIPTION */}
              <div className="lg:col-span-2">
                <label className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.18em]">
                  Short Description
                </label>

                <input
                  value={
                    form.short_description
                  }
                  onChange={(event) =>
                    updateField(
                      "short_description",
                      event.target.value,
                    )
                  }
                  placeholder="A refined outdoor lounge collection..."
                  className="w-full border border-[#171512]/15 bg-[#F7F4EE] px-4 py-4 font-sans text-sm outline-none transition focus:border-[#765A32]"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="lg:col-span-2">
                <label className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.18em]">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value,
                    )
                  }
                  rows={7}
                  placeholder="Describe the product..."
                  className="w-full resize-none border border-[#171512]/15 bg-[#F7F4EE] px-4 py-4 font-sans text-sm leading-7 outline-none transition focus:border-[#765A32]"
                />
              </div>
            </div>
          </section>

          {/* PRICING & INVENTORY */}
          <section className="border border-[#171512]/10 bg-white/40 p-6 sm:p-8">
            <div className="mb-7">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#765A32]">
                02
              </p>

              <h2 className="mt-2 font-serif text-3xl font-semibold">
                Pricing & Inventory
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* PRICE */}
              <div>
                <label className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.18em]">
                  Price
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(event) =>
                    updateField(
                      "price",
                      event.target.value,
                    )
                  }
                  placeholder="14800"
                  className="w-full border border-[#171512]/15 bg-[#F7F4EE] px-4 py-4 font-sans text-sm outline-none focus:border-[#765A32]"
                />
              </div>

              {/* STOCK */}
              <div>
                <label className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.18em]">
                  Stock
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(event) =>
                    updateField(
                      "stock",
                      event.target.value,
                    )
                  }
                  className="w-full border border-[#171512]/15 bg-[#F7F4EE] px-4 py-4 font-sans text-sm outline-none focus:border-[#765A32]"
                />
              </div>

              {/* STATUS */}
              <div>
                <label className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.18em]">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField(
                      "status",
                      event.target
                        .value as ProductForm["status"],
                    )
                  }
                  className="w-full border border-[#171512]/15 bg-[#F7F4EE] px-4 py-4 font-sans text-sm outline-none focus:border-[#765A32]"
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="draft">
                    Draft
                  </option>

                  <option value="out_of_stock">
                    Out of Stock
                  </option>
                </select>
              </div>

              {/* CATEGORY */}
              <div>
                <label className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.18em]">
                  Category
                </label>

                <select
                  value={form.category_id}
                  onChange={(event) =>
                    updateField(
                      "category_id",
                      event.target.value,
                    )
                  }
                  className="w-full border border-[#171512]/15 bg-[#F7F4EE] px-4 py-4 font-sans text-sm outline-none focus:border-[#765A32]"
                >
                  <option value="">
                    Uncategorised
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* FINANCING */}
              <div className="sm:col-span-2 lg:col-span-4">
                <label className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.18em]">
                  Financing
                </label>

                <input
                  value={form.financing}
                  onChange={(event) =>
                    updateField(
                      "financing",
                      event.target.value,
                    )
                  }
                  placeholder="or $1,233/mo concierge financing"
                  className="w-full border border-[#171512]/15 bg-[#F7F4EE] px-4 py-4 font-sans text-sm outline-none focus:border-[#765A32]"
                />
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-6 border-t border-[#171512]/10 pt-6">
              {/* FEATURED */}
              <label className="flex cursor-pointer items-center gap-3 font-sans text-sm">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) =>
                    updateField(
                      "featured",
                      event.target.checked,
                    )
                  }
                  className="h-4 w-4 accent-[#765A32]"
                />

                Featured Product
              </label>

              {/* NEW ARRIVAL */}
              <label className="flex cursor-pointer items-center gap-3 font-sans text-sm">
                <input
                  type="checkbox"
                  checked={form.new_arrival}
                  onChange={(event) =>
                    updateField(
                      "new_arrival",
                      event.target.checked,
                    )
                  }
                  className="h-4 w-4 accent-[#765A32]"
                />

                New Arrival
              </label>
            </div>
          </section>

          {/* SPECIFICATIONS */}
          <section className="border border-[#171512]/10 bg-white/40 p-6 sm:p-8">
            <div className="mb-7">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#765A32]">
                03
              </p>

              <h2 className="mt-2 font-serif text-3xl font-semibold">
                Specifications
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {/* MATERIAL SUMMARY */}
              <div>
                <label className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.18em]">
                  Material
                </label>

                <input
                  value={form.material}
                  onChange={(event) =>
                    updateField(
                      "material",
                      event.target.value,
                    )
                  }
                  placeholder="Aged Weathered Teak & Hand-Woven Cord"
                  className="w-full border border-[#171512]/15 bg-[#F7F4EE] px-4 py-4 font-sans text-sm outline-none focus:border-[#765A32]"
                />
              </div>

              {/* DIMENSIONS */}
              <div>
                <label className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.18em]">
                  Dimensions
                </label>

                <input
                  value={form.dimensions}
                  onChange={(event) =>
                    updateField(
                      "dimensions",
                      event.target.value,
                    )
                  }
                  placeholder="320 × 240 × 78 cm"
                  className="w-full border border-[#171512]/15 bg-[#F7F4EE] px-4 py-4 font-sans text-sm outline-none focus:border-[#765A32]"
                />
              </div>

              {/* WEIGHT */}
              <div>
                <label className="mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.18em]">
                  Weight
                </label>

                <input
                  value={form.weight}
                  onChange={(event) =>
                    updateField(
                      "weight",
                      event.target.value,
                    )
                  }
                  placeholder="85 kg"
                  className="w-full border border-[#171512]/15 bg-[#F7F4EE] px-4 py-4 font-sans text-sm outline-none focus:border-[#765A32]"
                />
              </div>
            </div>

            {/* MATERIALS USED */}
            <div className="mt-8 border-t border-[#171512]/10 pt-8">
              <div className="mb-5">
                <label className="block font-sans text-[10px] font-bold uppercase tracking-[0.18em]">
                  Materials Used
                </label>

                <p className="mt-2 font-sans text-sm leading-6 text-[#171512]/50">
                  Select all materials used to
                  manufacture this product.
                </p>
              </div>

              {materialOptions.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {materialOptions.map(
                    (materialOption) => {
                      const selected =
                        form.materials.includes(
                          materialOption.name,
                        );

                      return (
                        <label
                          key={materialOption.id}
                          className={`
                            flex cursor-pointer items-center gap-3
                            border px-4 py-4
                            font-sans text-sm font-medium
                            transition-all
                            ${
                              selected
                                ? "border-[#765A32] bg-[#765A32]/10 text-[#765A32]"
                                : "border-[#171512]/10 bg-[#F7F4EE] hover:border-[#765A32]/50"
                            }
                          `}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() =>
                              toggleMaterial(
                                materialOption.name,
                              )
                            }
                            className="h-4 w-4 shrink-0 accent-[#765A32]"
                          />

                          <span>
                            {materialOption.name}
                          </span>
                        </label>
                      );
                    },
                  )}
                </div>
              ) : (
                <div className="border border-dashed border-[#171512]/15 bg-[#F7F4EE] px-5 py-6">
                  <p className="font-sans text-sm font-medium text-[#171512]/50">
                    No active materials found.
                  </p>

                  <p className="mt-1 font-sans text-xs text-[#171512]/40">
                    Add materials from your
                    materials database first.
                  </p>
                </div>
              )}

              {/* SELECTED MATERIALS SUMMARY */}
              {form.materials.length > 0 && (
                <div className="mt-5">
                  <p className="mb-3 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#765A32]">
                    Selected Materials
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {form.materials.map(
                      (material) => (
                        <span
                          key={material}
                          className="border border-[#765A32]/25 bg-[#765A32]/5 px-3 py-2 font-sans text-xs font-medium text-[#765A32]"
                        >
                          {material}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* IMAGES */}
          <section className="border border-[#171512]/10 bg-white/40 p-6 sm:p-8">
            <div className="mb-7">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#765A32]">
                04
              </p>

              <h2 className="mt-2 font-serif text-3xl font-semibold">
                Product Imagery
              </h2>

              <p className="mt-2 font-sans text-sm text-[#171512]/50">
                Upload high-quality product
                photography directly to
                Supabase Storage.
              </p>
            </div>

            {/* MAIN IMAGE */}
            <div>
              <label className="mb-3 block font-sans text-[10px] font-bold uppercase tracking-[0.18em]">
                Main Product Image
              </label>

              <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                {/* PREVIEW */}
                <div className="relative aspect-square overflow-hidden border border-[#171512]/10 bg-[#EDE7DC]">
                  {mainImageFile ? (
                    <Image
                      src={URL.createObjectURL(
                        mainImageFile,
                      )}
                      alt="New main product preview"
                      fill
                      className="object-cover"
                    />
                  ) : form.main_image_url ? (
                    <Image
                      src={form.main_image_url}
                      alt={
                        form.name ||
                        "Product"
                      }
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImagePlus
                        size={32}
                        className="text-[#765A32]"
                      />
                    </div>
                  )}
                </div>

                {/* UPLOAD */}
                <div className="flex flex-col justify-center">
                  <label
                    htmlFor="main-image"
                    className="inline-flex w-fit cursor-pointer items-center gap-3 bg-[#171512] px-6 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#765A32]"
                  >
                    <ImagePlus size={16} />
                    Choose Main Image
                  </label>

                  <input
                    id="main-image"
                    type="file"
                    accept="image/*"
                    onChange={
                      handleMainImageChange
                    }
                    className="hidden"
                  />

                  {mainImageFile && (
                    <p className="mt-4 font-sans text-xs text-[#171512]/55">
                      {mainImageFile.name}
                    </p>
                  )}

                  <p className="mt-3 font-sans text-xs leading-6 text-[#171512]/45">
                    Recommended: JPG, PNG or
                    WebP. Use a high-resolution
                    image with the product
                    clearly visible.
                  </p>
                </div>
              </div>
            </div>

            {/* GALLERY */}
            <div className="mt-10 border-t border-[#171512]/10 pt-8">
              <div className="mb-5 flex items-center justify-between gap-5">
                <div>
                  <label className="block font-sans text-[10px] font-bold uppercase tracking-[0.18em]">
                    Gallery Images
                  </label>

                  <p className="mt-2 font-sans text-xs text-[#171512]/45">
                    Add additional product
                    photography.
                  </p>
                </div>

                <label
                  htmlFor="gallery-images"
                  className="inline-flex cursor-pointer items-center gap-2 border border-[#171512]/15 px-4 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.16em] transition hover:border-[#765A32] hover:text-[#765A32]"
                >
                  <ImagePlus size={15} />
                  Add Images
                </label>

                <input
                  id="gallery-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={
                    handleGalleryChange
                  }
                  className="hidden"
                />
              </div>

              {/* EXISTING GALLERY */}
              {galleryImages.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {galleryImages.map(
                    (image) => (
                      <div
                        key={image.id}
                        className="group relative aspect-square overflow-hidden border border-[#171512]/10 bg-[#EDE7DC]"
                      >
                        <Image
                          src={image.image_url}
                          alt="Product gallery"
                          fill
                          unoptimized
                          className="object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            deleteGalleryImage(
                              image,
                            )
                          }
                          className="absolute right-3 top-3 bg-white p-2 opacity-0 shadow-sm transition group-hover:opacity-100"
                          aria-label="Delete image"
                        >
                          <Trash2
                            size={14}
                            className="text-red-700"
                          />
                        </button>
                      </div>
                    ),
                  )}
                </div>
              )}

              {/* NEW GALLERY FILES */}
              {galleryFiles.length > 0 && (
                <div className="mt-5 border-t border-[#171512]/10 pt-5">
                  <p className="mb-4 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#765A32]">
                    Ready to Upload
                  </p>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {galleryFiles.map(
                      (file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="relative aspect-square overflow-hidden border border-[#765A32]/30 bg-[#EDE7DC]"
                        >
                          <Image
                            src={URL.createObjectURL(
                              file,
                            )}
                            alt={file.name}
                            fill
                            className="object-cover"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setGalleryFiles(
                                (current) =>
                                  current.filter(
                                    (_, i) =>
                                      i !==
                                      index,
                                  ),
                              )
                            }
                            className="absolute right-3 top-3 bg-white p-2 shadow-sm"
                            aria-label="Remove image"
                          >
                            <Trash2
                              size={14}
                              className="text-red-700"
                            />
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* SAVE */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#171512]/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center border border-[#171512]/15 px-6 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.18em] transition hover:border-[#765A32] hover:text-[#765A32]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-3 bg-[#171512] px-8 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#765A32] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />

                  {isEditing
                    ? "Save Changes"
                    : "Create Product"}
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}