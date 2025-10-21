// app/api/stripe/webhook/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Stripe from "stripe";
import { NextRequest } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert } from "@/types/database.types";

// If you've upgraded your Stripe account/webhooks, pin to the new version:
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

function getSupabaseAdmin(): SupabaseClient<Database> {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

const toISO = (unix: number | null | undefined) =>
  typeof unix === "number" ? new Date(unix * 1000).toISOString() : null;

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

async function upsertSubscription(
  admin: SupabaseClient<Database>,
  sub: Stripe.Subscription
) {
  // First item is your single base price in this app
  const item = sub.items?.data?.[0];
  const price = item?.price as Stripe.Price | undefined;
  const quantity = item?.quantity ?? null;

  const stripeCustomerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
  if (!stripeCustomerId) return;

  // Map Stripe customer -> Supabase user_id
  const { data: mapRow, error: mapErr } = await admin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", stripeCustomerId)
    .maybeSingle();
  if (mapErr) {
    console.error("customer map error:", mapErr);
  }
  const userId = mapRow?.id;
  if (!userId) return;

  // ✅ Pull period from subscription item (Stripe 2025 change)
  const currentPeriodStart = toISO((item as any)?.current_period_start);
  const currentPeriodEnd = toISO((item as any)?.current_period_end);

  const row: TablesInsert<"subscriptions"> = {
    id: sub.id,
    user_id: userId,
    status: sub.status as Database["public"]["Enums"]["subscription_status"],
    price_id: price?.id ?? null,
    quantity,
    metadata: (sub.metadata ?? {}) as any,
    cancel_at: toISO(sub.cancel_at ?? null),
    cancel_at_period_end: sub.cancel_at_period_end ?? null,
    canceled_at: toISO(sub.canceled_at ?? null),
    created: toISO(sub.created) ?? new Date().toISOString(),
    current_period_start: currentPeriodStart ?? new Date().toISOString(),
    current_period_end: currentPeriodEnd ?? new Date().toISOString(),
    ended_at: toISO(sub.ended_at ?? null),
    trial_start: toISO(sub.trial_start ?? null),
    trial_end: toISO(sub.trial_end ?? null),
  };

  const { error } = await admin.from("subscriptions").upsert(row);
  if (error) console.error("subscriptions upsert error:", error);
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    const raw = await req.text(); // raw body for signature verification
    event = stripe.webhooks.constructEvent(raw, sig, endpointSecret);
  } catch (e) {
    console.error("Signature verification failed:", e);
    return new Response("Bad signature", { status: 400 });
  }

  try {
    console.log("➡️ Stripe event:", event.type);
    const admin = getSupabaseAdmin();

    // 1) After Checkout completes, map customer->user and upsert the sub
    if (event.type === "checkout.session.completed") {
      const sess = event.data.object as Stripe.Checkout.Session;

      const userId = (sess.metadata?.["supabase_user_id"] ?? null) as string | null;
      const customerId =
        typeof sess.customer === "string"
          ? (sess.customer as string)
          : (sess.customer as Stripe.Customer | null)?.id ?? null;

      if (userId && customerId) {
        const { error } = await admin
          .from("customers")
          .upsert({ id: userId, stripe_customer_id: customerId });
        if (error) console.error("customers upsert error:", error);
      }

      if (sess.mode === "subscription" && sess.subscription) {
        const subId =
          typeof sess.subscription === "string"
            ? (sess.subscription as string)
            : (sess.subscription as Stripe.Subscription).id;

        const sub = await stripe.subscriptions.retrieve(subId, {
          expand: ["items.data.price.product", "customer"],
        });
        await upsertSubscription(admin, sub);
      }

      return new Response("ok", { status: 200 });
    }

    // 2) Keep the subscription row current
    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subObj = event.data.object as Stripe.Subscription;

      const sub = await stripe.subscriptions.retrieve(subObj.id, {
        expand: ["items.data.price.product", "customer"],
      });

      await upsertSubscription(admin, sub);

      // optional: keep profiles.user_type in sync
      const price = sub.items?.data?.[0]?.price as Stripe.Price | undefined;
      const role = resolveBaseRole(price, sub.metadata);
      if (role) {
        const status = sub.status;
        const nextType = status === "active" || status === "trialing" ? role : "member";
        const stripeCustomerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer?.id;

        if (stripeCustomerId) {
          const { data: mapRow } = await admin
            .from("customers")
            .select("id")
            .eq("stripe_customer_id", stripeCustomerId)
            .maybeSingle();

          const userId = mapRow?.id;
          if (userId) {
            const { error: updErr } = await admin
              .from("profiles")
              .update({ user_type: nextType })
              .eq("id", userId);
            if (updErr) console.error("profiles update error:", updErr);
            else console.log(`✅ profiles.user_type=${nextType} for user ${userId}`);
          }
        }
      }

      return new Response("ok", { status: 200 });
    }

    // 3) Invoice events: refresh subscription periods
    if (event.type === "invoice.paid" || event.type === "invoice.payment_failed") {
      const inv = event.data.object as Stripe.Invoice;

      // PRIMARY (2025+): invoice.parent.subscription_details.subscription
      let subId: string | null = null;
      const parent = (inv as any).parent;
      if (parent?.type === "subscription_details" && parent.subscription_details?.subscription) {
        subId =
          typeof parent.subscription_details.subscription === "string"
            ? parent.subscription_details.subscription
            : parent.subscription_details.subscription.id;
      }

      // FALLBACK (older API versions): invoice.subscription
      if (!subId) {
        const maybe = (inv as any).subscription;
        if (maybe) subId = typeof maybe === "string" ? maybe : maybe.id;
      }

      if (subId) {
        const sub = await stripe.subscriptions.retrieve(subId, {
          expand: ["items.data.price.product", "customer"],
        });
        await upsertSubscription(admin, sub);
      }

      return new Response("ok", { status: 200 });
    }

    return new Response("ok", { status: 200 });
  } catch (e) {
    console.error("Unhandled webhook error:", e);
    return new Response("Internal error", { status: 500 });
  }
}
