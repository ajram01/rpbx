import Link from "next/link";
import { createClientRSC } from "@/../utils/supabase/server";
import { redirect } from "next/navigation";
import OwnershipRange from "./OwnershipRange";

export default async function Preferences() {
  const supabase = await createClientRSC();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/onboarding/investor/preferences");

  const { data: draft, error } = await supabase
    .from("investor_profiles")
    .select(`
      user_id,
      ownership_min,
      ownership_max,
      primary_industry,
      additional_industries,
      target_ebitda,
      target_cash_flow,
      status
    `)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) console.error("Fetch investor profile failed:", error);

  async function save(formData: FormData) {
    "use server";
    const { createClientRSC } = await import("@/../utils/supabase/server");
    const sb = await createClientRSC();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) redirect("/login?next=/onboarding/investor/preferences");

    // Ownership (clamped + ordered)
    const oMin = Math.max(0, Math.min(100, Number(formData.get("ownership_min") ?? 0)));
    const oMax = Math.max(0, Math.min(100, Number(formData.get("ownership_max") ?? 100)));
    const ownership_min = Math.min(oMin, oMax);
    const ownership_max = Math.max(oMin, oMax);

    // Industries
    const primary_industry = String(formData.get("primary_industry") ?? "").trim() || null;
    const additional_industries = formData.getAll("additional_industries")
      .map((x) => String(x).trim())
      .filter(Boolean);

    // Buckets
    const target_ebitda = String(formData.get("ebitda_bucket") ?? "").trim() || null;
    const target_cash_flow = String(formData.get("cashflow_bucket") ?? "").trim() || null;

    const payload = {
      user_id: user.id,
      ownership_min,
      ownership_max,
      primary_industry,
      additional_industries: additional_industries.length ? additional_industries : null,
      target_ebitda,
      target_cash_flow,
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
      console.error("Upsert preferences failed:", upsertErr);
      return;
    }

    redirect("/onboarding/investor/compliance");
  }

  const INDUSTRY_OPTIONS = [
    "Healthcare","Technology","Finance","Real Estate","Education","Manufacturing","Retail","Hospitality",
    "Transportation","Agriculture","Energy","Entertainment","Construction","Telecommunications","Insurance",
    "Legal","Automotive","Food and Beverage","Media and Advertising","Pharmaceutical","Tourism","Fashion",
    "Logistics","Non-profit","Environmental Services","Biotechnology","Aerospace","E-commerce","Consulting",
    "Sports and Recreation","Other"
  ];

  const INDUSTRY_EXPERIENCE_OPTIONS = [
    { label: "0–2 years",  value: "0-2" },
    { label: "3–5 years",  value: "3-5" },
    { label: "6–10 years", value: "6-10" },
    { label: "11–15 years", value: "11-15" },
    { label: "16–20 years", value: "16-20" },
    { label: "20+ years",   value: "20+" },
  ] as const;

  const NET_WORTH_OPTIONS = [
    { label: "< $250k",        value: "<250k" },
    { label: "$250k – $500k",  value: "250k-500k" },
    { label: "$500k – $1M",    value: "500k-1M" },
    { label: "$1M – $5M",      value: "1M-5M" },  
    { label: "$5M – $30M",     value: "5M-30M" },  
    { label: "$30M+",          value: ">30M" },
  ] as const;


  return (
    <form action={save} className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Investment preferences</h1>

      {/* Ownership % range */}
      <div>
        <label className="block mb-2">
          <span>Target ownership %</span>
        </label>
        <OwnershipRange
          defaultMin={draft?.ownership_min ?? 20}
          defaultMax={draft?.ownership_max ?? 40}
          nameMin="ownership_min"
          nameMax="ownership_max"
        />
      </div>
      {/* Primary industry */}
      <label className="block">
        <span>Years of Experience</span>
        <select
          name="primary_industry"
          required
          defaultValue={draft?.primary_industry ?? ""}
          className="mt-1 w-full border rounded px-3 py-2"
        >
          <option value="" disabled>Choose an industry…</option>
          {INDUSTRY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </label>

      {/* Primary industry */}
      <label className="block">
        <span>Primary industry</span>
        <select
          name="primary_industry"
          required
          defaultValue={draft?.primary_industry ?? ""}
          className="mt-1 w-full border rounded px-3 py-2"
        >
          <option value="" disabled>Choose an industry…</option>
          {INDUSTRY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </label>

      {/* Additional industries */}
      <fieldset className="block">
        <legend className="mb-2 block">Additional industries (optional)</legend>

        <div className="mt-1 grid grid-cols-2 md:grid-cols-3 gap-2 border rounded p-3">
          {INDUSTRY_OPTIONS.map((opt) => {
            const checked =
              Array.isArray(draft?.additional_industries) &&
              draft!.additional_industries.includes(opt);

            return (
              <label
                key={opt}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  name="additional_industries"
                  value={opt}
                  defaultChecked={checked}
                  className="h-4 w-4"
                />
                <span>{opt}</span>
              </label>
            );
          })}
        </div>

        {/* (Optional) small hint */}
        <p className="text-xs text-gray-500 mt-1">
          Pick any that apply. You can change these later.
        </p>
      </fieldset>

      {/* EBITDA bucket */}
      <label className="block">
        <span>Company EBITDA target</span>
        <select
          name="ebitda_bucket"
          defaultValue={draft?.target_ebitda ?? ""}
          className="mt-1 w-full border rounded px-3 py-2"
        >
          <option value="">No preference</option>
          <option value="<250k">Under $250k</option>
          <option value="250k-500k">$250k – $500k</option>
          <option value="500k-1M">$500k – $1M</option>
          <option value="1M-2M">$1M – $2M</option>
          <option value="2M-5M">$2M – $5M</option>
          <option value=">5M">Over $5M</option>
        </select>
      </label>

      {/* Cash Flow bucket */}
      <label className="block">
        <span>Cash flow (SDE) target (optional)</span>
        <select
          name="cashflow_bucket"
          defaultValue={draft?.target_cash_flow ?? ""}
          className="mt-1 w-full border rounded px-3 py-2"
        >
          <option value="">No preference</option>
          <option value="<50k">Under $50k</option>
          <option value="50k-100k">$50k – $100k</option>
          <option value="100k-250k">$100k – $250k</option>
          <option value="250k-500k">$250k – $500k</option>
          <option value=">500k">Over $500k</option>
        </select>
      </label>

      <div className="mt-4 flex gap-3">
        <button type="submit" className="rounded-xl border px-4 py-2">Save & Continue</button>
        <Link href="/dashboard" className="text-sm underline">Skip for now</Link>
      </div>
    </form>
  );
}
