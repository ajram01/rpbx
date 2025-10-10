// lib/dashboard/getInvestorDashboardData.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { matchListingsToInvestor } from "@/lib/matching/matchListings";
import { getRecentActivity } from "@/lib/analytics/getRecentActivity";
import { getUpcomingEvents } from "@/lib/sanity/getUpcomingEvents";

import { Activity } from "@/lib/analytics/getRecentActivity"
import { EventItem } from "@/lib/sanity/getUpcomingEvents"

type Listing = Database["public"]["Tables"]["business_listings"]["Row"];
// type InvestorProfile = Database["public"]["Tables"]["investor_profiles"]["Row"];

export type BusinessMatch = { id: string; title: string|null; industry?: string|null; _source?: "matched"|"newest" };

export type InvestorDashboardData = {
  kind: "investor";
  matches: BusinessMatch[];     // what MatchedBusinesses expects
  activities: Activity[];
  events: EventItem[];
};

export async function getInvestorDashboardData(
  supabase: SupabaseClient<Database>,
  userId: string
) {
  // find investor profile for this user (if the user is an investor)
  const { data: invProfile, error: invErr } = await supabase
    .from("investor_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle(); // allows null if no row

  if (invErr) throw invErr;

  // candidate listings (active only)
  const { data: listingsRaw, error: listErr } = await supabase
    .from("business_listings")
    .select("id, title, industry, ebitda_range, annual_revenue_range, created_at, status, is_active")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(100);

  if (listErr) throw listErr;
  const allListings = (listingsRaw ?? []) as Listing[];

  const matches = matchListingsToInvestor(allListings, invProfile ?? undefined);
  const [activities, events] = await Promise.all([
    getRecentActivity(supabase, userId),
    getUpcomingEvents(),
  ]);

  return {
    kind: "investor", matches, activities, events
  };
}
