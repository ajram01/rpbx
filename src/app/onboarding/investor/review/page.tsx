import Link from "next/link";
import Image from "next/image";
import { createClientRSC } from "@/../utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Review() {
  const supabase = await createClientRSC();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/onboarding/investor/review");

  const { data: p } = await supabase
    .from("investor_profiles")
    .select(`
      user_id, first_name, last_name, city, organization_entity, bio,
      ownership_min, ownership_max, primary_industry, additional_industries,
      target_ebitda, target_cash_flow,
      willing_to_sign_nda, is_accredited_investor,
      avatar_path, status
    `)
    .eq("user_id", user.id)
    .maybeSingle();

  let avatarUrl: string | null = null;
  if (p?.avatar_path) {
    const { data } = await supabase.storage
      .from("investors")
      .createSignedUrl(p.avatar_path, 60 * 60);
    avatarUrl = data?.signedUrl ?? null;
  }

  // Minimal “required” set for publish
  const missing: string[] = [];
  if (!p?.first_name) missing.push("First name");
  if (!p?.last_name) missing.push("Last name");
  if (!p?.city) missing.push("City");
  if (!p?.primary_industry) missing.push("Primary industry");
  if (p?.ownership_min == null || p?.ownership_max == null) missing.push("Ownership % range");

  async function publish() {
    "use server";
    const { createClientRSC } = await import("@/../utils/supabase/server");
    const sb = await createClientRSC();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) redirect("/login?next=/onboarding/investor/review");

    // Re-check required fields server-side (defensive)
    const { data: curr } = await sb
      .from("investor_profiles")
      .select("first_name,last_name,city,primary_industry,ownership_min,ownership_max")
      .eq("user_id", user.id)
      .maybeSingle();

    const ok =
      !!curr?.first_name &&
      !!curr?.last_name &&
      !!curr?.city &&
      !!curr?.primary_industry &&
      curr?.ownership_min != null &&
      curr?.ownership_max != null;

    if (!ok) {
      // stay on page; you could throw and render error.tsx if you want
      return;
    }

    const { error } = await sb
      .from("investor_profiles")
      .update({ status: "published" })
      .eq("user_id", user.id);

    if (error) {
      console.error("Publish failed:", error);
      return;
    }

    redirect("/dashboard?welcome=investor");
  }

  return (
    <div className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Review your profile</h1>

      <div className="flex items-center gap-4">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="h-16 w-16 rounded-full border object-cover" />
        ) : (
          <div className="h-16 w-16 rounded-full border bg-gray-100" />
        )}
        <div>
          <div className="font-medium">
            {p?.first_name} {p?.last_name}
          </div>
          <div className="text-sm text-gray-600">{p?.city}</div>
          {p?.organization_entity && <div className="text-sm">{p.organization_entity}</div>}
        </div>
      </div>

      <div className="space-y-1">
        <div><span className="text-gray-600">Industry:</span> {p?.primary_industry}</div>
        {p?.additional_industries?.length ? (
          <div className="text-sm text-gray-700">
            Also interested in: {p.additional_industries.join(", ")}
          </div>
        ) : null}
        <div><span className="text-gray-600">Ownership %:</span> {p?.ownership_min}%–{p?.ownership_max}%</div>
        {p?.target_ebitda && <div><span className="text-gray-600">EBITDA target:</span> {p.target_ebitda}</div>}
        {p?.target_cash_flow && <div><span className="text-gray-600">Cash flow target:</span> {p.target_cash_flow}</div>}
        <div className="text-sm text-gray-700 whitespace-pre-wrap">{p?.bio}</div>
        <div className="text-sm text-gray-600">
          NDA: {p?.willing_to_sign_nda === true ? "Yes" : p?.willing_to_sign_nda === false ? "No" : "—"} ·
          {" "}
          Accredited: {p?.is_accredited_investor === true ? "Yes" : p?.is_accredited_investor === false ? "No" : "—"}
        </div>
      </div>

      {missing.length > 0 && (
        <div className="rounded border border-yellow-300 bg-yellow-50 p-3 text-sm">
          <div className="font-medium mb-1">Missing required info:</div>
          <ul className="list-disc pl-5">
            {missing.map((m) => <li key={m}>{m}</li>)}
          </ul>
          <p className="mt-2">
            Please complete the missing fields before publishing.
          </p>
        </div>
      )}

      <div className="mt-4 flex gap-3">
        <Link href="/onboarding/investor/compliance" className="rounded-xl border px-4 py-2">Back</Link>
        <form action={publish}>
          <button
            type="submit"
            disabled={missing.length > 0}
            className="rounded-xl border px-4 py-2 disabled:opacity-50"
          >
            Publish profile
          </button>
        </form>
        <Link href="/dashboard" className="text-sm underline">Finish later</Link>
      </div>
    </div>
  );
}
