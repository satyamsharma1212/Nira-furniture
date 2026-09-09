import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { createClient } from "@/lib/supabase/server";

/*
 * Cashfree sends the webhook signature
 * in the following headers:
 *
 * x-webhook-signature
 * x-webhook-timestamp
 *
 * We verify the signature before updating
 * the order/payment status.
 */

function verifyCashfreeSignature(
  rawBody: string,
  signature: string,
  timestamp: string,
  secretKey: string,
) {
  const signedPayload =
    timestamp + rawBody;

  const generatedSignature =
    crypto
      .createHmac(
        "sha256",
        secretKey,
      )
      .update(signedPayload)
      .digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(
      generatedSignature,
    ),
    Buffer.from(signature),
  );
}

function getPaymentMethod(
  paymentMethod: unknown,
) {
  if (
    !paymentMethod ||
    typeof paymentMethod !==
      "object"
  ) {
    return "Online Payment";
  }

  const method =
    paymentMethod as Record<
      string,
      unknown
    >;

  if (method.upi) {
    return "UPI";
  }

  if (method.card) {
    return "Card";
  }

  if (method.netbanking) {
    return "Net Banking";
  }

  if (method.app) {
    return "App";
  }

  if (method.wallet) {
    return "Wallet";
  }

  return "Online Payment";
}

export async function POST(
  request: NextRequest,
) {
  try {
    /*
     * -------------------------------------------------------
     * 1. CASHFREE SECRET KEY
     * -------------------------------------------------------
     */

    const secretKey =
      process.env.CASHFREE_SECRET_KEY;

    if (!secretKey) {
      console.error(
        "CASHFREE_SECRET_KEY is missing.",
      );

      return NextResponse.json(
        {
          error:
            "Cashfree webhook is not configured.",
        },
        { status: 500 },
      );
    }

    /*
     * -------------------------------------------------------
     * 2. READ RAW BODY
     * -------------------------------------------------------
     *
     * IMPORTANT:
     *
     * Do NOT use request.json()
     * before signature verification.
     *
     * Cashfree signature verification
     * requires the exact raw body.
     * -------------------------------------------------------
     */

    const rawBody =
      await request.text();

    /*
     * -------------------------------------------------------
     * 3. READ CASHFREE HEADERS
     * -------------------------------------------------------
     */

    const signature =
      request.headers.get(
        "x-webhook-signature",
      );

    const timestamp =
      request.headers.get(
        "x-webhook-timestamp",
      );

    if (
      !signature ||
      !timestamp
    ) {
      console.error(
        "Cashfree webhook signature headers are missing.",
      );

      return NextResponse.json(
        {
          error:
            "Missing webhook signature.",
        },
        { status: 401 },
      );
    }

    /*
     * -------------------------------------------------------
     * 4. VERIFY SIGNATURE
     * -------------------------------------------------------
     */

    let validSignature =
      false;

    try {
      validSignature =
        verifyCashfreeSignature(
          rawBody,
          signature,
          timestamp,
          secretKey,
        );
    } catch (error) {
      console.error(
        "Webhook signature verification error:",
        error,
      );

      validSignature =
        false;
    }

    if (!validSignature) {
      console.error(
        "Invalid Cashfree webhook signature.",
      );

      return NextResponse.json(
        {
          error:
            "Invalid webhook signature.",
        },
        { status: 401 },
      );
    }

    /*
     * -------------------------------------------------------
     * 5. PARSE WEBHOOK BODY
     * -------------------------------------------------------
     */

    let payload: any;

    try {
      payload =
        JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        {
          error:
            "Invalid webhook payload.",
        },
        { status: 400 },
      );
    }

    console.log(
      "Cashfree webhook received:",
      JSON.stringify(
        payload,
        null,
        2,
      ),
    );

    /*
     * -------------------------------------------------------
     * 6. GET WEBHOOK DATA
     * -------------------------------------------------------
     */

    const type =
      payload?.type;

    const data =
      payload?.data;

    const orderData =
      data?.order;

    const paymentData =
      data?.payment;

    /*
     * Cashfree normally provides:
     *
     * data.order.order_id
     *
     * data.payment.cf_payment_id
     *
     * data.payment.payment_status
     *
     * -------------------------------------------------------
     */

    const cashfreeOrderId =
      orderData?.order_id;

    const cashfreePaymentId =
      paymentData?.cf_payment_id;

    const paymentStatus =
      paymentData?.payment_status;

    if (!cashfreeOrderId) {
      /*
       * Some Cashfree webhook events may
       * not contain an order ID.
       *
       * Acknowledge the webhook rather
       * than repeatedly retrying it.
       */

      console.warn(
        "Cashfree webhook does not contain an order ID.",
      );

      return NextResponse.json({
        success: true,
      });
    }

    /*
     * -------------------------------------------------------
     * 7. CREATE SUPABASE CLIENT
     * -------------------------------------------------------
     */

    const supabase =
      await createClient();

    /*
     * -------------------------------------------------------
     * 8. FIND OUR ORDER
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
          total_amount,
          currency,
          payment_status,
          order_status
        `,
      )
      .eq(
        "order_number",
        cashfreeOrderId,
      )
      .maybeSingle();

    if (orderError) {
      console.error(
        "Failed to find NIRA order:",
        orderError,
      );

      return NextResponse.json(
        {
          error:
            "Failed to find order.",
        },
        { status: 500 },
      );
    }

    if (!order) {
      console.warn(
        `NIRA order not found for Cashfree order ${cashfreeOrderId}`,
      );

      /*
       * Return 200 so Cashfree does not
       * repeatedly send the same webhook.
       */

      return NextResponse.json({
        success: true,
        message:
          "Order not found locally.",
      });
    }

    /*
     * -------------------------------------------------------
     * 9. NORMALIZE PAYMENT STATUS
     * -------------------------------------------------------
     */

    let localPaymentStatus:
      | "pending"
      | "processing"
      | "paid"
      | "failed"
      | "cancelled"
      | "refunded"
      | "partially_refunded" =
      "pending";

    let localOrderStatus:
      | "pending"
      | "confirmed"
      | "processing"
      | "packed"
      | "shipped"
      | "delivered"
      | "cancelled"
      | "returned" =
      "pending";

    /*
     * -------------------------------------------------------
     * 10. SUCCESS
     * -------------------------------------------------------
     */

    if (
      paymentStatus ===
        "SUCCESS" ||
      type ===
        "PAYMENT_SUCCESS_WEBHOOK"
    ) {
      localPaymentStatus =
        "paid";

      localOrderStatus =
        "confirmed";
    }

    /*
     * -------------------------------------------------------
     * 11. FAILED
     * -------------------------------------------------------
     */

    else if (
      paymentStatus ===
        "FAILED" ||
      paymentStatus ===
        "USER_DROPPED" ||
      type ===
        "PAYMENT_FAILED_WEBHOOK"
    ) {
      localPaymentStatus =
        "failed";

      /*
       * Do not cancel the actual order
       * automatically. Keep fulfillment
       * status pending so the customer
       * can retry payment.
       */

      localOrderStatus =
        order.order_status ===
          "pending"
          ? "pending"
          : order.order_status;
    }

    /*
     * -------------------------------------------------------
     * 12. CANCELLED
     * -------------------------------------------------------
     */

    else if (
      paymentStatus ===
      "CANCELLED"
    ) {
      localPaymentStatus =
        "cancelled";

      localOrderStatus =
        "cancelled";
    }

    /*
     * -------------------------------------------------------
     * 13. REFUND
     * -------------------------------------------------------
     */

    else if (
      type ===
        "REFUND_STATUS_WEBHOOK" ||
      type ===
        "REFUND_SUCCESS_WEBHOOK"
    ) {
      localPaymentStatus =
        "refunded";

      localOrderStatus =
        "returned";
    }

    /*
     * -------------------------------------------------------
     * 14. OTHER / PENDING
     * -------------------------------------------------------
     */

    else {
      localPaymentStatus =
        "processing";

      localOrderStatus =
        order.order_status ===
          "pending"
          ? "pending"
          : order.order_status;
    }

    /*
     * -------------------------------------------------------
     * 15. PAYMENT METHOD
     * -------------------------------------------------------
     */

    const paymentMethod =
      getPaymentMethod(
        paymentData?.payment_method,
      );

    /*
     * -------------------------------------------------------
     * 16. UPDATE ORDER
     * -------------------------------------------------------
     */

    const {
      error:
        updateOrderError,
    } = await supabase
      .from("orders")
      .update({
        payment_status:
          localPaymentStatus,

        order_status:
          localOrderStatus,

        payment_method:
          paymentMethod,

        cashfree_payment_id:
          cashfreePaymentId ||
          null,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        order.id,
      );

    if (
      updateOrderError
    ) {
      console.error(
        "Failed to update NIRA order:",
        updateOrderError,
      );

      return NextResponse.json(
        {
          error:
            "Failed to update order.",
        },
        { status: 500 },
      );
    }

    /*
     * -------------------------------------------------------
     * 17. UPDATE PAYMENT TRANSACTION
     * -------------------------------------------------------
     */

    let transactionStatus:
      | "pending"
      | "processing"
      | "success"
      | "failed"
      | "cancelled"
      | "refunded" =
      "pending";

    if (
      localPaymentStatus ===
      "paid"
    ) {
      transactionStatus =
        "success";
    } else if (
      localPaymentStatus ===
      "failed"
    ) {
      transactionStatus =
        "failed";
    } else if (
      localPaymentStatus ===
      "cancelled"
    ) {
      transactionStatus =
        "cancelled";
    } else if (
      localPaymentStatus ===
      "refunded"
    ) {
      transactionStatus =
        "refunded";
    } else {
      transactionStatus =
        "processing";
    }

    const {
      data: existingTransaction,
      error:
        transactionLookupError,
    } = await supabase
      .from(
        "payment_transactions",
      )
      .select("id")
      .eq(
        "order_id",
        order.id,
      )
      .order(
        "created_at",
        {
          ascending: false,
        },
      )
      .limit(1)
      .maybeSingle();

    if (
      transactionLookupError
    ) {
      console.error(
        "Payment transaction lookup error:",
        transactionLookupError,
      );
    }

    /*
     * -------------------------------------------------------
     * 18. PAYMENT TRANSACTION DATA
     * -------------------------------------------------------
     */

    const transactionData = {
      cashfree_order_id:
        cashfreeOrderId,

      cashfree_payment_id:
        cashfreePaymentId ||
        null,

      payment_method:
        paymentMethod,

      amount:
        Number(
          paymentData?.payment_amount ||
            order.total_amount ||
            0,
        ),

      currency:
        paymentData?.payment_currency ||
        order.currency ||
        "INR",

      status:
        transactionStatus,

      bank_reference:
        paymentData?.bank_reference ||
        null,

      payment_message:
        paymentData?.payment_message ||
        null,

      gateway_response:
        payload,

      updated_at:
        new Date().toISOString(),
    };

    /*
     * -------------------------------------------------------
     * 19. UPDATE EXISTING TRANSACTION
     * -------------------------------------------------------
     */

    if (
      existingTransaction
    ) {
      const {
        error:
          transactionUpdateError,
      } = await supabase
        .from(
          "payment_transactions",
        )
        .update(
          transactionData,
        )
        .eq(
          "id",
          existingTransaction.id,
        );

      if (
        transactionUpdateError
      ) {
        console.error(
          "Payment transaction update error:",
          transactionUpdateError,
        );

        return NextResponse.json(
          {
            error:
              "Failed to update payment transaction.",
          },
          { status: 500 },
        );
      }
    }

    /*
     * -------------------------------------------------------
     * 20. CREATE TRANSACTION IF NOT FOUND
     * -------------------------------------------------------
     */

    else {
      const {
        error:
          transactionInsertError,
      } = await supabase
        .from(
          "payment_transactions",
        )
        .insert({
          order_id:
            order.id,

          user_id:
            order.user_id,

          ...transactionData,
        });

      if (
        transactionInsertError
      ) {
        console.error(
          "Payment transaction insert error:",
          transactionInsertError,
        );

        return NextResponse.json(
          {
            error:
              "Failed to create payment transaction.",
          },
          { status: 500 },
        );
      }
    }

    /*
     * -------------------------------------------------------
     * 21. IMPORTANT:
     * DO NOT REDUCE STOCK HERE YET
     * -------------------------------------------------------
     *
     * We will add stock management carefully
     * after the payment flow is completely
     * verified.
     *
     * This prevents duplicate webhooks from
     * reducing inventory multiple times.
     * -------------------------------------------------------
     */

    /*
     * -------------------------------------------------------
     * 22. LOG SUCCESSFUL WEBHOOK
     * -------------------------------------------------------
     */

    console.log(
      "Cashfree webhook processed successfully:",
      {
        type,
        cashfreeOrderId,
        cashfreePaymentId,
        paymentStatus,
        localPaymentStatus,
        localOrderStatus,
      },
    );

    /*
     * -------------------------------------------------------
     * 23. ACKNOWLEDGE CASHFREE
     * -------------------------------------------------------
     */

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Cashfree webhook error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Webhook processing failed.",
      },
      { status: 500 },
    );
  }
}