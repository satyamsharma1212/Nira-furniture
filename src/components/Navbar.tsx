"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { products } from "@/data/products";
import NavbarClient from "./NavbarClient";

const LOGO_URL = "/nira-logo3.png";

export default function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const searchItems = products.map((product) => ({
    slug: product.slug,
    name: product.name,
    category: product.category,
    description: product.description,
  }));

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 20) {
        setShowNavbar(true);
        setLastScrollY(currentScrollY);
        return;
      }

      if (currentScrollY > lastScrollY) {
        setShowNavbar(false);
      } else if (currentScrollY < lastScrollY) {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
  className={`
    fixed
    inset-x-0
    top-0
    z-[1000]
    transition-transform
    duration-500
    ease-[cubic-bezier(0.22,1,0.36,1)]
    ${
      showNavbar
        ? "translate-y-0"
        : "-translate-y-full"
    }
  `}
>
  {/* ================================================= */}
  {/* TOP ANNOUNCEMENT MARQUEE                         */}
  {/* ================================================= */}

  <div
    className="
      h-[39px]
      w-full
      overflow-hidden
      border-b
      border-[#D0B27A]/30
      bg-[#171512]
    "
  >
    <div
      className="
        flex
        h-full
        w-max
        animate-navbar-marquee
        items-center
        whitespace-nowrap
      "
    >
      {/* FIRST SET */}

      <div
        className="
          flex
          shrink-0
          items-center
          gap-10
          pr-10
          text-[10px]
          font-medium
          uppercase
          tracking-[0.22em]
          text-[#E3D7C2]
          sm:text-[11px]
        "
      >
        <span>
          Complimentary White-Glove Concierge Delivery & Interior Consultation on Orders Over $5,000
        </span>

        <span className="text-[#D0B27A]">
          ◆
        </span>

        <span>
          Use Code 'ROYAL10' for Privileged Inaugural 10% Savings
        </span>

        <span className="text-[#D0B27A]">
          ◆
        </span>

        <span>
          Bespoke Furniture Crafted for Extraordinary Spaces
        </span>

        <span className="text-[#D0B27A]">
          ◆
        </span>

        <span>
          NIRA Furniture — Made in India
        </span>

        <span className="text-[#D0B27A]">
          ◆
        </span>
      </div>

      {/* SECOND SET */}

      <div
        className="
          flex
          shrink-0
          items-center
          gap-10
          pr-10
          text-[10px]
          font-medium
          uppercase
          tracking-[0.22em]
          text-[#E3D7C2]
          sm:text-[11px]
        "
      >
        <span>
          Complimentary White-Glove Concierge Delivery & Interior Consultation on Orders Over $5,000
        </span>

        <span className="text-[#D0B27A]">
          ◆
        </span>

        <span>
          Use Code 'ROYAL10' for Privileged Inaugural 10% Savings
        </span>

        <span className="text-[#D0B27A]">
          ◆
        </span>

        <span>
          Bespoke Furniture Crafted for Extraordinary Spaces
        </span>

        <span className="text-[#D0B27A]">
          ◆
        </span>

        <span>
          NIRA Furniture — Made in India
        </span>

        <span className="text-[#D0B27A]">
          ◆
        </span>
      </div>
    </div>
  </div>


  {/* ================================================= */}
  {/* MAIN NAVBAR                                      */}
  {/* ================================================= */}

  <nav
    className="
      mx-auto
      flex
      h-[58px]
      w-full
      items-center
      border-b
      border-black/10
      bg-[#eeeae4]/95
      px-5
      backdrop-blur-md
      md:h-[58px]
      md:px-7
      lg:px-9
      xl:px-10
    "
  >

    {/* ================================================= */}
    {/* LEFT — LOGO + BRAND                              */}
    {/* ================================================= */}

    <Link
      href="/"
      aria-label="NIRA Haute Living"
      className="
        flex
        shrink-0
        items-center
        gap-5
        transition-opacity
        duration-300
        hover:opacity-70
      "
    >
      <Image
        src={LOGO_URL}
        alt="NIRA"
        width={95}
        height={45}
        priority
        className="
          h-auto
          w-[70px]
          object-contain
          md:w-[78px]
          lg:w-[86px]
        "
      />

      <span
        className="
          hidden
          font-serif
          text-[18px]
          tracking-[0.02em]
          text-[#171717]
          sm:block
          md:text-[19px]
          lg:text-[20px]
        "
      >
        NIRA HAUTE LIVING
      </span>
    </Link>


    {/* ================================================= */}
    {/* CENTER — NAVIGATION                              */}
    {/* ================================================= */}

 <div
  className="
    ml-auto
    hidden
    items-center
    gap-12
    lg:flex
    xl:gap-16
    text-[15px]
    xl:text-[14px]
  "
>
  <NavItem
    href="/"
    label="Home"
  />

  <NavItem
    href="/collections"
    label="Collections"
  />

  <NavItem
    href="/about"
    label="About Atelier"
  />

  <NavItem
    href="/contact"
    label="Contact"
  />

    <NavItem
    href="/enquiry"
    label="Enquiry"
  />
</div>


    {/* ================================================= */}
    {/* RIGHT — SEARCH / WISHLIST / BAG / ACCOUNT        */}
    {/* ================================================= */}

    <div
      className="
        ml-7
        flex
        shrink-0
        items-center
        text-[#181818]
        md:ml-9
        lg:ml-10
      "
    >
      <NavbarClient
        searchItems={searchItems}
      />
    </div>


    {/* ================================================= */}
    {/* MOBILE MENU                                       */}
    {/* ================================================= */}

    <button
      type="button"
      aria-label="Open menu"
      className="
        ml-4
        flex
        h-9
        w-9
        items-center
        justify-center
        text-[#171717]
        lg:hidden
      "
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <path d="M4 7h16M4 12h16M4 17h16" />
      </svg>
    </button>

  </nav>
</header>
  );
}


/* ========================================================= */
/* NAVIGATION ITEM                                           */
/* ========================================================= */

function NavItem({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="
        group
        relative
        whitespace-nowrap
        py-2
        font-sans
        text-[11px]
        font-normal
        uppercase
        tracking-[0.12em]
        text-[#282828]
        transition-colors
        duration-300
        hover:text-black
      "
    >
      {label}

      {/* Elegant underline */}
      <span
        className="
          absolute
          bottom-0
          left-0
          h-px
          w-0
          bg-black
          transition-all
          duration-300
          ease-out
          group-hover:w-full
        "
      />
    </Link>
  );
}