import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F4F0E8] text-[#171512]">

      {/* ===================================================== */}
      {/* HERO                                                  */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden bg-[#E7DFD3] px-6 pb-20 pt-36 sm:px-10 lg:px-16 lg:pb-28 lg:pt-44">

        <div className="mx-auto max-w-[1480px]">

          <div className="mb-7 flex items-center gap-4">
            <span className="h-px w-12 bg-[#927344]" />

            <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-[#725D3D]">
              Get in touch
            </span>
          </div>

          <h1
            className="
              max-w-[1000px]
              font-serif
              text-[58px]
              font-normal
              leading-[0.88]
              tracking-[-0.06em]
              sm:text-[76px]
              md:text-[92px]
              lg:text-[110px]
            "
          >
            Let's create a space
            <br />
            <span className="italic">worth living in.</span>
          </h1>

          <p className="mt-8 max-w-[520px] text-[13px] leading-7 text-[#171512]/60 sm:text-[14px]">
            Whether you're furnishing a home, hospitality space or
            commercial project, we'd love to hear about what you're
            creating.
          </p>

        </div>

      </section>


      {/* ===================================================== */}
      {/* CONTACT CONTENT                                       */}
      {/* ===================================================== */}

      <section className="px-6 py-20 sm:px-10 sm:py-28 lg:px-16 lg:py-36">

        <div className="mx-auto grid max-w-[1480px] gap-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">

          {/* ================================================= */}
          {/* CONTACT DETAILS                                   */}
          {/* ================================================= */}

          <div>

            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#927344]">
              Contact Nira
            </p>

            <h2
              className="
                mt-5
                max-w-[420px]
                font-serif
                text-[42px]
                font-normal
                leading-[0.95]
                tracking-[-0.045em]
                sm:text-[52px]
              "
            >
              We'd be happy
              <br />
              to hear from you.
            </h2>


            <div className="mt-12 space-y-8">

              {/* Email */}

              <ContactItem
                icon={<Mail size={17} strokeWidth={1} />}
                label="Email"
                value="hello@nirafurniture.com"
                href="mailto:hello@nirafurniture.com"
              />

              {/* Phone */}

              <ContactItem
                icon={<Phone size={17} strokeWidth={1} />}
                label="Phone"
                value="+91 00000 00000"
                href="tel:+910000000000"
              />

              {/* Location */}

              <ContactItem
                icon={<MapPin size={17} strokeWidth={1} />}
                label="Studio"
                value="India"
              />

            </div>


            {/* Business */}

            <div className="mt-14 border-t border-[#171512]/10 pt-7">

              <p className="text-[8px] uppercase tracking-[0.2em] text-[#171512]/40">
                Business & Projects
              </p>

              <p className="mt-3 max-w-[350px] text-[12px] leading-6 text-[#171512]/55">
                For hospitality, commercial, architectural and
                large-scale furniture requirements, contact our
                projects team.
              </p>

            </div>

          </div>


          {/* ================================================= */}
          {/* FORM                                              */}
          {/* ================================================= */}

          <div className="bg-[#E8E1D6] p-7 sm:p-10 lg:p-14">

            <div className="mb-10">

              <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#927344]">
                Send an enquiry
              </p>

              <h3
                className="
                  mt-4
                  font-serif
                  text-[38px]
                  tracking-[-0.04em]
                  sm:text-[46px]
                "
              >
                Tell us about
                <br />
                your project.
              </h3>

            </div>


            <form className="space-y-8">

              {/* Name */}

              <div className="relative">

                <label
                  htmlFor="name"
                  className="
                    mb-2
                    block
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-[#171512]/50
                  "
                >
                  Your Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className="
                    w-full
                    border-b
                    border-[#171512]/20
                    bg-transparent
                    pb-3
                    text-[13px]
                    outline-none
                    placeholder:text-[#171512]/25
                    focus:border-[#927344]
                  "
                />

              </div>


              {/* Email */}

              <div>

                <label
                  htmlFor="email"
                  className="
                    mb-2
                    block
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-[#171512]/50
                  "
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="
                    w-full
                    border-b
                    border-[#171512]/20
                    bg-transparent
                    pb-3
                    text-[13px]
                    outline-none
                    placeholder:text-[#171512]/25
                    focus:border-[#927344]
                  "
                />

              </div>


              {/* Phone */}

              <div>

                <label
                  htmlFor="phone"
                  className="
                    mb-2
                    block
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-[#171512]/50
                  "
                >
                  Phone
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="
                    w-full
                    border-b
                    border-[#171512]/20
                    bg-transparent
                    pb-3
                    text-[13px]
                    outline-none
                    placeholder:text-[#171512]/25
                    focus:border-[#927344]
                  "
                />

              </div>


              {/* Project Type */}

              <div>

                <label
                  htmlFor="project"
                  className="
                    mb-2
                    block
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-[#171512]/50
                  "
                >
                  Project Type
                </label>

                <select
                  id="project"
                  name="project"
                  defaultValue=""
                  className="
                    w-full
                    border-b
                    border-[#171512]/20
                    bg-transparent
                    pb-3
                    text-[13px]
                    text-[#171512]
                    outline-none
                    focus:border-[#927344]
                  "
                >
                  <option value="" disabled>
                    Select project type
                  </option>

                  <option value="residential">
                    Residential
                  </option>

                  <option value="hospitality">
                    Hospitality
                  </option>

                  <option value="commercial">
                    Commercial
                  </option>

                  <option value="architect">
                    Architect / Interior Designer
                  </option>

                  <option value="custom">
                    Custom Furniture
                  </option>

                </select>

              </div>


              {/* Message */}

              <div>

                <label
                  htmlFor="message"
                  className="
                    mb-2
                    block
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-[#171512]/50
                  "
                >
                  Your Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us about your requirements..."
                  className="
                    w-full
                    resize-none
                    border-b
                    border-[#171512]/20
                    bg-transparent
                    pb-3
                    text-[13px]
                    leading-6
                    outline-none
                    placeholder:text-[#171512]/25
                    focus:border-[#927344]
                  "
                />

              </div>


              {/* Submit */}

              <button
                type="submit"
                className="
                  group
                  mt-2
                  inline-flex
                  h-12
                  items-center
                  gap-4
                  bg-[#171512]
                  px-7
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-white
                  transition-all
                  duration-300
                  hover:bg-[#302C27]
                "
              >
                Send Enquiry

                <ArrowRight
                  size={14}
                  strokeWidth={1}
                  className="transition-transform duration-500 group-hover:translate-x-1"
                />
              </button>

            </form>

          </div>

        </div>

      </section>


      {/* ===================================================== */}
      {/* PROJECT ENQUIRY CTA                                   */}
      {/* ===================================================== */}

      <section className="bg-[#171512] px-6 py-24 text-[#F4F0E8] sm:px-10 lg:px-16 lg:py-32">

        <div className="mx-auto max-w-[1480px]">

          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">

            <div>

              <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#B89A62]">
                Architects · Designers · Hospitality
              </p>

              <h2
                className="
                  mt-5
                  max-w-[850px]
                  font-serif
                  text-[46px]
                  leading-[0.94]
                  tracking-[-0.05em]
                  sm:text-[62px]
                  lg:text-[78px]
                "
              >
                Building something
                <br />
                <span className="italic">
                  exceptional?
                </span>
              </h2>

            </div>

            <Link
              href="mailto:hello@nirafurniture.com"
              className="
                group
                inline-flex
                w-fit
                items-center
                gap-4
                border-b
                border-[#F4F0E8]/40
                pb-3
                text-[9px]
                uppercase
                tracking-[0.2em]
                transition-colors
                hover:border-[#F4F0E8]
              "
            >
              Talk to our team

              <ArrowRight
                size={14}
                strokeWidth={1}
                className="transition-transform duration-500 group-hover:translate-x-1"
              />
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}


/* ========================================================= */
/* CONTACT ITEM                                              */
/* ========================================================= */

function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-4">

      <div className="mt-1 text-[#927344]">
        {icon}
      </div>

      <div>

        <p className="text-[8px] font-medium uppercase tracking-[0.2em] text-[#171512]/40">
          {label}
        </p>

        <p className="mt-2 text-[13px] text-[#171512]/75">
          {value}
        </p>

      </div>

    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block transition-opacity duration-300 hover:opacity-60"
      >
        {content}
      </Link>
    );
  }

  return content;
}