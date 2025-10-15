// app/server/billing.ts
"use server";

import { stripe } from "@/lib/stripe";
import { ensureCustomer } from "@/lib/ensure-customer";

export async function openBillingPortal(returnTo: string) {
  const customerId = await ensureCustomer();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnTo,
  });
  return session.url;
}
