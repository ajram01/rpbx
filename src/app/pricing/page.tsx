import PricingTable from "../components/pricing-table"
import Accordion from '../../components/ui/accordion';
import Navbar from "../components/Navbar";
import Link from 'next/link';

export default async function PricingPage() {
  const dark = true;

  return (
    <div>
      <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-center min-h-[850px]">
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
      <div className="flex flex-col items-center bg-[url('/images/backgrounds/black-mint-bg.png')] bg-cover bg-center bg-fixed py-10">
        <div className="w-full  overflow-hidden lg:w-[1140px] lg:min-h-[300px] px-3 lg:px-0">
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
                Subscriptions are valid for one year from the date of purchase. You will receive a renewal reminder before your subscription expires. 
                To renew, simply follow the instructions in the reminder email or visit your account settings on the platform. 
                You also have the option when registering to automatically set your membership to renew.
              </p>
            </Accordion>

            <Accordion title="What is the refund policy for RioPlex Business Exchange memberships?">
              <p>
                Membership fees are generally non-refundable. 
                However, if you experience issues with your subscription or believe there has been an error, 
                please contact our support team within 30 days of purchase. 
                We will review your case and consider refunds or adjustments on a case-by-case basis.
              </p>
            </Accordion>

            <Accordion title="How can I contact RioPlex Business Exchange?">
              <p>
                If you have any questions or concerns, please contact us at:
              </p><br/>
              <p>
                Phone: (956) 322-5942<br />
                Email: <Link href="mailto:info@rioplexbizx.com" className="green-link">info@rioplexbizx.com</Link><br />
                Mailing Address: 100 E. Nolana Ave. Suite 130 McAllen, TX 78504
              </p>
            </Accordion>
          </div>
        </div>
      </div>

    </div>
  )
}
