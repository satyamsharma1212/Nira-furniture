"use client";

import Link from "next/link";
import {
  Heart,
  Menu,
  Search,
  X,
} from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

type SearchItem = {
  slug: string;
  name: string;
  category: string;
  description: string;
};

interface NavbarClientProps {
  searchItems: SearchItem[];
}

/* ========================================================= */
/* COLLECTION CATEGORIES                                     */
/* ========================================================= */

const collectionSubLinks = [
  {
    label: "All Collections",
    href: "/collections",
    description:
      "Explore the complete NIRA collection",
  },
  {
    label: "Bar Stools",
    href: "/collections/bar-stools",
    description:
      "Elevated seating for refined spaces",
  },
  {
    label: "Console Table",
    href: "/collections/console-table",
    description:
      "Elegant pieces for entryways",
  },
  {
    label: "Dining Chairs",
    href: "/collections/dining-chairs",
    description:
      "Comfortable seating for dining",
  },
  {
    label: "Floating Trays",
    href: "/collections/floating-trays",
    description:
      "Functional accents with sculptural form",
  },
  {
    label: "Indoor Sofa Set",
    href: "/collections/indoor-sofa-set",
    description:
      "Comfort-led furniture for interiors",
  },
  {
    label: "Our Work",
    href: "/collections/our-work",
    description:
      "Selected NIRA projects and spaces",
  },
  {
    label: "Outdoor Chairs",
    href: "/collections/outdoor-chairs",
    description:
      "Outdoor seating made for slow living",
  },
  {
    label: "Outdoor Sofa Set",
    href: "/collections/outdoor-sofa-set",
    description:
      "Lounge collections for open-air spaces",
  },
  {
    label: "Rocking Chairs",
    href: "/collections/rocking-chairs",
    description:
      "Relaxed seating with timeless character",
  },
  {
    label: "Single Seater Sofa Indoor",
    href: "/collections/single-seater-sofa-indoor",
    description:
      "Individual lounge pieces for interiors",
  },
  {
    label: "Sun Loungers",
    href: "/collections/sun-loungers",
    description:
      "Relaxed outdoor comfort",
  },
  {
    label: "Swings Indoor",
    href: "/collections/swings-indoor",
    description:
      "Statement seating for indoor spaces",
  },
  {
    label: "Swings Outdoor",
    href: "/collections/swings-outdoor",
    description:
      "Outdoor swings designed for comfort",
  },
  {
    label: "Umbrella",
    href: "/collections/umbrella",
    description:
      "Shade solutions for outdoor living",
  },
];

/* ========================================================= */
/* NAVBAR CLIENT                                             */
/* ========================================================= */

export default function NavbarClient({
  searchItems,
}: NavbarClientProps) {
  const [searchOpen, setSearchOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [collectionsExpanded, setCollectionsExpanded] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  const searchInputRef =
    useRef<HTMLInputElement | null>(null);

  const searchPanelId = useId();
  const searchResultsId = useId();

  /* =========================================================
     MOUNT
  ========================================================= */

  useEffect(() => {
    setMounted(true);
  }, []);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredProducts = useMemo(() => {
    const trimmed =
      searchQuery.trim().toLowerCase();

    if (trimmed.length <= 1) {
      return [];
    }

    return searchItems
      .filter((product) => {
        return (
          product.name
            .toLowerCase()
            .includes(trimmed) ||
          product.category
            .toLowerCase()
            .includes(trimmed) ||
          product.description
            .toLowerCase()
            .includes(trimmed)
        );
      })
      .slice(0, 6);
  }, [searchItems, searchQuery]);

  /* =========================================================
     LOCK BODY WHEN MOBILE MENU IS OPEN
  ========================================================= */

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [mobileOpen]);

  /* =========================================================
     ESCAPE KEY
  ========================================================= */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setSearchOpen(false);
        setCollectionsExpanded(false);
        setSearchQuery("");
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  /* =========================================================
     SEARCH ACTIONS
  ========================================================= */

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const openSearch = () => {
    setMobileOpen(false);
    setCollectionsExpanded(false);
    setSearchOpen(true);
  };

  const clearQuery = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  /* =========================================================
     MOBILE ACTIONS
  ========================================================= */

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setCollectionsExpanded(false);
  };

  const toggleMobileMenu = () => {
    setSearchOpen(false);
    setSearchQuery("");

    setMobileOpen(
      (current) => !current,
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          RIGHT SIDE ACTIONS
      ====================================================== */}

      <div className="flex items-center gap-2 sm:gap-3">

        {/* =================================================
            WISHLIST
        ================================================== */}

        <Link
          href="/wishlist"
          aria-label="Wishlist"
          className="
            flex
            h-10
            w-10
            shrink-0
            touch-manipulation
            select-none
            items-center
            justify-center
            border
            border-[#B88A2B]/25
            bg-[#FBF9F3]
            text-[#8A6418]
            transition-all
            duration-300
            active:scale-[0.96]
            hover:border-[#B88A2B]
            hover:bg-[#B88A2B]
            hover:text-white
            sm:h-11
            sm:w-11
          "
        >
          <Heart
            size={18}
            strokeWidth={1.5}
          />
        </Link>

        {/* =================================================
            SEARCH
        ================================================== */}

        <button
          type="button"
          aria-label={
            searchOpen
              ? "Close search"
              : "Search products"
          }
          aria-expanded={searchOpen}
          aria-controls={searchPanelId}
          onClick={
            searchOpen
              ? closeSearch
              : openSearch
          }
          className="
            flex
            h-10
            w-10
            shrink-0
            touch-manipulation
            select-none
            items-center
            justify-center
            border
            border-[#B88A2B]/25
            bg-[#FBF9F3]
            text-[#8A6418]
            transition-all
            duration-300
            active:scale-[0.96]
            hover:border-[#B88A2B]
            hover:bg-[#B88A2B]
            hover:text-white
            sm:h-11
            sm:w-11
          "
        >
          {searchOpen ? (
            <X
              size={18}
              strokeWidth={1.5}
            />
          ) : (
            <Search
              size={18}
              strokeWidth={1.5}
            />
          )}
        </button>

        {/* =================================================
            ENQUIRE
        ================================================== */}

        <Link
          href="/enquiry"
          className="
            flex
            h-9
            shrink-0
            items-center
            justify-center
            border
            border-[#B88A2B]
            bg-[#B88A2B]
            px-3
            font-sans
            text-[9px]
            font-bold
            uppercase
            tracking-[0.16em]
            text-white
            transition-all
            duration-300
            hover:border-[#241F18]
            hover:bg-[#241F18]
            sm:h-10
            sm:px-4
            sm:text-[10px]
          "
        >
          Enquire Now
        </Link>

        {/* =================================================
            MOBILE MENU
        ================================================== */}

        <button
          type="button"
          aria-label={
            mobileOpen
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={mobileOpen}
          aria-haspopup="dialog"
          onClick={toggleMobileMenu}
          className="
            group
            flex
            h-10
            w-10
            shrink-0
            touch-manipulation
            cursor-pointer
            select-none
            items-center
            justify-center
            border
            border-[#B88A2B]/30
            bg-[#FBF9F3]
            text-[#8A6418]
            transition-all
            duration-300
            active:scale-[0.96]
            hover:border-[#B88A2B]
            hover:bg-[#B88A2B]
            hover:text-white
            sm:h-11
            sm:w-11
            xl:hidden
          "
        >
          {mobileOpen ? (
            <X
              size={21}
              strokeWidth={1.5}
            />
          ) : (
            <Menu
              size={21}
              strokeWidth={1.5}
            />
          )}
        </button>
      </div>

      {/* =====================================================
          SEARCH PANEL
      ====================================================== */}

      {searchOpen && (
        <div
          id={searchPanelId}
          className="
            absolute
            left-1/2
            top-full
            z-[99999]
            w-[calc(100vw-24px)]
            -translate-x-1/2
            pt-3
            sm:w-[calc(100vw-40px)]
            sm:max-w-[600px]
          "
        >
          <div
            className="
              border
              border-[#B88A2B]/20
              bg-[#FBF9F3]
              p-3
              shadow-[0_20px_60px_rgba(36,31,24,0.16)]
              sm:p-4
            "
          >

            {/* SEARCH INPUT */}

            <div
              className="
                flex
                items-center
                border
                border-[#B88A2B]/20
                bg-white
                px-3
                sm:px-4
              "
            >
              <Search
                size={17}
                className="shrink-0 text-[#B88A2B]"
                strokeWidth={1.5}
              />

              <input
                ref={searchInputRef}
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(
                    event.target.value,
                  );
                }}
                placeholder="Search furniture..."
                aria-label="Search furniture"
                aria-autocomplete="list"
                aria-controls={
                  searchResultsId
                }
                className="
                  h-12
                  w-full
                  bg-transparent
                  px-3
                  font-sans
                  text-sm
                  font-medium
                  text-[#241F18]
                  outline-none
                  placeholder:text-[#9A9183]
                "
              />

              {searchQuery.length > 0 && (
                <button
                  type="button"
                  aria-label="Clear search query"
                  onClick={clearQuery}
                  className="
                    shrink-0
                    text-[#9A9183]
                    transition-colors
                    hover:text-[#B88A2B]
                  "
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* SEARCH RESULTS */}

            {searchQuery.trim().length > 1 && (
              <div
                id={searchResultsId}
                className="mt-3 overflow-hidden"
              >
                {filteredProducts.length > 0 ? (
                  <div className="divide-y divide-[#241F18]/[0.06]">

                    {filteredProducts.map(
                      (product) => (
                        <Link
                          key={product.slug}
                          href={`/products/${product.slug}`}
                          onClick={closeSearch}
                          className="
                            block
                            px-3
                            py-3
                            transition-all
                            duration-200
                            hover:bg-[#B88A2B]/5
                          "
                        >
                          <p
                            className="
                              font-serif
                              text-[16px]
                              font-medium
                              tracking-[0.02em]
                              text-[#40382E]
                            "
                          >
                            {product.name}
                          </p>

                          <p
                            className="
                              mt-1
                              font-sans
                              text-[10px]
                              font-medium
                              uppercase
                              tracking-[0.12em]
                              text-[#8A8174]
                            "
                          >
                            {product.category}
                          </p>
                        </Link>
                      ),
                    )}

                  </div>
                ) : (
                  <div className="px-3 py-6 text-center">
                    <p className="font-sans text-[13px] font-medium text-[#8A8174]">
                      No furniture found.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      {mounted &&
        mobileOpen &&
        createPortal(
          <>
            {/* BACKDROP */}

            <div
              className="
                fixed
                inset-0
                z-[99990]
                bg-[#171512]/30
                backdrop-blur-[3px]
              "
              onClick={closeMobileMenu}
            />

            {/* MOBILE DRAWER */}

            <aside
              className="
                fixed
                inset-x-0
                top-0
                z-[99999]
                h-[100dvh]
                w-full
                overflow-hidden
                bg-[#F7F4EE]
                text-[#171512]
                shadow-[0_25px_80px_rgba(23,21,18,0.18)]
              "
            >
              <div className="flex h-full flex-col overflow-y-auto overscroll-contain">

                {/* TOP BAR */}

                <div
                  className="
                    flex
                    h-[76px]
                    shrink-0
                    items-center
                    justify-between
                    border-b
                    border-[#171512]/10
                    px-5
                    sm:px-8
                  "
                >
                  <Link
                    href="/"
                    onClick={closeMobileMenu}
                    className="flex items-center"
                  >
                    <div>

                      <span
                        className="
                          block
                          font-serif
                          text-[25px]
                          font-medium
                          leading-none
                          tracking-[-0.035em]
                          text-[#171512]
                        "
                      >
                        NIRA
                      </span>

                      <span
                        className="
                          mt-1
                          block
                          font-sans
                          text-[7px]
                          font-semibold
                          uppercase
                          tracking-[0.3em]
                          text-[#765A32]
                        "
                      >
                        Furniture
                      </span>

                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={closeMobileMenu}
                    aria-label="Close navigation"
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#171512]/10
                      bg-[#EEE8DE]
                      text-[#171512]
                      transition-all
                      duration-300
                      hover:border-[#765A32]/40
                      hover:bg-[#E8E0D3]
                      hover:text-[#765A32]
                      active:scale-95
                    "
                  >
                    <X
                      size={19}
                      strokeWidth={1.4}
                    />
                  </button>
                </div>

                {/* INTRO */}

                <div className="shrink-0 px-6 pb-5 pt-8 sm:px-8 sm:pt-10">

                  <p
                    className="
                      font-sans
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.25em]
                      text-[#765A32]
                    "
                  >
                    NIRA Furniture
                  </p>

                  <h2
                    className="
                      mt-2
                      font-serif
                      text-[34px]
                      font-medium
                      leading-[0.95]
                      tracking-[-0.035em]
                      text-[#171512]
                      sm:text-[40px]
                    "
                  >
                    Explore
                  </h2>

                  <div className="mt-5 h-px w-full bg-[#171512]/10" />

                </div>

                {/* NAVIGATION */}

                <nav className="flex flex-col px-4 pb-6 sm:px-6">

                  <MobileLuxuryLink
                    href="/"
                    title="Home"
                    number={1}
                    onClick={closeMobileMenu}
                  />

                  {/* COLLECTIONS */}

                  <div className="border-b border-[#171512]/10">

                    <button
                      type="button"
                      aria-expanded={
                        collectionsExpanded
                      }
                      aria-controls="mobile-collections-submenu"
                      onClick={() =>
                        setCollectionsExpanded(
                          (prev) => !prev,
                        )
                      }
                      className="
                        flex
                        min-h-[74px]
                        w-full
                        items-center
                        justify-between
                        px-2
                        text-left
                        transition-colors
                        duration-300
                        hover:bg-[#EEE8DE]/70
                      "
                    >
                      <div className="flex items-center gap-4">

                        <span
                          className="
                            font-sans
                            text-[9px]
                            font-semibold
                            tracking-[0.16em]
                            text-[#765A32]/65
                          "
                        >
                          02
                        </span>

                        <span
                          className="
                            font-serif
                            text-[25px]
                            font-medium
                            leading-none
                            tracking-[-0.02em]
                            text-[#171512]
                          "
                        >
                          Collections
                        </span>

                      </div>

                      <span
                        className={`
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          border
                          transition-all
                          duration-300
                          ${
                            collectionsExpanded
                              ? "rotate-180 border-[#765A32]/30 bg-[#E8E0D3] text-[#765A32]"
                              : "border-[#171512]/10 bg-[#EEE8DE] text-[#171512]/60"
                          }
                        `}
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            d="M6 9l6 6 6-6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </button>

                    {/* CATEGORY ACCORDION */}

                    <div
                      id="mobile-collections-submenu"
                      aria-hidden={
                        !collectionsExpanded
                      }
                      className={`
                        overflow-hidden
                        transition-all
                        duration-500
                        ease-[cubic-bezier(0.22,1,0.36,1)]
                        ${
                          collectionsExpanded
                            ? "max-h-[1400px] opacity-100"
                            : "max-h-0 opacity-0"
                        }
                      `}
                    >
                      <div
                        className="
                          mb-4
                          ml-10
                          mr-2
                          border-l
                          border-[#765A32]/20
                          pl-4
                        "
                      >

                        <div className="pb-3 pt-1">

                          <p
                            className="
                              font-sans
                              text-[9px]
                              font-semibold
                              uppercase
                              tracking-[0.22em]
                              text-[#765A32]
                            "
                          >
                            Shop the collection
                          </p>

                          <p
                            className="
                              mt-1
                              font-serif
                              text-[18px]
                              font-medium
                              text-[#171512]/70
                            "
                          >
                            Find your piece
                          </p>

                        </div>

                        <div className="flex flex-col">

                          {collectionSubLinks.map(
                            (item, index) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                tabIndex={
                                  collectionsExpanded
                                    ? 0
                                    : -1
                                }
                                onClick={
                                  closeMobileMenu
                                }
                                className="
                                  group
                                  flex
                                  min-h-[53px]
                                  items-center
                                  justify-between
                                  border-b
                                  border-[#171512]/[0.07]
                                  py-2
                                  transition-all
                                  duration-300
                                  last:border-b-0
                                  hover:pl-1
                                "
                              >
                                <div className="flex min-w-0 items-center gap-3">

                                  <span
                                    className="
                                      shrink-0
                                      font-sans
                                      text-[8px]
                                      font-semibold
                                      tracking-[0.12em]
                                      text-[#765A32]/45
                                      transition-colors
                                      duration-300
                                      group-hover:text-[#765A32]
                                    "
                                  >
                                    {String(
                                      index + 1,
                                    ).padStart(
                                      2,
                                      "0",
                                    )}
                                  </span>

                                  <span
                                    className="
                                      font-serif
                                      text-[18px]
                                      font-medium
                                      leading-tight
                                      tracking-[-0.01em]
                                      text-[#171512]/85
                                      transition-colors
                                      duration-300
                                      group-hover:text-[#765A32]
                                    "
                                  >
                                    {item.label}
                                  </span>

                                </div>

                                <span
                                  className="
                                    ml-3
                                    shrink-0
                                    text-[17px]
                                    font-light
                                    text-[#765A32]/35
                                    transition-all
                                    duration-300
                                    group-hover:translate-x-1
                                    group-hover:text-[#765A32]
                                  "
                                >
                                  →
                                </span>

                              </Link>
                            ),
                          )}

                        </div>

                        <Link
                          href="/collections"
                          onClick={
                            closeMobileMenu
                          }
                          className="
                            group
                            mt-4
                            flex
                            min-h-[55px]
                            items-center
                            justify-between
                            border
                            border-[#765A32]/30
                            bg-[#E8E0D3]/60
                            px-4
                            transition-all
                            duration-300
                            hover:border-[#765A32]/50
                            hover:bg-[#E8E0D3]
                          "
                        >
                          <span
                            className="
                              font-sans
                              text-[9px]
                              font-semibold
                              uppercase
                              tracking-[0.18em]
                              text-[#765A32]
                            "
                          >
                            View all collections
                          </span>

                          <span
                            className="
                              text-[19px]
                              text-[#765A32]
                              transition-transform
                              duration-300
                              group-hover:translate-x-1
                            "
                          >
                            →
                          </span>
                        </Link>

                      </div>
                    </div>

                  </div>

                  <MobileLuxuryLink
                    href="/about"
                    title="About NIRA"
                    number={3}
                    onClick={closeMobileMenu}
                  />

                  <MobileLuxuryLink
                    href="/contact"
                    title="Contact"
                    number={4}
                    onClick={closeMobileMenu}
                  />

                  {/* WISHLIST */}

                  <MobileLuxuryLink
                    href="/wishlist"
                    title="Wishlist"
                    number={5}
                    onClick={closeMobileMenu}
                  />

                </nav>

                {/* BOTTOM CTA */}

                <div className="mt-auto px-6 pb-6 pt-3 sm:px-8">

                  <div className="mb-5 h-px bg-[#171512]/10" />

                  <Link
                    href="/enquiry"
                    onClick={
                      closeMobileMenu
                    }
                    className="
                      group
                      flex
                      min-h-[66px]
                      items-center
                      justify-between
                      bg-[#171512]
                      px-5
                      text-[#F7F4EE]
                      transition-all
                      duration-300
                      hover:bg-[#765A32]
                      active:scale-[0.99]
                    "
                  >
                    <div>

                      <span
                        className="
                          block
                          font-sans
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.2em]
                          text-[#B89A62]
                        "
                      >
                        Private Consultation
                      </span>

                      <span
                        className="
                          mt-1
                          block
                          font-serif
                          text-[22px]
                          font-medium
                        "
                      >
                        Enquire Now
                      </span>

                    </div>

                    <span
                      className="
                        text-[22px]
                        font-light
                        text-[#B89A62]
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    >
                      →
                    </span>

                  </Link>

                  <div className="mt-5 flex items-center justify-between">

                    <span
                      className="
                        font-sans
                        text-[8px]
                        font-medium
                        uppercase
                        tracking-[0.18em]
                        text-[#171512]/35
                      "
                    >
                      Bespoke Furniture
                    </span>

                    <span
                      className="
                        font-sans
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-[#765A32]
                      "
                    >
                      Made in India
                    </span>

                  </div>

                </div>

              </div>
            </aside>
          </>,
          document.body,
        )}
    </>
  );
}

/* ========================================================= */
/* MOBILE LINK                                               */
/* ========================================================= */

function MobileLuxuryLink({
  href,
  title,
  number,
  onClick,
}: {
  href: string;
  title: string;
  number: number;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="
        group
        flex
        min-h-[74px]
        items-center
        justify-between
        border-b
        border-[#171512]/10
        px-2
        transition-all
        duration-300
        hover:bg-[#EEE8DE]/70
      "
    >
      <div className="flex items-center gap-4">

        <span
          className="
            font-sans
            text-[9px]
            font-semibold
            tracking-[0.16em]
            text-[#765A32]/60
            transition-colors
            duration-300
            group-hover:text-[#765A32]
          "
        >
          {String(number).padStart(2, "0")}
        </span>

        <span
          className="
            font-serif
            text-[25px]
            font-medium
            leading-none
            tracking-[-0.02em]
            text-[#171512]
            transition-all
            duration-300
            group-hover:translate-x-1
            group-hover:text-[#765A32]
          "
        >
          {title}
        </span>

      </div>

      <span
        className="
          text-[19px]
          font-light
          text-[#765A32]/35
          transition-all
          duration-300
          group-hover:translate-x-1
          group-hover:text-[#765A32]
        "
      >
        →
      </span>

    </Link>
  );
}