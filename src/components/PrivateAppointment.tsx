"use client";

import { BriefcaseBusiness, ArrowRight, MapPin } from "lucide-react";
import { FormEvent } from "react";

const locations = [
  {
    city: "Surat",
    title: "NIRA Furniture — Surat",
    address:
      "Gali Number 6, RJD Textile Market, Ichhapor, Hazira Road, Surat, Gujarat 394510",
  },
  {
    city: "Mumbai",
    title: "NIRA Furniture — Mumbai",
    address:
      "B-2006, Omkareshwar, Rajendra Nagar, Borivali East, Mumbai, Maharashtra 400066",
  },
];

export default function PrivateAppointment() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const name = formData.get("name")?.toString().trim();
  const city = formData.get("city")?.toString().trim();
  const scope = formData.get("scope")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();

  if (!name || !city || !scope || !email || !phone) {
    alert("Please fill in all required fields.");
    return;
  }

  const whatsappMessage = `Hello NIRA Furniture,

I would like to request a private appointment.

*Customer Details*
Name: ${name}
City / Region: ${city}
Email: ${email}
Phone: ${phone}

*Project Details*
Project Scope: ${scope}

I look forward to hearing from your design team.

Thank you.`;

  const whatsappNumber = "918279416862";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  window.location.href = whatsappUrl;
}

  return (
    <section
      className="
        w-full
        overflow-hidden
        bg-[#211A15]
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
            MAIN GRID
        ====================================================== */}

        <div
          className="
            grid
            gap-14
            lg:grid-cols-[1.08fr_0.92fr]
            lg:items-center
            lg:gap-16
            xl:gap-20
          "
        >

          {/* =================================================
              LEFT — PRIVATE VIEWING
          ================================================== */}

          <div className="text-white">

            {/* =================================================
                EYEBROW
            ================================================== */}

            <div
              className="
                mb-7
                inline-flex
                items-center
                gap-2.5
                border
                border-[#D0B27A]/20
                bg-[#D0B27A]/[0.07]
                px-4
                py-2.5
              "
            >
              <BriefcaseBusiness
                size={14}
                strokeWidth={1.4}
                className="text-[#D0B27A]"
              />

              <span
                className="
                  font-sans
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-[#D0B27A]
                "
              >
                Private Salon &amp; Trade Bureau
              </span>
            </div>

            {/* =================================================
                HEADING
            ================================================== */}

            <h2
              className="
                max-w-[850px]
                font-serif
                text-[43px]
                font-normal
                leading-[0.98]
                tracking-[-0.035em]
                text-[#F8F5EF]
                sm:text-[54px]
                md:text-[64px]
                lg:text-[72px]
                xl:text-[82px]
              "
            >
              Schedule a Private
              <br />
              Viewing with an
              <br className="hidden sm:block" />
              {" "}Estate Designer
            </h2>

            {/* =================================================
                DESCRIPTION
            ================================================== */}

            <p
              className="
                mt-8
                max-w-[700px]
                font-sans
                text-[16px]
                font-medium
                leading-[1.85]
                tracking-[0.015em]
                text-white/70
                sm:text-[17px]
                lg:text-[18px]
                xl:text-[19px]
              "
            >
              Experience refined furniture, bespoke spatial consultations,
              and tactile material selections with the NIRA Furniture
              team at our Surat and Mumbai locations.
            </p>

            {/* =================================================
                LOCATIONS
            ================================================== */}

            <div
              className="
                mt-11
                grid
                gap-4
                sm:grid-cols-2
              "
            >
              {locations.map((location) => (
                <div
                  key={location.city}
                  className="
                    group
                    border
                    border-white/[0.07]
                    bg-white/[0.045]
                    p-5
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-[#D0B27A]/20
                    hover:bg-white/[0.075]
                  "
                >

                  {/* LOCATION HEADER */}

                  <div
                    className="
                      mb-4
                      flex
                      items-center
                      gap-2.5
                    "
                  >
                    <MapPin
                      size={15}
                      strokeWidth={1.3}
                      className="
                        shrink-0
                        text-[#D0B27A]
                      "
                    />

                    <p
                      className="
                        font-serif
                        text-[25px]
                        font-normal
                        leading-none
                        tracking-[-0.025em]
                        text-[#F8F5EF]
                      "
                    >
                      {location.city}
                    </p>
                  </div>

                  {/* LOCATION TITLE */}

                  <p
                    className="
                      mb-2
                      font-sans
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.15em]
                      text-[#D0B27A]/80
                    "
                  >
                    {location.title}
                  </p>

                  {/* ADDRESS */}

                  <p
                    className="
                      font-sans
                      text-[13px]
                      font-medium
                      leading-[1.75]
                      tracking-[0.005em]
                      text-white/60
                      sm:text-[14px]
                    "
                  >
                    {location.address}
                  </p>

                </div>
              ))}
            </div>

            {/* =================================================
                LOCATION NOTE
            ================================================== */}

            <div
              className="
                mt-6
                flex
                items-start
                gap-3
                border-l
                border-[#D0B27A]/30
                pl-4
              "
            >
              <p
                className="
                  max-w-[620px]
                  font-sans
                  text-[13px]
                  font-medium
                  leading-[1.75]
                  tracking-[0.01em]
                  text-white/50
                  sm:text-[14px]
                "
              >
                Private consultations are available by appointment.
                Our team can assist with furniture selections,
                residential projects, hospitality spaces, and
                bespoke interior requirements.
              </p>
            </div>

          </div>

          {/* =================================================
              RIGHT — APPOINTMENT FORM
          ================================================== */}

          <div
            className="
              bg-[#F7F5F0]
              p-6
              shadow-[0_25px_80px_rgba(0,0,0,0.12)]
              sm:p-9
              lg:p-10
              xl:p-12
            "
          >

            {/* =================================================
                FORM HEADER
            ================================================== */}

            <div className="mb-8">

              <p
                className="
                  mb-3
                  font-sans
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-[#8B7352]
                "
              >
                By Private Invitation
              </p>

              <h3
                className="
                  max-w-[500px]
                  font-serif
                  text-[32px]
                  font-normal
                  leading-[1.04]
                  tracking-[-0.035em]
                  text-[#171512]
                  sm:text-[37px]
                  lg:text-[42px]
                "
              >
                Private Appointment
                <br />
                Request
              </h3>

              <p
                className="
                  mt-4
                  max-w-[470px]
                  font-sans
                  text-[15px]
                  font-medium
                  leading-[1.8]
                  tracking-[0.005em]
                  text-[#171512]/65
                  sm:text-[16px]
                  lg:text-[17px]
                "
              >
                Share your requirements with our design team.
                A concierge advisor will respond within 4 hours.
              </p>

            </div>

            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* =================================================
                  FULL NAME
              ================================================== */}

              <div>
                <label
                  htmlFor="full-name"
                  className="
                    mb-2.5
                    block
                    font-sans
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.20em]
                    text-[#171512]/65
                  "
                >
                  Your Full Name
                </label>

                <input
                  id="full-name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  required
                  className="
                    h-13
                    w-full
                    border
                    border-[#171512]/[0.08]
                    bg-[#ECEAE4]
                    px-4
                    font-sans
                    text-[14px]
                    font-medium
                    tracking-[0.01em]
                    text-[#171512]
                    outline-none
                    placeholder:text-[#171512]/35
                    transition-all
                    duration-300
                    focus:border-[#8B7352]/50
                    focus:bg-white
                    focus:shadow-[0_5px_20px_rgba(0,0,0,0.04)]
                  "
                />
              </div>

              {/* =================================================
                  CITY + SCOPE
              ================================================== */}

              <div className="grid gap-5 sm:grid-cols-2">

                {/* CITY */}

                <div>
                  <label
                    htmlFor="city"
                    className="
                      mb-2.5
                      block
                      font-sans
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.20em]
                      text-[#171512]/65
                    "
                  >
                    City / Region
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Surat / Mumbai"
                    required
                    className="
                      h-13
                      w-full
                      border
                      border-[#171512]/[0.08]
                      bg-[#ECEAE4]
                      px-4
                      font-sans
                      text-[14px]
                      font-medium
                      tracking-[0.01em]
                      text-[#171512]
                      outline-none
                      placeholder:text-[#171512]/35
                      transition-all
                      duration-300
                      focus:border-[#8B7352]/50
                      focus:bg-white
                      focus:shadow-[0_5px_20px_rgba(0,0,0,0.04)]
                    "
                  />
                </div>

                {/* PROJECT SCOPE */}

                <div>
                  <label
                    htmlFor="scope"
                    className="
                      mb-2.5
                      block
                      font-sans
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.20em]
                      text-[#171512]/65
                    "
                  >
                    Project Scope
                  </label>

                  <input
                    id="scope"
                    name="scope"
                    type="text"
                    placeholder="Residential / Commercial"
                    required
                    className="
                      h-13
                      w-full
                      border
                      border-[#171512]/[0.08]
                      bg-[#ECEAE4]
                      px-4
                      font-sans
                      text-[14px]
                      font-medium
                      tracking-[0.01em]
                      text-[#171512]
                      outline-none
                      placeholder:text-[#171512]/35
                      transition-all
                      duration-300
                      focus:border-[#8B7352]/50
                      focus:bg-white
                      focus:shadow-[0_5px_20px_rgba(0,0,0,0.04)]
                    "
                  />
                </div>

              </div>

              {/* =================================================
                  EMAIL
              ================================================== */}

              <div>
                <label
                  htmlFor="email"
                  className="
                    mb-2.5
                    block
                    font-sans
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.20em]
                    text-[#171512]/65
                  "
                >
                  Private Correspondence Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@domain.com"
                  required
                  className="
                    h-13
                    w-full
                    border
                    border-[#171512]/[0.08]
                    bg-[#ECEAE4]
                    px-4
                    font-sans
                    text-[14px]
                    font-medium
                    tracking-[0.01em]
                    text-[#171512]
                    outline-none
                    placeholder:text-[#171512]/35
                    transition-all
                    duration-300
                    focus:border-[#8B7352]/50
                    focus:bg-white
                    focus:shadow-[0_5px_20px_rgba(0,0,0,0.04)]
                  "
                />
              </div>

              {/* =================================================
                  PHONE
              ================================================== */}

              <div>
                <label
                  htmlFor="phone"
                  className="
                    mb-2.5
                    block
                    font-sans
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.20em]
                    text-[#171512]/65
                  "
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  required
                  className="
                    h-13
                    w-full
                    border
                    border-[#171512]/[0.08]
                    bg-[#ECEAE4]
                    px-4
                    font-sans
                    text-[14px]
                    font-medium
                    tracking-[0.01em]
                    text-[#171512]
                    outline-none
                    placeholder:text-[#171512]/35
                    transition-all
                    duration-300
                    focus:border-[#8B7352]/50
                    focus:bg-white
                    focus:shadow-[0_5px_20px_rgba(0,0,0,0.04)]
                  "
                />
              </div>

              {/* =================================================
                  SUBMIT
              ================================================== */}

           <button
  type="submit"
  className="
    group
    flex
    h-14
    w-full
    items-center
    justify-center
    gap-3
    bg-[#171512]
    px-5
    font-sans
    text-[10px]
    font-semibold
    uppercase
    tracking-[0.21em]
    text-white
    transition-all
    duration-300
    hover:bg-[#765A32]
    hover:tracking-[0.24em]
  "
>
  Request Exclusive Invitation

  <ArrowRight
    size={14}
    strokeWidth={1.2}
    className="
      transition-transform
      duration-300
      group-hover:translate-x-1
    "
  />
</button>

              {/* PRIVACY */}

              <p
                className="
                  text-center
                  font-sans
                  text-[11px]
                  font-medium
                  leading-[1.6]
                  tracking-[0.01em]
                  text-[#171512]/45
                  sm:text-[12px]
                "
              >
                Your information is kept private and used only
                for responding to your enquiry.
              </p>

            </form>
          </div>
        </div>

        {/* =================================================
            BOTTOM DETAIL
        ================================================== */}

        <div
          className="
            mt-14
            flex
            items-center
            justify-center
            gap-3
            text-center
            sm:mt-16
          "
        >
          <span
            className="
              h-px
              w-8
              bg-[#B9AA95]/50
              sm:w-12
            "
          />

          <p
            className="
              font-sans
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.25em]
              text-[#D0B27A]/70
            "
          >
            Crafted for Distinguished Living
          </p>

          <span
            className="
              h-px
              w-8
              bg-[#B9AA95]/50
              sm:w-12
            "
          />
        </div>

      </div>
    </section>
  );
}