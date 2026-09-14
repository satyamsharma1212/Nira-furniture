import Link from "next/link";

type Props = {
  itemCount: number;
  title?: string;
};

export default function CollectionsHero({
  itemCount,
  title = "Permanent Collections",
}: Props) {
  return (
    <section
      className="
        border-b
        border-[#171512]/10
        px-5
        pb-10
        pt-[145px]
        sm:px-7
        sm:pb-12
        sm:pt-[150px]
        md:pt-[155px]
        lg:px-9
        lg:pb-14
        lg:pt-[165px]
        xl:px-10
        xl:pt-[175px]
      "
    >
      <div className="mx-auto max-w-[1380px]">

        {/* Breadcrumb */}
        <div
          className="
            mb-7
            flex
            flex-wrap
            items-center
            gap-3
            text-[12px]
            font-medium
            uppercase
            tracking-[0.18em]
            text-[#171512]/45
            sm:mb-8
            sm:text-[13px]
          "
        >
          <Link
            href="/"
            className="transition-colors duration-300 hover:text-[#171512]"
          >
            Haute Living
          </Link>

          <span>/</span>

          <Link
            href="/collections"
            className="transition-colors duration-300 hover:text-[#171512]"
          >
            All Collections
          </Link>

          <span>/</span>

          <span className="text-[#765A32]">
            Curated Edition 2025
          </span>
        </div>

        {/* Main Hero */}
        <div
          className="
            grid
            gap-9
            lg:grid-cols-2
            lg:items-end
            lg:gap-12
            xl:gap-16
          "
        >
          {/* Left */}
          <div>

            {/* Eyebrow */}
            <p
              className="
                mb-5
                text-[12px]
                font-medium
                uppercase
                tracking-[0.25em]
                text-[#765A32]
                sm:text-[13px]
              "
            >
              Architectural Masterworks
            </p>

            {/* Heading */}
            <h1
              className="
                max-w-[900px]
                font-serif
                text-[50px]
                font-normal
                leading-[0.94]
                tracking-[-0.04em]
                sm:text-[58px]
                md:text-[68px]
                lg:text-[76px]
                xl:text-[84px]
              "
            >
              {title}
              <br />
              &amp; Haute Living
              <br className="sm:hidden" />
              Suites
            </h1>

            {/* Description */}
            <p
              className="
                mt-7
                max-w-[680px]
                text-[18px]
                leading-[1.7]
                text-[#171512]/55
                sm:mt-8
                sm:text-[19px]
                lg:text-[20px]
              "
            >
              Handcrafted furniture shaped by natural teak, honed travertine,
              premium fabrics and refined metalwork. Sculptural silhouettes
              conceived to bring grandeur, comfort and enduring character to
              sophisticated spaces.
            </p>
          </div>

          {/* Right */}
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-4
              lg:flex-col
              lg:items-end
              lg:gap-4
              lg:pb-3
            "
          >

            {/* Availability */}
            <div
              className="
                flex
                items-center
                gap-3
                rounded-full
                bg-[#EEEAE2]
                px-5
                py-3
              "
            >
              <span
                className="
                  h-2.5
                  w-2.5
                  animate-pulse
                  rounded-full
                  bg-[#765A32]
                "
              />

              <span
                className="
                  text-[15px]
                  font-medium
                  uppercase
                  tracking-[0.14em]
                  text-[#765A32]
                  sm:text-[13px]
                "
              >
                Atelier Guild Capacity: Available
              </span>
            </div>

            {/* Item Count */}
            <span
              className="
                whitespace-nowrap
                text-[14px]
                tracking-[0.07em]
                text-[#171512]/70
                sm:text-[13px]
              "
            >
              {itemCount} Bespoke Pieces
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}