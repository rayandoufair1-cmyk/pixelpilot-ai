"use client";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PRICING_PLANS } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";
import { Check } from "lucide-react";

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            One-time payment. No subscriptions, no hidden fees, no surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? "bg-violet-600 text-white shadow-2xl shadow-violet-200 scale-105"
                  : "bg-slate-50 border border-slate-200"
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
                    <Check
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? "text-violet-200" : "text-violet-600"}`}
                    />
                    <span className={`text-sm ${plan.popular ? "text-violet-100" : "text-slate-600"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.popular ? "secondary" : "primary"}
                className={`w-full ${plan.popular ? "bg-white text-violet-700 hover:bg-violet-50" : ""}`}
              >
                <Link href={`/pricing#${plan.id}`}>Get Started →</Link>
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-400 text-sm mt-8">
          All plans include hosting setup, mobile responsiveness, and SEO basics. Stripe-secured payments.
        </p>
      </div>
    </section>
  );
}
