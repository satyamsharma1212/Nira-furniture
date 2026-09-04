import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <article className="group">

      {/* Image */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-[#EDE5D5]"
      >
        <Image
          src={product.images[0]}
          alt={product.altText || product.name}
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 30vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/15" />

        {/* View button */}
        <div className="absolute bottom-5 right-5 flex h-11 w-11 translate-y-3 items-center justify-center bg-[#C99A2E] text-[#11100E] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={17} />
        </div>

        {/* Featured badge */}
        {product.featured && (
          <div className="absolute left-4 top-4 border border-[#C99A2E]/60 bg-[#11100E]/80 px-3 py-1.5 backdrop-blur-md">
            <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#E7B84B]">
              Featured
            </span>
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="pt-5">

        <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#C99A2E]">
          {product.subcategory}
        </p>

        <Link
          href={`/products/${product.slug}`}
          className="block font-serif text-2xl font-normal text-[#171513] transition-colors duration-300 hover:text-[#8A6418]"
        >
          {product.name}
        </Link>

        <p className="mt-2 max-w-md text-sm leading-6 text-[#171513]/60">
          {product.shortDescription}
        </p>

        <Link
          href={`/products/${product.slug}`}
          className="group/link mt-4 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#171513]"
        >
          View Details

          <span className="h-px w-7 bg-[#C99A2E] transition-all duration-300 group-hover/link:w-11" />
        </Link>

      </div>
    </article>
  );
}