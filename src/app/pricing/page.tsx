// app/pricing/page.tsx
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe' // server-only Stripe client (no 'use client')
import Link from 'next/link'
import { createClientRSC } from '../../../utils/supabase/server'


export const revalidate = 600 // refresh every 10 minutes

// Optional: whitelist which prices to show using lookup_key (comma-separated)
// e.g. STRIPE_PUBLIC_LOOKUPS=investor_monthly,investor_yearly
const LOOKUPS = (process.env.STRIPE_PUBLIC_LOOKUPS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

function formatAmount(unit_amount: number | null, currency: string) {
  if (unit_amount == null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(unit_amount / 100)
}

function intervalLabel(r: Stripe.Price.Recurring | null) {
  if (!r) return ''
  const count = r.interval_count ?? 1
  return count > 1 ? `per ${count} ${r.interval}s` : `per ${r.interval}`
}

export default async function PricingPage() {
  // Pull recurring prices and expand product to avoid extra calls
  const list = await stripe.prices.list({
    active: true,
    type: 'recurring',
    expand: ['data.product'],
    limit: 100,
  })

  const supabase = await createClientRSC()
  const { data: { user } } = await supabase.auth.getUser()

  // Filter: only show prices whose parent Product is active
  let prices = list.data.filter(p => {
    const product = p.product as Stripe.Product
    return product?.active
  })

  // Optional: if LOOKUPS is provided, only show those entries
  if (LOOKUPS.length) {
    prices = prices.filter(p => typeof p.lookup_key === 'string' && LOOKUPS.includes(p.lookup_key!))
  }

  // Sort: by product name, then interval (month < year), then amount asc
  const intervalOrder: Record<string, number> = { day: 0, week: 1, month: 2, year: 3 }
  prices.sort((a, b) => {
    const ap = a.product as Stripe.Product
    const bp = b.product as Stripe.Product
    const nameCmp = ap.name.localeCompare(bp.name)
    if (nameCmp !== 0) return nameCmp
    const ai = a.recurring?.interval ?? 'year'
    const bi = b.recurring?.interval ?? 'year'
    const iCmp = (intervalOrder[ai] ?? 99) - (intervalOrder[bi] ?? 99)
    if (iCmp !== 0) return iCmp
    return (a.unit_amount ?? 0) - (b.unit_amount ?? 0)
  })

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-semibold">Choose a plan</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Plans are loaded live from Stripe. Prices shown are billed {prices[0]?.recurring?.interval ?? 'periodically'}.
      </p>

      <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {prices.map((price) => {
    const product = price.product as Stripe.Product
    const amount = formatAmount(price.unit_amount ?? null, price.currency)
    const cad = intervalLabel(price.recurring ?? null)

    // Prefer lookup_key; it lets you swap Price IDs without code changes
    const lookup = price.lookup_key as string

    return (
      <li key={price.id} className="rounded-2xl border p-5 shadow-sm">
        <div className="text-lg font-medium">{product.name}</div>
        <div className="mt-1 text-sm text-neutral-500">{product.description}</div>

        <div className="mt-4">
          <div className="text-4xl font-semibold">{amount}</div>
          <div className="text-sm text-neutral-500">{cad}</div>
        </div>

        {/* If signed in -> one-click Checkout; else -> go to /subscribe/[lookup] */}
        {user ? (
          <form method="post" action="/api/checkout" className="mt-6">
            <input type="hidden" name="priceId" value={price.id} />
            <button
              type="submit"
              className="w-full rounded-xl border px-4 py-2 font-medium hover:bg-neutral-50"
            >
              Subscribe
            </button>
          </form>
        ) : (
            <Link href={`/subscribe/${encodeURIComponent(lookup)}`}>Continue</Link>
        )}

        {/* Optional details page */}
        <div className="mt-3">
          <Link
            href={
              lookup
                ? `/plan/${encodeURIComponent(lookup)}`
                : `/plan/by-id/${encodeURIComponent(price.id)}`
            }
            className="text-sm underline"
          >
            View details
          </Link>
        </div>
      </li>
    )
  })}
</ul>

      {/* (Optional) Manage billing shortcut for already-signed-in users */}
      <div className="mt-10 text-center">
        <form method="post" action="/api/portal" className="inline-block">
          <input type="hidden" name="returnUrl" value="/account" />
          <button type="submit" className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50">
            Manage billing
          </button>
        </form>
      </div>
    </div>
  )
}
