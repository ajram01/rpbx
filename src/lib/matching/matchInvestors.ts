// lib/matching/matchInvestors.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type Listing = Database["public"]["Tables"]["business_listings"]["Row"];
type InvestorProfile = Database["public"]["Tables"]["investor_profiles"]["Row"];

/**
 * Light-weight string matchers for your string-range fields.
 * Later, consider normalizing ranges (e.g., "0–250k") into numeric tuples.
 */
function strIncludes(a?: string | null, b?: string | null) {
  if (!a || !b) return false;
  return a.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(a.toLowerCase());
}

function industryMatch(listingIndustry: string, inv: InvestorProfile): boolean {
  if (!listingIndustry) return false;
  const li = listingIndustry.toLowerCase();
  if (inv.primary_industry && inv.primary_industry.toLowerCase() === li) return true;
  if (inv.additional_industries?.length) {
    return inv.additional_industries.some((i) => i?.toLowerCase() === li);
  }
  return false;
}

function rangeLikeMatch(listingRange?: string | null, investorTarget?: string | null): boolean {
  if (!listingRange || !investorTarget) return false;
  // naive overlap: any substring overlap (e.g., "500k–1M" vs "1M")
  return strIncludes(listingRange, investorTarget);
}

/**
 * Score investor vs a set of listings:
 * +5 industry overlap
 * +3 EBITDA target "overlaps" listing ebitda_range
 * +2 Cash flow target "overlaps" listing annual_revenue_range (proxy until you have cashflow on listing)
 */
function calculateMatchScore(inv: InvestorProfile, listings: Listing[]): number {
  let score = 0;

  // Industry hit if at least one listing matches investor industries
  const hasIndustryHit = listings.some((l) => industryMatch(l.industry, inv));
  if (hasIndustryHit) score += 5;

  // EBITDA target vs listing ebitda_range (string overlap heuristic)
  const hasEbitdaHit = listings.some((l) => rangeLikeMatch(l.ebitda_range, inv.target_ebitda));
  if (hasEbitdaHit) score += 3;

  // Cashflow target vs listing annual_revenue_range (proxy)
  const hasCashflowHit = listings.some((l) => rangeLikeMatch(l.annual_revenue_range, inv.target_cash_flow));
  if (hasCashflowHit) score += 2;

  return score;
}

export async function matchInvestorsToListings(
  supabase: SupabaseClient<Database>,
  listings: Listing[]
): Promise<(InvestorProfile & { score?: number })[]> {
  // Only active investors (use whatever filter makes sense in your product)
  const { data: investorsRaw, error } = await supabase
    .from("investor_profiles")
    .select(
      "id, created_at, primary_industry, additional_industries, target_ebitda, target_cash_flow, status"
    )
    .eq("status", "active"); // adjust if you use a different status model

  if (error) throw error;

  const investors = (investorsRaw ?? []) as InvestorProfile[];

  // Score per investor against the user’s listings
  const scored = investors.map((inv) => ({
    ...inv,
    score: calculateMatchScore(inv, listings),
  }));

  const top = scored
    .filter((s) => (s.score ?? 0) > 0)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 4);

  if (top.length) return top;

  // Fallback: newest 4 active investors
  return [...investors]
    .sort(
      (a, b) =>
        new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
    )
    .slice(0, 4);
}
