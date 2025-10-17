// app/api/checkout/route.ts
export const runtime = "nodejs";

import { stripe } from "@/lib/stripe";
import { ensureCustomer } from "@/lib/ensure-customer";

/**
 * Supports base plans (business monthly/yearly/trial, investor monthly/yearly)
 * and (optionally) listing promo. Enforces:
 *  - Only whitelisted prices can be used.
 *  - Role intent is derived from the Price metadata (or passed intent) and saved in metadata.
 *  - Optional trial days applied for a specific "trial" price variant or via price metadata.
 *  - Duplicate base subscription prevention: sends to Billing Portal if one already exists.
 */
export async function POST(req: Request) {
  try {
    const { createClientRSC } = await import("@/../utils/supabase/server");
    const supabase = await createClientRSC();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) return new Response("Unauthorized", { status: 401 });

    const ct = req.headers.get("content-type") ?? "";

    // ---- Parse body (JSON + form) ----
    let priceId = "";
    let quantity = 1;
    let rawMeta: Record<string, unknown> | undefined;
    let successUrl: string | undefined;
    let cancelUrl: string | undefined;
    let listingId: string | undefined;
    let purpose: "listing_promo" | "listing_plan" | "base_membership" | undefined;
    let userTypeIntended: "business" | "investor" | undefined; // optional hint from UI

    if (ct.includes("application/json")) {
      const body = await req.json();
      priceId = String(body.priceId ?? "");
      quantity =
        Number.isFinite(body.quantity) && body.quantity > 0
          ? Math.floor(body.quantity)
          : 1;
      rawMeta = body.metadata;
      successUrl = body.successUrl;
      cancelUrl = body.cancelUrl;
      listingId = body.listingId;
      userTypeIntended = body.userTypeIntended;
      purpose = body.purpose;
    } else {
      const form = await req.formData();
      priceId = String(form.get("priceId") ?? "");
      const q = Number(form.get("quantity"));
      quantity = Number.isFinite(q) && q > 0 ? Math.floor(q) : 1;
      listingId = form.get("listingId")?.toString();
      const p = form.get("purpose")?.toString();
      if (p === "listing_promo" || p === "listing_plan" || p === "base_membership")
        purpose = p;
      const ut = form.get("userTypeIntended")?.toString();
      if (ut === "business" || ut === "investor") userTypeIntended = ut;
    }

    if (!priceId) return new Response("Missing priceId", { status: 400 });

    // If tied to a listing, verify ownership (kept for future listing promos)
    if (listingId) {
      const { data: listing, error: listErr } = await supabase
        .from("business_listings")
        .select("id, owner_id")
        .eq("id", listingId)
        .maybeSingle();
      if (listErr) return new Response("DB error", { status: 500 });
      if (!listing || listing.owner_id !== user.id)
        return new Response("Forbidden", { status: 403 });
    }

    // Coerce metadata to strings
    const safeMeta: Record<string, string> = Object.fromEntries(
      Object.entries(rawMeta ?? {}).map(([k, v]) => [k, v == null ? "" : String(v)])
    );

    // Decide purpose: default promo when listingId present, else base
    const finalPurpose = purpose ?? (listingId ? "listing_promo" : "base_membership");

    // ---- Whitelist prices per purpose (security)
    // Fill these envs with your Stripe price IDs.
    const BASE_BUSINESS = [
      process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_MONTHLY!,
      process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_YEARLY!,
      process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_TRIAL!, // trial that rolls to monthly
    ].filter(Boolean);

    const BASE_INVESTOR = [
      process.env.NEXT_PUBLIC_STRIPE_PRICE_INVESTOR_MONTHLY!,
      process.env.NEXT_PUBLIC_STRIPE_PRICE_INVESTOR_YEARLY!,
    ].filter(Boolean);

    const allowedPricesByPurpose: Record<string, string[]> = {
      listing_promo: [process.env.NEXT_PUBLIC_STRIPE_PRICE_PROMO!].filter(Boolean),
      listing_plan: [process.env.NEXT_PUBLIC_STRIPE_PRICE_LISTING_PLAN!].filter(Boolean),
      base_membership: [...BASE_BUSINESS, ...BASE_INVESTOR],
    };

    const allowed = allowedPricesByPurpose[finalPurpose] ?? [];
    if (!allowed.length || !allowed.includes(priceId)) {
      return new Response("Invalid price for purpose", { status: 400 });
    }

    // Fetch and validate price
    const fetchedPrice = await stripe.prices.retrieve(priceId, { expand: ["product"] });
    if (!fetchedPrice.active) {
      return new Response("Inactive price", { status: 400 });
    }
    if (fetchedPrice.type !== "recurring") {
      return new Response("Price must be recurring for subscriptions", { status: 400 });
    }

    // Determine intended role from Price metadata (authoritative), fallback to lookups/UI
    const priceRole = (fetchedPrice.metadata?.user_type ?? "").toLowerCase();
    let resolvedRole: "business" | "investor" | null = null;
    if (priceRole === "business" || priceRole === "investor") {
      resolvedRole = priceRole;
    } else if (userTypeIntended === "business" || userTypeIntended === "investor") {
      resolvedRole = userTypeIntended;
    }

    // For base membership, enforce that business prices map to business, etc.
    if (finalPurpose === "base_membership") {
      const isBusinessPrice = BASE_BUSINESS.includes(priceId);
      const isInvestorPrice = BASE_INVESTOR.includes(priceId);
      if (isBusinessPrice && resolvedRole !== "business") resolvedRole = "business";
      if (isInvestorPrice && resolvedRole !== "investor") resolvedRole = "investor";
    }

    // Optional trial handling (prefer configuring on the Price in Stripe)
    let trialDays: number | undefined;
    const mdTrial = fetchedPrice.metadata?.trial_days;
    if (mdTrial && /^\d+$/.test(String(mdTrial))) {
      trialDays = parseInt(String(mdTrial), 10);
    } else if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_TRIAL) {
      trialDays = 30; // your MVP trial length, if not set on the price
    }

    // Ensure Stripe customer (robust mapping; reuses if exists)
    const customerId = await ensureCustomer(user);

    // ⛔️ PREVENT DUPLICATE BASE SUBSCRIPTIONS
    if (finalPurpose === "base_membership") {
      const existing = await stripe.subscriptions.list({
        customer: customerId,
        status: "all",
        expand: ["data.items"],
        limit: 20,
      });

      const hasActiveBase = existing.data.some(
        (s) =>
          s.status === "active" ||
          s.status === "trialing" ||
          (s.status === "past_due" && !s.cancel_at_period_end)
      );

      if (hasActiveBase) {
        const origin =
          req.headers.get("origin") ??
          process.env.NEXT_PUBLIC_SITE_URL ??
          "http://localhost:3000";

        const portal = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: `${origin}/dashboard`,
        });

        return Response.json({ url: portal.url });
      }
    }

    // Build origin for redirects
    const origin =
      req.headers.get("origin") ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "http://localhost:3000";

    const idempotencyKey = `chk_${user.id}_${priceId}_${quantity}_${listingId ?? "nolisting"}_${finalPurpose}`;

    // Build subscription metadata so both session + subscription carry it
    const commonMeta: Record<string, string> = {
      supabase_user_id: user.id,
      purpose: finalPurpose,
      ...(listingId ? { listing_id: listingId } : {}),
      ...(resolvedRole ? { user_type_intended: resolvedRole } : {}),
      ...safeMeta,
    };

    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: priceId, quantity }],
        success_url: successUrl ?? `${origin}/welcome?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl ?? `${origin}/dashboard`,
        allow_promotion_codes: true,
        subscription_data: {
          metadata: commonMeta,
          ...(typeof trialDays === "number" && trialDays > 0
            ? { trial_period_days: trialDays }
            : {}),
        },
        metadata: commonMeta,
      },
      { idempotencyKey }
    );

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return new Response("Checkout error", { status: 500 });
  }
}
