// app/onboarding/business/details/page.tsx
import { createClient } from '@/../utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function DetailsStep() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/onboarding/business/details')

  const { data: draft } = await supabase
    .from('business_listings')
    .select('*')
    .eq('owner_id', user.id)
    .eq('status', 'draft')
    .maybeSingle()

  if (!draft) redirect('/onboarding/business/basics')

  async function save(formData: FormData) {
    'use server'
    const { createClient } = await import('@/../utils/supabase/server')
    const sb = await createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) redirect('/login?next=/onboarding/business/details')

    const ownership_percentage = formData.get('ownership_percentage') ? Number(formData.get('ownership_percentage')) : null
    const annual_revenue_range = String(formData.get('annual_revenue_range') ?? '') || null
    const book_value_range     = String(formData.get('book_value_range') ?? '') || null
    const ebitda_range         = String(formData.get('ebitda_range') ?? '') || null
    const years_in_business    = formData.get('years_in_business') ? Number(formData.get('years_in_business')) : null
    const employee_count_range = String(formData.get('employee_count_range') ?? '') || null
    const description          = String(formData.get('description') ?? '') || null
    // listing_image_url: handle later via upload flow; set nullable/null for now

    await sb.from('business_listings').update({
      ownership_percentage,
      annual_revenue_range,
      book_value_range,
      ebitda_range,
      years_in_business,
      employee_count_range,
      description,
    }).eq('id', draft!.id)

    redirect('/onboarding/business/review')
  }

  return (
    <form action={save} className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Details</h1>

      <label className="block">
        <span>Ownership percentage</span>
        <input name="ownership_percentage" type="number" min="0" max="100" step="1"
               defaultValue={draft?.ownership_percentage ?? ''} className="mt-1 w-full border rounded px-3 py-2" />
      </label>

      <label className="block">
        <span>Annual revenue</span>
        <select name="annual_revenue_range" defaultValue={draft?.annual_revenue_range ?? ''} className="mt-1 w-full border rounded px-3 py-2">
          <option value="">—</option>
          <option value="0_50k">0–50K</option>
          <option value="50k_100k">50K–100K</option>
          <option value="100k_250k">100K–250K</option>
          <option value="250k_1m">250K–$1M</option>
          <option value="1m_plus">$1M+</option>
        </select>
      </label>

      {/* Repeat similar selects/inputs for book_value_range, ebitda_range, years_in_business, employee_count_range */}
      <label className="block">
        <span>Book Value Range</span>
        <select name="book_value_range" defaultValue={draft?.book_value_range ?? ''} className="mt-1 w-full border rounded px-3 py-2">
            <option value="">-</option>
            <option value=""></option>

        </select>
      </label>

      <label className="block">
        <span>Description</span>
        <textarea name="description" rows={5} defaultValue={draft?.description ?? ''} className="mt-1 w-full border rounded px-3 py-2" />
      </label>

      <div className="mt-4 flex gap-3">
        <button className="rounded-xl border px-4 py-2">Save & Continue</button>
        <a href="/dashboard" className="text-sm underline">Skip for now</a>
      </div>
    </form>
  )
}
