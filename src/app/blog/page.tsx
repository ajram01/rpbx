import Navbar from "../components/Navbar";
import Navbar2 from "../components/Navbar-2";
import Link from 'next/link';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | RioPlex Business Exchange",
  description: "Connecting Local Business Owners With Investors"
};

export default function Events() {
    const isLoggedIn = false;    

  return (
    <div>
      {/* Div 1: 2 rows */}
      <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-top">
        <div>
            {isLoggedIn ? <Navbar /> : <Navbar2 />}
        </div>

        <div className="flex flex-col w-full lg:w-[1140px] mx-auto py-10 gap-10 px-5 lg:px-0">
          <h1 className="text-center">Blog</h1>

        {/* Blog row 1 */}
          <div className="gap-5 flex flex-col lg:flex-row">
            {/* Blog */}
            <div className="flex flex-col w-full lg:w-1/3 bg-white rounded-lg shadow-lg border-2 border-grey-500">
                <div
                className="rounded-t-lg w-full h-[250px] bg-cover bg-center"
                style={{ backgroundImage: 'url("/images/blogs/2025/sep-2025-1.png")' }}>
                </div>

                <div className="flex flex-col p-5 gap-2">
                    <h4 className="large">Business Opportunity: Why the Rio Grande Valley Is a Hotspot for Emerging Entrepreneurs</h4>
                    <span className="flex flex-row gap-3"><p className="text-grey flex">September 1, 2025</p> <p>•</p> <p className="text-grey flex">3 min read</p></span>
                    <Link href="/blog/business-opportunity-why-the-rio-grande-valley-is-a-hotspot-for-emerging-entrepreneurs" className="green-link">Read More</Link>
                </div>
            </div>

            {/* Blog */}
            <div className="flex flex-col w-full lg:w-1/3 bg-white rounded-lg shadow-lg border-2 border-grey-500">
                <div
                className="rounded-t-lg w-full h-[250px] bg-cover bg-center"
                style={{ backgroundImage: 'url("/images/blogs/2025/aug-2025-1.jpg")' }}>
                </div>

                <div className="flex flex-col p-5 gap-2">
                    <h4 className="large">Why South Texas Is a Hidden Gem for Business Buyers</h4>
                    <span className="flex flex-row gap-3"><p className="text-grey flex">August 4, 2025</p> <p>•</p> <p className="text-grey flex">3 min read</p></span>
                    <Link href="/" className="green-link">Read More</Link>
                </div>
            </div>

            {/* Blog */}
            <div className="flex flex-col w-full lg:w-1/3 bg-white rounded-lg shadow-lg border-2 border-grey-500">
                <div
                className="rounded-t-lg w-full h-[250px] bg-cover bg-center"
                style={{ backgroundImage: 'url("/images/blogs/2025/july-2025-1.jpg")' }}>
                </div>

                <div className="flex flex-col p-5 gap-2">
                    <h4 className="large">How to Know If You’re Ready to Sell Your Business: A Mid-Year Owner’s Checklist</h4>
                    <span className="flex flex-row gap-3"><p className="text-grey flex">July 1, 2025</p> <p>•</p> <p className="text-grey flex">4 min read</p></span>
                    <Link href="/" className="green-link">Read More</Link>
                </div>
            </div>
          </div>
        {/* End of Blog row 1 */}

        {/* Blog row 2 */}
          <div className="gap-5 flex flex-col lg:flex-row">
            {/* Blog */}
            <div className="flex flex-col w-full lg:w-1/3 bg-white rounded-lg shadow-lg border-2 border-grey-500">
                <div
                className="rounded-t-lg w-full h-[250px] bg-cover bg-center"
                style={{ backgroundImage: 'url("/images/blogs/2025/june-2025-1.jpg")' }}>
                </div>

                <div className="flex flex-col p-5 gap-2">
                    <h4 className="large">Why Summer Is a Smart Season to List Your Business for Sale</h4>
                    <span className="flex flex-row gap-3"><p className="text-grey flex">June 2, 2025</p> <p>•</p> <p className="text-grey flex">3 min read</p></span>
                    <Link href="/" className="green-link">Read More</Link>
                </div>
            </div>

            {/* Blog */}
            <div className="flex flex-col w-full lg:w-1/3 bg-white rounded-lg shadow-lg border-2 border-grey-500">
                <div
                className="rounded-t-lg w-full h-[250px] bg-cover bg-center"
                style={{ backgroundImage: 'url("/images/blogs/2025/may-2025-1.jpg")' }}>
                </div>

                <div className="flex flex-col p-5 gap-2">
                    <h4 className="large">How to Prepare for a Confidential Business Sale</h4>
                    <span className="flex flex-row gap-3"><p className="text-grey flex">May 2, 2025</p> <p>•</p> <p className="text-grey flex">3 min read</p></span>
                    <Link href="/" className="green-link">Read More</Link>
                </div>
            </div>

            {/* Blog */}
            <div className="flex flex-col w-full lg:w-1/3 bg-white rounded-lg shadow-lg border-2 border-grey-500">
                <div
                className="rounded-t-lg w-full h-[250px] bg-cover bg-center"
                style={{ backgroundImage: 'url("/images/blogs/2025/april-2025-1.jpg")' }}>
                </div>

                <div className="flex flex-col p-5 gap-2">
                    <h4 className="large">Spring Clean Your Business Finances: Steps to Prepare for a Future Sale</h4>
                    <span className="flex flex-row gap-3"><p className="text-grey flex">April 1, 2025</p> <p>•</p> <p className="text-grey flex">4 min read</p></span>
                    <Link href="/" className="green-link">Read More</Link>
                </div>
            </div>
          </div>
        {/* End of Blog row 2 */}

        </div>
      </div>

       {/* Newsletter */}
      <div className="bg-purple-300 flex flex-col items-center bg-[url('/images/backgrounds/black-mint-bg.png')] bg-cover bg-center bg-fixed py-10">
        <div className="bg-white flex flex-col items-center w-full lg:w-[900px] min-h-[300px] rounded-2xl py-10 px-6 lg:px-20 mx-4 shadow-lg border-2 border-grey-500">
          <h2 className="sm: text-center mb-2">Unlock Your Growth with Expert Insights</h2>
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
