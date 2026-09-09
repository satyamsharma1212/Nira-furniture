"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type CashfreeCheckoutButtonProps = {
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

type CashfreeInstance = {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget?: string;
  }) => Promise<void> | void;
};

declare global {
  interface Window {
    Cashfree?: (options: {
      mode: "sandbox" | "production";
    }) => CashfreeInstance;
  }
}

let cashfreeScriptPromise: Promise<void> | null =
  null;

function loadCashfreeScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error(
        "Cashfree can only be loaded in the browser.",
      ),
    );
  }

  if (window.Cashfree) {
    return Promise.resolve();
  }

  if (cashfreeScriptPromise) {
    return cashfreeScriptPromise;
  }

  cashfreeScriptPromise =
    new Promise<void>(
      (resolve, reject) => {
        const existingScript =
          document.querySelector(
            'script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]',
          );

        if (existingScript) {
          existingScript.addEventListener(
            "load",
            () => resolve(),
            { once: true },
          );

          existingScript.addEventListener(
            "error",
            () =>
              reject(
                new Error(
                  "Failed to load Cashfree SDK.",
                ),
              ),
            { once: true },
          );

          return;
        }

        const script =
          document.createElement(
            "script",
          );

        script.src =
          "https://sdk.cashfree.com/js/v3/cashfree.js";

        script.async = true;

        script.onload = () => {
          resolve();
        };

        script.onerror = () => {
          reject(
            new Error(
              "Failed to load Cashfree SDK.",
            ),
          );
        };

        document.head.appendChild(
          script,
        );
      },
    );

  return cashfreeScriptPromise;
}

export default function CashfreeCheckoutButton({
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
}: CashfreeCheckoutButtonProps) {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleCheckout() {
    if (loading) {
      return;
    }

    setError("");

    /*
     * -------------------------------------------------------
     * 1. VALIDATE CUSTOMER
     * -------------------------------------------------------
     */

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

    /*
     * -------------------------------------------------------
     * 2. VALIDATE SHIPPING
     * -------------------------------------------------------
     */

    if (
      !shippingAddressLine1.trim() ||
      !shippingCity.trim() ||
      !shippingState.trim() ||
      !shippingPostalCode.trim()
    ) {
      setError(
        "Please complete your shipping address.",
      );

      return;
    }

    /*
     * -------------------------------------------------------
     * 3. VALIDATE BUY NOW
     * -------------------------------------------------------
     */

    let normalizedQuantity = 1;

    if (productId) {
      normalizedQuantity =
        Number(quantity);

      if (
        !Number.isInteger(
          normalizedQuantity,
        ) ||
        normalizedQuantity <= 0
      ) {
        setError(
          "Invalid product quantity.",
        );

        return;
      }
    }

    setLoading(true);

    try {
      /*
       * -----------------------------------------------------
       * 4. GET CURRENT SUPABASE SESSION
       * -----------------------------------------------------
       */

      const supabase =
        createClient();

      const {
        data: {
          session,
        },
        error: sessionError,
      } =
        await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(
          sessionError.message,
        );
      }

      if (!session?.access_token) {
        throw new Error(
          "Your login session has expired. Please log in again.",
        );
      }

      /*
       * -----------------------------------------------------
       * 5. LOAD CASHFREE
       * -----------------------------------------------------
       */

      await loadCashfreeScript();

      if (!window.Cashfree) {
        throw new Error(
          "Cashfree SDK is not available.",
        );
      }

      /*
       * -----------------------------------------------------
       * 6. REQUEST BODY
       * -----------------------------------------------------
       */

      const requestBody: Record<
        string,
        unknown
      > = {
        customer_name:
          customerName.trim(),

        customer_email:
          customerEmail
            .trim()
            .toLowerCase(),

        customer_phone:
          customerPhone.trim(),

        shipping_address_line1:
          shippingAddressLine1.trim(),

        shipping_address_line2:
          shippingAddressLine2?.trim() ||
          "",

        shipping_city:
          shippingCity.trim(),

        shipping_state:
          shippingState.trim(),

        shipping_postal_code:
          shippingPostalCode.trim(),

        shipping_country:
          shippingCountry?.trim() ||
          "India",

        billing_address_line1:
          billingAddressLine1?.trim() ||
          "",

        billing_address_line2:
          billingAddressLine2?.trim() ||
          "",

        billing_city:
          billingCity?.trim() ||
          "",

        billing_state:
          billingState?.trim() ||
          "",

        billing_postal_code:
          billingPostalCode?.trim() ||
          "",

        billing_country:
          billingCountry?.trim() ||
          "India",

        customer_note:
          customerNote?.trim() ||
          "",
      };

      /*
       * BUY NOW
       */

      if (productId) {
        requestBody.product_id =
          productId;

        requestBody.quantity =
          normalizedQuantity;
      }

      /*
       * -----------------------------------------------------
       * 7. CREATE SERVER ORDER
       * -----------------------------------------------------
       */

      const response =
        await fetch(
          "/api/payment/create-order",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              /*
               * IMPORTANT:
               * Send Supabase access token
               * directly to the API.
               */
              Authorization: `Bearer ${session.access_token}`,
            },

            body: JSON.stringify(
              requestBody,
            ),
          },
        );

      /*
       * -----------------------------------------------------
       * 8. PARSE RESPONSE
       * -----------------------------------------------------
       */

      let data: {
        success?: boolean;
        error?: string;
        payment_session_id?: string;
        order_id?: string;
        order_number?: string;
        cashfree_order_id?: string;
        amount?: number;
        currency?: string;
      };

      try {
        data =
          await response.json();
      } catch {
        throw new Error(
          "Invalid response from the payment server.",
        );
      }

      /*
       * -----------------------------------------------------
       * 9. SERVER ERROR
       * -----------------------------------------------------
       */

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to create payment.",
        );
      }

      /*
       * -----------------------------------------------------
       * 10. PAYMENT SESSION
       * -----------------------------------------------------
       */

      if (
        !data.payment_session_id
      ) {
        throw new Error(
          "Payment session was not created.",
        );
      }

      /*
       * -----------------------------------------------------
       * 11. CASHFREE MODE
       * -----------------------------------------------------
       */

      const environment =
        process.env
          .NEXT_PUBLIC_CASHFREE_ENVIRONMENT;

      const cashfree =
        window.Cashfree({
          mode:
            environment ===
            "production"
              ? "production"
              : "sandbox",
        });

      /*
       * -----------------------------------------------------
       * 12. OPEN CASHFREE
       * -----------------------------------------------------
       */

      await cashfree.checkout({
        paymentSessionId:
          data.payment_session_id,

        redirectTarget:
          "_self",
      });
    } catch (checkoutError) {
      console.error(
        "Cashfree checkout error:",
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
        onClick={
          handleCheckout
        }
        disabled={
          disabled || loading
        }
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
        Secure payment powered by Cashfree.
      </p>

    </div>
  );
}