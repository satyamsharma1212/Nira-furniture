import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ArchitecturalGuildCTA() {
  return (
    <section className="px-5 pb-24 sm:px-8 lg:px-12 xl:px-16">
      <div className="relative mx-auto max-w-[1380px] overflow-hidden rounded-[5px] bg-[#100E0B] px-7 py-12 text-white sm:px-10 lg:px-12 lg:py-14">
        <div className="pointer-events-none absolute right-[-100px] top-[-150px] h-[400px] w-[400px] rounded-full bg-[#765A32]/15 blur-[100px] animate-[niraPulse_8s_ease-in-out_infinite]" />

        <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D0B27A]/20 bg-[#D0B27A]/5 px-3 py-1.5">
              <span className="h-1 w-1 rounded-full bg-[#D0B27A]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#D0B27A]">
                Architectural Guild Desk
              </span>
            </div>

            <h2 className="max-w-[700px] font-serif text-[30px] font-normal leading-[1.05] tracking-[-0.025em] sm:text-[38px]">
              Cannot find your exact architectural specifications?
            </h2>

            <p className="mt-5 max-w-[700px] text-[10px] leading-6 text-white/45 sm:text-[11px]">
              Our bespoke dimensional guild can tailor any piece in our
              catalogue to the millimetre. From sectional layouts to
              hospitality specifications, every commission is developed around
              your space.
            </p>

            <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-[10px] uppercase tracking-[0.14em] text-white/50">
              <span>◇ CAD / BIM Models Supplied</span>
              <span>◇ Dedicated Private Architect Partner</span>
              <span>◇ Global White-Glove Installation</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/custom-furniture"
              className="inline-flex items-center gap-3 bg-[#F4D8AD] px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.15em] text-[#171512] transition-colors hover:bg-white"
            >
              Bespoke Commission
              <ArrowRight size={12} strokeWidth={1.1} />
            </Link>

            <Link
              href="/materials"
              className="inline-flex items-center gap-3 bg-white/5 px-6 py-3.5 text-[10px] font-medium uppercase tracking-[0.15em] text-white/80 transition-colors hover:bg-white/10"
            >
              View Provenance
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
