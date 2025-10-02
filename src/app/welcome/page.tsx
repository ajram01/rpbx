import Button from "../components/Button";
import Image from "next/image";

// src/app/welcome/page.tsx
export default async function Welcome() {
  // ...fetch the Stripe session here if you want to show plan info...
  // DO NOT redirect if user is not logged in—show CTA instead.
  return (
    <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-center min-h-screen justify-center lg:py-10">
    <div className=" bg-white mx-auto max-w-lg lg:min-w-[500px] p-6 my-5 rounded-xl border border-neutral-200 shadow text-center">

          <Image
            src="/images/logos/Rio-Plex-Logo-Main-Mint-&-Charcoal.png"
            alt="Investors and Business Owners"
            width={2000}
            height={450}
            className="w-full h-auto"
            priority
          />

      <h1 className="text-2xl font-semibold pt-10">Welcome to RPBX!</h1>
      <p className="mt-2 text-neutral-600">
         We’ve saved your purchase. Sign in to complete setup.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <Button className="w-full" href="/login?next=/onboarding/business/basics">Sign in to Continue</Button>
      </div>
    </div>
    </div>
  )
}