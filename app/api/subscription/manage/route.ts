import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function POST(request: NextRequest) {
  const { action } = await request.json();
  
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    if (action === "cancel") {
      // Get user's payment record
      const { data: payment } = await supabase
        .from("paystack_payments")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "success")
        .order("paid_at", { ascending: false })
        .limit(1)
        .single();

      if (!payment) {
        return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
      }

      // Update payment status to canceled
      const { error } = await supabase
        .from("paystack_payments")
        .update({ status: "canceled" })
        .eq("id", payment.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Subscription canceled successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Subscription management error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}