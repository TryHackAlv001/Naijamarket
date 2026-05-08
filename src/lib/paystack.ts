export const paystackConfig = {
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
  secretKey: process.env.PAYSTACK_SECRET_KEY ?? "",
  baseUrl: "https://api.paystack.co",
};

export interface PaystackInitializePayload {
  email: string;
  amount: number;
  reference: string;
  metadata?: Record<string, unknown>;
}

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    reference: string;
    amount: number;
    status: string;
    paid_at: string;
    customer: {
      id: number;
      email: string;
    };
  };
}

/**
 * Initialize a Paystack payment
 * @param email Customer email
 * @param amount Amount in kobo (multiply naira by 100)
 * @param reference Unique reference for this transaction
 * @param metadata Additional metadata to attach to payment
 * @returns Authorization URL and payment details
 */
export async function initializePayment(
  email: string,
  amount: number,
  reference: string,
  metadata?: Record<string, unknown>
): Promise<PaystackInitializeResponse> {
  try {
    const response = await fetch(`${paystackConfig.baseUrl}/transaction/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${paystackConfig.secretKey}`,
      },
      body: JSON.stringify({
        email,
        amount, // already in kobo
        reference,
        metadata: metadata || {},
      }),
    });

    const data = await response.json();
    return data as PaystackInitializeResponse;
  } catch (error) {
    console.error("Paystack initialization error:", error);
    return {
      status: false,
      message: "Failed to initialize payment",
    };
  }
}

/**
 * Verify a Paystack payment
 * @param reference Transaction reference
 * @returns Payment status and details
 */
export async function verifyPayment(
  reference: string
): Promise<PaystackVerifyResponse> {
  try {
    const response = await fetch(`${paystackConfig.baseUrl}/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${paystackConfig.secretKey}`,
      },
    });

    const data = await response.json();
    return data as PaystackVerifyResponse;
  } catch (error) {
    console.error("Paystack verification error:", error);
    return {
      status: false,
      message: "Failed to verify payment",
    };
  }
}
