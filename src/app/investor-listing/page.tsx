import Navbar from "../components/Navbar-2";
import Button from "../components/Button";
import Image from 'next/image';
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Investor Listings | RioPlex Business Exchange",
  description: "Connecting Local Business Owners With Investors"
};

export default async function Investors() {
  return (
    <div>
      {/* Background and Navbar */}
      <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-top">
        <div>
          <Navbar />
        </div>

        {/* Content Wrapper */}
        <div className="flex flex-col w-full lg:w-[1140px] mx-auto py-10 gap-10 px-5 lg:px-0">
          <h1 className="text-center">Investors</h1>

        {/* Search + Filter + Sort */}
        <div className="flex flex-col gap-4 mt-4">
            {/* Search Bar + Button (Full Width) */}
            <div className="relative w-full">
            <input
                type="text"
                placeholder="Search investors..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none bg-white"
            />
            <button className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-blue-600">
                {/* Magnifying Glass Icon (Heroicons or your own SVG) */}
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
                >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
            </button>
        </div>

        {/* Filter and Sort (Right Aligned, Not Full Width) */}
        <div className="flex justify-end gap-4">
            <select className="w-40 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm">
            <option value="">Filter</option>
            <option value="tech">Tech</option>
            <option value="real-estate">Real Estate</option>
            <option value="media">Media</option>
            </select>

            <select className="w-40 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm">
            <option value="recent">Sort: Recent</option>
            <option value="name">Sort: Name</option>
            <option value="industry">Sort: Industry</option>
            </select>
        </div>
        </div>



          {/* Investors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-5 pt-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex-1">
                <Image
                  src="/images/test/chen-lee.png"
                  alt="Investor Avatar"
                  className="rounded-t-lg w-full shadow-lg border-x-2 border-t-2 border-grey-500"
                  width={200}
                  height={100}
                />
                <div className="bg-white p-5 rounded-b-lg shadow-lg border-x-2 border-b-2 border-grey-500">
                  <h4 className="large">Chen Lee</h4>
                  <p className="italic text-md text-gray-600">Tech, Media, Real Estate</p>
                    <Link href="investor-listing/profile" target="_blank">
                        <Button className="mt-4 w-full">View Profile</Button>
                    </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button className="text-gray-600 hover:text-black">&laquo; Previous</button>
            <p>Page 1 of 4</p>
            <button className="text-gray-600 hover:text-black">Next &raquo;</button>
          </div>


        </div>
      </div>
    </div>
  );
}
