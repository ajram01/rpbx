// // app/owner/listings/[id]/page.tsx

// import { createClientRSC } from "@/../utils/supabase/server";
// import { redirect } from "next/navigation";

// type Listing = {
//   id: string;
//   owner_id: string;
//   title: string;
//   industry: string;
//   status: string;
//   description: string | null;
//   contact_email: string | null;

//   location_city: string | null;
//   county: string | null;
//   years_in_business: string | null;
//   employee_count_range: string | null;

//   annual_revenue_range: string | null;
//   ebitda_range: string | null;
//   book_value_range: string | null;
//   ownership_percentage: number | null;

//   can_provide_financials: boolean | null;
//   can_provide_tax_returns: boolean | null;

//   is_active: boolean | null;

//   listing_image_path: string | null;
//   listing_image_alt: string | null;
//   listing_image_w: number | null;
//   listing_image_h: number | null;

//   updated_at: string | null;
// };

// export default async function EditListingPage({
//   params,
//   searchParams,
// }: {
//   params: { id: string };
//   searchParams: { saved?: string };
// }) {
//   const supabase = await createClientRSC();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) redirect(`/login?next=/owner/listings/${params.id}`);

//   // Fetch listing + ensure ownership
//   const { data: listing, error } = await supabase
//     .from("business_listings")
//     .select(
//       `
//         id, owner_id, title, industry, status, description, contact_email,
//         location_city, county, years_in_business, employee_count_range,
//         annual_revenue_range, ebitda_range, book_value_range, ownership_percentage,
//         can_provide_financials, can_provide_tax_returns, is_active,
//         listing_image_path, listing_image_alt, listing_image_w, listing_image_h,
//         updated_at
//       `
//     )
//     .eq("id", params.id)
//     .maybeSingle<Listing>();

//   if (error) console.error("Fetch listing failed:", error.message);
//   if (!listing) redirect("/owner/listings");
//   if (listing.owner_id !== user.id) redirect("/owner/listings");

//   const saved = searchParams?.saved === "1";

//   async function save(formData: FormData) {
//     "use server";
//     const { createClientRSC } = await import("@/../utils/supabase/server");
//     const supabaseSrv = await createClientRSC();

//     const {
//       data: { user: authed },
//     } = await supabaseSrv.auth.getUser();
//     if (!authed) redirect(`/login?next=/owner/listings/${params.id}`);

//     // Strings
//     const title = (formData.get("title") as string)?.trim();
//     const industry = (formData.get("industry") as string)?.trim();
//     const status = (formData.get("status") as string)?.trim();
//     const description = ((formData.get("description") as string) ?? "").trim();
//     const contact_email = ((formData.get("contact_email") as string) ?? "").trim() || null;

//     const location_city = ((formData.get("location_city") as string) ?? "").trim() || null;
//     const county = ((formData.get("county") as string) ?? "").trim() || null;
//     const years_in_business = ((formData.get("years_in_business") as string) ?? "").trim() || null;
//     const employee_count_range = ((formData.get("employee_count_range") as string) ?? "").trim() || null;

//     const annual_revenue_range = ((formData.get("annual_revenue_range") as string) ?? "").trim() || null;
//     const ebitda_range = ((formData.get("ebitda_range") as string) ?? "").trim() || null;
//     const book_value_range = ((formData.get("book_value_range") as string) ?? "").trim() || null;

//     // Numbers
//     const ownership_percentage_raw = formData.get("ownership_percentage") as string;
//     const listing_image_w_raw = formData.get("listing_image_w") as string;
//     const listing_image_h_raw = formData.get("listing_image_h") as string;

//     const ownership_percentage =
//       ownership_percentage_raw ? Number(ownership_percentage_raw) : null;
//     const listing_image_w = listing_image_w_raw ? Number(listing_image_w_raw) : null;
//     const listing_image_h = listing_image_h_raw ? Number(listing_image_h_raw) : null;

//     // Booleans (checkbox)
//     const can_provide_financials = formData.get("can_provide_financials") === "on";
//     const can_provide_tax_returns = formData.get("can_provide_tax_returns") === "on";
//     const is_active = formData.get("is_active") === "on";

//     // Images
//     const listing_image_path = ((formData.get("listing_image_path") as string) ?? "").trim() || null;
//     const listing_image_alt = ((formData.get("listing_image_alt") as string) ?? "").trim() || null;

//     // Update (RLS should enforce owner)
//     const { error: upErr } = await supabaseSrv
//       .from("business_listings")
//       .update({
//         title,
//         industry,
//         status,
//         description,
//         contact_email,
//         location_city,
//         county,
//         years_in_business,
//         employee_count_range,
//         annual_revenue_range,
//         ebitda_range,
//         book_value_range,
//         ownership_percentage,
//         can_provide_financials,
//         can_provide_tax_returns,
//         is_active,
//         listing_image_path,
//         listing_image_alt,
//         listing_image_w,
//         listing_image_h,
//         updated_at: new Date().toISOString(),
//       })
//       .eq("id", params.id)
//       .eq("owner_id", authed.id);

//     if (upErr) {
//       console.error("Update listing failed:", upErr.message);
//       redirect(`/owner/listings/${params.id}?saved=0`);
//     }

//     // Log activity
//     const { error: actErr } = await supabaseSrv.from("listing_activity").insert({
//       listing_id: params.id,
//       actor_user_id: authed.id,
//       event: "updated",
//       meta: {
//         fields: [
//           "title",
//           "industry",
//           "status",
//           "description",
//           "contact_email",
//           "location_city",
//           "county",
//           "years_in_business",
//           "employee_count_range",
//           "annual_revenue_range",
//           "ebitda_range",
//           "book_value_range",
//           "ownership_percentage",
//           "can_provide_financials",
//           "can_provide_tax_returns",
//           "is_active",
//           "listing_image_*",
//         ],
//       },
//     });
//     if (actErr) console.error("Activity insert failed:", actErr.message);

//     redirect(`/owner/listings/${params.id}?saved=1`);
//   }

//   return (
//     <main className="w-full lg:w-[1140px] mx-auto p-6">
//       <h1 className="text-2xl font-semibold">Edit Listing</h1>
//       {saved && (
//         <div
//           className="mt-3 rounded-lg border px-4 py-3 text-sm"
//           style={{ borderColor: "#9ed3c3" }}
//         >
//           Changes saved.
//         </div>
//       )}

//       <form action={save} className="mt-6 space-y-7 max-w-3xl">
//         {/* Core */}
//         <section>
//           <h2 className="font-semibold mb-2">Core</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Field label="Title">
//               <input name="title" defaultValue={listing.title} className="mt-1 w-full rounded-lg border p-2" />
//             </Field>
//             <Field label="Industry">
//               <input name="industry" defaultValue={listing.industry} className="mt-1 w-full rounded-lg border p-2" />
//             </Field>
//             <Field label="Status">
//               <input name="status" defaultValue={listing.status} className="mt-1 w-full rounded-lg border p-2" placeholder="e.g., draft, published" />
//             </Field>
//             <Field label="Contact Email">
//               <input type="email" name="contact_email" defaultValue={listing.contact_email ?? ""} className="mt-1 w-full rounded-lg border p-2" />
//             </Field>
//           </div>
//           <Field label="Description" className="mt-4">
//             <textarea
//               name="description"
//               defaultValue={listing.description ?? ""}
//               className="mt-1 w-full rounded-lg border p-2 min-h-[120px]"
//             />
//           </Field>
//         </section>

//         {/* Location & Ops */}
//         <section>
//           <h2 className="font-semibold mb-2">Location & Operations</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Field label="City">
//               <input name="location_city" defaultValue={listing.location_city ?? ""} className="mt-1 w-full rounded-lg border p-2" />
//             </Field>
//             <Field label="County">
//               <input name="county" defaultValue={listing.county ?? ""} className="mt-1 w-full rounded-lg border p-2" />
//             </Field>
//             <Field label="Years in Business">
//               <input name="years_in_business" defaultValue={listing.years_in_business ?? ""} className="mt-1 w-full rounded-lg border p-2" />
//             </Field>
//             <Field label="Employee Count (range)">
//               <input name="employee_count_range" defaultValue={listing.employee_count_range ?? ""} className="mt-1 w-full rounded-lg border p-2" placeholder="e.g., 10–25" />
//             </Field>
//           </div>
//         </section>

//         {/* Financials */}
//         <section>
//           <h2 className="font-semibold mb-2">Financials</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Field label="Annual Revenue (range)">
//               <input name="annual_revenue_range" defaultValue={listing.annual_revenue_range ?? ""} className="mt-1 w-full rounded-lg border p-2" placeholder="e.g., $1.5M–$2M" />
//             </Field>
//             <Field label="EBITDA (range)">
//               <input name="ebitda_range" defaultValue={listing.ebitda_range ?? ""} className="mt-1 w-full rounded-lg border p-2" placeholder="e.g., $250k–$350k" />
//             </Field>
//             <Field label="Book Value (range)">
//               <input name="book_value_range" defaultValue={listing.book_value_range ?? ""} className="mt-1 w-full rounded-lg border p-2" />
//             </Field>
//             <Field label="Ownership Percentage">
//               <input type="number" step="0.01" name="ownership_percentage" defaultValue={listing.ownership_percentage ?? undefined} className="mt-1 w-full rounded-lg border p-2" placeholder="e.g., 80" />
//             </Field>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
//             <Checkbox name="can_provide_financials" label="Can provide financials" defaultChecked={!!listing.can_provide_financials} />
//             <Checkbox name="can_provide_tax_returns" label="Can provide tax returns" defaultChecked={!!listing.can_provide_tax_returns} />
//             <Checkbox name="is_active" label="Active listing" defaultChecked={!!listing.is_active} />
//           </div>
//         </section>

//         {/* Image */}
//         <section>
//           <h2 className="font-semibold mb-2">Listing Image</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Field label="Image Path (storage URL or path)">
//               <input name="listing_image_path" defaultValue={listing.listing_image_path ?? ""} className="mt-1 w-full rounded-lg border p-2" />
//             </Field>
//             <Field label="Alt Text">
//               <input name="listing_image_alt" defaultValue={listing.listing_image_alt ?? ""} className="mt-1 w-full rounded-lg border p-2" />
//             </Field>
//             <Field label="Image Width (px)">
//               <input type="number" name="listing_image_w" defaultValue={listing.listing_image_w ?? undefined} className="mt-1 w-full rounded-lg border p-2" />
//             </Field>
//             <Field label="Image Height (px)">
//               <input type="number" name="listing_image_h" defaultValue={listing.listing_image_h ?? undefined} className="mt-1 w-full rounded-lg border p-2" />
//             </Field>
//           </div>
//         </section>

//         <div className="flex items-center gap-3">
//           <button
//             type="submit"
//             className="px-5 py-2 rounded-xl text-white"
//             style={{ backgroundColor: "#9ed3c3" }}
//             formAction={save}
//           >
//             Save Changes
//           </button>
//         </div>
//       </form>
//     </main>
//   );
// }

// /** Small presentational helpers (keeps the file tidy) */
// function Field({
//   label,
//   className,
//   children,
// }: {
//   label: string;
//   className?: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className={className}>
//       <label className="block text-sm font-medium">{label}</label>
//       {children}
//     </div>
//   );
// }
// function Checkbox({
//   name,
//   label,
//   defaultChecked,
// }: {
//   name: string;
//   label: string;
//   defaultChecked?: boolean;
// }) {
//   return (
//     <label className="inline-flex items-center gap-2 text-sm">
//       <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4" />
//       {label}
//     </label>
//   );
// }


export default function Page() {
  return <div>Coming soon...</div>;
}