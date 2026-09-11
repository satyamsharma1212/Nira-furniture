import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  Truck,
  User,
  XCircle,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

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

function formatDate(value: string | null | undefined) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatStatus(value: string | null | undefined) {
  if (!value) return "—";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function getOrderStatusClasses(status: string) {
  switch (status) {
    case "delivered":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "shipped":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "confirmed":
    case "processing":
    case "packed":
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

function getReturnStatusClasses(status: string) {
  switch (status) {
    case "approved":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "completed":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "rejected":
    case "cancelled":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "delivered":
      return <CheckCircle2 size={16} />;

    case "shipped":
      return <Truck size={16} />;

    case "confirmed":
    case "processing":
    case "packed":
      return <Package size={16} />;

    case "cancelled":
    case "returned":
      return <XCircle size={16} />;

    default:
      return <Clock3 size={16} />;
  }
}

export default async function AdminOrderDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  /* =========================================================
     AUTHENTICATION
  ========================================================= */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/admin/login?next=/admin/orders/${encodeURIComponent(id)}`,
    );
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
     GET ORDER
  ========================================================= */

  const {
    data: order,
    error: orderError,
  } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (orderError) {
    console.error(
      "Admin order fetch error:",
      orderError,
    );

    notFound();
  }

  if (!order) {
    notFound();
  }

  /* =========================================================
     GET ORDER ITEMS
  ========================================================= */

  const {
    data: orderItems,
    error: orderItemsError,
  } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", {
      ascending: true,
    });

  if (orderItemsError) {
    console.error(
      "Admin order items fetch error:",
      orderItemsError,
    );
  }

  const items = orderItems ?? [];

  /* =========================================================
     GET CUSTOMER RETURN REQUEST
  ========================================================= */

  const {
    data: returnRequest,
    error: returnRequestError,
  } = await supabase
    .from("return_requests")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (returnRequestError) {
    console.error(
      "Return request fetch error:",
      returnRequestError,
    );
  }

  const totalItems = items.reduce(
    (total, item) =>
      total +
      Number(item.quantity ?? 0),
    0,
  );

  /* =========================================================
     RETURN REQUEST MANAGEMENT
  ========================================================= */

  async function updateReturnRequest(
    formData: FormData,
  ) {
    "use server";

    const returnRequestId = String(
      formData.get("return_request_id") || "",
    );

    const action = String(
      formData.get("return_action") || "",
    );

    const adminNote = String(
      formData.get("admin_note") || "",
    ).trim();

    if (
      !returnRequestId ||
      !["approve", "reject", "complete", "cancel"].includes(
        action,
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

    const { data: request, error: requestError } =
      await client
        .from("return_requests")
        .select("id, order_id, status")
        .eq("id", returnRequestId)
        .maybeSingle();

    if (requestError || !request) {
      throw new Error(
        requestError?.message ||
          "Return request not found.",
      );
    }

    let nextStatus = "";

    if (action === "approve") {
      if (request.status !== "pending") {
        throw new Error(
          "Only pending return requests can be approved.",
        );
      }

      nextStatus = "approved";
    }

    if (action === "reject") {
      if (request.status !== "pending") {
        throw new Error(
          "Only pending return requests can be rejected.",
        );
      }

      nextStatus = "rejected";
    }

    if (action === "complete") {
      if (request.status !== "approved") {
        throw new Error(
          "Only approved return requests can be completed.",
        );
      }

      nextStatus = "completed";
    }

    if (action === "cancel") {
      if (
        request.status === "completed" ||
        request.status === "cancelled"
      ) {
        throw new Error(
          "This return request can no longer be cancelled.",
        );
      }

      nextStatus = "cancelled";
    }

    const { error: updateError } = await client
      .from("return_requests")
      .update({
        status: nextStatus,
        ...(adminNote
          ? { admin_note: adminNote }
          : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", returnRequestId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    // When the return is completed, also mark the order returned.
    if (nextStatus === "completed") {
      const { error: orderUpdateError } =
        await client
          .from("orders")
          .update({
            order_status: "returned",
            updated_at: new Date().toISOString(),
          })
          .eq("id", request.order_id);

      if (orderUpdateError) {
        throw new Error(orderUpdateError.message);
      }
    }

    redirect(
      `/admin/orders/${request.order_id}`,
    );
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

    const { data: currentAdmin } =
      await client
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
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) {
      throw new Error(error.message);
    }

    redirect(
      `/admin/orders/${orderId}`,
    );
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

    const { data: currentAdmin } =
      await client
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
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) {
      throw new Error(error.message);
    }

    redirect(
      `/admin/orders/${orderId}`,
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#171512]">
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="mb-10 border-b border-[#171512]/10 pb-8">

          <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/admin/orders"
              className="
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
              Back to Orders
            </Link>

            <Link
              href="/admin"
              className="
                font-sans
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-[#171512]/35
                transition
                hover:text-[#765A32]
              "
            >
              Dashboard
            </Link>
          </div>

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[#765A32]">
                Customer Order
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <h1 className="font-serif text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                  #{order.order_number}
                </h1>

                <span
                  className={`
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-4
                    py-2
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
                  {getStatusIcon(
                    order.order_status,
                  )}

                  {formatStatus(
                    order.order_status,
                  )}
                </span>
              </div>

              <p className="mt-4 text-sm text-[#171512]/45">
                Placed on{" "}
                {formatDate(order.created_at)}
              </p>
            </div>

            <div
              className={`
                inline-flex
                w-fit
                rounded-full
                border
                px-4
                py-2
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
            </div>
          </div>
        </div>

        {/* =====================================================
            BUYER INFORMATION
        ====================================================== */}

        <div className="grid gap-6 lg:grid-cols-3">

          <section className="border border-[#171512]/10 bg-white p-6 sm:p-8">
            <SectionHeading
              icon={<User size={17} />}
              title="Buyer Details"
            />

            <div className="mt-7 space-y-5">
              <InfoBlock
                label="Full Name"
                value={order.customer_name}
              />

              <InfoBlock
                label="Email Address"
                value={order.customer_email}
                icon={<Mail size={14} />}
              />

              <InfoBlock
                label="Phone Number"
                value={order.customer_phone}
                icon={<Phone size={14} />}
              />

              <InfoBlock
                label="Customer ID"
                value={order.user_id}
              />
            </div>
          </section>

          {/* SHIPPING */}
          <section className="border border-[#171512]/10 bg-white p-6 sm:p-8">
            <SectionHeading
              icon={<MapPin size={17} />}
              title="Shipping Address"
            />

            <Address
              name={order.customer_name}
              line1={
                order.shipping_address_line1
              }
              line2={
                order.shipping_address_line2
              }
              city={order.shipping_city}
              state={order.shipping_state}
              postal={
                order.shipping_postal_code
              }
              country={
                order.shipping_country
              }
              phone={order.customer_phone}
            />
          </section>

          {/* BILLING */}
          <section className="border border-[#171512]/10 bg-white p-6 sm:p-8">
            <SectionHeading
              icon={<MapPin size={17} />}
              title="Billing Address"
            />

            {order.billing_address_line1 ? (
              <Address
                name={order.customer_name}
                line1={
                  order.billing_address_line1
                }
                line2={
                  order.billing_address_line2
                }
                city={order.billing_city}
                state={order.billing_state}
                postal={
                  order.billing_postal_code
                }
                country={
                  order.billing_country
                }
              />
            ) : (
              <div className="mt-7 border border-dashed border-[#171512]/10 bg-[#FBF9F3] p-5">
                <p className="text-sm font-medium text-[#171512]/55">
                  Billing address is the same
                  as the shipping address.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* =====================================================
            ORDER ITEMS
        ====================================================== */}

        <section className="mt-6 overflow-hidden border border-[#171512]/10 bg-white">

          <div className="flex flex-col gap-3 border-b border-[#171512]/10 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <SectionHeading
              icon={<ShoppingBag size={17} />}
              title="Products Ordered"
            />

            <div className="text-xs font-medium text-[#171512]/40">
              {items.length}{" "}
              {items.length === 1
                ? "product"
                : "products"}
              {" • "}
              {totalItems}{" "}
              {totalItems === 1
                ? "unit"
                : "units"}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="px-8 py-16 text-center">
              <Package
                size={36}
                strokeWidth={1.2}
                className="mx-auto text-[#765A32]/60"
              />

              <p className="mt-4 text-sm text-[#171512]/45">
                No products were found for
                this order.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#171512]/10">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-6 px-6 py-7 sm:px-8 lg:grid-cols-[120px_1fr_auto]"
                >
                  {/* IMAGE */}
                  <div className="h-28 w-28 overflow-hidden bg-[#F3F0E9]">
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
                      <div className="flex h-full w-full items-center justify-center font-serif text-2xl text-[#765A32]/50">
                        N
                      </div>
                    )}
                  </div>

                  {/* PRODUCT */}
                  <div className="min-w-0">
                    <Link
                      href={`/products/${item.product_slug}`}
                      className="font-serif text-2xl font-semibold text-[#171512] transition hover:text-[#765A32]"
                    >
                      {item.product_name}
                    </Link>

                    <p className="mt-2 text-xs text-[#171512]/40">
                      Product slug:{" "}
                      {item.product_slug}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-6 text-sm">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#171512]/35">
                          Quantity
                        </p>

                        <p className="mt-1 font-medium">
                          {item.quantity}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#171512]/35">
                          Unit Price
                        </p>

                        <p className="mt-1 font-medium">
                          {formatMoney(
                            item.unit_price,
                            order.currency,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* TOTAL */}
                  <div className="lg:min-w-[160px] lg:text-right">
                    <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#171512]/35">
                      Item Total
                    </p>

                    <p className="mt-1 font-serif text-3xl font-medium text-[#765A32]">
                      {formatMoney(
                        item.total_price,
                        order.currency,
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* =====================================================
            RETURN REQUEST
        ====================================================== */}

        {returnRequest && (
          <section className="mt-6 overflow-hidden border border-[#765A32]/20 bg-white">
            <div className="flex flex-col gap-4 border-b border-[#171512]/10 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <div>
                <p className="mb-2 font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-[#765A32]">
                  Customer Request
                </p>

                <h2 className="font-serif text-2xl font-semibold text-[#171512]">
                  Return Request
                </h2>

                <p className="mt-1 text-xs text-[#171512]/40">
                  Submitted on{" "}
                  {formatDate(returnRequest.created_at)}
                </p>
              </div>

              <span
                className={`
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  px-4
                  py-2
                  font-sans
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  ${getReturnStatusClasses(
                    returnRequest.status,
                  )}
                `}
              >
                {formatStatus(returnRequest.status)}
              </span>
            </div>

            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_1.2fr]">
              <div className="space-y-5">
                <div className="border border-[#765A32]/10 bg-[#FBF9F3] p-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#765A32]">
                    Reason for Return
                  </p>

                  <p className="mt-2 text-sm font-medium leading-6 text-[#171512]/75">
                    {returnRequest.reason || "—"}
                  </p>
                </div>

                <div className="border border-[#171512]/10 bg-[#FAF8F2] p-5">
                  <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#171512]/40">
                    Customer Description
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#171512]/65">
                    {returnRequest.description?.trim() ||
                      "No additional details were provided by the customer."}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoBlock
                    label="Request Status"
                    value={formatStatus(returnRequest.status)}
                  />

                  <InfoBlock
                    label="Requested On"
                    value={formatDate(returnRequest.created_at)}
                  />

                  <InfoBlock
                    label="Last Updated"
                    value={formatDate(returnRequest.updated_at)}
                  />

                  <InfoBlock
                    label="Order Status"
                    value={formatStatus(order.order_status)}
                  />
                </div>

                {returnRequest.admin_note && (
                  <div className="border border-[#765A32]/15 bg-[#FBF9F3] p-5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#765A32]">
                      Admin Note
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#171512]/65">
                      {returnRequest.admin_note}
                    </p>
                  </div>
                )}
              </div>

              <div className="border border-[#171512]/10 bg-[#FAF8F2]">
                <div className="border-b border-[#171512]/10 px-5 py-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#765A32]">
                    Products in This Return
                  </p>

                  <p className="mt-1 text-xs text-[#171512]/40">
                    {items.length}{" "}
                    {items.length === 1 ? "product" : "products"}{" "}
                    • {totalItems}{" "}
                    {totalItems === 1 ? "unit" : "units"}
                  </p>
                </div>

                <div className="divide-y divide-[#171512]/10">
                  {items.map((item) => (
                    <div
                      key={`return-${item.id}`}
                      className="flex items-center gap-4 px-5 py-4"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden bg-[#F3F0E9]">
                        {item.product_image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.product_image_url}
                            alt={item.product_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-serif text-lg text-[#765A32]/50">
                            N
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-lg font-medium leading-tight text-[#171512]">
                          {item.product_name}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#171512]/40">
                          <span>Qty: {item.quantity}</span>

                          <span>
                            {formatMoney(
                              item.unit_price,
                              order.currency,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* =================================================
                ADMIN RETURN ACTIONS
            ================================================= */}

            <div className="border-t border-[#171512]/10 bg-[#FBF9F3] px-6 py-6 sm:px-8">
              <div className="mb-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#765A32]">
                  Admin Action
                </p>

                <p className="mt-2 text-sm leading-6 text-[#171512]/50">
                  Manage this customer's return request from here.
                </p>
              </div>

              {returnRequest.status === "pending" && (
                <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
                  <form action={updateReturnRequest}>
                    <input
                      type="hidden"
                      name="return_request_id"
                      value={returnRequest.id}
                    />

                    <input
                      type="hidden"
                      name="return_action"
                      value="approve"
                    />

                    <input
                      type="hidden"
                      name="admin_note"
                      value="Return request approved by admin."
                    />

                    <button
                      type="submit"
                      className="inline-flex h-12 w-full items-center justify-center gap-2 bg-[#765A32] px-6 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#171512]"
                    >
                      <CheckCircle2 size={15} />
                      Approve Return
                    </button>
                  </form>

                  <form
                    action={updateReturnRequest}
                    className="lg:min-w-[170px]"
                  >
                    <input
                      type="hidden"
                      name="return_request_id"
                      value={returnRequest.id}
                    />

                    <input
                      type="hidden"
                      name="return_action"
                      value="reject"
                    />

                    <input
                      type="hidden"
                      name="admin_note"
                      value="Return request rejected by admin."
                    />

                    <button
                      type="submit"
                      className="inline-flex h-12 w-full items-center justify-center gap-2 border border-red-200 bg-white px-6 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-red-700 transition hover:border-red-700 hover:bg-red-50"
                    >
                      <XCircle size={15} />
                      Reject Return
                    </button>
                  </form>
                </div>
              )}

              {returnRequest.status === "approved" && (
                <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                  <div className="flex items-center border border-emerald-200 bg-emerald-50 px-5 py-4">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                        Return Approved
                      </p>

                      <p className="mt-1 text-sm text-emerald-800/70">
                        The customer return has been approved.
                        Complete it once the returned product has
                        been received and processed.
                      </p>
                    </div>
                  </div>

                  <form action={updateReturnRequest}>
                    <input
                      type="hidden"
                      name="return_request_id"
                      value={returnRequest.id}
                    />

                    <input
                      type="hidden"
                      name="return_action"
                      value="complete"
                    />

                    <input
                      type="hidden"
                      name="admin_note"
                      value="Return completed and product received."
                    />

                    <button
                      type="submit"
                      className="inline-flex h-12 w-full items-center justify-center gap-2 bg-[#171512] px-7 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#765A32] lg:w-auto"
                    >
                      <CheckCircle2 size={15} />
                      Complete Return
                    </button>
                  </form>
                </div>
              )}

              {returnRequest.status === "rejected" && (
                <div className="flex items-center gap-3 border border-red-200 bg-red-50 px-5 py-4">
                  <XCircle
                    size={18}
                    className="shrink-0 text-red-700"
                  />

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-red-700">
                      Return Rejected
                    </p>

                    <p className="mt-1 text-sm text-red-800/70">
                      This return request has been rejected.
                    </p>
                  </div>
                </div>
              )}

              {returnRequest.status === "completed" && (
                <div className="flex items-center gap-3 border border-blue-200 bg-blue-50 px-5 py-4">
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-blue-700"
                  />

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-700">
                      Return Completed
                    </p>

                    <p className="mt-1 text-sm text-blue-800/70">
                      The return has been completed and the order
                      has been marked as returned.
                    </p>
                  </div>
                </div>
              )}

              {returnRequest.status !== "completed" &&
                returnRequest.status !== "rejected" &&
                returnRequest.status !== "cancelled" && (
                  <form
                    action={updateReturnRequest}
                    className="mt-5"
                  >
                    <input
                      type="hidden"
                      name="return_request_id"
                      value={returnRequest.id}
                    />

                    <input
                      type="hidden"
                      name="return_action"
                      value="cancel"
                    />

                    <label
                      htmlFor={`admin-note-${returnRequest.id}`}
                      className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-[#171512]/40"
                    >
                      Admin Note
                    </label>

                    <textarea
                      id={`admin-note-${returnRequest.id}`}
                      name="admin_note"
                      rows={3}
                      placeholder="Add a note about the return..."
                      className="w-full resize-none border border-[#171512]/15 bg-white px-4 py-3 text-sm text-[#171512] outline-none placeholder:text-[#171512]/25 focus:border-[#765A32]"
                    />

                    <p className="mt-2 text-[10px] text-[#171512]/35">
                      The note will be saved when an action is
                      submitted. Use the buttons above to approve
                      or reject the request.
                    </p>
                  </form>
                )}
            </div>
          </section>
        )}

        {/* =====================================================
            PAYMENT + ORDER SUMMARY
        ====================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_390px]">

          {/* PAYMENT INFORMATION */}
          <section className="border border-[#171512]/10 bg-white p-6 sm:p-8">

            <SectionHeading
              icon={<CreditCard size={17} />}
              title="Payment Information"
            />

            <div className="mt-7 grid gap-6 sm:grid-cols-2">

              <InfoBlock
                label="Payment Status"
                value={formatStatus(
                  order.payment_status,
                )}
              />

              <InfoBlock
                label="Payment Method"
                value={
                  order.payment_method ||
                  "Online Payment"
                }
              />

              <InfoBlock
                label="Currency"
                value={order.currency}
              />

              <InfoBlock
                label="Order Amount"
                value={formatMoney(
                  order.total_amount,
                  order.currency,
                )}
              />

              {order.cashfree_order_id && (
                <InfoBlock
                  label="Gateway Order ID"
                  value={
                    order.cashfree_order_id
                  }
                />
              )}

              {order.cashfree_payment_session_id && (
                <InfoBlock
                  label="Payment Session ID"
                  value={
                    order.cashfree_payment_session_id
                  }
                />
              )}

              {order.cashfree_payment_id && (
                <InfoBlock
                  label="Payment ID"
                  value={
                    order.cashfree_payment_id
                  }
                />
              )}
            </div>
          </section>

          {/* SUMMARY */}
          <aside className="h-fit border border-[#171512]/10 bg-white lg:sticky lg:top-24">
            <div className="border-b border-[#171512]/10 px-6 py-6 sm:px-7">
              <h2 className="font-serif text-2xl font-semibold">
                Order Summary
              </h2>
            </div>

            <div className="space-y-4 px-6 py-6 sm:px-7">
              <SummaryRow
                label={`Subtotal (${totalItems} items)`}
                value={formatMoney(
                  order.subtotal,
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
                        order.shipping_amount,
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
                    order.discount_amount,
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
                    order.tax_amount,
                    order.currency,
                  )}
                />
              )}

              <div className="border-t border-[#171512]/10 pt-5">
                <div className="flex items-end justify-between gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#171512]/40">
                    Grand Total
                  </span>

                  <span className="font-serif text-3xl font-medium text-[#765A32]">
                    {formatMoney(
                      order.total_amount,
                      order.currency,
                    )}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* =====================================================
            ORDER MANAGEMENT
        ====================================================== */}

        <section className="mt-6 border border-[#171512]/10 bg-white p-6 sm:p-8">

          <SectionHeading
            icon={<Truck size={17} />}
            title="Order Management"
          />

          <div className="mt-7 grid gap-7 lg:grid-cols-2">

            {/* ORDER STATUS */}
            <form action={updateOrderStatus}>
              <input
                type="hidden"
                name="order_id"
                value={order.id}
              />

              <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-[#171512]/40">
                Change Order Status
              </label>

              <select
                name="order_status"
                defaultValue={
                  order.order_status
                }
                className="
                  h-13
                  w-full
                  border
                  border-[#171512]/15
                  bg-[#FAF8F2]
                  px-4
                  text-sm
                  font-medium
                  text-[#171512]
                  outline-none
                  focus:border-[#765A32]
                "
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
                className="
                  mt-3
                  w-full
                  bg-[#171512]
                  px-6
                  py-4
                  font-sans
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-white
                  transition
                  hover:bg-[#765A32]
                "
              >
                Update Order Status
              </button>
            </form>

            {/* PAYMENT STATUS */}
            <form action={updatePaymentStatus}>
              <input
                type="hidden"
                name="order_id"
                value={order.id}
              />

              <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-[#171512]/40">
                Change Payment Status
              </label>

              <select
                name="payment_status"
                defaultValue={
                  order.payment_status
                }
                className="
                  h-13
                  w-full
                  border
                  border-[#171512]/15
                  bg-[#FAF8F2]
                  px-4
                  text-sm
                  font-medium
                  text-[#171512]
                  outline-none
                  focus:border-[#765A32]
                "
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
                className="
                  mt-3
                  w-full
                  border
                  border-[#171512]/20
                  bg-white
                  px-6
                  py-4
                  font-sans
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-[#171512]
                  transition
                  hover:border-[#765A32]
                  hover:text-[#765A32]
                "
              >
                Update Payment Status
              </button>
            </form>
          </div>
        </section>

        {/* =====================================================
            NOTES
        ====================================================== */}

        {(order.customer_note ||
          order.notes) && (
          <section className="mt-6 border border-[#171512]/10 bg-white p-6 sm:p-8">

            <SectionHeading
              icon={<FileText size={17} />}
              title="Order Notes"
            />

            <div className="mt-7 grid gap-5 lg:grid-cols-2">

              {order.customer_note && (
                <div className="border border-[#765A32]/10 bg-[#FBF9F3] p-6">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#765A32]">
                    Customer Note
                  </p>

                  <p className="mt-3 text-sm leading-7 text-[#171512]/65">
                    {order.customer_note}
                  </p>
                </div>
              )}

              {order.notes && (
                <div className="border border-[#171512]/10 bg-[#FAF8F2] p-6">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#171512]/45">
                    Admin Note
                  </p>

                  <p className="mt-3 text-sm leading-7 text-[#171512]/65">
                    {order.notes}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* =====================================================
            ORDER TIMELINE / META
        ====================================================== */}

        <section className="mt-6 border border-[#171512]/10 bg-white p-6 sm:p-8">

          <SectionHeading
            icon={<Clock3 size={17} />}
            title="Order Information"
          />

          <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <InfoBlock
              label="Order Number"
              value={order.order_number}
            />

            <InfoBlock
              label="Order ID"
              value={order.id}
            />

            <InfoBlock
              label="Created"
              value={formatDate(
                order.created_at,
              )}
            />

            <InfoBlock
              label="Last Updated"
              value={formatDate(
                order.updated_at,
              )}
            />
          </div>
        </section>

        {/* =====================================================
            CUSTOMER CONTACT
        ====================================================== */}

        <section className="mt-6 border border-[#171512]/10 bg-white p-6 sm:p-8">

          <SectionHeading
            icon={<Phone size={17} />}
            title="Contact Buyer"
          />

          <div className="mt-6 flex flex-wrap gap-3">

            <a
              href={`mailto:${order.customer_email}`}
              className="
                inline-flex
                items-center
                gap-2
                border
                border-[#171512]/15
                px-6
                py-3.5
                font-sans
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-[#171512]
                transition
                hover:border-[#765A32]
                hover:text-[#765A32]
              "
            >
              <Mail size={14} />
              Email Buyer
            </a>

            <a
              href={`tel:${order.customer_phone}`}
              className="
                inline-flex
                items-center
                gap-2
                bg-[#171512]
                px-6
                py-3.5
                font-sans
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-white
                transition
                hover:bg-[#765A32]
              "
            >
              <Phone size={14} />
              Call Buyer
            </a>
          </div>
        </section>

        {/* =====================================================
            BACK
        ====================================================== */}

        <div className="mt-10">
          <Link
            href="/admin/orders"
            className="
              inline-flex
              items-center
              gap-3
              font-sans
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-[#171512]/40
              transition
              hover:text-[#765A32]
            "
          >
            <ArrowLeft size={14} />
            Back to All Orders
          </Link>
        </div>

      </section>
    </main>
  );
}

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

function SectionHeading({
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

      <h2 className="font-serif text-2xl font-semibold text-[#171512]">
        {title}
      </h2>
    </div>
  );
}

function InfoBlock({
  label,
  value,
  icon,
}: {
  label: string;
  value:
    | string
    | number
    | null
    | undefined;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.17em] text-[#171512]/35">
        {icon}
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-medium leading-6 text-[#171512]/70">
        {value || "—"}
      </p>
    </div>
  );
}

function Address({
  name,
  line1,
  line2,
  city,
  state,
  postal,
  country,
  phone,
}: {
  name: string;
  line1: string | null;
  line2: string | null;
  city: string | null;
  state: string | null;
  postal: string | null;
  country: string | null;
  phone?: string | null;
}) {
  return (
    <div className="mt-7 border border-[#171512]/10 bg-[#FBF9F3] p-5">
      <div className="space-y-1 text-sm leading-7 text-[#171512]/65">
        <p className="font-semibold text-[#171512]">
          {name}
        </p>

        {line1 && <p>{line1}</p>}

        {line2 && <p>{line2}</p>}

        <p>
          {[city, state, postal]
            .filter(Boolean)
            .join(", ")}
        </p>

        {country && <p>{country}</p>}

        {phone && (
          <div className="border-t border-[#171512]/10 pt-3">
            <p className="text-[#171512]/45">
              Phone:{" "}
              <span className="font-medium text-[#171512]/70">
                {phone}
              </span>
            </p>
          </div>
        )}
      </div>
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