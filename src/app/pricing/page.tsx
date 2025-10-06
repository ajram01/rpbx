import PricingTable from "../components/pricing-table"
import Navbar from "../components/Navbar";

export default async function PricingPage() {
  const dark = true;

  return (
    <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-center">
        <div>
          <Navbar />
        </div>
      <div className="mx-auto lg:w-[1140px] py-10 px-4 lg:px-0">
        <h1 className="text-3xl font-semibold text-center">Choose Your Plan</h1>
        <p className="mt-2 mb-8 text-sm text-neutral-500 text-center">
          Toggle between monthly and yearly billing. Free plans are always available.
        </p>

        <PricingTable dark={dark} />
      </div>
    </div>
  )
}
