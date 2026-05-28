import { createClient } from "@/lib/supabase/server";
import { PortalSidebar } from "@/components/portal/PortalSidebar";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ??
    user?.email?.split("@")[0] ??
    "there";

  const email = user?.email ?? "";

  const isAdmin =
    !!process.env.ADMIN_EMAIL && user?.email === process.env.ADMIN_EMAIL;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <PortalSidebar firstName={firstName} email={email} isAdmin={isAdmin} />
      <main className="flex-1 ml-60 p-8">{children}</main>
    </div>
  );
}
