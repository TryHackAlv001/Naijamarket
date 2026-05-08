import { NextRequest, NextResponse } from "next/server";
import { initializePayment } from "@/lib/paystack";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, email, amount } = body;

    // Validate inputs
    if (!orderId || !email || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: orderId, email, amount" },
        { status: 400 }
      );
    }

    // Verify order exists and get buyer info
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        buyer: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Generate unique reference for this transaction
    const reference = `paystack_${orderId}_${Date.now()}`;

    // Initialize Paystack payment
    const paystackResponse = await initializePayment(
      email,
      amount * 100, // Convert to kobo
      reference,
      {
        orderId,
        buyerId: order.buyer_id,
      }
    );

    if (!paystackResponse.status || !paystackResponse.data) {
      return NextResponse.json(
        { error: paystackResponse.message || "Failed to initialize payment" },
        { status: 400 }
      );
    }

    // Update order with payment reference
    await prisma.orders.update({
      where: { id: orderId },
      data: {
        payment_method: "paystack",
        payment_reference: reference,
        payment_status: "pending",
      },
    });

    return NextResponse.json({
      status: true,
      data: {
        authorization_url: paystackResponse.data.authorization_url,
        access_code: paystackResponse.data.access_code,
        reference: paystackResponse.data.reference,
      },
    });
  } catch (error) {
    console.error("Paystack initialize error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
