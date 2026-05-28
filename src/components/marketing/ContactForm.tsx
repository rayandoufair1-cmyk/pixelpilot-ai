"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-violet-950 to-slate-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-black text-white mb-4">Have questions?</h2>
        <p className="text-violet-200 mb-10">We usually reply within a few hours — or just get started directly.</p>

        {state === "done" ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-emerald-300">
            ✅ Message sent! We'll get back to you shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 text-left space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-violet-200 text-sm font-medium mb-1.5">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-violet-200 text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="you@company.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-violet-200 text-sm font-medium mb-1.5">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={4}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                placeholder="Tell us about your project..."
              />
            </div>
            {state === "error" && (
              <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
            )}
            <Button type="submit" loading={state === "loading"} className="w-full">
              Send Message →
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
