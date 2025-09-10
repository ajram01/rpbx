// app/onboarding/business/review/page.tsx
import { createClient } from '@/../utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ReviewStep() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/onboarding/business/review')

  // Load the draft listing to review
  const { data: draft } = await supabase
    .from('business_listings')
    .select('*')
    .eq('owner_id', user.id)
    .eq('status', 'draft')
    .maybeSingle()

  if (!draft) redirect('/onboarding/business/basics')

  // ---- SERVER ACTION ----
  async function publish() {
    'use server'
    const { createClient } = await import('@/../utils/supabase/server')
    const sb = await createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) redirect('/login?next=/onboarding/business/review')

    // 1) Entitlement: how many active listings allowed?
    const { data: ent, error: entErr } = await sb
      .from('v_user_listing_entitlements')
      .select('allowed_active_listings')
      .eq('user_id', user.id) // <— view has user_id, not owner_id
      .maybeSingle()

    if (entErr) throw new Error('Could not verify membership entitlement.')
    const allowed = ent?.allowed_active_listings ?? 0

    // 2) How many are already published & active?
    const { count: publishedCount, error: cntErr } = await sb
      .from('business_listings')
      .select('id', { count: 'exact', head: true })
      .eq('owner_id', user.id)
      .eq('status', 'published')
      .eq('is_active', true)

    if (cntErr) throw new Error('Could not verify current listing count.')

    if ((publishedCount ?? 0) >= allowed) {
      // You can also redirect to /pricing with a message if you prefer
      throw new Error(`Your plan allows ${allowed} active listing${allowed === 1 ? '' : 's'}. Upgrade or archive one to continue.`)
    }

    // 3) Publish this draft
    const { error: upErr } = await sb
      .from('business_listings')
      .update({ status: 'published', is_active: true })
      .eq('id', draft.id)
      .eq('owner_id', user.id)
      .eq('status', 'draft') // extra guard: only publish if still a draft
      .single()

    if (upErr) throw new Error('Failed to publish listing. Please try again.')

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
