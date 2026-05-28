const TESTIMONIALS = [
  {
    quote: "I got my restaurant's website in 18 hours. It looks better than sites that cost me $5,000 before. Genuinely shocked.",
    author: "Maria C.",
    role: "Restaurant Owner",
    avatar: "MC",
  },
  {
    quote: "The AI understood exactly what I needed. I described my consulting firm and it built something that felt 100% on-brand.",
    author: "James T.",
    role: "Business Consultant",
    avatar: "JT",
  },
  {
    quote: "I needed a portfolio site fast. Got it in 12 hours. The chat-based revision system is genius — no more email chains.",
    author: "Priya S.",
    role: "Freelance Designer",
    avatar: "PS",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Client Stories
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
            Real results, real clients
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.author} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <div className="text-violet-500 text-3xl mb-4">"</div>
              <p className="text-slate-700 leading-relaxed mb-6">{t.quote}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{t.author}</div>
                  <div className="text-slate-400 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
