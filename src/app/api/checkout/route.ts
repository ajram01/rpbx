// app/api/checkout/route.ts
export const runtime = 'nodejs'
import { stripe } from '@/lib/stripe'
import { ensureCustomer } from '@/lib/ensure-customer'
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    )

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return new Response('Unauthorized', { status: 401 })

    const ct = req.headers.get('content-type') ?? ''
    let priceId = ''
    let quantity = 1
    // NEW (optional):
    let metadata: Record<string, string> | undefined
    let successUrl: string | undefined
    let cancelUrl: string | undefined

    if (ct.includes('application/json')) {
      const body = await req.json()
      priceId = String(body.priceId ?? '')
      quantity = Number(body.quantity ?? 1)
      // NEW (optional):
      metadata  = body.metadata
      successUrl = body.successUrl
      cancelUrl  = body.cancelUrl
    } else {
      const form = await req.formData()
      priceId = String(form.get('priceId') ?? '')
      quantity = Number(form.get('quantity') ?? 1)
    }

    if (!priceId) return new Response('Missing priceId', { status: 400 })

    const customerId = await ensureCustomer()

    const origin =
      req.headers.get('origin') ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity }],
      // NEW (optional overrides). If undefined, you keep your current URLs:
      success_url: successUrl ?? `${origin}/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  cancelUrl  ?? `${origin}/pricing`,
      subscription_data: {
        // keep existing metadata, and optionally merge listing metadata
        metadata: {
          supabase_user_id: user.id,
          ...(metadata ?? {}),
        },
      },
      allow_promotion_codes: true,
    })

    return Response.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return new Response('Checkout error', { status: 500 })
  }
}
