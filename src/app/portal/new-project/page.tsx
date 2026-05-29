import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PortalIntakeForm } from "@/components/portal/PortalIntakeForm";

export const metadata = { title: "New Project — PixelPilot AI" };

export default async function NewProjectPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const adminSupabase = await createAdminClient();

  // Find client (with email fallback)
  let { data: client } = await adminSupabase
    .from("clients")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!client && user.email) {
    const { data: unlinked } = await adminSupabase
      .from("clients")
      .select("*")
      .eq("email", user.email)
      .is("user_id", null)
      .maybeSingle();
    if (unlinked) {
      await adminSupabase.from("clients").update({ user_id: user.id }).eq("id", unlinked.id);
      client = { ...unlinked, user_id: user.id };
    }
  }

  const isActive = ["active", "trialing"].includes(client?.subscription_status ?? "");

  // Pre-fill from account
  const name = user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "";
  const email = user.email ?? "";

  if (!isActive) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">New Project</h1>
        <p className="text-slate-500 text-sm mb-8">Subscribe to start building unlimited projects.</p>

        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-sm">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Subscribe to unlock unlimited projects</h2>
          <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
            For just $20/month you can create and run as many AI-powered websites, stores, landing pages,
            and blogs as you want — no extra charges per project.
          </p>

          <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left space-y-2">
            {[
              "Unlimited projects — websites, stores, landing pages, blogs",
              "Full AI generation: design + code + copy",
              "Unlimited revisions included",
              "Deployed on global CDN",
              "Cancel anytime",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
                <span className="text-violet-500">✓</span> {f}
              </div>
            ))}
          </div>

          <Link
            href="/pricing"
            className="inline-flex items-center justify-center bg-violet-600 text-white font-bold rounded-xl px-8 py-4 text-base hover:bg-violet-700 transition-colors"
          >
            Subscribe for $20/month →
          </Link>
          <p className="text-slate-400 text-xs mt-4">Cancel anytime from your billing dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-slate-900">New Project</h1>
          <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
            All Access ✓
          </span>
        </div>
        <p className="text-slate-500 text-sm">
          Describe your project and our AI will build it — usually within 24 hours.
        </p>
      </div>
      <PortalIntakeForm prefillName={name} prefillEmail={email} />
    </div>
  );
}
