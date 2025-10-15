// app/api/stripe/webhook/route.ts
export const runtime = 'nodejs'

import Stripe from 'stripe'
import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

async function getSubStrict(id: string): Promise<Stripe.Subscription> {
  const resp = await stripe.subscriptions.retrieve(id, {
    expand: ['items.data.price', 'customer'],
  });
  // Some stripe type versions expose Response<T>; force it to Subscription.
  return resp as unknown as Stripe.Subscription;
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, serviceKey, { auth: { persistSession: false } })
}

function toIsoOrNull(sec?: number | null): string | null {
  return Number.isFinite(sec) ? new Date((sec as number) * 1000).toISOString() : null;
}

// NEW: promo detector
function isPromo(price: Stripe.Price) {
  const lk = (price.lookup_key ?? '').toLowerCase()
  const purpose = (price.metadata?.purpose ?? '').toLowerCase()
  return lk.startsWith('business_promo') || purpose === 'listing_promo'
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
      
      const full = await getSubStrict(sub.id);

      // Now this is typed and works:


      const item = full.items?.data?.[0]
      if (!item?.price) {
        console.warn('Subscription has no item/price', { subId: full.id })
        return new Response('ok', { status: 200 })
      }
      
      const price = item.price as Stripe.Price
      const admin = getSupabaseAdmin()

      // Resolve userId
      let userId: string | null = full.metadata?.['supabase_user_id'] ?? null
      if (!userId) {
        const stripeCustomerId =
          typeof full.customer === 'string' ? full.customer : full.customer?.id
        if (!stripeCustomerId) return new Response('ok', { status: 200 })

        // FIX: your schema shows customers(id, stripe_customer_id), not user_id
        const { data: mapRow, error: mapErr } = await admin
          .from('customers')
          .select('id')          // <— was 'user_id'
          .eq('stripe_customer_id', stripeCustomerId)
          .maybeSingle()
        if (mapErr) return new Response('DB map error', { status: 500 })
        userId = mapRow?.id ?? null
      }

      // ==== A) Boosted listing (guarded) ====
      if (isPromo(price)) {
        const listingId = full.metadata?.['listing_id'] ?? null
        const status = full.status
        const periodEnd = toIsoOrNull(item?.current_period_end);

        if (listingId) {
          // Upsert a link row (create table listing_promotions as shown earlier)
          await admin.from('listing_promotions').upsert({
            listing_id: listingId,
            stripe_subscription_id: full.id,
            status,
            current_period_end: periodEnd,
            cancel_at_period_end: !!full.cancel_at_period_end,
          })

          // Optional cache on the listing for badge
          const promoted =
            status === 'active' ||
            status === 'trialing' ||
            (status === 'past_due' && !full.cancel_at_period_end)
          await admin
            .from('business_listings')
            .update({ is_promoted: promoted })
            .eq('id', listingId)
        }

        return new Response('ok', { status: 200 })
      }

      // ==== B) Your existing base-plan logic unchanged ====
      const userType = resolveUserType(price)
      if (!userType || !userId) return new Response('ok', { status: 200 })

      const status = full.status
      const nextType =
        status === 'active' || status === 'trialing' ? userType : 'member'

      const { error: updErr } = await admin
        .from('profiles')
        .update({ user_type: nextType })
        .eq('id', userId)
      if (updErr) return new Response('DB update error', { status: 500 })

      console.log(`Set profiles.user_type=${nextType} for user ${userId}`)
    }

    return new Response('ok', { status: 200 })
  } catch (e) {
    console.error('Unhandled webhook error:', e)
    return new Response('Internal error', { status: 500 })
  }
}
