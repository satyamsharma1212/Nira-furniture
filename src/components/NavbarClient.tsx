"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

type SearchItem = {
  slug: string;
  name: string;
  category: string;
  description: string;
};

interface NavbarClientProps {
  searchItems: SearchItem[];
}

export default function NavbarClient({
  searchItems,
}: NavbarClientProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredProducts =
    searchQuery.trim().length > 1
      ? searchItems
          .filter((product) => {
            const query = searchQuery.toLowerCase();

            return (
              product.name.toLowerCase().includes(query) ||
              product.category.toLowerCase().includes(query) ||
              product.description.toLowerCase().includes(query)
            );
          })
          .slice(0, 6)
      : [];

  return (
    <>
      {/* ================================================= */}
      {/* RIGHT SIDE */}
      {/* ================================================= */}

      <div className="flex items-center gap-2 sm:gap-3">

        {/* Search */}
        <button
          type="button"
          aria-label="Search products"
          onClick={() => setSearchOpen((value) => !value)}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            border
            border-[#B88A2B]/25
            bg-[#FBF9F3]
            text-[#8A6418]
            transition-all
            duration-300
            hover:border-[#B88A2B]
            hover:bg-[#B88A2B]
            hover:text-white
          "
        >
          <Search
            size={17}
            strokeWidth={1.5}
          />
        </button>

        {/* Enquire Now */}
        <Link
          href="/enquiry"
          className="
            hidden
            h-10
            items-center
            justify-center
            border
            border-[#B88A2B]
            bg-[#B88A2B]
            px-5
            text-[9px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-white
            transition-all
            duration-300
            hover:border-[#241F18]
            hover:bg-[#241F18]
            sm:flex
          "
        >
          Enquire Now
        </Link>

        {/* Mobile Menu */}
        <button
          type="button"
          aria-label={
            mobileOpen ? "Close menu" : "Open menu"
          }
          onClick={() =>
            setMobileOpen((value) => !value)
          }
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            border
            border-[#B88A2B]/30
            bg-[#FBF9F3]
            text-[#8A6418]
            transition-all
            duration-300
            hover:border-[#B88A2B]
            hover:bg-[#B88A2B]
            hover:text-white
            lg:hidden
          "
        >
          {mobileOpen ? (
            <X size={19} strokeWidth={1.5} />
          ) : (
            <Menu size={19} strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* ================================================= */}
      {/* SEARCH PANEL */}
      {/* ================================================= */}

      {searchOpen && (
        <div className="absolute left-1/2 top-full w-[calc(100%-32px)] max-w-[600px] -translate-x-1/2 pt-3">
          <div className="border border-[#B88A2B]/20 bg-[#FBF9F3] p-4 shadow-[0_20px_60px_rgba(36,31,24,0.12)]">

            {/* Search Input */}
            <div className="flex items-center border border-[#B88A2B]/20 bg-white px-4">
              <Search
                size={17}
                className="shrink-0 text-[#B88A2B]"
                strokeWidth={1.5}
              />

              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Search furniture..."
                className="
                  h-12
                  w-full
                  bg-transparent
                  px-3
                  text-sm
                  text-[#241F18]
                  outline-none
                  placeholder:text-[#9A9183]
                "
              />

              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSearchOpen(false);
                }}
                className="text-[#9A9183] transition-colors hover:text-[#B88A2B]"
              >
                <X size={16} />
              </button>
            </div>

            {/* Results */}
            {searchQuery.trim().length > 1 && (
              <div className="mt-3 overflow-hidden">

                {filteredProducts.length > 0 ? (
                  <div className="divide-y divide-[#241F18]/[0.06]">
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.slug}
                        href={`/products/${product.slug}`}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="
                          block
                          px-3
                          py-3
                          transition-all
                          duration-200
                          hover:bg-[#B88A2B]/5
                        "
                      >
                        <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-[#40382E]">
                          {product.name}
                        </p>

                        <p className="mt-1 text-[10px] text-[#8A8174]">
                          {product.category}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-5 text-center">
                    <p className="text-xs text-[#8A8174]">
                      No furniture found.
                    </p>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* MOBILE MENU */}
      {/* ================================================= */}

      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full border-t border-[#B88A2B]/15 bg-[#F8F5ED] shadow-[0_20px_50px_rgba(36,31,24,0.10)] lg:hidden">

          <div className="mx-auto max-h-[calc(100vh-90px)] max-w-[600px] overflow-y-auto px-6 py-5">

            <MobileLink
              href="/"
              label="Home"
              onClick={() => setMobileOpen(false)}
            />

            <MobileLink
              href="/collections"
              label="Collections"
              onClick={() => setMobileOpen(false)}
            />

            <MobileLink
              href="/custom-furniture"
              label="Custom Furniture"
              onClick={() => setMobileOpen(false)}
            />

            <MobileLink
              href="/materials"
              label="Materials"
              onClick={() => setMobileOpen(false)}
            />

            <MobileLink
              href="/about"
              label="About"
              onClick={() => setMobileOpen(false)}
            />

            <MobileLink
              href="/contact"
              label="Contact"
              onClick={() => setMobileOpen(false)}
            />

            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="
                mt-5
                flex
                h-12
                items-center
                justify-center
                border
                border-[#B88A2B]
                bg-[#B88A2B]
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-white
                transition-all
                duration-300
                hover:bg-[#241F18]
              "
            >
              Enquire Now
            </Link>

          </div>
        </div>
      )}
    </>
  );
}


/* ========================================================= */
/* MOBILE LINK                                                */
/* ========================================================= */

function MobileLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="
        flex
        h-14
        items-center
        border-b
        border-[#241F18]/10
        text-[11px]
        font-semibold
        uppercase
        tracking-[0.16em]
        text-[#40382E]
        transition-colors
        duration-300
        hover:text-[#B88A2B]
      "
    >
      {label}
    </Link>
  );
}