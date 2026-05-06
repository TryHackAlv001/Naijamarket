interface OrderCardProps {
  orderNumber: string;
  status: string;
}

export function OrderCard({ orderNumber, status }: OrderCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold">Order {orderNumber}</h3>
      <p className="mt-2 text-sm text-slate-600">Status: {status}</p>
    </article>
  );
}
