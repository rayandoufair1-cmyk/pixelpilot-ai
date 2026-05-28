const SERVICES = [
  {
    icon: "🎨",
    title: "Custom Website Design",
    description:
      "Not a template — a real, one-of-a-kind design built around your brand. Our AI studies your industry, competitors, and style preferences to produce something genuinely yours.",
    stat: "5-section starter to full multi-page builds",
  },
  {
    icon: "⚡",
    title: "Delivered in 24 Hours",
    description:
      "From the moment you pay, our AI is working. Most clients receive their completed website within 18–24 hours — not weeks, not months. Time is money, and we respect both.",
    stat: "Average: 18 hours",
  },
  {
    icon: "📱",
    title: "Mobile-First & Fast",
    description:
      "Every website we build loads fast and looks perfect on phones, tablets, and desktops. Google rewards fast mobile sites — and so do your customers.",
    stat: "100/100 PageSpeed scores",
  },
  {
    icon: "💬",
    title: "AI Revision Chat",
    description:
      "Not happy with something? Chat directly with your AI project manager — describe what you want changed in plain English and we'll update it. No email chains, no calls.",
    stat: "Up to unlimited revisions on Enterprise",
  },
  {
    icon: "🚀",
    title: "One-Click Go-Live",
    description:
      "When you're ready, hit Approve. We deploy your site instantly to a global CDN. You get a live URL you can share the same day — no hosting setup, no tech headaches.",
    stat: "Globally distributed in seconds",
  },
  {
    icon: "🔍",
    title: "SEO Built-In From Day One",
    description:
      "Your site ships with proper meta tags, structured data, sitemaps, and image optimization. We set you up to rank — not just look good.",
    stat: "Structured data + sitemap included",
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            What You Get
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
            Everything a $10,000 agency delivers —{" "}
            <span className="text-violet-600">in 24 hours</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            We didn't cut corners to make this fast. We used AI to remove the parts that slow
            everyone else down — the back-and-forth, the waiting, the bloated timelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-slate-100 group"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-violet-700 transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-500 leading-relaxed text-sm mb-4">{service.description}</p>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full">
                ✦ {service.stat}
              </div>
            </div>
          ))}
        </div>

        {/* Social proof strip */}
        <div className="mt-16 bg-white rounded-2xl border border-slate-200 p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Websites Delivered" },
              { value: "24h", label: "Average Turnaround" },
              { value: "4.9★", label: "Client Satisfaction" },
              { value: "$8K+", label: "Avg. Agency Cost Saved" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-black text-violet-600 mb-1">{value}</div>
                <div className="text-slate-500 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
