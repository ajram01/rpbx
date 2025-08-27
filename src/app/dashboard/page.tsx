import Navbar from "../components/Navbar-2";
import Button from "../components/Button";
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from "next";

import { createClient } from "@/../utils/supabase/server"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "User Dashboard | RioPlex Business Exchange",
  description: "Connecting Local Business Owners With Investors"
};


export default async function Dashboard() {

  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return redirect("/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user.id)
    .maybeSingle<{ first_name: string | null}>();
  if (error) {
    console.error("Error fetching profile: ", error.message);
  }

  const displayName =
    profile?.first_name ??
    (user.user_metadata?.first_name as string | undefined) ??
    user.email ??
    "User";

  return (
    <div>
      {/* Div 1: 2 rows */}
      <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-top">
        <div>
          <Navbar />
        </div>

        {/* listing stats */}
        <div className="flex flex-col w-full lg:w-[1140px] mx-auto py-10 gap-10 px-5 lg:px-0">
          <h1>Welcome back, {displayName}</h1>
          <p className="-mt-2">Here’s what’s happening in your business today.</p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 bg-white rounded-2xl">
            <div className="flex flex-col items-center p-5">
              <h3>2</h3>
              <p className="text-grey">Active Listings</p>
            </div>
            <div className="flex flex-col items-center p-5">
              <h3>14</h3>
              <p className="text-grey">Investor Views</p>
            </div>
            <div className="flex flex-col items-center p-5">
              <h3>3</h3>
              <p className="text-grey">Interests</p>
            </div>
            <div className="flex flex-col items-center p-5">
              <h3>1</h3>
              <p className="text-grey">Pending Update</p>
            </div>
          </div>

          {/* buttons */}
          <div className="flex flex-col lg:flex-row gap-5">
            <Link
              href="/"
              className="flex-1 flex flex-col items-center p-5 bg-[#60A1BC] rounded-2xl hover:opacity-90 transition"
            >
              <p className="text-white">Update Listing Info</p>
            </Link>
            <Link
              href="/"
              className="flex-1 flex flex-col items-center p-5 bg-[#60BC9B] rounded-2xl hover:opacity-90 transition"
            >
              <p className="text-white">Request Valuation</p>
            </Link>
            <Link
              href="/"
              className="flex-1 flex flex-col items-center p-5 bg-[#E79F3C] rounded-2xl hover:opacity-90 transition"
            >
              <p className="text-white">Promote Listing</p>
            </Link>
          </div>

          {/* activity */}
          <div className="flex flex-col lg:flex-row gap-5 w-full pb-70">
            <div className="w-full lg:w-[60%] rounded-2xl flex flex-col bg-[url('/images/backgrounds/black-bg.png')] bg-cover bg-center p-5">
              <h3 className="text-white pb-5">Recent Activity</h3>
              <ul className="list-disc list-inside space-y-2">
                <li className="text-white">
                  John S. viewed your listing &quot;RGV Logistics&quot;
                </li>
                <li className="text-white">New message from Investor Carla D.</li>
                <li className="text-white">Your listing was updated 2 days ago</li>
              </ul>
            </div>

            <div className="w-full lg:w-[40%] bg-white rounded-2xl p-5">
              <h3 className="pb-5">Upcoming Events</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Founders Expo – Nov 5</li>
                <li>Business Pitch Night – Nov 12</li>
                <li>Webinar: Financial Readiness – Nov 18</li>
                <li>Apply to Speak: Innovation Series – Rolling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Investor Matches Section */}
      <div className="bg-purple-300 flex flex-col items-center bg-[url('/images/backgrounds/black-mint-bg.png')] bg-cover bg-center bg-fixed py-10">
        <div className="relative -mt-80 w-full px-5 lg:px-0">
          <div className="bg-white flex flex-col w-full lg:w-[1140px] mx-auto rounded-2xl p-10">
            <h2 className="pb-5">Investor Matches</h2>

            {/* Investors grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-5 ">
                {[...Array(4)].map((_, i) => (
                <div key={i} className="flex-1 ">
                    <Image
                    src="/images/test/chen-lee.png"
                    alt="Investor Avatar"
                    className="rounded-t-lg w-full shadow-lg border-x-2 border-t-2 border-grey-500"
                    width={200}
                    height={100}
                    />
                    <div className="bg-[#F3F3F3] p-5 rounded-b-lg shadow-lg border-x-2 border-b-2 border-grey-500">
                    <h4>Chen Lee</h4>
                    <p className="italic">Tech, Media, Real Estate</p>
                    <Button className="mt-3 w-full">View Profile</Button>
                    </div>
                </div>
                ))}
            </div>
          </div>
        </div>

        {/* resources */}
        <div className="w-full px-5 lg:px-0">
            <div className="bg-white flex flex-col w-full lg:w-[1140px] mx-auto rounded-2xl p-10 mt-10">
            <h2 className="pb-5">Resources</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-5">
                <div className="bg-[#F3F3F3] rounded-2xl p-5">
                <h4 className="pb-1">Blog: Writing a Strong Listing</h4>
                <p>Crafting a listing that stands out.</p>
                <Link href="/" className="blue-link">
                    Read More
                </Link>
                </div>
                <div className="bg-[#F3F3F3] rounded-2xl p-5">
                <h4 className="pb-1">Guide: Due Diligence Checklist</h4>
                <p>Prepare for investor review.</p>
                <Link href="/" className="green-link">
                    Download PDF
                </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-[#F3F3F3] rounded-2xl p-5">
                <h4 className="pb-1">Blog: Writing a Strong Listing</h4>
                <p>Crafting a listing that stands out.</p>
                <Link href="/" className="blue-link">
                    Read More
                </Link>
                </div>
                <div className="bg-[#F3F3F3] rounded-2xl p-5">
                <h4 className="pb-1">Guide: Due Diligence Checklist</h4>
                <p>Prepare for investor review.</p>
                <Link href="/" className="green-link">
                    Download PDF
                </Link>
                </div>
            </div>

            <Button className="mt-5">View More Resources</Button>
            </div>
        </div>
      </div>
    </div>
  );
}
