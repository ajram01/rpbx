"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";

export default function PaywallOverlay({
  intendedRole,
  priceId,
}: {
  intendedRole: "business" | "investor";
  priceId?: string; // optional — if missing, routes to pricing
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  async function resumeCheckout() {
    try {
      setLoading(true);
      setErr(null);

      // If we don't have a priceId yet, send the user to the plan picker
      if (!priceId) {
        router.push(`/pricing?from=dashboard&role=${encodeURIComponent(intendedRole)}`);
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          priceId,
          purpose: "base_membership",
          metadata: { user_type_intended: intendedRole },
          successUrl: `${window.location.origin}/welcome?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/dashboard`,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Checkout failed");
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (e: any) {
      setErr(e?.message ?? "Something went wrong");
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      const res = await fetch("/auth/signout", { method: "POST" });
      if (res.ok) {
        router.push("/login"); // redirect to your login or landing page
      } else {
        console.error("Logout failed");
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl text-center">
        <h2 className="text-xl font-semibold">Complete Your Membership</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Your account is created, but you don’t have an active membership yet.
        </p>

        {!!err && <p className="mt-3 text-sm text-red-600">{err}</p>}

        <div className="mt-5 space-y-2 w-full">
          <Button
            onClick={resumeCheckout}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Opening checkout…" : "Continue checkout"}
          </Button>

          <p className="text-xs text-neutral-500 text-center">
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
              You can cancel anytime.
            </div>
          </p>

          {/* --- Added logout option --- */}
          <p className="text-xs text-neutral-500 mt-3">
            or{" "}
            <form action="/signout" method="post">
                <Button type="submit">Log Out</Button>
            </form>
          </p>
        </div>
      </div>
    </div>
  );
}
