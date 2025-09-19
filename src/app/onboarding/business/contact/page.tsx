// app/onboarding/business/contact/page.tsx
import { createClientRSC } from '@/../utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ContactStep() {
  const supabase = await createClientRSC()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/onboarding/business/contact')

  // Load the active draft (created by the Basics step)
  const { data: draft } = await supabase
    .from('business_listings')
    .select('*')
    .eq('owner_id', user.id)
    .eq('status', 'draft')
    .maybeSingle()

  // If no draft yet, send them back to Basics to start one
  if (!draft) redirect('/onboarding/business/set-up')

async function save(formData: FormData) {
  'use server'
  const { createClientRSC } = await import('@/../utils/supabase/server')
  const sb = await createClientRSC()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) redirect('/login?next=/onboarding/business/contact')

  const { data: currentDraft } = await sb
    .from('business_listings').select('id')
    .eq('owner_id', user.id).eq('status', 'draft')
    .maybeSingle() // safe if uniqueness is enforced
  if (!currentDraft) redirect('/onboarding/business/set-up')

  const contact_email = String(formData.get('contact_email') ?? '')
  const can_provide_financials = formData.get('can_provide_financials') === 'on'
  const can_provide_tax_returns = formData.get('can_provide_tax_returns') === 'on'

  await sb.from('business_listings').update({
    contact_email, can_provide_financials, can_provide_tax_returns
  }).eq('id', currentDraft.id)

  redirect('/onboarding/business/details')
}

  return (
    <form action={save} className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Contact & Documents</h1>

      <label className="block">
        <span>Contact email</span>
        <input
          name="contact_email"
          type="email"
          required
          defaultValue={draft?.contact_email ?? (user?.email ?? '')}
          className="mt-1 w-full border rounded px-3 py-2"
        />
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="can_provide_financials" defaultChecked={!!draft?.can_provide_financials} />
        <span>We can provide financial statements on request</span>
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="can_provide_tax_returns" defaultChecked={!!draft?.can_provide_tax_returns} />
        <span>We can provide tax returns on request</span>
      </label>

      <div className="mt-4 flex gap-3">
        <button className="rounded-xl border px-4 py-2">Save & Continue</button>
        <a href="/dashboard" className="text-sm underline">Skip for now</a>
      </div>
    </form>
  )
}
