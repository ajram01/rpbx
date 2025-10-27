// lib/listings/badges.ts
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database.types";

type SB = SupabaseClient<Database>;

export async function getListingBadges(supabase: SB, listingIds: string[]) {
  // Boost badge
  const { data: promos } = await supabase
    .from("listing_promotions")
    .select("listing_id, status, current_period_end, cancel_at_period_end")
    .in("listing_id", listingIds);

  const now = Date.now();
  const boosted = new Set(
    (promos ?? [])
      .filter(p =>
        p.status === "active" &&
        p.current_period_end &&
        new Date(p.current_period_end).getTime() > now
      )
      .map(p => p.listing_id)
  );

  // Evaluation badge
  const { data: evals } = await supabase
    .from("listing_evaluations")
    .select("listing_id, status")
    .in("listing_id", listingIds);

  const evalStatus = new Map((evals ?? []).map(e => [e.listing_id, e.status]));

  return { boosted, evalStatus };
}
