import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_REASONS = [
  "Damaged product",
  "Wrong product received",
  "Quality issue",
  "Product not as expected",
  "Other",
];

const RETURNABLE_STATUSES = [
  "shipped",
  "delivered",
];

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "You must be logged in.",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    const orderId = String(
      body.orderId || "",
    ).trim();

    const reason = String(
      body.reason || "",
    ).trim();

    const description = String(
      body.description || "",
    ).trim();

    if (!orderId) {
      return NextResponse.json(
        {
          error: "Order ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!ALLOWED_REASONS.includes(reason)) {
      return NextResponse.json(
        {
          error: "Please select a valid return reason.",
        },
        {
          status: 400,
        },
      );
    }

    /* =========================================================
       GET ORDER
    ========================================================= */

    const {
      data: order,
      error: orderError,
    } = await supabase
      .from("orders")
      .select(
        "id, user_id, order_status",
      )
      .eq("id", orderId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (orderError) {
      console.error(
        "Return order fetch error:",
        orderError,
      );

      return NextResponse.json(
        {
          error: orderError.message,
        },
        {
          status: 500,
        },
      );
    }

    if (!order) {
      return NextResponse.json(
        {
          error: "Order not found.",
        },
        {
          status: 404,
        },
      );
    }

    /* =========================================================
       RETURN ONLY AFTER SHIPPING
    ========================================================= */

    if (
      !RETURNABLE_STATUSES.includes(
        order.order_status,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "This order is not eligible for a return yet. Returns can be requested after the order has been shipped.",
        },
        {
          status: 400,
        },
      );
    }

    /* =========================================================
       CHECK EXISTING REQUEST
    ========================================================= */

    const {
      data: existingRequest,
      error: existingRequestError,
    } = await supabase
      .from("return_requests")
      .select(
        "id, status",
      )
      .eq("order_id", order.id)
      .eq("user_id", user.id)
      .in("status", [
        "pending",
        "approved",
      ])
      .limit(1)
      .maybeSingle();

    if (existingRequestError) {
      console.error(
        "Existing return request check error:",
        existingRequestError,
      );

      return NextResponse.json(
        {
          error:
            existingRequestError.message,
        },
        {
          status: 500,
        },
      );
    }

    if (existingRequest) {
      return NextResponse.json(
        {
          error:
            "A return request already exists for this order.",
          request: existingRequest,
        },
        {
          status: 409,
        },
      );
    }

    /* =========================================================
       CREATE RETURN REQUEST
    ========================================================= */

    const {
      data: returnRequest,
      error: insertError,
    } = await supabase
      .from("return_requests")
      .insert({
        order_id: order.id,
        user_id: user.id,
        reason,
        description:
          description || null,
        status: "pending",
      })
      .select(
        "id, order_id, reason, description, status, created_at",
      )
      .single();

    if (insertError) {
      console.error(
        "Return request creation error:",
        insertError,
      );

      return NextResponse.json(
        {
          error: insertError.message,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        request: returnRequest,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Return request API error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      {
        status: 500,
      },
    );
  }
}