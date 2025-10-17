// app/api/stripe/webhook/route.ts
export const runtime = 'nodejs';

import Stripe from 'stripe';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

function toIsoOrNull(sec?: number | null): string | null {
  return typeof sec === 'number' && Number.isFinite(sec)
    ? new Date(sec * 1000).toISOString()
    : null;
}

// (kept) derive user type from price metadata/lookup_key for base plan flows
function resolveUserType(price: Stripe.Price): 'investor' | 'business' | null {
  const meta = (price.metadata?.user_type ?? '').toLowerCase();
  if (meta === 'investor' || meta === 'business') return meta;
  const lk = (price.lookup_key ?? '').toLowerCase();
  if (lk.startsWith('investor_')) return 'investor';
  if (lk.startsWith('business_')) return 'business';
  return null;
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  if (!sig) return new Response('Missing signature', { status: 400 });

  let event: Stripe.Event;
  try {
    const raw = await req.text();
    event = stripe.webhooks.constructEvent(raw, sig, endpointSecret);
  } catch (e) {
    console.error('Signature verification failed:', e);
    return new Response('Bad signature', { status: 400 });
  }

  try {
    console.log('➡️ Event:', event.type);
    const admin = getSupabaseAdmin();

    // ------------------------------------------------------------------
    // (Optional) Safety net: map customers on checkout completion
    // ------------------------------------------------------------------
    if (event.type === 'checkout.session.completed') {
      const sess = event.data.object as Stripe.Checkout.Session;
      const userId = (sess.metadata?.['supabase_user_id'] ?? null) as string | null;
      const customerId = (sess.customer ??
        (sess.customer_details as any)?.id ??
        null) as string | null;

      if (userId && customerId) {
        const { error } = await admin
          .from('customers')
          .upsert({ id: userId, stripe_customer_id: customerId });
        if (error) console.error('customers upsert error:', error);
      }
      return new Response('ok', { status: 200 });
    }

    // ------------------------------------------------------------------
    // Subscription lifecycle: created/updated/deleted
    // ------------------------------------------------------------------
    if (
      event.type === 'customer.subscription.created' ||
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.deleted'
    ) {
      const sub = event.data.object as Stripe.Subscription;

      // Expand for item price + customer
      const full = (await stripe.subscriptions.retrieve(sub.id, {
        expand: ['items.data.price', 'customer'],
      })) as Stripe.Subscription;

      const item = full.items?.data?.[0];
      const price = item?.price as Stripe.Price | undefined;

      // Try to resolve userId from subscription metadata first
      let userId: string | null = full.metadata?.['supabase_user_id'] ?? null;
      if (!userId) {
        const stripeCustomerId =
          typeof full.customer === 'string' ? full.customer : full.customer?.id;
        if (stripeCustomerId) {
          const { data: mapRow, error: mapErr } = await admin
            .from('customers')
            .select('id')
            .eq('stripe_customer_id', stripeCustomerId)
            .maybeSingle();
          if (mapErr) {
            console.error('DB map error:', mapErr);
            return new Response('DB map error', { status: 500 });
          }
          userId = mapRow?.id ?? null;
        }
      }

      // ✅ Detect "promo" from SUBSCRIPTION metadata (not from Price)
      const purpose = (full.metadata?.['purpose'] ?? '').toLowerCase();
      const isPromoSub = purpose === 'listing_promo';
      const listingId = full.metadata?.['listing_id'] ?? null;

      if (isPromoSub) {
        const status = full.status;
        // ✅ Use subscription root `current_period_end`
        const periodEnd = toIsoOrNull(full.current_period_end);

        if (listingId) {
          // Denormalize owner_id for convenience
          let ownerId = userId ?? null;
          if (!ownerId) {
            const { data: listingRow, error: listErr } = await admin
              .from('business_listings')
              .select('owner_id')
              .eq('id', listingId)
              .maybeSingle();
            if (listErr) console.error('Fetch listing owner error:', listErr);
            ownerId = listingRow?.owner_id ?? null;
          }

          // Upsert the promotion record
          const { error: upErr } = await admin.from('listing_promotions').upsert({
            listing_id: listingId,
            stripe_subscription_id: full.id,
            stripe_price_id: price?.id ?? null,
            status,
            current_period_end: periodEnd,
            cancel_at_period_end: !!full.cancel_at_period_end,
            owner_id: ownerId ?? undefined,
            updated_at: new Date().toISOString(),
          });
          if (upErr) console.error('listing_promotions upsert error:', upErr);

          // Optional badge cache on the listing
          const promoted =
            status === 'active' ||
            status === 'trialing' ||
            (status === 'past_due' && !full.cancel_at_period_end);

          const { error: upListErr } = await admin
            .from('business_listings')
            .update({ is_promoted: promoted })
            .eq('id', listingId);
          if (upListErr) console.error('business_listings update error:', upListErr);
        }

        return new Response('ok', { status: 200 });
      }

      // ===== Base membership branch (non-promo) =====
      // Keep your existing base-plan handling here (user type, memberships, etc.)
      if (price && userId) {
        const userType = resolveUserType(price);
        if (userType) {
          const status = full.status;
          const nextType =
            status === 'active' || status === 'trialing' ? userType : 'member';

          const { error: updErr } = await admin
            .from('profiles')
            .update({ user_type: nextType })
            .eq('id', userId);
          if (updErr) {
            console.error('profiles update error:', updErr);
            return new Response('DB update error', { status: 500 });
          }
          console.log(`Set profiles.user_type=${nextType} for user ${userId}`);
        }
      }

      return new Response('ok', { status: 200 });
    }

    return new Response('ok', { status: 200 });
  } catch (e) {
    console.error('Unhandled webhook error:', e);
    return new Response('Internal error', { status: 500 });
  }
}
