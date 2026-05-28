import { createAdminClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Leads — Admin" };

export default async function AdminLeadsPage() {
  const supabase = await createAdminClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-2">Leads</h1>
      <p className="text-slate-400 mb-8">{leads?.length ?? 0} total leads from contact form</p>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">NAME</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">EMAIL</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">MESSAGE</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">DATE</th>
            </tr>
          </thead>
          <tbody>
            {(leads || []).map((l) => (
              <tr key={l.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50">
                <td className="px-6 py-4 text-slate-200 text-sm font-medium">{l.name}</td>
                <td className="px-6 py-4">
                  <a href={`mailto:${l.email}`} className="text-violet-400 hover:text-violet-300 text-sm">
                    {l.email}
                  </a>
                </td>
                <td className="px-6 py-4 text-slate-400 text-sm max-w-xs truncate">{l.message || "—"}</td>
                <td className="px-6 py-4 text-slate-400 text-sm">{formatDate(l.created_at)}</td>
              </tr>
            ))}
            {!leads?.length && (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500">No leads yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
