"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

export type FilterState = {
  categories: string[];
  materials: string[];
  minPrice: number;
  maxPrice: number;
  availability: string[];
  sort: "curated" | "price-low" | "price-high";
};

type Props = {
  products: {
    category?: string | null;
    material?: string | null;
    materials?: string[] | null;
    price?: number | string | null;
  }[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
};

const CATEGORY_LIST = [
  "Bar Stools",
  "Console Table",
  "Dining Chairs",
  "Floating Trays",
  "Indoor Sofa Set",
  "Our Work",
  "Outdoor Chairs",
  "Outdoor Sofa Set",
  "Rocking Chairs",
  "Single Seater Sofa Indoor",
  "Sun Loungers",
  "Swings Indoor",
  "Swings Outdoor",
  "Umbrella",
];

const INITIAL_CATEGORY_COUNT = 7;

export default function CollectionSidebar({
  products,
  filters,
  setFilters,
}: Props) {
  const [openMaterial, setOpenMaterial] = useState(true);
  const [openCategory, setOpenCategory] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [showMoreCategories, setShowMoreCategories] =
    useState(false);

  /*
   * ---------------------------------------------------------
   * MATERIALS
   * ---------------------------------------------------------
   */

  const materials = useMemo(() => {
    const allMaterials = products.flatMap(
      (product) =>
        Array.isArray(product.materials)
          ? product.materials
              .map((material) =>
                material?.trim(),
              )
              .filter(Boolean)
          : [],
    );

    const seen = new Set<string>();

    return allMaterials.filter((material) => {
      const normalized =
        material.toLowerCase();

      if (seen.has(normalized)) {
        return false;
      }

      seen.add(normalized);
      return true;
    });
  }, [products]);

  /*
   * ---------------------------------------------------------
   * PRICE
   * ---------------------------------------------------------
   */

  const maxProductPrice = useMemo(() => {
    const values = products
      .map((product) => Number(product.price || 0))
      .filter((value) => value > 0);

    return values.length
      ? Math.ceil(Math.max(...values) / 1000) * 1000
      : 500000;
  }, [products]);

  /*
   * ---------------------------------------------------------
   * CATEGORY COUNTS
   * ---------------------------------------------------------
   */

  const getCategoryCount = (category: string) => {
    return products.filter(
      (product) =>
        product.category?.toLowerCase() ===
        category.toLowerCase(),
    ).length;
  };

  /*
   * ---------------------------------------------------------
   * TOGGLE CATEGORY
   * ---------------------------------------------------------
   */

  const toggleCategory = (category: string) => {
    setFilters((previous) => ({
      ...previous,

      categories: previous.categories.includes(category)
        ? previous.categories.filter(
            (item) => item !== category,
          )
        : [...previous.categories, category],
    }));
  };

  /*
   * ---------------------------------------------------------
   * TOGGLE MATERIAL
   * ---------------------------------------------------------
   */

  const toggleMaterial = (material: string) => {
    setFilters((previous) => ({
      ...previous,

      materials: previous.materials.includes(material)
        ? previous.materials.filter(
            (item) => item !== material,
          )
        : [...previous.materials, material],
    }));
  };

  /*
   * ---------------------------------------------------------
   * RESET
   * ---------------------------------------------------------
   */

  const reset = () => {
    setFilters({
      categories: [],
      materials: [],
      minPrice: 0,
      maxPrice: maxProductPrice,
      availability: [],
      sort: "curated",
    });

    setShowMoreCategories(false);
  };

  /*
   * ---------------------------------------------------------
   * CATEGORY DISPLAY
   * ---------------------------------------------------------
   */

  const visibleCategories = showMoreCategories
    ? CATEGORY_LIST
    : CATEGORY_LIST.slice(0, INITIAL_CATEGORY_COUNT);

  const remainingCategoryCount =
    CATEGORY_LIST.length - INITIAL_CATEGORY_COUNT;

  return (
    <aside className="block w-full shrink-0 lg:w-[380px] xl:w-[410px]">
      <div
        className="
          border
          border-[#171512]/10
          bg-[#F7F4EE]
          shadow-[0_18px_60px_rgba(36,31,24,0.06)]
          [scrollbar-width:thin]
          [scrollbar-color:#765A32_#EEEAE3]
        "
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="border-b border-[#171512]/10 px-5 py-7 sm:px-7 sm:py-8 xl:px-9 xl:py-10">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p
                className="
                  font-sans
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.25em]
                  text-[#8B7352]
                "
              >
                NIRA Furniture
              </p>

              <h2
                className="
                  mt-2
                  font-serif
                  text-[32px]
                  font-normal
                  leading-none
                  tracking-[-0.02em]
                  text-[#171512]
                "
              >
                Filters
              </h2>

              <p
                className="
                  mt-3
                  max-w-[210px]
                  font-sans
                  text-[10px]
                  leading-5
                  tracking-[0.05em]
                  text-[#171512]/45
                "
              >
                Refine the NIRA collection to discover
                pieces suited to your space.
              </p>
            </div>

            <button
              type="button"
              onClick={reset}
              className="
                group
                inline-flex
                shrink-0
                items-center
                gap-2
                pt-1
                font-sans
                text-[9px]
                font-medium
                uppercase
                tracking-[0.16em]
                text-[#765A32]
                transition-all
                duration-300
                hover:text-[#171512]
              "
            >
              <RotateCcw
                size={12}
                strokeWidth={1.5}
                className="
                  transition-transform
                  duration-500
                  group-hover:rotate-[-45deg]
                "
              />

              Clear
            </button>
          </div>
        </div>

        {/* =====================================================
            COLLECTIONS
        ====================================================== */}

        <div className="px-5 py-7 sm:px-7 sm:py-8 xl:px-9 xl:py-9">
          <button
            type="button"
            onClick={() =>
              setOpenCategory(!openCategory)
            }
            className="
              flex
              w-full
              items-center
              justify-between
              text-left
            "
          >
            <div>
              <p
                className="
                  font-sans
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-[#171512]
                "
              >
                Collections
              </p>

              <p
                className="
                  mt-1.5
                  font-sans
                  text-[9px]
                  uppercase
                  tracking-[0.12em]
                  text-[#171512]/40
                "
              >
                {filters.categories.length > 0
                  ? `${filters.categories.length} selected`
                  : `${CATEGORY_LIST.length} categories`}
              </p>
            </div>

            <span
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                border
                border-[#171512]/10
                text-[#765A32]
                transition-all
                duration-300
              "
            >
              {openCategory ? (
                <ChevronUp
                  size={15}
                  strokeWidth={1.3}
                />
              ) : (
                <ChevronDown
                  size={15}
                  strokeWidth={1.3}
                />
              )}
            </span>
          </button>

          {openCategory && (
            <div className="mt-6">
              <div className="space-y-1">
                {visibleCategories.map((category) => {
                  const checked =
                    filters.categories.includes(category);

                  const count =
                    getCategoryCount(category);

                  return (
                    <label
                      key={category}
                      className={`
                        group
                        flex
                        min-h-[44px]
                        cursor-pointer
                        items-center
                        justify-between
                        border-b
                        border-[#171512]/[0.055]
                        py-2.5
                        transition-all
                        duration-300
                        ${
                          checked
                            ? "pl-2"
                            : "hover:pl-2"
                        }
                      `}
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        {/* CUSTOM CHECKBOX */}

                        <span
                          className={`
                            relative
                            flex
                            h-4
                            w-4
                            shrink-0
                            items-center
                            justify-center
                            border
                            transition-all
                            duration-300
                            ${
                              checked
                                ? "border-[#765A32] bg-[#765A32]"
                                : "border-[#171512]/20 bg-white group-hover:border-[#765A32]"
                            }
                          `}
                        >
                          {checked && (
                            <span className="h-[5px] w-[5px] bg-white" />
                          )}

                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              toggleCategory(category)
                            }
                            className="
                              absolute
                              inset-0
                              cursor-pointer
                              opacity-0
                            "
                          />
                        </span>

                        <span
                          className={`
                            truncate
                            font-serif
                            text-[15px]
                            leading-snug
                            transition-colors
                            duration-300
                            ${
                              checked
                                ? "text-[#765A32]"
                                : "text-[#312B25] group-hover:text-[#765A32]"
                            }
                          `}
                        >
                          {category}
                        </span>
                      </div>

                      <span
                        className="
                          ml-3
                          shrink-0
                          font-sans
                          text-[10px]
                          tabular-nums
                          text-[#8A8174]
                        "
                      >
                        {count}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* MORE CATEGORIES */}

              {!showMoreCategories &&
                remainingCategoryCount > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowMoreCategories(true)
                    }
                    className="
                      group
                      mt-5
                      flex
                      w-full
                      items-center
                      justify-between
                      border
                      border-[#765A32]/30
                      bg-white/60
                      px-5
                      py-4
                      transition-all
                      duration-300
                      hover:border-[#765A32]
                      hover:bg-[#765A32]
                      hover:text-white
                    "
                  >
                    <span
                      className="
                        font-sans
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                      "
                    >
                      More Categories
                    </span>

                    <span
                      className="
                        flex
                        items-center
                        gap-2
                        font-sans
                        text-[9px]
                        uppercase
                        tracking-[0.1em]
                      "
                    >
                      +{remainingCategoryCount}

                      <ChevronDown
                        size={14}
                        strokeWidth={1.3}
                        className="
                          transition-transform
                          duration-300
                          group-hover:translate-y-0.5
                        "
                      />
                    </span>
                  </button>
                )}

              {showMoreCategories && (
                <button
                  type="button"
                  onClick={() =>
                    setShowMoreCategories(false)
                  }
                  className="
                    group
                    mt-5
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    border
                    border-[#171512]/10
                    bg-white/40
                    px-5
                    py-4
                    font-sans
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-[#765A32]
                    transition-all
                    duration-300
                    hover:border-[#765A32]
                    hover:bg-white
                  "
                >
                  Show Less

                  <ChevronUp
                    size={14}
                    strokeWidth={1.3}
                  />
                </button>
              )}
            </div>
          )}
        </div>

        {/* =====================================================
            MATERIAL PALETTE
        ====================================================== */}

        <div className="border-t border-[#171512]/10 px-5 py-7 sm:px-7 sm:py-8 xl:px-9 xl:py-9">
          <button
            type="button"
            onClick={() => setOpenMaterial(!openMaterial)}
            className="flex w-full items-center justify-between text-left"
          >
            <div>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[#171512]">
                Material Palette
              </p>

              <p className="mt-1.5 font-sans text-[9px] uppercase tracking-[0.12em] text-[#171512]/40">
                {filters.materials.length > 0
                  ? `${filters.materials.length} selected`
                  : `${materials.length} available`}
              </p>
            </div>

            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#171512]/10 text-[#765A32]">
              {openMaterial ? (
                <ChevronUp size={15} strokeWidth={1.3} />
              ) : (
                <ChevronDown size={15} strokeWidth={1.3} />
              )}
            </span>
          </button>

          {openMaterial && (
            <div className="mt-6">
              {materials.length === 0 ? (
                <p className="py-3 font-sans text-[10px] uppercase tracking-[0.12em] text-[#171512]/35">
                  No materials available
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((previous) => ({
                        ...previous,
                        materials: [],
                      }))
                    }
                    className={`border px-3 py-2.5 font-sans text-[9px] font-medium uppercase tracking-[0.08em] transition-all duration-300 ${
                      filters.materials.length === 0
                        ? "border-[#765A32] bg-[#765A32] text-white"
                        : "border-[#171512]/10 bg-white text-[#171512]/65 hover:border-[#765A32]/50 hover:text-[#765A32]"
                    }`}
                  >
                    All Materials
                  </button>

                  {materials.map((material) => {
                    const active = filters.materials.includes(material);

                    return (
                      <button
                        key={material}
                        type="button"
                        onClick={() => toggleMaterial(material)}
                        className={`border px-3 py-2.5 font-sans text-[9px] font-medium uppercase tracking-[0.08em] transition-all duration-300 ${
                          active
                            ? "border-[#765A32] bg-[#765A32] text-white"
                            : "border-[#171512]/10 bg-white text-[#171512]/65 hover:border-[#765A32]/50 hover:text-[#765A32]"
                        }`}
                      >
                        {material}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* =====================================================
            PRICE
        ====================================================== */}

        <div className="border-t border-[#171512]/10 px-5 py-7 sm:px-7 sm:py-8 xl:px-9 xl:py-9">
          <button
            type="button"
            onClick={() => setOpenPrice(!openPrice)}
            className="
              flex
              w-full
              items-center
              justify-between
              text-left
            "
          >
            <div>
              <p
                className="
                  font-sans
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-[#171512]
                "
              >
                Price Range
              </p>

              <p
                className="
                  mt-1.5
                  font-sans
                  text-[9px]
                  uppercase
                  tracking-[0.12em]
                  text-[#171512]/40
                "
              >
                Set your preferred range
              </p>
            </div>

            <span
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                border
                border-[#171512]/10
                text-[#765A32]
              "
            >
              {openPrice ? (
                <ChevronUp
                  size={15}
                  strokeWidth={1.3}
                />
              ) : (
                <ChevronDown
                  size={15}
                  strokeWidth={1.3}
                />
              )}
            </span>
          </button>

          {openPrice && (
            <div className="mt-6">
              {/* MIN PRICE */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className="
                      font-sans
                      text-[9px]
                      uppercase
                      tracking-[0.12em]
                      text-[#8A8174]
                    "
                  >
                    Minimum
                  </span>

                  <span
                    className="
                      font-serif
                      text-[17px]
                      text-[#312B25]
                    "
                  >
                    ₹
                    {filters.minPrice.toLocaleString(
                      "en-IN",
                    )}
                  </span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={maxProductPrice}
                  step={1000}
                  value={Math.min(
                    filters.minPrice,
                    filters.maxPrice,
                  )}
                  onChange={(event) => {
                    const value = Number(
                      event.target.value,
                    );

                    setFilters((previous) => ({
                      ...previous,
                      minPrice: Math.min(
                        value,
                        previous.maxPrice,
                      ),
                    }));
                  }}
                  className="
                    h-1.5
                    w-full
                    cursor-pointer
                    appearance-none
                    rounded-full
                    bg-[#171512]/10
                    accent-[#765A32]
                  "
                />
              </div>

              {/* MAX PRICE */}

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <span
                    className="
                      font-sans
                      text-[9px]
                      uppercase
                      tracking-[0.12em]
                      text-[#8A8174]
                    "
                  >
                    Maximum
                  </span>

                  <span
                    className="
                      font-serif
                      text-[17px]
                      text-[#312B25]
                    "
                  >
                    ₹
                    {filters.maxPrice.toLocaleString(
                      "en-IN",
                    )}
                  </span>
                </div>

                <input
                  type="range"
                  min={0}
                  max={maxProductPrice}
                  step={1000}
                  value={Math.max(
                    filters.maxPrice,
                    filters.minPrice,
                  )}
                  onChange={(event) => {
                    const value = Number(
                      event.target.value,
                    );

                    setFilters((previous) => ({
                      ...previous,
                      maxPrice: Math.max(
                        value,
                        previous.minPrice,
                      ),
                    }));
                  }}
                  className="
                    h-1.5
                    w-full
                    cursor-pointer
                    appearance-none
                    rounded-full
                    bg-[#171512]/10
                    accent-[#765A32]
                  "
                />
              </div>

              {/* PRICE BOXES */}

              <div className="mt-6 grid grid-cols-2 gap-2.5">
                <div
                  className="
                    border
                    border-[#171512]/10
                    bg-white
                    px-4
                    py-4
                  "
                >
                  <p
                    className="
                      font-sans
                      text-[8px]
                      uppercase
                      tracking-[0.15em]
                      text-[#8A8174]
                    "
                  >
                    From
                  </p>

                  <p className="mt-1 font-serif text-[18px]">
                    ₹
                    {filters.minPrice.toLocaleString(
                      "en-IN",
                    )}
                  </p>
                </div>

                <div
                  className="
                    border
                    border-[#171512]/10
                    bg-white
                    px-4
                    py-4
                  "
                >
                  <p
                    className="
                      font-sans
                      text-[8px]
                      uppercase
                      tracking-[0.15em]
                      text-[#8A8174]
                    "
                  >
                    To
                  </p>

                  <p className="mt-1 font-serif text-[18px]">
                    ₹
                    {filters.maxPrice.toLocaleString(
                      "en-IN",
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =====================================================
            SORT
        ====================================================== */}

        <div className="border-t border-[#171512]/10 px-5 py-7 sm:px-7 sm:py-8 xl:px-9 xl:py-9">
          <p
            className="
              font-sans
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-[#171512]
            "
          >
            Sort By
          </p>

          <select
            value={filters.sort}
            onChange={(event) =>
              setFilters((previous) => ({
                ...previous,
                sort: event.target.value as FilterState["sort"],
              }))
            }
            className="
              mt-5
              h-12
              w-full
              appearance-none
              border
              border-[#171512]/10
              bg-white
              px-4
              font-serif
              text-[17px]
              text-[#312B25]
              outline-none
              transition-all
              duration-300
              focus:border-[#765A32]/50
            "
          >
            <option value="curated">
              Curated Heritage Order
            </option>

            <option value="price-low">
              Price — Low to High
            </option>

            <option value="price-high">
              Price — High to Low
            </option>
          </select>
        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <div
          className="
            border-t
            border-[#171512]/10
            bg-[#EEEAE3]/70
            px-5
            py-5
            sm:px-7
          "
        >
          <p
            className="
              text-center
              font-sans
              text-[8px]
              uppercase
              tracking-[0.18em]
              text-[#171512]/35
            "
          >
            Crafted for the NIRA collection
          </p>
        </div>
      </div>
    </aside>
  );
}