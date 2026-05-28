import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { projectId } = await req.json();

    // Verify user is authenticated
    const userClient = await createClient();
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createAdminClient();

    // Verify the project belongs to this user
    const { data: project } = await supabase
      .from("projects")
      .select("id, clients!inner(user_id)")
      .eq("id", projectId)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const clientRecord = project.clients as unknown as { user_id: string };
    if (clientRecord.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await supabase.from("projects").update({ status: "approved" }).eq("id", projectId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to approve" }, { status: 500 });
  }
}
