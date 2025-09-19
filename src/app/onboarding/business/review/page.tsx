// app/onboarding/business/review/page.tsx
import { createClientRSC } from '@/../utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

type ReviewSearchParams = Promise<{ msg?: string; allowed?: string }>

// 🚩 Feature flag — turn back to true to re-enable credit checks
const CHECK_PLAN_LIMITS = false as const

export default async function ReviewStep({
  searchParams,
}: {
  searchParams: ReviewSearchParams
}) {
  const sp = await searchParams

  const supabase = await createClientRSC()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/onboarding/business/review')

  // Load the draft (only fields we show)
  const { data: draft } = await supabase
    .from('business_listings')
    .select(`
      id,
      title,
      industry,
      county,
      location_city,
      contact_email,
      ownership_percentage,
      annual_revenue_range,
      book_value_range,
      ebitda_range,
      years_in_business,
      employee_count_range,
      description,
      listing_image_path
    `)
    .eq('owner_id', user.id)
    .eq('status', 'draft')
    .maybeSingle()

  if (!draft) redirect('/onboarding/business/set-up')

  // Signed URL for cover image (private bucket)
  let coverUrl: string | null = null
  if (draft.listing_image_path) {
    const { data: signed } = await supabase.storage
      .from('listings')
      .createSignedUrl(draft.listing_image_path, 60)
    coverUrl = signed?.signedUrl ?? null
  }

  // Soft pre-check for plan limits (banner only) — gated by flag
  let allowed = 0
  let publishedCount: number | null = null
  if (CHECK_PLAN_LIMITS) {
    const { data: ent } = await supabase
      .from('v_user_listing_entitlements')
      .select('allowed_active_listings')
      .eq('user_id', user.id)
      .maybeSingle()
    allowed = ent?.allowed_active_listings ?? 0

    const { count } = await supabase
      .from('business_listings')
      .select('id', { count: 'exact', head: true })
      .eq('owner_id', user.id)
      .eq('status', 'published')
      .eq('is_active', true)
    publishedCount = count ?? 0
  }

  // Labels for tokens
  const LABELS = {
    annual: {
      '0_50k':'0–50K','50k_100k':'50K–100K','100k_250k':'100K–250K','250k_1m':'250K–1M','1m_plus':'1M+',
    },
    book: {
      '25k_150k':'25K–150K','150k_750k':'150K–750K','750k_3m':'750K–3M','3m_7m':'3M–7M',
    },
    ebitda: {
      'lt_50k':'Under 50K','50k_150k':'50K–150K','150k_500k':'150K–500K','500k_1m':'500K–1M','gt_1m':'1M+',
    },
    years: {
      'lt_1':'< 1 year','1_3':'1–3 years','3_5':'3–5 years','5_10':'5–10 years','gt_10':'10+ years',
    },
    emp: {
      '1_4':'1–4','5_10':'5–10','11_25':'11–25','26_50':'26–50','51_100':'51–100','gt_100':'100+',
    },
  } as const
  const fmt = (v: string | null | undefined, m: Record<string,string>) => (v && m[v]) || '—'

  // ---- SERVER ACTION ----
  const draftId = draft.id

  async function publish() {
    'use server'
    const { createClientRSC } = await import('@/../utils/supabase/server')
    const sb = await createClientRSC()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) redirect('/login?next=/onboarding/business/review')

    if (CHECK_PLAN_LIMITS) {
      // Re-check entitlement + count (authoritative)
      const { data: ent2 } = await sb
        .from('v_user_listing_entitlements')
        .select('allowed_active_listings')
        .eq('user_id', user.id)
        .maybeSingle()
      const allowed2 = ent2?.allowed_active_listings ?? 0

      const { count: publishedCount2, error: cntErr } = await sb
        .from('business_listings')
        .select('id', { count: 'exact', head: true })
        .eq('owner_id', user.id)
        .eq('status', 'published')
        .eq('is_active', true)
      if (cntErr) redirect('/onboarding/business/review?msg=count_error')

      if ((publishedCount2 ?? 0) >= allowed2) {
        redirect(`/onboarding/business/review?msg=limit&allowed=${allowed2}`)
      }
    }

    // Publish this draft
    const { error: upErr } = await sb
      .from('business_listings')
      .update({ status: 'published', is_active: true })
      .eq('id', draftId)
      .eq('owner_id', user.id)
      .eq('status', 'draft')
      .single()
    if (upErr) redirect('/onboarding/business/review?msg=publish_failed')

    redirect('/dashboard')
  }

  return (
    <form action={publish} className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Review &amp; Publish</h1>
      <p className="text-neutral-600">Take a quick look before publishing.</p>

      {/* Optional limit banner — hidden while CHECK_PLAN_LIMITS === false */}
      {CHECK_PLAN_LIMITS && (publishedCount ?? 0) >= (allowed ?? 0) && (
        <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-900">
          Your plan allows {allowed} active listing{allowed === 1 ? '' : 's'}.{' '}
          <Link href="/pricing" className="ml-2 underline">Upgrade</Link> to publish.
        </div>
      )}

      <div className="rounded border p-4 space-y-3">
        {coverUrl && (
          <img src={coverUrl} alt="Listing cover" className="h-40 w-full object-cover rounded border" />
        )}
        <div><b>Title:</b> {draft.title ?? '—'}</div>
        <div><b>Industry:</b> {draft.industry ?? '—'}</div>
        <div><b>County:</b> {draft.county ?? '—'}</div>
        <div><b>City:</b> {draft.location_city ?? '—'}</div>
        <div><b>Contact:</b> {draft.contact_email ?? '—'}</div>
        <hr className="my-2" />
        <div><b>Ownership %:</b> {draft.ownership_percentage ?? '—'}</div>
        <div><b>Annual revenue:</b> {fmt(draft.annual_revenue_range, LABELS.annual)}</div>
        <div><b>Book value:</b> {fmt(draft.book_value_range, LABELS.book)}</div>
        <div><b>EBITDA:</b> {fmt(draft.ebitda_range, LABELS.ebitda)}</div>
        <div><b>Years in business:</b> {fmt(draft.years_in_business, LABELS.years)}</div>
        <div><b>Employees:</b> {fmt(draft.employee_count_range, LABELS.emp)}</div>
        {draft.description && (
          <div>
            <b>Description:</b>
            <p className="whitespace-pre-wrap mt-1">{draft.description}</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <button className="rounded-xl border px-4 py-2">Publish listing</button>
        <Link href="/onboarding/business/details" className="text-sm underline">Back</Link>
      </div>
    </form>
  )
}
