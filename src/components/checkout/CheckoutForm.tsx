"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { PaymentButtons } from "./PaymentButtons";
import type { CartItem } from "@/types";

interface CheckoutFormProps {
  items: CartItem[];
  onOrderCreated?: (orderId: string) => void;
}

export function CheckoutForm({ items, onOrderCreated }: CheckoutFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryFee = 1000; // NGN 1000
  const total = subtotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!fullName.trim() || !deliveryAddress.trim()) {
        throw new Error("Please fill in all fields");
      }

      if (items.length === 0) {
        throw new Error("Cart is empty");
      }

      // TODO: Create order via API
      // For now, we'll simulate order creation
      const mockOrderId = `order_${Date.now()}`;
      setOrderId(mockOrderId);
      onOrderCreated?.(mockOrderId);

      // Order creation logic would go here
      // After creating order, the PaymentButtons component will use the orderId
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  // Show payment options after form submission
  if (orderId) {
    return (
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h3 className="font-semibold text-slate-900">Order Summary</h3>
          <div className="space-y-1 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span>₦{deliveryFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-1 font-semibold text-slate-900">
              <span>Total:</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-slate-900">Delivery Address</h3>
          <p className="text-sm text-slate-600">{deliveryAddress}</p>
        </div>

        <PaymentButtons
          orderId={orderId}
          email="buyer@example.com" // TODO: Get from auth context
          amount={total}
          customerName={fullName}
        />

        <Button
          type="button"
          onClick={() => setOrderId(null)}
          variant="outline"
          className="w-full"
        >
          Back to Form
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Full Name
        </label>
        <Input
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Delivery Address
        </label>
        <Input
          placeholder="Enter your delivery address"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2 rounded-lg bg-slate-50 p-4">
        <h3 className="font-semibold text-slate-900">Order Summary</h3>
        <div className="space-y-1 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>{items.length} item(s)</span>
            <span>₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery:</span>
            <span>₦{deliveryFee.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 font-semibold text-slate-900">
            <span>Total:</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || items.length === 0}
        className="w-full"
      >
        {isLoading ? <Spinner /> : "Proceed to Payment"}
      </Button>
    </form>
  );
}
