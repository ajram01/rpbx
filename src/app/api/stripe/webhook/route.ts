// app/api/stripe/webhook/route.ts
export const runtime = "nodejs";

import Stripe from "stripe";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

/**
 * Resolve user type (role) for base memberships.
 * Priority:
 *  1) Stripe Price metadata.user_type ("business" | "investor")
 *  2) Subscription metadata.user_type_intended (set by your checkout)
 *  3) Price.lookup_key prefix ("business_" | "investor_")
 */
function resolveBaseRole(
  price: Stripe.Price | undefined,
  subMeta: Record<string, unknown> | null | undefined
): "business" | "investor" | null {
  if (!price) return null;

  const byMeta = String(price.metadata?.user_type ?? "").toLowerCase();
  if (byMeta === "business" || byMeta === "investor") return byMeta as any;

  const hinted = String(subMeta?.["user_type_intended"] ?? "").toLowerCase();
  if (hinted === "business" || hinted === "investor") return hinted as any;

  const lk = String(price.lookup_key ?? "").toLowerCase();
  if (lk.startsWith("business_")) return "business";
  if (lk.startsWith("investor_")) return "investor";

  return null;
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    // IMPORTANT per Stripe docs: use raw body for signature verification
    const raw = await req.text();
    event = stripe.webhooks.constructEvent(raw, sig, endpointSecret);
  } catch (e) {
    console.error("Signature verification failed:", e);
    return new Response("Bad signature", { status: 400 });
  }

  try {
    console.log("➡️ Stripe event:", event.type);
    const admin = getSupabaseAdmin();

    // ---------- 1) Map Supabase user <-> Stripe customer on checkout completion ----------
    if (event.type === "checkout.session.completed") {
      const sess = event.data.object as Stripe.Checkout.Session;

      const userId = (sess.metadata?.["supabase_user_id"] ?? null) as string | null;
      const customerId = (sess.customer ??
        (sess.customer_details as any)?.id ??
        null) as string | null;

      if (userId && customerId) {
        const { error } = await admin
          .from("customers")
          .upsert({ id: userId, stripe_customer_id: customerId });
        if (error) console.error("customers upsert error:", error);
      }
      return new Response("ok", { status: 200 });
    }

    // ---------- 2) Base membership lifecycle only (business OR investor). No promos. ----------
    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const sub = event.data.object as Stripe.Subscription;

      // Retrieve full sub with price + customer for reliable role + user mapping
      const full = (await stripe.subscriptions.retrieve(sub.id, {
        expand: ["items.data.price", "customer"],
      })) as Stripe.Subscription;

      const item = full.items?.data?.[0];
      const price = item?.price as Stripe.Price | undefined;

      // Resolve Supabase user id
      let userId: string | null = (full.metadata?.["supabase_user_id"] ?? null) as
        | string
        | null;

      if (!userId) {
        const stripeCustomerId =
          typeof full.customer === "string" ? full.customer : full.customer?.id;
        if (stripeCustomerId) {
          const { data: mapRow, error: mapErr } = await admin
            .from("customers")
            .select("id")
            .eq("stripe_customer_id", stripeCustomerId)
            .maybeSingle();
          if (mapErr) {
            console.error("DB map error:", mapErr);
            return new Response("DB map error", { status: 500 });
          }
          userId = mapRow?.id ?? null;
        }
      }

      if (!userId) {
        // No user → acknowledge and exit cleanly
        return new Response("ok", { status: 200 });
      }

      // Determine role from price/metadata (base memberships only)
      const role = resolveBaseRole(price, full.metadata);
      if (!role) {
        // Not a base membership we recognize → do nothing for MVP
        return new Response("ok", { status: 200 });
      }

      // Set profile role based on status
      // active/trialing → business|investor, otherwise demote to "member"
      const status = full.status;
      const nextType =
        status === "active" || status === "trialing" ? role : "member";

      const { error: updErr } = await admin
        .from("profiles")
        .update({ user_type: nextType })
        .eq("id", userId);

      if (updErr) {
        console.error("profiles update error:", updErr);
        return new Response("DB update error", { status: 500 });
      }

      console.log(`✅ profiles.user_type=${nextType} for user ${userId}`);
      return new Response("ok", { status: 200 });
    }

    // Other events ignored for MVP
    return new Response("ok", { status: 200 });
  } catch (e) {
    console.error("Unhandled webhook error:", e);
    return new Response("Internal error", { status: 500 });
  }
}
