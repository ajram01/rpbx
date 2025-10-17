// app/api/checkout/route.ts
export const runtime = 'nodejs';

import { stripe } from '@/lib/stripe';
import { ensureCustomer } from '@/lib/ensure-customer';

export async function POST(req: Request) {
  try {
    const { createClientRSC } = await import('@/../utils/supabase/server');
    const supabase = await createClientRSC();

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return new Response('Unauthorized', { status: 401 });

    const ct = req.headers.get('content-type') ?? '';

    // ---- Parse body (JSON + form) ----
    let priceId = '';
    let quantity = 1;
    let rawMeta: Record<string, unknown> | undefined;
    let successUrl: string | undefined;
    let cancelUrl: string | undefined;
    let listingId: string | undefined;
    let purpose: 'listing_promo' | 'listing_plan' | 'base_membership' | undefined;

    if (ct.includes('application/json')) {
      const body = await req.json();
      priceId    = String(body.priceId ?? '');
      quantity   = Number.isFinite(body.quantity) ? Math.max(1, Math.floor(body.quantity)) : 1;
      rawMeta    = body.metadata;
      successUrl = body.successUrl;
      cancelUrl  = body.cancelUrl;
      listingId  = body.listingId;
      purpose    = body.purpose;
    } else {
      const form = await req.formData();
      priceId  = String(form.get('priceId') ?? '');
      const q  = Number(form.get('quantity'));
      quantity = Number.isFinite(q) ? Math.max(1, Math.floor(q)) : 1;
      listingId = form.get('listingId')?.toString();
      const p   = form.get('purpose')?.toString();
      if (p === 'listing_promo' || p === 'listing_plan' || p === 'base_membership') purpose = p;
    }

    if (!priceId) return new Response('Missing priceId', { status: 400 });

    // If tied to a listing, verify ownership
    if (listingId) {
      const { data: listing, error: listErr } = await supabase
        .from('business_listings')
        .select('id, owner_id')
        .eq('id', listingId)
        .maybeSingle();
      if (listErr) return new Response('DB error', { status: 500 });
      if (!listing || listing.owner_id !== user.id) return new Response('Forbidden', { status: 403 });
    }

    // Coerce metadata to strings
    const safeMeta: Record<string, string> = Object.fromEntries(
      Object.entries(rawMeta ?? {}).map(([k, v]) => [k, v == null ? '' : String(v)])
    );

    // Decide purpose: default promo when listingId present, else base
    const finalPurpose = purpose ?? (listingId ? 'listing_promo' : 'base_membership');

    // Whitelist prices per purpose (security)
    const allowedPricesByPurpose: Record<string, string[]> = {
      listing_promo: [process.env.NEXT_PUBLIC_STRIPE_PRICE_PROMO!].filter(Boolean),
      listing_plan:  [process.env.NEXT_PUBLIC_STRIPE_PRICE_LISTING_PLAN!].filter(Boolean),
      base_membership: [process.env.NEXT_PUBLIC_STRIPE_PRICE_BASE!].filter(Boolean),
    };
    const allowed = allowedPricesByPurpose[finalPurpose] ?? [];
    if (!allowed.length || !allowed.includes(priceId)) {
      return new Response('Invalid price for purpose', { status: 400 });
    }

    // Optional: ensure price is recurring
    const fetchedPrice = await stripe.prices.retrieve(priceId);
    if (fetchedPrice.type !== 'recurring') {
      return new Response('Price must be recurring for subscriptions', { status: 400 });
    }

    // Ensure Stripe customer
    const customerId = await ensureCustomer(user);

    // Build origin from env (dev/prod)
    const origin =
      req.headers.get('origin') ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      'http://localhost:3000';

    const idempotencyKey = `chk_${user.id}_${priceId}_${quantity}_${listingId ?? 'nolisting'}_${finalPurpose}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity }],
      success_url: successUrl ?? `${origin}/dashboard/listings?ok=1`,
      cancel_url:  cancelUrl  ?? `${origin}/dashboard/listings`,
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          purpose: finalPurpose,
          ...(listingId ? { listing_id: listingId } : {}),
          ...safeMeta,
        },
      },
      metadata: {
        supabase_user_id: user.id,
        purpose: finalPurpose,
        ...(listingId ? { listing_id: listingId } : {}),
        ...safeMeta,
      },
      allow_promotion_codes: true,
    }, { idempotencyKey });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    return new Response('Checkout error', { status: 500 });
  }
}
