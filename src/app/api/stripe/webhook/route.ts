// app/api/stripe/webhook/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Stripe from "stripe";
import { NextRequest } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert } from "@/types/database.types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // use your pinned apiVersion if desired
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

function getAdmin(): SupabaseClient<Database> {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

const toISO = (unix: number | null | undefined) =>
  typeof unix === "number" ? new Date(unix * 1000).toISOString() : null;

// Normalize Stripe event types so we handle both new underscore and classic dot styles.
function norm(evtType: string) {
  // e.g. "invoice_payment.paid" -> "invoice.payment_succeeded"
  if (evtType === "invoice_payment.paid") return "invoice.payment_succeeded";
  if (evtType === "invoice_payment.failed") return "invoice.payment_failed";

  return evtType;
}

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

// If we can't find a customers mapping row, try to create it from the Stripe customer email.
async function ensureCustomerMapping(
  admin: SupabaseClient<Database>,
  stripeCustomerId: string
): Promise<string | null> {
  // Already mapped?
  const { data: mapRow } = await admin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", stripeCustomerId)
    .maybeSingle();
  if (mapRow?.id) return mapRow.id;

  // Fetch Stripe customer → try to match Supabase user by email
  const cust = await stripe.customers.retrieve(stripeCustomerId);
  const email = (cust as Stripe.Customer).email?.toLowerCase();
  if (!email) return null;

  // Look for a user with that email in auth.users (service role can call RPCs or read from your mirror)
  // You have public.profiles with id = user id; but not email. We’ll use auth schema via RPCs if you expose one.
  // Simpler: check your public.customers table for any row with same email (not present).
  // Fallback: try Supabase Admin API is not available here, so we skip direct auth.users query.
  // Alternative: if you carried supabase_user_id in customer.metadata, use that:
  const supaId = (cust as Stripe.Customer).metadata?.supabase_user_id;
  if (supaId) {
    // persist mapping
    await admin.from("customers").upsert({ id: supaId, stripe_customer_id: stripeCustomerId });
    return supaId;
  }

  // No way to infer user_id → give up gracefully
  return null;
}

async function upsertSubscription(
  admin: SupabaseClient<Database>,
  sub: Stripe.Subscription
) {
  const stripeCustomerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
  if (!stripeCustomerId) return;

  // Map customer → user_id (and auto-create mapping if possible)
  let userId: string | null = null;
  const { data: mapRow } = await admin
    .from("customers")
    .select("id")
    .eq("stripe_customer_id", stripeCustomerId)
    .maybeSingle();

  userId = mapRow?.id ?? null;
  if (!userId) {
    userId = await ensureCustomerMapping(admin, stripeCustomerId);
  }
  if (!userId) {
    console.warn("No user mapping for stripe_customer_id:", stripeCustomerId);
    return;
  }

  // First item is your single base price
  const item = sub.items?.data?.[0];
  const price = item?.price as Stripe.Price | undefined;
  const quantity = item?.quantity ?? null;

  // Period dates: Stripe (new models) place these on the Subscription Item
  const currentPeriodStart = toISO((item as any)?.current_period_start) ?? new Date().toISOString();
  const currentPeriodEnd = toISO((item as any)?.current_period_end) ?? new Date().toISOString();

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
    current_period_start: currentPeriodStart,
    current_period_end: currentPeriodEnd,
    ended_at: toISO(sub.ended_at ?? null),
    trial_start: toISO(sub.trial_start ?? null),
    trial_end: toISO(sub.trial_end ?? null),
  };

  const { error } = await admin.from("subscriptions").upsert(row);
  if (error) console.error("subscriptions upsert error:", error);
  else console.log(`✅ upserted subscription ${sub.id} for user ${userId}`);
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    const raw = await req.text();
    event = stripe.webhooks.constructEvent(raw, sig, endpointSecret);
  } catch (e) {
    console.error("Signature verification failed:", e);
    return new Response("Bad signature", { status: 400 });
  }

  const type = norm(event.type);
  console.log("➡️ Stripe event (norm):", type);

  try {
    const admin = getAdmin();

    // A) After checkout: map customer -> user and write first sub row
    if (type === "checkout.session.completed") {
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

    // B) Keep subscription in sync
    if (
      type === "customer.subscription.created" ||
      type === "customer.subscription.updated" ||
      type === "customer.subscription.deleted"
    ) {
      const subObj = event.data.object as Stripe.Subscription;

      const sub = await stripe.subscriptions.retrieve(subObj.id, {
        expand: ["items.data.price.product", "customer"],
      });
      await upsertSubscription(admin, sub);

      // Optional: keep profiles.user_type aligned
      const price = sub.items?.data?.[0]?.price as Stripe.Price | undefined;
      const role = resolveBaseRole(price, sub.metadata);
      if (role) {
        const nextType =
          sub.status === "active" || sub.status === "trialing" ? role : "member";
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

    // C) Invoice events: refresh period/status after billing
    if (
      type === "invoice.payment_succeeded" ||
      type === "invoice.payment_failed" ||
      type === "invoice.paid" // legacy dot style
    ) {
      const inv = event.data.object as Stripe.Invoice;

      // 2025+ structure (parent.subscription_details.subscription)
      let subId: string | null = null;
      const parent = (inv as any).parent;
      if (parent?.subscription_details?.subscription) {
        subId =
          typeof parent.subscription_details.subscription === "string"
            ? parent.subscription_details.subscription
            : parent.subscription_details.subscription.id;
      }

      // Older API: invoice.subscription
      if (!subId) {
        const maybe = (inv as any).subscription;
        if (maybe) subId = typeof maybe === "string" ? maybe : maybe.id;
      }

      if (subId) {
        const sub = await stripe.subscriptions.retrieve(subId, {
          expand: ["items.data.price.product", "customer"],
        });
        await upsertSubscription(admin, sub);
      } else {
        console.warn("Invoice had no resolvable subscription id");
      }

      return new Response("ok", { status: 200 });
    }

    return new Response("ok", { status: 200 });
  } catch (e) {
    console.error("Unhandled webhook error:", e);
    return new Response("Internal error", { status: 500 });
  }
}
