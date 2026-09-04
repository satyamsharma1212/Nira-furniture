"use client";

import { useState } from "react";
import { ArrowRight, Check, Upload } from "lucide-react";

type EnquiryFormProps = {
  selectedProduct?: string;
};

export default function EnquiryForm({
  selectedProduct = "",
}: EnquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    quantity: "1",
    message: "",
    product: selectedProduct,
  });

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    console.log("NIRA Enquiry:", form);

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex min-h-[430px] flex-col items-center justify-center text-center">

        <div className="flex h-16 w-16 items-center justify-center border border-[#B8860B]/30 bg-[#FAF8F2] text-[#B8860B]">
          <Check size={28} strokeWidth={1.4} />
        </div>

        <p className="mt-7 text-[9px] font-bold uppercase tracking-[0.25em] text-[#B8860B]">
          Enquiry Received
        </p>

        <h3 className="mt-3 font-serif text-3xl">
          Thank you.
        </h3>

        <p className="mt-4 max-w-md text-sm leading-6 text-[#756B5B]">
          Your enquiry has been received. Our team will
          review your requirements and get back to you
          shortly.
        </p>

        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-7 text-[9px] font-bold uppercase tracking-[0.18em] text-[#B8860B] hover:text-[#8A5F08]"
        >
          Submit another enquiry
        </button>

      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7"
    >
      {/* Product */}
      <Field
        label="Product / Requirement"
        required
      >
        <input
          required
          value={form.product}
          onChange={(event) =>
            updateField("product", event.target.value)
          }
          placeholder="Product name or furniture requirement"
          className={inputClass}
        />
      </Field>

      {/* Name + Phone */}
      <div className="grid gap-6 sm:grid-cols-2">

        <Field
          label="Your Name"
          required
        >
          <input
            required
            value={form.name}
            onChange={(event) =>
              updateField("name", event.target.value)
            }
            placeholder="Enter your name"
            className={inputClass}
          />
        </Field>

        <Field
          label="Phone Number"
          required
        >
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(event) =>
              updateField("phone", event.target.value)
            }
            placeholder="+91"
            className={inputClass}
          />
        </Field>

      </div>

      {/* Email + City */}
      <div className="grid gap-6 sm:grid-cols-2">

        <Field label="Email Address">
          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              updateField("email", event.target.value)
            }
            placeholder="you@example.com"
            className={inputClass}
          />
        </Field>

        <Field
          label="City"
          required
        >
          <input
            required
            value={form.city}
            onChange={(event) =>
              updateField("city", event.target.value)
            }
            placeholder="Your city"
            className={inputClass}
          />
        </Field>

      </div>

      {/* Quantity */}
      <Field
        label="Quantity"
        required
      >
        <select
          required
          value={form.quantity}
          onChange={(event) =>
            updateField("quantity", event.target.value)
          }
          className={inputClass}
        >
          <option value="1">1 Piece</option>
          <option value="2">2 Pieces</option>
          <option value="3">3 Pieces</option>
          <option value="4">4 Pieces</option>
          <option value="5">5 Pieces</option>
          <option value="10+">10+ Pieces</option>
        </select>
      </Field>

      {/* Message */}
      <Field
        label="Tell Us About Your Requirement"
        required
      >
        <textarea
          required
          value={form.message}
          onChange={(event) =>
            updateField("message", event.target.value)
          }
          placeholder="Tell us about dimensions, colour, fabric, quantity, project requirements or anything else..."
          rows={5}
          className={`${inputClass} resize-none py-3`}
        />
      </Field>

      {/* Reference image */}
      <div>
        <label className="mb-2 block text-[8px] font-bold uppercase tracking-[0.2em] text-[#40382E]">
          Reference Image
        </label>

        <label className="flex min-h-14 cursor-pointer items-center gap-3 border border-dashed border-[#B8860B]/25 bg-[#FAF8F2] px-4 text-[10px] text-[#8A8174] transition-colors hover:border-[#B8860B] hover:text-[#B8860B]">

          <Upload
            size={16}
            className="text-[#B8860B]"
          />

          <span>
            Upload inspiration or reference image
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
          />

        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="
          group
          flex
          min-h-14
          w-full
          items-center
          justify-center
          gap-3
          border
          border-[#B8860B]
          bg-[#B8860B]
          px-7
          text-[10px]
          font-bold
          uppercase
          tracking-[0.2em]
          text-white
          transition-all
          duration-300
          hover:border-[#241F18]
          hover:bg-[#241F18]
        "
      >
        Send Enquiry

        <ArrowRight
          size={15}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </button>

      <p className="text-center text-[9px] leading-5 text-[#8A8174]">
        By submitting this form, you agree to be contacted
        by the NIRA Furniture team regarding your enquiry.
      </p>
    </form>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[8px] font-bold uppercase tracking-[0.2em] text-[#40382E]">
        {label}

        {required && (
          <span className="ml-1 text-[#B8860B]">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

const inputClass = `
  h-12
  w-full
  border
  border-[#241F18]/10
  bg-[#FAF8F2]
  px-4
  text-sm
  text-[#241F18]
  outline-none
  transition-all
  duration-300
  placeholder:text-[#A39A8C]
  focus:border-[#B8860B]
  focus:bg-white
  focus:ring-1
  focus:ring-[#B8860B]/10
`;