import OrderDetailPageWrapper from "./OrderDetailPage";

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  return <OrderDetailPageWrapper params={params} />;
}