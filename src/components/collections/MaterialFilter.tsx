import { ArrowDown, Sparkles } from "lucide-react";

import {
  MATERIALS,
  type MaterialFilter as MaterialFilterValue,
} from "../../lib/collections";

type Props = {
  activeMaterial: MaterialFilterValue;
  sortBy: "curated" | "price-low" | "price-high";
  onMaterialChange: (material: MaterialFilterValue) => void;
  onSortChange: (sort: Props["sortBy"]) => void;
};

export default function MaterialFilter({
  activeMaterial,
  sortBy,
  onMaterialChange,
  onSortChange,
}: Props) {
  return (
    <section className="px-5 py-7 sm:px-8 lg:px-12 xl:px-16">
      <div className="mx-auto flex max-w-[1380px] flex-col gap-6 rounded-[3px] bg-[#F0EDE6] px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-7">
        
        {/* Material Palette */}
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#765A32]">
            Material Palette
          </p>

          <div className="flex flex-wrap gap-2">
            {MATERIALS.map((material) => {
              const active = activeMaterial === material;

              return (
                <button
                  key={material}
                  type="button"
                  onClick={() => onMaterialChange(material)}
                  className={`border px-3.5 py-2.5 text-[11px] font-medium uppercase tracking-[0.06em] transition-all duration-300 ${
                    active
                      ? "border-[#765A32] bg-[#765A32] text-white"
                      : "border-[#171512]/10 bg-[#F7F4EE] text-[#171512]/65 hover:border-[#765A32]/50 hover:text-[#765A32]"
                  }`}
                >
                  {material}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#171512]/50">
            Sort
          </span>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(event) =>
                onSortChange(event.target.value as Props["sortBy"])
              }
              className="
                appearance-none
                border
                border-[#171512]/10
                bg-[#F7F4EE]
                py-2.5
                pl-4
                pr-10
                text-[12px]
                font-medium
                text-[#171512]/75
                outline-none
                transition-colors
                duration-300
                hover:border-[#765A32]/40
                focus:border-[#765A32]
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

            <ArrowDown
              size={12}
              strokeWidth={1.3}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#171512]/50"
            />
          </div>

          {/* Concierge */}
          {/* <button
            type="button"
            className="
              hidden
              items-center
              gap-2
              border
              border-[#765A32]/20
              bg-[#F4E4C8]
              px-4
              py-2.5
              text-[11px]
              font-medium
              uppercase
              tracking-[0.12em]
              text-[#765A32]
              transition-all
              duration-300
              hover:border-[#765A32]/40
              hover:bg-[#EFDDBD]
              lg:flex
            "
          >
            <Sparkles
              size={11}
              strokeWidth={1.2}
            />

            Show Concierge Plan
          </button> */}
        </div>
      </div>
    </section>
  );
}