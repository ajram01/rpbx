export const revalidate = 0; // or: export const dynamic = "force-dynamic";

import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClientRSC } from "@/../utils/supabase/server";
import Navbar2 from "../components/Navbar-2";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClientRSC();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("user_type")
    .eq("id", user.id)
    .single();

  if (error || !profile) redirect("/logout"); // or render an error state

  const userType = (profile.user_type ?? "business") as "business" | "investor" | "admin";

  return (
    <div className="min-h-screen bg-white">
      {/* Pass userType if your Navbar supports it; otherwise drop this prop */}
      <Navbar2 userType={userType} />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
