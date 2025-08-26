// app/api/stripe/webhook/route.ts
export const runtime = 'nodejs'

import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'

import { NextRequest } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET! // from Dashboard

function resolveUserType(price: Stripe.Price): 'investor' | 'business' | null {
  const meta = (price.metadata?.user_type ?? '').toLowerCase()
  if (meta === 'investor' || meta === 'business') return meta
  const lk = (price.lookup_key ?? '').toLowerCase()
  if (lk.startsWith('investor_')) return 'investor'
  if (lk.startsWith('business_')) return 'business'
  return null
}

function toMessage(e: unknown): string {
  if (typeof e === "object" && e !== null && "message" in e) {
    const m = (e as { message?: unknown }).message
    if (typeof m === "string") return m
  }
  if (typeof e === "string") return e
  try { return JSON.stringify(e) } catch { /* noop */ }
  return "Unknown error"
}

export async function POST(req: NextRequest) {
  // Verify signature with the RAW body
  const sig = req.headers.get('stripe-signature')!
  const body = await req.text()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err: unknown) {
    const msg = toMessage(err)
    return new Response(`Webhook Error: ${msg}.`, { status: 400 })
  }

  // We care about subscription lifecycle
  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    const sub = event.data.object as Stripe.Subscription

    // Ensure we have full price info (lookup_key/metadata)
    const full = await stripe.subscriptions.retrieve(sub.id, {
      expand: ['items.data.price'],
    })
    const item = full.items.data[0] // single-plan subs
    const price = item.price as Stripe.Price

    // who is the app user?
    let userId = full.metadata?.supabase_user_id || null
    if (!userId) {
      // Fallback: map via customers table (customer -> user_id)
      const stripeCustomerId =
        typeof full.customer === 'string' ? full.customer : full.customer?.id
      const { data: mapRow } = await supabaseAdmin
        .from('customers')
        .select('user_id')
        .eq('stripe_customer_id', stripeCustomerId)
        .maybeSingle()
      userId = mapRow?.user_id ?? null
    }

    if (userId) {
      const userType = resolveUserType(price)

      // Decide when to set vs clear. Common pattern:
      // - active/trialing => set type
      // - canceled/paused/past_due => clear to 'member' (or null)
      const status = full.status // 'active' | 'trialing' | 'canceled' | ...
      const nextType =
        userType && (status === 'active' || status === 'trialing')
          ? userType
          : 'member' // or null, up to you

      await supabaseAdmin
        .from('profiles')
        .update({ user_type: nextType })
        .eq('id', userId)
    }

    // (Optional) also mirror the subscription row here for quick checks
    // await supabaseAdmin.from('subscriptions').upsert({...})
  }

  return new Response('ok', { status: 200 })
}
