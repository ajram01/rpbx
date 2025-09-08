import Navbar from "../components/Navbar";
import Navbar2 from "../components/Navbar-2";
import Button from "../components/Button";
import Link from 'next/link';
import Image from 'next/image';
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
          <div className="gap-5 flex flex-row">
            {/* Blog */}
            <div className="flex flex-col w-1/3 bg-white rounded-lg shadow-lg border-2 border-grey-500">
                <div
                className="rounded-t-lg w-full h-[250px] bg-cover bg-center"
                style={{ backgroundImage: 'url("/images/blogs/2025/sep-2025-1.png")' }}>
                </div>

                <div className="flex flex-col p-5 gap-2">
                    <h4 className="large">Business Opportunity: Why the Rio Grande Valley Is a Hotspot for Emerging Entrepreneurs</h4>
                    <span className="flex flex-row gap-3"><p className="text-grey flex">September 1, 2025</p> <p>•</p> <p className="text-grey flex">3 min read</p></span>
                    <Link href="/" className="green-link">Read More</Link>
                </div>
            </div>

            {/* Blog */}
            <div className="flex flex-col w-1/3 bg-white rounded-lg shadow-lg border-2 border-grey-500">
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
            <div className="flex flex-col w-1/3 bg-white rounded-lg shadow-lg border-2 border-grey-500">
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

        </div>
      </div>
    </div>
  );
}
