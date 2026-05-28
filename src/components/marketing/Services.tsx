const SERVICES = [
  {
    icon: "⚡",
    title: "AI Website Generation",
    description:
      "Claude AI analyzes your intake data and crafts a fully custom, mobile-responsive website — beautiful design, clean code, fast performance.",
  },
  {
    icon: "🤝",
    title: "Automated Client Onboarding",
    description:
      "Smart intake form → automatic proposal → Stripe payment → kickoff email. Zero human intervention needed to get started.",
  },
  {
    icon: "💬",
    title: "AI Project Manager",
    description:
      "Your personal AI project manager handles client communication 24/7 — answers questions, collects feedback, and keeps projects moving.",
  },
  {
    icon: "🚀",
    title: "One-Click Deployment",
    description:
      "Approve your design and we automatically deploy to Vercel's global CDN. Your site is live in seconds, worldwide.",
  },
  {
    icon: "🔄",
    title: "Revision Automation",
    description:
      "Request changes via chat. AI understands your feedback and regenerates updated sections — no lengthy design revision cycles.",
  },
  {
    icon: "📊",
    title: "Admin Dashboard",
    description:
      "Full visibility into every client project — status, payments, chat history, and one-click deployment controls.",
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            What We Do
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
            Everything automated, nothing compromised
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            A full web design agency experience, powered by AI end-to-end.
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
              <p className="text-slate-500 leading-relaxed text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
