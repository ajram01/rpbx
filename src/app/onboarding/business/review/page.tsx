// app/onboarding/business/review/page.tsx
import { createClient } from '@/../utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ReviewStep() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/onboarding/business/review')

  const { data: draft } = await supabase
    .from('business_listings')
    .select('*')
    .eq('owner_id', user.id)
    .eq('status', 'draft')
    .maybeSingle()

  if (!draft) redirect('/onboarding/business/basics')

  async function publish() {
    'use server'
    const { createClient } = await import('@/../utils/supabase/server')
    const sb = await createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) redirect('/login?next=/onboarding/business/review')

    await sb.from('business_listings')
      .update({ status: 'published', is_active: true })
      .eq('id', draft!.id)

    redirect('/dashboard')
  }

  return (
    <form action={publish} className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Review & Publish</h1>
      <p className="text-neutral-600">Take a quick look before publishing.</p>

      <div className="rounded border p-4 space-y-2">
        <div><b>Title:</b> {draft.title}</div>
        <div><b>Industry:</b> {draft.industry}</div>
        <div><b>County:</b> {draft.county}</div>
        <div><b>Contact:</b> {draft.contact_email}</div>
        {/* add more fields if you want */}
      </div>

      <div className="mt-4 flex gap-3">
        <button className="rounded-xl border px-4 py-2">Publish listing</button>
        <a href="/onboarding/business/details" className="text-sm underline">Back</a>
      </div>
    </form>
  )
}
