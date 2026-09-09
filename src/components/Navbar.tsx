"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { products } from "@/data/products";
import NavbarClient from "./NavbarClient";

const LOGO_URL = "/nira-logo3.png";

const collectionItems = [
  {
    label: "All Collections",
    href: "/collections",
  },
  {
    label: "Indoor Furniture",
    href: "/collections/indoor-furniture",
  },
  {
    label: "Outdoor Furniture",
    href: "/collections/outdoor-furniture",
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
      {/* ANNOUNCEMENT BAR                                      */}
      {/* ===================================================== */}

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
          <AnnouncementSet />
          <AnnouncementSet leadingDiamond />
        </div>
      </div>

      {/* ===================================================== */}
      {/* MAIN NAVBAR                                           */}
      {/* ===================================================== */}

      <nav
        className="
          relative
          mx-auto
          flex
          h-[72px]
          w-full
          items-center
          border-b
          border-black/10
          bg-[#eeeae4]/95
          px-4
          backdrop-blur-md
          sm:px-5
          md:px-7
          lg:px-9
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
            flex
            shrink-0
            items-center
            transition-opacity
            duration-300
            hover:opacity-70
          "
        >
          <Image
            src={LOGO_URL}
            alt="NIRA Furniture"
            width={110}
            height={50}
            priority
            className="
              h-auto
              w-[82px]
              object-contain
              sm:w-[88px]
              md:w-[94px]
              lg:w-[96px]
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
            gap-5
            font-['Bodoni_Moda']
            text-[17px]
            font-medium
            xl:flex
            xl:gap-8
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
                  whitespace-nowrap
                  py-2
                  font-['Bodoni_Moda']
                  font-medium
                  uppercase
                  tracking-[0.08em]
                  text-[#282828]
                  transition-colors
                  duration-300
                  hover:text-black
                "
              >
                Collections

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
                    border
                    border-[#B88A2B]/20
                    bg-[#F8F5ED]
                    shadow-[0_25px_70px_rgba(36,31,24,0.20)]
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
                        font-['Bodoni_Moda']
                        text-[19px]
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
                          font-['Bodoni_Moda']
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
              border
              border-[#B88A2B]/25
              bg-[#FBF9F3]
              transition-all
              duration-300
              hover:border-[#B88A2B]
              hover:bg-[#B88A2B]/10
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
              className="h-[20px] w-[20px] object-contain sm:h-[21px] sm:w-[21px]"
            />
          </Link>

          <NavbarClient searchItems={searchItems} />
        </div>
      </nav>
    </header>
  );
}

/* =========================================================== */
/* ANNOUNCEMENT SET                                            */
/* =========================================================== */

function AnnouncementSet({
  leadingDiamond = false,
}: {
  leadingDiamond?: boolean;
}) {
  return (
    <div
      className="
        flex
        shrink-0
        items-center
        gap-10
        pr-10
        font-sans
        text-[10px]
        font-medium
        uppercase
        tracking-[0.22em]
        text-[#E3D7C2]
        sm:text-[11px]
      "
    >
      {leadingDiamond && (
        <span className="text-[#D0B27A]">
          ◆
        </span>
      )}

      <span>
        Complimentary White-Glove Concierge Delivery &amp;
        Interior Consultation on Orders Over $5,000
      </span>

      <span className="text-[#D0B27A]">
        ◆
      </span>

      <span>
        Use Code &apos;ROYAL10&apos; for Privileged
        Inaugural 10% Savings
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
        whitespace-nowrap
        py-2
        font-['Bodoni_Moda']
        font-medium
        uppercase
        tracking-[0.08em]
        text-[#282828]
        transition-colors
        duration-300
        hover:text-black
      "
    >
      {label}

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