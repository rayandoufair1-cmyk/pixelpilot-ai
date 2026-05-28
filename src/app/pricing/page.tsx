import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { PricingPageClient } from "@/components/marketing/PricingPageClient";
import type { PricingTier } from "@/types";

export const metadata = {
  title: "Pricing — PixelPilot AI",
  description: "Choose the plan that fits your business. One-time payment, delivered in 24–72 hours.",
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; cancelled?: string }>;
}) {
  const { plan, cancelled } = await searchParams;
  const validTiers: PricingTier[] = ["starter", "pro", "enterprise"];
  const initialPlan = validTiers.includes(plan as PricingTier) ? (plan as PricingTier) : null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {cancelled && (
            <div className="max-w-lg mx-auto mb-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 text-sm text-center">
              Payment cancelled — no charge was made. Pick a plan whenever you&apos;re ready.
            </div>
          )}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
              Pick your plan, get your site
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              One-time payment. AI builds and delivers your custom website. No subscriptions.
            </p>
          </div>
          <PricingPageClient initialPlan={initialPlan} />
        </div>
      </main>
      <Footer />
    </>
  );
}
