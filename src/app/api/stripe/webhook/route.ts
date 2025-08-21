import Stripe from 'stripe'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' // avoid caching for webhook routes

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature')!
  const body = await req.text() // RAW body is required

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // Handle events that affect entitlements/billing state
  switch (event.type) {
    case 'checkout.session.completed': {
      // create/attach customer to user if needed, look up subscription, persist mapping
      break
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      // upsert subscription row for user_id:
      // status, price_id, quantity, cancel_at_period_end,
      // current_period_start/end, trial_start/end, canceled_at, cancel_at, etc.
      break
    }
    case 'invoice.paid':
    case 'invoice.payment_failed': {
      // optional: react to billing success/failure
      break
    }
    default:
      break
  }

  return new Response('ok')
}
