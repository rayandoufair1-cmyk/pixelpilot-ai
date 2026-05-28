import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-white font-bold text-lg mb-3">
              ✦ PixelPilot <span className="text-violet-400">AI</span>
            </div>
            <p className="text-sm leading-relaxed">
              AI-powered web design. Stunning sites delivered in 24 hours, fully automated.
            </p>
          </div>

          {[
            {
              title: "Product",
              links: [
                { href: "/#services", label: "Services" },
                { href: "/pricing", label: "Pricing" },
                { href: "/#how-it-works", label: "How It Works" },
                { href: "/#contact", label: "Contact" },
              ],
            },
            {
              title: "Company",
              links: [
                { href: "/#services", label: "About Us" },
                { href: "/#how-it-works", label: "How It Works" },
                { href: "/#contact", label: "Contact" },
                { href: "/pricing", label: "Get Started" },
              ],
            },
            {
              title: "Legal",
              links: [
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
                { href: "/refunds", label: "Refund Policy" },
              ],
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <div className="text-white font-semibold text-sm mb-3">{title}</div>
              <ul className="space-y-2">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-sm">
          © {new Date().getFullYear()} PixelPilot AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
