import Navbar from "../components/Navbar-2";
import Button from "../components/Button";
import Image from 'next/image';
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Listings | RioPlex Business Exchange",
  description: "Connecting Local Business Owners With Investors"
};

export default async function Businesses() {
  return (
    <div>
      {/* Background and Navbar */}
      <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-top min-h-screen">
        <Navbar />

        {/* Content Wrapper */}
        <div className="w-full lg:w-[1140px] mx-auto py-10 gap-10 px-5 lg:px-0">
          {/* Page Title & Description */}
          <h1 className="text-3xl font-bold text-center pb-15">Business Owners</h1>


          {/* Main Two-Column Layout */}
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* LEFT SIDE - Filters */}
            <div className="w-full lg:w-1/4 bg-white p-5 rounded-lg shadow-md h-fit">
              
              {/* Categories */}
              <div className="mb-5 max-h-52 overflow-y-auto pr-2">
                <p className="font-medium mb-2">Categories</p>
                <ul className="space-y-2 text-md">
                  <li><input type="radio" name="category" /> All Categories</li>
                  <li><input type="radio" name="category" /> Technology</li>
                  <li><input type="radio" name="category" /> Retail</li>
                  <li><input type="radio" name="category" /> Food & Beverage</li>
                  <li><input type="radio" name="category" /> Finance</li>
                  <li><input type="radio" name="category" /> Manufacturing</li>
                  <li><input type="radio" name="category" /> Home Services</li>
                  {/* Add more as needed */}
                </ul>
              </div>

              {/* Dropdown Filters */}
              <div className="mb-4">
                <label className="block mb-1 text-md">Annual Revenue</label>
                <select className="w-full border rounded px-2 py-1 text-md">
                  <option>-</option>
                  <option>100K - 250K</option>
                  <option>250K - 500K</option>
                  <option>500K+</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-md">Company EBITDA</label>
                <select className="w-full border rounded px-2 py-1 text-md">
                  <option>-</option>
                  <option>50K - 100K</option>
                  <option>100K+</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-md">Years in Business</label>
                <select className="w-full border rounded px-2 py-1 text-md">
                  <option>-</option>
                  <option>0-5</option>
                  <option>5-10</option>
                  <option>10+</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-md">Number of Employees</label>
                <input type="text" className="w-full border rounded px-2 py-1 text-md" />
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-md">County Business is Located In</label>
                <input type="text" className="w-full border rounded px-2 py-1 text-md" />
              </div>
                <Button className="mt-3 w-full">Filter</Button>
            </div>

            {/* RIGHT SIDE - Listings */}
            <div className="flex-1">
              {/* Header with Sort */}
              <div className="flex justify-between items-center mb-5">
                <p>Showing 1-3 of 3 results</p>
                <div>
                  <label className="text-md mr-2">Sort by</label>
                  <select className="border rounded px-2 py-1 text-md bg-white">
                    <option>Date</option>
                    <option>Revenue</option>
                    <option>EBITDA</option>
                  </select>
                </div>
              </div>

              {/* Business Listings Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden border">
                    <Image
                      src="/images/businesses/home-services.jpg"
                      alt="Business"
                      className="w-full h-40 object-cover"
                      width={300}
                      height={200}
                    />
                    <div className="p-5">
                      <h4>Home Services</h4>

                      <div className="flex justify-between mt-2">
                        <div>
                          <p>Annual Revenue</p>
                          <p >250K - 500K</p>
                        </div>
                        <div>
                          <p>Company EBITDA</p>
                          <p>50K - 100K</p>
                        </div>
                      </div>

                      <div className="flex items-center mt-3 text-sm text-gray-600">
                        <Image
                          src="/images/icons/location.png"
                          alt="Location"
                          className="w-4 h-4 mr-2"
                          width={16}
                          height={16}
                        />
                        <p>Cameron County</p>
                      </div>

                      <Link href="business-listing/listing" target="_blank">
                        <Button className="mt-4 w-full">View Business</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
