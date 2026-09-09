"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Clock3,
} from "lucide-react";

export default function ContactPage() {
  const [projectOpen, setProjectOpen] = useState(false);
  const [projectType, setProjectType] = useState("");

  const projectOptions = [
    "Residential",
    "Hospitality",
    "Commercial",
    "Architect / Interior Designer",
    "Custom Furniture",
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F4EE] text-[#171512]">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative border-b border-[#171512]/10 bg-[#E9E2D7] px-5 pb-20 pt-32 sm:px-8 sm:pb-24 sm:pt-40 lg:px-12 lg:pb-32 lg:pt-44 xl:px-16">

        {/* Decorative circles */}

        <div className="pointer-events-none absolute -right-24 top-20 h-[280px] w-[280px] rounded-full border border-[#765A32]/10 sm:h-[420px] sm:w-[420px]" />

        <div className="pointer-events-none absolute -right-12 top-32 h-[180px] w-[180px] rounded-full border border-[#765A32]/10 sm:h-[280px] sm:w-[280px]" />

        <div className="relative mx-auto max-w-[1480px]">

          {/* EYEBROW */}

          <div className="mb-7 flex items-center gap-4">
            <span className="h-px w-14 bg-[#927344]" />

            <span className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-[#725D3D] sm:text-[12px]">
              Get in touch
            </span>
          </div>

          {/* HEADING */}

          <h1 className="max-w-[1050px] font-serif text-[58px] font-medium leading-[0.9] tracking-[-0.045em] text-[#171512] sm:text-[76px] md:text-[92px] lg:text-[112px] xl:text-[124px]">
            Let&apos;s create a space
            <br />

            <span className="italic text-[#765A32]">
              worth living in.
            </span>
          </h1>

          {/* DESCRIPTION */}

          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            <p className="max-w-[600px] font-sans text-[17px] font-medium leading-[1.8] tracking-[0.005em] text-[#171512]/60 sm:text-[18px]">
              Whether you&apos;re furnishing a home, hospitality space, or
              commercial project, we&apos;d love to hear about what you&apos;re
              creating.
            </p>

            <div className="hidden lg:block">
              <p className="font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-[#171512]/35">
                NIRA Furniture
              </p>

              <p className="mt-2 font-serif text-[22px] italic text-[#765A32]">
                Thoughtfully made.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          CONTACT CONTENT
      ===================================================== */}

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-36 xl:px-16">

        <div className="mx-auto grid max-w-[1480px] gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20 xl:gap-28">

          {/* =================================================
              LEFT — CONTACT DETAILS
          ================================================= */}

          <div>

            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-[#927344]">
              Contact NIRA
            </p>

            <h2 className="mt-5 max-w-[500px] font-serif text-[46px] font-medium leading-[0.92] tracking-[-0.035em] text-[#171512] sm:text-[56px] lg:text-[62px]">
              We&apos;d be happy
              <br />

              <span className="italic text-[#765A32]">
                to hear from you.
              </span>
            </h2>

            <p className="mt-7 max-w-[470px] font-sans text-[16px] font-medium leading-[1.85] tracking-[0.005em] text-[#171512]/55 sm:text-[17px]">
              Speak with our team about furniture selections, custom
              requirements, hospitality projects, or interior collaborations.
            </p>


            {/* CONTACT ITEMS */}

            <div className="mt-12 divide-y divide-[#171512]/10 border-y border-[#171512]/10">

              <ContactItem
                icon={<Mail size={19} strokeWidth={1.2} />}
                label="Email"
                value="hello@nirafurniture.com"
                href="mailto:hello@nirafurniture.com"
              />

              <ContactItem
                icon={<Phone size={19} strokeWidth={1.2} />}
                label="Phone"
                value="+91 00000 00000"
                href="tel:+910000000000"
              />

              <ContactItem
                icon={<MapPin size={19} strokeWidth={1.2} />}
                label="Studio"
                value="India"
              />

              <ContactItem
                icon={<Clock3 size={19} strokeWidth={1.2} />}
                label="Studio Hours"
                value="Mon — Sat · 10:00 — 18:00"
              />

            </div>


            {/* PROJECT INFO */}

            <div className="mt-12 rounded-[7px] border border-[#171512]/10 bg-[#EEE8DE] p-6 sm:p-7">

              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[#765A32]">
                Business & Projects
              </p>

              <p className="mt-4 max-w-[430px] font-sans text-[15px] font-medium leading-[1.85] tracking-[0.005em] text-[#171512]/55">
                For hospitality, commercial, architectural and large-scale
                furniture requirements, contact our projects team directly.
              </p>

              <Link
                href="mailto:hello@nirafurniture.com"
                className="group mt-6 inline-flex items-center gap-3 border-b border-[#171512]/20 pb-2 font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-[#171512] transition-colors duration-300 hover:border-[#765A32] hover:text-[#765A32]"
              >
                Projects Enquiry

                <ArrowRight
                  size={15}
                  strokeWidth={1.2}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

            </div>

          </div>


          {/* =================================================
              RIGHT — FORM
          ================================================= */}

          <div className="rounded-[8px] bg-[#E8E1D6] p-6 sm:p-10 lg:p-14 xl:p-16">

            {/* FORM HEADER */}

            <div className="mb-10">

              <div className="flex items-center justify-between">

                <p className="font-sans text-[11px] font-medium uppercase tracking-[0.24em] text-[#927344]">
                  Send an enquiry
                </p>

                <span className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-[#171512]/30">
                  01 / Enquiry
                </span>

              </div>

              <h3 className="mt-5 font-serif text-[46px] font-medium leading-[0.92] tracking-[-0.035em] text-[#171512] sm:text-[56px] lg:text-[62px]">
                Tell us about
                <br />

                <span className="italic text-[#765A32]">
                  your project.
                </span>
              </h3>

              <p className="mt-6 max-w-[560px] font-sans text-[17px] font-medium leading-[1.8] tracking-[0.005em] text-[#171512]/55 sm:text-[18px]">
                Share the vision for your space with us. Our team will guide
                you with considered recommendations, tailored to your style,
                space, and needs.
              </p>

            </div>


            {/* FORM */}

          <form className="space-y-6">

  {/* NAME */}

  <FormField
    label="Your Name"
    id="name"
    name="name"
    type="text"
    placeholder="Enter your name"
  />


  {/* EMAIL */}

  <FormField
    label="Email Address"
    id="email"
    name="email"
    type="email"
    placeholder="Enter your email"
  />


  {/* PHONE */}

  <FormField
    label="Phone Number"
    id="phone"
    name="phone"
    type="tel"
    placeholder="Enter your phone number"
  />


  {/* =================================================
      PROJECT TYPE — CUSTOM DROPDOWN
  ================================================= */}

  <div className="relative">

    <button
      type="button"
      aria-haspopup="listbox"
      aria-expanded={projectOpen}
      onClick={() => setProjectOpen((prev) => !prev)}
      className={`group w-full rounded-[7px] border px-5 py-4.5 text-left transition-all duration-300 focus:outline-none ${
        projectOpen
          ? "border-[#927344] bg-[#F7F4EE]"
          : "border-[#171512]/10 bg-[#F7F4EE]/60 hover:border-[#171512]/20"
      }`}
    >

      {/* Label */}

      <span className="block font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[#171512]/45">
        Project Type
      </span>


      {/* Value */}

      <div className="mt-2.5 flex items-center justify-between gap-4">

        <span
          className={`font-sans text-[18px] leading-8 tracking-[0.005em] ${
            projectType
              ? "font-medium text-[#171512]"
              : "font-medium text-[#171512]/35"
          }`}
        >
          {projectType || "Select project type"}
        </span>


        {/* Chevron */}

        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            projectOpen
              ? "rotate-180 border-[#765A32]/40 bg-[#E8E0D3] text-[#765A32]"
              : "border-[#765A32]/15 bg-[#EEE8DE] text-[#765A32]"
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              d="M6 9l6 6 6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

      </div>

    </button>


    {/* =================================================
        DROPDOWN MENU
    ================================================= */}

    <div
      role="listbox"
      aria-hidden={!projectOpen}
      className={`absolute left-0 right-0 top-full z-50 mt-2 origin-top overflow-hidden rounded-[8px] border border-[#171512]/10 bg-[#F7F4EE] shadow-[0_20px_50px_rgba(23,21,18,0.12)] transition-all duration-200 ${
        projectOpen
          ? "visible translate-y-0 scale-100 opacity-100"
          : "invisible -translate-y-2 scale-[0.98] opacity-0"
      }`}
    >

      {/* Dropdown header */}

      <div className="border-b border-[#171512]/10 px-5 py-4">
        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#171512]/35">
          Select an option
        </p>
      </div>


      {/* Options */}

      <div className="p-2">

        {projectOptions.map((option) => {

          const selected = projectType === option;

          return (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => {
                setProjectType(option);
                setProjectOpen(false);
              }}
              className={`group/option flex w-full items-center justify-between rounded-[6px] px-4 py-4 text-left transition-all duration-200 ${
                selected
                  ? "bg-[#E8E0D3] text-[#765A32]"
                  : "text-[#171512]/75 hover:bg-[#EEE8DE] hover:text-[#171512]"
              }`}
            >

              <span className="font-sans text-[16px] font-medium leading-7 tracking-[0.005em]">
                {option}
              </span>

              {selected && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="shrink-0 text-[#765A32]"
                >
                  <path
                    d="M5 12.5l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}

            </button>
          );
        })}

      </div>

    </div>


    {/* Hidden field for form submission */}

    <input
      type="hidden"
      name="project"
      value={projectType}
    />

  </div>


  {/* MESSAGE */}

  <div className="rounded-[7px] border border-[#171512]/10 bg-[#F7F4EE]/50 px-5 py-4.5 transition-all duration-300 focus-within:border-[#927344] focus-within:bg-[#F7F4EE]/80">

    <label
      htmlFor="message"
      className="block font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-[#171512]/50"
    >
      Your Message
    </label>

    <textarea
      id="message"
      name="message"
      rows={6}
      placeholder="Tell us about your requirements..."
      className="mt-3 w-full resize-none bg-transparent font-sans text-[17px] font-medium leading-8 tracking-[0.005em] text-[#171512] outline-none placeholder:text-[#171512]/30"
    />

  </div>


  {/* SUBMIT */}

  <button
    type="submit"
    className="
      group
      mt-3
      flex
      h-16
      w-full
      items-center
      justify-center
      gap-4
      rounded-[5px]
      bg-[#171512]
      px-7
      font-sans
      text-[13px]
      font-medium
      uppercase
      tracking-[0.2em]
      text-white
      transition-all
      duration-300
      hover:bg-[#765A32]
    "
  >
    Send Enquiry

    <ArrowRight
      size={18}
      strokeWidth={1.2}
      className="transition-transform duration-500 group-hover:translate-x-1.5"
    />
  </button>


  {/* DISCLAIMER */}

  <p className="pt-1 text-center font-sans text-[12px] font-medium leading-6 tracking-[0.005em] text-[#171512]/35">
    By submitting this form, you agree to be contacted by the
    NIRA Furniture team regarding your enquiry.
  </p>

</form>

          </div>

        </div>

      </section>


      {/* =====================================================
          PROJECT CTA
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#171512] px-5 py-24 text-[#F4F0E8] sm:px-8 sm:py-32 lg:px-12 lg:py-40 xl:px-16">

        {/* Decorative circles */}

        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-white/10" />

        <div className="pointer-events-none absolute -right-20 -top-20 h-[340px] w-[340px] rounded-full border border-white/10" />

        <div className="relative mx-auto max-w-[1480px]">

          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">

            <div>

              <p className="font-sans text-[10px] font-medium uppercase tracking-[0.25em] text-[#B89A62] sm:text-[11px]">
                Architects · Designers · Hospitality
              </p>

              <h2 className="mt-6 max-w-[900px] font-serif text-[52px] font-medium leading-[0.92] tracking-[-0.045em] sm:text-[68px] lg:text-[86px] xl:text-[100px]">
                Building something
                <br />

                <span className="italic text-[#C4A874]">
                  exceptional?
                </span>
              </h2>

            </div>


            {/* CTA */}

            <Link
              href="mailto:hello@nirafurniture.com"
              className="
                group
                flex
                w-fit
                items-center
                gap-5
                border-b
                border-[#F4F0E8]/30
                pb-3
                font-sans
                text-[12px]
                font-medium
                uppercase
                tracking-[0.2em]
                transition-all
                duration-300
                hover:border-[#F4F0E8]
              "
            >
              Talk to our team

              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-all duration-300 group-hover:bg-white group-hover:text-[#171512]">

                <ArrowRight
                  size={15}
                  strokeWidth={1.2}
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                />

              </span>

            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}


/* =========================================================
   CONTACT ITEM
========================================================= */

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
    <div className="flex items-center gap-5 py-5 sm:py-6">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#765A32]/15 bg-[#EEE8DE] text-[#927344]">
        {icon}
      </div>

      <div>

        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-[#171512]/40">
          {label}
        </p>

        <p className="mt-1.5 font-sans text-[16px] font-medium leading-7 tracking-[0.005em] text-[#171512]/75 sm:text-[17px]">
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


/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  id,
  name,
  type,
  placeholder,
}: {
  label: string;
  id: string;
  name: string;
  type: string;
  placeholder: string;
}) {
  return (
    <div className="rounded-[7px] border border-[#171512]/10 bg-[#F7F4EE]/50 px-5 py-4.5 transition-all duration-300 focus-within:border-[#927344] focus-within:bg-[#F7F4EE]/80">

      <label
        htmlFor={id}
        className="block font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-[#171512]/50"
      >
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent font-sans text-[17px] font-medium leading-8 tracking-[0.005em] text-[#171512] outline-none placeholder:text-[#171512]/30"
      />

    </div>
  );
}