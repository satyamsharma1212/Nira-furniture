// src/types/validator.ts

export type ValidationErrors = Record<
  string,
  string
>;

/* =========================================================
   CUSTOMER
========================================================= */

export type PaymentCustomer = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
};

/* =========================================================
   ADDRESS
========================================================= */

export type PaymentAddress = {
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country?: string | null;
};

/* =========================================================
   CREATE PAYMENT ORDER
========================================================= */

export type CreatePaymentOrderInput = {
  customer: PaymentCustomer;
  shipping: PaymentAddress;
  billing?: PaymentAddress | null;

  product_id?: string | null;
  quantity?: number;

  customer_note?: string | null;
};

/* =========================================================
   CUSTOMER VALIDATION
========================================================= */

export function validateCustomer(
  customer: Partial<PaymentCustomer>,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (
    typeof customer.customer_name !==
      "string" ||
    !customer.customer_name.trim()
  ) {
    errors.customer_name =
      "Customer name is required.";
  }

  if (
    typeof customer.customer_email !==
      "string" ||
    !customer.customer_email.trim()
  ) {
    errors.customer_email =
      "Customer email is required.";
  } else {
    const email =
      customer.customer_email.trim();

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email,
      )
    ) {
      errors.customer_email =
        "Please enter a valid email address.";
    }
  }

  if (
    typeof customer.customer_phone !==
      "string" ||
    !customer.customer_phone.trim()
  ) {
    errors.customer_phone =
      "Customer phone is required.";
  } else {
    const phone =
      customer.customer_phone.replace(
        /\D/g,
        "",
      );

    if (
      phone.length < 10 ||
      phone.length > 15
    ) {
      errors.customer_phone =
        "Please enter a valid phone number.";
    }
  }

  return errors;
}

/* =========================================================
   ADDRESS VALIDATION
========================================================= */

export function validateAddress(
  address: Partial<PaymentAddress>,
  prefix = "address",
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (
    typeof address.address_line1 !==
      "string" ||
    !address.address_line1.trim()
  ) {
    errors[`${prefix}_line1`] =
      "Address is required.";
  }

  if (
    typeof address.city !==
      "string" ||
    !address.city.trim()
  ) {
    errors[`${prefix}_city`] =
      "City is required.";
  }

  if (
    typeof address.state !==
      "string" ||
    !address.state.trim()
  ) {
    errors[`${prefix}_state`] =
      "State is required.";
  }

  if (
    typeof address.postal_code !==
      "string" ||
    !address.postal_code.trim()
  ) {
    errors[`${prefix}_postal_code`] =
      "Postal code is required.";
  }

  return errors;
}

/* =========================================================
   QUANTITY VALIDATION
========================================================= */

export function validateQuantity(
  quantity: unknown,
) {
  const value = Number(quantity);

  if (
    !Number.isInteger(value) ||
    value <= 0
  ) {
    return {
      valid: false,
      quantity: 1,
      error:
        "Quantity must be at least 1.",
    };
  }

  return {
    valid: true,
    quantity: value,
    error: null,
  };
}

/* =========================================================
   AMOUNT VALIDATION
========================================================= */

export function validateAmount(
  amount: unknown,
) {
  const value = Number(amount);

  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return {
      valid: false,
      amount: 0,
      error:
        "Payment amount must be greater than zero.",
    };
  }

  return {
    valid: true,
    amount: Number(
      value.toFixed(2),
    ),
    error: null,
  };
}

/* =========================================================
   COMPLETE PAYMENT ORDER VALIDATION
========================================================= */

export function validateCreatePaymentOrder(
  input: Partial<CreatePaymentOrderInput>,
) {
  const errors: ValidationErrors = {};

  const customerErrors =
    validateCustomer(
      input.customer || {},
    );

  Object.assign(
    errors,
    customerErrors,
  );

  const shippingErrors =
    validateAddress(
      input.shipping || {},
      "shipping",
    );

  Object.assign(
    errors,
    shippingErrors,
  );

  if (input.billing) {
    const billingErrors =
      validateAddress(
        input.billing,
        "billing",
      );

    Object.assign(
      errors,
      billingErrors,
    );
  }

  if (input.product_id) {
    const quantityResult =
      validateQuantity(
        input.quantity,
      );

   if (input.product_id) {
  const quantityResult = validateQuantity(
    input.quantity,
  );

  if (!quantityResult.valid && quantityResult.error) {
    errors.quantity = quantityResult.error;
  }
}
  }

  return {
    valid:
      Object.keys(errors).length ===
      0,

    errors,
  };
}

/* =========================================================
   SANITIZATION
========================================================= */

export function sanitizeText(
  value: unknown,
): string {
  if (
    typeof value !== "string"
  ) {
    return "";
  }

  return value.trim();
}

export function sanitizeEmail(
  value: unknown,
): string {
  return sanitizeText(
    value,
  ).toLowerCase();
}

export function sanitizePhone(
  value: unknown,
): string {
  return sanitizeText(value).replace(
    /[^\d+]/g,
    "",
  );
}