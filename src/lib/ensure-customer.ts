// lib/ensure-customer.ts
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function ensureCustomer(user: { id: string; email?: string | null }) {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // service role – server only
    { auth: { persistSession: false } }
  );

  const { data: row, error } = await admin
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .maybeSingle();
  if (error) throw error;

  if (row?.stripe_customer_id) return row.stripe_customer_id;

  const customer = await stripe.customers.create({
    email: user.email ?? undefined,
    metadata: { supabase_user_id: user.id },
  });

  const { error: upsertErr } = await admin
    .from('customers')
    .upsert({ id: user.id, stripe_customer_id: customer.id });
  if (upsertErr) throw upsertErr;

  return customer.id;
}
