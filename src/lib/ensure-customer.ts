// lib/ensure-customer.ts (updated)
import { stripe } from '@/lib/stripe'
import { createClientRSC } from '../../utils/supabase/server'

export async function ensureCustomer() {
  const supabase = await createClientRSC()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: mapping } = await supabase
    .from('customers')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (mapping?.stripe_customer_id) return mapping.stripe_customer_id

  const customer = await stripe.customers.create({
    email: user.email ?? undefined,
    metadata: { user_id: user.id },
  })

  await supabase.from('customers').insert({
    user_id: user.id,
    stripe_customer_id: customer.id,
  })

  return customer.id
}
