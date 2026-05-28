import Link from "next/link";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col fixed h-full">
        <div className="p-6 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900">
            <span className="text-xl">✦</span>
            <span>PixelPilot <span className="text-violet-600">AI</span></span>
          </Link>
          <div className="text-xs text-slate-400 mt-1">Client Portal</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: "/portal/dashboard", label: "My Projects", icon: "📁" },
            { href: "/portal/billing", label: "Billing", icon: "💳" },
            { href: "/portal/support", label: "Support", icon: "💬" },
          ].map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-violet-50 hover:text-violet-700 transition-colors text-sm font-medium"
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <Link href="/auth/logout" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
            Sign out
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-60 p-8">{children}</main>
    </div>
  );
}
