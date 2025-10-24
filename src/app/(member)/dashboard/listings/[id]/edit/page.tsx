// app/owner/listings/[id]/edit/page.tsx
import { createClientRSC } from "@/../utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EditListing({
  params,
}: {
  params: Promise<{ id: string}>
}) {
    const { id } = await params
  const supabase = await createClientRSC();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/owner/listings/${id}/edit`);

  // Ensure this listing belongs to the user
  const { data: listing, error } = await supabase
    .from("business_listings")
    .select("id, owner_id, title, industry, status, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !listing || listing.owner_id !== user.id) {
    redirect("/owner/listings");
  }

  return (
    <main className="w-full lg:w-[900px] mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">Edit Listing</h1>
      <p className="text-sm text-neutral-600">
        {listing.title ?? "Untitled Listing"} · {listing.industry ?? "—"}
      </p>

      <div className="mt-6 grid gap-3">
        <Link
          href={`/onboarding/business/set-up?editId=${listing.id}`}
          className="rounded-xl border p-4 hover:border-[#60BC9B]"
        >
          <div className="font-medium">1) Basics</div>
          <div className="text-sm text-neutral-600">
            Title, industry, location, cover image
          </div>
        </Link>

        <Link
          href={`/onboarding/business/contact?editId=${listing.id}`}
          className="rounded-xl border p-4 hover:border-[#60BC9B]"
        >
          <div className="font-medium">2) Contact</div>
          <div className="text-sm text-neutral-600">
            Contact email, document readiness
          </div>
        </Link>

        <Link
          href={`/onboarding/business/details?editId=${listing.id}`}
          className="rounded-xl border p-4 hover:border-[#60BC9B]"
        >
          <div className="font-medium">3) Details</div>
          <div className="text-sm text-neutral-600">
            Ownership %, revenue/book value ranges, EBITDA, employees, description
          </div>
        </Link>

        <Link
          href={`/onboarding/business/review?editId=${listing.id}`}
          className="rounded-xl border p-4 hover:border-[#60BC9B]"
        >
          <div className="font-medium">4) Review</div>
          <div className="text-sm text-neutral-600">
            Preview everything and save changes
          </div>
        </Link>
      </div>

      <div className="mt-6 text-sm text-neutral-500">
        Changes are saved per step. You can jump directly to any section.
      </div>
    </main>
  );
}
