import Link from "next/link";
import { createClientRSC } from "@/../utils/supabase/server";
import { redirect } from "next/navigation";
import { splitName } from "@/lib/name";

export default async function Contact() {  
  const supabase = await createClientRSC();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/onboarding/investor/contact");

  const fullFromAuth = 
    (user.user_metadata?.full_name ?? user.user_metadata?.name ?? "").trim();
    const { first: authFirst, last: authLast } = splitName(fullFromAuth);
  // Prefill from existing profile (any status)
  const { data: draft } = await supabase
    .from("investor_profiles")
    .select(
      "user_id, first_name, last_name, city, organization_entity, bio, avatar_path, status"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  // Signed preview URL if we have an avatar
  let previewUrl: string | null = null;
  if (draft?.avatar_path) {
    const { data: signed } = await supabase.storage
      .from("investors")
      .createSignedUrl(draft.avatar_path, 60 * 60);
    previewUrl = signed?.signedUrl ?? null;
  }

  async function save(formData: FormData) {
    "use server";
    const { createClientRSC } = await import("@/../utils/supabase/server");
    const sb = await createClientRSC();
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) redirect("/login?next=/onboarding/investor/contact");

    const authFull = 
        (user.user_metadata?.full_name ?? user.user_metadata?.name ?? "").trim();
    const { first: authFirst, last: authLast } = splitName(authFull)

    const first_name = String(formData.get("first_name") ?? "").trim() || authFirst;
    const last_name = String(formData.get("last_name") ?? "").trim() || authLast;
    const city = String(formData.get("city") ?? "").trim();
    const organization_entity = String(formData.get("org") ?? "").trim();
    const bio = String(formData.get("bio") ?? "").trim();
    const file = formData.get("avatar") as File | null;

    // Upsert profile by user_id
    const payload = {
      user_id: user!.id,
      first_name,
      last_name,
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

    // Optional avatar upload
    if (file && file.size > 0) {
      const guess = (file.name.split(".").pop() || "jpg").toLowerCase();
      const ext = ["jpg", "jpeg", "png", "webp"].includes(guess) ? guess : "jpg";
      const key = `${user.id}/avatar.${ext}`;

      const { error: uploadErr } = await sb.storage
        .from("investors")
        .upload(key, file, {
          upsert: true,
          contentType: file.type || `image/${ext}`,
          cacheControl: "3600",
        });
      if (uploadErr) {
        console.error("Storage upload error:", uploadErr);
        return;
      }

      const { error: updImgErr } = await sb
        .from("investor_profiles")
        .update({ avatar_path: key, avatar_updated_at: new Date().toISOString() })
        .eq("user_id", user.id);
      if (updImgErr) {
        console.error("DB update (avatar_path) failed:", updImgErr);
        return;
      }
    }

    redirect("/onboarding/investor/preferences");
  }

  return (
    <form action={save} className="mx-auto max-w-xl p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Investor basics</h1>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span>First name</span>
          <input
            name="first_name"
            required
            defaultValue={draft?.first_name ?? authFirst ?? ""}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>
        <label className="block">
          <span>Last name</span>
          <input
            name="last_name"
            required
            defaultValue={draft?.last_name ?? authLast ?? ""}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>
      </div>

      <label className="block">
        <span>Email</span>
        <input
          type="email"
          name="email"
          disabled
          defaultValue={user.email ?? ""}
          className="mt-1 w-full border rounded px-3 py-2 bg-gray-50 text-gray-600"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block col-span-2 sm:col-span-1">
          <span>City</span>
          <input
            name="city"
            required
            defaultValue={draft?.city ?? ""}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block col-span-2 sm:col-span-1">
          <span>Organization / Entity (optional)</span>
          <input
            name="org"
            defaultValue={draft?.organization_entity ?? ""}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>
      </div>

      <label className="block">
        <span>Profile Photo</span>
        <input name="avatar" type="file" accept="image/*" className="mt-1 w-full" />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Profile photo preview"
            className="mt-2 h-32 w-32 object-cover rounded-full border"
          />
        )}
      </label>

      <label className="block">
        <span>Short bio (public)</span>
        <textarea
          name="bio"
          rows={4}
          defaultValue={draft?.bio ?? ""}
          className="mt-1 w-full border rounded px-3 py-2"
          placeholder="Tell us about you as an investor…"
        />
      </label>

      <div className="mt-4 flex gap-3">
        <button className="rounded-xl border px-4 py-2">Save & Continue</button>
        <Link href="/dashboard" className="text-sm underline">
          Skip for now
        </Link>
      </div>
    </form>
  );
}
