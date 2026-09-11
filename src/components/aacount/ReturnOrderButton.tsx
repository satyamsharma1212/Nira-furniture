"use client";

import { useState } from "react";

import {
  CheckCircle2,
  Loader2,
  RotateCcw,
  X,
} from "lucide-react";

type ReturnRequest = {
  id: string;
  status: string;
  reason?: string | null;
  description?: string | null;
};

type Props = {
  orderId: string;
  orderNumber: string;
  orderStatus: string;
  existingRequest?: ReturnRequest | null;
};

const REASONS = [
  "Damaged product",
  "Wrong product received",
  "Quality issue",
  "Product not as expected",
  "Other",
];

export default function ReturnOrderButton({
  orderId,
  orderNumber,
  orderStatus,
  existingRequest,
}: Props) {
  const [open, setOpen] = useState(false);

  const [reason, setReason] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [request, setRequest] = useState<ReturnRequest | null>(
    existingRequest ?? null,
  );

  const canReturn =
    orderStatus === "shipped" ||
    orderStatus === "delivered";

  if (!canReturn) {
    return null;
  }

  if (
    request &&
    ["pending", "approved"].includes(request.status)
  ) {
    return (
      <div className="border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
          />

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-800">
              Return Requested
            </p>

            <p className="mt-2 text-sm leading-6 text-amber-900/70">
              Your return request for order #
              {orderNumber} is currently{" "}
              <span className="font-semibold">
                {request.status}
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  function openModal() {
    setError("");
    setOpen(true);
  }

  function closeModal() {
    if (loading) return;

    setOpen(false);
    setError("");
  }

  async function submitReturn() {
    if (!reason) {
      setError(
        "Please select a reason for the return.",
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/orders/return",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            reason,
            description,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to submit return request.",
        );
      }

      setRequest(data.request);

      setOpen(false);
      setReason("");
      setDescription("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* SMALL RETURN BUTTON */}
      <button
        type="button"
        onClick={openModal}
        className="
          inline-flex
          w-fit
          items-center
          justify-center
          gap-1.5
          border
          border-[#765A32]
          bg-white
          px-3
          py-1.5
          text-[9px]
          font-semibold
          uppercase
          tracking-[0.12em]
          text-[#765A32]
          transition
          hover:bg-[#765A32]
          hover:text-white
        "
      >
        <RotateCcw className="h-3 w-3" />
        Return Order
      </button>

      {open && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              closeModal();
            }
          }}
        >
          <div
            className="
              relative
              max-h-[90vh]
              w-full
              max-w-lg
              overflow-y-auto
              bg-[#F7F4EE]
              shadow-2xl
            "
          >
            {/* HEADER */}

            <div className="flex items-start justify-between border-b border-black/10 bg-white px-6 py-6 sm:px-8">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#765A32]">
                  NIRA Furniture
                </p>

                <h2 className="mt-2 font-serif text-3xl text-[#171512]">
                  Return Order
                </h2>

                <p className="mt-2 text-sm text-black/45">
                  Order #{orderNumber}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={loading}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  border
                  border-black/10
                  text-black/50
                  transition
                  hover:border-black/20
                  hover:text-black
                "
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* BODY */}

            <div className="space-y-6 p-6 sm:p-8">
              <div className="border border-[#765A32]/15 bg-[#FBF9F3] p-5">
                <p className="text-sm leading-6 text-black/60">
                  Please tell us why you
                  would like to return this
                  order. Our team will review
                  your request.
                </p>
              </div>

              {/* REASON */}

              <div>
                <label
                  htmlFor={`return-reason-${orderId}`}
                  className="
                    mb-2
                    block
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-black/45
                  "
                >
                  Reason for Return
                </label>

                <select
                  id={`return-reason-${orderId}`}
                  value={reason}
                  onChange={(event) =>
                    setReason(event.target.value)
                  }
                  disabled={loading}
                  className="
                    h-13
                    w-full
                    border
                    border-black/15
                    bg-white
                    px-4
                    text-sm
                    text-[#171512]
                    outline-none
                    transition
                    focus:border-[#765A32]
                  "
                >
                  <option value="">
                    Select a reason
                  </option>

                  {REASONS.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              {/* DESCRIPTION */}

              <div>
                <label
                  htmlFor={`return-description-${orderId}`}
                  className="
                    mb-2
                    block
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-black/45
                  "
                >
                  Additional Details
                  <span className="ml-1 font-normal normal-case tracking-normal text-black/30">
                    (Optional)
                  </span>
                </label>

                <textarea
                  id={`return-description-${orderId}`}
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  disabled={loading}
                  rows={5}
                  maxLength={1000}
                  placeholder="Please describe the issue with your order..."
                  className="
                    w-full
                    resize-none
                    border
                    border-black/15
                    bg-white
                    px-4
                    py-3
                    text-sm
                    leading-6
                    text-[#171512]
                    outline-none
                    placeholder:text-black/30
                    focus:border-[#765A32]
                  "
                />

                <p className="mt-2 text-right text-[10px] text-black/30">
                  {description.length}/1000
                </p>
              </div>

              {/* ERROR */}

              {error && (
                <div className="border border-red-200 bg-red-50 p-4">
                  <p className="text-sm leading-6 text-red-700">
                    {error}
                  </p>
                </div>
              )}

              {/* ACTIONS */}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="
                    flex-1
                    border
                    border-black/15
                    bg-white
                    px-6
                    py-4
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-[#171512]
                    transition
                    hover:border-[#765A32]
                    hover:text-[#765A32]
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={submitReturn}
                  disabled={
                    loading || !reason
                  }
                  className="
                    flex
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    bg-[#171512]
                    px-6
                    py-4
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-white
                    transition
                    hover:bg-[#765A32]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4" />
                      Submit Return
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}