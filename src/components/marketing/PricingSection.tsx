"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Check, ChevronDown } from "lucide-react";
import { SUBSCRIPTION_PLAN } from "@/lib/pricing";

const FAQS = [
  {
    q: "What does $20/month actually include?",
    a: "Everything. You get unlimited AI-powered projects — websites, landing pages, online stores, blogs, portfolios. No caps, no per-project fees. One flat $20/month and you can build as much as you want.",
  },
  {
    q: "Do I own the websites that are built?",
    a: "Yes, 100%. You own all the code and can host it anywhere — we'll provide a live URL and the full source. You're never locked into our platform.",
  },
  {
    q: "How does the AI build my site?",
    a: "You fill out a short intake form: your business name, audience, style preferences, and which pages you need. Our AI then generates the design, writes the copy, and deploys a live preview — usually within 24 hours.",
  },
  {
    q: "Can I request revisions?",
    a: "Yes — unlimited revisions are included. Just chat with us in your project dashboard and we'll update it, usually within a few hours.",
  },
  {
    q: "What if I need a domain name?",
    a: "We deploy to a free preview URL first. When you're ready to go live on your own domain, we send step-by-step connection instructions. Takes about 10 minutes.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. Cancel from your billing dashboard with one click. No cancellation fees, no questions. Your existing projects stay accessible until the end of your billing period.",
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
        <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
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
  const plan = SUBSCRIPTION_PLAN;

  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Simple Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
            One plan. Unlimited projects.
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            $20/month. Build websites, stores, landing pages, blogs — as many as you want. Cancel anytime.
          </p>
        </div>

        {/* Plan card */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative bg-violet-600 rounded-3xl p-10 text-white shadow-2xl shadow-violet-200">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-5 py-1.5 rounded-full whitespace-nowrap">
              ✦ UNLIMITED PROJECTS INCLUDED
            </div>

            <div className="text-center mb-8">
              <div className="flex items-end justify-center gap-2 mb-2">
                <span className="text-6xl font-black">$20</span>
                <span className="text-violet-200 text-lg mb-2">/month</span>
              </div>
              <p className="text-violet-200">Everything included. Cancel anytime.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-violet-200 mt-0.5 flex-shrink-0" />
                  <span className="text-violet-100 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Button asChild variant="secondary" className="w-full bg-white text-violet-700 hover:bg-violet-50 text-base font-bold py-4">
              <Link href="/pricing">Start Building for $20/month →</Link>
            </Button>
          </div>
        </div>

        {/* Project types grid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-12">
          <h3 className="font-bold text-slate-900 text-center text-lg mb-6">All project types — no extra charges</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { icon: "🌐", label: "Business Website" },
              { icon: "🎯", label: "Landing Page" },
              { icon: "🛒", label: "Online Store" },
              { icon: "✍️", label: "Blog" },
              { icon: "🎨", label: "Portfolio" },
              { icon: "⚡", label: "SaaS / App" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-50">
                <span className="text-2xl mb-1.5">{icon}</span>
                <span className="text-slate-700 text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantee */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left mb-16">
          <div className="text-4xl">🛡️</div>
          <div className="flex-1">
            <div className="font-bold text-slate-900">30-Day Money-Back Guarantee</div>
            <div className="text-slate-500 text-sm">Not satisfied in your first 30 days? Full refund — no questions, no hassle.</div>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-1.5"><span>🔒</span> Stripe-secured</div>
            <div className="flex items-center gap-1.5"><span>⚡</span> Instant access</div>
            <div className="flex items-center gap-1.5"><span>❌</span> Cancel anytime</div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-black text-slate-900 text-center mb-8">Questions? We've got answers.</h3>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
          <p className="text-center text-slate-400 text-sm mt-8">
            Still have questions?{" "}
            <a href="/#contact" className="text-violet-600 hover:underline font-medium">Ask us directly →</a>
          </p>
        </div>
      </div>
    </section>
  );
}
