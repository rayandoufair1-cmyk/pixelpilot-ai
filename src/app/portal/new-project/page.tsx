import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NewProjectClient } from "@/components/portal/NewProjectClient";

export const metadata = { title: "New Project — PixelPilot AI" };

export default async function NewProjectPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Pre-fill contact info from the user's account
  const name =
    user.user_metadata?.full_name ??
    user.email?.split("@")[0] ??
    "";
  const email = user.email ?? "";

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Start a New Project</h1>
        <p className="text-slate-500 text-sm mt-1">
          Pick a plan, tell us about your business, and we'll build your site.
        </p>
      </div>
      <NewProjectClient prefillName={name} prefillEmail={email} />
    </div>
  );
}
