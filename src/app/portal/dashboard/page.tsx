import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { STATUS_LABELS, STATUS_COLORS, formatDate } from "@/lib/utils";
import { PROJECT_TYPE_ICONS, PROJECT_TYPE_LABELS } from "@/lib/pricing";
import type { Project } from "@/types";

export const metadata = { title: "My Projects — PixelPilot AI" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string; project?: string; created?: string }>;
}) {
  const { payment, created } = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  let { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  // Fallback: link client record by email
  if (!client && user.email) {
    const adminSupabase = await createAdminClient();
    const { data: unlinked } = await adminSupabase
      .from("clients")
      .select("*")
      .eq("email", user.email)
      .is("user_id", null)
      .maybeSingle();

    if (unlinked) {
      await adminSupabase
        .from("clients")
        .update({ user_id: user.id })
        .eq("id", unlinked.id);
      client = { ...unlinked, user_id: user.id };
    }
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", client?.id ?? "")
    .order("created_at", { ascending: false });

  const isActive = ["active", "trialing"].includes(client?.subscription_status ?? "");
  const isPastDue = client?.subscription_status === "past_due";

  return (
    <div className="max-w-4xl">
      {/* Payment / new project success banners */}
      {payment === "success" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <div className="font-semibold text-emerald-800">Subscribed! Your first project is starting.</div>
            <div className="text-emerald-600 text-sm">Our AI is reviewing your intake. You'll get an email when your design is ready.</div>
          </div>
        </div>
      )}
      {created === "true" && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <div className="font-semibold text-violet-800">New project launched!</div>
            <div className="text-violet-600 text-sm">AI generation has started. Check back in a few hours for your preview.</div>
          </div>
        </div>
      )}
      {isPastDue && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <div className="font-semibold text-amber-800">Payment failed — subscription paused</div>
            <div className="text-amber-600 text-sm">Update your payment method to keep creating projects.</div>
          </div>
          <a href="/api/billing/portal" className="bg-amber-500 text-white font-semibold rounded-lg px-4 py-2 text-sm hover:bg-amber-600 transition-colors">
            Fix Payment →
          </a>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
          <p className="text-slate-500 text-sm mt-1">
            {isActive ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-600 font-medium">Subscription active</span>
                <span className="text-slate-400">— unlimited projects included</span>
              </span>
            ) : (
              "Subscribe to start building AI-powered websites"
            )}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/portal/new-project">+ New Project</Link>
        </Button>
      </div>

      {!projects?.length ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No projects yet</h2>
          <p className="text-slate-500 mb-6">
            {isActive
              ? "You're subscribed! Start your first AI-powered project now."
              : "Subscribe for $20/month and start building unlimited projects today."}
          </p>
          <Button asChild>
            <Link href="/portal/new-project">
              {isActive ? "Start a Project →" : "Subscribe & Build →"}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project: Project) => (
            <Link
              key={project.id}
              href={`/portal/project/${project.id}`}
              className="block bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md hover:border-violet-200 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {PROJECT_TYPE_ICONS[project.project_type ?? "website"] ?? "🌐"}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-violet-700 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-slate-400 text-sm mt-0.5">
                      {PROJECT_TYPE_LABELS[project.project_type ?? "website"] ?? "Website"} · {formatDate(project.created_at)}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[project.status]}`}>
                  {STATUS_LABELS[project.status]}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Progress</span>
                  <span>{getProgress(project.status)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${getProgress(project.status)}%` }}
                  />
                </div>
              </div>

              {project.live_url && (
                <div className="mt-3 flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  Live: <span className="underline">{project.live_url}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function getProgress(status: string): number {
  const map: Record<string, number> = {
    intake: 10,
    generating: 35,
    review: 60,
    approved: 75,
    deploying: 90,
    live: 100,
  };
  return map[status] ?? 0;
}
