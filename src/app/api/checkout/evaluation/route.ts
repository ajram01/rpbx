// app/api/checkout/evaluation/route.ts
export const runtime = "nodejs";

import { stripe } from "@/lib/stripe";
import { ensureCustomer } from "@/lib/ensure-customer";
import { pickEvaluationPriceId } from "@/lib/evaluations/pricing"; // <- use the member vs public logic

export async function POST(req: Request) {
  try {
    const { createClientRSC } = await import("@/../utils/supabase/server");
    const supabase = await createClientRSC();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const ct = req.headers.get("content-type") ?? "";
    const body = ct.includes("application/json")
      ? await req.json()
      : Object.fromEntries((await req.formData()).entries());

    // We IGNORE client-provided priceId; compute securely server-side
    const listingId = String(body.listingId ?? "");
    if (!listingId) return new Response("Missing listingId", { status: 400 });

    // Verify listing ownership
    const { data: listing, error: listErr } = await supabase
      .from("business_listings")
      .select("id, owner_id, status, is_active")
      .eq("id", listingId)
      .maybeSingle();

    if (listErr) return new Response("DB error", { status: 500 });
    if (!listing || listing.owner_id !== user.id) return new Response("Forbidden", { status: 403 });
    if (!listing.is_active || listing.status !== "published") {
      return new Response("Listing is not eligible for evaluation", { status: 400 });
    }

    // Choose the correct evaluation price (member vs public; trial excluded)
    const priceId = await pickEvaluationPriceId(supabase as any, user.id);

    // Ensure Stripe customer
    const customerId = await ensureCustomer(user);

    const origin =
      req.headers.get("origin") ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "http://localhost:3000";

    // Success URL -> redirect helper that sends to BizEquity immediately
    // You can build the BizEquity link inside that redirect route.
    const successUrl = `${origin}/api/evaluations/redirect?listing_id=${encodeURIComponent(listingId)}`;
    const cancelUrl  = `${origin}/dashboard/listings?eval=canceled`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: user.id,

      // Keep metadata on both session and PI for robust linkage
      metadata: {
        purpose: "evaluation",
        listing_id: listingId,
        supabase_user_id: user.id,
      },
      payment_intent_data: {
        metadata: {
          purpose: "evaluation",
          listing_id: listingId,
          supabase_user_id: user.id,
        },
      },

      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Evaluation checkout error:", err);
    return new Response("Checkout error", { status: 500 });
  }
}
