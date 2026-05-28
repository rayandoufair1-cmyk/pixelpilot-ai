import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { projectId } = await req.json();
    const supabase = await createAdminClient();
    await supabase.from("projects").update({ status: "approved" }).eq("id", projectId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to approve" }, { status: 500 });
  }
}
