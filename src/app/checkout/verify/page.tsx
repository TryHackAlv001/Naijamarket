"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";

type PaymentStatus = "checking" | "success" | "failed" | "error";

interface VerificationData {
  verified: boolean;
  message: string;
  data?: {
    reference?: string;
    transactionId?: string;
    amount: number;
    status: string;
  };
}

export default function VerifyPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<PaymentStatus>("checking");
  const [data, setData] = useState<VerificationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const gateway = searchParams.get("gateway");
  const reference = searchParams.get("reference");
  const transactionId = searchParams.get("transaction_id");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!gateway) {
          setStatus("error");
          setError("Missing payment gateway information");
          return;
        }

        let verifyUrl = "";

        if (gateway === "paystack" && reference) {
          verifyUrl = `/api/payments/paystack/verify?reference=${reference}`;
        } else if (gateway === "flutterwave" && transactionId) {
          verifyUrl = `/api/payments/flutterwave/verify?transaction_id=${transactionId}`;
        } else {
          setStatus("error");
          setError("Invalid payment gateway or missing parameters");
          return;
        }

        const response = await fetch(verifyUrl);
        const result = (await response.json()) as VerificationData;

        setData(result);

        if (result.verified) {
          setStatus("success");
          // Redirect to orders page after 3 seconds
          setTimeout(() => {
            router.push("/main/orders");
          }, 3000);
        } else {
          setStatus("failed");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setStatus("error");
        setError("Failed to verify payment. Please try again.");
      }
    };

    verifyPayment();
  }, [gateway, reference, transactionId, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        {status === "checking" && (
          <div className="flex flex-col items-center gap-4">
            <Spinner />
            <h1 className="text-2xl font-bold text-slate-900">
              Verifying Payment
            </h1>
            <p className="text-center text-slate-600">
              Please wait while we verify your payment...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-green-100 p-4">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Payment Successful!
            </h1>
            <p className="text-center text-slate-600">
              Your payment has been verified successfully. Your order is being
              processed.
            </p>
            {data?.data && (
              <div className="w-full space-y-2 rounded-lg bg-slate-50 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Amount:</span>
                  <span className="font-semibold text-slate-900">
                    ₦{data.data.amount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Reference:</span>
                  <span className="font-mono text-xs text-slate-900">
                    {data.data.reference || data.data.transactionId}
                  </span>
                </div>
              </div>
            )}
            <p className="text-center text-sm text-slate-500">
              Redirecting to your orders in a moment...
            </p>
            <Button
              onClick={() => router.push("/main/orders")}
              className="w-full"
            >
              Go to Orders
            </Button>
          </div>
        )}

        {status === "failed" && (
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-red-100 p-4">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Payment Failed
            </h1>
            <p className="text-center text-slate-600">
              {data?.message || "Your payment could not be processed."}
            </p>
            <div className="flex w-full gap-3">
              <Button
                onClick={() => router.back()}
                className="flex-1 border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
              >
                Go Back
              </Button>
              <Button
                onClick={() => router.push("/main/checkout")}
                className="flex-1"
              >
                Retry Payment
              </Button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-yellow-100 p-4">
              <svg
                className="h-8 w-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Error Verifying Payment
            </h1>
            <p className="text-center text-slate-600">
              {error || "An error occurred while verifying your payment."}
            </p>
            <div className="flex w-full gap-3">
              <Button
                onClick={() => router.back()}
                className="flex-1 border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
              >
                Go Back
              </Button>
              <Button
                onClick={() => router.push("/main/checkout")}
                className="flex-1"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
