import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Check SmoothPay payments
  const { data: smoothpayPayment, error: smoothpayError } = await supabase
    .from("paystack_payments")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "success")
    .order("paid_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let subscriptionData = {
    active: false,
    status: "inactive" as string,
    expires_at: null as string | null,
    provider: null as string | null,
    plan_type: null as string | null,
    amount: null as number | null,
    currency: null as string | null
  };

  // Check SmoothPay payment
  if (smoothpayPayment) {
    const paidAt = new Date(smoothpayPayment.paid_at);
    const expiresAt = new Date(paidAt);
    
    // Add subscription period based on plan type
    if (smoothpayPayment.plan_type === "month") {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else if (smoothpayPayment.plan_type === "year") {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else if (smoothpayPayment.plan_type === "basic") {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else if (smoothpayPayment.plan_type === "free") {
      // Free plan never expires
      expiresAt.setFullYear(expiresAt.getFullYear() + 100);
    }
    
    subscriptionData = {
      active: expiresAt > new Date(),
      status: expiresAt > new Date() ? "active" : "expired",
      expires_at: expiresAt.toISOString(),
      provider: "smoothpay",
      plan_type: smoothpayPayment.plan_type,
      amount: smoothpayPayment.amount,
      currency: smoothpayPayment.currency
    };
  }

  console.log('Final subscription data:', subscriptionData);
  return NextResponse.json(subscriptionData);
}