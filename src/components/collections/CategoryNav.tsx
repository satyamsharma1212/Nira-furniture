import Link from "next/link";

import { products } from "@/data/products";
import { COLLECTION_CATEGORIES, CollectionCategory } from "@/lib/collections";

type Props = {
  activeCategory: CollectionCategory;
};

export default function CategoryNav({ activeCategory }: Props) {
  return (
    <section className="border-b border-[#171512]/10 bg-[#F7F4EE] px-5 py-5 sm:px-8 sm:py-6 lg:px-12 lg:py-7 xl:px-16">
      <div className="mx-auto flex max-w-[1380px] gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {COLLECTION_CATEGORIES.map((category) => {
          const active = activeCategory === category.value;
          const href = category.slug
            ? `/collections/${category.slug}`
            : "/collections";

          return (
            <Link
              key={category.value}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`group relative flex shrink-0 items-center justify-center gap-3 overflow-hidden rounded-full border px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.16em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-8 sm:py-4 sm:text-[12px] ${
                active
                  ? "border-[#171512] bg-[#171512] text-white shadow-[0_8px_25px_rgba(23,21,18,0.12)]"
                  : "border-[#171512]/10 bg-[#F0EDE6] text-[#171512]/60 hover:-translate-y-[1px] hover:border-[#765A32]/40 hover:bg-[#EAE5DC] hover:text-[#171512] hover:shadow-[0_8px_22px_rgba(23,21,18,0.06)]"
              }`}
            >
              <span
                className={`pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-transform duration-700 ${
                  active
                    ? "translate-x-0"
                    : "-translate-x-full group-hover:translate-x-full"
                }`}
              />
              <span className="relative z-10 whitespace-nowrap">
                {category.label}
              </span>

              {category.value === "all" && (
                <span
                  className={`relative z-10 flex min-w-[24px] items-center justify-center rounded-full px-1.5 py-0.5 text-[9px] tracking-normal ${
                    active
                      ? "bg-white/10 text-white/65"
                      : "bg-[#171512]/[0.05] text-[#171512]/35"
                  }`}
                >
                  {products.length}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
