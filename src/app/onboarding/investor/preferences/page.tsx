import Link from "next/link";
import { createClientRSC } from "@/../utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Preferences() {
  const supabase = await createClientRSC();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/onboarding/investor/contact");

  // Prefill from existing profile (any status)
  const { data: draft } = await supabase
    .from("investor_profiles")
    .select(
      "user_id, ownership_min, ownership_max, primary_industry, additional_industries, target_ebidta, target_cash_flow, status"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  async function save(formData: FormData) {
    "use server";
    const { createClientRSC } = await import("@/../utils/supabase/server");
    const sb = await createClientRSC();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) redirect("/login?next=/onboarding/investor/contact");

    const first_name = String(formData.get("first_name") ?? "").trim();
    const last_name = String(formData.get("last_name") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    const organization_entity = String(formData.get("org") ?? "").trim();
    const bio = String(formData.get("bio") ?? "").trim();
    const file = formData.get("avatar") as File | null;

    // Upsert profile by user_id
    const payload = {
      user_id: user.id,
      first_name,
      last_name,
      email: user.email, // trust auth
      city,
      organization_entity: organization_entity || null,
      bio,
      status: (draft?.status ?? "incomplete") as
        | "incomplete"
        | "pending_review"
        | "published"
        | "archived"
        | "suspended",
    };

    const { error: upsertErr } = await sb
      .from("investor_profiles")
      .upsert(payload, { onConflict: "user_id" });
    if (upsertErr) {
      console.error("Profile upsert failed:", upsertErr);
      return;
    }

    }


}