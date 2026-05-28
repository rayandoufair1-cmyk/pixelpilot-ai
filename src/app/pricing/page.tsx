import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { PricingPageClient } from "@/components/marketing/PricingPageClient";

export const metadata = {
  title: "Pricing — PixelPilot AI",
  description: "Choose the plan that fits your business. One-time payment, delivered in 24–72 hours.",
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
              Pick your plan, get your site
            </h1>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              One-time payment. AI builds and delivers your custom website. No subscriptions.
            </p>
          </div>
          <PricingPageClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
