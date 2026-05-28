import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PRICING_PLANS } from "@/lib/pricing";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Project } from "@/types";

export const metadata = { title: "Billing — PixelPilot AI" };

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const adminSupabase = await createAdminClient();

  // Get client record
  const { data: client } = await adminSupabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  // Get paid projects
  const { data: projects } = await adminSupabase
    .from("projects")
    .select("*")
    .eq("client_id", client?.id ?? "")
    .not("paid_at", "is", null)
    .order("paid_at", { ascending: false });

  const totalSpent = (projects || []).reduce((sum, p: Project) => {
    const plan = PRICING_PLANS.find((pl) => pl.id === p.tier);
    return sum + (plan?.price ?? 0);
  }, 0);

  const hasStripeCustomer = !!client?.stripe_customer_id;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Billing</h1>
          <p className="text-slate-500 text-sm mt-1">Your payment history and invoices</p>
        </div>
        {hasStripeCustomer && (
          <a
            href="/api/billing/portal"
            className="bg-violet-600 text-white font-semibold rounded-xl px-5 py-2.5 text-sm hover:bg-violet-700 transition-colors"
          >
            Manage Billing →
          </a>
        )}
      </div>

      {/* Error banners */}
      {error === "no_billing_yet" && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl p-4 mb-6 text-sm">
          You don't have any billing history yet. Complete a project purchase to access the billing portal.
        </div>
      )}
      {error === "portal_failed" && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
          Couldn't open the billing portal. Please email us at{" "}
          <a href="mailto:hello@pixelpilot.ai" className="underline font-medium">
            hello@pixelpilot.ai
          </a>{" "}
          for invoice requests.
        </div>
      )}

      {/* Summary card */}
      {projects && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">
              Total Spent
            </div>
            <div className="text-2xl font-black text-violet-600">{formatCurrency(totalSpent)}</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">
              Projects
            </div>
            <div className="text-2xl font-black text-slate-900">{projects.length}</div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">
              Status
            </div>
            <div className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Account active
            </div>
          </div>
        </div>
      )}

      {/* Payment history */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">Payment History</h2>
        </div>

        {!projects?.length ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">💳</div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No payments yet</h3>
            <p className="text-slate-500 text-sm mb-6">
              Your invoices will appear here after your first project purchase.
            </p>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 bg-violet-600 text-white font-semibold rounded-xl px-6 py-3 text-sm hover:bg-violet-700 transition-colors"
            >
              Start a Project →
            </a>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {(projects as Project[]).map((project) => {
              const plan = PRICING_PLANS.find((p) => p.id === project.tier);
              return (
                <div
                  key={project.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-lg">
                      🌐
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{project.name}</div>
                      <div className="text-slate-400 text-xs mt-0.5">
                        {plan?.name} Plan · {formatDate(project.paid_at!)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-bold text-slate-900">
                        {formatCurrency(plan?.price ?? 0)}
                      </div>
                      <div className="text-xs text-emerald-600 font-medium">Paid ✓</div>
                    </div>
                    {hasStripeCustomer && (
                      <a
                        href="/api/billing/portal"
                        className="text-xs text-slate-400 hover:text-violet-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:border-violet-300 transition-colors"
                      >
                        Invoice
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Refund policy */}
      <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-3">
        <span className="text-xl">🛡️</span>
        <div>
          <div className="font-semibold text-slate-800 text-sm mb-0.5">30-Day Money-Back Guarantee</div>
          <p className="text-slate-500 text-xs leading-relaxed">
            Not satisfied with your website? Email{" "}
            <a href="mailto:hello@pixelpilot.ai" className="text-violet-600 hover:underline">
              hello@pixelpilot.ai
            </a>{" "}
            within 30 days of delivery for a full refund — no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}
