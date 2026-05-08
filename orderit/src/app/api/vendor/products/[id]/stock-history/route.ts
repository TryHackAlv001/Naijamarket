import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

  const productId = params.id;

  // Verify the product belongs to the vendor
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("vendor_id")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  if (product.vendor_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Fetch stock history
  const { data: logs, error: logsError } = await supabase
    .from("stock_logs")
    .select(`
      id,
      previous_qty,
      new_qty,
      changed_at,
      user:users(full_name, email)
    `)
    .eq("product_id", productId)
    .order("changed_at", { ascending: false });

  if (logsError) {
    console.error("Error fetching stock logs:", logsError);
    return NextResponse.json({ error: "Failed to fetch stock history" }, { status: 500 });
  }

  return NextResponse.json({
    logs: logs || [],
  });
}