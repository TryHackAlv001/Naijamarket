import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  const supabase = createSupabaseServerClient();
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (userError || !user || user.role !== "vendor") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const productId = params.productId;
  const body = await request.json();
  const { stock_quantity } = body;

  if (typeof stock_quantity !== "number" || stock_quantity < 0) {
    return NextResponse.json({ error: "Invalid stock quantity" }, { status: 400 });
  }

  // Get current product to log the change
  const { data: currentProduct, error: fetchError } = await supabase
    .from("products")
    .select("stock_quantity, vendor_id")
    .eq("id", productId)
    .single();

  if (fetchError || !currentProduct) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (currentProduct.vendor_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Update the stock quantity
  const { data: updatedProduct, error: updateError } = await supabase
    .from("products")
    .update({ stock_quantity })
    .eq("id", productId)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: "Failed to update stock" }, { status: 500 });
  }

  // Log the stock change
  const { error: logError } = await supabase
    .from("stock_logs")
    .insert({
      product_id: productId,
      previous_qty: currentProduct.stock_quantity,
      new_qty: stock_quantity,
      changed_by: userId,
    });

  if (logError) {
    console.error("Failed to log stock change:", logError);
    // Don't fail the request if logging fails
  }

  return NextResponse.json({
    success: true,
    product: updatedProduct,
  });
}