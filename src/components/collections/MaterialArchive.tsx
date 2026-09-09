import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function MaterialPoint({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 font-sans text-[14px] leading-[1.75] text-[#171512]/65 sm:text-[15px]">
      <span className="mt-0.5 text-[17px] font-light text-[#765A32]">
        ◇
      </span>

      <span>{children}</span>
    </div>
  );
}

function MaterialCard({
  image,
  eyebrow,
  title,
  description,
}: {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        group/material
        overflow-hidden
        rounded-[7px]
        border
        border-[#171512]/[0.07]
        bg-[#F7F4EE]
        shadow-[0_10px_35px_rgba(23,21,18,0.04)]
        transition-all
        duration-700
        ease-[cubic-bezier(0.22,1,0.36,1)]
        hover:-translate-y-1.5
        hover:shadow-[0_25px_55px_rgba(23,21,18,0.11)]
      "
    >
      {/* IMAGE */}

      <div className="relative aspect-square overflow-hidden bg-[#DDD8CE]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 28vw, 33vw"
          className="
            object-cover
            transition-transform
            duration-[1200ms]
            ease-[cubic-bezier(0.22,1,0.36,1)]
            group-hover/material:scale-[1.06]
          "
        />

        {/* IMAGE OVERLAY */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/20
            via-transparent
            to-transparent
            opacity-0
            transition-opacity
            duration-700
            group-hover/material:opacity-100
          "
        />
      </div>

      {/* CONTENT */}

      <div className="p-5 sm:p-6">

        <p
          className="
            font-sans
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.2em]
            text-[#765A32]
          "
        >
          {eyebrow}
        </p>

        <h3
          className="
            mt-3
            font-serif
            text-[22px]
            font-normal
            leading-[1.08]
            tracking-[-0.025em]
            text-[#171512]
            sm:text-[24px]
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-3
            font-sans
            text-[13px]
            leading-[1.7]
            text-[#171512]/50
            sm:text-[14px]
          "
        >
          {description}
        </p>

      </div>
    </div>
  );
}

export default function MaterialArchive() {
  return (
    <section
      className="
        px-5
        pb-24
        sm:px-8
        lg:px-12
        lg:pb-32
        xl:px-16
      "
    >
      <div
        className="
          mx-auto
          max-w-[1380px]
          overflow-hidden
          rounded-[7px]
          bg-[#F0EDE6]
          p-7
          sm:p-10
          lg:p-14
          xl:p-16
        "
      >
        <div
          className="
            grid
            gap-12
            lg:grid-cols-2
            lg:items-center
            lg:gap-16
            xl:gap-24
          "
        >

          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}

          <div>

            <p
              className="
                mb-6
                font-sans
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.28em]
                text-[#765A32]
                sm:text-[12px]
              "
            >
              The Material Archives
            </p>

            <h2
              className="
                max-w-[600px]
                font-serif
                text-[44px]
                font-normal
                leading-[0.98]
                tracking-[-0.04em]
                text-[#171512]
                sm:text-[52px]
                lg:text-[58px]
                xl:text-[64px]
              "
            >
              Authentic Provenance
              <br />
              &amp; Tactile Mastery
            </h2>

            <p
              className="
                mt-7
                max-w-[580px]
                font-sans
                text-[14px]
                leading-[1.8]
                text-[#171512]/55
                sm:text-[15px]
                lg:text-[16px]
              "
            >
              Every piece in the NIRA living collection begins in selected
              quarries and sustainable forests. We invite discerning clients
              to understand the materials that give each piece its character.
            </p>

            {/* MATERIAL POINTS */}

            <div className="mt-9 space-y-5">

              <MaterialPoint>
                Century Teak Crafting — Timber seasoned in low-humidity
                kilns for deep tonal character.
              </MaterialPoint>

              <MaterialPoint>
                100% Travertine Vein Matching — Hand-cut blocks selected
                for continuous directional veins.
              </MaterialPoint>

            </div>

            {/* CTA */}

            <Link
              href="/materials"
              className="
                group
                mt-10
                inline-flex
                items-center
                gap-5
                bg-[#171512]
                px-6
                py-4
                font-sans
                text-[11px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-white
                transition-all
                duration-300
                hover:bg-[#765A32]
              "
            >
              Order Material Archive Kit

              <ArrowRight
                size={16}
                strokeWidth={1.2}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1.5
                "
              />
            </Link>

          </div>

          {/* =====================================================
              RIGHT MATERIAL CARDS
          ===================================================== */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5">


          

          </div>

        </div>
      </div>
    </section>
  );
}