import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = {
  title: "Enquire | NIRA Furniture",
  description:
    "Enquire about premium outdoor, indoor and custom furniture from NIRA Furniture.",
};

export default function EnquiryPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F2] text-[#241F18]">

      {/* ================================================ */}
      {/* HERO */}
      {/* ================================================ */}

      <section className="border-b border-[#B8860B]/15 pt-[90px]">

        <div className="mx-auto max-w-[1480px] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">

          <div className="max-w-3xl">

            <div className="mb-7 flex items-center gap-4">

              <span className="h-px w-14 bg-[#B8860B]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#B8860B]">
                NIRA Furniture
              </span>

            </div>

            <h1 className="font-serif text-5xl font-normal leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Let&apos;s create
              <br />
              something
              <br />
              <span className="italic text-[#B8860B]">
                beautiful.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-sm leading-7 text-[#756B5B] sm:text-[15px]">
              Tell us what you are looking for. Whether you need
              a single piece, furniture for a project, or a fully
              customized collection, our team will help you find
              the right solution.
            </p>

          </div>

        </div>

      </section>


      {/* ================================================ */}
      {/* ENQUIRY AREA */}
      {/* ================================================ */}

      <section className="mx-auto max-w-[1280px] px-6 py-16 sm:px-10 lg:py-24">

        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">

          {/* ============================================ */}
          {/* INFORMATION */}
          {/* ============================================ */}

          <div>

            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#B8860B]">
              Get In Touch
            </p>

            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
              Tell us about
              <br />
              your requirements.
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#756B5B]">
              Share your furniture requirements with us and our
              team will get back to you with suitable options,
              pricing and customization possibilities.
            </p>


            {/* Contact details */}
            <div className="mt-10 space-y-7">

              <ContactItem
                icon={<Phone size={18} strokeWidth={1.4} />}
                title="Phone"
                value="+91 XXXXX XXXXX"
              />

              <ContactItem
                icon={<Mail size={18} strokeWidth={1.4} />}
                title="Email"
                value="info@nirafurniture.com"
              />

              <ContactItem
                icon={<MapPin size={18} strokeWidth={1.4} />}
                title="Location"
                value="Surat · Mumbai · India"
              />

            </div>


            {/* Customization */}
            <div className="mt-10 border-t border-[#241F18]/10 pt-8">

              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#B8860B]">
                Custom Furniture
              </p>

              <p className="mt-3 text-sm leading-6 text-[#756B5B]">
                Dimensions · Design · Fabric · Colour · Rope ·
                Weaving · Wood · Metal Finish · Cushions
              </p>

            </div>


            {/* Back */}
            <Link
              href="/collections"
              className="group mt-9 inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#B8860B]"
            >
              Explore Collections

              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>


          {/* ============================================ */}
          {/* FORM */}
          {/* ============================================ */}

          <div className="border border-[#B8860B]/15 bg-white p-6 shadow-[0_20px_70px_rgba(36,31,24,0.07)] sm:p-8 lg:p-10">

            <div className="mb-8 border-b border-[#241F18]/10 pb-7">

              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#B8860B]">
                Start a Conversation
              </p>

              <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
                Request an Enquiry
              </h2>

              <p className="mt-3 text-xs leading-6 text-[#8A8174]">
                Fill in your details and tell us what you need.
              </p>

            </div>

            <EnquiryForm />

          </div>

        </div>

      </section>


      {/* ================================================ */}
      {/* BOTTOM STRIP */}
      {/* ================================================ */}

      <section className="bg-[#241F18]">

        <div className="mx-auto max-w-[1200px] px-6 py-16 text-center sm:px-10 lg:py-20">

          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#E0B84F]">
            NIRA Furniture
          </p>

          <h2 className="mt-4 font-serif text-3xl text-[#FAF8F2] sm:text-4xl">
            Crafted for Comfort.
            <br />
            <span className="italic text-[#E0B84F]">
              Designed for Living.
            </span>
          </h2>

        </div>

      </section>

    </main>
  );
}


/* ======================================================== */
/* CONTACT ITEM                                               */
/* ======================================================== */

function ContactItem({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#B8860B]/20 bg-white text-[#B8860B]">
        {icon}
      </div>

      <div>

        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#B8860B]">
          {title}
        </p>

        <p className="mt-1 text-sm text-[#5D5549]">
          {value}
        </p>

      </div>

    </div>
  );
}