// app/pricing/page.tsx
import PricingTable from "../components/pricing-table";
import Accordion from "../../components/ui/accordion";
import NavGate from "../components/NavGate";
import Link from "next/link";
import { createClientRSC } from "@/../utils/supabase/server";

export default async function PricingPage() {
  const supabase = await createClientRSC();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const dark = true;

  return (
    <div>
      <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-center min-h-[850px]">
        <div>
          <NavGate />
        </div>
        <div className="mx-auto lg:w-[1140px] py-10 px-4 lg:px-0">
          <h1 className="text-3xl font-semibold text-center">Choose Your Plan</h1>
          <p className="mt-2 mb-8 text-sm text-neutral-500 text-center">
            Toggle between monthly and yearly billing. Free plans are always available.
          </p>

          {/* Pass whether the user is logged in so the table can choose flow */}
          <PricingTable dark={dark} loggedIn={!!user} />
        </div>
      </div>

      <div className="flex flex-col items-center bg-[url('/images/backgrounds/black-mint-bg.png')] bg-cover bg-center bg-fixed py-10">
        <div className="w-full overflow-hidden lg:w-[1140px] lg:min-h-[300px] px-3 lg:px-0">
          <h2 className="text-white text-center mb-5">FAQ</h2>

          <div className="gap-5 flex flex-col">
            <Accordion title="Are there any additional costs beyond the subscription fees?">
              <p>
                No, the subscription fees cover all the features and services available through your membership.
                There are no additional costs for using the platform’s <b>core functions</b>.
              </p>
            </Accordion>

            <Accordion title="What do the Business Member and Investor Member subscriptions include?">
              <p>
                Business Member subscriptions allow you to list your business on our platform, access investor profiles, and manage your business profile.
                Investor Member subscriptions provide access to detailed business profiles, allowing you to evaluate investment opportunities and connect with business owners.
              </p>
            </Accordion>

            <Accordion title="What is the duration of the subscription, and how can I renew it?">
              <p>
                Subscriptions renew automatically based on your billing interval. You can manage or cancel any time from the Billing Portal in your dashboard.
              </p>
            </Accordion>

            <Accordion title="What is the refund policy for RioPlex Business Exchange memberships?">
              <p>
                Membership fees are generally non-refundable. If you experience an issue, contact support within 30 days and we’ll review it case-by-case.
              </p>
            </Accordion>

            <Accordion title="How can I contact RioPlex Business Exchange?">
              <p>If you have any questions or concerns, please contact us at:</p>
              <br />
              <p>
                Phone: (956) 322-5942<br />
                Email:{" "}
                <Link href="mailto:info@rioplexbizx.com" className="green-link">
                  info@rioplexbizx.com
                </Link>
                <br />
                Mailing Address: 100 E. Nolana Ave. Suite 130 McAllen, TX 78504
              </p>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
