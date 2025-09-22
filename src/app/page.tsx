import Image from "next/image";
import Navbar from "./components/Navbar";
import Button from "./components/Button";
import Modal from "./components/Modal"; // client modal
import { createClientRSC } from "@/../utils/supabase/server"
import { redirect } from "next/navigation"
import PricingTable from "./components/pricing-table";
import NewsletterSignup from "../components/ui/newsletter";
import Carousel from "../components/ui/carousel";

export default async function Home() {
  const supabase = await createClientRSC();
  
  // Use getSession instead of getUser for better performance
  const { data: { session }, error } = await supabase.auth.getSession();
  
  // Only log non-authentication errors
  if (error && error.message !== 'Auth session missing!' && error.status !== 400) {
    console.error('Unexpected auth error:', error);
  }
  
  // Redirect if user is authenticated
  if (session?.user) {
    return redirect("/dashboard");
  }
    
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
      <PricingTable/>
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
          <div className="bg-white shadow-lg border-y-2 border-r-2 border-grey-500 flex-1 flex justify-center lg:justify-end rounded-tr-2xl rounded-br-2xl">
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
              <Carousel />
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="w-full lg:w-[1140px] px-4 lg:px-0 flex flex-col items-center py-10">
          <h2>Business Solutions</h2>
          <p>Connect with Our Trusted Advisors for Tailored Business Solutions</p>

          {/* four cols on desktop, two on tablet/mobile */}
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">

            {/* 1 */}
            <div className="flex flex-col items-center">
              <Modal
                trigger={
                  <Image
                      src="/images/gifs/evaluation.gif"
                      alt="solution-icon-1"
                      width={200}
                      height={200}
                  />
                }
              >
              <div className="space-y-2">
                <h2>Business Evaluation</h2><br />
                  <h4>What is Business Evaluation?</h4>
                  <p>
                    Business evaluation is the process of determining what a company is worth. It’s a crucial step for any
                    business owner who’s looking to sell, merge, or even plan for future growth.
                  </p><br />

                  <h4>Key Components We Look At:</h4>
                  <ul className="list-disc list-outside pl-6">
                    <li><strong>Financials:</strong> We analyze the business’s revenue, profits, debts, and cash flow.</li>
                    <li><strong>Industry &amp; Market Trends:</strong> We look at how the market and competitors are performing. This helps gauge how well your business stands in the current landscape.</li>
                    <li><strong>Assets &amp; Liabilities:</strong> This includes tangible assets (like equipment) and intangible ones (like patents or brand reputation), as well as debts and other obligations.</li>
                    <li><strong>Operations &amp; Customers:</strong> How well does the business run? Is the customer base stable? Recurring revenue streams and efficient operations add more value.</li>
                  </ul><br />

                  <h4>How We Evaluate:</h4>
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
              </div>

              
              
              </Modal>
              <h4 className="text-center mt-2">Business Evaluation</h4>
            </div>

            {/* 2 */}
            <div className="flex flex-col items-center">
              <Modal
                trigger={
                  <Image
                      src="/images/gifs/marketing.gif"
                      alt="solution-icon-2"
                      width={200}
                      height={200}
                  />
                }
              >
              <div className="space-y-2">
                <h2>Marketing</h2><br />

                <h4>What is Marketing?</h4>
                <p>
                  Marketing is about getting your brand and message in front of the right people at the right time. 
                  It’s not just about advertising; it’s about understanding your audience, building relationships, 
                  and communicating the value of your business effectively.
                </p><br />

                <h4>Key Components of Effective Marketing:</h4>
                <ul className="list-disc list-outside pl-6">
                  <li><strong>Understanding Your Audience:</strong> Knowing who your customers are, what they need, and where they spend their time is crucial.</li>
                  <li><strong>Brand Identity & Messaging:</strong> Your brand should tell a story. Everything from your logo to your messaging should reflect your values and what makes your business unique.</li>
                  <li><strong>Multi-Channel Strategies:</strong> Using a mix of digital (social media, email, website) and traditional (print, events) channels helps you reach your audience wherever they are.</li>
                  <li><strong>Content Creation:</strong> Creating content that informs, entertains, or solves a problem is key to engaging potential customers.</li>
                  <li><strong>Analytics & Tracking:</strong> It’s important to measure results. Whether it’s tracking website visits or social media interactions, analyzing data helps improve future campaigns.</li>
                </ul><br />

                <h4>Why Marketing Matters:</h4>
                <p>
                  Marketing helps you stand out in a crowded marketplace, builds trust with your audience, and ultimately drives sales. 
                  The right marketing strategy not only attracts new customers but also nurtures existing relationships to keep your business growing.
                </p><br />

                <p>
                  At RioPlex Business Exchange, we tailor marketing solutions to your business needs, whether you’re just starting out 
                  or looking to expand your reach. Let’s create a strategy that makes your brand shine and brings in the customers you want!
                </p><br />
              </div>

              </Modal>
              <h4 className="text-center mt-2">Marketing</h4>
            </div>

            {/* 3 */}
            <div className="flex flex-col items-center">
              <Modal
                trigger={
                  <Image
                      src="/images/gifs/legal.gif"
                      alt="solution-icon-3"
                      width={200}
                      height={200}
                  />
                }
              >
              <div className="space-y-2">
                <h2>Legal Representation</h2><br />

                <h4>Protecting Your Interests in Every Transaction</h4>
                <p>
                  Navigating the sale of a business involves more than finding the right buyer — it requires a clear legal strategy 
                  to protect your interests, reduce risk, and ensure the transaction runs smoothly. From due diligence to contract 
                  negotiations, having a trusted legal advisor is essential.
                </p><br />

                <p>
                  At RPBX, we partner with experienced legal professionals to support sellers through every stage of the sale. 
                  That’s why we proudly feature John T. Wilson, a Texas-based attorney with a strong background in business 
                  and commercial law. His firm provides personalized legal support to entrepreneurs, ensuring each deal is 
                  legally sound and tailored to your goals.
                </p><br />

                <h4>Key Legal Services for Sellers:</h4>
                <ul className="list-disc list-outside pl-6">
                  <li><strong>Contract Drafting & Review:</strong> Ensure that all agreements are clearly written, legally enforceable, and aligned with your interests.</li>
                  <li><strong>Seller-Side Legal Representation:</strong> Receive guidance and protection throughout negotiations and at closing.</li>
                  <li><strong>Negotiation Support:</strong> Get expert help structuring fair and favorable terms.</li>
                  <li><strong>Legal Due Diligence:</strong> Identify and address potential legal risks before they become deal-breakers.</li>
                  <li><strong>Entity Structuring & Compliance:</strong> Make sure your business is set up and documented properly for a clean and efficient transaction.</li>
                </ul><br />
              </div>

              </Modal>
              <h4 className="text-center mt-2">Legal Representation</h4>
            </div>

            {/* 4 */}
            <div className="flex flex-col items-center">
              <Modal
                trigger={
                  <Image
                      src="/images/gifs/cpa.gif"
                      alt="solution-icon-4"
                      width={200}
                      height={200}
                  />
                }
              >
              <div className="space-y-2">
                <h2>Certified Public Accountant & Bookkeeping Assistant</h2><br />

                <h4>Your Financial Backbone</h4>
                <p>
                  A Certified Public Accountant (CPA) and Bookkeeping Assistant play a crucial role in managing a business’s finances. 
                  They ensure your financial records are accurate, up-to-date, and compliant with regulations, allowing you to make 
                  informed decisions and maintain a healthy financial status. While CPAs focus on complex financial tasks such as 
                  tax preparation, financial planning, and auditing, bookkeeping assistants handle the day-to-day tasks of recording 
                  transactions, managing accounts payable and receivable, and reconciling bank statements.
                </p><br />

                <h4>Key Roles & Responsibilities:</h4>
                <ul className="list-disc list-outside pl-6">
                  <li><strong>Financial Record Keeping:</strong> The Bookkeeping Assistant maintains accurate and organized financial records, tracking income, expenses, and all other transactions.</li>
                  <li><strong>Tax Preparation & Compliance:</strong> A CPA ensures your business complies with tax laws, preparing and filing taxes accurately while finding potential deductions and credits.</li>
                  <li><strong>Budgeting & Forecasting:</strong> CPAs help create budgets and financial projections, allowing you to plan effectively for growth, expenses, and future investments.</li>
                  <li><strong>Financial Reporting & Analysis:</strong> Both roles work together to produce financial reports, analyze performance, and identify areas of financial improvement or risk.</li>
                  <li><strong>Payroll Management:</strong> The Bookkeeping Assistant can help manage payroll processes, ensuring employees are paid on time and accurately.</li>
                </ul><br />

                <h4>Why CPAs & Bookkeeping Assistants Matter:</h4>
                <p>
                  Having a CPA and Bookkeeping Assistant on your team ensures that your finances are managed efficiently and strategically. 
                  From staying compliant with tax laws to tracking daily transactions, they help your business make sound financial decisions, 
                  mitigate risks, and set a strong foundation for growth.
                </p><br />

                <p>
                  At RioPlex Business Exchange, we provide financial expertise through qualified CPAs and bookkeeping assistants to support 
                  your business’s financial health and growth strategy. Reach out to streamline your financial operations and make your numbers 
                  work for you!
                </p><br />
              </div>

              </Modal>
              <h4 className="text-center mt-2">Certified Public Accountant &amp; Book Keeping Assistant</h4>
            </div>

          </div>
        </div>
      </div>

      {/* Div 4: 1 div */}
      <NewsletterSignup />

    </div>
  );
}
