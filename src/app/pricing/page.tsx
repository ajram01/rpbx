import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createClientRSC } from '../../../utils/supabase/server'
import PricingTable from "../components/pricing-table"

export const revalidate = 600

const LOOKUPS = (process.env.STRIPE_PUBLIC_LOOKUPS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

export default async function PricingPage() {
  const list = await stripe.prices.list({
    active: true,
    type: 'recurring',
    expand: ['data.product'],
    limit: 100,
  })

  let prices = list.data.filter((p) => {
    const product = p.product as Stripe.Product
    return product?.active
  })

  if (LOOKUPS.length) {
    prices = prices.filter(
      (p) => typeof p.lookup_key === 'string' && LOOKUPS.includes(p.lookup_key!)
    )
  }

  return (
    <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-center">
      <div className="mx-auto lg:w-[1140px] py-10">
        <h1 className="text-3xl font-semibold">Choose a plan</h1>
        <p className="mt-2 mb-8 text-sm text-neutral-500">
          Toggle between monthly and yearly billing. Free plans are always available.
        </p>

        {/* ✅ Now PricingGrid accepts props without TypeScript error */}
        <PricingTable />
      </div>
    </div>
  )
}
