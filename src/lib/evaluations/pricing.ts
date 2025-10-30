// lib/evaluations/pricing.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type SB = SupabaseClient<Database>;

type SubRowLite = {
  status: Database["public"]["Enums"]["subscription_status"] | null;
  price_lookup_key: string | null;
  price_metadata: Database["public"]["Tables"]["subscriptions"]["Row"]["price_metadata"];
  product_metadata: Database["public"]["Tables"]["subscriptions"]["Row"]["product_metadata"];
};

const isActive = (s: SubRowLite) => s.status === "active";
const isTrial = (s: SubRowLite) => s.status === "trialing";

function isBusinessPlatformByPriceMeta(s: SubRowLite): boolean {
  const pm = (s.price_metadata as Record<string, any> | null) ?? null;
  const purpose = String(pm?.purpose ?? "").toLowerCase();
  const userType = String(pm?.user_type ?? "").toLowerCase();

  // Explicit metadata wins
  if (purpose === "listing_boost") return false;
  if (purpose === "base_membership" && userType === "business") return true;

  // Fallback: naming convention
  const lk = String(s.price_lookup_key ?? "").toLowerCase();
  if (lk.includes("listing_boost") || lk.includes("boost")) return false;
  if (lk.includes("platform") && lk.includes("business")) return true;

  return false;
}

export async function pickEvaluationPriceId(supabase: SB, userId: string): Promise<string> {
  const MEMBER =
    process.env.STRIPE_PRICE_EVAL_MEMBER || process.env.NEXT_PUBLIC_STRIPE_PRICE_EVAL_MEMBER;
  const PUBLIC =
    process.env.STRIPE_PRICE_EVAL_PUBLIC || process.env.NEXT_PUBLIC_STRIPE_PRICE_EVAL_PUBLIC;

  if (!PUBLIC) throw new Error("Missing STRIPE_PRICE_EVAL_PUBLIC (or NEXT_PUBLIC_) env var");

  const { data: subs, error } = await supabase
    .from("subscriptions")
    .select("status, price_lookup_key, price_metadata, product_metadata")
    .eq("user_id", userId);

  if (error) {
    console.error("pickEvaluationPriceId subscriptions query error:", error);
    return PUBLIC;
  }

  if (!subs || subs.length === 0) return PUBLIC;

  const eligibleSub = (subs as SubRowLite[]).find((s) => {
    return isActive(s) && !isTrial(s) && isBusinessPlatformByPriceMeta(s);
  });

  if (eligibleSub) {
    if (!MEMBER) {
      console.warn("Member sub found but STRIPE_PRICE_EVAL_MEMBER env var is missing; using PUBLIC");
      return PUBLIC;
    }
    return MEMBER;
  }
  
  return PUBLIC;
}