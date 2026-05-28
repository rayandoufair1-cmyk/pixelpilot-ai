"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const CONTACT_OPTIONS = [
  {
    icon: "💬",
    title: "Have a quick question?",
    desc: "Fill out the form — we respond within a few hours, usually faster.",
  },
  {
    icon: "📧",
    title: "Prefer email?",
    desc: "hello@pixelpilot.ai",
    href: "mailto:hello@pixelpilot.ai",
  },
  {
    icon: "🚀",
    title: "Ready to get started?",
    desc: "Skip the chat — pick a plan and your site starts immediately.",
    href: "/pricing",
    cta: "See Pricing →",
  },
];

export function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Server error");
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-violet-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Get In Touch
          </div>
          <h2 className="text-4xl font-black text-white mb-4">We're real people. Promise.</h2>
          <p className="text-violet-200 max-w-xl mx-auto">
            No ticket systems, no bots on the other end of this form. A human reads every message
            and responds personally.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start max-w-5xl mx-auto">
          {/* Left: options */}
          <div className="lg:col-span-2 space-y-4">
            {CONTACT_OPTIONS.map(({ icon, title, desc, href, cta }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-white font-semibold text-sm mb-1">{title}</div>
                {href ? (
                  <a
                    href={href}
                    className="text-violet-300 hover:text-violet-100 text-sm transition-colors"
                  >
                    {cta ?? desc}
                  </a>
                ) : (
                  <p className="text-slate-400 text-sm">{desc}</p>
                )}
              </div>
            ))}

            {/* Response time */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <div className="text-emerald-300 text-sm">
                <span className="font-semibold">Avg. response time:</span> under 3 hours
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            {state === "done" ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-10 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-white font-bold text-lg mb-2">Message received!</h3>
                <p className="text-emerald-300 text-sm">
                  We'll get back to you within a few hours. Keep an eye on your inbox.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-violet-200 text-sm font-medium mb-1.5">
                      Your name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-violet-200 text-sm font-medium mb-1.5">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                      placeholder="jane@company.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-violet-200 text-sm font-medium mb-1.5">
                    What's on your mind?
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none text-sm"
                    placeholder="Ask about our process, timeline, a specific industry, or anything else..."
                  />
                </div>
                {state === "error" && (
                  <p className="text-red-400 text-sm">
                    Something went wrong. Please try again or email us directly.
                  </p>
                )}
                <Button type="submit" loading={state === "loading"} className="w-full">
                  Send Message →
                </Button>
                <p className="text-center text-slate-500 text-xs">
                  We read every message personally and reply to all of them.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
