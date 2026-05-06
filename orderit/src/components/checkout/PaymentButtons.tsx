import { Button } from "@/components/ui/Button";

export function PaymentButtons() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Button type="button">Pay with Paystack</Button>
      <Button type="button">Pay with Flutterwave</Button>
    </div>
  );
}
