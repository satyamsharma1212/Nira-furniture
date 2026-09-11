import Link from "next/link";
import { redirect } from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Package,
  RotateCcw,
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

  /* =========================================================
     AUTH
  ========================================================= */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account/orders");
  }

  /* =========================================================
     FETCH ORDERS
  ========================================================= */

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

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#F7F4EE] text-[#171512]">
      <section
        className="
          mx-auto
          max-w-7xl
          px-5
          py-14
          sm:px-8
          lg:px-10
          lg:py-20
          xl:px-12
        "
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-12">
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
            View your NIRA purchases, payment status,
            order progress, and complete order details.
          </p>
        </div>

        {/* =====================================================
            ORDERS
        ====================================================== */}

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
          <div className="space-y-6">
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

              /*
               * Customer can request a return only after
               * the order has been shipped.
               */
              const canReturn =
                order.order_status === "shipped";

              return (
                <article
                  key={order.id}
                  className="
                    overflow-hidden
                    border
                    border-[#171512]/10
                    bg-white
                    shadow-[0_8px_30px_rgba(23,21,18,0.025)]
                    transition-all
                    duration-300
                    hover:border-[#765A32]/25
                    hover:shadow-[0_12px_40px_rgba(23,21,18,0.05)]
                  "
                >
                  {/* =================================================
                      TOP / ORDER HEADER
                  ================================================== */}

                  <div
                    className="
                      flex
                      flex-col
                      gap-5
                      border-b
                      border-[#171512]/10
                      px-6
                      py-6
                      sm:px-8
                      lg:flex-row
                      lg:items-center
                      lg:justify-between
                      lg:px-10
                    "
                  >
                    {/* ORDER INFORMATION */}

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
                          sm:text-3xl
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
                        Placed on{" "}
                        {formatDate(order.created_at)}
                      </p>
                    </div>

                    {/* STATUS */}

                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* ORDER STATUS */}

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
                          ${getStatusClasses(
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

                      {/* PAYMENT STATUS */}

                      <span
                        className={`
                          inline-flex
                          items-center
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
                            order.payment_status ===
                            "paid"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : order.payment_status ===
                                  "failed"
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-amber-200 bg-amber-50 text-amber-700"
                          }
                        `}
                      >
                        Payment:{" "}
                        {formatStatus(
                          order.payment_status,
                        )}
                      </span>
                    </div>
                  </div>

                  {/* =================================================
                      CONTENT
                  ================================================== */}

                  <div
                    className="
                      grid
                      gap-8
                      px-6
                      py-7
                      sm:px-8
                      lg:grid-cols-[minmax(0,1fr)_auto_190px]
                      lg:items-center
                      lg:gap-10
                      lg:px-10
                      lg:py-9
                    "
                  >
                    {/* =================================================
                        PRODUCT PREVIEW
                    ================================================== */}

                    <div className="flex min-w-0 items-center gap-6">
                      {/* PRODUCT IMAGE */}

                      <div
                        className="
                          h-28
                          w-28
                          shrink-0
                          overflow-hidden
                          border
                          border-[#171512]/5
                          bg-[#F3F0E9]
                          sm:h-32
                          sm:w-32
                        "
                      >
                        {firstItem?.product_image_url ? (
                          <img
                            src={
                              firstItem.product_image_url
                            }
                            alt={
                              firstItem.product_name ||
                              "NIRA product"
                            }
                            className="
                              h-full
                              w-full
                              object-cover
                              transition-transform
                              duration-500
                              hover:scale-105
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
                              font-serif
                              text-2xl
                              text-[#765A32]/50
                            "
                          >
                            N
                          </div>
                        )}
                      </div>

                      {/* PRODUCT DETAILS */}

                      <div className="min-w-0">
                        <p
                          className="
                            max-w-md
                            font-serif
                            text-xl
                            font-medium
                            leading-tight
                            text-[#171512]
                            sm:text-2xl
                          "
                        >
                          {firstItem?.product_name ||
                            "NIRA Furniture"}
                        </p>

                        {orderItems.length > 1 && (
                          <p
                            className="
                              mt-2
                              font-sans
                              text-xs
                              font-medium
                              text-[#171512]/45
                            "
                          >
                            +{" "}
                            {orderItems.length - 1}{" "}
                            more{" "}
                            {orderItems.length - 1 === 1
                              ? "item"
                              : "items"}
                          </p>
                        )}

                        <p
                          className="
                            mt-3
                            font-sans
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.15em]
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

                    {/* =================================================
                        TOTAL
                    ================================================== */}

                    <div
                      className="
                        border-t
                        border-[#171512]/10
                        pt-5
                        lg:border-l
                        lg:border-t-0
                        lg:pl-10
                        lg:pt-0
                        lg:text-right
                      "
                    >
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
                          text-2xl
                          font-medium
                          text-[#171512]
                          sm:text-3xl
                        "
                      >
                        {formatMoney(
                          order.total_amount,
                          order.currency,
                        )}
                      </p>
                    </div>

                    {/* =================================================
                        ACTIONS
                    ================================================== */}

                    <div
                      className="
                        flex
                        w-full
                        flex-col
                        gap-2.5
                        lg:w-[190px]
                      "
                    >
                      {/* VIEW ORDER */}

                      <Link
                        href={`/account/orders/${order.id}`}
                        className="
                          group
                          inline-flex
                          h-11
                          w-full
                          items-center
                          justify-center
                          gap-2.5
                          border
                          border-[#171512]/15
                          bg-white
                          px-4
                          font-sans
                          text-[9px]
                          font-bold
                          uppercase
                          tracking-[0.16em]
                          text-[#171512]
                          transition-all
                          duration-300
                          hover:border-[#765A32]
                          hover:bg-[#765A32]
                          hover:text-white
                        "
                      >
                        View Order

                        <ArrowRight
                          size={13}
                          className="
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                          "
                        />
                      </Link>

                      {/* RETURN ORDER */}

                      {canReturn && (
                        <Link
                          href={`/account/orders/${order.id}?return=true`}
                          className="
                            group
                            inline-flex
                            h-9
                            w-full
                            items-center
                            justify-center
                            gap-2
                            border
                            border-[#765A32]
                            bg-[#765A32]
                            px-3
                            font-sans
                            text-[8px]
                            font-bold
                            uppercase
                            tracking-[0.14em]
                            text-white
                            transition-all
                            duration-300
                            hover:border-[#171512]
                            hover:bg-[#171512]
                          "
                        >
                          <RotateCcw
                            size={12}
                            className="
                              transition-transform
                              duration-300
                              group-hover:-rotate-12
                            "
                          />

                          Return Order
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* =====================================================
            BACK TO ACCOUNT
        ====================================================== */}

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