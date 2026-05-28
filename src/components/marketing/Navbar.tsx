"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100" : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
          <span className="text-2xl">✦</span>
          <span>PixelPilot <span className="text-violet-600">AI</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[
            { href: "/#services", label: "Services" },
            { href: "/#how-it-works", label: "How It Works" },
            { href: "/pricing", label: "Pricing" },
            { href: "/#portfolio", label: "Portfolio" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-slate-600 hover:text-violet-600 font-medium text-sm transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
            Sign in
          </Link>
          <Button size="sm" asChild>
            <Link href="/pricing">Get Started →</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-0.5 bg-slate-700 mb-1" />
          <div className="w-5 h-0.5 bg-slate-700 mb-1" />
          <div className="w-5 h-0.5 bg-slate-700" />
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 flex flex-col gap-4">
          {[
            { href: "/#services", label: "Services" },
            { href: "/#how-it-works", label: "How It Works" },
            { href: "/pricing", label: "Pricing" },
            { href: "/#portfolio", label: "Portfolio" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="text-slate-700 font-medium" onClick={() => setMobileOpen(false)}>
              {label}
            </Link>
          ))}
          <Button size="sm" asChild className="w-full">
            <Link href="/pricing">Get Started →</Link>
          </Button>
        </div>
      )}
    </header>
  );
}
