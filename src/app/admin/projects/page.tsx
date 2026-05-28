import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { STATUS_LABELS, STATUS_COLORS, formatDate } from "@/lib/utils";
import type { Project } from "@/types";

export const metadata = { title: "All Projects — Admin" };

export default async function AdminProjectsPage() {
  const supabase = await createAdminClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*, clients(name, email)")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold text-white mb-2">All Projects</h1>
      <p className="text-slate-400 mb-8">{projects?.length ?? 0} total projects</p>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">PROJECT</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">CLIENT</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">STATUS</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">TIER</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">DATE</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {(projects || []).map((p: Project & { clients: { name: string; email: string } }) => (
              <tr key={p.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 text-slate-200 text-sm font-medium">{p.name}</td>
                <td className="px-6 py-4">
                  <div className="text-slate-200 text-sm">{p.clients?.name}</div>
                  <div className="text-slate-500 text-xs">{p.clients?.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[p.status]}`}>
                    {STATUS_LABELS[p.status]}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-300 text-sm capitalize">{p.tier}</td>
                <td className="px-6 py-4 text-slate-400 text-sm">{formatDate(p.created_at)}</td>
                <td className="px-6 py-4">
                  {p.preview_url && (
                    <a href={p.preview_url} target="_blank" rel="noopener noreferrer"
                      className="text-violet-400 hover:text-violet-300 text-xs underline">
                      Preview
                    </a>
                  )}
                  {p.live_url && (
                    <a href={p.live_url} target="_blank" rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 text-xs underline ml-3">
                      Live ↗
                    </a>
                  )}
                </td>
              </tr>
            ))}
            {!projects?.length && (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No projects yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
