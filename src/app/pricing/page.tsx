import PricingTable from "../components/pricing-table"

export default async function PricingPage() {

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
