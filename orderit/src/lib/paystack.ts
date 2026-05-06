export const paystackConfig = {
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
  secretKey: process.env.PAYSTACK_SECRET_KEY ?? "",
};

export function createPaystackPayment(amount: number, email: string) {
  return {
    amount,
    email,
    publicKey: paystackConfig.publicKey,
  };
}

export async function verifyPaystackPayment(reference: string) {
  return {
    reference,
    verified: false,
  };
}
