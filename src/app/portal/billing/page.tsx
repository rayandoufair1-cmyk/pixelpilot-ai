import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { PROJECT_TYPE_ICONS, PROJECT_TYPE_LABELS } from "@/lib/pricing";
import type { Project } from "@/types";

export const metadata = { title: "Billing — PixelPilot AI" };

const STATUS_DISPLAY: Record<string, { label: string; color: string }> = {
  active:   { label: "Active",    color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  trialing: { label: "Trial",     color: "text-blue-600 bg-blue-50 border-blue-200" },
  past_due: { label: "Past Due",  color: "text-amber-600 bg-amber-50 border-amber-200" },
  canceled: { label: "Canceled",  color: "text-slate-500 bg-slate-50 border-slate-200" },
  inactive: { label: "Inactive",  color: "text-slate-500 bg-slate-50 border-slate-200" },
};

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

  const { data: client } = await adminSupabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: projects } = await adminSupabase
    .from("projects")
    .select("*")
    .eq("client_id", client?.id ?? "")
    .order("created_at", { ascending: false });

  const subStatus = client?.subscription_status ?? "inactive";
  const statusDisplay = STATUS_DISPLAY[subStatus] ?? STATUS_DISPLAY.inactive;
  const isActive = ["active", "trialing"].includes(subStatus);
  const hasStripeCustomer = !!client?.stripe_customer_id;
  const periodEnd = client?.subscription_period_end
    ? new Date(client.subscription_period_end).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Billing</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your subscription and projects</p>
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
          No billing history yet. Complete your first project to access the billing portal.
        </div>
      )}
      {error === "portal_failed" && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
          Couldn't open the billing portal. Email{" "}
          <a href="mailto:hello@pixelpilot.ai" className="underline font-medium">hello@pixelpilot.ai</a>.
        </div>
      )}

      {/* Subscription status card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-bold text-slate-900 mb-1">All Access Subscription</h2>
            <p className="text-slate-500 text-sm">Unlimited AI-powered projects · $20/month</p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusDisplay.color}`}>
            {statusDisplay.label}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">Status</div>
            {isActive ? (
              <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active
              </div>
            ) : (
              <div className="text-slate-600 font-semibold text-sm capitalize">{subStatus}</div>
            )}
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">Projects Built</div>
            <div className="text-slate-900 font-bold text-xl">{projects?.length ?? 0}</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">Next Renewal</div>
            <div className="text-slate-900 font-semibold text-sm">{periodEnd ?? "—"}</div>
          </div>
        </div>

        {!isActive && (
          <div className="mt-4">
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 bg-violet-600 text-white font-semibold rounded-xl px-6 py-3 text-sm hover:bg-violet-700 transition-colors"
            >
              Subscribe for $20/month →
            </a>
          </div>
        )}

        {isActive && hasStripeCustomer && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
            <a
              href="/api/billing/portal"
              className="text-sm text-slate-500 hover:text-violet-600 border border-slate-200 rounded-lg px-4 py-2 hover:border-violet-300 transition-colors"
            >
              Update payment method
            </a>
            <a
              href="/api/billing/portal"
              className="text-sm text-slate-500 hover:text-red-600 border border-slate-200 rounded-lg px-4 py-2 hover:border-red-300 transition-colors"
            >
              Cancel subscription
            </a>
          </div>
        )}
      </div>

      {/* Projects list */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Your Projects</h2>
          {isActive && (
            <a href="/portal/new-project" className="text-violet-600 text-sm font-medium hover:underline">
              + New Project
            </a>
          )}
        </div>

        {!projects?.length ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">🚀</div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No projects yet</h3>
            <p className="text-slate-500 text-sm mb-6">
              {isActive ? "Start your first project now — it's included in your subscription." : "Subscribe to start building."}
            </p>
            <a
              href={isActive ? "/portal/new-project" : "/pricing"}
              className="inline-flex items-center gap-2 bg-violet-600 text-white font-semibold rounded-xl px-6 py-3 text-sm hover:bg-violet-700 transition-colors"
            >
              {isActive ? "Start a Project →" : "Subscribe & Build →"}
            </a>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {(projects as Project[]).map((project) => (
              <a
                key={project.id}
                href={`/portal/project/${project.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-lg">
                    {PROJECT_TYPE_ICONS[project.project_type ?? "website"] ?? "🌐"}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{project.name}</div>
                    <div className="text-slate-400 text-xs mt-0.5">
                      {PROJECT_TYPE_LABELS[project.project_type ?? "website"] ?? "Website"} · {formatDate(project.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 capitalize">{project.status}</span>
                  {project.live_url && (
                    <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Refund policy */}
      <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-3">
        <span className="text-xl">🛡️</span>
        <div>
          <div className="font-semibold text-slate-800 text-sm mb-0.5">30-Day Money-Back Guarantee</div>
          <p className="text-slate-500 text-xs leading-relaxed">
            Not satisfied in your first 30 days? Email{" "}
            <a href="mailto:hello@pixelpilot.ai" className="text-violet-600 hover:underline">hello@pixelpilot.ai</a>{" "}
            for a full refund — no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}
