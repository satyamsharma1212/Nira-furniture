"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Check,
  Package,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();

  const [orderId, setOrderId] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [paymentId, setPaymentId] = useState("");

  useEffect(() => {
    setOrderId(
      searchParams.get("order_id") || "",
    );

    setOrderNumber(
      searchParams.get("order_number") || "",
    );

    setPaymentId(
      searchParams.get("payment_id") || "",
    );
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-[#FAF8F2] text-[#241F18]">

      {/* HEADER */}

      <header className="border-b border-[#241F18]/10 bg-[#FAF8F2]">

        <div className="mx-auto flex min-h-[82px] max-w-[1480px] items-center justify-center px-6">

          <Link
            href="/"
            className="font-serif text-3xl font-semibold tracking-[0.18em]"
          >
            NIRA
          </Link>

        </div>

      </header>

      {/* SUCCESS */}

      <section className="mx-auto flex min-h-[calc(100vh-82px)] max-w-3xl items-center justify-center px-6 py-16">

        <div className="w-full border border-[#241F18]/10 bg-white px-6 py-12 text-center sm:px-12 sm:py-16">

          {/* CHECK ICON */}

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#B8860B]/30 bg-[#FAF8F2]">

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#241F18]">

              <Check
                size={25}
                strokeWidth={1.8}
                className="text-[#B8860B]"
              />

            </div>

          </div>

          {/* LABEL */}

          <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.3em] text-[#B8860B]">
            Order Confirmed
          </p>

          {/* TITLE */}

          <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.03em] sm:text-6xl">
            Thank You
          </h1>

          {/* DESCRIPTION */}

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#756B5B]">
            Your order has been successfully placed with
            NIRA Furniture. We have received your payment
            and will begin processing your order shortly.
          </p>

          {/* ORDER DETAILS */}

          <div className="mx-auto mt-10 max-w-xl border border-[#241F18]/10 bg-[#FAF8F2]">

            <div className="grid sm:grid-cols-2">

              {/* ORDER NUMBER */}

              <div className="border-b border-[#241F18]/10 px-6 py-6 sm:border-r">

                <div className="flex items-center justify-center gap-2">

                  <Package
                    size={16}
                    className="text-[#B8860B]"
                  />

                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8A8174]">
                    Order Number
                  </p>

                </div>

                <p className="mt-3 break-all font-serif text-lg font-semibold">
                  {orderNumber || "Processing"}
                </p>

              </div>

              {/* PAYMENT */}

              <div className="px-6 py-6">

                <div className="flex items-center justify-center gap-2">

                  <Check
                    size={16}
                    className="text-[#B8860B]"
                  />

                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8A8174]">
                    Payment Status
                  </p>

                </div>

                <p className="mt-3 font-serif text-lg font-semibold">
                  Paid
                </p>

              </div>

            </div>

          </div>

          {/* PAYMENT ID */}

          {paymentId && (
            <div className="mx-auto mt-5 max-w-xl">

              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#8A8174]">
                Razorpay Payment ID
              </p>

              <p className="mt-2 break-all text-xs text-[#756B5B]">
                {paymentId}
              </p>

            </div>
          )}

          {/* ORDER ID */}

          {orderId && (
            <div className="mx-auto mt-3 max-w-xl">

              <p className="break-all text-[9px] text-[#8A8174]">
                Order ID: {orderId}
              </p>

            </div>
          )}

          {/* ACTIONS */}

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/account/orders"
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#241F18] px-7 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#B8860B]"
            >
              <Package size={15} />
              View My Orders
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/products"
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#241F18]/15 bg-white px-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#241F18] transition hover:border-[#B8860B] hover:text-[#B8860B]"
            >
              <ShoppingBag size={15} />
              Continue Shopping
            </Link>

          </div>

          {/* FOOTER MESSAGE */}

          <div className="mt-10 border-t border-[#241F18]/10 pt-7">

            <p className="text-xs leading-6 text-[#8A8174]">
              A confirmation of your order will be available
              in your NIRA account.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}