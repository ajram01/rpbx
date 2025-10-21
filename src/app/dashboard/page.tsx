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
import ListingTrafficChart from "./_components/ListingTrafficChart";

import NavGate from "../components/NavGate";
import { getEntitlement } from "@/lib/entitlements";
import PaywallOverlay from "./_components/PaywallOverlay";

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
  const supabase = await createClientRSC();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  // 🔒 Server-side entitlement check
  const { entitled, unverified, role } = await getEntitlement();

  // If you want strict email verification before anything else:
  if (unverified) {
    redirect("/auth/verify-email"); // or render a banner if you prefer
  }

  // Use role if present; otherwise default (your app previously defaulted to business)
  const userType: "business" | "investor" = (role ?? "business") as
    | "business"
    | "investor";

  // 🔁 Gentle onboarding redirect AFTER payment activation:
  // If they are entitled but haven't created required profile data yet,
  // nudge them to the correct onboarding route immediately.
  if (entitled) {
    if (userType === "investor") {
      const { data: inv } = await supabase
        .from("investor_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!inv) {
        redirect("/onboarding/investor/contact");
      }
    } else {
      // Business: if they have no active listings yet, send them to set-up.
      const { count } = await supabase
        .from("business_listings")
        .select("id", { count: "exact", head: true })
        .eq("owner_id", user.id)
        .eq("is_active", true);
      if (!count) {
        redirect("/onboarding/business/set-up");
      }
    }
  }

  // If NOT entitled, DO NOT fetch private dashboard data yet.
  let dashboardData: DashboardData | null = null;
  let pagePaths: string[] = [];
  let labels: Record<string, string> = {};
  let chartTitle = "";
  let chartDescription = "";

  if (entitled) {
    if (userType === "business") {
      const { data: owned } = await supabase
        .from("business_listings")
        .select("id, title, is_active")
        .eq("owner_id", user.id)
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(50);

      pagePaths = (owned ?? []).map((l) => `/business-listing/${l.id}`);
      labels = Object.fromEntries(
        (owned ?? []).map((l) => [`/business-listing/${l.id}`, l.title ?? l.id])
      );

      chartTitle = "Listing Page Views";
      chartDescription = "GA4 page views for your listings (last 6 months)";
      dashboardData = await getBusinessDashboardData(supabase, user.id);
    } else {
      const { data: inv } = await supabase
        .from("investor_profiles")
        .select("id, first_name, last_name")
        .eq("user_id", user.id)
        .maybeSingle();

      if (inv) {
        const path = `/investor-listing/${inv.id}`;
        pagePaths = [path];
        const display =
          `${inv.first_name ?? ""} ${inv.last_name ?? ""}`.trim() ||
          "Your Profile";
        labels = { [path]: display };
      }

      chartTitle = "Profile Views";
      chartDescription = "GA4 page views for your investor profile (last 6 months)";
      dashboardData = await getInvestorDashboardData(supabase, user.id);
    }
  }

  const { data: profRow } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user.id)
    .maybeSingle<{ first_name: string | null }>();

  const displayName =
    profRow?.first_name ??
    (user.user_metadata?.first_name as string | undefined) ??
    user.email ??
    "User";

  // Base price for resume checkout (single plan MVP)
  const basePriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_BASE!;

  return (
    <div className="relative">
      {/* If not entitled, show the overlay + blur everything underneath */}
      {!entitled && (
        <PaywallOverlay priceId={basePriceId} />
      )}

      {/* Blur the dashboard when not entitled (no data leaks) */}
      <div
        className={!entitled ? "pointer-events-none select-none blur-sm" : ""}
        aria-hidden={!entitled}
      >
        {/* Header / Hero */}
        <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-top">
          <NavGate />

          <div className="flex flex-col w-full lg:w-[1140px] mx-auto py-10 gap-10 px-5 lg:px-0 pb-40 md:pb-52">
            <h1>Welcome back, {displayName}</h1>
            <p className="-mt-2">
              Here’s what’s happening in your business today.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col lg:flex-row gap-5">
              <Link
                href={userType === "business" ? "/dashboard/listings" : "/listings"}
                className="flex-1 flex flex-col items-center p-5 bg-[#60A1BC] rounded-2xl hover:opacity-90 transition"
              >
                <p className="text-white">
                  {userType === "business"
                    ? "View Listing Info"
                    : "Update Profile Info"}
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

            {/* Data widgets only when entitled */}
            {entitled && dashboardData && (
              <>
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

                <div className="w-full lg:w-[1140px] mx-auto px-5 lg:px-0 mt-4">
                  <ListingTrafficChart
                    title={chartTitle}
                    description={chartDescription}
                    pagePaths={pagePaths}
                    seriesLabels={labels}
                    months={6}
                    emptyNote={
                      userType === "business"
                        ? "No listing traffic yet — once your listings get views, lines will appear here."
                        : "No profile views yet — share your profile and check back soon."
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Matches + Resources */}
        {entitled && dashboardData && (
          <div className="bg-purple-300 flex flex-col items-center bg-[url('/images/backgrounds/black-mint-bg.png')] bg-cover bg-center md:bg-fixed py-10">
            <div className="relative -mt-40 md:-mt-52 mb-[-48px] z-10 w-full px-5 lg:px-0">
              <div className="bg-white flex flex-col w-full lg:w-[1140px] mx-auto rounded-2xl p-10 shadow-xl">
                <h2 className="pb-5">
                  {dashboardData.kind === "business"
                    ? "Investor Matches"
                    : "Business Matches"}
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

            <div className="bg-white flex flex-col w-full lg:w-[1140px] mx-auto rounded-2xl p-10 mt-30">
              <h2 className="pb-5">Resources</h2>
              {/* Keep your existing resource blocks */}
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
              <button className="px-6 py-2 rounded-full font-medium transition inline-flex items-center justify-center bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white mt-5">
                View More Resources
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
