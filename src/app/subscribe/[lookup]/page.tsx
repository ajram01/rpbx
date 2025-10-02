import { notFound } from 'next/navigation'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import Link from 'next/link'
import Button from "../../components/Button";

export const revalidate = 300

function priceLabel(p: Stripe.Price) {
  const amt = p.unit_amount ?? 0
  const money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: p.currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(amt / 100)
  const r = p.recurring
  const cadence = r?.interval_count && r.interval_count > 1
    ? `per ${r.interval_count} ${r.interval}s`
    : `per ${r?.interval ?? 'period'}`
  return `${money} ${r ? cadence : ''}`
}

export default async function SubscribePage({
  params,
}: {
  // 👇 Next.js 15: params is a Promise
  params: Promise<{ lookup: string }>
}) {
  const { lookup } = await params // 👈 must await

  const { data } = await stripe.prices.list({
    active: true,
    type: 'recurring',
    lookup_keys: [lookup],
    expand: ['data.product'],
    limit: 1,
  })
  const price = data[0]
  if (!price) return notFound()

  const product = price.product as Stripe.Product
  if (!product?.active) return notFound()

  return (
    <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-center min-h-screen justify-center">
    <div className=" bg-white mx-auto max-w-lg lg:min-w-[500px] p-6 my-5 rounded-xl border border-neutral-200 shadow">
      <Link href="/pricing" className="text-sm underline hover:text-[#60BC9B]">&larr; All plans</Link>
      <h1 className="mt-2 text-2xl font-semibold">Create Your Account</h1>
      <p className="mt-2 text-neutral-600">
        You’re subscribing to <strong>{product.name}</strong>
      </p>
      <p className="text-neutral-600">
        Price: {priceLabel(price)}
      </p>

      <form method="post" action="/api/subscribe" className="mt-6 space-y-3">
  <input name="lookup" type="hidden" value={lookup} />

  <label className="block">
    <span>First name</span>
    <input name="first_name" required className="mt-1 w-full border rounded px-3 py-2" />
  </label>

  <label className="block">
    <span>Last name</span>
    <input name="last_name" required className="mt-1 w-full border rounded px-3 py-2" />
  </label>

  <label className="block">
    <span>Username</span>
    <input name="username" required className="mt-1 w-full border rounded px-3 py-2" />
  </label>

  <label className="block">
    <span>Email</span>
    <input name="email" type="email" required className="mt-1 w-full border rounded px-3 py-2" />
  </label>

  <label className="block">
    <span>Password</span>
    <input name="password" type="password" required className="mt-1 w-full border rounded px-3 py-2" />
  </label>

  <Button className="w-full">Continue to secure checkout</Button>

</form>
    </div>
    </div>
  )
}
