import Image from "next/image";
import Navbar from "./components/Navbar";
import Button from "./components/Button";


export default async function Home() {

  return (
    <div>
      {/* Div 1: 2 rows */}
      <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-center">
        <div>
          <Navbar />
        </div>

        {/* row becomes column on tablet/mobile */}
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 flex justify-center lg:justify-end items-center px-4 lg:p-[15px] order-2 lg:order-1">
            <div className="flex flex-col items-center w-full lg:w-[560px] max-w-lg">
              <h1 className="text-center">Unlock Your Business Potential</h1>

              <input
                type="email"
                placeholder="Email"
                className="mt-5 w-full px-6 py-2 rounded-full font-medium bg-white"
              />
              <button className="mt-5 w-full px-6 py-2 rounded-full font-medium transition bg-white hover:bg-[var(--color-primary)] text-black">
                Sign In
              </button>

              <p className="mt-5 text-center">
                By clicking Continue to join or sign in, you agree to RioPlex’s User Agreement, Privacy Policy, and Cookie Policy.
              </p>
              <p className="mt-5 text-center">New to RioPlex? Join Now</p>
            </div>
          </div>

          <div className="flex-1 order-1 lg:order-2">
            <Image
              src="/images/header/home-header.png"
              alt="Investors and Business Owners"
              width={2000}
              height={450}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>

      {/* Div 2: 1 div containing 3 div columns */}
      <div className="bg-[url('/images/backgrounds/black-bg.png')] bg-cover bg-center bg-fixed lg:bg-fixed flex justify-center py-10">
        <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-y-0 lg:gap-x-[15px] w-full lg:w-[1140px] px-4 lg:px-0">
          <div className="bg-white flex-1 flex flex-col items-center min-h-[500px] rounded-2xl p-5">
            <p className="font-semibold">Business Owner Lite</p>
            <h3>Free</h3>
            <p className="text-grey">Access</p>
            <ul className="list-image-[url(/images/icons/circle-mint.png)] pl-6 lg:pl-10 font-light space-y-2">
              <li>A Unique Opportunity for Local Entrepreneurs</li>
              <li>Comprehensive & Secure Space to Tell Your Story</li>
              <li>Connecting You with a Community of Investors</li>
              <li>Supporting Your Business’s Growth at Every Stage</li>
              <li>Maximizing Visibility & Achieving Strategic Goals</li>
            </ul>
            <ul className="list-image-[url(/images/icons/circle-grey.png)] pl-6 lg:pl-10 font-light space-y-2">
              <li className="text-grey">View Comprehensive Profiles of Interested Investors</li>
              <li className="text-grey">Directly Connect with Potential Investors</li>
            </ul>

            <Button className="mt-5 w-full lg:w-auto" variant="charcoal">Get Started</Button>
          </div>

          <div className="bg-white flex-1 flex flex-col items-center min-h-[500px] rounded-2xl p-5">
            <p className="font-semibold">Business Owner Legacy</p>
            <h3>$34</h3>
            <p className="text-grey">Per Month</p>
            <ul className="list-image-[url(/images/icons/circle-mint.png)] pl-6 lg:pl-10 font-light space-y-2">
              <li>A Unique Opportunity for Local Entrepreneurs</li>
              <li>Comprehensive & Secure Space to Tell Your Story</li>
              <li>Connecting You with a Community of Investors</li>
              <li>Supporting Your Business’s Growth at Every Stage</li>
              <li>Maximizing Visibility & Achieving Strategic Goals</li>
              <li>View Comprehensive Profiles of Interested Investors</li>
              <li>Directly Connect with Potential Investors</li>
            </ul>

            <Button className="mt-5 w-full lg:w-auto" variant="charcoal">Get Started</Button>
          </div>

          <div className="bg-white flex-1 flex flex-col items-center min-h-[500px] rounded-2xl p-5">
            <p className="font-semibold">Investor Plan</p>
            <h3>$76</h3>
            <p className="text-grey">Per Month</p>
            <ul className="list-image-[url(/images/icons/circle-mint.png)] pl-6 lg:pl-10 font-light space-y-2">
              <li>Join a Network of Forward-Thinking Investors</li>
              <li>Comprehensive Insights at Your Fingertips</li>
              <li>Align Your Investments with Your Financial Goals</li>
              <li>Discover Exclusive Opportunities Before They Hit the Market</li>
              <li>Unlock Full Access to Detailed Business Listings</li>
              <li>Directly Connect with Verified Business Owners</li>
              <li>Stay Informed with Tailored Notifications for Your Business Interests</li>
            </ul>

            <Button className="mt-5 w-full lg:w-auto" variant="charcoal">Get Started</Button>
          </div>
        </div>
      </div>

      {/* Div 3: 3 rows */}
      <div className="flex flex-col items-center bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-top py-[15px]">
        {/* Row 1 */}
        <div className="w-full px-4 lg:w-[1140px] lg:px-0 mx-auto flex flex-col lg:flex-row gap-y-6 lg:gap-y-0 lg:gap-x-[45px] py-10">
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="flex flex-col items-start w-full lg:w-[430px] max-w-lg">
              <h2>Explore our Blog topics</h2>
              <p>RPBX is here to offer you valuable knowledge. We will help guide you in making your next steps.</p>
            </div>
          </div>
          <div className="flex-1 flex justify-center lg:justify-start">
            <div className="flex flex-col items-center w-full lg:w-[660px]">
              <div className="flex flex-wrap gap-3 lg:gap-4 justify-center lg:justify-start">
                <Button variant="white">Selling a Business</Button>
                <Button variant="white">Business Valuation</Button>
                <Button variant="white">Confidentiality</Button>
                <Button variant="white">Strategy</Button>
                <Button variant="white">Operations</Button>
                <Button variant="white">Buying a Business</Button>
                <Button variant="white">RPBX</Button>
                <Button variant="white">Successful Planning</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col lg:flex-row gap-y-6 lg:gap-y-0 lg:gap-x-[15px] w-full pr-4">
          <div className="bg-white shadow-md flex-1 flex justify-center lg:justify-end rounded-tr-2xl rounded-br-2xl">
            <div className="flex flex-col items-start w-full lg:w-[560px] py-8 lg:py-10 px-6 lg:px-0">
              <h2>Who is RPBX for?</h2>
              <p className="lg:pr-15">
                Connecting small business owners with the right investors to help them grow, succeed, and achieve their goals. Join RioPlex Business Exchange and be part of a platform built for ambitious businesses and forward-thinking investors.
              </p>
              <Button className="mt-3 lg:mt-2 w-full sm:w-auto" variant="white">Looking for an Investor</Button>
              <Button className="mt-3 lg:mt-2 w-full sm:w-auto" variant="white">Looking to Invest</Button>
            </div>
          </div>

          <div className="flex-1 flex justify-center lg:justify-start">
            <div className="flex flex-col items-center text-center w-full lg:w-[560px] px-4">
              <h3 className="giant">2.3M</h3>
              <h4>Bussineses at stake</h4>
              <p className="mt-3 w-full lg:w-[500px]">
                In the United States, baby boomers own approximately 40% of small businesses, translating to around 2.3 million businesses. As this generation approaches retirement, many companies will be sold or closed. This transition could impact millions of jobs and represent a significant shift in business ownership over the next decade
              </p>
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="w-full lg:w-[1140px] px-4 lg:px-0 flex flex-col items-center py-10">
          <h2>Business Solutions</h2>
          <p>Connect with Our Trusted Advisors for Tailored Business Solutions</p>

          {/* four cols on desktop, two on tablet/mobile */}
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <div className="flex flex-col items-center">
              <Image
                src="/images/icons/solution-icon-1.png"
                alt="solution-icon-1"
                width={200}
                height={200}
                className="w-full h-auto"
              />
              <h4 className="text-center mt-2">Business Evaluation</h4>
            </div>
            <div className="flex flex-col items-center">
              <Image
                src="/images/icons/solution-icon-2.png"
                alt="solution-icon-2"
                width={200}
                height={200}
                className="w-full h-auto"
              />
              <h4 className="text-center mt-2">Marketing</h4>
            </div>
            <div className="flex flex-col items-center">
              <Image
                src="/images/icons/solution-icon-3.png"
                alt="solution-icon-3"
                width={200}
                height={200}
                className="w-full h-auto"
              />
              <h4 className="text-center mt-2">Legal Representation</h4>
            </div>
            <div className="flex flex-col items-center">
              <Image
                src="/images/icons/solution-icon-4.png"
                alt="solution-icon-4"
                width={200}
                height={200}
                className="w-full h-auto"
              />
              <h4 className="text-center mt-2">Certified Public Accountant &amp; Book Keeping Assistant</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Div 4: 1 div */}
      <div className="bg-purple-300 flex flex-col items-center bg-[url('/images/backgrounds/black-mint-bg.png')] bg-cover bg-center bg-fixed py-10">
        <div className="bg-white flex flex-col items-center w-full lg:w-[900px] min-h-[300px] rounded-2xl py-10 px-6 lg:px-20 mx-4">
          <h2>Unlock Your Growth with Expert Insights</h2>
          <p className="text-center">
            Join our monthly RPBX newsletter for exclusive resources, investor opportunities, and expert advice to fuel your business success. It’s free, insightful, and spam-free!
          </p>
          <input
            type="email"
            placeholder="Email"
            className="mt-5 w-full px-6 py-2 rounded-full font-medium bg-[#EDE2E2]"
          />
          <button className="mt-5 w-full px-6 py-2 rounded-full font-medium transition bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white">
            Sign In
          </button>
          <p className="mt-5 pt-2 border-t-2 border-[#A1A1A1] text-center">
            By submitting this form, you are consenting to receive marketing emails from: info@rioplexbizx.com. You can revoke your consent to receive emails at any time by using the SafeUnsubscribe® link, found at the bottom of every email. Emails are serviced by Constant Contact
          </p>
        </div>
      </div>
    </div>
  );
}
