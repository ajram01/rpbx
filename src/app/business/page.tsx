import Image from "next/image";
import Link from "next/link";
import NavGate from "../components/NavGate";
import Button from "../components/Button";
import AuthForm from "../../components/AuthForm";
import Modal from "@/app/components/Modal";
import CardCarousel from "../components/Card-carousel";
import VideoSection from "../components/VideoSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Business Accounts | RioPlex Business Exchange",
  description: "Connecting Local Business Owners With Investors"
};



export default async function Business() {

  return (
    <div>
      {/* Div 1: 2 rows */}
      <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-center">
        <div>
          <NavGate />
        </div>

        {/* Buy A Business */}
        <div className="flex flex-col lg:flex-row py-10 lg:py-0">
          <div className="flex-1 flex justify-center lg:justify-end items-center px-4 lg:p-[15px] order-2 lg:order-1">
            <div className="flex flex-col items-center w-full lg:w-[560px] max-w-lg">
              <h1 className="text-center">Secure Your Legacy.<br /> Attract Investors.</h1>

              <AuthForm />
            </div>
          </div>

          <div className="flex-1 lg:order-2 hidden lg:block">
            <Image
              src="/images/header/business-header.png"
              alt="Investors and Business Owners"
              width={2000}
              height={450}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>

      {/* Div 2: How It Works */}
      <div className="bg-[url('/images/backgrounds/black-bg.png')] bg-cover bg-center bg-fixed lg:bg-fixed flex justify-center py-10">
        <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 lg:gap-x-10 w-full lg:w-[1140px] px-4 lg:px-0">

          <div className="flex-1 flex flex-col">
            <h2 className="text-white">How It Works</h2>

            <div className="flex flex-col gap-6 mt-10">
              <div className="flex flex-row">
                <div className="flex items-center justify-center min-w-12 max-h-12 bg-[#61BD9C] rounded-full mr-4">
                  <h4 className="text-white">1</h4>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-white">Select Your Package</h4>
                  <p className="text-white pt-2">Choose to advertise your business and subscribe monthly, or save 20% when you subscribe annually.</p>
                </div>
              </div>

              <div className="flex flex-row">
                <div className="flex items-center justify-center min-w-12 max-h-12 bg-[#61BD9C] rounded-full mr-4">
                  <h4 className="text-white">2</h4>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-white">Create Your Listing</h4>
                  <p className="text-white pt-2">Add as much information as you like, including photos and other documents, in our easy to use listing builder.</p>
                </div>
              </div>

              <div className="flex flex-row">
                <div className="flex items-center justify-center min-w-12 max-h-12 bg-[#61BD9C] rounded-full mr-4">
                  <h4 className="text-white">3</h4>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-white">Review Your Interested Buyers</h4>
                  <p className="text-white pt-2">Buyers will contact you directly through the information you input on your listing.</p>
                </div>
              </div>
            </div>
  
          </div>

          <div className="bg-white flex-1 flex flex-col items-center rounded-2xl p-5">
  
          </div>

        </div>
      </div>

      {/* Div 3: As An Investor */}
      <div className="flex flex-col items-center bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-top py-[15px]">

        <div className="w-full px-4 lg:w-[1140px] lg:px-0 mx-auto flex flex-col lg:flex-row gap-y-6 lg:gap-y-0 lg:gap-x-10 py-10">

          <div className="flex-1 flex flex-col items-center rounded-2xl">
              <Image
              src="/images/other/business-mockup.png"
              alt="Investors Feed"
              width={2000}
              height={450}
              className="w-full h-auto"
              priority
            />
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h3>As A Business Owner</h3>
            <p className="py-5">Discover potential investors who align with your business goals through our easy-to-use platform. Browse investor profiles, filter by industry and investment preferences, and connect with the right partners—all in one seamless dashboard.</p>
            <Button className="max-w-40">Get Started</Button>
          </div>

        </div>

        {/* Row 2 */}
        <div className="flex flex-col lg:flex-row gap-y-6 lg:gap-y-0 lg:gap-x-[15px] w-full pr-4 lg:pb-10">
          <div className="bg-white shadow-lg border-y-2 border-r-2 border-grey-500 flex-1 flex justify-center lg:justify-end rounded-tr-2xl rounded-br-2xl">
            <div className="flex flex-col items-start w-full lg:w-[560px] py-8 lg:py-10 px-6 lg:px-2">
              <h2>Get Your Business Valuation</h2>
              <p className="lg:pr-15  pt-1">
                 Know the true value of your business with a valuation powered by Biz Equity. RPBX members get 50% off their valuations, making it easier than ever to make informed decisions whether you’re planning to sell, grow, or invest.
              </p>
              <Link href="https://rioplexbizx.bizequity.com" target="_blank" ><Button className="mt-3 lg:mt-3 w-full sm:w-auto" variant="white">Get My Valuation</Button></Link>

              {/* Learn More button */}
              <Modal
                trigger={
                  <Button className="mt-3 lg:mt-3 w-full sm:w-auto" variant="white">Learn More</Button>
                }
              >
              <div className="space-y-2">
                <h2>Business Valuation</h2><br />
                  <h4>What is Business Valuation?</h4>
                  <p>
                    Business valuation is the process of determining what a company is worth. It’s a crucial step for any
                    business owner who’s looking to sell, merge, or even plan for future growth. Members save 50% on their valuation when they subscribe to RioPlex Business Exchange.
                  </p><br />

                  <h4>Key Components We Look At:</h4>
                  <ul className="list-disc list-outside pl-6">
                    <li><strong>Financials:</strong> We analyze the business’s revenue, profits, debts, and cash flow.</li>
                    <li><strong>Industry &amp; Market Trends:</strong> We look at how the market and competitors are performing. This helps gauge how well your business stands in the current landscape.</li>
                    <li><strong>Assets &amp; Liabilities:</strong> This includes tangible assets (like equipment) and intangible ones (like patents or brand reputation), as well as debts and other obligations.</li>
                    <li><strong>Operations &amp; Customers:</strong> How well does the business run? Is the customer base stable? Recurring revenue streams and efficient operations add more value.</li>
                  </ul><br />

                  <h4>How We Valuate:</h4>
                  <ul className="list-disc list-outside pl-6">
                    <li><strong>Comparable Company Analysis:</strong> We compare your business to others in your industry that have recently sold or are publicly traded.</li>
                    <li><strong>Discounted Cash Flow (DCF):</strong> We project future cash flow to find today’s value.</li>
                    <li><strong>Asset-Based Valuation:</strong> Sometimes it’s as simple as the assets minus liabilities.</li>
                  </ul><br />

                  <h4>Why It Matters:</h4>
                  <p>
                    A fair valuation helps sellers get the best price and buyers make smart investments. It’s all about knowing what your business is truly worth.
                  </p>

                  <p>
                    At RioPlex Business Exchange, we help make the process clear, accurate, and aligned with your goals, so whether you’re buying, selling, or planning for the future, you’ll have the right insights to move forward.
                  </p><br />

                  <Link href="/business"><Button className="mb-10 w-full max-w-[1000px]">Get My Valuation</Button></Link>
              </div>

              
              </Modal>

            </div>
          </div>

          <div className="flex-1 flex justify-center lg:justify-start">
            <div className="flex flex-col items-center text-center w-full lg:w-[560px] px-4 overflow-hidden">
              <CardCarousel />
            </div>
          </div>
        </div>

      </div>

      {/* Div 4: video */}
      <VideoSection videoUrl="https://www.youtube.com/embed/ZRSDJQO8ggA" />
    </div>
  );
}
