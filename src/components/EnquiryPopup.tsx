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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#211E1A]/45 px-2.5 py-3 backdrop-blur-[5px] sm:px-4 sm:py-6">
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
          max-h-[92vh]
          overflow-y-auto
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
          <div className="relative px-4 py-5 sm:px-8 sm:py-9 lg:px-14 lg:py-14">
            {/* Close */}
            <button
              type="button"
              aria-label="Close enquiry"
              onClick={() => setOpen(false)}
              className="
                absolute
                right-3
                top-3
                flex
                h-8
                w-8
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
                sm:right-5
                sm:top-5
                sm:h-9
                sm:w-9
              "
            >
              <X size={15} strokeWidth={1.4} />
            </button>

            <div className="max-w-md">
              {/* Eyebrow */}
              <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#927344] sm:text-[9px] sm:tracking-[0.34em]">
                Start a conversation
              </p>

              {/* Heading */}
              <h3 className="mt-3 font-serif text-3xl leading-[0.98] tracking-[-0.025em] text-[#211E1A] sm:mt-5 sm:text-4xl lg:text-5xl">
                Let&apos;s create
                <br />
                something{" "}
                <span className="italic text-[#756D63]">
                  considered.
                </span>
              </h3>

              <p className="mt-3 max-w-sm text-[11px] leading-5 text-[#746D63] sm:mt-5 sm:text-xs sm:leading-6">
                Share a little about what you are looking for. Our team will
                get in touch to understand your requirements.
              </p>

              {/* Small divider */}
              <div className="mt-5 h-px w-10 bg-[#927344] sm:mt-7 sm:w-12" />

              {/* =================================================
                  FORM
              ================================================= */}
              <form
                className="mt-5 space-y-3 sm:mt-7 sm:space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();

                  const form = event.currentTarget;
                  const formData = new FormData(form);

                  const name = String(formData.get("name") || "").trim();
                  const phone = String(formData.get("phone") || "").trim();
                  const requirement = String(
                    formData.get("requirement") || ""
                  ).trim();

                  const whatsappNumber = "918279416862";

                  const whatsappMessage = `Hello NIRA Furniture,

I would like to make an enquiry.

*Customer Details*
Name: ${name}
Phone: ${phone}

*Requirement*
${requirement}

Thank you.
I look forward to hearing from the NIRA Furniture team.`;

                  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    whatsappMessage
                  )}`;

                  setOpen(false);

                  window.location.href = whatsappUrl;
                }}
              >
                {/* Name */}
                <div>
                  <label
                    htmlFor="enquiry-name"
                    className="mb-1.5 block text-[8px] font-semibold uppercase tracking-[0.18em] text-[#756D63] sm:mb-2 sm:text-[9px] sm:tracking-[0.2em]"
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
                      h-10
                      w-full
                      border
                      border-[#211E1A]/10
                      bg-transparent
                      px-3
                      text-sm
                      text-[#211E1A]
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-[#AAA297]
                      focus:border-[#927344]
                      focus:bg-white/50
                      sm:h-12
                      sm:px-4
                    "
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="enquiry-phone"
                    className="mb-1.5 block text-[8px] font-semibold uppercase tracking-[0.18em] text-[#756D63] sm:mb-2 sm:text-[9px] sm:tracking-[0.2em]"
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
                      h-10
                      w-full
                      border
                      border-[#211E1A]/10
                      bg-transparent
                      px-3
                      text-sm
                      text-[#211E1A]
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-[#AAA297]
                      focus:border-[#927344]
                      focus:bg-white/50
                      sm:h-12
                      sm:px-4
                    "
                  />
                </div>

                {/* Requirement */}
                <div>
                  <label
                    htmlFor="enquiry-requirement"
                    className="mb-1.5 block text-[8px] font-semibold uppercase tracking-[0.18em] text-[#756D63] sm:mb-2 sm:text-[9px] sm:tracking-[0.2em]"
                  >
                    Your requirement
                  </label>

                  <textarea
                    id="enquiry-requirement"
                    required
                    name="requirement"
                    rows={2}
                    placeholder="Tell us about your furniture or space..."
                    className="
                      w-full
                      resize-none
                      border
                      border-[#211E1A]/10
                      bg-transparent
                      px-3
                      py-2
                      text-sm
                      leading-5
                      text-[#211E1A]
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-[#AAA297]
                      focus:border-[#927344]
                      focus:bg-white/50
                      sm:px-4
                      sm:py-3
                      sm:leading-6
                    "
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="
                    group
                    mt-1
                    flex
                    min-h-11
                    w-full
                    items-center
                    justify-center
                    gap-3
                    bg-[#211E1A]
                    px-4
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-[#F4F0E8]
                    transition-all
                    duration-500
                    hover:bg-[#927344]
                    sm:mt-2
                    sm:min-h-13
                    sm:gap-4
                    sm:px-6
                    sm:text-[9px]
                    sm:tracking-[0.25em]
                  "
                >
                  Begin an enquiry

                  <ArrowRight
                    size={13}
                    strokeWidth={1.4}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </form>

              {/* Detailed enquiry */}
              <Link
                href="/enquiry"
                onClick={() => setOpen(false)}
                className="
                  group
                  mt-3
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-center
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-[#82796D]
                  transition-colors
                  duration-300
                  hover:text-[#927344]
                  sm:mt-5
                  sm:gap-3
                  sm:text-[9px]
                  sm:tracking-[0.2em]
                "
              >
                Prefer a detailed enquiry?

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              {/* Trust details */}
              <div
                className="
                  mt-5
                  flex
                  flex-wrap
                  justify-center
                  gap-x-3
                  gap-y-1.5
                  border-t
                  border-[#211E1A]/10
                  pt-4
                  text-[7px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-[#9A9287]
                  sm:mt-8
                  sm:gap-x-5
                  sm:gap-y-2
                  sm:pt-6
                  sm:text-[8px]
                  sm:tracking-[0.18em]
                "
              >
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
        <div className="relative block h-28 overflow-hidden sm:h-36 lg:hidden">
          <Image
            src="/enquiry-popup.jpg"
            alt="NIRA Furniture"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-black/20" />

          <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-6">
            <p className="text-[8px] uppercase tracking-[0.25em] text-white/70 sm:text-[9px] sm:tracking-[0.3em]">
              NIRA Furniture
            </p>

            <h2 className="mt-1.5 font-serif text-2xl leading-tight text-white sm:mt-2 sm:text-3xl">
              Furniture made for{" "}
              <span className="italic text-[#D2BC91]">living.</span>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}