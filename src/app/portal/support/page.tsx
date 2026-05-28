export const metadata = { title: "Support — PixelPilot AI" };

const HELP_TOPICS = [
  {
    icon: "⏱️",
    title: "How long until my site is ready?",
    body: "Most sites are ready within 18–24 hours of payment. You'll receive an email the moment your design is complete and available to preview.",
  },
  {
    icon: "✏️",
    title: "How do I request changes?",
    body: "Go to your project and use the AI chat to describe what you want changed. Write in plain English — 'make the hero section darker' or 'add a testimonials section' — and your AI project manager will handle it.",
  },
  {
    icon: "🌐",
    title: "How do I connect my domain?",
    body: "Once your site is approved and deployed, we'll email you step-by-step instructions for connecting your domain. It typically takes 10 minutes and involves updating two DNS records.",
  },
  {
    icon: "🔄",
    title: "How many revisions do I get?",
    body: "Starter plans include 1 revision round. Pro includes 3. Enterprise includes unlimited revisions. A revision round means one set of feedback applied — not one change at a time.",
  },
  {
    icon: "💳",
    title: "What is your refund policy?",
    body: "We offer a full refund within 30 days of delivery if you're not satisfied. Email hello@pixelpilot.ai with your order details and we'll process it the same day.",
  },
  {
    icon: "🚀",
    title: "My site is live — what now?",
    body: "You're done! Your site is on a global CDN. To update content in the future, start a new project or contact us for a maintenance package. Keep your login safe — it's your permanent client portal.",
  },
];

export default function SupportPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Support</h1>
        <p className="text-slate-500 text-sm mt-1">Answers to common questions — and how to reach us directly.</p>
      </div>

      {/* Direct contact */}
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="text-3xl">👋</div>
        <div className="flex-1">
          <div className="font-semibold text-slate-900 mb-0.5">Need help with your project?</div>
          <div className="text-slate-600 text-sm">
            Email us at{" "}
            <a href="mailto:hello@pixelpilot.ai" className="text-violet-600 font-medium hover:underline">
              hello@pixelpilot.ai
            </a>{" "}
            and a human (not a bot) will respond within 3 hours.
          </div>
        </div>
        <a
          href="mailto:hello@pixelpilot.ai"
          className="flex-shrink-0 bg-violet-600 text-white font-semibold rounded-xl px-5 py-2.5 text-sm hover:bg-violet-700 transition-colors"
        >
          Email Us
        </a>
      </div>

      {/* Chat option */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 flex items-start gap-4">
        <div className="text-3xl">💬</div>
        <div>
          <div className="font-semibold text-slate-900 mb-0.5">Chat with your AI Project Manager</div>
          <div className="text-slate-500 text-sm">
            For questions about your specific project — revisions, status, timeline — go into the project and use the
            chat. Your AI PM is available 24/7.
          </div>
          <a href="/portal/dashboard" className="text-violet-600 text-sm font-medium hover:underline mt-2 inline-block">
            Go to My Projects →
          </a>
        </div>
      </div>

      {/* Help topics */}
      <h2 className="text-lg font-bold text-slate-900 mb-4">Common Questions</h2>
      <div className="space-y-3">
        {HELP_TOPICS.map(({ icon, title, body }) => (
          <div key={title} className="bg-white rounded-2xl border border-slate-200 p-6 flex gap-4">
            <div className="text-2xl flex-shrink-0">{icon}</div>
            <div>
              <div className="font-semibold text-slate-900 mb-1 text-sm">{title}</div>
              <div className="text-slate-500 text-sm leading-relaxed">{body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
