// app/api/billing/rows/route.ts
import { NextResponse } from "next/server";
import { createClientRSC } from "@/../utils/supabase/server";

export async function GET() {
  const supabase = await createClientRSC();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ rows: [] });

  const rows: any[] = [];

  // Platform member subs (mirror table)
  const { data: subs } = await supabase
    .from("subscriptions")
    .select("product_name, status, current_period_end, user_id")
    .eq("user_id", user.id);

  (subs ?? []).forEach(s => rows.push({
    type: "platform",
    label: s.product_name ?? "Membership",
    status: s.status,
    renews: s.current_period_end ?? null,
  }));

  // Boosted listing subs
  const { data: boosts } = await supabase
    .from("listing_promotions")
    .select("listing_id, status, current_period_end");

  const ids = (boosts ?? []).map(b => b.listing_id);
  const { data: listings } = await supabase
    .from("business_listings")
    .select("id, title, owner_id")
    .in("id", ids)
    .eq("owner_id", user.id);

  const byId = new Map((listings ?? []).map(l => [l.id, l.title ?? l.id]));
  (boosts ?? [])
    .filter(b => byId.has(b.listing_id))
    .forEach(b => rows.push({
      type: "boost",
      label: byId.get(b.listing_id),
      status: b.status,
      renews: b.current_period_end ?? null,
      listingId: b.listing_id,
    }));

  return NextResponse.json({ rows });
}
