"use client";
import { useState } from "react";
import { PRICING_PLANS } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Check } from "lucide-react";
import { IntakeForm } from "@/components/marketing/IntakeForm";
import type { PricingTier } from "@/types";

interface PricingPageClientProps {
  initialPlan?: PricingTier | null;
}

export function PricingPageClient({ initialPlan }: PricingPageClientProps) {
  const [selected, setSelected] = useState<PricingTier | null>(initialPlan ?? null);

  if (selected) {
    const plan = PRICING_PLANS.find((p) => p.id === selected)!;
    return <IntakeForm plan={plan} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      {PRICING_PLANS.map((plan) => (
        <div
          key={plan.id}
          id={plan.id}
          className={`relative rounded-2xl p-8 transition-all duration-200 ${
            plan.popular
              ? "bg-violet-600 text-white shadow-2xl shadow-violet-200 scale-105"
              : "bg-white border border-slate-200 hover:shadow-lg hover:-translate-y-1"
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1.5 rounded-full">
              MOST POPULAR
            </div>
          )}

          <div className={`text-sm font-semibold mb-2 ${plan.popular ? "text-violet-200" : "text-violet-600"}`}>
            {plan.name.toUpperCase()}
          </div>

          <div className="mb-2">
            <span className={`text-4xl font-black ${plan.popular ? "text-white" : "text-slate-900"}`}>
              {formatCurrency(plan.price)}
            </span>
            <span className={`text-sm ml-1 ${plan.popular ? "text-violet-200" : "text-slate-500"}`}>
              one-time
            </span>
          </div>

          <p className={`text-sm mb-8 ${plan.popular ? "text-violet-200" : "text-slate-500"}`}>
            {plan.description}
          </p>

          <ul className="space-y-3 mb-8">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? "text-violet-200" : "text-violet-600"}`} />
                <span className={`text-sm ${plan.popular ? "text-violet-100" : "text-slate-600"}`}>{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            onClick={() => setSelected(plan.id)}
            className={`w-full ${plan.popular ? "bg-white text-violet-700 hover:bg-violet-50" : ""}`}
            variant={plan.popular ? "secondary" : "primary"}
          >
            Get Started →
          </Button>
        </div>
      ))}
    </div>
  );
}
