// lib/ensure-customer-for.ts
import { stripe } from '@/lib/stripe'
import { createClient } from '../../utils/supabase/server'

export async function ensureCustomerFor(userId: string, email?: string) {
  const supabase = await createClient()
  const { data: row } = await supabase
    .from('customers')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (row?.stripe_customer_id) return row.stripe_customer_id

  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId }, // handy for reconciliation
  })

  await supabase.from('customers').insert({
    user_id: userId,
    stripe_customer_id: customer.id,
  })

  return customer.id
}
