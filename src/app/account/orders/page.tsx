import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

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
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function getStatusIcon(status: string) {
  switch (status) {
    case "delivered":
      return <CheckCircle2 size={15} />;

    case "shipped":
      return <Truck size={15} />;

    case "processing":
    case "packed":
      return <Package size={15} />;

    case "cancelled":
    case "returned":
      return <XCircle size={15} />;

    default:
      return <Clock3 size={15} />;
  }
}

function getStatusClasses(status: string) {
  switch (status) {
    case "delivered":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "shipped":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "processing":
    case "packed":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "cancelled":
    case "returned":
      return "border-red-200 bg-red-50 text-red-700";

    default:
      return "border-[#171512]/10 bg-[#F7F4EE] text-[#171512]/65";
  }
}

function formatStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function AccountOrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account/orders");
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        order_number,
        total_amount,
        currency,
        payment_status,
        order_status,
        created_at,
        order_items (
          id,
          product_name,
          product_slug,
          product_image_url,
          quantity,
          unit_price,
          total_price
        )
      `,
    )
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Account orders fetch error:", error);
  }

  const userOrders = orders ?? [];

  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#171512]">
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-12 lg:py-24">

        {/* HEADER */}
        <div className="mb-10">
          <Link
            href="/account"
            className="
              mb-8
              inline-flex
              items-center
              gap-3
              font-sans
              text-[11px]
              font-bold
              uppercase
              tracking-[0.22em]
              text-[#171512]/45
              transition-colors
              hover:text-[#765A32]
            "
          >
            <ArrowLeft size={14} />
            Back to Account
          </Link>

          <p
            className="
              mb-4
              font-sans
              text-[11px]
              font-bold
              uppercase
              tracking-[0.3em]
              text-[#765A32]
            "
          >
            Account
          </p>

          <h1
            className="
              font-serif
              text-5xl
              font-semibold
              leading-none
              tracking-[-0.04em]
              sm:text-6xl
            "
          >
            My Orders
          </h1>

          <p
            className="
              mt-5
              max-w-2xl
              font-sans
              text-base
              font-medium
              leading-7
              text-[#171512]/50
            "
          >
            View your NIRA purchases, payment status, order progress,
            and complete order details.
          </p>
        </div>

        {/* ORDERS */}
        {userOrders.length === 0 ? (
          <div
            className="
              border
              border-[#171512]/10
              bg-white
              px-6
              py-20
              text-center
              sm:px-10
            "
          >
            <div
              className="
                mx-auto
                flex
                h-16
                w-16
                items-center
                justify-center
                border
                border-[#765A32]/20
                bg-[#F7F4EE]
              "
            >
              <Package
                size={27}
                strokeWidth={1.2}
                className="text-[#765A32]"
              />
            </div>

            <h2
              className="
                mt-7
                font-serif
                text-3xl
                font-semibold
                text-[#171512]/85
              "
            >
              No orders yet
            </h2>

            <p
              className="
                mx-auto
                mt-3
                max-w-md
                font-sans
                text-sm
                font-medium
                leading-6
                text-[#171512]/45
              "
            >
              Your NIRA purchases will appear here once you
              place your first order.
            </p>

            <Link
              href="/collections"
              className="
                mt-8
                inline-flex
                min-h-11
                items-center
                gap-3
                bg-[#765A32]
                px-7
                font-sans
                text-[10px]
                font-bold
                uppercase
                tracking-[0.2em]
                text-white
                transition
                hover:bg-[#171512]
              "
            >
              Explore Collection
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {userOrders.map((order) => {
              const orderItems = Array.isArray(order.order_items)
                ? order.order_items
                : [];

              const firstItem = orderItems[0];

              const itemCount = orderItems.reduce(
                (total, item) =>
                  total + Number(item.quantity ?? 0),
                0,
              );

              return (
                <article
                  key={order.id}
                  className="
                    border
                    border-[#171512]/10
                    bg-white
                    transition
                    duration-300
                    hover:border-[#765A32]/25
                  "
                >
                  {/* TOP */}
                  <div
                    className="
                      flex
                      flex-col
                      gap-5
                      border-b
                      border-[#171512]/10
                      px-6
                      py-6
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                      sm:px-8
                    "
                  >
                    <div>
                      <p
                        className="
                          font-sans
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.2em]
                          text-[#765A32]
                        "
                      >
                        Order
                      </p>

                      <h2
                        className="
                          mt-1
                          font-serif
                          text-2xl
                          font-semibold
                          text-[#171512]
                        "
                      >
                        #{order.order_number}
                      </h2>

                      <p
                        className="
                          mt-2
                          font-sans
                          text-xs
                          font-medium
                          text-[#171512]/40
                        "
                      >
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
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
                          tracking-[0.16em]
                          ${getStatusClasses(order.order_status)}
                        `}
                      >
                        {getStatusIcon(order.order_status)}
                        {formatStatus(order.order_status)}
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
                          tracking-[0.16em]
                          ${
                            order.payment_status === "paid"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : order.payment_status === "failed"
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-amber-200 bg-amber-50 text-amber-700"
                          }
                        `}
                      >
                        Payment: {formatStatus(order.payment_status)}
                      </span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="flex flex-col gap-6 px-6 py-6 sm:px-8 lg:flex-row lg:items-center">

                    {/* PRODUCT PREVIEW */}
                    <div className="flex min-w-0 flex-1 gap-5">
                      <div
                        className="
                          h-24
                          w-24
                          shrink-0
                          overflow-hidden
                          bg-[#F3F0E9]
                        "
                      >
                        {firstItem?.product_image_url ? (
                          <img
                            src={firstItem.product_image_url}
                            alt={
                              firstItem.product_name ||
                              "NIRA product"
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div
                            className="
                              flex
                              h-full
                              w-full
                              items-center
                              justify-center
                              font-serif
                              text-lg
                              text-[#765A32]/50
                            "
                          >
                            N
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className="
                            font-serif
                            text-2xl
                            font-medium
                            text-[#171512]
                          "
                        >
                          {firstItem?.product_name ||
                            "NIRA Furniture"}
                        </p>

                        {orderItems.length > 1 && (
                          <p
                            className="
                              mt-1
                              font-sans
                              text-xs
                              font-medium
                              text-[#171512]/45
                            "
                          >
                            + {orderItems.length - 1} more{" "}
                            {orderItems.length - 1 === 1
                              ? "item"
                              : "items"}
                          </p>
                        )}

                        <p
                          className="
                            mt-2
                            font-sans
                            text-xs
                            font-medium
                            uppercase
                            tracking-[0.12em]
                            text-[#171512]/35
                          "
                        >
                          {itemCount}{" "}
                          {itemCount === 1
                            ? "item"
                            : "items"}
                        </p>
                      </div>
                    </div>

                    {/* TOTAL */}
                    <div className="lg:min-w-[190px] lg:text-right">
                      <p
                        className="
                          font-sans
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-[0.2em]
                          text-[#171512]/35
                        "
                      >
                        Order Total
                      </p>

                      <p
                        className="
                          mt-1
                          font-serif
                          text-3xl
                          font-medium
                          text-[#171512]
                        "
                      >
                        {formatMoney(
                          order.total_amount,
                          order.currency,
                        )}
                      </p>
                    </div>

                    {/* VIEW */}
                    <div className="lg:min-w-[150px]">
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="
                          group
                          inline-flex
                          w-full
                          items-center
                          justify-center
                          gap-3
                          border
                          border-[#171512]/15
                          px-5
                          py-3.5
                          font-sans
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.18em]
                          text-[#171512]
                          transition
                          hover:border-[#765A32]
                          hover:bg-[#765A32]
                          hover:text-white
                        "
                      >
                        View Order
                        <ArrowRight
                          size={14}
                          className="
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                          "
                        />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* BACK */}
        <div className="mt-10">
          <Link
            href="/account"
            className="
              inline-flex
              items-center
              gap-3
              font-sans
              text-[11px]
              font-bold
              uppercase
              tracking-[0.22em]
              text-[#171512]/45
              transition-colors
              hover:text-[#765A32]
            "
          >
            <ArrowLeft size={14} />
            Back to Account
          </Link>
        </div>
      </section>
    </main>
  );
}