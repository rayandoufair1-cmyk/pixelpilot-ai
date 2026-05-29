"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/portal/dashboard", label: "My Projects", icon: "📁" },
  { href: "/portal/new-project", label: "New Project", icon: "✦" },
  { href: "/portal/billing", label: "Billing", icon: "💳" },
  { href: "/portal/support", label: "Support", icon: "💬" },
  { href: "/portal/settings", label: "Settings", icon: "⚙️" },
];

interface PortalSidebarProps {
  firstName: string;
  email: string;
  isAdmin: boolean;
}

export function PortalSidebar({ firstName, email, isAdmin }: PortalSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900">
          <span className="text-xl">✦</span>
          <span>
            PixelPilot <span className="text-violet-600">AI</span>
          </span>
        </Link>
        <div className="text-xs text-slate-400 mt-1">Client Portal</div>
      </div>

      {/* User greeting */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-sm flex-shrink-0">
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-800 truncate">
              Hi, {firstName} 👋
            </div>
            <div className="text-xs text-slate-400 truncate">{email}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span>{icon}</span>
              {label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />}
            </Link>
          );
        })}

        {/* Admin link — only visible to admin */}
        {isAdmin && (
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors mt-4 border border-amber-200"
          >
            <span>🔐</span>
            Admin Panel
          </Link>
        )}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-slate-100">
        <Link
          href="/auth/logout"
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-red-500 transition-colors"
        >
          <span>↩</span> Sign out
        </Link>
      </div>
    </aside>
  );
}
