import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, CheckCircle2, Clock, Package, Truck, XCircle } from "lucide-react";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function money(value: number | string | null, currency = "INR") {
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

  if (status === "processing" || status === "packed") {
    return <Package className="h-5 w-5" />;
  }

  if (status === "cancelled" || status === "returned") {
    return <XCircle className="h-5 w-5" />;
  }

  return <Clock className="h-5 w-5" />;
}

function statusText(status: string) {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function OrderDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?next=/account/orders/${encodeURIComponent(id)}`
    );
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (orderError) {
    console.error("Order fetch error:", orderError);
    notFound();
  }

  if (!order) {
    notFound();
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  if (itemsError) {
    console.error("Order items fetch error:", itemsError);
  }

  const orderItems = items ?? [];

  return (
    <main className="min-h-screen bg-[#F7F4EE] px-4 pb-20 pt-32 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        <Link
          href="/account/orders"
          className="mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#765A32] transition hover:text-[#171512]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        <div className="mb-10 flex flex-col gap-6 border-b border-black/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#765A32]">
              NIRA Furniture
            </p>

            <h1 className="font-serif text-4xl font-medium text-[#171512] sm:text-5xl">
              Order Details
            </h1>

            <p className="mt-3 text-sm text-black/50">
              Order #{order.order_number}
            </p>

            <p className="mt-1 text-sm text-black/40">
              Placed on {dateFormat(order.created_at)}
            </p>
          </div>

          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] ${
              order.order_status === "delivered"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : order.order_status === "cancelled" ||
                    order.order_status === "returned"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            {statusIcon(order.order_status)}
            {statusText(order.order_status)}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          <div className="space-y-8">

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
                      className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:px-8"
                    >
                      <div className="h-28 w-28 shrink-0 overflow-hidden bg-[#F3F0E9]">
                        {item.product_image_url ? (
                          <img
                            src={item.product_image_url}
                            alt={item.product_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs tracking-[0.15em] text-black/30">
                            NIRA
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <Link
                            href={`/products/${item.product_slug}`}
                            className="font-serif text-2xl text-[#171512] transition hover:text-[#765A32]"
                          >
                            {item.product_name}
                          </Link>

                          <p className="mt-2 text-sm text-black/45">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm text-black/45">
                            {money(
                              item.unit_price,
                              order.currency
                            )}{" "}
                            each
                          </span>

                          <span className="font-semibold text-[#171512]">
                            {money(
                              item.total_price,
                              order.currency
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <div className="grid gap-8 md:grid-cols-2">

              <section className="border border-black/10 bg-white p-6 sm:p-8">
                <h2 className="mb-6 font-serif text-2xl text-[#171512]">
                  Shipping Address
                </h2>

                <div className="space-y-1 text-sm leading-6 text-black/65">
                  <p className="font-semibold text-[#171512]">
                    {order.customer_name}
                  </p>

                  {order.shipping_address_line1 && (
                    <p>{order.shipping_address_line1}</p>
                  )}

                  {order.shipping_address_line2 && (
                    <p>{order.shipping_address_line2}</p>
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
                    <p>{order.shipping_country}</p>
                  )}

                  <div className="pt-3 text-black/45">
                    <p>{order.customer_email}</p>
                    <p>{order.customer_phone}</p>
                  </div>
                </div>
              </section>

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
                      {statusText(order.payment_status)}
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

                  {order.cashfree_payment_id && (
                    <div>
                      <p className="mb-1 text-black/45">
                        Payment ID
                      </p>

                      <p className="break-all font-medium text-[#171512]">
                        {order.cashfree_payment_id}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>

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
          </div>

          <aside className="h-fit border border-black/10 bg-white lg:sticky lg:top-28">

            <div className="border-b border-black/10 px-6 py-5 sm:px-8">
              <h2 className="font-serif text-2xl text-[#171512]">
                Order Summary
              </h2>
            </div>

            <div className="space-y-4 px-6 py-6 sm:px-8">

              <div className="flex justify-between text-sm">
                <span className="text-black/50">
                  Subtotal
                </span>

                <span className="font-medium text-[#171512]">
                  {money(
                    order.subtotal,
                    order.currency
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-black/50">
                  Shipping
                </span>

                <span className="font-medium text-[#171512]">
                  {Number(order.shipping_amount) > 0
                    ? money(
                        order.shipping_amount,
                        order.currency
                      )
                    : "Free"}
                </span>
              </div>

              {Number(order.discount_amount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-black/50">
                    Discount
                  </span>

                  <span className="font-medium text-emerald-700">
                    -
                    {money(
                      order.discount_amount,
                      order.currency
                    )}
                  </span>
                </div>
              )}

              {Number(order.tax_amount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-black/50">
                    Tax
                  </span>

                  <span className="font-medium text-[#171512]">
                    {money(
                      order.tax_amount,
                      order.currency
                    )}
                  </span>
                </div>
              )}

              <div className="border-t border-black/10 pt-5">
                <div className="flex items-end justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-black/40">
                    Total
                  </span>

                  <span className="font-serif text-3xl text-[#171512]">
                    {money(
                      order.total_amount,
                      order.currency
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-black/10 p-6 sm:p-8">
              <Link
                href="/collections"
                className="flex w-full items-center justify-center bg-[#171512] px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#765A32]"
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