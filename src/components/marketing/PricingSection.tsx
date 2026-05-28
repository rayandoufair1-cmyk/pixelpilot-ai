"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PRICING_PLANS } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "How is this different from a website builder like Wix or Squarespace?",
    a: "Website builders give you a generic template and leave you to figure everything out yourself. We give you a fully custom-built website — unique to your brand — with zero design or tech work on your end. You fill out a form and we deliver a finished site.",
  },
  {
    q: "What exactly do I get? Is the site mine to keep?",
    a: "Yes, 100%. You own the code and can move it anywhere you like. We'll provide a live URL and full source code. You're never locked in to any subscription or platform.",
  },
  {
    q: "What if I don't like the design?",
    a: "That's what revisions are for. Every plan includes at least one round of revisions — Enterprise includes unlimited. Just describe what you want changed in the chat and we'll update it, usually within 1–2 hours.",
  },
  {
    q: "Do I need a domain name already?",
    a: "No. We'll deploy to a free subdomain first so you can review everything. When you're ready to use your own domain, we'll send you step-by-step connection instructions. It takes about 10 minutes.",
  },
  {
    q: "What about hosting? Do I pay monthly for that?",
    a: "We deploy to Vercel's global CDN which has a free tier that covers most small business websites. You won't pay monthly hosting on us — we'll guide you through connecting your own free Vercel account.",
  },
  {
    q: "What's your refund policy?",
    a: "If you're not satisfied with your delivered website for any reason, email us within 30 days and we'll refund you in full. No questions asked. We've never needed to give one — but the guarantee is real.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-slate-900 text-sm pr-4">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            One-time payment. No subscriptions, no hidden fees. Just a great website.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-12">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? "bg-violet-600 text-white shadow-2xl shadow-violet-200 scale-105"
                  : "bg-white border border-slate-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                  ⭐ MOST POPULAR
                </div>
              )}

              <div
                className={`text-xs font-bold uppercase tracking-widest mb-2 ${
                  plan.popular ? "text-violet-200" : "text-violet-600"
                }`}
              >
                {plan.name}
              </div>

              <div className="mb-1">
                <span
                  className={`text-4xl font-black ${plan.popular ? "text-white" : "text-slate-900"}`}
                >
                  {formatCurrency(plan.price)}
                </span>
                <span className={`text-sm ml-1 ${plan.popular ? "text-violet-200" : "text-slate-400"}`}>
                  one-time
                </span>
              </div>

              <div className={`text-xs mb-2 ${plan.popular ? "text-violet-300" : "text-emerald-600 font-semibold"}`}>
                {plan.popular
                  ? "vs $8,000+ for an agency"
                  : plan.id === "starter"
                  ? "Save $7,000+ vs agency"
                  : "Save $19,000+ vs agency"}
              </div>

              <p className={`text-sm mb-8 ${plan.popular ? "text-violet-200" : "text-slate-500"}`}>
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        plan.popular ? "text-violet-200" : "text-violet-600"
                      }`}
                    />
                    <span
                      className={`text-sm ${plan.popular ? "text-violet-100" : "text-slate-600"}`}
                    >
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
                <Link href={`/pricing?plan=${plan.id}`}>Get Started →</Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Guarantee strip */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left mb-16">
          <div className="text-4xl">🛡️</div>
          <div className="flex-1">
            <div className="font-bold text-slate-900">30-Day Money-Back Guarantee</div>
            <div className="text-slate-500 text-sm">
              Not satisfied? Full refund within 30 days — no questions, no hassle.
            </div>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <span>🔒</span> Stripe-secured
            </div>
            <div className="flex items-center gap-1.5">
              <span>⚡</span> Instant start
            </div>
            <div className="flex items-center gap-1.5">
              <span>💬</span> Support included
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-black text-slate-900 text-center mb-8">
            Questions? We've got answers.
          </h3>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
          <p className="text-center text-slate-400 text-sm mt-8">
            Still have questions?{" "}
            <a href="/#contact" className="text-violet-600 hover:underline font-medium">
              Ask us directly →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
