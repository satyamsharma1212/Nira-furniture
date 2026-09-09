import Link from "next/link";
import { CheckCircle2, XCircle, Clock3 } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

type PaymentStatus =
  | "success"
  | "failed"
  | "pending"
  | "unknown";

type CashfreePayment = {
  cf_payment_id?: string;
  payment_status?: string;
  payment_amount?: number;
  payment_currency?: string;
  payment_message?: string;
  payment_method?: {
    upi?: unknown;
    card?: unknown;
    netbanking?: unknown;
    app?: unknown;
    wallet?: unknown;
  };
  bank_reference?: string;
};

function getCashfreeBaseUrl() {
  return process.env.CASHFREE_ENVIRONMENT === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

function getPaymentStatus(
  payments: CashfreePayment[],
): PaymentStatus {
  if (!payments.length) {
    return "pending";
  }

  const hasSuccess = payments.some(
    (payment) =>
      payment.payment_status ===
      "SUCCESS",
  );

  if (hasSuccess) {
    return "success";
  }

  const hasFailure = payments.some(
    (payment) =>
      payment.payment_status ===
        "FAILED" ||
      payment.payment_status ===
        "USER_DROPPED",
  );

  if (hasFailure) {
    return "failed";
  }

  return "pending";
}

function getPaymentMethod(
  payment?: CashfreePayment,
) {
  if (!payment?.payment_method) {
    return "Online Payment";
  }

  if (payment.payment_method.upi) {
    return "UPI";
  }

  if (payment.payment_method.card) {
    return "Card";
  }

  if (payment.payment_method.netbanking) {
    return "Net Banking";
  }

  if (payment.payment_method.app) {
    return "App";
  }

  if (payment.payment_method.wallet) {
    return "Wallet";
  }

  return "Online Payment";
}

export default async function CashfreeReturnPage({
  searchParams,
}: {
  searchParams: Promise<{
    order_id?: string;
  }>;
}) {
  /*
   * -------------------------------------------------------
   * 1. GET ORDER ID
   * -------------------------------------------------------
   */

  const params =
    await searchParams;

  const orderId =
    params.order_id;

  /*
   * -------------------------------------------------------
   * 2. BASIC VALIDATION
   * -------------------------------------------------------
   */

  if (!orderId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F4EE] px-6">
        <div className="w-full max-w-xl border border-[#171512]/10 bg-white p-8 text-center sm:p-12">
          <XCircle
            size={54}
            strokeWidth={1.3}
            className="mx-auto text-red-700"
          />

          <p className="mt-7 font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#765A32]">
            Payment Error
          </p>

          <h1 className="mt-3 font-serif text-4xl font-semibold">
            Order Not Found
          </h1>

          <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-7 text-[#171512]/55">
            We could not identify the order
            associated with this payment.
          </p>

          <Link
            href="/cart"
            className="mt-8 inline-flex bg-[#171512] px-7 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#765A32]"
          >
            Return to Cart
          </Link>
        </div>
      </main>
    );
  }

  /*
   * -------------------------------------------------------
   * 3. SUPABASE CLIENT
   * -------------------------------------------------------
   */

  const supabase =
    await createClient();

  /*
   * -------------------------------------------------------
   * 4. GET LOGGED-IN USER
   * -------------------------------------------------------
   */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F4EE] px-6">
        <div className="w-full max-w-xl border border-[#171512]/10 bg-white p-8 text-center sm:p-12">
          <XCircle
            size={54}
            strokeWidth={1.3}
            className="mx-auto text-red-700"
          />

          <p className="mt-7 font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#765A32]">
            Authentication Required
          </p>

          <h1 className="mt-3 font-serif text-4xl font-semibold">
            Please Sign In
          </h1>

          <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-7 text-[#171512]/55">
            Please sign in to view the status
            of your order.
          </p>

          <Link
            href={`/login?next=${encodeURIComponent(
              `/payment/cashfree/return?order_id=${orderId}`,
            )}`}
            className="mt-8 inline-flex bg-[#171512] px-7 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#765A32]"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  /*
   * -------------------------------------------------------
   * 5. GET LOCAL ORDER
   * -------------------------------------------------------
   */

  const {
    data: order,
    error: orderError,
  } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        user_id,
        customer_name,
        customer_email,
        total_amount,
        currency,
        payment_status,
        order_status
      `,
    )
    .eq(
      "order_number",
      orderId,
    )
    .eq(
      "user_id",
      user.id,
    )
    .single();

  if (
    orderError ||
    !order
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F4EE] px-6">
        <div className="w-full max-w-xl border border-[#171512]/10 bg-white p-8 text-center sm:p-12">
          <XCircle
            size={54}
            strokeWidth={1.3}
            className="mx-auto text-red-700"
          />

          <p className="mt-7 font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-[#765A32]">
            Payment Error
          </p>

          <h1 className="mt-3 font-serif text-4xl font-semibold">
            Order Not Found
          </h1>

          <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-7 text-[#171512]/55">
            We could not find this order in
            your NIRA account.
          </p>

          <Link
            href="/account/orders"
            className="mt-8 inline-flex bg-[#171512] px-7 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#765A32]"
          >
            View My Orders
          </Link>
        </div>
      </main>
    );
  }

  /*
   * -------------------------------------------------------
   * 6. CASHFREE CREDENTIALS
   * -------------------------------------------------------
   */

  const appId =
    process.env.CASHFREE_APP_ID;

  const secretKey =
    process.env.CASHFREE_SECRET_KEY;

  if (
    !appId ||
    !secretKey
  ) {
    console.error(
      "Cashfree credentials are missing.",
    );

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F4EE] px-6">
        <div className="w-full max-w-xl border border-[#171512]/10 bg-white p-8 text-center sm:p-12">
          <XCircle
            size={54}
            strokeWidth={1.3}
            className="mx-auto text-red-700"
          />

          <h1 className="mt-6 font-serif text-4xl font-semibold">
            Payment Verification Error
          </h1>

          <p className="mt-4 font-sans text-sm leading-7 text-[#171512]/55">
            We could not verify your payment
            at this time.
          </p>

          <Link
            href="/account/orders"
            className="mt-8 inline-flex bg-[#171512] px-7 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#765A32]"
          >
            View My Orders
          </Link>
        </div>
      </main>
    );
  }

  /*
   * -------------------------------------------------------
   * 7. GET PAYMENTS FROM CASHFREE
   * -------------------------------------------------------
   *
   * Cashfree recommends checking the payment
   * status after the customer returns from
   * checkout.
   */

  let payments: CashfreePayment[] =
    [];

  let verificationError = "";

  try {
    const baseUrl =
      getCashfreeBaseUrl();

    const cashfreeResponse =
      await fetch(
        `${baseUrl}/orders/${encodeURIComponent(
          orderId,
        )}/payments`,
        {
          method: "GET",

          headers: {
            "Content-Type":
              "application/json",

            "x-api-version":
              "2025-01-01",

            "x-client-id":
              appId,

            "x-client-secret":
              secretKey,
          },

          cache: "no-store",
        },
      );

    const cashfreeData =
      await cashfreeResponse.json();

    if (
      !cashfreeResponse.ok
    ) {
      console.error(
        "Cashfree payment verification error:",
        cashfreeData,
      );

      verificationError =
        cashfreeData?.message ||
        "Unable to verify payment.";

      payments = [];
    } else if (
      Array.isArray(
        cashfreeData
      )
    ) {
      payments =
        cashfreeData;
    } else {
      /*
       * Some API responses can wrap
       * payment data.
       */

      payments =
        Array.isArray(
          cashfreeData?.payments,
        )
          ? cashfreeData.payments
          : [];
    }
  } catch (error) {
    console.error(
      "Cashfree verification request failed:",
      error,
    );

    verificationError =
      "Unable to contact Cashfree.";
  }

  /*
   * -------------------------------------------------------
   * 8. DETERMINE PAYMENT STATUS
   * -------------------------------------------------------
   */

  const paymentStatus =
    getPaymentStatus(
      payments,
    );

  /*
   * Get the most recent payment.
   */

  const latestPayment =
    payments.length > 0
      ? payments[
          payments.length - 1
        ]
      : undefined;

  /*
   * -------------------------------------------------------
   * 9. UPDATE LOCAL ORDER
   * -------------------------------------------------------
   */

  if (
    paymentStatus ===
    "success"
  ) {
    /*
     * Update order only if
     * payment is actually successful.
     */

    await supabase
      .from("orders")
      .update({
        payment_status:
          "paid",

        order_status:
          "confirmed",

        payment_method:
          getPaymentMethod(
            latestPayment,
          ),

        cashfree_payment_id:
          latestPayment
            ?.cf_payment_id ||
          null,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        order.id,
      )
      .eq(
        "user_id",
        user.id,
      );

    /*
     * Update payment transaction.
     */

    await supabase
      .from(
        "payment_transactions",
      )
      .update({
        cashfree_payment_id:
          latestPayment
            ?.cf_payment_id ||
          null,

        payment_method:
          getPaymentMethod(
            latestPayment,
          ),

        status:
          "success",

        bank_reference:
          latestPayment
            ?.bank_reference ||
          null,

        payment_message:
          latestPayment
            ?.payment_message ||
          null,

        gateway_response:
          latestPayment ||
          null,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "order_id",
        order.id,
      )
      .eq(
        "user_id",
        user.id,
      );
  } else if (
    paymentStatus ===
    "failed"
  ) {
    /*
     * Payment failed.
     */

    await supabase
      .from("orders")
      .update({
        payment_status:
          "failed",

        payment_method:
          getPaymentMethod(
            latestPayment,
          ),

        cashfree_payment_id:
          latestPayment
            ?.cf_payment_id ||
          null,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        order.id,
      )
      .eq(
        "user_id",
        user.id,
      );

    await supabase
      .from(
        "payment_transactions",
      )
      .update({
        cashfree_payment_id:
          latestPayment
            ?.cf_payment_id ||
          null,

        payment_method:
          getPaymentMethod(
            latestPayment,
          ),

        status:
          "failed",

        bank_reference:
          latestPayment
            ?.bank_reference ||
          null,

        payment_message:
          latestPayment
            ?.payment_message ||
          null,

        gateway_response:
          latestPayment ||
          null,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "order_id",
        order.id,
      )
      .eq(
        "user_id",
        user.id,
      );
  } else {
    /*
     * Payment is still pending.
     */

    await supabase
      .from("orders")
      .update({
        payment_status:
          "processing",

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        order.id,
      )
      .eq(
        "user_id",
        user.id,
      );

    await supabase
      .from(
        "payment_transactions",
      )
      .update({
        status:
          "processing",

        gateway_response:
          latestPayment ||
          null,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "order_id",
        order.id,
      )
      .eq(
        "user_id",
        user.id,
      );
  }

  /*
   * -------------------------------------------------------
   * 10. SUCCESS PAGE
   * -------------------------------------------------------
   */

  if (
    paymentStatus ===
    "success"
  ) {
    return (
      <main className="min-h-screen bg-[#F7F4EE]">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-16">
          <div className="w-full border border-[#171512]/10 bg-white p-8 text-center sm:p-14">
            <CheckCircle2
              size={64}
              strokeWidth={1.2}
              className="mx-auto text-[#765A32]"
            />

            <p className="mt-8 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#765A32]">
              Payment Successful
            </p>

            <h1 className="mt-3 font-serif text-5xl font-semibold tracking-[-0.03em]">
              Thank You
            </h1>

            <p className="mx-auto mt-5 max-w-xl font-sans text-sm leading-7 text-[#171512]/55">
              Your payment has been
              successfully received. Your NIRA
              Furniture order is now confirmed.
            </p>

            {/* ORDER DETAILS */}

            <div className="mx-auto mt-10 max-w-lg border-y border-[#171512]/10 py-6">
              <div className="flex items-center justify-between gap-5 py-2">
                <span className="font-sans text-xs uppercase tracking-[0.12em] text-[#171512]/45">
                  Order
                </span>

                <span className="font-sans text-sm font-bold">
                  {order.order_number}
                </span>
              </div>

              <div className="flex items-center justify-between gap-5 py-2">
                <span className="font-sans text-xs uppercase tracking-[0.12em] text-[#171512]/45">
                  Amount
                </span>

                <span className="font-sans text-sm font-bold">
                  {order.currency}{" "}
                  {Number(
                    order.total_amount,
                  ).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between gap-5 py-2">
                <span className="font-sans text-xs uppercase tracking-[0.12em] text-[#171512]/45">
                  Payment
                </span>

                <span className="font-sans text-sm font-bold">
                  {getPaymentMethod(
                    latestPayment,
                  )}
                </span>
              </div>

              {latestPayment
                ?.cf_payment_id && (
                <div className="flex items-center justify-between gap-5 py-2">
                  <span className="font-sans text-xs uppercase tracking-[0.12em] text-[#171512]/45">
                    Payment ID
                  </span>

                  <span className="max-w-[220px] truncate font-sans text-xs font-medium">
                    {
                      latestPayment.cf_payment_id
                    }
                  </span>
                </div>
              )}
            </div>

            {/* ACTIONS */}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`/account/orders/${order.id}`}
                className="inline-flex items-center justify-center bg-[#171512] px-7 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#765A32]"
              >
                View Order
              </Link>

              <Link
                href="/products"
                className="inline-flex items-center justify-center border border-[#171512]/15 px-7 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] transition hover:border-[#765A32] hover:text-[#765A32]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * -------------------------------------------------------
   * 11. FAILED PAYMENT
   * -------------------------------------------------------
   */

  if (
    paymentStatus ===
    "failed"
  ) {
    return (
      <main className="min-h-screen bg-[#F7F4EE]">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-16">
          <div className="w-full border border-[#171512]/10 bg-white p-8 text-center sm:p-14">
            <XCircle
              size={64}
              strokeWidth={1.2}
              className="mx-auto text-red-700"
            />

            <p className="mt-8 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-red-700">
              Payment Failed
            </p>

            <h1 className="mt-3 font-serif text-5xl font-semibold tracking-[-0.03em]">
              Payment Unsuccessful
            </h1>

            <p className="mx-auto mt-5 max-w-xl font-sans text-sm leading-7 text-[#171512]/55">
              Your payment could not be
              completed. Your order has not been
              confirmed.
            </p>

            {latestPayment
              ?.payment_message && (
              <div className="mx-auto mt-7 max-w-lg border border-red-900/10 bg-red-50 px-5 py-4 font-sans text-sm leading-6 text-red-700">
                {
                  latestPayment.payment_message
                }
              </div>
            )}

            <div className="mx-auto mt-10 max-w-lg border-y border-[#171512]/10 py-6">
              <div className="flex items-center justify-between gap-5">
                <span className="font-sans text-xs uppercase tracking-[0.12em] text-[#171512]/45">
                  Order
                </span>

                <span className="font-sans text-sm font-bold">
                  {order.order_number}
                </span>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/cart"
                className="inline-flex items-center justify-center bg-[#171512] px-7 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#765A32]"
              >
                Return to Cart
              </Link>

              <Link
                href="/account/orders"
                className="inline-flex items-center justify-center border border-[#171512]/15 px-7 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] transition hover:border-[#765A32] hover:text-[#765A32]"
              >
                My Orders
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * -------------------------------------------------------
   * 12. PENDING PAYMENT
   * -------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-[#F7F4EE]">
      <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-16">
        <div className="w-full border border-[#171512]/10 bg-white p-8 text-center sm:p-14">
          <Clock3
            size={64}
            strokeWidth={1.2}
            className="mx-auto text-[#765A32]"
          />

          <p className="mt-8 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#765A32]">
            Payment Processing
          </p>

          <h1 className="mt-3 font-serif text-5xl font-semibold tracking-[-0.03em]">
            Payment Pending
          </h1>

          <p className="mx-auto mt-5 max-w-xl font-sans text-sm leading-7 text-[#171512]/55">
            Your payment is still being
            processed by the payment gateway.
            Please allow a little time for the
            final status to be confirmed.
          </p>

          {verificationError && (
            <div className="mx-auto mt-7 max-w-lg border border-[#765A32]/15 bg-[#765A32]/5 px-5 py-4 font-sans text-sm leading-6 text-[#765A32]">
              {verificationError}
            </div>
          )}

          <div className="mx-auto mt-10 max-w-lg border-y border-[#171512]/10 py-6">
            <div className="flex items-center justify-between gap-5">
              <span className="font-sans text-xs uppercase tracking-[0.12em] text-[#171512]/45">
                Order
              </span>

              <span className="font-sans text-sm font-bold">
                {order.order_number}
              </span>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={`/account/orders/${order.id}`}
              className="inline-flex items-center justify-center bg-[#171512] px-7 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#765A32]"
            >
              View Order
            </Link>

            <Link
              href="/account/orders"
              className="inline-flex items-center justify-center border border-[#171512]/15 px-7 py-4 font-sans text-[10px] font-bold uppercase tracking-[0.2em] transition hover:border-[#765A32] hover:text-[#765A32]"
            >
              My Orders
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}