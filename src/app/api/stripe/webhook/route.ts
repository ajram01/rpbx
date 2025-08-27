// app/api/stripe/webhook/route.ts
export const runtime = 'nodejs'

import Stripe from 'stripe'
import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
// ⬇For local dev, this must be the current `whsec_...` from `stripe listen`
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // correct name
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}

function resolveUserType(price: Stripe.Price): 'investor' | 'business' | null {
  const meta = (price.metadata?.user_type ?? '').toLowerCase()
  if (meta === 'investor' || meta === 'business') return meta
  const lk = (price.lookup_key ?? '').toLowerCase()
  if (lk.startsWith('investor_')) return 'investor'
  if (lk.startsWith('business_')) return 'business'
  return null
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  if (!sig) return new Response('Missing signature', { status: 400 })

  let event: Stripe.Event
  try {
    const raw = await req.text()
    event = stripe.webhooks.constructEvent(raw, sig, endpointSecret)
  } catch (e) {
    console.error('Signature verification failed:', e)
    return new Response('Bad signature', { status: 400 })
  }

  try {
    console.log('➡️ Event:', event.type)

    if (
      event.type === 'customer.subscription.created' ||
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.deleted'
    ) {
      const sub = event.data.object as Stripe.Subscription
      const full = await stripe.subscriptions.retrieve(sub.id, {
        expand: ['items.data.price', 'customer'],
      })

      const item = full.items?.data?.[0]
      if (!item?.price) {
        console.warn('Subscription has no item/price', { subId: full.id })
        return new Response('ok', { status: 200 })
      }

      const price = item.price as Stripe.Price
      const userType = resolveUserType(price)
      if (!userType) {
        console.warn('Could not resolve user_type from price', {
          priceId: price.id,
          lookup_key: price.lookup_key,
          metadata: price.metadata,
        })
        return new Response('ok', { status: 200 })
      }

      const admin = getSupabaseAdmin()

      // Prefer metadata set during Checkout Session: subscription_data.metadata.supabase_user_id
      let userId: string | null = full.metadata?.['supabase_user_id'] ?? null
      if (!userId) {
        const stripeCustomerId =
          typeof full.customer === 'string' ? full.customer : full.customer?.id
        if (!stripeCustomerId) {
          console.warn('Missing stripe customer on subscription', full.id)
          return new Response('ok', { status: 200 })
        }

        const { data: mapRow, error: mapErr } = await admin
          .from('customers')
          .select('user_id')
          .eq('stripe_customer_id', stripeCustomerId)
          .maybeSingle()

        if (mapErr) {
          console.error('customers lookup error:', mapErr)
          return new Response('DB map error', { status: 500 })
        }

        userId = mapRow?.user_id ?? null
      }

      if (!userId) {
        console.warn('Could not resolve userId for sub', { subId: full.id })
        return new Response('ok', { status: 200 })
      }

      const status = full.status // active | trialing | past_due | canceled | ...
      const nextType =
        (status === 'active' || status === 'trialing') ? userType : 'member'

      const { error: updErr } = await admin
        .from('profiles')
        .update({ user_type: nextType })
        .eq('id', userId)

      if (updErr) {
        console.error('profiles update error:', {
          code: updErr.code,
          message: updErr.message,
          details: updErr.details,
          hint: updErr.hint,
        })
        return new Response('DB update error', { status: 500 })
      }

      console.log(`Set profiles.user_type=${nextType} for user ${userId}`)
    }

    return new Response('ok', { status: 200 })
  } catch (e) {
    console.error('Unhandled webhook error:', e)
    return new Response('Internal error', { status: 500 })
  }
}
