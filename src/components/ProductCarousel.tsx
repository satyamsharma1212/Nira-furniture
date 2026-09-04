"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/types/product";

interface ProductCarouselProps {
  products: Product[];
}

export default function ProductCarousel({
  products,
}: ProductCarouselProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: direction === "right" ? 430 : -430,
      behavior: "smooth",
    });
  };

  return (
    <div>

      {/* Controls */}
      <div className="mb-8 flex items-center justify-end gap-2">

        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Previous products"
          className="flex h-11 w-11 items-center justify-center border border-[#171513]/20 text-[#171513] transition-all duration-300 hover:border-[#C99A2E] hover:bg-[#C99A2E] hover:text-[#11100E]"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Next products"
          className="flex h-11 w-11 items-center justify-center border border-[#171513]/20 text-[#171513] transition-all duration-300 hover:border-[#C99A2E] hover:bg-[#C99A2E] hover:text-[#11100E]"
        >
          <ChevronRight size={18} />
        </button>

      </div>

      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-5 scrollbar-none"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[82vw] shrink-0 snap-start sm:w-[48%] lg:w-[31%]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

    </div>
  );
}