import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/portal/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Link client record to this auth user if not already linked
      const user = data.user;
      if (user?.email) {
        try {
          const adminSupabase = await createAdminClient();
          const { data: existingClient } = await adminSupabase
            .from("clients")
            .select("id, user_id")
            .eq("email", user.email)
            .is("user_id", null)
            .maybeSingle();

          if (existingClient) {
            await adminSupabase
              .from("clients")
              .update({ user_id: user.id })
              .eq("id", existingClient.id);
          }
        } catch {
          // Non-fatal — dashboard has a fallback
        }
      }

      // Password reset emails redirect to reset-password page
      const type = searchParams.get("type");
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/auth/reset-password`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
