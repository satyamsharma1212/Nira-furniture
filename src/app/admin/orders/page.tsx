import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
  XCircle,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
] as const;

const PAYMENT_STATUSES = [
  "pending",
  "processing",
  "paid",
  "failed",
  "cancelled",
  "refunded",
  "partially_refunded",
] as const;

function formatMoney(
  value: number | string | null | undefined,
  currency = "INR",
) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatStatus(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getOrderStatusClasses(status: string) {
  switch (status) {
    case "delivered":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "shipped":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "processing":
    case "packed":
    case "confirmed":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "cancelled":
    case "returned":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-[#171512]/10 bg-[#F7F4EE] text-[#171512]/60";
  }
}

function getPaymentStatusClasses(status: string) {
  switch (status) {
    case "paid":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "failed":
    case "cancelled":
      return "border-red-200 bg-red-50 text-red-700";

    case "refunded":
    case "partially_refunded":
      return "border-purple-200 bg-purple-50 text-purple-700";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

function getOrderIcon(status: string) {
  switch (status) {
    case "delivered":
      return <CheckCircle2 size={15} />;

    case "shipped":
      return <Truck size={15} />;

    case "processing":
    case "packed":
    case "confirmed":
      return <Package size={15} />;

    case "cancelled":
    case "returned":
      return <XCircle size={15} />;

    default:
      return <Clock3 size={15} />;
  }
}

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  /* =========================================================
     AUTHENTICATION
  ========================================================= */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  /* =========================================================
     ADMIN CHECK
  ========================================================= */

  const { data: admin } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!admin) {
    redirect("/account");
  }

  /* =========================================================
     UPDATE ORDER STATUS
  ========================================================= */

  async function updateOrderStatus(
    formData: FormData,
  ) {
    "use server";

    const orderId = String(
      formData.get("order_id") || "",
    );

    const status = String(
      formData.get("order_status") || "",
    );

    if (
      !orderId ||
      !ORDER_STATUSES.includes(
        status as (typeof ORDER_STATUSES)[number],
      )
    ) {
      return;
    }

    const client = await createClient();

    const {
      data: {
        user: currentUser,
      },
    } = await client.auth.getUser();

    if (!currentUser) {
      redirect("/admin/login");
    }

    const { data: currentAdmin } = await client
      .from("admin_users")
      .select("id")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (!currentAdmin) {
      redirect("/account");
    }

    const { error } = await client
      .from("orders")
      .update({
        order_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) {
      throw new Error(error.message);
    }

    redirect("/admin/orders");
  }

  /* =========================================================
     UPDATE PAYMENT STATUS
  ========================================================= */

  async function updatePaymentStatus(
    formData: FormData,
  ) {
    "use server";

    const orderId = String(
      formData.get("order_id") || "",
    );

    const status = String(
      formData.get("payment_status") || "",
    );

    if (
      !orderId ||
      !PAYMENT_STATUSES.includes(
        status as (typeof PAYMENT_STATUSES)[number],
      )
    ) {
      return;
    }

    const client = await createClient();

    const {
      data: {
        user: currentUser,
      },
    } = await client.auth.getUser();

    if (!currentUser) {
      redirect("/admin/login");
    }

    const { data: currentAdmin } = await client
      .from("admin_users")
      .select("id")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (!currentAdmin) {
      redirect("/account");
    }

    const { error } = await client
      .from("orders")
      .update({
        payment_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) {
      throw new Error(error.message);
    }

    redirect("/admin/orders");
  }

  /* =========================================================
     LOAD ORDERS
  ========================================================= */

  const {
    data: orders,
    error: ordersError,
  } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        user_id,
        customer_name,
        customer_email,
        customer_phone,

        shipping_address_line1,
        shipping_address_line2,
        shipping_city,
        shipping_state,
        shipping_postal_code,
        shipping_country,

        billing_address_line1,
        billing_address_line2,
        billing_city,
        billing_state,
        billing_postal_code,
        billing_country,

        subtotal,
        shipping_amount,
        discount_amount,
        tax_amount,
        total_amount,
        currency,

        payment_status,
        order_status,
        payment_method,
        cashfree_payment_id,

        customer_note,
        notes,

        created_at,
        updated_at,

        order_items (
          id,
          product_id,
          product_name,
          product_slug,
          product_image_url,
          unit_price,
          quantity,
          total_price,
          created_at
        )
      `,
    )
    .order("created_at", {
      ascending: false,
    });

  if (ordersError) {
    console.error(
      "Admin orders fetch error:",
      ordersError,
    );
  }

  const orderList = orders ?? [];

  /* =========================================================
     STATS
  ========================================================= */

  const totalOrders = orderList.length;

  const pendingOrders = orderList.filter(
    (order) =>
      order.order_status === "pending",
  ).length;

  const processingOrders = orderList.filter(
    (order) =>
      [
        "confirmed",
        "processing",
        "packed",
        "shipped",
      ].includes(order.order_status),
  ).length;

  const completedOrders = orderList.filter(
    (order) =>
      order.order_status === "delivered",
  ).length;

  const paidRevenue = orderList
    .filter(
      (order) =>
        order.payment_status === "paid",
    )
    .reduce(
      (sum, order) =>
        sum +
        Number(order.total_amount ?? 0),
      0,
    );

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#171512]">
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">

        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-6 border-b border-[#171512]/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/admin"
              className="
                mb-6
                inline-flex
                items-center
                gap-2
                font-sans
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#171512]/45
                transition
                hover:text-[#765A32]
              "
            >
              <ArrowLeft size={14} />
              Dashboard
            </Link>

            <p className="mb-3 font-sans text-[11px] font-bold uppercase tracking-[0.3em] text-[#765A32]">
              Commerce
            </p>

            <h1 className="font-serif text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
              Orders
            </h1>

            <p className="mt-4 max-w-2xl font-sans text-sm font-medium leading-6 text-[#171512]/50">
              Manage every NIRA customer order, payment,
              delivery status, buyer information,
              products, and complete shipping address.
            </p>
          </div>

          <div className="border border-[#171512]/10 bg-white px-6 py-5">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#171512]/40">
              Total Revenue Collected
            </p>

            <p className="mt-1 font-serif text-3xl font-medium text-[#765A32]">
              {formatMoney(paidRevenue)}
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            label="Total Orders"
            value={totalOrders}
          />

          <StatCard
            label="Pending"
            value={pendingOrders}
          />

          <StatCard
            label="In Progress"
            value={processingOrders}
          />

          <StatCard
            label="Delivered"
            value={completedOrders}
          />

          <StatCard
            label="Paid Revenue"
            value={formatMoney(paidRevenue)}
            accent
          />
        </div>

        {/* ERROR */}
        {ordersError && (
          <div className="mb-8 border border-red-900/10 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
            Unable to load orders:
            {" "}
            {ordersError.message}
          </div>
        )}

        {/* EMPTY */}
        {orderList.length === 0 ? (
          <div className="border border-[#171512]/10 bg-white px-6 py-24 text-center">
            <Package
              size={42}
              strokeWidth={1.2}
              className="mx-auto text-[#765A32]"
            />

            <h2 className="mt-6 font-serif text-3xl font-semibold">
              No Orders Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#171512]/45">
              Customer orders will appear here automatically
              after a successful checkout.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orderList.map((order) => {
              const items = Array.isArray(
                order.order_items,
              )
                ? order.order_items
                : [];

              const itemCount = items.reduce(
                (
                  total: number,
                  item: {
                    quantity:
                      | number
                      | string
                      | null;
                  },
                ) =>
                  total +
                  Number(item.quantity ?? 0),
                0,
              );

              return (
                <article
                  key={order.id}
                  className="
                    overflow-hidden
                    border
                    border-[#171512]/10
                    bg-white
                    transition
                    duration-300
                    hover:border-[#765A32]/25
                  "
                >
                  {/* =================================================
                      CLICKABLE ORDER HEADER
                  ================================================== */}

                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="
                      group
                      block
                      border-b
                      border-[#171512]/10
                      bg-[#FBF9F3]
                      px-5
                      py-6
                      transition
                      hover:bg-[#F4EFE6]
                      sm:px-7
                    "
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#765A32]">
                          Order
                        </p>

                        <div className="mt-1 flex items-center gap-3">
                          <h2 className="font-serif text-2xl font-semibold">
                            #{order.order_number}
                          </h2>

                          <ArrowRight
                            size={17}
                            className="
                              text-[#765A32]
                              transition-transform
                              duration-300
                              group-hover:translate-x-1
                            "
                          />
                        </div>

                        <p className="mt-2 text-xs font-medium text-[#171512]/40">
                          {formatDate(order.created_at)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            px-3
                            py-1.5
                            font-sans
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.15em]
                            ${getOrderStatusClasses(
                              order.order_status,
                            )}
                          `}
                        >
                          {getOrderIcon(
                            order.order_status,
                          )}

                          {formatStatus(
                            order.order_status,
                          )}
                        </span>

                        <span
                          className={`
                            rounded-full
                            border
                            px-3
                            py-1.5
                            font-sans
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.15em]
                            ${getPaymentStatusClasses(
                              order.payment_status,
                            )}
                          `}
                        >
                          Payment:
                          {" "}
                          {formatStatus(
                            order.payment_status,
                          )}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* CUSTOMER + SHIPPING */}
                  <div className="grid gap-0 border-b border-[#171512]/10 lg:grid-cols-2">
                    <div className="border-b border-[#171512]/10 p-6 sm:p-7 lg:border-b-0 lg:border-r">
                      <SectionTitle
                        icon={<User size={16} />}
                        title="Buyer Details"
                      />

                      <div className="mt-5 space-y-4">
                        <DetailRow
                          label="Name"
                          value={order.customer_name}
                        />

                        <DetailRow
                          label="Email"
                          icon={<Mail size={14} />}
                          value={order.customer_email}
                        />

                        <DetailRow
                          label="Phone"
                          icon={<Phone size={14} />}
                          value={order.customer_phone}
                        />
                      </div>
                    </div>

                    <div className="p-6 sm:p-7">
                      <SectionTitle
                        icon={<MapPin size={16} />}
                        title="Shipping Address"
                      />

                      <div className="mt-5 text-sm leading-7 text-[#171512]/65">
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
                            {
                              order.shipping_country
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* BILLING + PAYMENT */}
                  <div className="grid gap-0 border-b border-[#171512]/10 lg:grid-cols-2">
                    <div className="border-b border-[#171512]/10 p-6 sm:p-7 lg:border-b-0 lg:border-r">
                      <SectionTitle
                        icon={<MapPin size={16} />}
                        title="Billing Address"
                      />

                      <div className="mt-5 text-sm leading-7 text-[#171512]/65">
                        {order.billing_address_line1 ? (
                          <>
                            <p className="font-semibold text-[#171512]">
                              {order.customer_name}
                            </p>

                            <p>
                              {
                                order.billing_address_line1
                              }
                            </p>

                            {order.billing_address_line2 && (
                              <p>
                                {
                                  order.billing_address_line2
                                }
                              </p>
                            )}

                            <p>
                              {[
                                order.billing_city,
                                order.billing_state,
                                order.billing_postal_code,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>

                            {order.billing_country && (
                              <p>
                                {
                                  order.billing_country
                                }
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-[#171512]/45">
                            Same as shipping address.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-6 sm:p-7">
                      <SectionTitle
                        icon={<CheckCircle2 size={16} />}
                        title="Payment Details"
                      />

                      <div className="mt-5 space-y-4">
                        <DetailRow
                          label="Payment Status"
                          value={formatStatus(
                            order.payment_status,
                          )}
                        />

                        <DetailRow
                          label="Payment Method"
                          value={
                            order.payment_method ||
                            "Razorpay / Online"
                          }
                        />

                        {order.cashfree_payment_id && (
                          <DetailRow
                            label="Gateway ID"
                            value={
                              order.cashfree_payment_id
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* PRODUCTS */}
                  <div className="border-b border-[#171512]/10">
                    <div className="px-6 py-5 sm:px-7">
                      <SectionTitle
                        icon={<Package size={16} />}
                        title={`Products (${items.length})`}
                      />
                    </div>

                    <div className="divide-y divide-[#171512]/10">
                      {items.map(
                        (item: {
                          id: string;
                          product_name: string;
                          product_slug: string;
                          product_image_url:
                            | string
                            | null;
                          unit_price:
                            | number
                            | string;
                          quantity:
                            | number
                            | string;
                          total_price:
                            | number
                            | string;
                        }) => (
                          <div
                            key={item.id}
                            className="flex flex-col gap-5 px-6 py-5 sm:flex-row sm:items-center sm:px-7"
                          >
                            <div className="h-20 w-20 shrink-0 overflow-hidden bg-[#F3F0E9]">
                              {item.product_image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={
                                    item.product_image_url
                                  }
                                  alt={
                                    item.product_name
                                  }
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center font-serif text-xl text-[#765A32]/50">
                                  N
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <Link
                                href={`/products/${item.product_slug}`}
                                className="font-serif text-xl font-semibold text-[#171512] transition hover:text-[#765A32]"
                              >
                                {item.product_name}
                              </Link>

                              <p className="mt-1 text-xs text-[#171512]/40">
                                Quantity:
                                {" "}
                                {item.quantity}
                              </p>
                            </div>

                            <div className="shrink-0 sm:text-right">
                              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#171512]/35">
                                Item Total
                              </p>

                              <p className="mt-1 font-serif text-2xl font-medium">
                                {formatMoney(
                                  Number(
                                    item.total_price,
                                  ),
                                  order.currency,
                                )}
                              </p>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* MANAGEMENT + TOTAL */}
                  <div className="grid gap-0 lg:grid-cols-[1fr_360px]">
                    <div className="border-b border-[#171512]/10 p-6 sm:p-7 lg:border-b-0 lg:border-r">
                      <SectionTitle
                        icon={<Truck size={16} />}
                        title="Order Management"
                      />

                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <form action={updateOrderStatus}>
                          <input
                            type="hidden"
                            name="order_id"
                            value={order.id}
                          />

                          <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-[#171512]/40">
                            Order Status
                          </label>

                          <select
                            name="order_status"
                            defaultValue={
                              order.order_status
                            }
                            className="h-12 w-full border border-[#171512]/15 bg-[#FAF8F2] px-4 text-sm font-medium outline-none focus:border-[#765A32]"
                          >
                            {ORDER_STATUSES.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {formatStatus(
                                    status,
                                  )}
                                </option>
                              ),
                            )}
                          </select>

                          <button
                            type="submit"
                            className="mt-3 w-full bg-[#171512] px-5 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#765A32]"
                          >
                            Update Order
                          </button>
                        </form>

                        <form action={updatePaymentStatus}>
                          <input
                            type="hidden"
                            name="order_id"
                            value={order.id}
                          />

                          <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-[#171512]/40">
                            Payment Status
                          </label>

                          <select
                            name="payment_status"
                            defaultValue={
                              order.payment_status
                            }
                            className="h-12 w-full border border-[#171512]/15 bg-[#FAF8F2] px-4 text-sm font-medium outline-none focus:border-[#765A32]"
                          >
                            {PAYMENT_STATUSES.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {formatStatus(
                                    status,
                                  )}
                                </option>
                              ),
                            )}
                          </select>

                          <button
                            type="submit"
                            className="mt-3 w-full border border-[#171512]/20 bg-white px-5 py-3 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-[#171512] transition hover:border-[#765A32] hover:text-[#765A32]"
                          >
                            Update Payment
                          </button>
                        </form>
                      </div>

                      {(order.customer_note ||
                        order.notes) && (
                        <div className="mt-7 border-t border-[#171512]/10 pt-6">
                          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#171512]/35">
                            Notes
                          </p>

                          {order.customer_note && (
                            <p className="mt-2 text-sm leading-6 text-[#171512]/60">
                              <span className="font-semibold text-[#171512]">
                                Customer:
                              </span>{" "}
                              {order.customer_note}
                            </p>
                          )}

                          {order.notes && (
                            <p className="mt-2 text-sm leading-6 text-[#171512]/60">
                              <span className="font-semibold text-[#171512]">
                                Admin:
                              </span>{" "}
                              {order.notes}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="p-6 sm:p-7">
                      <SectionTitle
                        icon={<Package size={16} />}
                        title="Order Summary"
                      />

                      <div className="mt-6 space-y-3">
                        <SummaryRow
                          label={`Items (${itemCount})`}
                          value={formatMoney(
                            Number(order.subtotal),
                            order.currency,
                          )}
                        />

                        <SummaryRow
                          label="Shipping"
                          value={
                            Number(
                              order.shipping_amount,
                            ) > 0
                              ? formatMoney(
                                  Number(
                                    order.shipping_amount,
                                  ),
                                  order.currency,
                                )
                              : "Free"
                          }
                        />

                        {Number(
                          order.discount_amount,
                        ) > 0 && (
                          <SummaryRow
                            label="Discount"
                            value={`-${formatMoney(
                              Number(
                                order.discount_amount,
                              ),
                              order.currency,
                            )}`}
                            green
                          />
                        )}

                        {Number(
                          order.tax_amount,
                        ) > 0 && (
                          <SummaryRow
                            label="Tax"
                            value={formatMoney(
                              Number(
                                order.tax_amount,
                              ),
                              order.currency,
                            )}
                          />
                        )}

                        <div className="my-5 border-t border-[#171512]/10" />

                        <div className="flex items-end justify-between gap-4">
                          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#171512]/40">
                            Order Total
                          </span>

                          <span className="font-serif text-3xl font-medium text-[#765A32]">
                            {formatMoney(
                              Number(
                                order.total_amount,
                              ),
                              order.currency,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="flex flex-col gap-3 border-t border-[#171512]/10 bg-[#FBF9F3] px-6 py-4 text-[10px] text-[#171512]/40 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                    <span>
                      Buyer:
                      {" "}
                      {order.customer_name}
                    </span>

                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="group inline-flex items-center gap-2 font-bold uppercase tracking-[0.16em] text-[#765A32] hover:text-[#171512]"
                    >
                      Open Complete Order
                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="border border-[#171512]/10 bg-white px-5 py-5">
      <p className="font-sans text-[9px] font-bold uppercase tracking-[0.18em] text-[#171512]/35">
        {label}
      </p>

      <p
        className={`mt-2 font-serif text-2xl font-semibold ${
          accent
            ? "text-[#765A32]"
            : "text-[#171512]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[#765A32]">
        {icon}
      </span>

      <h3 className="font-serif text-xl font-semibold text-[#171512]">
        {title}
      </h3>
    </div>
  );
}

function DetailRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | null | undefined;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-[#171512]/35">
        {icon}
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-[#171512]/70">
        {value || "—"}
      </p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  green = false,
}: {
  label: string;
  value: string;
  green?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-[#171512]/45">
        {label}
      </span>

      <span
        className={
          green
            ? "font-medium text-emerald-700"
            : "font-medium text-[#171512]"
        }
      >
        {value}
      </span>
    </div>
  );
}