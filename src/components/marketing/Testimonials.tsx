const TESTIMONIALS = [
  {
    quote:
      "I've hired three agencies over the years. The cheapest was $6,200 and took 8 weeks. PixelPilot delivered a better site in 20 hours. I genuinely couldn't believe it when I opened the preview.",
    author: "Maria C.",
    role: "Restaurant Owner",
    location: "Austin, TX",
    avatar: "MC",
    color: "bg-rose-100 text-rose-700",
    result: "Site live in 20 hours · Saved $5,200",
  },
  {
    quote:
      "My consulting firm needed a professional web presence fast. I described what we do and within a day I had something that looked like it cost $15,000. The AI nailed our tone completely.",
    author: "James T.",
    role: "Business Consultant",
    location: "New York, NY",
    avatar: "JT",
    color: "bg-blue-100 text-blue-700",
    result: "3 client inquiries in first week",
  },
  {
    quote:
      "As a freelance designer I was skeptical. Then I used it for a client who needed something quick and I was blown away. The code is clean, the design is solid. I'll be recommending this to clients regularly.",
    author: "Priya S.",
    role: "Freelance Designer",
    location: "London, UK",
    avatar: "PS",
    color: "bg-emerald-100 text-emerald-700",
    result: "Now resells to her own clients",
  },
  {
    quote:
      "We're a small gym. No budget for a $10K website. PixelPilot gave us something that competes with the big chains. Membership inquiries through the site went up 40% in the first month.",
    author: "David R.",
    role: "Gym Owner",
    location: "Chicago, IL",
    avatar: "DR",
    color: "bg-amber-100 text-amber-700",
    result: "+40% membership inquiries",
  },
  {
    quote:
      "The revision chat is what sold me. I asked for changes in plain English — 'make the hero darker and move the contact form higher' — and it just did it. No ticket system, no waiting.",
    author: "Sophie L.",
    role: "E-commerce Founder",
    location: "Paris, FR",
    avatar: "SL",
    color: "bg-violet-100 text-violet-700",
    result: "4 revisions completed in 2 hours",
  },
  {
    quote:
      "I was building my law firm's website with a freelancer who disappeared mid-project. Tried PixelPilot out of desperation. Honestly? The result was better than what the freelancer had started.",
    author: "Michael B.",
    role: "Attorney",
    location: "Seattle, WA",
    avatar: "MB",
    color: "bg-slate-100 text-slate-700",
    result: "Rescued a stalled project in 24h",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber-400 text-sm mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Client Stories
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
            Real people. Real results.
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Over 500 businesses have launched with PixelPilot AI. Here's what some of them said.
          </p>
          {/* Overall rating */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex gap-0.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-xl">★</span>
              ))}
            </div>
            <span className="font-bold text-slate-900 text-lg">4.9</span>
            <span className="text-slate-400 text-sm">/ 5.0 · 500+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.author}
              className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-violet-200 hover:shadow-md transition-all flex flex-col"
            >
              <Stars />
              <p className="text-slate-700 leading-relaxed mb-6 flex-1 text-sm">
                &ldquo;{t.quote}&rdquo;
              </p>
              {/* Result badge */}
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1 mb-4 w-fit">
                <span>✓</span> {t.result}
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${t.color}`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{t.author}</div>
                  <div className="text-slate-400 text-xs">
                    {t.role} · {t.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="mt-16 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-10 text-center text-white">
          <h3 className="text-2xl font-black mb-2">Ready to join them?</h3>
          <p className="text-violet-200 mb-6">
            Your website could be live by this time tomorrow. Start now — no risk with our 30-day guarantee.
          </p>
          <a
            href="/pricing"
            className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-8 py-3 rounded-xl hover:bg-violet-50 transition-colors"
          >
            Start My Website →
          </a>
        </div>
      </div>
    </section>
  );
}
