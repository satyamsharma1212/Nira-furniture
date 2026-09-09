"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [userId, setUserId] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    avatar: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const metadata = user.user_metadata || {};

      setUserId(user.id);

      // Load customer details from public.profiles.
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        setError(profileError.message);
      }

      setForm({
        fullName:
          profile?.full_name ||
          metadata.full_name ||
          metadata.name ||
          "",

        email: profile?.email || user.email || "",

        phone: profile?.phone || "",

        address: profile?.address || "",

        apartment: profile?.apartment || "",

        city: profile?.city || "",

        state: profile?.state || "",

        postalCode: profile?.postal_code || "",

        country: profile?.country || "India",

        avatar:
          profile?.avatar_url ||
          metadata.avatar_url ||
          metadata.picture ||
          "",
      });

      setLoading(false);
    }

    loadProfile();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSave(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    const supabase = createClient();

    if (!userId) {
      setError("Your account could not be identified. Please sign in again.");
      setSaving(false);
      return;
    }

    // Save customer details to public.profiles.
    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          full_name: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          apartment: form.apartment,
          city: form.city,
          state: form.state,
          postal_code: form.postalCode,
          country: form.country,
          avatar_url: form.avatar,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setMessage("Your personal details have been saved.");
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F4EE]">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.25em] text-[#765A32]">
          Loading profile...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#171512]">

      {/* =========================================================
          HEADER
      ========================================================= */}
      <header className="border-b border-[#171512]/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">

          <Link
            href="/account"
            className="
              font-serif
              text-3xl
              font-semibold
              tracking-[0.18em]
              transition-colors
              hover:text-[#765A32]
            "
          >
            NIRA
          </Link>

          <Link
            href="/account"
            className="
              font-sans
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#171512]/55
              transition-colors
              hover:text-[#765A32]
            "
          >
            ← Account
          </Link>

        </div>
      </header>


      {/* =========================================================
          PAGE
      ========================================================= */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-10 lg:px-12 lg:py-24">

        {/* HEADING */}
        <div className="mb-14">

          <p className="mb-5 font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-[#765A32]">
            Profile
          </p>

          <h1 className="
            font-serif
            text-5xl
            font-semibold
            leading-none
            tracking-[-0.03em]
            sm:text-6xl
            lg:text-7xl
          ">
            Personal Details
          </h1>

          <p className="
            mt-6
            max-w-2xl
            font-sans
            text-base
            font-medium
            leading-7
            text-[#171512]/55
          ">
            Keep your contact and delivery information up to date
            for a seamless NIRA shopping experience.
          </p>

        </div>


        {/* =========================================================
            PROFILE HEADER
        ========================================================= */}
        <div className="mb-6 border border-[#171512]/10 bg-white/40 p-7 sm:p-10">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

            {/* AVATAR */}
            <div className="
              relative
              flex
              h-28
              w-28
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-full
              border
              border-[#B88A2B]/30
              bg-[#EDE7DC]
            ">

              {form.avatar ? (
                <Image
                  src={form.avatar}
                  alt={form.fullName || "NIRA Customer"}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              ) : (
                <span className="
                  font-serif
                  text-5xl
                  font-semibold
                  text-[#765A32]
                ">
                  {(form.fullName || "N").charAt(0).toUpperCase()}
                </span>
              )}

            </div>

            <div>
              <p className="
                mb-2
                font-sans
                text-[11px]
                font-bold
                uppercase
                tracking-[0.22em]
                text-[#765A32]
              ">
                Google Account
              </p>

              <h2 className="
                font-serif
                text-3xl
                font-semibold
                sm:text-4xl
              ">
                {form.fullName || "NIRA Customer"}
              </h2>

              <p className="
                mt-2
                break-all
                font-sans
                text-base
                font-medium
                text-[#171512]/50
              ">
                {form.email}
              </p>
            </div>

          </div>

        </div>


        {/* =========================================================
            FORM
        ========================================================= */}
        <form onSubmit={handleSave}>

          {/* PERSONAL INFORMATION */}
          <div className="border border-[#171512]/10 bg-white/40">

            <div className="border-b border-[#171512]/10 px-7 py-7 sm:px-10 sm:py-8">

              <p className="
                mb-3
                font-sans
                text-[11px]
                font-bold
                uppercase
                tracking-[0.25em]
                text-[#765A32]
              ">
                Personal Information
              </p>

              <h2 className="
                font-serif
                text-3xl
                font-semibold
                sm:text-4xl
              ">
                Your Details
              </h2>

            </div>


            <div className="grid gap-6 px-7 py-8 sm:px-10 sm:py-10 md:grid-cols-2">

              {/* FULL NAME */}
              <div className="md:col-span-2">
                <label
                  htmlFor="fullName"
                  className="mb-2 block font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#171512]/50"
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className="
                    h-14
                    w-full
                    border
                    border-[#171512]/15
                    bg-[#FBF9F3]
                    px-4
                    font-sans
                    text-base
                    font-medium
                    outline-none
                    transition-all
                    focus:border-[#B88A2B]
                  "
                />
              </div>


              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#171512]/50"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={form.email}
                  disabled
                  className="
                    h-14
                    w-full
                    cursor-not-allowed
                    border
                    border-[#171512]/10
                    bg-[#EEEAE2]
                    px-4
                    font-sans
                    text-base
                    font-semibold
                    text-[#171512]/50
                  "
                />

                <p className="mt-2 font-sans text-[10px] font-medium text-[#171512]/35">
                  Your Google account email cannot be changed here.
                </p>
              </div>


              {/* PHONE */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#171512]/50"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="
                    h-14
                    w-full
                    border
                    border-[#171512]/15
                    bg-[#FBF9F3]
                    px-4
                    font-sans
                    text-base
                    font-semibold
                    outline-none
                    transition-all
                    focus:border-[#B88A2B]
                  "
                />
              </div>

            </div>

          </div>


          {/* =========================================================
              SHIPPING ADDRESS
          ========================================================= */}
          <div className="mt-6 border border-[#171512]/10 bg-white/40">

            <div className="border-b border-[#171512]/10 px-7 py-7 sm:px-10 sm:py-8">

              <p className="
                mb-3
                font-sans
                text-[11px]
                font-bold
                uppercase
                tracking-[0.25em]
                text-[#765A32]
              ">
                Delivery
              </p>

              <h2 className="
                font-serif
                text-3xl
                font-semibold
                sm:text-4xl
              ">
                Shipping Address
              </h2>

              <p className="
                mt-3
                font-sans
                text-sm
                font-medium
                leading-6
                text-[#171512]/50
              ">
                Add the address where you would like your NIRA
                purchases delivered.
              </p>

            </div>


            <div className="grid gap-6 px-7 py-8 sm:px-10 sm:py-10 md:grid-cols-2">

              {/* ADDRESS */}
              <div className="md:col-span-2">

                <label
                  htmlFor="address"
                  className="mb-2 block font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#171512]/50"
                >
                  Street Address
                </label>

                <input
                  id="address"
                  name="address"
                  type="text"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House number, street name"
                  className="
                    h-14
                    w-full
                    border
                    border-[#171512]/15
                    bg-[#FBF9F3]
                    px-4
                    font-sans
                    text-base
                    font-semibold
                    outline-none
                    transition-all
                    focus:border-[#B88A2B]
                  "
                />

              </div>


              {/* APARTMENT */}
              <div className="md:col-span-2">

                <label
                  htmlFor="apartment"
                  className="mb-2 block font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#171512]/50"
                >
                  Apartment / Suite / Landmark
                </label>

                <input
                  id="apartment"
                  name="apartment"
                  type="text"
                  value={form.apartment}
                  onChange={handleChange}
                  placeholder="Apartment, suite, floor or landmark"
                  className="
                    h-14
                    w-full
                    border
                    border-[#171512]/15
                    bg-[#FBF9F3]
                    px-4
                    font-sans
                    text-base
                    font-semibold
                    outline-none
                    transition-all
                    focus:border-[#B88A2B]
                  "
                />

              </div>


              {/* CITY */}
              <div>

                <label
                  htmlFor="city"
                  className="mb-2 block font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#171512]/50"
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="
                    h-14
                    w-full
                    border
                    border-[#171512]/15
                    bg-[#FBF9F3]
                    px-4
                    font-sans
                    text-base
                    font-semibold
                    outline-none
                    transition-all
                    focus:border-[#B88A2B]
                  "
                />

              </div>


              {/* STATE */}
              <div>

                <label
                  htmlFor="state"
                  className="mb-2 block font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#171512]/50"
                >
                  State
                </label>

                <input
                  id="state"
                  name="state"
                  type="text"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="
                    h-14
                    w-full
                    border
                    border-[#171512]/15
                    bg-[#FBF9F3]
                    px-4
                    font-sans
                    text-base
                    font-semibold
                    outline-none
                    transition-all
                    focus:border-[#B88A2B]
                  "
                />

              </div>


              {/* PIN */}
              <div>

                <label
                  htmlFor="postalCode"
                  className="mb-2 block font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#171512]/50"
                >
                  PIN / ZIP Code
                </label>

                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="PIN / ZIP Code"
                  className="
                    h-14
                    w-full
                    border
                    border-[#171512]/15
                    bg-[#FBF9F3]
                    px-4
                    font-sans
                    text-base
                    font-semibold
                    outline-none
                    transition-all
                    focus:border-[#B88A2B]
                  "
                />

              </div>


              {/* COUNTRY */}
              <div>

                <label
                  htmlFor="country"
                  className="mb-2 block font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-[#171512]/50"
                >
                  Country
                </label>

                <input
                  id="country"
                  name="country"
                  type="text"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="
                    h-14
                    w-full
                    border
                    border-[#171512]/15
                    bg-[#FBF9F3]
                    px-4
                    font-sans
                    text-base
                    font-semibold
                    outline-none
                    transition-all
                    focus:border-[#B88A2B]
                  "
                />

              </div>

            </div>

          </div>


          {/* =========================================================
              SAVE
          ========================================================= */}
          <div className="mt-6 border border-[#171512]/10 bg-white/40 px-7 py-7 sm:px-10">

            {message && (
              <div className="mb-5 border border-[#765A32]/20 bg-[#EEE8DE] px-4 py-3">
                <p className="font-sans text-sm font-semibold text-[#765A32]">
                  {message}
                </p>
              </div>
            )}

            {error && (
              <div className="mb-5 border border-red-900/15 bg-red-50 px-4 py-3">
                <p className="font-sans text-sm font-semibold text-red-700">
                  {error}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="font-sans text-sm font-medium text-[#171512]/45">
                Your details are securely stored with Supabase.
              </p>

              <button
                type="submit"
                disabled={saving}
                className="
                  min-w-[190px]
                  bg-[#171512]
                  px-8
                  py-4
                  font-sans
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-white
                  transition-all
                  duration-300
                  hover:bg-[#765A32]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {saving ? "Saving..." : "Save Details"}
              </button>

            </div>

          </div>

        </form>


        {/* BACK */}
        <div className="mt-10">

          <Link
            href="/account"
            className="
              inline-flex
              items-center
              gap-3
              font-sans
              text-[11px]
              font-bold
              uppercase
              tracking-[0.22em]
              text-[#171512]/45
              transition-colors
              hover:text-[#765A32]
            "
          >
            ← Back to Account
          </Link>

        </div>

      </section>
    </main>
  );
}