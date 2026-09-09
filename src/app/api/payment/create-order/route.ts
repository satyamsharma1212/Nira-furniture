import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const CASHFREE_API_VERSION = "2025-01-01";

type CartProduct = {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  stock: number | null;
  status: string;
  main_image_url: string | null;
};

type OrderItem = {
  product_id: string;
  product_name: string;
  product_slug: string;
  product_image_url: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
};

function getCashfreeBaseUrl() {
  return process.env.CASHFREE_ENVIRONMENT ===
    "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

function generateOrderNumber() {
  const timestamp = Date.now()
    .toString(36)
    .toUpperCase();

  const random = Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase();

  return `NIRA-${timestamp}-${random}`;
}

export async function POST(
  request: NextRequest,
) {
  try {
    /*
     * =======================================================
     * 1. ENVIRONMENT
     * =======================================================
     */

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    const cashfreeAppId =
      process.env.CASHFREE_APP_ID;

    const cashfreeSecretKey =
      process.env.CASHFREE_SECRET_KEY;

    if (
      !supabaseUrl ||
      !supabaseKey
    ) {
      console.error(
        "Supabase environment variables are missing.",
      );

      return NextResponse.json(
        {
          error:
            "Supabase is not configured correctly.",
        },
        { status: 500 },
      );
    }

    if (
      !cashfreeAppId ||
      !cashfreeSecretKey
    ) {
      return NextResponse.json(
        {
          error:
            "Cashfree credentials are not configured.",
        },
        { status: 500 },
      );
    }

    /*
     * =======================================================
     * 2. GET BEARER TOKEN
     * =======================================================
     */

    const authorization =
      request.headers.get(
        "authorization",
      );

    if (!authorization) {
      console.error(
        "Authorization header is missing.",
      );

      return NextResponse.json(
        {
          error:
            "Authentication failed. Authorization header is missing.",
        },
        { status: 401 },
      );
    }

    const bearerMatch =
      authorization.match(
        /^Bearer\s+(.+)$/i,
      );

    if (!bearerMatch) {
      console.error(
        "Invalid authorization header format.",
      );

      return NextResponse.json(
        {
          error:
            "Authentication failed. Invalid authorization format.",
        },
        { status: 401 },
      );
    }

    const accessToken =
      bearerMatch[1].trim();

    if (!accessToken) {
      return NextResponse.json(
        {
          error:
            "Authentication failed. Access token is empty.",
        },
        { status: 401 },
      );
    }

    /*
     * =======================================================
     * 3. AUTHENTICATE TOKEN DIRECTLY
     *
     * We intentionally do not use the SSR server client
     * for authentication here.
     *
     * The access token from the browser is attached directly
     * to the Supabase request.
     * =======================================================
     */

    const supabase =
      createSupabaseClient(
        supabaseUrl,
        supabaseKey,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },

          global: {
            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
          },
        },
      );

    const {
      data: {
        user,
      },
      error: authError,
    } =
      await supabase.auth.getUser();

    if (
      authError ||
      !user
    ) {
      console.error(
        "Supabase token authentication failed:",
        {
          message:
            authError?.message,
          status:
            authError?.status,
        },
      );

      return NextResponse.json(
        {
          error:
            "Authentication failed. Please log in again.",
        },
        { status: 401 },
      );
    }

    console.log(
      "Authenticated NIRA user:",
      user.id,
    );

    /*
     * =======================================================
     * 4. READ REQUEST
     * =======================================================
     */

    const body =
      await request.json();

    /*
     * CUSTOMER
     */

    const customer_name =
      body?.customer_name;

    const customer_email =
      body?.customer_email;

    const customer_phone =
      body?.customer_phone;

    /*
     * SHIPPING
     */

    const shipping_address_line1 =
      body?.shipping_address_line1;

    const shipping_address_line2 =
      body?.shipping_address_line2;

    const shipping_city =
      body?.shipping_city;

    const shipping_state =
      body?.shipping_state;

    const shipping_postal_code =
      body?.shipping_postal_code;

    const shipping_country =
      body?.shipping_country;

    /*
     * BILLING
     */

    const billing_address_line1 =
      body?.billing_address_line1;

    const billing_address_line2 =
      body?.billing_address_line2;

    const billing_city =
      body?.billing_city;

    const billing_state =
      body?.billing_state;

    const billing_postal_code =
      body?.billing_postal_code;

    const billing_country =
      body?.billing_country;

    /*
     * NOTE
     */

    const customer_note =
      body?.customer_note;

    /*
     * BUY NOW
     */

    const productId =
      typeof body?.product_id ===
      "string"
        ? body.product_id.trim()
        : null;

    const requestedQuantity =
      Number(body?.quantity);

    /*
     * =======================================================
     * 5. VALIDATE CUSTOMER
     * =======================================================
     */

    if (
      typeof customer_name !==
        "string" ||
      !customer_name.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Customer name is required.",
        },
        { status: 400 },
      );
    }

    if (
      typeof customer_email !==
        "string" ||
      !customer_email.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Customer email is required.",
        },
        { status: 400 },
      );
    }

    if (
      typeof customer_phone !==
        "string" ||
      !customer_phone.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Customer phone is required.",
        },
        { status: 400 },
      );
    }

    /*
     * =======================================================
     * 6. VALIDATE SHIPPING
     * =======================================================
     */

    if (
      typeof shipping_address_line1 !==
        "string" ||
      !shipping_address_line1.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Shipping address is required.",
        },
        { status: 400 },
      );
    }

    if (
      typeof shipping_city !==
        "string" ||
      !shipping_city.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Shipping city is required.",
        },
        { status: 400 },
      );
    }

    if (
      typeof shipping_state !==
        "string" ||
      !shipping_state.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Shipping state is required.",
        },
        { status: 400 },
      );
    }

    if (
      typeof shipping_postal_code !==
        "string" ||
      !shipping_postal_code.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "Shipping postal code is required.",
        },
        { status: 400 },
      );
    }

    /*
     * =======================================================
     * 7. PREPARE ORDER ITEMS
     * =======================================================
     */

    const orderItems: OrderItem[] =
      [];

    let subtotal = 0;

    /*
     * =======================================================
     * 7A. BUY NOW
     * =======================================================
     */

    if (productId) {
      const quantity =
        Number.isInteger(
          requestedQuantity,
        ) &&
        requestedQuantity > 0
          ? requestedQuantity
          : 1;

      const {
        data: product,
        error: productError,
      } =
        await supabase
          .from("products")
          .select(
            `
              id,
              name,
              slug,
              price,
              stock,
              status,
              main_image_url
            `,
          )
          .eq(
            "id",
            productId,
          )
          .eq(
            "status",
            "active",
          )
          .maybeSingle();

      if (productError) {
        console.error(
          "Buy Now product fetch error:",
          productError,
        );

        return NextResponse.json(
          {
            error:
              "Unable to load the selected product.",
          },
          { status: 500 },
        );
      }

      if (!product) {
        return NextResponse.json(
          {
            error:
              "The selected product is no longer available.",
          },
          { status: 400 },
        );
      }

      /*
       * STOCK
       */

      const availableStock =
        product.stock === null
          ? null
          : Number(product.stock);

      if (
        availableStock !== null &&
        availableStock < quantity
      ) {
        return NextResponse.json(
          {
            error:
              availableStock <= 0
                ? `${product.name} is currently out of stock.`
                : `Only ${availableStock} units of ${product.name} are available.`,
          },
          { status: 400 },
        );
      }

      /*
       * PRICE
       */

      const unitPrice =
        Number(product.price);

      if (
        !Number.isFinite(
          unitPrice,
        ) ||
        unitPrice <= 0
      ) {
        return NextResponse.json(
          {
            error:
              `Invalid price for ${product.name}.`,
          },
          { status: 400 },
        );
      }

      const totalPrice =
        unitPrice * quantity;

      subtotal +=
        totalPrice;

      orderItems.push({
        product_id:
          product.id,

        product_name:
          product.name,

        product_slug:
          product.slug,

        product_image_url:
          product.main_image_url,

        unit_price:
          unitPrice,

        quantity,

        total_price:
          totalPrice,
      });
    }

    /*
     * =======================================================
     * 7B. NORMAL CART
     * =======================================================
     */

    else {
      const {
        data: cartItems,
        error: cartError,
      } =
        await supabase
          .from("cart_items")
          .select(
            `
              id,
              product_id,
              quantity,
              products (
                id,
                name,
                slug,
                price,
                stock,
                status,
                main_image_url
              )
            `,
          )
          .eq(
            "user_id",
            user.id,
          );

      if (cartError) {
        console.error(
          "Cart fetch error:",
          cartError,
        );

        return NextResponse.json(
          {
            error:
              cartError.message,
          },
          { status: 500 },
        );
      }

      if (
        !cartItems ||
        cartItems.length === 0
      ) {
        return NextResponse.json(
          {
            error:
              "Your cart is empty.",
          },
          { status: 400 },
        );
      }

      for (
        const cartItem of cartItems
      ) {
        const productData =
          cartItem.products as unknown;

        let product:
          | CartProduct
          | null =
          null;

        if (
          Array.isArray(
            productData,
          )
        ) {
          product =
            (productData[0] as
              | CartProduct
              | undefined) ||
            null;
        } else {
          product =
            (productData as
              | CartProduct
              | null) ||
            null;
        }

        if (!product) {
          return NextResponse.json(
            {
              error:
                "One of the products in your cart no longer exists.",
            },
            { status: 400 },
          );
        }

        if (
          product.status !==
          "active"
        ) {
          return NextResponse.json(
            {
              error:
                `${product.name} is no longer available.`,
            },
            { status: 400 },
          );
        }

        const cartQuantity =
          Number(
            cartItem.quantity,
          );

        if (
          !Number.isInteger(
            cartQuantity,
          ) ||
          cartQuantity <= 0
        ) {
          return NextResponse.json(
            {
              error:
                `Invalid quantity for ${product.name}.`,
            },
            { status: 400 },
          );
        }

        const availableStock =
          product.stock === null
            ? null
            : Number(
                product.stock,
              );

        if (
          availableStock !== null &&
          availableStock <
            cartQuantity
        ) {
          return NextResponse.json(
            {
              error:
                availableStock <= 0
                  ? `${product.name} is currently out of stock.`
                  : `Only ${availableStock} units of ${product.name} are available.`,
            },
            { status: 400 },
          );
        }

        const unitPrice =
          Number(
            product.price,
          );

        if (
          !Number.isFinite(
            unitPrice,
          ) ||
          unitPrice <= 0
        ) {
          return NextResponse.json(
            {
              error:
                `Invalid price for ${product.name}.`,
            },
            { status: 400 },
          );
        }

        const totalPrice =
          unitPrice *
          cartQuantity;

        subtotal +=
          totalPrice;

        orderItems.push({
          product_id:
            product.id,

          product_name:
            product.name,

          product_slug:
            product.slug,

          product_image_url:
            product.main_image_url,

          unit_price:
            unitPrice,

          quantity:
            cartQuantity,

          total_price:
            totalPrice,
        });
      }
    }

    /*
     * =======================================================
     * 8. TOTALS
     * =======================================================
     */

    const shippingAmount = 0;
    const discountAmount = 0;
    const taxAmount = 0;

    const totalAmount =
      subtotal +
      shippingAmount +
      taxAmount -
      discountAmount;

    if (
      !Number.isFinite(
        totalAmount,
      ) ||
      totalAmount <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Order amount must be greater than zero.",
        },
        { status: 400 },
      );
    }

    /*
     * =======================================================
     * 9. CREATE ORDER NUMBER
     * =======================================================
     */

    const orderNumber =
      generateOrderNumber();

    /*
     * =======================================================
     * 10. CREATE LOCAL ORDER
     * =======================================================
     */

    const {
      data: order,
      error: orderError,
    } =
      await supabase
        .from("orders")
        .insert({
          user_id:
            user.id,

          order_number:
            orderNumber,

          customer_name:
            customer_name.trim(),

          customer_email:
            customer_email
              .trim()
              .toLowerCase(),

          customer_phone:
            customer_phone.trim(),

          shipping_address_line1:
            shipping_address_line1.trim(),

          shipping_address_line2:
            typeof shipping_address_line2 ===
              "string" &&
            shipping_address_line2.trim()
              ? shipping_address_line2.trim()
              : null,

          shipping_city:
            shipping_city.trim(),

          shipping_state:
            shipping_state.trim(),

          shipping_postal_code:
            shipping_postal_code.trim(),

          shipping_country:
            typeof shipping_country ===
              "string" &&
            shipping_country.trim()
              ? shipping_country.trim()
              : "India",

          billing_address_line1:
            typeof billing_address_line1 ===
              "string" &&
            billing_address_line1.trim()
              ? billing_address_line1.trim()
              : null,

          billing_address_line2:
            typeof billing_address_line2 ===
              "string" &&
            billing_address_line2.trim()
              ? billing_address_line2.trim()
              : null,

          billing_city:
            typeof billing_city ===
              "string" &&
            billing_city.trim()
              ? billing_city.trim()
              : null,

          billing_state:
            typeof billing_state ===
              "string" &&
            billing_state.trim()
              ? billing_state.trim()
              : null,

          billing_postal_code:
            typeof billing_postal_code ===
              "string" &&
            billing_postal_code.trim()
              ? billing_postal_code.trim()
              : null,

          billing_country:
            typeof billing_country ===
              "string" &&
            billing_country.trim()
              ? billing_country.trim()
              : "India",

          subtotal:
            subtotal,

          shipping_amount:
            shippingAmount,

          discount_amount:
            discountAmount,

          tax_amount:
            taxAmount,

          total_amount:
            totalAmount,

          currency:
            "INR",

          payment_status:
            "pending",

          order_status:
            "pending",

          customer_note:
            typeof customer_note ===
              "string" &&
            customer_note.trim()
              ? customer_note.trim()
              : null,
        })
        .select(
          "id, order_number",
        )
        .single();

    if (
      orderError ||
      !order
    ) {
      console.error(
        "Create local order error:",
        orderError,
      );

      return NextResponse.json(
        {
          error:
            orderError?.message ||
            "Failed to create order.",
        },
        { status: 500 },
      );
    }

    /*
     * =======================================================
     * 11. CREATE ORDER ITEMS
     * =======================================================
     */

    const orderItemsToInsert =
      orderItems.map(
        (item) => ({
          order_id:
            order.id,

          product_id:
            item.product_id,

          product_name:
            item.product_name,

          product_slug:
            item.product_slug,

          product_image_url:
            item.product_image_url,

          unit_price:
            item.unit_price,

          quantity:
            item.quantity,

          total_price:
            item.total_price,
        }),
      );

    const {
      error:
        orderItemsError,
    } =
      await supabase
        .from("order_items")
        .insert(
          orderItemsToInsert,
        );

    if (
      orderItemsError
    ) {
      console.error(
        "Order items error:",
        orderItemsError,
      );

      await supabase
        .from("orders")
        .delete()
        .eq(
          "id",
          order.id,
        );

      return NextResponse.json(
        {
          error:
            orderItemsError.message,
        },
        { status: 500 },
      );
    }

    /*
     * =======================================================
     * 12. CASHFREE
     * =======================================================
     */

    const baseUrl =
      getCashfreeBaseUrl();

    const siteUrl =
      process.env
        .NEXT_PUBLIC_SITE_URL ||
      request.nextUrl.origin;

    const cashfreePayload = {
      order_id:
        order.order_number,

      order_amount:
        Number(
          totalAmount.toFixed(2),
        ),

      order_currency:
        "INR",

      customer_details: {
        customer_id:
          user.id,

        customer_name:
          customer_name.trim(),

        customer_email:
          customer_email
            .trim()
            .toLowerCase(),

        customer_phone:
          customer_phone.trim(),
      },

      order_meta: {
        return_url:
          `${siteUrl}/payment/cashfree/return?order_id=${encodeURIComponent(
            order.order_number,
          )}`,

        notify_url:
          `${siteUrl}/api/payment/webhook`,
      },

      order_note:
        `NIRA Furniture Order ${order.order_number}`,

      order_tags: {
        nira_order_id:
          order.id,

        nira_order_number:
          order.order_number,
      },
    };

    /*
     * =======================================================
     * 13. CREATE CASHFREE ORDER
     * =======================================================
     */

    const cashfreeResponse =
      await fetch(
        `${baseUrl}/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            "x-api-version":
              CASHFREE_API_VERSION,

            "x-client-id":
              cashfreeAppId,

            "x-client-secret":
              cashfreeSecretKey,

            "x-idempotency-key":
              crypto.randomUUID(),
          },

          body: JSON.stringify(
            cashfreePayload,
          ),
        },
      );

    /*
     * =======================================================
     * 14. READ CASHFREE RESPONSE
     * =======================================================
     */

    let cashfreeData:
      Record<
        string,
        unknown
      > = {};

    try {
      cashfreeData =
        await cashfreeResponse.json();
    } catch {
      cashfreeData = {};
    }

    /*
     * =======================================================
     * 15. CASHFREE ERROR
     * =======================================================
     */

    if (
      !cashfreeResponse.ok
    ) {
      console.error(
        "Cashfree order creation failed:",
        cashfreeData,
      );

      await supabase
        .from("orders")
        .update({
          payment_status:
            "failed",

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          order.id,
        );

      return NextResponse.json(
        {
          error:
            typeof cashfreeData.message ===
            "string"
              ? cashfreeData.message
              : typeof cashfreeData.error ===
                  "string"
                ? cashfreeData.error
                : "Cashfree order creation failed.",
        },
        {
          status:
            cashfreeResponse.status ||
            500,
        },
      );
    }

    /*
     * =======================================================
     * 16. PAYMENT SESSION
     * =======================================================
     */

    const paymentSessionId =
      typeof cashfreeData.payment_session_id ===
      "string"
        ? cashfreeData.payment_session_id
        : null;

    const cashfreeOrderId =
      typeof cashfreeData.cf_order_id ===
      "string"
        ? cashfreeData.cf_order_id
        : typeof cashfreeData.order_id ===
            "string"
          ? cashfreeData.order_id
          : order.order_number;

    if (
      !paymentSessionId
    ) {
      console.error(
        "Cashfree payment session missing:",
        cashfreeData,
      );

      await supabase
        .from("orders")
        .update({
          payment_status:
            "failed",

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          order.id,
        );

      return NextResponse.json(
        {
          error:
            "Cashfree did not return a payment session.",
        },
        { status: 500 },
      );
    }

    /*
     * =======================================================
     * 17. UPDATE ORDER
     * =======================================================
     */

    const {
      error:
        updateOrderError,
    } =
      await supabase
        .from("orders")
        .update({
          cashfree_order_id:
            cashfreeOrderId,

          cashfree_payment_session_id:
            paymentSessionId,

          payment_status:
            "pending",

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
        "Failed to update order:",
        updateOrderError,
      );

      return NextResponse.json(
        {
          error:
            "Cashfree order was created, but the local order could not be updated.",
        },
        { status: 500 },
      );
    }

    /*
     * =======================================================
     * 18. PAYMENT TRANSACTION
     * =======================================================
     */

    const {
      error:
        transactionError,
    } =
      await supabase
        .from(
          "payment_transactions",
        )
        .insert({
          order_id:
            order.id,

          user_id:
            user.id,

          cashfree_order_id:
            cashfreeOrderId,

          amount:
            totalAmount,

          currency:
            "INR",

          status:
            "pending",

          gateway_response:
            cashfreeData,
        });

    if (
      transactionError
    ) {
      console.error(
        "Payment transaction error:",
        transactionError,
      );
    }

    /*
     * =======================================================
     * 19. RESPONSE
     * =======================================================
     */

    return NextResponse.json({
      success: true,

      order_id:
        order.id,

      order_number:
        order.order_number,

      cashfree_order_id:
        cashfreeOrderId,

      payment_session_id:
        paymentSessionId,

      amount:
        totalAmount,

      currency:
        "INR",
    });
  } catch (error) {
    console.error(
      "Create Cashfree order error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while creating the payment.",
      },
      { status: 500 },
    );
  }
}