"use client";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const TRUST_ITEMS = [
  { icon: "⭐", text: "4.9/5 from 500+ clients" },
  { icon: "🔒", text: "Stripe-secured checkout" },
  { icon: "↩️", text: "30-day money-back guarantee" },
  { icon: "⚡", text: "Live in 24 hours" },
];

const COMPARE = [
  { label: "Traditional Agency", value: "$8,000–$25,000", sub: "6–12 week wait", bad: true },
  { label: "Freelancer", value: "$2,000–$6,000", sub: "3–6 week wait", bad: true },
  { label: "PixelPilot AI", value: "From $997", sub: "Live in 24 hours", bad: false },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-violet-950 via-slate-900 to-slate-950">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-1.5 text-amber-300 text-sm font-medium mb-8">
              <span className="text-amber-400">🏆</span>
              #1 AI Web Design · 30-Day Money-Back Guarantee
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.1] mb-6">
              Your new website,{" "}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                live by tomorrow
              </span>{" "}
              morning.
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              Agencies charge{" "}
              <span className="line-through text-slate-500">$8,000–$25,000</span> and make you wait
              12 weeks. We deliver a custom, conversion-ready website in{" "}
              <strong className="text-white">24 hours</strong> — just fill out a short form and
              we handle everything else.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button
                size="lg"
                asChild
                className="bg-violet-500 hover:bg-violet-400 shadow-2xl shadow-violet-500/30 text-base"
              >
                <Link href="/pricing">Start My Website →</Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                asChild
                className="text-slate-300 hover:text-white hover:bg-white/10 text-base"
              >
                <Link href="/#how-it-works">See How It Works</Link>
              </Button>
            </div>

            {/* Trust bar */}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {TRUST_ITEMS.map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — comparison card + browser mockup */}
          <div className="space-y-4">
            {/* Browser mockup */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 bg-white/5 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-400/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/60" />
                <div className="flex-1 mx-4 bg-white/10 rounded-full px-4 py-1 text-white/30 text-xs">
                  yoursite.com
                </div>
              </div>
              {/* Mock site content */}
              <div className="p-6 space-y-3">
                <div className="h-8 bg-violet-500/30 rounded-lg w-3/4" />
                <div className="h-4 bg-white/10 rounded w-full" />
                <div className="h-4 bg-white/10 rounded w-5/6" />
                <div className="h-4 bg-white/10 rounded w-4/6" />
                <div className="flex gap-3 mt-4">
                  <div className="h-10 bg-violet-500/40 rounded-xl w-32" />
                  <div className="h-10 bg-white/10 rounded-xl w-28" />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl bg-white/5 p-3 space-y-2">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/30" />
                      <div className="h-3 bg-white/10 rounded w-full" />
                      <div className="h-3 bg-white/10 rounded w-4/5" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Live badge */}
              <div className="px-6 pb-4 flex items-center gap-2 text-emerald-400 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Site live — delivered in 18 hours
              </div>
            </div>

            {/* Comparison table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-3">
                Price & timeline comparison
              </div>
              <div className="space-y-2">
                {COMPARE.map(({ label, value, sub, bad }) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      bad ? "opacity-60" : "bg-violet-500/10 border border-violet-500/20"
                    }`}
                  >
                    <div>
                      <div className={`text-sm font-semibold ${bad ? "text-slate-400" : "text-white"}`}>
                        {label}
                      </div>
                      <div className="text-xs text-slate-500">{sub}</div>
                    </div>
                    <div
                      className={`text-right text-sm font-bold ${
                        bad ? "text-slate-400 line-through" : "text-violet-300"
                      }`}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
