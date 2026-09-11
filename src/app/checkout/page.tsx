"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import NextImage from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Lock,
  LogIn,
  ShoppingBag,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import RazorpayCheckoutButton from "../../components/RazorpayCheckoutButton";

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  stock: number | null;
  status: string;
  main_image_url: string | null;
};

type CartItem = {
  id: string;
  product_id: string;
  quantity: number;
  products:
    | Product
    | Product[]
    | null;
};

type CheckoutItem = {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
};

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  apartment: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
};

type FormData = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;

  shipping_address_line1: string;
  shipping_address_line2: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;

  billing_address_line1: string;
  billing_address_line2: string;
  billing_city: string;
  billing_state: string;
  billing_postal_code: string;
  billing_country: string;

  customer_note: string;
};

const initialForm: FormData = {
  customer_name: "",
  customer_email: "",
  customer_phone: "",

  shipping_address_line1: "",
  shipping_address_line2: "",
  shipping_city: "",
  shipping_state: "",
  shipping_postal_code: "",
  shipping_country: "India",

  billing_address_line1: "",
  billing_address_line2: "",
  billing_city: "",
  billing_state: "",
  billing_postal_code: "",
  billing_country: "India",

  customer_note: "",
};

/*
 * =========================================================
 * NORMALIZE PRODUCT
 * =========================================================
 */

function normalizeProduct(
  value: Product | Product[] | null,
): Product | null {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return value[0] || null;
  }

  return value;
}

/*
 * =========================================================
 * CHECKOUT PAGE
 * =========================================================
 */

export default function CheckoutPage() {
  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const [cartItems, setCartItems] =
    useState<CartItem[]>([]);

  const [buyNowProduct, setBuyNowProduct] =
    useState<Product | null>(null);

  const [buyNowQuantity, setBuyNowQuantity] =
    useState(1);

  const [form, setForm] =
    useState<FormData>(initialForm);

  const [sameBillingAddress, setSameBillingAddress] =
    useState(true);

  const [loading, setLoading] =
    useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [error, setError] =
    useState("");

  const [userId, setUserId] =
    useState<string | null>(null);

  const [showLoginModal, setShowLoginModal] =
    useState(false);

  /*
   * =========================================================
   * LOAD USER + PROFILE + CHECKOUT
   * =========================================================
   */

  useEffect(() => {
    async function loadCheckout() {
      try {
        setLoading(true);
        setError("");

        /*
         * -----------------------------------------------------
         * GET USER
         * -----------------------------------------------------
         */

        const {
          data: {
            user,
          },
          error: userError,
        } =
          await supabase.auth.getUser();

        if (userError || !user) {
          console.log(
            "Checkout requires login:",
            userError?.message || "No active session",
          );

          setShowLoginModal(true);
          setLoading(false);

          return;
        }

        setUserId(user.id);

        /*
         * -----------------------------------------------------
         * FETCH PROFILE
         * -----------------------------------------------------
         */

        const {
          data: profile,
          error: profileError,
        } =
          await supabase
            .from("profiles")
            .select(
              `
                id,
                full_name,
                email,
                phone,
                address,
                apartment,
                city,
                state,
                postal_code,
                country
              `,
            )
            .eq("id", user.id)
            .maybeSingle();

        if (profileError) {
          console.error(
            "Profile fetch error:",
            profileError,
          );
        }

        /*
         * -----------------------------------------------------
         * PREFILL PROFILE DATA
         * -----------------------------------------------------
         */

        const savedProfile =
          profile as Profile | null;

        setForm({
          customer_name:
            savedProfile?.full_name ||
            "",

          customer_email:
            savedProfile?.email ||
            user.email ||
            "",

          customer_phone:
            savedProfile?.phone ||
            "",

          shipping_address_line1:
            savedProfile?.address ||
            "",

          shipping_address_line2:
            savedProfile?.apartment ||
            "",

          shipping_city:
            savedProfile?.city ||
            "",

          shipping_state:
            savedProfile?.state ||
            "",

          shipping_postal_code:
            savedProfile?.postal_code ||
            "",

          shipping_country:
            savedProfile?.country ||
            "India",

          billing_address_line1:
            savedProfile?.address ||
            "",

          billing_address_line2:
            savedProfile?.apartment ||
            "",

          billing_city:
            savedProfile?.city ||
            "",

          billing_state:
            savedProfile?.state ||
            "",

          billing_postal_code:
            savedProfile?.postal_code ||
            "",

          billing_country:
            savedProfile?.country ||
            "India",

          customer_note: "",
        });

        /*
         * -----------------------------------------------------
         * CHECK URL FOR BUY NOW
         * -----------------------------------------------------
         */

        const params =
          new URLSearchParams(
            window.location.search,
          );

        const productSlug =
          params.get("product");

        /*
         * -----------------------------------------------------
         * BUY NOW PRODUCT
         * -----------------------------------------------------
         */

        if (productSlug) {
          const {
            data: product,
            error: productError,
          } =
            await supabase
              .from("products")
              .select(
                `
                  id,
                  name,
                  slug,
                  price,
                  stock,
                  status,
                  main_image_url
                `,
              )
              .eq(
                "slug",
                productSlug,
              )
              .eq(
                "status",
                "active",
              )
              .maybeSingle();

          if (productError) {
            throw new Error(
              productError.message,
            );
          }

          if (!product) {
            throw new Error(
              "This product is no longer available.",
            );
          }

          if (
            product.stock !== null &&
            product.stock <= 0
          ) {
            throw new Error(
              "This product is currently out of stock.",
            );
          }

          setBuyNowProduct(
            product as Product,
          );

          setBuyNowQuantity(1);

          return;
        }

        /*
         * -----------------------------------------------------
         * NORMAL CART
         * -----------------------------------------------------
         */

        const {
          data,
          error: cartError,
        } =
          await supabase
            .from("cart_items")
            .select(
              `
                id,
                product_id,
                quantity,
                products (
                  id,
                  name,
                  slug,
                  price,
                  stock,
                  status,
                  main_image_url
                )
              `,
            )
            .eq(
              "user_id",
              user.id,
            );

        if (cartError) {
          throw new Error(
            cartError.message,
          );
        }

        setCartItems(
          (data || []) as CartItem[],
        );
      } catch (err) {
        console.error(
          "Checkout loading error:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load checkout.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadCheckout();
  }, [supabase]);

  /*
   * =========================================================
   * UPDATE FIELD
   * =========================================================
   */

  function updateField(
    field: keyof FormData,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /*
   * =========================================================
   * BILLING ADDRESS TOGGLE
   * =========================================================
   */

  function handleBillingToggle(
    checked: boolean,
  ) {
    setSameBillingAddress(
      checked,
    );

    if (checked) {
      setForm((current) => ({
        ...current,

        billing_address_line1:
          current.shipping_address_line1,

        billing_address_line2:
          current.shipping_address_line2,

        billing_city:
          current.shipping_city,

        billing_state:
          current.shipping_state,

        billing_postal_code:
          current.shipping_postal_code,

        billing_country:
          current.shipping_country,
      }));
    }
  }

  /*
   * =========================================================
   * AUTO SAVE PROFILE
   *
   * Saves the user's latest address/details after
   * they have entered a complete shipping address.
   * =========================================================
   */

  useEffect(() => {
    if (!userId) {
      return;
    }

    const hasRequiredAddress =
      form.customer_name.trim() !== "" &&
      form.customer_phone.trim() !== "" &&
      form.shipping_address_line1.trim() !== "" &&
      form.shipping_city.trim() !== "" &&
      form.shipping_state.trim() !== "" &&
      form.shipping_postal_code.trim() !== "" &&
      form.shipping_country.trim() !== "";

    if (!hasRequiredAddress) {
      return;
    }

    const timer =
      window.setTimeout(
        async () => {
          try {
            setSavingProfile(true);

            const {
              error: saveError,
            } =
              await supabase
                .from("profiles")
                .upsert(
                  {
                    id: userId,

                    full_name:
                      form.customer_name.trim(),

                    email:
                      form.customer_email.trim(),

                    phone:
                      form.customer_phone.trim(),

                    address:
                      form.shipping_address_line1.trim(),

                    apartment:
                      form.shipping_address_line2.trim() ||
                      null,

                    city:
                      form.shipping_city.trim(),

                    state:
                      form.shipping_state.trim(),

                    postal_code:
                      form.shipping_postal_code.trim(),

                    country:
                      form.shipping_country.trim(),

                    updated_at:
                      new Date().toISOString(),
                  },
                  {
                    onConflict: "id",
                  },
                );

            if (saveError) {
              console.error(
                "Profile save error:",
                saveError,
              );
            }
          } catch (saveError) {
            console.error(
              "Unable to save profile:",
              saveError,
            );
          } finally {
            setSavingProfile(false);
          }
        },
        800,
      );

    return () => {
      window.clearTimeout(
        timer,
      );
    };
  }, [
    userId,
    form.customer_name,
    form.customer_email,
    form.customer_phone,
    form.shipping_address_line1,
    form.shipping_address_line2,
    form.shipping_city,
    form.shipping_state,
    form.shipping_postal_code,
    form.shipping_country,
    supabase,
  ]);

  /*
   * =========================================================
   * NORMALIZE CART ITEMS
   * =========================================================
   */

  const normalizedCartItems =
    useMemo(() => {
      return cartItems
        .map((item) => ({
          ...item,

          product:
            normalizeProduct(
              item.products,
            ),
        }))
        .filter(
          (
            item,
          ): item is CartItem & {
            product: Product;
          } =>
            Boolean(
              item.product,
            ),
        );
    }, [cartItems]);

  /*
   * =========================================================
   * CHECKOUT ITEMS
   * =========================================================
   */

  const checkoutItems =
    useMemo<CheckoutItem[]>(
      () => {
        /*
         * BUY NOW
         */

        if (buyNowProduct) {
          return [
            {
              id: "buy-now",

              product_id:
                buyNowProduct.id,

              quantity:
                buyNowQuantity,

              product:
                buyNowProduct,
            },
          ];
        }

        /*
         * NORMAL CART
         */

        return normalizedCartItems.map(
          (item) => ({
            id: item.id,

            product_id:
              item.product_id,

            quantity:
              item.quantity,

            product:
              item.product,
          }),
        );
      },
      [
        buyNowProduct,
        buyNowQuantity,
        normalizedCartItems,
      ],
    );

  /*
   * =========================================================
   * TOTAL
   * =========================================================
   */

  const subtotal =
    useMemo(() => {
      return checkoutItems.reduce(
        (sum, item) =>
          sum +
          Number(
            item.product.price,
          ) *
            item.quantity,
        0,
      );
    }, [checkoutItems]);

  const shipping = 0;
  const tax = 0;

  const total =
    subtotal +
    shipping +
    tax;

  /*
   * =========================================================
   * FORM VALIDATION
   * =========================================================
   */

  const formValid =
    form.customer_name.trim() !== "" &&
    form.customer_email.trim() !== "" &&
    form.customer_phone.trim() !== "" &&
    form.shipping_address_line1.trim() !== "" &&
    form.shipping_city.trim() !== "" &&
    form.shipping_state.trim() !== "" &&
    form.shipping_postal_code.trim() !== "" &&
    form.shipping_country.trim() !== "";

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading && !showLoginModal) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF8F2]">

        <div className="text-center">

          <div className="mx-auto mb-5 h-8 w-8 animate-spin rounded-full border-2 border-[#B8860B]/20 border-t-[#B8860B]" />

          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#8A8174]">
            Preparing Checkout
          </p>

        </div>

      </main>
    );
  }

  /*
   * =========================================================
   * ERROR
   * =========================================================
   */

  if (error) {
    return (
      <main className="min-h-screen bg-[#FAF8F2]">

        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6">

          <div className="w-full border border-[#241F18]/10 bg-white p-10 text-center">

            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B8860B]">
              Checkout
            </p>

            <h1 className="mt-3 font-serif text-4xl font-semibold">
              Unable to Continue
            </h1>

            <p className="mt-4 text-sm leading-7 text-[#756B5B]">
              {error}
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex min-h-12 items-center justify-center bg-[#241F18] px-7 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#B8860B]"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </main>
    );
  }

  /*
   * =========================================================
   * EMPTY CHECKOUT
   * =========================================================
   */

  if (
    checkoutItems.length ===
    0
  ) {
    return (
      <main className="min-h-screen bg-[#FAF8F2]">

        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6">

          <div className="w-full border border-[#241F18]/10 bg-white p-10 text-center">

            <ShoppingBag
              size={45}
              strokeWidth={1.2}
              className="mx-auto text-[#B8860B]"
            />

            <h1 className="mt-6 font-serif text-4xl font-semibold">
             You are not login !! 
             Login first !
            </h1>

           

            <Link
              href="/login"
              className="mt-7 inline-flex min-h-12 items-center justify-center bg-[#241F18] px-7 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#B8860B]"
            >
              Continue to login
            </Link>

          </div>

        </div>

      </main>
    );
  }

  /*
   * =========================================================
   * LOGIN REQUIRED MODAL
   * =========================================================
   */

  if (showLoginModal) {
    const currentCheckoutUrl =
      window.location.pathname +
      window.location.search;

    return (
      <main className="relative min-h-screen bg-[#FAF8F2]">
        <div className="flex min-h-screen items-center justify-center px-5">
          <div
            className="fixed inset-0 bg-[#171512]/55 backdrop-blur-[3px]"
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-required-title"
            className="relative z-10 w-full max-w-md border border-[#D8C7A5] bg-[#FAF8F2] p-7 shadow-[0_25px_80px_rgba(36,31,24,0.25)] sm:p-10"
          >
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              aria-label="Close login popup"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center text-xl font-light text-[#756B5B] transition hover:text-[#241F18]"
            >
              ×
            </button>

            <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#B8860B]/30 bg-white text-[#B8860B]">
              <LogIn size={22} strokeWidth={1.4} />
            </div>

            <p className="mt-7 text-center text-[9px] font-bold uppercase tracking-[0.28em] text-[#B8860B]">
              NIRA Furniture
            </p>

            <h1
              id="login-required-title"
              className="mt-3 text-center font-serif text-3xl font-semibold text-[#241F18] sm:text-4xl"
            >
              Login First
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-7 text-[#756B5B]"
            >
              Please login to continue to checkout and securely place your
              order.
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href =
                  `/login?next=${encodeURIComponent(
                    currentCheckoutUrl,
                  )}`;
              }}
              className="mt-8 flex h-12 w-full items-center justify-center gap-3 bg-[#241F18] px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#B8860B] hover:tracking-[0.24em]"
            >
              <span>Login to Continue</span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="mt-5 block w-full text-center text-[9px] font-bold uppercase tracking-[0.16em] text-[#8A8174] transition hover:text-[#241F18]"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * MAIN CHECKOUT
   * =========================================================
   */

  return (
    <main className="min-h-screen bg-[#FAF8F2] text-[#241F18]">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <header className="border-b border-[#241F18]/10 bg-[#FAF8F2]">

        <div className="mx-auto flex min-h-[82px] max-w-[1480px] items-center justify-between px-6 sm:px-10 lg:px-16">

          <Link
            href={
              buyNowProduct
                ? `/products/${buyNowProduct.slug}`
                : "/cart"
            }
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#756B5B] transition hover:text-[#B8860B]"
          >
            <ArrowLeft size={15} />
            Back
          </Link>

          <Link
            href="/"
            className="font-serif text-2xl font-semibold tracking-[0.18em]"
          >
            NIRA
          </Link>

          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#8A8174]">

            <Lock size={13} />

            Secure Checkout

          </div>

        </div>

      </header>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <section className="mx-auto max-w-[1480px] px-6 py-12 sm:px-10 lg:px-16 lg:py-16">

        {/* PAGE TITLE */}

        <div className="mb-10">

          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B8860B]">
            NIRA Furniture
          </p>

          <h1 className="mt-3 font-serif text-5xl font-semibold tracking-[-0.03em] sm:text-6xl">
            Checkout
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#756B5B]">
            Complete your details below to
            securely place your order.
          </p>

        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">

          {/* ================================================= */}
          {/* LEFT */}
          {/* ================================================= */}

          <div className="space-y-8">

            {/* CONTACT */}

            <section className="border border-[#241F18]/10 bg-white p-6 sm:p-8">

              <SectionHeading
                number="01"
                title="Contact Information"
                description="Your saved information has been filled automatically."
              />

              <div className="grid gap-5 sm:grid-cols-2">

                <Input
                  label="Full Name"
                  value={
                    form.customer_name
                  }
                  onChange={(value) =>
                    updateField(
                      "customer_name",
                      value,
                    )
                  }
                  placeholder="Your full name"
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={
                    form.customer_email
                  }
                  onChange={(value) =>
                    updateField(
                      "customer_email",
                      value,
                    )
                  }
                  placeholder="you@example.com"
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  value={
                    form.customer_phone
                  }
                  onChange={(value) =>
                    updateField(
                      "customer_phone",
                      value,
                    )
                  }
                  placeholder="+91 98765 43210"
                  required
                />

              </div>

            </section>

            {/* SHIPPING */}

            <section className="border border-[#241F18]/10 bg-white p-6 sm:p-8">

              <SectionHeading
                number="02"
                title="Shipping Address"
                description={
                  form.shipping_address_line1
                    ? "Your saved delivery address has been filled automatically."
                    : "Please enter your delivery address."
                }
              />

              <div className="grid gap-5 sm:grid-cols-2">

                <div className="sm:col-span-2">

                  <Input
                    label="Address Line 1"
                    value={
                      form.shipping_address_line1
                    }
                    onChange={(value) =>
                      updateField(
                        "shipping_address_line1",
                        value,
                      )
                    }
                    placeholder="House number, street, area"
                    required
                  />

                </div>

                <div className="sm:col-span-2">

                  <Input
                    label="Apartment / Landmark"
                    value={
                      form.shipping_address_line2
                    }
                    onChange={(value) =>
                      updateField(
                        "shipping_address_line2",
                        value,
                      )
                    }
                    placeholder="Apartment, landmark, etc. (optional)"
                  />

                </div>

                <Input
                  label="City"
                  value={
                    form.shipping_city
                  }
                  onChange={(value) =>
                    updateField(
                      "shipping_city",
                      value,
                    )
                  }
                  placeholder="City"
                  required
                />

                <Input
                  label="State"
                  value={
                    form.shipping_state
                  }
                  onChange={(value) =>
                    updateField(
                      "shipping_state",
                      value,
                    )
                  }
                  placeholder="State"
                  required
                />

                <Input
                  label="Postal Code"
                  value={
                    form.shipping_postal_code
                  }
                  onChange={(value) =>
                    updateField(
                      "shipping_postal_code",
                      value,
                    )
                  }
                  placeholder="560001"
                  required
                />

                <Input
                  label="Country"
                  value={
                    form.shipping_country
                  }
                  onChange={(value) =>
                    updateField(
                      "shipping_country",
                      value,
                    )
                  }
                  placeholder="India"
                  required
                />

              </div>

              {/* SAVING INDICATOR */}

              {savingProfile && (
                <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#B8860B]">
                  Saving your address...
                </p>
              )}

              {!savingProfile &&
                form.shipping_address_line1 &&
                form.shipping_city &&
                form.shipping_state &&
                form.shipping_postal_code && (
                  <p className="mt-5 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.15em] text-[#8A8174]">

                    <Check
                      size={13}
                      className="text-[#B8860B]"
                    />

                    Address saved for future orders

                  </p>
                )}

            </section>

            {/* BILLING */}

            <section className="border border-[#241F18]/10 bg-white p-6 sm:p-8">

              <SectionHeading
                number="03"
                title="Billing Address"
                description="Billing details for your payment receipt."
              />

              <label className="mb-7 flex cursor-pointer items-center gap-3 border border-[#241F18]/10 bg-[#FAF8F2] px-4 py-4 text-sm">

                <input
                  type="checkbox"
                  checked={
                    sameBillingAddress
                  }
                  onChange={(event) =>
                    handleBillingToggle(
                      event.target.checked,
                    )
                  }
                  className="h-4 w-4 accent-[#B8860B]"
                />

                <span>
                  Billing address is the same
                  as shipping address
                </span>

                {sameBillingAddress && (
                  <Check
                    size={16}
                    className="ml-auto text-[#B8860B]"
                  />
                )}

              </label>

              {!sameBillingAddress && (
                <div className="grid gap-5 sm:grid-cols-2">

                  <div className="sm:col-span-2">

                    <Input
                      label="Address Line 1"
                      value={
                        form.billing_address_line1
                      }
                      onChange={(value) =>
                        updateField(
                          "billing_address_line1",
                          value,
                        )
                      }
                      placeholder="House number, street, area"
                      required
                    />

                  </div>

                  <div className="sm:col-span-2">

                    <Input
                      label="Apartment / Landmark"
                      value={
                        form.billing_address_line2
                      }
                      onChange={(value) =>
                        updateField(
                          "billing_address_line2",
                          value,
                        )
                      }
                      placeholder="Apartment, landmark, etc. (optional)"
                    />

                  </div>

                  <Input
                    label="City"
                    value={
                      form.billing_city
                    }
                    onChange={(value) =>
                      updateField(
                        "billing_city",
                        value,
                      )
                    }
                    placeholder="City"
                    required
                  />

                  <Input
                    label="State"
                    value={
                      form.billing_state
                    }
                    onChange={(value) =>
                      updateField(
                        "billing_state",
                        value,
                      )
                    }
                    placeholder="State"
                    required
                  />

                  <Input
                    label="Postal Code"
                    value={
                      form.billing_postal_code
                    }
                    onChange={(value) =>
                      updateField(
                        "billing_postal_code",
                        value,
                      )
                    }
                    placeholder="560001"
                    required
                  />

                  <Input
                    label="Country"
                    value={
                      form.billing_country
                    }
                    onChange={(value) =>
                      updateField(
                        "billing_country",
                        value,
                      )
                    }
                    placeholder="India"
                    required
                  />

                </div>
              )}

            </section>

            {/* ORDER NOTE */}

            <section className="border border-[#241F18]/10 bg-white p-6 sm:p-8">

              <h2 className="font-serif text-3xl font-semibold">
                Order Note
              </h2>

              <p className="mt-1 text-xs text-[#8A8174]">
                Optional instructions for our team.
              </p>

              <textarea
                value={
                  form.customer_note
                }
                onChange={(event) =>
                  updateField(
                    "customer_note",
                    event.target.value,
                  )
                }
                rows={5}
                placeholder="Any delivery instructions or special requests..."
                className="mt-6 w-full resize-none border border-[#241F18]/15 bg-[#FAF8F2] px-4 py-4 text-sm leading-7 outline-none transition focus:border-[#B8860B]"
              />

            </section>

          </div>

          {/* ================================================= */}
          {/* RIGHT */}
          {/* ================================================= */}

          <aside className="lg:sticky lg:top-8 lg:h-fit">

            <div className="border border-[#241F18]/10 bg-white">

              {/* SUMMARY */}

              <div className="border-b border-[#241F18]/10 px-6 py-6">

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B8860B]">
                  {buyNowProduct
                    ? "Buy Now"
                    : "Order Summary"}
                </p>

                <h2 className="mt-2 font-serif text-3xl font-semibold">
                  Your Selection
                </h2>

              </div>

              {/* PRODUCTS */}

              <div className="divide-y divide-[#241F18]/10">

                {checkoutItems.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 px-6 py-5"
                    >

                      {/* IMAGE */}

                      <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-[#F1EDE3]">

                        {item.product
                          .main_image_url ? (
                          <NextImage
                            src={
                              item.product
                                .main_image_url
                            }
                            alt={
                              item.product.name
                            }
                            fill
                            unoptimized
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">

                            <ShoppingBag
                              size={20}
                              className="text-[#B8860B]"
                            />

                          </div>
                        )}

                      </div>

                      {/* DETAILS */}

                      <div className="min-w-0 flex-1">

                        <h3 className="font-serif text-lg font-semibold leading-tight">
                          {
                            item.product.name
                          }
                        </h3>

                        <div className="mt-2 flex items-center justify-between">

                          <p className="text-xs text-[#8A8174]">
                            Qty:{" "}
                            {item.quantity}
                          </p>

                          <p className="text-sm font-bold">
                            ₹
                            {(
                              Number(
                                item.product
                                  .price,
                              ) *
                              item.quantity
                            ).toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              },
                            )}
                          </p>

                        </div>

                        {/* BUY NOW QUANTITY */}

                        {buyNowProduct && (
                          <div className="mt-3 flex items-center gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                setBuyNowQuantity(
                                  Math.max(
                                    1,
                                    buyNowQuantity -
                                      1,
                                  ),
                                )
                              }
                              className="flex h-7 w-7 items-center justify-center border border-[#241F18]/15 text-sm transition hover:border-[#B8860B]"
                            >
                              −
                            </button>

                            <span className="min-w-6 text-center text-xs font-bold">
                              {buyNowQuantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                setBuyNowQuantity(
                                  buyNowProduct.stock ===
                                    null
                                    ? buyNowQuantity +
                                      1
                                    : Math.min(
                                        buyNowQuantity +
                                          1,
                                        buyNowProduct.stock,
                                      ),
                                )
                              }
                              className="flex h-7 w-7 items-center justify-center border border-[#241F18]/15 text-sm transition hover:border-[#B8860B]"
                            >
                              +
                            </button>

                          </div>
                        )}

                      </div>

                    </div>
                  ),
                )}

              </div>

              {/* TOTALS */}

              <div className="border-t border-[#241F18]/10 px-6 py-6">

                <div className="flex items-center justify-between py-2">

                  <span className="text-sm text-[#756B5B]">
                    Subtotal
                  </span>

                  <span className="text-sm font-semibold">
                    ₹
                    {subtotal.toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}
                  </span>

                </div>

                <div className="flex items-center justify-between py-2">

                  <span className="text-sm text-[#756B5B]">
                    Shipping
                  </span>

                  <span className="text-sm font-semibold">
                    Complimentary
                  </span>

                </div>

                {tax > 0 && (
                  <div className="flex items-center justify-between py-2">

                    <span className="text-sm text-[#756B5B]">
                      Tax
                    </span>

                    <span className="text-sm font-semibold">
                      ₹
                      {tax.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}
                    </span>

                  </div>
                )}

                <div className="mt-4 border-t border-[#241F18]/10 pt-5">

                  <div className="flex items-end justify-between gap-4">

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8860B]">
                        Total
                      </p>

                      <p className="mt-1 text-[10px] text-[#8A8174]">
                        INR
                      </p>

                    </div>

                    <p className="font-serif text-3xl font-semibold">
                      ₹
                      {total.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}
                    </p>

                  </div>

                </div>

              </div>

              {/* RAZORPAY */}

              <div className="border-t border-[#241F18]/10 bg-[#FAF8F2] p-6">

                <RazorpayCheckoutButton
                  customerName={
                    form.customer_name
                  }
                  customerEmail={
                    form.customer_email
                  }
                  customerPhone={
                    form.customer_phone
                  }

                  productId={
                    buyNowProduct?.id
                  }

                  quantity={
                    buyNowProduct
                      ? buyNowQuantity
                      : undefined
                  }

                  shippingAddressLine1={
                    form.shipping_address_line1
                  }
                  shippingAddressLine2={
                    form.shipping_address_line2
                  }
                  shippingCity={
                    form.shipping_city
                  }
                  shippingState={
                    form.shipping_state
                  }
                  shippingPostalCode={
                    form.shipping_postal_code
                  }
                  shippingCountry={
                    form.shipping_country
                  }

                  billingAddressLine1={
                    sameBillingAddress
                      ? form.shipping_address_line1
                      : form.billing_address_line1
                  }

                  billingAddressLine2={
                    sameBillingAddress
                      ? form.shipping_address_line2
                      : form.billing_address_line2
                  }

                  billingCity={
                    sameBillingAddress
                      ? form.shipping_city
                      : form.billing_city
                  }

                  billingState={
                    sameBillingAddress
                      ? form.shipping_state
                      : form.billing_state
                  }

                  billingPostalCode={
                    sameBillingAddress
                      ? form.shipping_postal_code
                      : form.billing_postal_code
                  }

                  billingCountry={
                    sameBillingAddress
                      ? form.shipping_country
                      : form.billing_country
                  }

                  customerNote={
                    form.customer_note
                  }

                  disabled={
                    !formValid ||
                    checkoutItems.length ===
                      0 ||
                    total <= 0
                  }
                />

                {!formValid && (
                  <p className="mt-4 text-center text-[10px] font-medium leading-5 text-[#8A8174]">
                    Please complete the required
                    customer and shipping details
                    before continuing.
                  </p>
                )}

                <div className="mt-5 flex items-start gap-3">

                  <Lock
                    size={14}
                    className="mt-0.5 shrink-0 text-[#B8860B]"
                  />

                  <p className="text-[10px] leading-5 text-[#8A8174]">
                    Your payment is securely
                    processed by Razorpay. NIRA
                    Furniture does not store your
                    card or UPI credentials.
                  </p>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </section>

    </main>
  );
}

/*
 * =========================================================
 * SECTION HEADING
 * =========================================================
 */

function SectionHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7 flex items-start gap-4">

      <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#241F18] text-xs font-bold text-white">
        {number}
      </span>

      <div>

        <h2 className="font-serif text-3xl font-semibold">
          {title}
        </h2>

        <p className="mt-1 text-xs text-[#8A8174]">
          {description}
        </p>

      </div>

    </div>
  );
}

/*
 * =========================================================
 * INPUT
 * =========================================================
 */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>

      <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#40382E]">

        {label}

        {required && (
          <span className="ml-1 text-[#B8860B]">
            *
          </span>
        )}

      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        placeholder={placeholder}
        required={required}
        className="w-full border border-[#241F18]/15 bg-[#FAF8F2] px-4 py-4 text-sm outline-none transition placeholder:text-[#241F18]/25 focus:border-[#B8860B]"
      />

    </div>
  );
}