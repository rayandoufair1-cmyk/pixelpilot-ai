import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { STATUS_LABELS, STATUS_COLORS, formatDate, formatCurrency } from "@/lib/utils";
import { PRICING_PLANS } from "@/lib/pricing";
import type { Project } from "@/types";

export const metadata = { title: "Admin — PixelPilot AI" };

export default async function AdminDashboard() {
  const supabase = await createAdminClient();

  const [{ data: projects }, { data: clients }, { data: leads }] = await Promise.all([
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase.from("clients").select("*").order("created_at", { ascending: false }),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const revenue = (projects || [])
    .filter((p: Project) => p.paid_at)
    .reduce((sum: number, p: Project) => {
      const plan = PRICING_PLANS.find((pl) => pl.id === p.tier);
      return sum + (plan?.price || 0);
    }, 0);

  const stats = [
    { label: "Total Revenue", value: formatCurrency(revenue), icon: "💰", color: "text-emerald-400" },
    { label: "Total Projects", value: projects?.length ?? 0, icon: "📁", color: "text-violet-400" },
    { label: "Active Clients", value: clients?.length ?? 0, icon: "👥", color: "text-blue-400" },
    {
      label: "Live Sites",
      value: projects?.filter((p: Project) => p.status === "live").length ?? 0,
      icon: "🚀",
      color: "text-amber-400",
    },
  ];

  const statusBreakdown = ["intake", "generating", "review", "approved", "deploying", "live"].map(
    (status) => ({
      status,
      count: projects?.filter((p: Project) => p.status === status).length ?? 0,
    })
  );

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Overview</h1>
          <p className="text-slate-400 text-sm mt-1">All projects, clients, and revenue at a glance</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon, color }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="text-2xl mb-2">{icon}</div>
            <div className={`text-2xl font-black ${color}`}>{value}</div>
            <div className="text-slate-400 text-sm mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project pipeline */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">Recent Projects</h2>
            <Link href="/admin/projects" className="text-violet-400 text-sm hover:text-violet-300 transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {(projects || []).slice(0, 6).map((project: Project) => (
              <div key={project.id} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                <div>
                  <div className="text-slate-200 text-sm font-medium">{project.name}</div>
                  <div className="text-slate-500 text-xs">{formatDate(project.created_at)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[project.status]}`}>
                    {STATUS_LABELS[project.status]}
                  </span>
                  {project.status === "review" && (
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full hover:bg-violet-500 transition-colors"
                    >
                      Deploy →
                    </Link>
                  )}
                </div>
              </div>
            ))}
            {!projects?.length && (
              <div className="text-slate-500 text-sm py-6 text-center">No projects yet</div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Status breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="font-bold text-white mb-4">Pipeline Status</h2>
            <div className="space-y-2">
              {statusBreakdown.filter(({ count }) => count > 0).map(({ status, count }) => (
                <div key={status} className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}>
                    {STATUS_LABELS[status]}
                  </span>
                  <span className="text-slate-300 font-bold text-sm">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent leads */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">Recent Leads</h2>
              <Link href="/admin/leads" className="text-violet-400 text-sm hover:text-violet-300">View all →</Link>
            </div>
            <div className="space-y-3">
              {(leads || []).map((lead: { id: string; name: string; email: string; created_at: string }) => (
                <div key={lead.id} className="border-b border-slate-800 pb-3 last:border-0">
                  <div className="text-slate-200 text-sm font-medium">{lead.name}</div>
                  <div className="text-slate-500 text-xs">{lead.email}</div>
                </div>
              ))}
              {!leads?.length && <div className="text-slate-500 text-sm">No leads yet</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
