import { createClient } from "@/lib/server";

export async function checkSubscriptionStatus(userId: string) {
  const supabase = await createClient();

  // Check Stripe subscription
  const { data: stripeSubscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  // Check Paystack payments
  const { data: paystackPayment } = await supabase
    .from("paystack_payments")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "success")
    .order("paid_at", { ascending: false })
    .limit(1)
    .single();

  // Check Stripe subscription
  if (stripeSubscription && stripeSubscription.status === "active") {
    const expiresAt = new Date(stripeSubscription.current_period_end);
    return expiresAt > new Date();
  }

  // Check Paystack payment
  if (paystackPayment) {
    const paidAt = new Date(paystackPayment.paid_at);
    const expiresAt = new Date(paidAt);
    
    if (paystackPayment.plan_type === "monthly") {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else if (paystackPayment.plan_type === "yearly") {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }
    
    return expiresAt > new Date();
  }

  return false;
}

export async function requireActiveSubscription(userId: string) {
  const hasActiveSubscription = await checkSubscriptionStatus(userId);
  
  if (!hasActiveSubscription) {
    throw new Error("Active subscription required");
  }
  
  return true;
}