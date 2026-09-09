"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";

type RazorpayCheckoutButtonProps = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  shippingAddressLine1: string;
  shippingAddressLine2?: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry?: string;

  billingAddressLine1?: string;
  billingAddressLine2?: string;
  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;
  billingCountry?: string;

  customerNote?: string;

  productId?: string;
  quantity?: number;

  disabled?: boolean;
  className?: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void | Promise<void>;
};

type RazorpayInstance = {
  open: () => void;
  on: (
    event: "payment.failed",
    callback: (response: {
      error?: {
        code?: string;
        description?: string;
        source?: string;
        step?: string;
        reason?: string;
        metadata?: {
          order_id?: string;
          payment_id?: string;
        };
      };
    }) => void,
  ) => void;
};

declare global {
  interface Window {
    Razorpay?: new (
      options: RazorpayOptions,
    ) => RazorpayInstance;
  }
}

let razorpayScriptPromise: Promise<void> | null = null;

function loadRazorpayScript() {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Razorpay can only be loaded in the browser."),
    );
  }

  if (window.Razorpay) {
    return Promise.resolve();
  }

  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  razorpayScriptPromise = new Promise<void>(
    (resolve, reject) => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
      );

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve());
        existingScript.addEventListener("error", () =>
          reject(
            new Error("Failed to load Razorpay Checkout."),
          ),
        );
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => resolve();
      script.onerror = () =>
        reject(
          new Error("Failed to load Razorpay Checkout."),
        );

      document.body.appendChild(script);
    },
  );

  return razorpayScriptPromise;
}

export default function RazorpayCheckoutButton({
  customerName,
  customerEmail,
  customerPhone,

  shippingAddressLine1,
  shippingAddressLine2,
  shippingCity,
  shippingState,
  shippingPostalCode,
  shippingCountry,

  billingAddressLine1,
  billingAddressLine2,
  billingCity,
  billingState,
  billingPostalCode,
  billingCountry,

  customerNote,

  productId,
  quantity,

  disabled = false,
  className = "",
}: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    if (loading) return;

    setError("");

    if (
      !customerName.trim() ||
      !customerEmail.trim() ||
      !customerPhone.trim()
    ) {
      setError(
        "Please enter your name, email and phone number.",
      );
      return;
    }

    if (
      !shippingAddressLine1.trim() ||
      !shippingCity.trim() ||
      !shippingState.trim() ||
      !shippingPostalCode.trim()
    ) {
      setError("Please complete your shipping address.");
      return;
    }

    if (
      productId &&
      (!quantity ||
        !Number.isInteger(quantity) ||
        quantity <= 0)
    ) {
      setError("Invalid product quantity.");
      return;
    }

    setLoading(true);

    try {
      await loadRazorpayScript();

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout is not available.",
        );
      }

      /*
       * The server calculates the real amount from
       * Supabase products/cart. Never trust a client total.
       */
      const requestBody: Record<string, unknown> = {
        customer_name: customerName.trim(),
        customer_email: customerEmail
          .trim()
          .toLowerCase(),
        customer_phone: customerPhone.trim(),

        shipping_address_line1:
          shippingAddressLine1.trim(),
        shipping_address_line2:
          shippingAddressLine2?.trim() || "",
        shipping_city: shippingCity.trim(),
        shipping_state: shippingState.trim(),
        shipping_postal_code:
          shippingPostalCode.trim(),
        shipping_country:
          shippingCountry?.trim() || "India",

        billing_address_line1:
          billingAddressLine1?.trim() || "",
        billing_address_line2:
          billingAddressLine2?.trim() || "",
        billing_city: billingCity?.trim() || "",
        billing_state: billingState?.trim() || "",
        billing_postal_code:
          billingPostalCode?.trim() || "",
        billing_country:
          billingCountry?.trim() || "India",

        customer_note:
          customerNote?.trim() || "",
      };

      if (productId) {
        requestBody.product_id = productId;
        requestBody.quantity = quantity || 1;
      }

      const response = await fetch(
        "/api/razorpay/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data?.error ||
            "Unable to create Razorpay order.",
        );
      }

      if (
        !data.razorpay_order_id ||
        !data.amount ||
        !data.key_id
      ) {
        throw new Error(
          "Razorpay order was not created correctly.",
        );
      }

      const razorpay = new window.Razorpay({
        key: data.key_id,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "NIRA Furniture",
        description: `NIRA Furniture Order ${data.order_number}`,
        order_id: data.razorpay_order_id,

        prefill: {
          name: customerName.trim(),
          email: customerEmail.trim().toLowerCase(),
          contact: customerPhone.trim(),
        },

        notes: {
          order_number: data.order_number,
        },

        theme: {
          color: "#B8860B",
        },

        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },

        handler: async (payment) => {
          try {
            const verifyResponse = await fetch(
              "/api/razorpay/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  order_id: data.order_id,
                  order_number: data.order_number,

                  razorpay_order_id:
                    payment.razorpay_order_id,

                  razorpay_payment_id:
                    payment.razorpay_payment_id,

                  razorpay_signature:
                    payment.razorpay_signature,
                }),
              },
            );

            const verifyData =
              await verifyResponse.json();

            if (
              !verifyResponse.ok ||
              !verifyData.success
            ) {
              throw new Error(
                verifyData?.error ||
                  "Payment verification failed.",
              );
            }

            /*
             * Payment is verified on the server.
             * Send the customer to the order page.
             */
            window.location.href =
              `/order-success?order_id=${encodeURIComponent(
                data.order_id,
              )}&order_number=${encodeURIComponent(
                data.order_number,
              )}&payment_id=${encodeURIComponent(
                payment.razorpay_payment_id,
              )}`;
          } catch (verificationError) {
            console.error(
              "Razorpay verification error:",
              verificationError,
            );

            setError(
              verificationError instanceof Error
                ? verificationError.message
                : "Payment verification failed. Please contact support.",
            );

            setLoading(false);
          }
        },
      });

      razorpay.on(
        "payment.failed",
        (paymentFailure) => {
          console.error(
            "Razorpay payment failed:",
            paymentFailure.error,
          );

          setError(
            paymentFailure.error?.description ||
              "Payment failed. Please try again.",
          );

          setLoading(false);
        },
      );

      razorpay.open();
    } catch (checkoutError) {
      console.error(
        "Razorpay checkout error:",
        checkoutError,
      );

      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Unable to start payment.",
      );

      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 border border-red-900/15 bg-red-50 px-4 py-3 font-sans text-sm leading-6 text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={disabled || loading}
        className={`
          inline-flex
          min-h-14
          w-full
          items-center
          justify-center
          gap-3
          bg-[#171512]
          px-7
          py-4
          font-sans
          text-[10px]
          font-bold
          uppercase
          tracking-[0.2em]
          text-white
          transition
          hover:bg-[#765A32]
          disabled:cursor-not-allowed
          disabled:opacity-50
          ${className}
        `}
      >
        {loading ? (
          <>
            <Loader2
              size={17}
              className="animate-spin"
            />
            Processing...
          </>
        ) : (
          <>
            <Lock size={15} />
            Proceed to Secure Payment
          </>
        )}
      </button>

      <p className="mt-3 text-center font-sans text-[10px] leading-5 text-[#171512]/40">
        Secure payment powered by Razorpay.
      </p>
    </div>
  );
}
