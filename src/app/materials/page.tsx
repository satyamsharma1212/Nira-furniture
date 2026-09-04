import Image from "next/image";
import Link from "next/link";

const materials = [
  {
    number: "01",
    title: "Solid Wood",
    subtitle: "Warmth / Character / Time",
    image: "/material-wood.jpg",
    description:
      "Selected for its natural grain, warmth and enduring strength. Every timber carries its own subtle variations, making each piece naturally individual.",
    details: ["Natural grain", "Hand-finished", "Made to age beautifully"],
  },
  {
    number: "02",
    title: "Natural Stone",
    subtitle: "Texture / Depth / Permanence",
    image: "/material-stone.jpg",
    description:
      "Stone brings a quiet sense of permanence. Its organic movement, tonal variation and tactile surface create a distinctive character in every interior.",
    details: ["Unique veining", "Natural variation", "Refined surfaces"],
  },
  {
    number: "03",
    title: "Fabrics",
    subtitle: "Softness / Comfort / Tactility",
    image: "/material-fabric.jpg",
    description:
      "Our upholstery fabrics are chosen to balance visual softness with everyday comfort, allowing each piece to feel inviting and effortless.",
    details: ["Tactile finishes", "Premium upholstery", "Custom selections"],
  },
  {
    number: "04",
    title: "Metal",
    subtitle: "Structure / Detail / Precision",
    image: "/material-metal.jpg",
    description:
      "Used with restraint, metal introduces structure and definition. Carefully considered finishes complement the natural materials around them.",
    details: ["Refined finishes", "Precision detailing", "Custom options"],
  },
];

export default function MaterialsPage() {
  return (
    <main className="bg-[#F4F0E8] text-[#211E1A]">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative flex min-h-[92svh] items-end overflow-hidden">
        <Image
          src="/material-hero.jpg"
          alt="Natural materials in a refined interior"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-black/15" />

        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-[1500px] px-6 pb-14 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24">
          <div className="max-w-4xl text-white">
            <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.38em] text-white/75">
              Materials / Nira Furniture
            </p>

            <h1 className="font-serif text-6xl leading-[0.88] tracking-[-0.04em] sm:text-7xl lg:text-[9rem]">
              Material is
              <br />
              <span className="italic">where it begins.</span>
            </h1>

            <div className="mt-8 flex max-w-xl items-start gap-5">
              <span className="mt-2 h-px w-12 shrink-0 bg-white/60" />

              <p className="text-sm leading-7 text-white/80 sm:text-base">
                Natural textures, honest finishes and carefully selected
                materials come together to create furniture with a sense of
                permanence.
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 right-6 z-10 hidden sm:block lg:right-16">
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/60">
            Scroll to explore
          </span>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ====================================================== */}
      <section className="px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40">
        <div className="mx-auto grid max-w-[1250px] gap-14 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#927344]">
              Our material philosophy
            </p>
          </div>

          <div>
            <h2 className="max-w-5xl font-serif text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl lg:text-7xl">
              We choose materials for how they{" "}
              <span className="italic text-[#746D63]">
                feel, age and belong.
              </span>
            </h2>

            <p className="mt-10 max-w-2xl text-sm leading-7 text-[#69635B] sm:text-base">
              Furniture should not simply occupy a room. It should become part
              of it. That is why we look beyond appearance when selecting
              materials — considering texture, durability, natural variation
              and the way each surface changes with everyday life.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          MATERIAL COLLECTION
      ====================================================== */}
      <section className="border-t border-[#211E1A]/10">
        {materials.map((material, index) => (
          <article
            key={material.number}
            className="border-b border-[#211E1A]/10"
          >
            <div
              className={`mx-auto grid max-w-[1500px] ${
                index % 2 === 0
                  ? "lg:grid-cols-[1.15fr_0.85fr]"
                  : "lg:grid-cols-[0.85fr_1.15fr]"
              }`}
            >
              {/* Image */}
              <div
                className={`relative min-h-[500px] overflow-hidden sm:min-h-[650px] ${
                  index % 2 !== 0 ? "lg:order-2" : ""
                }`}
              >
                <Image
                  src={material.image}
                  alt={material.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.025]"
                />

                <div className="absolute left-6 top-6 sm:left-10 sm:top-10">
                  <span className="text-[10px] tracking-[0.3em] text-white/75">
                    {material.number}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div
                className={`flex items-center px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-28 ${
                  index % 2 !== 0 ? "lg:order-1" : ""
                }`}
              >
                <div className="max-w-xl">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#927344]">
                    {material.subtitle}
                  </p>

                  <h3 className="mt-5 font-serif text-5xl tracking-[-0.035em] sm:text-6xl lg:text-7xl">
                    {material.title}
                  </h3>

                  <div className="mt-8 h-px w-16 bg-[#927344]" />

                  <p className="mt-8 text-sm leading-7 text-[#69635B] sm:text-base">
                    {material.description}
                  </p>

                  <div className="mt-10 space-y-4 border-t border-[#211E1A]/10 pt-7">
                    {material.details.map((detail) => (
                      <div
                        key={detail}
                        className="flex items-center justify-between border-b border-[#211E1A]/10 pb-4"
                      >
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#746D63]">
                          {detail}
                        </span>

                        <span className="text-[#927344]">+</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* =====================================================
          CUSTOM FINISHES
      ====================================================== */}
      <section className="bg-[#E8E1D6] px-6 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-40">
        <div className="mx-auto grid max-w-[1250px] gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#927344]">
              Beyond the standard
            </p>

            <h2 className="mt-6 font-serif text-5xl leading-[0.95] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
              Make it
              <br />
              <span className="italic text-[#70685E]">your own.</span>
            </h2>

            <p className="mt-8 max-w-lg text-sm leading-7 text-[#69635B] sm:text-base">
              Every project has its own atmosphere. Choose from our material
              palette or work with our team to develop a finish specifically
              for your space.
            </p>

            <Link
              href="/contact"
              className="mt-9 inline-flex items-center gap-5 border-b border-[#927344] pb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#211E1A]"
            >
              Discuss your project
              <span>→</span>
            </Link>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/material-custom.jpg"
              alt="Custom furniture material finish"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          MADE IN INDIA
      ====================================================== */}
      <section className="bg-[#24211D] px-6 py-24 text-[#F4F0E8] sm:px-10 sm:py-32 lg:px-16 lg:py-40">
        <div className="mx-auto max-w-[1200px] text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#B89A62]">
            Craft / Material / Place
          </p>

          <h2 className="mx-auto mt-7 max-w-4xl font-serif text-5xl leading-[0.95] tracking-[-0.035em] sm:text-6xl lg:text-8xl">
            Made with materials
            <br />
            <span className="italic text-[#C9C0B3]">
              that tell a story.
            </span>
          </h2>

          <p className="mx-auto mt-9 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
            From the selection of raw materials to the final finish, every
            detail is considered with care. Our furniture is made to carry the
            character of its materials into the spaces it inhabits.
          </p>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="bg-[#F4F0E8] px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
        <div className="mx-auto max-w-[1100px] text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#927344]">
            Start a conversation
          </p>

          <h2 className="mt-6 font-serif text-5xl leading-[0.95] tracking-[-0.035em] sm:text-6xl lg:text-8xl">
            Have a space
            <br />
            <span className="italic text-[#746D63]">in mind?</span>
          </h2>

          <p className="mx-auto mt-8 max-w-xl text-sm leading-7 text-[#69635B]">
            Tell us about your project and we’ll help you find the right
            materials, finishes and furniture for it.
          </p>

          <Link
            href="/contact"
            className="mt-9 inline-flex items-center justify-center border border-[#211E1A] px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.28em] transition-all duration-300 hover:bg-[#211E1A] hover:text-[#F4F0E8]"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </main>
  );
}