"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { products } from "@/data/products";
import NavbarClient from "./NavbarClient";

const LOGO_URL = "/nira-logo.png";

const collectionItems = [
  {
    label: "All Collections",
    href: "/collections",
  },
 
  {
    label: "Seating",
    href: "/collections/seating",
  },
  {
    label: "Dining",
    href: "/collections/dining",
  },
  {
    label: "Accents",
    href: "/collections/accents",
  },
];

export default function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [collectionsOpen, setCollectionsOpen] = useState(false);

  const lastScrollY = useRef(0);
  const dropdownMenuId = useId();

  const searchItems = useMemo(
    () =>
      products.map((product) => ({
        slug: product.slug,
        name: product.name,
        category: product.category,
        description: product.description,
      })),
    [],
  );

  /* ========================================================= */
  /* SCROLL NAVBAR                                             */
  /* ========================================================= */

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        if (currentScrollY <= 20) {
          setShowNavbar(true);
        } else if (currentScrollY > lastScrollY.current + 4) {
          setShowNavbar(false);
          setCollectionsOpen(false);
        } else if (currentScrollY < lastScrollY.current - 4) {
          setShowNavbar(true);
        }

        lastScrollY.current = currentScrollY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* ========================================================= */
  /* CLOSE COLLECTIONS WHEN CLICKING OUTSIDE                   */
  /* ========================================================= */

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;

      if (!target) return;

      if (!target.closest("[data-collections-dropdown]")) {
        setCollectionsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  /* ========================================================= */
  /* ESCAPE KEY                                                */
  /* ========================================================= */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCollectionsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* ========================================================= */
  /* RENDER                                                    */
  /* ========================================================= */

  return (
    <header
      className={`
        fixed
        inset-x-0
        top-0
        z-[9999]
        transition-transform
        duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]
        ${showNavbar ? "translate-y-0" : "-translate-y-full"}
      `}
    >


      {/* ===================================================== */}
      {/* MAIN NAVBAR                                           */}
      {/* ===================================================== */}

      <nav
        className="
          relative
          mx-2
          mt-2
          flex
          h-[70px]
          w-[calc(100%-1rem)]
          items-center
          rounded-[18px]
          border
          border-[#B88A2B]/12
          bg-[#eeeae4]/90
          px-4
          shadow-[0_8px_30px_rgba(36,31,24,0.06)]
          backdrop-blur-xl
          backdrop-saturate-150
          transition-all
          duration-500
          sm:mx-3
          sm:w-[calc(100%-1.5rem)]
          sm:rounded-[20px]
          sm:px-5
          md:mx-4
          md:w-[calc(100%-2rem)]
          md:px-7
          lg:mx-5
          lg:w-[calc(100%-2.5rem)]
          lg:px-9
          xl:mx-6
          xl:w-[calc(100%-3rem)]
          xl:px-10
        "
      >
        {/* =================================================== */}
        {/* LOGO                                                */}
        {/* =================================================== */}

        <Link
          href="/"
          aria-label="NIRA Furniture Home"
          className="
            group
            flex
            shrink-0
            items-center
            py-1
          "
        >
          <Image
            src={LOGO_URL}
            alt="NIRA Furniture"
            width={90}
            height={90}
            priority
            className="
              h-[58px]
              w-[58px]
              object-contain
              antialiased
              select-none
              transition-all
              duration-500
              ease-out
              group-hover:scale-[1.02]
              sm:h-[62px]
              sm:w-[62px]
              md:h-[66px]
              md:w-[66px]
              lg:h-[68px]
              lg:w-[68px]
            "
          />
        </Link>

        {/* =================================================== */}
        {/* DESKTOP NAVIGATION                                  */}
        {/* =================================================== */}

      <div
  className="
    ml-auto
    hidden
    items-center
    gap-7
    font-['Cormorant_Garamond']
    text-[17px]
    font-medium
    tracking-[0.055em]
    text-[#3A342C]
    xl:flex
    xl:gap-9
    2xl:gap-12
  "
>
          {/* HOME */}
          <NavItem href="/" label="Home" />

          {/* ================================================= */}
          {/* COLLECTIONS                                       */}
          {/* ================================================= */}

          <div
            className="relative"
            data-collections-dropdown
          >
            <div className="flex items-center">
              {/* COLLECTIONS TEXT */}

              <Link
                href="/collections"
                onClick={() => setCollectionsOpen(false)}
                className="
                  group
                  relative
                  inline-flex
                  whitespace-nowrap
                  py-2
                  font-['Cormorant_Garamond']
                  text-[16px]
                  font-medium
                  uppercase
                  tracking-[0.10em]
                  text-[#3A342C]
                  transition-all
                  duration-500
                  ease-out
                  hover:text-[#765A32]
                "
              >
                <span className="relative">
                  Collections

                  <span
                    className="
                      absolute
                      -bottom-1
                      left-1/2
                      h-px
                      w-0
                      -translate-x-1/2
                      bg-[#765A32]
                      transition-all
                      duration-500
                      ease-out
                      group-hover:w-full
                    "
                  />
                </span>
              </Link>

              {/* ============================================= */}
              {/* CLICKABLE ARROW                               */}
              {/* ============================================= */}

              <button
                type="button"
                aria-label={
                  collectionsOpen
                    ? "Close Collections menu"
                    : "Open Collections menu"
                }
                aria-haspopup="menu"
                aria-expanded={collectionsOpen}
                aria-controls={dropdownMenuId}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();

                  setCollectionsOpen((current) => !current);
                }}
                className="
                  ml-2
                  flex
                  h-8
                  w-8
                  shrink-0
                  touch-manipulation
                  cursor-pointer
                  select-none
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#B88A2B]/25
                  bg-transparent
                  text-[#6F541F]
                  transition-all
                  duration-300
                  hover:border-[#B88A2B]
                  hover:bg-[#B88A2B]
                  hover:text-white
                  active:scale-95
                "
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                  className={`
                    pointer-events-none
                    transition-transform
                    duration-300
                    ${
                      collectionsOpen
                        ? "rotate-180"
                        : "rotate-0"
                    }
                  `}
                >
                  <path
                    d="M5 7.5L10 12.5L15 7.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* ================================================= */}
            {/* COLLECTIONS DROPDOWN                              */}
            {/* ================================================= */}

            {collectionsOpen && (
              <div
                className="
                  absolute
                  left-1/2
                  top-full
                  z-[99999]
                  w-[280px]
                  -translate-x-1/2
                  pt-3
                "
              >
                <div
                  id={dropdownMenuId}
                  className="
                    overflow-hidden
                    rounded-[16px]
                    border
                    border-[#B88A2B]/18
                    bg-[#F8F5ED]/98
                    shadow-[0_22px_65px_rgba(36,31,24,0.14)]
                    backdrop-blur-xl
                  "
                  role="menu"
                >
                  {/* DROPDOWN HEADER */}

                  <div
                    className="
                      border-b
                      border-[#241F18]/10
                      px-5
                      py-4
                    "
                  >
                    <p
                      className="
                        font-sans
                        text-[9px]
                        font-medium
                        uppercase
                        tracking-[0.22em]
                        text-[#8A6418]
                      "
                    >
                      NIRA Furniture
                    </p>

                    <p
                      className="
                        mt-1
                        font-['Cormorant_Garamond']
                        text-[21px]
                        font-medium
                        tracking-[0.01em]
                        text-[#241F18]
                      "
                    >
                      Collections
                    </p>
                  </div>

                  {/* COLLECTION ITEMS */}

                  {collectionItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setCollectionsOpen(false)}
                      className="
                        group
                        flex
                        min-h-[52px]
                        items-center
                        justify-between
                        border-b
                        border-[#241F18]/[0.07]
                        px-5
                        transition-all
                        duration-200
                        last:border-b-0
                        hover:bg-[#171512]
                      "
                    >
                      <span
                        className="
                          font-['Cormorant_Garamond']
                          text-[15px]
                          tracking-[0.03em]
                          text-[#40382E]
                          transition-colors
                          duration-200
                          group-hover:text-[#D0B27A]
                        "
                      >
                        {item.label}
                      </span>

                      <span
                        className="
                          text-[13px]
                          text-[#B88A2B]/50
                          transition-all
                          duration-200
                          group-hover:translate-x-1
                          group-hover:text-[#D0B27A]
                        "
                      >
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ABOUT */}

          <NavItem
            href="/about"
            label="About"
          />

          {/* CONTACT */}

          <NavItem
            href="/contact"
            label="Contact"
          />
        </div>

        {/* =================================================== */}
        {/* SEARCH / ENQUIRE / MOBILE                           */}
        {/* =================================================== */}

        <div
          className="
            ml-auto
            flex
            shrink-0
            items-center
            gap-2
            text-[#181818]
            md:ml-5
            xl:ml-8
          "
        >
          {/* BUYER / USER LOGIN */}
         <Link
  href="/account"
  aria-label="Buyer login"
  className="
    flex
    h-10
    w-10
    shrink-0
    items-center
    justify-center
    transition-all
    duration-300
    hover:opacity-70
    active:scale-[0.96]
    sm:h-11
    sm:w-11
  "
>
  <Image
    src="/profile.png"
    alt="User login"
    width={22}
    height={22}
    className="
      h-[20px]
      w-[20px]
      object-contain
      transition-transform
      duration-300
      hover:scale-105
      sm:h-[21px]
      sm:w-[21px]
    "
  />
</Link>

          <NavbarClient searchItems={searchItems} />
        </div>
      </nav>
    </header>
  );
}




/* =========================================================== */
/* NAV ITEM                                                    */
/* =========================================================== */

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
        inline-flex
        whitespace-nowrap
        py-2
        font-['Cormorant_Garamond']
        text-[16px]
        font-medium
        uppercase
        tracking-[0.10em]
        text-[#3A342C]
        transition-all
        duration-500
        ease-out
        hover:text-[#765A32]
      "
    >
      <span className="relative">
        {label}

        <span
          className="
          absolute
          -bottom-1
          left-1/2
          h-px
          w-0
          -translate-x-1/2
          bg-[#765A32]
          transition-all
          duration-500
          ease-out
          group-hover:w-full
        "
        />
      </span>
    </Link>
  );
}