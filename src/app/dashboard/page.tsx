// app/dashboard/page.tsx
export const revalidate = 0;

import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClientRSC } from "@/../utils/supabase/server";

import RecentActivityList from "./_components/RecentActivity";
import UpcomingEventsList from "./_components/UpcomingEvents";
import MatchedBusinesses from "./_components/MatchedBusinesses";
import MatchedInvestors from "./_components/MatchedInvestors";

import NavGate from "../components/NavGate";

import {
  getBusinessDashboardData,
  type BusinessDashboardData,
} from "@/lib/dashboard/getBusinessDashboardData";

import {
  getInvestorDashboardData,
  type InvestorDashboardData,
} from "@/lib/dashboard/getInvestorDashboardData";

export const metadata: Metadata = {
  title: "User Dashboard | RioPlex Business Exchange",
  description: "Connecting Local Business Owners With Investors",
};

type DashboardData = BusinessDashboardData | InvestorDashboardData;

export default async function Dashboard() {
  // Ensure createClientRSC returns SupabaseClient<Database> so no `as any` is needed
  const supabase = await createClientRSC();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("user_type, first_name")
    .eq("id", user.id)
    .maybeSingle<{ first_name: string | null; user_type: "business" | "investor" | "admin" | null }>();

  const userType = profile?.user_type ?? "business";

  const displayName =
    profile?.first_name ??
    (user.user_metadata?.first_name as string | undefined) ??
    user.email ??
    "User";

  const dashboardData: DashboardData =
    userType === "business"
      ? await getBusinessDashboardData(supabase, user.id)
      : await getInvestorDashboardData(supabase, user.id);

  return (
    <div>
      {/* Header / Hero */}
      <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-top">
        <NavGate />

        <div className="flex flex-col w-full lg:w-[1140px] mx-auto py-10 gap-10 px-5 lg:px-0 pb-40 md:pb-52">
          <h1>Welcome back, {displayName}</h1>
          <p className="-mt-2">Here’s what’s happening in your business today.</p>

          {/* Action buttons */}
          <div className="flex flex-col lg:flex-row gap-5">
            <Link
              href={userType === "business" ? "/owner/listings" : "/listings"}
              className="flex-1 flex flex-col items-center p-5 bg-[#60A1BC] rounded-2xl hover:opacity-90 transition"
            >
              <p className="text-white">
                {userType === "business" ? "Update Listing Info" : "Browse Listings"}
              </p>
            </Link>
            <Link
              href={userType === "business" ? "/valuation" : "/listings/saved"}
              className="flex-1 flex flex-col items-center p-5 bg-[#60BC9B] rounded-2xl hover:opacity-90 transition"
            >
              <p className="text-white">
                {userType === "business" ? "Request Valuation" : "Saved Listings"}
              </p>
            </Link>
            <Link
              href={userType === "business" ? "/promote" : "/profile/edit"}
              className="flex-1 flex flex-col items-center p-5 bg-[#E79F3C] rounded-2xl hover:opacity-90 transition"
            >
              <p className="text-white">
                {userType === "business" ? "Promote Listing" : "Edit Profile"}
              </p>
            </Link>
          </div>

          {/* Activity + Events */}
          <div className="flex flex-col lg:flex-row gap-5 w-full pb-[70px]">
            <div className="w-full lg:w-[60%] rounded-2xl flex flex-col bg-[url('/images/backgrounds/black-bg.png')] bg-cover bg-center p-5">
              <h3 className="text-white pb-5">Recent Activity</h3>
              <RecentActivityList items={dashboardData.activities} />
            </div>

            <div className="w-full lg:w-[40%] bg-white rounded-2xl p-5">
              <h3 className="pb-5">Upcoming Events</h3>
              <UpcomingEventsList events={dashboardData.events} />
            </div>
          </div>
        </div>
      </div>

      {/* Matches Section */}
      <div className="bg-purple-300 flex flex-col items-center bg-[url('/images/backgrounds/black-mint-bg.png')] bg-cover bg-center md:bg-fixed py-10">
        <div className="relative -mt-40 md:-mt-52 mb-[-48px] z-10 w-full px-5 lg:px-0">
          <div className="bg-white flex flex-col w-full lg:w-[1140px] mx-auto rounded-2xl p-10 shadow-xl">
            <h2 className="pb-5">
              {userType === "business" ? "Investor Matches" : "Business Matches"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pb-5">
              {dashboardData.kind === "business" ? (
                <MatchedInvestors matches={dashboardData.matches} />
              ) : (
                <MatchedBusinesses matches={dashboardData.matches} />
              )}
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="bg-white flex flex-col w-full lg:w-[1140px] mx-auto rounded-2xl p-10 mt-30">
          <h2 className="pb-5">Resources</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pb-5">
            <div className="bg-[#F3F3F3] rounded-2xl p-5">
              <h4 className="pb-1">Blog: Writing a Strong Listing</h4>
              <p>Crafting a listing that stands out.</p>
              <Link href="/" className="blue-link">Read More</Link>
            </div>
            <div className="bg-[#F3F3F3] rounded-2xl p-5">
              <h4 className="pb-1">Guide: Due Diligence Checklist</h4>
              <p>Prepare for investor review.</p>
              <Link href="/" className="green-link">Download PDF</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-[#F3F3F3] rounded-2xl p-5">
              <h4 className="pb-1">Blog: Writing a Strong Listing</h4>
              <p>Crafting a listing that stands out.</p>
              <Link href="/" className="blue-link">Read More</Link>
            </div>
            <div className="bg-[#F3F3F3] rounded-2xl p-5">
              <h4 className="pb-1">Guide: Due Diligence Checklist</h4>
              <p>Prepare for investor review.</p>
              <Link href="/" className="green-link">Download PDF</Link>
            </div>
          </div>

          <button
            className="px-6 py-2 rounded-full font-medium transition inline-flex items-center justify-center bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white mt-5"
          >
            View More Resources
          </button>
        </div>
      </div>
    </div>
  );
}
