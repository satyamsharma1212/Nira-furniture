"use client";

import Image from "next/image";

function MaterialPoint({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        flex
        gap-3
        font-sans
        text-[12px]
        leading-[1.7]
        text-[#171512]/65
        sm:text-[13px]
        lg:text-[14px]
      "
    >
      <span className="mt-0.5 shrink-0 text-[14px] text-[#765A32]">
        ◇
      </span>

      <span>{children}</span>
    </div>
  );
}

export default function ArchitecturalDialogues() {
  const indoorTags = [
    "Curated Sofas",
    "Accent Chairs",
    "Travertine Consoles",
    "Dining Suites",
  ];

  const outdoorTags = [
    "Lounge Sets",
    "Sun Pavilions",
    "Alfresco Dining",
    "Fire Lounges",
  ];

  /*
   * Unsplash images
   *
   * These are remote images, so make sure
   * images.unsplash.com is allowed in next.config.ts.
   */
  const indoorImage =
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&fm=jpg&q=85&w=1800";

  const outdoorImage =
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&fm=jpg&q=85&w=1800";

  return (
    <section
      className="
        w-full
        bg-[#F3F0E9]
        px-5
        py-20
        sm:px-8
        sm:py-24
        lg:px-12
        lg:py-28
        xl:px-16
        2xl:py-32
      "
    >
      <div className="mx-auto max-w-[1500px]">

        {/* =====================================================
            SECTION INTRO
        ====================================================== */}

        <div
          className="
            mx-auto
            mb-14
            max-w-[1050px]
            text-center
            sm:mb-16
            lg:mb-20
          "
        >
          <p
            className="
              mb-5
              font-sans
              text-[15px]
              font-semibold
              uppercase
              tracking-[0.28em]
              text-[#765A32]
              sm:text-[16px]
            "
          >
            Architectural Dialogues
          </p>

          <h2
            className="
              font-serif
              text-[42px]
              font-normal
              leading-[0.96]
              tracking-[-0.045em]
              text-[#171512]
              sm:text-[52px]
              md:text-[62px]
              lg:text-[72px]
              xl:text-[80px]
            "
          >
            Two Realms,
            <br className="sm:hidden" /> One Sovereign Aesthetic
          </h2>

          <p
            className="
              mx-auto
              mt-6
              max-w-[820px]
              font-sans
              text-[16px]
              font-medium
              leading-[1.8]
              tracking-[0.005em]
              text-[#171512]/70
              sm:mt-7
              sm:text-[17px]
              sm:leading-[1.9]
              lg:text-[18px]
            "
          >
            Whether framing sunlit Tuscan hills or evening firesides
            within penthouse salons, every silhouette is composed
            as timeless spatial sculpture.
          </p>
        </div>

        {/* =====================================================
            TWO REALMS
        ====================================================== */}

        <div
          className="
            grid
            gap-6
            lg:grid-cols-2
            lg:gap-8
          "
        >

          {/* =================================================
              REALM 01 — INDOOR
          ================================================== */}

          <article
            className="
              group
              overflow-hidden
              border
              border-black/[0.055]
              bg-white
              shadow-[0_20px_60px_rgba(35,30,25,0.055)]
              transition-all
              duration-700
              hover:-translate-y-1
              hover:shadow-[0_30px_80px_rgba(35,30,25,0.10)]
            "
          >

            {/* =================================================
                INDOOR IMAGE
            ================================================== */}

            <div
              className="
                relative
                block
                aspect-[1.15/1]
                overflow-hidden
                bg-[#DCD6CC]
              "
            >
              <Image
                src={indoorImage}
                alt="Luxury contemporary indoor living room with refined furniture"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="
                  object-cover
                  transition-transform
                  duration-[1600ms]
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover:scale-[1.045]
                "
              />

              {/* IMAGE OVERLAY */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/75
                  via-black/20
                  to-white/[0.05]
                "
              />

              {/* IMAGE CONTENT */}

              <div
                className="
                  absolute
                  inset-x-0
                  bottom-0
                  p-6
                  sm:p-8
                  lg:p-9
                  xl:p-11
                "
              >
                <p
                  className="
                    mb-3
                    font-sans
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    text-[#D0B27A]
                    sm:text-[11px]
                  "
                >
                  Realm 01
                </p>

                <h3
                  className="
                    max-w-[650px]
                    font-serif
                    text-[32px]
                    font-normal
                    leading-[0.98]
                    tracking-[-0.035em]
                    text-white
                    sm:text-[40px]
                    lg:text-[46px]
                    xl:text-[52px]
                  "
                >
                  Indoor Living:
                  <br />
                  Grand Salons &amp; Suites
                </h3>
              </div>
            </div>

            {/* =================================================
                INDOOR CONTENT
            ================================================== */}

            <div
              className="
                px-6
                py-8
                sm:px-8
                sm:py-9
                lg:px-9
                lg:py-10
                xl:px-11
                xl:py-12
              "
            >
              <p
                className="
                  max-w-[760px]
                  font-sans
                  text-[16px]
                  font-medium
                  leading-[1.8]
                  tracking-[0.005em]
                  text-[#171512]/70
                  sm:text-[17px]
                  lg:text-[18px]
                "
              >
                Sculptural forms, enveloping boucles, honed marble
                and warm ambient woods created for intimate grandeur
                and acoustic warmth.
              </p>

              {/* INDOOR TAGS */}

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  gap-2.5
                  sm:mt-8
                "
              >
                {indoorTags.map((item) => (
                  <span
                    key={item}
                    className="
                      border
                      border-[#171512]/[0.08]
                      bg-[#F8F6F1]
                      px-4
                      py-2.5
                      font-sans
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.1em]
                      text-[#171512]/65
                      shadow-[0_4px_15px_rgba(35,30,25,0.025)]
                      transition-all
                      duration-300
                      hover:-translate-y-[1px]
                      hover:border-[#B88A2B]/25
                      hover:bg-white
                      hover:text-[#765A32]
                      hover:shadow-[0_8px_22px_rgba(35,30,25,0.06)]
                      sm:text-[11px]
                    "
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </article>

          {/* =================================================
              REALM 02 — OUTDOOR
          ================================================== */}

          <article
            className="
              group
              overflow-hidden
              border
              border-black/[0.055]
              bg-[#FBFAF7]
              shadow-[0_20px_60px_rgba(35,30,25,0.055)]
              transition-all
              duration-700
              hover:-translate-y-1
              hover:shadow-[0_30px_80px_rgba(35,30,25,0.10)]
            "
          >

            {/* =================================================
                OUTDOOR IMAGE
            ================================================== */}

            <div
              className="
                relative
                block
                aspect-[1.15/1]
                overflow-hidden
                bg-[#DCD6CC]
              "
            >
              <Image
                src={outdoorImage}
                alt="Luxury outdoor terrace with refined contemporary furniture"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="
                  object-cover
                  transition-transform
                  duration-[1600ms]
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover:scale-[1.045]
                "
              />

              {/* IMAGE OVERLAY */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/75
                  via-black/20
                  to-white/[0.05]
                "
              />

              {/* IMAGE CONTENT */}

              <div
                className="
                  absolute
                  inset-x-0
                  bottom-0
                  p-6
                  sm:p-8
                  lg:p-9
                  xl:p-11
                "
              >
                <p
                  className="
                    mb-3
                    font-sans
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    text-[#D0B27A]
                    sm:text-[11px]
                  "
                >
                  Realm 02
                </p>

                <h3
                  className="
                    max-w-[650px]
                    font-serif
                    text-[32px]
                    font-normal
                    leading-[0.98]
                    tracking-[-0.035em]
                    text-white
                    sm:text-[40px]
                    lg:text-[46px]
                    xl:text-[52px]
                  "
                >
                  Outdoor Living:
                  <br />
                  Verandas &amp; Estate Grounds
                </h3>
              </div>
            </div>

            {/* =================================================
                OUTDOOR CONTENT
            ================================================== */}

            <div
              className="
                px-6
                py-8
                sm:px-8
                sm:py-9
                lg:px-9
                lg:py-10
                xl:px-11
                xl:py-12
              "
            >
              <p
                className="
                  max-w-[760px]
                  font-sans
                  text-[16px]
                  font-medium
                  leading-[1.8]
                  tracking-[0.005em]
                  text-[#171512]/70
                  sm:text-[17px]
                  lg:text-[18px]
                "
              >
                Weather-resistant aged teak, marine-grade weaves,
                and organic stonework crafted to withstand the
                elements while elevating exterior architecture.
              </p>

              {/* OUTDOOR TAGS */}

              <div
                className="
                  mt-7
                  flex
                  flex-wrap
                  gap-2.5
                  sm:mt-8
                "
              >
                {outdoorTags.map((item) => (
                  <span
                    key={item}
                    className="
                      border
                      border-[#171512]/[0.08]
                      bg-[#F5F2EC]
                      px-4
                      py-2.5
                      font-sans
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.1em]
                      text-[#171512]/65
                      shadow-[0_4px_15px_rgba(35,30,25,0.025)]
                      transition-all
                      duration-300
                      hover:-translate-y-[1px]
                      hover:border-[#B88A2B]/25
                      hover:bg-white
                      hover:text-[#765A32]
                      hover:shadow-[0_8px_22px_rgba(35,30,25,0.06)]
                      sm:text-[11px]
                    "
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </div>

        {/* =====================================================
            BOTTOM SIGNATURE
        ====================================================== */}

        <div
          className="
            mt-12
            flex
            items-center
            justify-center
            gap-4
            sm:mt-14
            sm:gap-5
          "
        >
          <span
            className="
              h-px
              w-10
              bg-[#B88A2B]/30
              sm:w-16
            "
          />

          <p
            className="
              font-sans
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.25em]
              text-[#765A32]
              sm:text-[10px]
              sm:tracking-[0.28em]
            "
          >
            Two Expressions · One NIRA Philosophy
          </p>

          <span
            className="
              h-px
              w-10
              bg-[#B88A2B]/30
              sm:w-16
            "
          />
        </div>
      </div>
    </section>
  );
}