import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/server';
import { availablePlans } from '@/lib/plans';

export async function POST(request: NextRequest) {
  const { plan_type, user_id, email } = await request.json();
  
  const supabase = await createClient();
  
  // Get plan details
  const plan = availablePlans.find(p => p.id === plan_type);
  if (!plan) {
    return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 });
  }
  
  // Create payment record
  const reference = `smoothpay_${Date.now()}`;
  const amount = plan.price; // Store price as-is
  
  const { error } = await supabase
    .from('paystack_payments')
    .insert({
      user_id,
      email,
      reference,
      amount,
      currency: plan.currency,
      plan_type,
      status: 'success',
      paystack_reference: reference,
      transaction_id: `txn_${Date.now()}`,
      paid_at: new Date().toISOString()
    });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // Create subscription record
  const startDate = new Date();
  const endDate = new Date(startDate);
  
  if (plan_type === 'month') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else if (plan_type === 'year') {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }

  // Subscription data is tracked via paystack_payments table
  
  return NextResponse.json({ success: true, reference });
}