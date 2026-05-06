export const flutterwaveConfig = {
  publicKey: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY ?? "",
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY ?? "",
};

export function createFlutterwavePayment(amount: number, email: string) {
  return {
    amount,
    email,
    publicKey: flutterwaveConfig.publicKey,
  };
}

export async function verifyFlutterwavePayment(transactionId: string) {
  return {
    transactionId,
    verified: false,
  };
}
