// app/owner/listings/page.tsx
export const dynamic = "force-dynamic";

import { createClientRSC } from "@/../utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

type BusinessListing = {
  id: string;
  title: string | null;
  industry: string | null;
  updated_at: string | null;
};

export default async function OwnerListings() {
  const supabase = await createClientRSC();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/owner/listings");

  const { data: listings, error } = await supabase
    .from("business_listings")
    .select("id, title, industry, updated_at")
    .eq("owner_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Fetch listings failed:", error.message);
  }

  return (
    <main className="w-full lg:w-[1140px] mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Your Listings</h1>

      {!listings || listings.length === 0 ? (
        <p className="text-neutral-600">You don’t have any listings yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map((l) => (
            <div key={l.id} className="rounded-xl border p-4">
              <h3 className="font-medium">{l.title ?? "Untitled Listing"}</h3>
              <p className="text-sm text-neutral-600">
                Industry: {l.industry ?? "—"}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Updated: {l.updated_at ? new Date(l.updated_at).toLocaleString() : "—"}
              </p>
              <Link
                href={`/owner/listings/${l.id}`}
                className="inline-block mt-3 px-4 py-2 rounded-xl text-white"
                style={{ backgroundColor: "#9ed3c3" }}
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
