// src/app/welcome/page.tsx
export default async function Welcome({ searchParams }: { searchParams: Promise<{session_id?: string}> }) {
  const { session_id } = await searchParams
  // ...fetch the Stripe session here if you want to show plan info...
  // DO NOT redirect if user is not logged in—show CTA instead.
  return (
    <div className="mx-auto max-w-xl p-6 text-center">
      <h1 className="text-2xl font-semibold">You’re all set!</h1>
      <p className="mt-2 text-neutral-600">
        We’ve saved your purchase. Sign in to complete setup.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <a className="rounded-xl border px-4 py-2" href="/login?next=/onboarding/business/basics">Sign in to continue</a>
        <a className="text-sm underline" href="/dashboard">Skip for now → Dashboard</a>
      </div>
    </div>
  )
}
