import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="bg-[#F4F0E8] text-[#171512]">

      {/* ===================================================== */}
      {/* HERO                                                  */}
      {/* ===================================================== */}

      <section className="relative min-h-[88svh] overflow-hidden">

        <Image
          src="/pexels-capturedbyaugustine-14333989.jpg"
          alt="NIRA furniture in an outdoor living space"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Very subtle overlay */}

        <div className="absolute inset-0 bg-black/[0.08]" />

        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/25 to-transparent" />


        {/* Hero Content */}

        <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-[1480px] items-end px-6 pb-16 sm:px-10 lg:px-16 lg:pb-20">

          <div className="max-w-[900px] text-white">

            <div className="mb-6 flex items-center gap-4">

              <span className="h-px w-12 bg-white/80" />

              <span className="text-[9px] font-medium uppercase tracking-[0.28em]">
                About Nira
              </span>

            </div>

            <h1
              className="
                font-serif
                text-[56px]
                font-normal
                leading-[0.88]
                tracking-[-0.055em]
                sm:text-[72px]
                md:text-[88px]
                lg:text-[105px]
              "
            >
              Furniture made
              <br />
              <span className="italic">
                for living.
              </span>
            </h1>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* INTRODUCTION                                         */}
      {/* ===================================================== */}

      <section className="px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-36">

        <div className="mx-auto max-w-[1480px]">

          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">

            {/* Label */}

            <div className="flex items-start gap-4">

              <span className="mt-2 h-px w-12 bg-[#927344]" />

              <div>

                <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#725D3D]">
                  Our Philosophy
                </p>

                <p className="mt-4 max-w-[190px] text-[11px] leading-5 text-[#171512]/45">
                  Designed with intention.
                  Made for everyday life.
                </p>

              </div>

            </div>


            {/* Statement */}

            <div>

              <h2
                className="
                  max-w-[950px]
                  font-serif
                  text-[45px]
                  font-normal
                  leading-[0.95]
                  tracking-[-0.05em]
                  sm:text-[58px]
                  md:text-[70px]
                  lg:text-[84px]
                "
              >
                We believe furniture
                should feel as natural
                as the space around it.
              </h2>

              <p
                className="
                  mt-9
                  max-w-[650px]
                  text-[13px]
                  leading-7
                  text-[#171512]/60
                  sm:text-[14px]
                "
              >
                Nira was created around a simple idea: furniture
                should not simply fill a room. It should shape the
                way a space is experienced.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* OUR STORY                                             */}
      {/* ===================================================== */}

      <section className="bg-[#E7DFD3]">

        <div className="mx-auto grid max-w-[1480px] lg:grid-cols-2">

          {/* Image */}

          <div className="relative min-h-[520px] sm:min-h-[650px] lg:min-h-[760px]">

            <Image
              src="/pexels-kampus-6838721.jpg"
              alt="NIRA furniture and contemporary living"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />

          </div>


          {/* Story */}

          <div className="flex flex-col justify-center px-7 py-16 sm:px-12 sm:py-20 lg:px-20">

            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#927344]">
              Our Story
            </p>

            <h2
              className="
                mt-6
                max-w-[560px]
                font-serif
                text-[44px]
                font-normal
                leading-[0.92]
                tracking-[-0.05em]
                sm:text-[56px]
              "
            >
              From an idea
              <br />
              to a way of living.
            </h2>

            <div className="mt-9 max-w-[500px] space-y-5">

              <p className="text-[13px] leading-7 text-[#171512]/65">
                Nira creates furniture for people who appreciate
                thoughtful spaces, tactile materials and the
                simple pleasure of being comfortable.
              </p>

              <p className="text-[13px] leading-7 text-[#171512]/65">
                Our approach brings together contemporary
                aesthetics with practical comfort, creating
                pieces that feel refined without feeling distant.
              </p>

              <p className="text-[13px] leading-7 text-[#171512]/65">
                From outdoor terraces and gardens to living rooms,
                dining spaces and hospitality environments, every
                piece is designed to become part of the setting
                rather than compete with it.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* DESIGN PHILOSOPHY IMAGE                               */}
      {/* ===================================================== */}

      <section className="px-6 py-24 sm:px-10 sm:py-28 lg:px-16 lg:py-36">

        <div className="mx-auto max-w-[1480px]">

          <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">

            <div>

              <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#927344]">
                The Nira Approach
              </p>

              <h2
                className="
                  mt-5
                  max-w-[750px]
                  font-serif
                  text-[45px]
                  leading-[0.94]
                  tracking-[-0.05em]
                  sm:text-[60px]
                  lg:text-[76px]
                "
              >
                Considered in
                <br />
                <span className="italic">
                  every detail.
                </span>
              </h2>

            </div>

            <p className="max-w-[300px] text-[12px] leading-6 text-[#171512]/50">
              Good design is rarely about adding more.
              It is about knowing what belongs.
            </p>

          </div>


          {/* Large Image */}

          <div className="relative aspect-[16/8] overflow-hidden">

            <Image
              src="/pexels-keeganjchecks-12715508.jpg"
              alt="NIRA furniture details and considered design"
              fill
              sizes="100vw"
              className="
                object-cover
                object-center
                transition-transform
                duration-[1600ms]
                hover:scale-[1.025]
              "
            />

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* THREE PRINCIPLES                                     */}
      {/* ===================================================== */}

      <section className="border-y border-[#171512]/10 bg-[#F4F0E8]">

        <div className="mx-auto max-w-[1480px] px-6 sm:px-10 lg:px-16">

          <div className="grid md:grid-cols-3">

            <Principle
              number="01"
              title="Thoughtful Design"
              text="Clean proportions, quiet details and timeless forms designed to sit naturally within their surroundings."
            />

            <Principle
              number="02"
              title="Enduring Craft"
              text="Materials and construction are considered for everyday use, lasting comfort and years of enjoyment."
            />

            <Principle
              number="03"
              title="Made for Living"
              text="Furniture created around the moments that matter — meals, conversations, gatherings and slow afternoons."
            />

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* MADE IN INDIA                                        */}
      {/* ===================================================== */}

      <section className="bg-[#171512] px-6 py-24 text-[#F4F0E8] sm:px-10 sm:py-28 lg:px-16 lg:py-36">

        <div className="mx-auto max-w-[1480px]">

          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">

            <div>

              <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#B89A62]">
                Made in India
              </p>

            </div>


            <div>

              <h2
                className="
                  max-w-[900px]
                  font-serif
                  text-[46px]
                  font-normal
                  leading-[0.94]
                  tracking-[-0.05em]
                  sm:text-[60px]
                  lg:text-[78px]
                "
              >
                Designed with a
                <br />
                <span className="italic">
                  global perspective.
                </span>
              </h2>

              <p className="mt-8 max-w-[600px] text-[13px] leading-7 text-[#F4F0E8]/55">
                Nira is proudly made in India, bringing together
                thoughtful design, skilled craftsmanship and
                contemporary sensibilities to create furniture
                for modern spaces around the world.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* FINAL CTA                                             */}
      {/* ===================================================== */}

      <section className="bg-[#E8E1D6] px-6 py-24 text-center sm:py-28 lg:py-36">

        <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#927344]">
          Discover Nira
        </p>

        <h2
          className="
            mx-auto
            mt-5
            max-w-[850px]
            font-serif
            text-[48px]
            font-normal
            leading-[0.92]
            tracking-[-0.055em]
            sm:text-[62px]
            lg:text-[80px]
          "
        >
          Designed for spaces
          <br />
          <span className="italic">
            worth living in.
          </span>
        </h2>

        <Link
          href="/collections"
          className="
            group
            mt-9
            inline-flex
            items-center
            gap-4
            border-b
            border-[#171512]/50
            pb-3
            text-[9px]
            font-medium
            uppercase
            tracking-[0.2em]
          "
        >
          Explore Collections

          <ArrowRight
            size={14}
            strokeWidth={1}
            className="transition-transform duration-500 group-hover:translate-x-1"
          />
        </Link>

      </section>

    </main>
  );
}


/* ========================================================= */
/* PRINCIPLE                                               */
/* ========================================================= */

function Principle({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div
      className="
        border-b
        border-[#171512]/10
        px-1
        py-10
        md:border-b-0
        md:border-r
        md:px-8
        md:py-14
        first:md:pl-0
        last:md:border-r-0
      "
    >

      <div className="flex items-center justify-between">

        <span className="font-serif text-[17px] italic text-[#927344]">
          {number}
        </span>

        <span className="h-px w-8 bg-[#171512]/20" />

      </div>

      <h3
        className="
          mt-8
          font-serif
          text-[29px]
          tracking-[-0.035em]
        "
      >
        {title}
      </h3>

      <p className="mt-4 max-w-[350px] text-[12px] leading-6 text-[#171512]/55">
        {text}
      </p>

    </div>
  );
}