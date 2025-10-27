// app/api/checkout/evaluation/route.ts
export const runtime = "nodejs";

import { stripe } from "@/lib/stripe";
import { ensureCustomer } from "@/lib/ensure-customer";

export async function POST(req: Request) {
  try {
    const { createClientRSC } = await import("@/../utils/supabase/server");
    const supabase = await createClientRSC();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    const ct = req.headers.get("content-type") ?? "";
    const body = ct.includes("application/json") ? await req.json() : Object.fromEntries((await req.formData()).entries());

    const priceId = String(body.priceId ?? "");
    const listingId = String(body.listingId ?? "");
    const successUrl = String(body.successUrl ?? "");
    const cancelUrl = String(body.cancelUrl ?? "");

    if (!priceId || !listingId) return new Response("Missing fields", { status: 400 });

    // Verify listing ownership
    const { data: listing, error: listErr } = await supabase
      .from("business_listings")
      .select("id, owner_id")
      .eq("id", listingId)
      .maybeSingle();

    if (listErr) return new Response("DB error", { status: 500 });
    if (!listing || listing.owner_id !== user.id) return new Response("Forbidden", { status: 403 });

    // Ensure Stripe customer
    const customerId = await ensureCustomer(user);

    // Create one-time Checkout Session
    const origin =
      req.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: user.id,
      // vital so webhook knows how to wire DB
      metadata: { purpose: "evaluation", listing_id: listingId, supabase_user_id: user.id },
      allow_promotion_codes: true,
      success_url: successUrl || `${origin}/dashboard/evaluation?success=1`,
      cancel_url: cancelUrl || `${origin}/dashboard/evaluation?canceled=1`,
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Evaluation checkout error:", err);
    return new Response("Checkout error", { status: 500 });
  }
}
