import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  visibleCount: number;
  startIndex: number;
  onPageChange: (page: number) => void;
};

export default function CollectionsPagination({
  currentPage,
  totalPages,
  totalItems,
  visibleCount,
  startIndex,
  onPageChange,
}: Props) {
  const progress = totalItems
    ? Math.min((visibleCount / totalItems) * 100, 100)
    : 0;

  const showingFrom = totalItems ? startIndex + 1 : 0;

  const showingTo = Math.min(
    startIndex + visibleCount,
    totalItems
  );

  return (
    <div
      className="
        mt-14
        border-t
        border-[#171512]/10
        bg-[#F0EDE6]
        px-5
        py-8
        sm:px-8
        lg:px-10
      "
    >
      <div
        className="
          flex
          flex-col
          gap-8
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        {/* =====================================================
            LEFT — COLLECTION COUNT
        ===================================================== */}

        <div className="min-w-0">

          <div className="flex items-center gap-4">

            <span
              className="
                font-sans
                text-[16px]
                font-medium
                tracking-[-0.01em]
                text-[#171512]
                sm:text-[18px]
              "
            >
              Showing{" "}
              <span className="font-semibold">
                {showingFrom}
              </span>
              {" – "}
              <span className="font-semibold">
                {showingTo}
              </span>
              {" of "}
              <span className="font-semibold">
                {totalItems}
              </span>
            </span>

            <span
              className="
                hidden
                h-1.5
                w-32
                overflow-hidden
                rounded-full
                bg-[#171512]/10
                sm:block
              "
            >
              <span
                className="
                  block
                  h-full
                  rounded-full
                  bg-[#765A32]
                  transition-all
                  duration-500
                  ease-out
                "
                style={{
                  width: `${progress}%`,
                }}
              />
            </span>

          </div>

          <p
            className="
              mt-2
              font-sans
              text-[11px]
              uppercase
              tracking-[0.18em]
              text-[#765A32]
            "
          >
            NIRA Collection · Furniture Pieces
          </p>

        </div>

        {/* =====================================================
            RIGHT — PAGINATION
        ===================================================== */}

        <div className="flex items-center justify-between gap-5 sm:justify-end">

          {/* FIRST PAGE */}

          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(1)}
            aria-label="First page"
            className="
              group
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-[#171512]/10
              bg-[#F7F4EE]
              text-[#171512]/70
              transition-all
              duration-300
              hover:border-[#171512]
              hover:bg-[#171512]
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-25
            "
          >
            <ChevronsLeft
              size={19}
              strokeWidth={1.4}
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            />
          </button>

          {/* PREVIOUS */}

          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() =>
              onPageChange(
                Math.max(1, currentPage - 1)
              )
            }
            aria-label="Previous page"
            className="
              group
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-[#E3DED4]
              text-[#171512]
              transition-all
              duration-300
              hover:-translate-x-0.5
              hover:bg-[#171512]
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-25
            "
          >
            <ChevronLeft
              size={25}
              strokeWidth={1.4}
            />
          </button>

          {/* =================================================
              PAGE COUNTER
          ================================================= */}

          <div
            className="
              flex
              min-w-[120px]
              flex-col
              items-center
              justify-center
              px-2
            "
          >

            <div className="flex items-baseline gap-2">

              <span
                className="
                  font-serif
                  text-[28px]
                  font-normal
                  leading-none
                  tracking-[-0.04em]
                  text-[#171512]
                  sm:text-[32px]
                "
              >
                {String(currentPage).padStart(2, "0")}
              </span>

              <span
                className="
                  font-sans
                  text-[13px]
                  font-medium
                  text-[#171512]/30
                "
              >
                /
              </span>

              <span
                className="
                  font-sans
                  text-[15px]
                  font-medium
                  tracking-[0.08em]
                  text-[#171512]/45
                "
              >
                {String(totalPages).padStart(2, "0")}
              </span>

            </div>

            <span
              className="
                mt-1.5
                font-sans
                text-[9px]
                font-medium
                uppercase
                tracking-[0.22em]
                text-[#765A32]
              "
            >
              Page
            </span>

          </div>

          {/* NEXT */}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() =>
              onPageChange(
                Math.min(
                  totalPages,
                  currentPage + 1
                )
              )
            }
            aria-label="Next page"
            className="
              group
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-[#171512]
              text-white
              transition-all
              duration-300
              hover:translate-x-0.5
              hover:bg-[#765A32]
              disabled:cursor-not-allowed
              disabled:opacity-25
            "
          >
            <ChevronRight
              size={25}
              strokeWidth={1.4}
            />
          </button>

          {/* LAST PAGE */}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() =>
              onPageChange(totalPages)
            }
            aria-label="Last page"
            className="
              group
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-[#171512]/10
              bg-[#F7F4EE]
              text-[#171512]/70
              transition-all
              duration-300
              hover:border-[#171512]
              hover:bg-[#171512]
              hover:text-white
              disabled:cursor-not-allowed
              disabled:opacity-25
            "
          >
            <ChevronsRight
              size={19}
              strokeWidth={1.4}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </button>

        </div>

      </div>
    </div>
  );
}