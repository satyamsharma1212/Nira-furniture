import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

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

function normalizeProduct(
  value: unknown,
): CartProduct | null {
  if (!value) return null;

  if (Array.isArray(value)) {
    return (
      (value[0] as CartProduct | undefined) ||
      null
    );
  }

  return value as CartProduct;
}

export async function POST(request: NextRequest) {
  try {
    /*
     * Razorpay credentials
     */
    const keyId =
      process.env.RAZORPAY_KEY_ID;

    const keySecret =
      process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          error:
            "Razorpay Live credentials are not configured.",
        },
        { status: 500 },
      );
    }

    /*
     * Supabase
     */
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          error:
            "You must be logged in to place an order.",
        },
        { status: 401 },
      );
    }

    /*
     * Read request body
     */
    let body: Record<string, any>;

    try {
      body = await request.json();
    } catch (error) {
      console.error(
        "Invalid create-order request body:",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Invalid or empty request body.",
        },
        { status: 400 },
      );
    }

    /*
     * Customer information
     */
    const customer_name =
      body?.customer_name;

    const customer_email =
      body?.customer_email;

    const customer_phone =
      body?.customer_phone;

    /*
     * Shipping address
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
     * Billing address
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
     * Optional customer note
     */
    const customer_note =
      body?.customer_note;

    /*
     * Buy Now information
     */
    const productId =
      typeof body?.product_id === "string"
        ? body.product_id
        : null;

    const requestedQuantity =
      Number(body?.quantity);

    /*
     * Validate customer information
     */
    if (
      !customer_name ||
      typeof customer_name !== "string" ||
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
      !customer_email ||
      typeof customer_email !== "string" ||
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
      !customer_phone ||
      typeof customer_phone !== "string" ||
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
     * Validate shipping address
     */
    if (
      !shipping_address_line1 ||
      typeof shipping_address_line1 !== "string" ||
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
      !shipping_city ||
      typeof shipping_city !== "string" ||
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
      !shipping_state ||
      typeof shipping_state !== "string" ||
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
      !shipping_postal_code ||
      typeof shipping_postal_code !== "string" ||
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
     * Build order items.
     *
     * The price comes from Supabase.
     * We do NOT trust a price sent by the browser.
     */
    const orderItems: OrderItem[] = [];

    let subtotal = 0;

    /*
     * ==========================================
     * BUY NOW
     * ==========================================
     */
    if (productId) {
      const quantity =
        Number.isInteger(requestedQuantity) &&
        requestedQuantity > 0
          ? requestedQuantity
          : 1;

      const {
        data: product,
        error: productError,
      } = await supabase
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
        .eq("id", productId)
        .eq("status", "active")
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
       * Check stock
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
       * Validate price
       */
      const unitPrice =
        Number(product.price);

      if (
        !Number.isFinite(unitPrice) ||
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

      subtotal += totalPrice;

      orderItems.push({
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug,
        product_image_url:
          product.main_image_url,
        unit_price: unitPrice,
        quantity,
        total_price: totalPrice,
      });
    }

    /*
     * ==========================================
     * NORMAL CART CHECKOUT
     * ==========================================
     */
    else {
      const {
        data: cartItems,
        error: cartError,
      } = await supabase
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
        .eq("user_id", user.id);

      if (cartError) {
        console.error(
          "Cart fetch error:",
          cartError,
        );

        return NextResponse.json(
          {
            error: cartError.message,
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

      /*
       * Process every cart item
       */
      for (const cartItem of cartItems) {
        const product =
          normalizeProduct(
            cartItem.products,
          );

        if (!product) {
          return NextResponse.json(
            {
              error:
                "One of the products in your cart no longer exists.",
            },
            { status: 400 },
          );
        }

        /*
         * Product status
         */
        if (product.status !== "active") {
          return NextResponse.json(
            {
              error:
                `${product.name} is no longer available.`,
            },
            { status: 400 },
          );
        }

        /*
         * Quantity
         */
        const cartQuantity =
          Number(cartItem.quantity);

        if (
          !Number.isInteger(cartQuantity) ||
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

        /*
         * Stock
         */
        const availableStock =
          product.stock === null
            ? null
            : Number(product.stock);

        if (
          availableStock !== null &&
          availableStock < cartQuantity
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
         * Price
         */
        const unitPrice =
          Number(product.price);

        if (
          !Number.isFinite(unitPrice) ||
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
          unitPrice * cartQuantity;

        subtotal += totalPrice;

        orderItems.push({
          product_id: product.id,
          product_name: product.name,
          product_slug: product.slug,
          product_image_url:
            product.main_image_url,
          unit_price: unitPrice,
          quantity: cartQuantity,
          total_price: totalPrice,
        });
      }
    }

    /*
     * ==========================================
     * ORDER TOTALS
     * ==========================================
     *
     * Keep these values server-side.
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
      !Number.isFinite(totalAmount) ||
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
     * ==========================================
     * CREATE INTERNAL NIRA ORDER
     * ==========================================
     */
    const orderNumber =
      generateOrderNumber();

    const {
      data: order,
      error: orderError,
    } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,

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

        subtotal,

        shipping_amount:
          shippingAmount,

        discount_amount:
          discountAmount,

        tax_amount:
          taxAmount,

        total_amount:
          totalAmount,

        currency: "INR",

        payment_status:
          "pending",

        order_status:
          "pending",

        payment_method:
          "razorpay",

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
     * ==========================================
     * CREATE ORDER ITEMS
     * ==========================================
     */
    const orderItemsToInsert =
      orderItems.map(
        (item) => ({
          order_id: order.id,

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
      error: orderItemsError,
    } = await supabase
      .from("order_items")
      .insert(
        orderItemsToInsert,
      );

    if (orderItemsError) {
      console.error(
        "Create order items error:",
        orderItemsError,
      );

      /*
       * Roll back the local order
       */
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
     * ==========================================
     * CREATE RAZORPAY ORDER
     * ==========================================
     *
     * Razorpay expects the amount in paise.
     *
     * Example:
     * ₹10,000 = 1,000,000 paise
     */
    const razorpay =
      new Razorpay({
        key_id:
          keyId,

        key_secret:
          keySecret,
      });

    const razorpayOrder =
      await razorpay.orders.create({
        amount:
          Math.round(
            totalAmount * 100,
          ),

        currency:
          "INR",

        receipt:
          order.order_number,

        notes: {
          internal_order_id:
            order.id,

          order_number:
            order.order_number,
        },
      });

    /*
     * ==========================================
     * SAVE RAZORPAY ORDER ID
     * ==========================================
     */
    const {
      error:
        razorpayOrderUpdateError,
    } = await supabase
      .from("orders")
      .update({
        razorpay_order_id:
          razorpayOrder.id,

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
      razorpayOrderUpdateError
    ) {
      console.error(
        "Failed to save Razorpay order ID:",
        razorpayOrderUpdateError,
      );

      /*
       * Remove the local order
       * if we cannot associate it
       * with the Razorpay order.
       */
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
            "Razorpay order was created, but the local order could not be updated.",
        },
        { status: 500 },
      );
    }

    /*
     * ==========================================
     * CREATE PENDING PAYMENT TRANSACTION
     * ==========================================
     */
    const {
      error:
        transactionError,
    } = await supabase
      .from("payment_transactions")
      .insert({
        order_id:
          order.id,

        user_id:
          user.id,

        razorpay_order_id:
          razorpayOrder.id,

        amount:
          totalAmount,

        currency:
          "INR",

        status:
          "pending",

        gateway_response: {
          gateway:
            "razorpay",

          razorpay_order_id:
            razorpayOrder.id,

          order_number:
            order.order_number,
        },
      });

    /*
     * Payment transaction failure
     * should not prevent Razorpay
     * checkout from opening.
     */
    if (transactionError) {
      console.error(
        "Payment transaction insert error:",
        transactionError,
      );
    }

    /*
     * ==========================================
     * RETURN DATA TO CLIENT
     * ==========================================
     */
    return NextResponse.json({
      success: true,

      order_id:
        order.id,

      order_number:
        order.order_number,

      razorpay_order_id:
        razorpayOrder.id,

      amount:
        Number(
          razorpayOrder.amount,
        ),

      currency:
        "INR",

      key_id:
        keyId,
    });
  } catch (error) {
    console.error(
      "Create Razorpay order error:",
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