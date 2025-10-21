// app/owner/listings/page.tsx
export const dynamic = "force-dynamic";

import { createClientRSC } from "@/../utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ConfirmOnSubmit } from "./_client/ListingActions";

type Promotion = {
  listing_id: string;
  status: string;
  cancel_at_period_end: boolean | null;
  current_period_end: string | null;
};

export default async function OwnerListings() {
  const supabase = await createClientRSC();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/listings");

  // Fetch listings
  const { data: listings } = await supabase
    .from("business_listings")
    .select("id, title, industry, updated_at, is_promoted")
    .eq("owner_id", user.id)
    .order("updated_at", { ascending: false });

  // Fetch active/trialing/past_due promos for these listings (optional: narrow to active only)
  const ids = (listings ?? []).map(l => l.id);
  let promos: Promotion[] = [];
  if (ids.length) {
    const { data } = await supabase
      .from("listing_promotions")
      .select("listing_id, status, cancel_at_period_end, current_period_end")
      .in("listing_id", ids);
    promos = data ?? [];
  }

  // ---- SERVER ACTIONS ----
// app/owner/listings/page.tsx  (only the server action changed)
async function startBoost(listingId: string) {
  "use server";

  const { createClientRSC } = await import("@/../utils/supabase/server");
  const supabase = await createClientRSC();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/listings");

  // Verify listing ownership
  const { data: listing, error: listErr } = await supabase
    .from("business_listings")
    .select("id, owner_id")
    .eq("id", listingId)
    .maybeSingle();

  if (listErr) redirect("/dashboard/listings?err=promo_db");
  if (!listing || listing.owner_id !== user.id) redirect("/dashboard/listings?err=forbidden");

  // Whitelist promo price
  const promoPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_PROMO;
  if (!promoPriceId) redirect("/dashboard/listings?err=missing_price");

  const { ensureCustomer } = await import("@/lib/ensure-customer");
  const customerId = await ensureCustomer(user);

  const { stripe } = await import("@/lib/stripe");

  // (Optional) ensure the price is recurring
  const price = await stripe.prices.retrieve(promoPriceId);
  if (price.type !== "recurring") redirect("/dashboard/listings?err=not_recurring");

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: promoPriceId, quantity: 1 }],
    success_url: `${origin}/dashboard/listings?promoted=${listingId}`,
    cancel_url:  `${origin}/dashboard/listings`,
    subscription_data: {
      metadata: {
        supabase_user_id: user.id,
        purpose: "listing_promo",
        listing_id: listingId,
      },
    },
    metadata: {
      supabase_user_id: user.id,
      purpose: "listing_promo",
      listing_id: listingId,
    },
    allow_promotion_codes: true,
  });

  // ✅ Type-narrowing guard so redirect gets a definite string
  if (!session.url) {
    console.error("Stripe returned no session.url", { sessionId: session.id });
    redirect("/dashboard/listings?err=no_session_url");
  }

  redirect(session.url); // session.url is now string, TS happy
}

  async function openPortal() {
    "use server";
    const { openBillingPortal } = await import("@/app/server/billing");
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const url = await openBillingPortal(`${origin}/dashboard/listings`);
    redirect(url);
  }

  async function deleteListing(listingId: string) {
    "use server";
    const { createClientRSC } = await import("@/../utils/supabase/server");
    const sb = await createClientRSC();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) redirect("/login?next=/dashboard/listings");

    // Hard delete (only if you really want to allow this without Stripe portal)
    const { error } = await sb
      .from("business_listings")
      .delete()
      .eq("id", listingId)
      .eq("owner_id", user.id);
    if (error) console.error(error);
    redirect("/dashboard/listings");
  }

  const promoByListing = new Map<string, Promotion[]>();
  for (const p of promos) {
    promoByListing.set(p.listing_id, [...(promoByListing.get(p.listing_id) ?? []), p]);
  }

  return (
    <main className="w-full lg:w-[1140px] mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Listings</h1>

      {!listings?.length ? (
        <p className="text-neutral-600">You don’t have any listings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map((l) => {
            const updated = l.updated_at ? new Date(l.updated_at).toLocaleString() : "—";
            const lp = promoByListing.get(l.id) ?? [];
            const hasActivePromo = lp.some(p => p.status === "active" || p.status === "trialing");
            const scheduledCancel = lp.find(p => p.cancel_at_period_end);

            return (
              <div key={l.id} className="rounded-xl border p-4 bg-white shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{l.title ?? "Untitled Listing"}</h3>
                    <p className="text-sm text-neutral-600">Industry: {l.industry ?? "—"}</p>
                    <p className="text-xs text-neutral-500 mt-1">Updated: {updated}</p>
                    {(hasActivePromo || l.is_promoted) && (
                      <span className="inline-block mt-2 rounded-full border px-2 py-0.5 text-xs">
                        PROMOTED
                      </span>
                    )}
                    {scheduledCancel?.current_period_end && (
                      <p className="text-xs text-amber-600 mt-1">
                        Boost cancels on {new Date(scheduledCancel.current_period_end).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/dashboard/listings/${l.id}/edit`}
                    className="inline-flex items-center px-3 py-2 rounded-xl text-white"
                    style={{ backgroundColor: "#9ed3c3" }}
                  >
                    Edit
                  </Link>

                  {!hasActivePromo ? (
                    <form action={startBoost.bind(null, l.id)}>
                      <button type="submit" className="inline-flex items-center px-3 py-2 rounded-xl border">
                        Promote
                      </button>
                    </form>
                  ) : (
                    <form action={openPortal}>
                      <button type="submit" className="inline-flex items-center px-3 py-2 rounded-xl border">
                        Manage Boost
                      </button>
                    </form>
                  )}

                  {/* Base-plan cancel/changes also go through portal */}
                  <form action={openPortal}>
                    <ConfirmOnSubmit message="Open Billing to manage your plan?">
                      <button type="submit" className="inline-flex items-center px-3 py-2 rounded-xl border">
                        Manage Plan
                      </button>
                    </ConfirmOnSubmit>
                  </form>

                  {/* Optional: direct delete (kept here; you may prefer hiding this if plan is active) */}
                  <form action={deleteListing.bind(null, l.id)}>
                    <ConfirmOnSubmit message="Delete this listing? This cannot be undone.">
                      <button type="submit" className="inline-flex items-center px-3 py-2 rounded-xl border border-red-300 text-red-600">
                        Delete
                      </button>
                    </ConfirmOnSubmit>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
