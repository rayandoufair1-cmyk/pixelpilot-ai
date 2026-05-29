"use client";
import { useState } from "react";
import { SUBSCRIPTION_PLAN } from "@/lib/pricing";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IntakeForm } from "@/components/marketing/IntakeForm";

export function PricingPageClient({ initialPlan }: { initialPlan?: string | null }) {
  const [started, setStarted] = useState(!!initialPlan);

  if (started) {
    return <IntakeForm onBack={() => setStarted(false)} />;
  }

  const plan = SUBSCRIPTION_PLAN;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Main plan card */}
      <div className="relative bg-violet-600 rounded-3xl p-10 text-white shadow-2xl shadow-violet-200 mb-8">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-5 py-1.5 rounded-full whitespace-nowrap">
          ✦ ONE PLAN. UNLIMITED EVERYTHING.
        </div>

        <div className="text-center mb-8">
          <div className="text-violet-200 text-sm font-bold uppercase tracking-widest mb-3">All Access</div>
          <div className="flex items-end justify-center gap-2 mb-2">
            <span className="text-7xl font-black">$20</span>
            <span className="text-violet-200 text-lg mb-3">/month</span>
          </div>
          <p className="text-violet-200 text-base">
            Build and run as many AI-powered projects as you want. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-violet-200 mt-0.5 flex-shrink-0" />
              <span className="text-violet-100 text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={() => setStarted(true)}
          className="w-full bg-white text-violet-700 hover:bg-violet-50 text-base font-bold py-4"
          variant="secondary"
        >
          Start Building for $20/month →
        </Button>

        <p className="text-center text-violet-300 text-xs mt-4">
          Secure checkout via Stripe · Cancel anytime · No contracts
        </p>
      </div>

      {/* Project types */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-8">
        <h3 className="font-bold text-slate-900 text-center mb-6">Every project type, included</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { icon: "🌐", label: "Business Website" },
            { icon: "🎯", label: "Landing Page" },
            { icon: "🛒", label: "Online Store" },
            { icon: "✍️", label: "Blog / Content" },
            { icon: "🎨", label: "Portfolio" },
            { icon: "⚡", label: "SaaS / App" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50">
              <span className="text-2xl mb-2">{icon}</span>
              <span className="text-slate-700 text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Guarantee + trust */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3">
          <span className="text-2xl">🛡️</span>
          <div>
            <div className="font-bold text-emerald-900 text-sm">30-Day Guarantee</div>
            <p className="text-emerald-700 text-xs mt-0.5">Not happy? Full refund, no questions asked.</p>
          </div>
        </div>
        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <div className="font-bold text-slate-900 text-sm">Stripe-Secured</div>
            <p className="text-slate-500 text-xs mt-0.5">Bank-grade encryption. Cancel anytime from your dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
