import {
  BadgeCheck,
  Box,
  Ruler,
  Truck,
} from "lucide-react";

const pillars = [
  {
    icon: Ruler,
    title: "Bespoke Dimensional\nCustomization",
    description:
      "Tailored precisely to your residence's architectural blueprints, ceiling heights, and furnishing finishes.",
  },
  {
    icon: Box,
    title: "Material Swatch\nLibrary",
    description:
      "Delivered in a bespoke leather vanity case featuring hand-hewn stone chips, raw boucle cuts, and teak finishes.",
  },
  {
    icon: Truck,
    title: "White-Glove\nInstallation",
    description:
      "Uncrated, curated, leveled, and certified on-site by NIRA-accredited master technicians in 34 countries.",
  },
  {
    icon: BadgeCheck,
    title: "Lifetime Heritage\nWarranty",
    description:
      "Every piece is laser-inscribed with a unique provenance serial number registered in our Florence eastern archive.",
  },
];

export default function AtelierPillars() {
  return (
    <section
      className="
        w-full
        bg-[#F7F4EE]
        px-5
        py-28
        sm:px-8
        sm:py-32
        lg:px-12
        lg:py-36
        xl:px-16
        2xl:py-40
      "
    >
      <div className="mx-auto max-w-[1500px]">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div
          className="
            mb-16
            grid
            gap-10
            lg:mb-20
            lg:grid-cols-[1fr_500px]
            lg:items-end
            xl:gap-20
          "
        >

          {/* LEFT */}

          <div>
            <p
              className="
                mb-6
                font-sans
                text-[12px]
                font-medium
                uppercase
                tracking-[0.30em]
                text-[#765A32]
                sm:text-[13px]
              "
            >
              Uncompromising Devotion
            </p>

            <h2
              className="
                max-w-[1000px]
                font-serif
                text-[48px]
                font-normal
                leading-[0.92]
                tracking-[-0.045em]
                text-[#171512]
                sm:text-[58px]
                md:text-[68px]
                lg:text-[76px]
                xl:text-[84px]
              "
            >
              The Royal Atelier Pillars
            </h2>
          </div>

          {/* RIGHT */}

          <p
            className="
              max-w-[500px]
              font-sans
              text-[16px]
              font-medium
              leading-7
              tracking-[0.01em]
              text-[#171512]/70
              sm:text-[17px]
              sm:leading-8
              lg:mb-2
              lg:text-[18px]
            "
          >
            Every commission undergoes 140+ hours of hand-carving,
            joinery assembly, and quality verification before
            receiving its royal atelier wax stamp.
          </p>
        </div>

        {/* =====================================================
            PILLARS
        ====================================================== */}

        <div
          className="
            grid
            overflow-hidden
            border
            border-black/[0.055]
            bg-black/[0.055]
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;

            return (
              <article
                key={pillar.title}
                className={`
                  group
                  relative
                  min-h-[370px]
                  px-8
                  py-10
                  transition-all
                  duration-500
                  sm:min-h-[390px]
                  sm:px-9
                  sm:py-11
                  lg:min-h-[430px]
                  lg:px-10
                  lg:py-12
                  xl:min-h-[450px]
                  xl:px-11

                  ${
                    index % 4 === 0
                      ? "bg-white"
                      : index % 4 === 1
                      ? "bg-[#FBFAF7]"
                      : index % 4 === 2
                      ? "bg-[#F7F5F0]"
                      : "bg-[#F3F0E9]"
                  }

                  hover:-translate-y-[2px]
                  hover:shadow-[0_24px_60px_rgba(35,30,25,0.09)]
                `}
              >

                {/* =================================================
                    NUMBER
                ================================================== */}

                <div
                  className="
                    absolute
                    right-8
                    top-8
                    font-serif
                    text-[16px]
                    font-normal
                    tracking-[0.14em]
                    text-[#171512]/25
                    sm:right-9
                    sm:top-9
                  "
                >
                  0{index + 1}
                </div>

                {/* =================================================
                    ICON
                ================================================== */}

                <div
                  className="
                    mb-14
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    border
                    border-[#B88A2B]/20
                    bg-[#F4D8AD]/45
                    text-[#765A32]
                    shadow-[0_8px_24px_rgba(118,90,50,0.07)]
                    transition-all
                    duration-500
                    group-hover:-translate-y-1
                    group-hover:bg-[#F4D8AD]/65
                    group-hover:shadow-[0_14px_32px_rgba(118,90,50,0.12)]
                  "
                >
                  <Icon
                    size={31}
                    strokeWidth={1.1}
                  />
                </div>

                {/* =================================================
                    TITLE
                ================================================== */}

                <h3
                  className="
                    max-w-[300px]
                    whitespace-pre-line
                    font-serif
                    text-[28px]
                    font-normal
                    leading-[1.03]
                    tracking-[-0.025em]
                    text-[#171512]
                    sm:text-[30px]
                    lg:text-[31px]
                    xl:text-[33px]
                  "
                >
                  {pillar.title}
                </h3>

                {/* =================================================
                    DESCRIPTION
                ================================================== */}

                <p
                  className="
                    mt-6
                    max-w-[310px]
                    font-sans
                    text-[16px]
                    font-medium
                    leading-7
                    tracking-[0.005em]
                    text-[#171512]/70
                    sm:text-[17px]
                    sm:leading-8
                    lg:text-[18px]
                  "
                >
                  {pillar.description}
                </p>

                {/* =================================================
                    BOTTOM LINE
                ================================================== */}

                <div
                  className="
                    absolute
                    bottom-0
                    left-8
                    h-px
                    w-0
                    bg-[#B88A2B]/55
                    transition-all
                    duration-500
                    group-hover:w-[calc(100%-4rem)]
                    sm:left-9
                    group-hover:sm:w-[calc(100%-4.5rem)]
                    lg:left-10
                    group-hover:lg:w-[calc(100%-5rem)]
                  "
                />

              </article>
            );
          })}
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
            gap-5
          "
        >
          <span
            className="
              h-px
              w-12
              bg-[#B88A2B]/30
              sm:w-16
            "
          />

          <p
            className="
              font-sans
              text-[10px]
              font-medium
              uppercase
              tracking-[0.30em]
              text-[#765A32]
              sm:text-[11px]
            "
          >
            The NIRA Atelier Standard
          </p>

          <span
            className="
              h-px
              w-12
              bg-[#B88A2B]/30
              sm:w-16
            "
          />
        </div>

      </div>
    </section>
  );
}