interface OrderStatusProps {
  status: string;
}

export function OrderStatus({ status }: OrderStatusProps) {
  return <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">{status}</span>;
}
