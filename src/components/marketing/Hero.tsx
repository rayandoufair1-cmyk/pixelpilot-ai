"use client";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const STATS = [
  { value: "24h", label: "Average Delivery" },
  { value: "500+", label: "Sites Launched" },
  { value: "4.9★", label: "Client Rating" },
  { value: "100%", label: "AI-Powered" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-violet-950 via-slate-900 to-slate-950">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-violet-300 text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
          Fully automated · AI-powered · Live in 24h
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
          Your dream website,{" "}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            built by AI
          </span>
          <br />
          in 24 hours.
        </h1>

        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Fill out a short intake form. Our AI designs, codes, and deploys your custom website — no
          waiting weeks, no agency fees, no compromise on quality.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button size="lg" asChild className="bg-violet-500 hover:bg-violet-400 shadow-2xl shadow-violet-500/30">
            <Link href="/pricing">Start My Website →</Link>
          </Button>
          <Button size="lg" variant="ghost" asChild className="text-slate-300 hover:text-white hover:bg-white/10">
            <Link href="/#how-it-works">See How It Works</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-black text-white mb-1">{value}</div>
              <div className="text-slate-400 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
