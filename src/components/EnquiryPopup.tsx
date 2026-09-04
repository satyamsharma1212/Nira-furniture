"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

export default function EnquiryPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("nira-enquiry-popup");

    if (!alreadyShown) {
      const timer = setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem("nira-enquiry-popup", "true");
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#211E1A]/45 px-4 py-6 backdrop-blur-[5px]">

      {/* =====================================================
          BACKDROP
      ====================================================== */}
      <button
        type="button"
        aria-label="Close enquiry"
        onClick={() => setOpen(false)}
        className="absolute inset-0 cursor-default"
      />

      {/* =====================================================
          MODAL
      ====================================================== */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-[1040px]
          overflow-hidden
          border
          border-[#211E1A]/10
          bg-[#F4F0E8]
          shadow-[0_35px_100px_rgba(20,17,12,0.25)]
        "
      >
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">

          {/* =================================================
              LEFT — EDITORIAL IMAGE
          ================================================= */}
          <div className="relative hidden min-h-[620px] overflow-hidden lg:block">

            <Image
              src="/enquiry-popup2.jpg"
              alt="NIRA Furniture"
              fill
              priority
              sizes="50vw"
              className="object-cover object-center"
            />

            {/* Image overlay */}
            <div className="absolute inset-0 bg-black/10" />

            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

            {/* Top label */}
            <div className="absolute left-9 top-9">
              <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-white/75">
                NIRA Furniture
              </p>

              <div className="mt-4 h-px w-10 bg-[#B89A62]" />
            </div>

            {/* Bottom copy */}
            <div className="absolute bottom-9 left-9 right-9 text-white">
              <p className="mb-4 text-[9px] font-medium uppercase tracking-[0.3em] text-white/60">
                Private Design Consultation
              </p>

              <h2 className="max-w-md font-serif text-5xl leading-[0.92] tracking-[-0.03em]">
                Furniture
                <br />
                <span className="italic text-[#D2BC91]">
                  made for living.
                </span>
              </h2>

              <p className="mt-6 max-w-sm text-xs leading-6 text-white/65">
                Tell us about your space and discover furniture considered
                around the way you live.
              </p>
            </div>
          </div>

          {/* =================================================
              RIGHT — FORM
          ================================================= */}
          <div className="relative px-6 py-8 sm:px-10 sm:py-11 lg:px-14 lg:py-14">

            {/* Close */}
            <button
              type="button"
              aria-label="Close enquiry"
              onClick={() => setOpen(false)}
              className="
                absolute
                right-5
                top-5
                flex
                h-9
                w-9
                items-center
                justify-center
                border
                border-[#211E1A]/10
                text-[#70685E]
                transition-all
                duration-300
                hover:border-[#927344]
                hover:bg-[#927344]
                hover:text-white
              "
            >
              <X size={16} strokeWidth={1.4} />
            </button>

            <div className="max-w-md">

              {/* Eyebrow */}
              <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#927344]">
                Start a conversation
              </p>

              {/* Heading */}
              <h3 className="mt-5 font-serif text-4xl leading-[0.98] tracking-[-0.025em] text-[#211E1A] sm:text-5xl">
                Let&apos;s create
                <br />
                something{" "}
                <span className="italic text-[#756D63]">
                  considered.
                </span>
              </h3>

              <p className="mt-5 max-w-sm text-xs leading-6 text-[#746D63]">
                Share a little about what you are looking for. Our team will
                get in touch to understand your requirements.
              </p>

              {/* Small divider */}
              <div className="mt-7 h-px w-12 bg-[#927344]" />

              {/* =================================================
                  FORM
              ================================================= */}
              <form
                className="mt-7 space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();

                  const form = event.currentTarget;
                  const formData = new FormData(form);

                  const name = formData.get("name");
                  const phone = formData.get("phone");
                  const requirement = formData.get("requirement");

                  console.log({
                    name,
                    phone,
                    requirement,
                  });

                  setOpen(false);

                  window.location.href = "/enquiry";
                }}
              >

                {/* Name */}
                <div>
                  <label
                    htmlFor="enquiry-name"
                    className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#756D63]"
                  >
                    Name
                  </label>

                  <input
                    id="enquiry-name"
                    required
                    name="name"
                    type="text"
                    placeholder="Your name"
                    className="
                      h-12
                      w-full
                      border
                      border-[#211E1A]/10
                      bg-transparent
                      px-4
                      text-sm
                      text-[#211E1A]
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-[#AAA297]
                      focus:border-[#927344]
                      focus:bg-white/50
                    "
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="enquiry-phone"
                    className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#756D63]"
                  >
                    Phone
                  </label>

                  <input
                    id="enquiry-phone"
                    required
                    name="phone"
                    type="tel"
                    placeholder="+91"
                    className="
                      h-12
                      w-full
                      border
                      border-[#211E1A]/10
                      bg-transparent
                      px-4
                      text-sm
                      text-[#211E1A]
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-[#AAA297]
                      focus:border-[#927344]
                      focus:bg-white/50
                    "
                  />
                </div>

                {/* Requirement */}
                <div>
                  <label
                    htmlFor="enquiry-requirement"
                    className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#756D63]"
                  >
                    Your requirement
                  </label>

                  <textarea
                    id="enquiry-requirement"
                    required
                    name="requirement"
                    rows={3}
                    placeholder="Tell us about your furniture or space..."
                    className="
                      w-full
                      resize-none
                      border
                      border-[#211E1A]/10
                      bg-transparent
                      px-4
                      py-3
                      text-sm
                      leading-6
                      text-[#211E1A]
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-[#AAA297]
                      focus:border-[#927344]
                      focus:bg-white/50
                    "
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="
                    group
                    mt-2
                    flex
                    min-h-13
                    w-full
                    items-center
                    justify-center
                    gap-4
                    bg-[#211E1A]
                    px-6
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    text-[#F4F0E8]
                    transition-all
                    duration-500
                    hover:bg-[#927344]
                  "
                >
                  Begin an enquiry

                  <ArrowRight
                    size={14}
                    strokeWidth={1.4}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </button>
              </form>

              {/* Detailed enquiry */}
              <Link
                href="/enquiry"
                onClick={() => setOpen(false)}
                className="
                  group
                  mt-5
                  flex
                  items-center
                  justify-center
                  gap-3
                  text-center
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#82796D]
                  transition-colors
                  duration-300
                  hover:text-[#927344]
                "
              >
                Prefer a detailed enquiry?

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              {/* Trust details */}
              <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-[#211E1A]/10 pt-6 text-[8px] font-medium uppercase tracking-[0.18em] text-[#9A9287]">
                <span>Made in India</span>
                <span className="text-[#927344]">•</span>
                <span>Custom Furniture</span>
                <span className="text-[#927344]">•</span>
                <span>Pan India</span>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            MOBILE IMAGE STRIP
        ====================================================== */}
        <div className="relative block h-44 overflow-hidden lg:hidden">
          <Image
            src="/enquiry-popup.jpg"
            alt="NIRA Furniture"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-black/20" />

          <div className="absolute bottom-5 left-6">
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/70">
              NIRA Furniture
            </p>

            <h2 className="mt-2 font-serif text-3xl text-white">
              Furniture made for{" "}
              <span className="italic text-[#D2BC91]">living.</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}