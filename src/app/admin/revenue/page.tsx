import { createAdminClient } from "@/lib/supabase/server";
import { PRICING_PLANS } from "@/lib/pricing";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Project } from "@/types";

export const metadata = { title: "Revenue — Admin" };

export default async function AdminRevenuePage() {
  const supabase = await createAdminClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*, clients(name, email)")
    .not("paid_at", "is", null)
    .order("paid_at", { ascending: false });

  const paidProjects = (projects || []) as (Project & { clients: { name: string; email: string } })[];

  const total = paidProjects.reduce((sum, p) => {
    const plan = PRICING_PLANS.find((pl) => pl.id === p.tier);
    return sum + (plan?.price || 0);
  }, 0);

  const byTier = PRICING_PLANS.map((plan) => ({
    ...plan,
    count: paidProjects.filter((p) => p.tier === plan.id).length,
    revenue: paidProjects
      .filter((p) => p.tier === plan.id)
      .reduce((s) => s + plan.price, 0),
  }));

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-2">Revenue</h1>
      <p className="text-slate-400 mb-8">{paidProjects.length} paid projects</p>

      {/* Total + breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="sm:col-span-1 bg-emerald-900/40 border border-emerald-700 rounded-2xl p-5">
          <div className="text-slate-400 text-xs mb-1">Total Revenue</div>
          <div className="text-3xl font-black text-emerald-400">{formatCurrency(total)}</div>
        </div>
        {byTier.map((plan) => (
          <div key={plan.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="text-slate-400 text-xs mb-1 capitalize">{plan.name}</div>
            <div className="text-xl font-black text-white">{formatCurrency(plan.revenue)}</div>
            <div className="text-slate-500 text-xs mt-1">{plan.count} project{plan.count !== 1 ? "s" : ""}</div>
          </div>
        ))}
      </div>

      {/* Transaction list */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">CLIENT</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">PROJECT</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">TIER</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">AMOUNT</th>
              <th className="text-left text-slate-400 text-xs font-medium px-6 py-4">DATE</th>
            </tr>
          </thead>
          <tbody>
            {paidProjects.map((p) => {
              const plan = PRICING_PLANS.find((pl) => pl.id === p.tier);
              return (
                <tr key={p.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <div className="text-slate-200 text-sm font-medium">{p.clients?.name}</div>
                    <div className="text-slate-500 text-xs">{p.clients?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{p.name}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm capitalize">{p.tier}</td>
                  <td className="px-6 py-4 text-emerald-400 text-sm font-semibold">
                    {formatCurrency(plan?.price || 0)}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    {p.paid_at ? formatDate(p.paid_at) : "—"}
                  </td>
                </tr>
              );
            })}
            {!paidProjects.length && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No payments yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
