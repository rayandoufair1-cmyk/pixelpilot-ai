import { createAdminClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Client } from "@/types";

export const metadata = { title: "Clients — Admin" };

export default async function AdminClientsPage() {
  const supabase = await createAdminClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("*, projects(count)")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-2">Clients</h1>
      <p className="text-slate-400 mb-8">{clients?.length ?? 0} total clients</p>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">NAME</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">EMAIL</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">COMPANY</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">JOINED</th>
            </tr>
          </thead>
          <tbody>
            {(clients || []).map((c: Client) => (
              <tr key={c.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50">
                <td className="px-6 py-4 text-slate-200 text-sm font-medium">{c.name}</td>
                <td className="px-6 py-4 text-slate-300 text-sm">{c.email}</td>
                <td className="px-6 py-4 text-slate-400 text-sm">{c.company || "—"}</td>
                <td className="px-6 py-4 text-slate-400 text-sm">{formatDate(c.created_at)}</td>
              </tr>
            ))}
            {!clients?.length && (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No clients yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
