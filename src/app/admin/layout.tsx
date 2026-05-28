import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full">
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
            <span className="text-xl">✦</span>
            <span>PixelPilot <span className="text-violet-400">AI</span></span>
          </Link>
          <div className="text-xs text-slate-500 mt-1">Admin Dashboard</div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: "/admin/dashboard", label: "Overview", icon: "📊" },
            { href: "/admin/projects", label: "All Projects", icon: "📁" },
            { href: "/admin/clients", label: "Clients", icon: "👥" },
            { href: "/admin/leads", label: "Leads", icon: "📩" },
            { href: "/admin/revenue", label: "Revenue", icon: "💰" },
          ].map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-sm font-medium"
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-300 transition-colors">← Back to site</Link>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8 text-white">{children}</main>
    </div>
  );
}
