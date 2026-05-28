const STEPS = [
  {
    number: "01",
    time: "~5 min",
    title: "Tell us about your business",
    description:
      "Fill out our smart intake form — your industry, target audience, style preferences, and which pages you need. It's conversational, not overwhelming. Takes about 5 minutes.",
    icon: "📝",
    detail: "No design experience required. If you can describe your business in a sentence, you're ready.",
  },
  {
    number: "02",
    time: "~2 min",
    title: "Choose your plan & pay securely",
    description:
      "Pick the package that fits your scope and budget. Payment is processed securely through Stripe. The moment your payment clears, your project begins — automatically.",
    icon: "💳",
    detail: "All plans include a 30-day money-back guarantee. No questions asked.",
  },
  {
    number: "03",
    time: "Under 24h",
    title: "AI builds your custom website",
    description:
      "Our AI studies your intake, researches your industry, and generates a fully responsive, custom-coded website. Not a template — a real design built for your brand.",
    icon: "🤖",
    detail: "You'll get an email the moment your site is ready to preview.",
  },
  {
    number: "04",
    time: "Your pace",
    title: "Preview and request changes",
    description:
      "Log into your client portal to review your site. Want something different? Chat with your AI project manager in plain English — 'make the header image bigger' — and it's done.",
    icon: "👀",
    detail: "Changes typically complete within 1–2 hours of your request.",
  },
  {
    number: "05",
    time: "Instant",
    title: "Approve and go live",
    description:
      "When you love it, click Approve. We deploy your site instantly to a global CDN. You receive a live URL and go-live email within minutes. That's it — you're live.",
    icon: "🚀",
    detail: "Domain connection instructions included if you have an existing domain.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            The Process
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
            From idea to live in 5 steps
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            No meetings. No design briefs. No waiting on someone else's schedule. Just results.
          </p>
        </div>

        <div className="relative">
          {/* Vertical connector line (desktop only) */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-px top-8 bottom-8 w-0.5 bg-gradient-to-b from-violet-200 via-violet-300 to-violet-100" />

          <div className="space-y-12">
            {STEPS.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={step.number} className="flex flex-col lg:flex-row items-center gap-6 lg:gap-0">
                  {/* Left half */}
                  <div className="lg:flex-1 lg:pr-12 w-full">
                    {isEven ? (
                      <div className="lg:text-right">
                        <StepContent step={step} />
                      </div>
                    ) : (
                      <div className="hidden lg:block" />
                    )}
                  </div>

                  {/* Center icon node */}
                  <div className="flex-shrink-0 w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center text-2xl shadow-lg shadow-violet-200 relative z-10">
                    {step.icon}
                  </div>

                  {/* Right half */}
                  <div className="lg:flex-1 lg:pl-12 w-full">
                    {!isEven ? (
                      <StepContent step={step} />
                    ) : (
                      <div className="hidden lg:block" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Guarantee banner */}
        <div className="mt-20 bg-emerald-50 border border-emerald-200 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="text-5xl flex-shrink-0">🛡️</div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">30-Day Money-Back Guarantee</h3>
            <p className="text-slate-600">
              Not happy with your website for any reason? Email us within 30 days of delivery and we'll
              refund you in full — no questions, no forms, no hassle. We stand behind every site we build.
            </p>
          </div>
          <a
            href="/pricing"
            className="flex-shrink-0 bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors whitespace-nowrap"
          >
            Start Risk-Free →
          </a>
        </div>
      </div>
    </section>
  );
}

function StepContent({ step }: { step: (typeof STEPS)[0] }) {
  return (
    <div className="max-w-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-violet-400 text-xs font-bold tracking-widest">STEP {step.number}</div>
        <div className="bg-violet-100 text-violet-600 text-xs font-semibold px-2 py-0.5 rounded-full">
          {step.time}
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm mb-2">{step.description}</p>
      <p className="text-slate-400 text-xs italic">{step.detail}</p>
    </div>
  );
}
