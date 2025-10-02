// app/welcome/page.tsx
import Image from "next/image";
import Button from "../components/Button";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { createClientRSC } from "@/../utils/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Map a role to the page they should land on
type Role = "business" | "investor" | "admin" | "member" | null;
function nextPathForRole(role: Role) {
  if (role === "investor") return "/onboarding/investor";
  if (role === "business") return "/onboarding/business/basics";
  if (role === "admin") return "/admin";
  return "/dashboard";
}

// Try to read intended role directly from the Checkout Session metadata (race-proof vs webhook)
async function getIntendedRole(sessionId?: string): Promise<Role> {
  if (!sessionId) return null;
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription.items.data.price"],
  });

  // Prefer what you set in subscription_data.metadata during Checkout
  const intended =
    (session.subscription as any)?.metadata?.intended_user_type ??
    (session.metadata as any)?.intended_user_type ??
    null;

  if (intended === "investor" || intended === "business" || intended === "admin") {
    return intended;
  }
  return null;
}

export default async function Welcome({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const supabase = await createClientRSC();
  const { data: { user } } = await supabase.auth.getUser();

  // 1) Figure out intended role from Stripe (if session_id is present)
  const intendedRole = await getIntendedRole(searchParams.session_id);
  const intendedNext = nextPathForRole(intendedRole);

  // 2) If logged in, go straight to the right place
  if (user) {
    // Prefer DB role (webhook), fallback to intended role to avoid timing issues
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_type")
      .eq("id", user.id)
      .maybeSingle<{ user_type: Role }>();

    const role: Role = profile?.user_type ?? intendedRole ?? "member";
    redirect(nextPathForRole(role));
  }

  // 3) Not logged in: show your CTA (no redirect), but aim the next= param smartly
  const loginNext = encodeURIComponent(intendedNext || "/onboarding/business/basics");

  return (
    <div className="flex flex-col bg-[url('/images/backgrounds/white-bg.png')] bg-repeat bg-center min-h-screen justify-center lg:py-10">
      <div className="bg-white mx-auto max-w-lg lg:min-w-[500px] p-6 my-5 rounded-xl border border-neutral-200 shadow text-center">
        <Image
          src="/images/logos/Rio-Plex-Logo-Main-Mint-&-Charcoal.png"
          alt="Investors and Business Owners"
          width={2000}
          height={450}
          className="w-full h-auto"
          priority
        />

        <h1 className="text-2xl font-semibold pt-10">Welcome to RPBX!</h1>
        <p className="mt-2 text-neutral-600">
          We’ve saved your purchase. Sign in to complete setup.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Button className="w-full" href={`/login?next=${loginNext}`}>
            Sign in to Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
