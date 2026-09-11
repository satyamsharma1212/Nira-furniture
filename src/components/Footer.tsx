"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";

/* =========================================================
   NAVIGATION
========================================================= */

const navigation = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/collections" },
  { label: "About Atelier", href: "/about" },
  { label: "Indoor Furniture", href: "/indoor-furniture" },
  { label: "Outdoor Furniture", href: "/outdoor-furniture" },
];

const services = [
  { label: "Private Appointments", href: "/contact" },
  { label: "Bespoke Furniture", href: "/custom-furniture" },
  { label: "Material Library", href: "/materials" },
  { label: "Quality & Provenance", href: "/quality" },
];

/* =========================================================
   NIRA LOCATIONS
========================================================= */

const locations = [
  {
    city: "Surat",
    title: "NIRA Furniture",
    address:
      "Gali Number 6, RJD Textile Market, Ichhapor, Hazira Road, Surat, Gujarat 394510",
  },
  {
    city: "Mumbai",
    title: "NIRA Furniture",
    address:
      "B-2006, Omkareshwar, Rajendra Nagar, Borivali East, Mumbai, Maharashtra 400066",
  },
];

/* =========================================================
   FOOTER
========================================================= */

export default function Footer() {
  return (
    <footer className="bg-[#171310] text-[#F7F4EE]">

      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}

      <div
        className="
          px-5
          py-16
          sm:px-8
          sm:py-20
          lg:px-12
          lg:py-24
          xl:px-16
        "
      >
        <div className="mx-auto max-w-[1380px]">

          {/* =================================================
              BRAND STATEMENT
          ================================================== */}

          <div
            className="
              grid
              gap-14
              border-b
              border-white/[0.08]
              pb-14
              lg:grid-cols-[1.35fr_1fr]
              lg:gap-20
              lg:pb-16
            "
          >

            {/* =================================================
                BRAND STATEMENT
            ================================================== */}

            <div>

              <Link
                href="/"
                className="
                  inline-flex
                  items-center
                  gap-4
                "
              >
                <Image
                  src="/nira-logo3.png"
                  alt="NIRA Furniture"
                  width={100}
                  height={50}
                  priority
                  className="
                    h-auto
                    w-[76px]
                    brightness-0
                    invert
                  "
                />

                <span
                  className="
                    font-serif
                    text-[21px]
                    font-normal
                    tracking-[0.015em]
                    text-[#F7F4EE]
                  "
                >
                  NIRA Furniture
                </span>
              </Link>

              {/* MAIN BRAND STATEMENT */}

              <h2
                className="
                  mt-8
                  max-w-[650px]
                  font-serif
                  text-[27px]
                  font-normal
                  leading-[1.12]
                  tracking-[-0.025em]
                  text-[#F7F4EE]/90
                  sm:text-[34px]
                  md:text-[38px]
                "
              >
                Classical royal grandeur,
                harmonised with serene
                architectural modernism.
              </h2>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-6
                  max-w-[560px]
                  font-sans
                  text-[16px]
                  font-medium
                  leading-[1.85]
                  tracking-[0.01em]
                  text-white/60
                  sm:text-[17px]
                  lg:text-[18px]
                "
              >
                Hand-crafted furniture, refined materials and
                timeless design created for distinguished
                residences, estates, hospitality spaces and
                contemporary living.
              </p>

            </div>

          </div>

          {/* =====================================================
              FOOTER NAVIGATION
          ====================================================== */}

          <div
            className="
              grid
              gap-12
              py-14
              sm:grid-cols-2
              lg:grid-cols-4
              lg:gap-10
            "
          >

            {/* =================================================
                EXPLORE
            ================================================== */}

            <FooterColumn title="Explore NIRA">
              {navigation.map((item) => (
                <FooterLink
                  key={item.href}
                  href={item.href}
                >
                  {item.label}
                </FooterLink>
              ))}
            </FooterColumn>

            {/* =================================================
                SERVICES
            ================================================== */}

            <FooterColumn title="Atelier Services">
              {services.map((item) => (
                <FooterLink
                  key={item.href}
                  href={item.href}
                >
                  {item.label}
                </FooterLink>
              ))}
            </FooterColumn>

            {/* =================================================
                LOCATIONS
            ================================================== */}

            <FooterColumn title="NIRA Locations">

              {locations.map((location) => (
                <div
                  key={location.city}
                  className="
                    group
                    border-b
                    border-white/[0.05]
                    pb-5
                    last:border-0
                    last:pb-0
                  "
                >

                  {/* CITY */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <MapPin
                      size={13}
                      strokeWidth={1.2}
                      className="shrink-0 text-[#D0B27A]"
                    />

                    <p
                      className="
                        font-serif
                        text-[20px]
                        font-normal
                        leading-none
                        tracking-[-0.015em]
                        text-[#F7F4EE]
                      "
                    >
                      {location.city}
                    </p>
                  </div>

                  {/* TITLE */}

                  <p
                    className="
                      mt-2.5
                      font-sans
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.15em]
                      text-[#D0B27A]/75
                    "
                  >
                    {location.title}
                  </p>

                  {/* ADDRESS */}

                  <p
                    className="
                      mt-2
                      max-w-[280px]
                      font-sans
                      text-[13px]
                      font-medium
                      leading-[1.7]
                      tracking-[0.005em]
                      text-white/55
                      sm:text-[14px]
                    "
                  >
                    {location.address}
                  </p>

                </div>
              ))}

            </FooterColumn>

            {/* =================================================
                CORRESPONDENCE
            ================================================== */}

            <FooterColumn title="Correspondence">

              <div className="space-y-5">

                {/* GENERAL ENQUIRY */}

                <div>
                  <p
                    className="
                      mb-1.5
                      font-sans
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-[#D0B27A]/70
                    "
                  >
                    General Enquiries
                  </p>

                  <Link
                    href="/contact"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      font-sans
                      text-[13px]
                      font-medium
                      text-white/60
                      transition-colors
                      hover:text-[#D0B27A]
                    "
                  >
                    Contact NIRA

                    <ArrowUpRight
                      size={11}
                      strokeWidth={1}
                    />
                  </Link>
                </div>

                {/* PRIVATE APPOINTMENT */}

                <div>
                  <p
                    className="
                      mb-1.5
                      font-sans
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-[#D0B27A]/70
                    "
                  >
                    Private Appointments
                  </p>

                  <Link
                    href="/contact"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      font-sans
                      text-[13px]
                      font-medium
                      text-white/60
                      transition-colors
                      hover:text-[#D0B27A]
                    "
                  >
                    Request an Appointment

                    <ArrowUpRight
                      size={11}
                      strokeWidth={1}
                    />
                  </Link>
                </div>

                {/* ENQUIRY BUTTON */}

                <Link
                  href="/contact"
                  className="
                    mt-1
                    inline-flex
                    items-center
                    gap-2
                    border
                    border-[#D0B27A]/25
                    px-4
                    py-2.5
                    font-sans
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-[#D0B27A]
                    transition-all
                    duration-300
                    hover:border-[#D0B27A]
                    hover:bg-[#D0B27A]
                    hover:text-[#171310]
                  "
                >
                  Private Enquiry

                  <ArrowUpRight
                    size={11}
                    strokeWidth={1.1}
                  />
                </Link>

              </div>

            </FooterColumn>

          </div>

          {/* =====================================================
              BOTTOM BAR
          ====================================================== */}

          <div
            className="
              flex
              flex-col
              gap-5
              border-t
              border-white/[0.08]
              pt-6
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <p
              className="
                font-sans
                text-[9px]
                font-medium
                uppercase
                tracking-[0.14em]
                text-white/25
              "
            >
              © 2026 NIRA Furniture · All Rights Reserved
            </p>

            <div
              className="
                flex
                flex-wrap
                gap-x-5
                gap-y-2
                font-sans
                text-[9px]
                font-medium
                uppercase
                tracking-[0.12em]
                text-white/25
                sm:gap-x-6
              "
            >

              <Link
                href="/return-refund"
                className="transition-colors hover:text-white/60"
              >
                Returns & Refunds
              </Link>

              <Link
                href="/shipping-delivery"
                className="transition-colors hover:text-white/60"
              >
                Shipping & Delivery
              </Link>

              <Link
                href="/privacy-policy"
                className="transition-colors hover:text-white/60"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms-and-conditions"
                className="transition-colors hover:text-white/60"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/contact-support"
                className="transition-colors hover:text-white/60"
              >
                Contact & Support
              </Link>

              {/* =================================================
                  ADMIN LOGIN
              ================================================== */}

              <Link
                href="/admin/login"
                aria-label="Admin Login"
                className="
                  group
                  inline-flex
                  items-center
                  gap-1.5
                  transition-colors
                  hover:text-[#D0B27A]
                "
              >
                <ShieldCheck
                  size={11}
                  strokeWidth={1.2}
                  className="
                    text-[#D0B27A]/60
                    transition-colors
                    group-hover:text-[#D0B27A]
                  "
                />

                <span>
                  Admin Login
                </span>
              </Link>

            </div>
          </div>

        </div>
      </div>

      {/* =====================================================
          SIGNATURE
      ====================================================== */}

      <div
        className="
          overflow-hidden
          border-t
          border-white/[0.05]
          px-5
          py-5
          sm:px-8
          lg:px-12
          xl:px-16
        "
      >
        <div className="mx-auto max-w-[1380px]">

          <p
            className="
              select-none
              whitespace-nowrap
              text-center
              font-serif
              text-[clamp(58px,11vw,170px)]
              font-normal
              leading-[0.72]
              tracking-[-0.07em]
              text-white/[0.035]
            "
          >
            NIRA
          </p>

        </div>
      </div>

    </footer>
  );
}

/* =========================================================
   FOOTER COLUMN
========================================================= */

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>

      <p
        className="
          mb-6
          font-sans
          text-[9px]
          font-semibold
          uppercase
          tracking-[0.22em]
          text-[#D0B27A]
        "
      >
        {title}
      </p>

      <div className="space-y-3">
        {children}
      </div>

    </div>
  );
}

/* =========================================================
   FOOTER LINK
========================================================= */

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="
        group
        flex
        w-fit
        items-center
        gap-2
        font-sans
        text-[13px]
        font-medium
        tracking-[0.005em]
        text-white/60
        transition-colors
        duration-300
        hover:text-white
      "
    >
      <span>{children}</span>

      <ArrowUpRight
        size={11}
        strokeWidth={1}
        className="
          -translate-x-1
          opacity-0
          transition-all
          duration-300
          group-hover:translate-x-0
          group-hover:opacity-60
        "
      />
    </Link>
  );
}