import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

import ReturnOrderButton from "../../../../components/aacount/ReturnOrderButton";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function money(
  value: number | string | null,
  currency = "INR",
) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));
}

function dateFormat(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusIcon(status: string) {
  if (status === "delivered") {
    return <CheckCircle2 className="h-5 w-5" />;
  }

  if (status === "shipped") {
    return <Truck className="h-5 w-5" />;
  }

  if (
    status === "processing" ||
    status === "packed"
  ) {
    return <Package className="h-5 w-5" />;
  }

  if (
    status === "cancelled" ||
    status === "returned"
  ) {
    return <XCircle className="h-5 w-5" />;
  }

  return <Clock className="h-5 w-5" />;
}

function statusText(status: string) {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

function returnStatusClasses(status: string) {
  switch (status) {
    case "approved":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "completed":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";

    case "cancelled":
      return "border-gray-200 bg-gray-50 text-gray-600";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

export default async function OrderDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  /* =========================================================
     AUTH
  ========================================================= */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?next=/account/orders/${encodeURIComponent(id)}`,
    );
  }

  /* =========================================================
     FETCH ORDER
  ========================================================= */

  const {
    data: order,
    error: orderError,
  } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (orderError) {
    console.error(
      "Order fetch error:",
      orderError,
    );

    notFound();
  }

  if (!order) {
    notFound();
  }

  /* =========================================================
     FETCH ORDER ITEMS
  ========================================================= */

  const {
    data: items,
    error: itemsError,
  } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", {
      ascending: true,
    });

  if (itemsError) {
    console.error(
      "Order items fetch error:",
      itemsError,
    );
  }

  const orderItems = items ?? [];

  /* =========================================================
     FETCH RETURN REQUEST
  ========================================================= */

  const {
    data: returnRequests,
    error: returnRequestError,
  } = await supabase
    .from("return_requests")
    .select(
      `
        id,
        order_id,
        reason,
        description,
        status,
        admin_note,
        created_at,
        updated_at
      `,
    )
    .eq("order_id", order.id)
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    })
    .limit(1);

  if (returnRequestError) {
    console.error(
      "Return request fetch error:",
      returnRequestError,
    );
  }

  const existingReturnRequest =
    returnRequests?.[0] ?? null;

  /*
   * Customer can request a return once the order
   * has been shipped.
   */
  const canRequestReturn =
    order.order_status === "shipped";

  /*
   * Prevent showing a new request button when
   * there is already an active/completed request.
   */
  const hasActiveReturnRequest =
    existingReturnRequest &&
    [
      "pending",
      "approved",
      "completed",
    ].includes(
      existingReturnRequest.status,
    );

  return (
    <main className="min-h-screen bg-[#F7F4EE] px-4 pb-20 pt-32 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            BACK
        ====================================================== */}

        <Link
          href="/account/orders"
          className="
            mb-8
            inline-flex
            items-center
            gap-2
            text-xs
            font-semibold
            uppercase
            tracking-[0.2em]
            text-[#765A32]
            transition
            hover:text-[#171512]
          "
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div
          className="
            mb-10
            flex
            flex-col
            gap-6
            border-b
            border-black/10
            pb-8
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div>
            <p
              className="
                mb-3
                text-xs
                font-semibold
                uppercase
                tracking-[0.3em]
                text-[#765A32]
              "
            >
              NIRA Furniture
            </p>

            <h1
              className="
                font-serif
                text-4xl
                font-medium
                text-[#171512]
                sm:text-5xl
              "
            >
              Order Details
            </h1>

            <p className="mt-3 text-sm text-black/50">
              Order #{order.order_number}
            </p>

            <p className="mt-1 text-sm text-black/40">
              Placed on{" "}
              {dateFormat(order.created_at)}
            </p>
          </div>

          {/* ORDER STATUS */}

          <div
            className={`
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              border
              px-4
              py-2
              text-xs
              font-semibold
              uppercase
              tracking-[0.15em]
              ${
                order.order_status ===
                "delivered"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : order.order_status ===
                        "cancelled" ||
                    order.order_status ===
                        "returned"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : order.order_status ===
                        "shipped"
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
              }
            `}
          >
            {statusIcon(
              order.order_status,
            )}

            {statusText(
              order.order_status,
            )}
          </div>
        </div>

        {/* =====================================================
            MAIN GRID
        ====================================================== */}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* ===================================================
              LEFT
          ==================================================== */}

          <div className="space-y-8">

            {/* =================================================
                ITEMS
            ================================================== */}

            <section className="border border-black/10 bg-white">
              <div className="border-b border-black/10 px-6 py-5 sm:px-8">
                <h2 className="font-serif text-2xl text-[#171512]">
                  Items
                </h2>
              </div>

              <div className="divide-y divide-black/10">
                {orderItems.length === 0 ? (
                  <div className="px-8 py-12 text-center text-sm text-black/45">
                    No items found for this order.
                  </div>
                ) : (
                  orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="
                        flex
                        flex-col
                        gap-5
                        px-6
                        py-6
                        sm:flex-row
                        sm:px-8
                      "
                    >
                      {/* IMAGE */}

                      <div className="h-28 w-28 shrink-0 overflow-hidden bg-[#F3F0E9]">
                        {item.product_image_url ? (
                          <img
                            src={
                              item.product_image_url
                            }
                            alt={
                              item.product_name
                            }
                            className="
                              h-full
                              w-full
                              object-cover
                            "
                          />
                        ) : (
                          <div
                            className="
                              flex
                              h-full
                              w-full
                              items-center
                              justify-center
                              text-xs
                              tracking-[0.15em]
                              text-black/30
                            "
                          >
                            NIRA
                          </div>
                        )}
                      </div>

                      {/* DETAILS */}

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <Link
                            href={`/products/${item.product_slug}`}
                            className="
                              font-serif
                              text-2xl
                              text-[#171512]
                              transition
                              hover:text-[#765A32]
                            "
                          >
                            {item.product_name}
                          </Link>

                          <p className="mt-2 text-sm text-black/45">
                            Quantity:{" "}
                            {item.quantity}
                          </p>
                        </div>

                        <div
                          className="
                            mt-4
                            flex
                            items-center
                            justify-between
                          "
                        >
                          <span className="text-sm text-black/45">
                            {money(
                              item.unit_price,
                              order.currency,
                            )}{" "}
                            each
                          </span>

                          <span className="font-semibold text-[#171512]">
                            {money(
                              item.total_price,
                              order.currency,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* =================================================
                SHIPPING + PAYMENT
            ================================================== */}

            <div className="grid gap-8 md:grid-cols-2">

              {/* SHIPPING */}

              <section className="border border-black/10 bg-white p-6 sm:p-8">
                <h2 className="mb-6 font-serif text-2xl text-[#171512]">
                  Shipping Address
                </h2>

                <div className="space-y-1 text-sm leading-6 text-black/65">
                  <p className="font-semibold text-[#171512]">
                    {order.customer_name}
                  </p>

                  {order.shipping_address_line1 && (
                    <p>
                      {
                        order.shipping_address_line1
                      }
                    </p>
                  )}

                  {order.shipping_address_line2 && (
                    <p>
                      {
                        order.shipping_address_line2
                      }
                    </p>
                  )}

                  <p>
                    {[
                      order.shipping_city,
                      order.shipping_state,
                      order.shipping_postal_code,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  {order.shipping_country && (
                    <p>
                      {order.shipping_country}
                    </p>
                  )}

                  <div className="pt-3 text-black/45">
                    <p>
                      {order.customer_email}
                    </p>

                    <p>
                      {order.customer_phone}
                    </p>
                  </div>
                </div>
              </section>

              {/* PAYMENT */}

              <section className="border border-black/10 bg-white p-6 sm:p-8">
                <h2 className="mb-6 font-serif text-2xl text-[#171512]">
                  Payment
                </h2>

                <div className="space-y-4 text-sm">

                  <div className="flex justify-between gap-4">
                    <span className="text-black/45">
                      Payment Status
                    </span>

                    <span className="font-medium text-[#171512]">
                      {statusText(
                        order.payment_status,
                      )}
                    </span>
                  </div>

                  {order.payment_method && (
                    <div className="flex justify-between gap-4">
                      <span className="text-black/45">
                        Method
                      </span>

                      <span className="font-medium text-[#171512]">
                        {order.payment_method}
                      </span>
                    </div>
                  )}

                  {/* RAZORPAY PAYMENT ID */}

                  {order.razorpay_payment_id && (
                    <div>
                      <p className="mb-1 text-black/45">
                        Payment ID
                      </p>

                      <p className="break-all font-medium text-[#171512]">
                        {
                          order.razorpay_payment_id
                        }
                      </p>
                    </div>
                  )}

                  {/* FALLBACK FOR OLD ORDERS */}

                  {!order.razorpay_payment_id &&
                    order.cashfree_payment_id && (
                      <div>
                        <p className="mb-1 text-black/45">
                          Payment ID
                        </p>

                        <p className="break-all font-medium text-[#171512]">
                          {
                            order.cashfree_payment_id
                          }
                        </p>
                      </div>
                    )}
                </div>
              </section>
            </div>

            {/* =================================================
                ORDER NOTE
            ================================================== */}

            {order.customer_note && (
              <section className="border border-black/10 bg-white p-6 sm:p-8">
                <h2 className="mb-4 font-serif text-2xl text-[#171512]">
                  Order Note
                </h2>

                <p className="text-sm leading-7 text-black/60">
                  {order.customer_note}
                </p>
              </section>
            )}

            {/* =================================================
                RETURN REQUEST STATUS
            ================================================== */}

            {existingReturnRequest && (
              <section className="border border-black/10 bg-white p-6 sm:p-8">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                  <div>
                    <p
                      className="
                        mb-2
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-[#765A32]
                      "
                    >
                      Return Request
                    </p>

                    <h2 className="font-serif text-2xl text-[#171512]">
                      Return Status
                    </h2>
                  </div>

                  <span
                    className={`
                      inline-flex
                      w-fit
                      rounded-full
                      border
                      px-3
                      py-1.5
                      text-[9px]
                      font-bold
                      uppercase
                      tracking-[0.16em]
                      ${returnStatusClasses(
                        existingReturnRequest.status,
                      )}
                    `}
                  >
                    {statusText(
                      existingReturnRequest.status,
                    )}
                  </span>
                </div>

                <div className="mt-6 space-y-4 border-t border-black/10 pt-6">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/35">
                      Reason
                    </p>

                    <p className="mt-1 text-sm text-black/65">
                      {
                        existingReturnRequest.reason
                      }
                    </p>
                  </div>

                  {existingReturnRequest.description && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/35">
                        Description
                      </p>

                      <p className="mt-1 text-sm leading-6 text-black/65">
                        {
                          existingReturnRequest.description
                        }
                      </p>
                    </div>
                  )}

                  {existingReturnRequest.admin_note && (
                    <div className="border border-[#765A32]/15 bg-[#F7F4EE] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#765A32]">
                        NIRA Support Note
                      </p>

                      <p className="mt-2 text-sm leading-6 text-black/65">
                        {
                          existingReturnRequest.admin_note
                        }
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-black/35">
                    Requested on{" "}
                    {dateFormat(
                      existingReturnRequest.created_at,
                    )}
                  </p>
                </div>
              </section>
            )}

          </div>

          {/* ===================================================
              RIGHT SIDEBAR
          ==================================================== */}

          <aside className="h-fit border border-black/10 bg-white lg:sticky lg:top-28">

            {/* =================================================
                SUMMARY HEADER
            ================================================== */}

            <div className="border-b border-black/10 px-6 py-5 sm:px-8">
              <h2 className="font-serif text-2xl text-[#171512]">
                Order Summary
              </h2>
            </div>

            {/* =================================================
                SUMMARY
            ================================================== */}

            <div className="space-y-4 px-6 py-6 sm:px-8">

              {/* SUBTOTAL */}

              <div className="flex justify-between text-sm">
                <span className="text-black/50">
                  Subtotal
                </span>

                <span className="font-medium text-[#171512]">
                  {money(
                    order.subtotal,
                    order.currency,
                  )}
                </span>
              </div>

              {/* SHIPPING */}

              <div className="flex justify-between text-sm">
                <span className="text-black/50">
                  Shipping
                </span>

                <span className="font-medium text-[#171512]">
                  {Number(
                    order.shipping_amount,
                  ) > 0
                    ? money(
                        order.shipping_amount,
                        order.currency,
                      )
                    : "Free"}
                </span>
              </div>

              {/* DISCOUNT */}

              {Number(
                order.discount_amount,
              ) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-black/50">
                    Discount
                  </span>

                  <span className="font-medium text-emerald-700">
                    -
                    {money(
                      order.discount_amount,
                      order.currency,
                    )}
                  </span>
                </div>
              )}

              {/* TAX */}

              {Number(
                order.tax_amount,
              ) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-black/50">
                    Tax
                  </span>

                  <span className="font-medium text-[#171512]">
                    {money(
                      order.tax_amount,
                      order.currency,
                    )}
                  </span>
                </div>
              )}

              {/* TOTAL */}

              <div className="border-t border-black/10 pt-5">
                <div className="flex items-end justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">
                    Total
                  </span>

                  <span className="font-serif text-3xl text-[#171512]">
                    {money(
                      order.total_amount,
                      order.currency,
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================
                RETURN ACTION
            ================================================== */}

            {canRequestReturn &&
              !hasActiveReturnRequest && (
                <div className="border-t border-black/10 p-6 sm:p-8">
                  <ReturnOrderButton
                    orderId={order.id}
                    orderNumber={order.order_number}
                    orderStatus={order.order_status}
                    existingRequest={
                      existingReturnRequest
                    }
                  />
                </div>
              )}

            {/* =================================================
                RETURN INFORMATION
            ================================================== */}

            {order.order_status === "shipped" &&
              hasActiveReturnRequest && (
                <div className="border-t border-black/10 bg-[#F7F4EE] p-6 sm:p-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      className="mt-0.5 shrink-0 text-[#765A32]"
                      size={18}
                    />

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#171512]">
                        Return Request Submitted
                      </p>

                      <p className="mt-2 text-sm leading-6 text-black/50">
                        Your return request is being
                        reviewed by the NIRA team.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/* =================================================
                CONTINUE SHOPPING
            ================================================== */}

            <div className="border-t border-black/10 p-6 sm:p-8">
              <Link
                href="/collections"
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  bg-[#171512]
                  px-6
                  py-4
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-white
                  transition
                  hover:bg-[#765A32]
                "
              >
                Continue Shopping
              </Link>
            </div>

          </aside>
        </div>
      </div>
    </main>
  );
}