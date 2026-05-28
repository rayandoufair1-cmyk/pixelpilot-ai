const STEPS = [
  {
    number: "01",
    title: "Tell us about your business",
    description:
      "Fill out our smart intake form — your industry, style preferences, colors, and what pages you need. Takes 5 minutes.",
    icon: "📝",
  },
  {
    number: "02",
    title: "Choose a plan & pay",
    description:
      "Pick the package that fits your scope. Secure payment via Stripe. Your project starts immediately after checkout.",
    icon: "💳",
  },
  {
    number: "03",
    title: "AI builds your website",
    description:
      "Our Claude-powered AI generates a fully custom, responsive website tailored to your brand. Usually done in under 24 hours.",
    icon: "🤖",
  },
  {
    number: "04",
    title: "Review & request revisions",
    description:
      "Preview your site in our portal. Chat with our AI project manager to request changes — no email back-and-forth.",
    icon: "👀",
  },
  {
    number: "05",
    title: "Approve & go live",
    description:
      "Click approve and we automatically deploy your site. You get a live URL and a go-live email, instantly.",
    icon: "🚀",
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
            From idea to live site in 5 steps
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            No meetings, no back-and-forth, no waiting. Just results.
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
                      <div className="hidden lg:block" /> /* spacer */
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
                      <div className="hidden lg:block" /> /* spacer */
                    )}
                  </div>

                  {/* Mobile: content below icon for odd steps (already in right half which renders in column) */}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepContent({ step }: { step: (typeof STEPS)[0] }) {
  return (
    <div className="max-w-sm">
      <div className="text-violet-400 text-xs font-bold tracking-widest mb-2">STEP {step.number}</div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">{step.description}</p>
    </div>
  );
}
