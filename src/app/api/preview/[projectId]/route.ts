import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const supabase = await createAdminClient();

  const { data: project } = await supabase
    .from("projects")
    .select("generated_code")
    .eq("id", projectId)
    .single();

  if (!project?.generated_code) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(project.generated_code, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
