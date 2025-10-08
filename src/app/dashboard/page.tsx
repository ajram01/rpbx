// app/dashboard/page.tsx
export const revalidate = 0;
// or: export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import WelcomeHeader from "./_components/WelcomeHeader";
import BusinessActions from "./_components/BusinessActions";
import InvestorActions from "./_components/InvestorActions";
import RecentActivity from "./_components/RecentActivity";
import UpcomingEvents from "./_components/UpcomingEvents";
import MatchedInvestors from "./_components/MatchedInvestors";
import MatchedBusinesses from "./_components/MatchedBusinesses";
import Resources from "./_components/Resources";

import { getBusinessDashboardData } from "@/lib/dashboard/getBusinessData";
import { getInvestorDashboardData } from "@/lib/dashboard/getInvestorData";
import { createClientRSC } from "@/../utils/supabase/server";

export const metadata: Metadata = {
  title: "User Dashboard | RioPlex Business Exchange",
  description: "Connecting Local Business Owners With Investors",
};

export default async function Dashboard() {
  // If your createClientRSC is sync (typical), do NOT await
  const supabase = await createClientRSC();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("user_type, first_name")
    .eq("id", user.id)
    .single();

  if (profileErr || !profile) {
    redirect("/logout");
  }

  const userType = profile.user_type as "business" | "investor" | "admin";
  const displayName = profile.first_name ?? user.email ?? "User";

  const dashboardData =
    userType === "business"
      ? await getBusinessDashboardData(supabase, user.id)
      : await getInvestorDashboardData(supabase, user.id);

  return (
    <>
      <WelcomeHeader name={displayName} userType={userType} />
      {userType === "business" ? <BusinessActions /> : <InvestorActions />}

      <RecentActivity userType={userType} activities={dashboardData.activities} />
      <UpcomingEvents events={dashboardData.events} />

      {userType === "business" ? (
        <MatchedInvestors
          matches={dashboardData.matches as any}
          listings={"listings" in dashboardData ? (dashboardData as any).listings : []}
        />
      ) : (
        <MatchedBusinesses matches={dashboardData.matches as any} />
      )}

      <Resources userType={userType} />
    </>
  );
}
