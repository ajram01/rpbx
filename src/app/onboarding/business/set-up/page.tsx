// app/onboarding/business/basics/page.tsx
import { createClient } from '@/../utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Basics() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/onboarding/business/set-up')

  // load or create a single draft for this owner
  const { data: draft } = await supabase
    .from('business_listings')
    .select('*')
    .eq('owner_id', user.id)
    .eq('status', 'draft')
    .maybeSingle()

  async function save(formData: FormData) {
    'use server'
    const title   = String(formData.get('title') ?? '')
    const industry = String(formData.get('industry') ?? '')
    const county  = String(formData.get('county') ?? '')
    const city    = String(formData.get('city') ?? '')

    const { createClient } = await import('@/../utils/supabase/server')
    const sb = await createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) redirect('/login?next=/onboarding/business/set-up')

    const payload = {
      owner_id: user.id,
      title,
      industry,
      county,
      location_city: city || null,
      // do NOT set is_active here; publishing happens on the Review step
      status: 'draft' as const,
      // contact_email default: use their auth email initially
      contact_email: user.email,
    }

    if (draft?.id) {
      await sb.from('business_listings').update(payload).eq('id', draft.id)
    } else {
      await sb.from('business_listings').insert(payload)
    }
    redirect('/onboarding/business/contact') // next step
  }

  return (
    <form action={save} className="mx-auto max-w-xl p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Business basics</h1>

      <label className="block">
        <span>Business Title</span>
        <input name="title" defaultValue={draft?.title ?? ''} required className="mt-1 w-full border rounded px-3 py-2" />
      </label>

    <label className="block">
        <span>Industry</span>
        <select
            name="industry"
            required
            defaultValue={draft?.industry ?? ''}
            className="mt-1 w-full border rounded px-3 py-2"
        >
        <option value="" disabled>Choose an industry…</option>
        <option value="manufacturing">Manufacturing</option>
        <option value="retail">Retail</option>
        <option value="hospitality">Hospitality</option>
        <option value="construction">Construction</option>
        <option value="professional_services">Professional Services</option>
        <option value="healthcare">Healthcare</option>
        <option value="real_estate">Real Estate</option>
        <option value="transportation_logistics">Transportation & Logistics</option>
        <option value="technology">Technology</option>
        <option value="other">Other</option>
        </select>
    </label>

      <label className="block">
        <span>County</span>
        <select 
            name="county"
            required
            defaultValue={draft?.county ?? ''}
            className="mt-1 w-full border rounded px-3 py-2"
        >
        <option value="" disabled>Choose a county</option>
        <option value="Hidalgo">Hidalgo</option>
        <option value="Cameron">Cameron</option>
        <option value="Starr">Starr</option>
        <option value="Willacy">Willacy</option>
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span>City</span>
          <input name="city" defaultValue={draft?.location_city ?? ''} className="mt-1 w-full border rounded px-3 py-2" />
        </label>
        <label className="block">
          <span>State</span>
          <input name="state" defaultValue={draft?.location_state ?? ''} className="mt-1 w-full border rounded px-3 py-2" />
        </label>
      </div>

      <div className="mt-4 flex gap-3">
        <button className="rounded-xl border px-4 py-2">Save & Continue</button>
        <a href="/dashboard" className="text-sm underline">Skip for now</a>
      </div>
    </form>
  )
}
