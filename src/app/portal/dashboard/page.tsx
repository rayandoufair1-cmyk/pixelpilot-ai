import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { STATUS_LABELS, STATUS_COLORS, formatDate } from "@/lib/utils";
import type { Project } from "@/types";

export const metadata = { title: "My Projects — PixelPilot AI" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string; project?: string }>;
}) {
  const { payment } = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", client?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl">
      {payment === "success" && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <div className="font-semibold text-emerald-800">Payment confirmed! Your project is starting.</div>
            <div className="text-emerald-600 text-sm">Our AI is reviewing your intake details. You'll get an email when your design is ready.</div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
          <p className="text-slate-500 text-sm mt-1">Track your website builds from intake to live</p>
        </div>
        <Button asChild size="sm">
          <Link href="/pricing">+ New Project</Link>
        </Button>
      </div>

      {!projects?.length ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No projects yet</h2>
          <p className="text-slate-500 mb-6">Start your first AI-powered website project today.</p>
          <Button asChild>
            <Link href="/pricing">Get Started →</Link>
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
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-violet-700 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-slate-400 text-sm mt-0.5">{formatDate(project.created_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[project.status]}`}>
                    {STATUS_LABELS[project.status]}
                  </span>
                  <Badge variant="purple">{project.tier}</Badge>
                </div>
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
