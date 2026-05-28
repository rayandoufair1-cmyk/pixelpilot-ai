import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { generateWebsite } from "@/lib/ai/generate";
import { sendDesignReadyEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { projectId } = await req.json();
    const supabase = await createAdminClient();

    // Fetch project + client
    const { data: project, error } = await supabase
      .from("projects")
      .select("*, clients(*)")
      .eq("id", projectId)
      .single();

    if (error || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Mark as generating
    await supabase
      .from("projects")
      .update({ status: "generating" })
      .eq("id", projectId);

    // Generate website with Claude
    const html = await generateWebsite(project.intake_data);

    // Store generated code and move to review
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const previewPath = `/api/preview/${projectId}`;
    await supabase.from("projects").update({
      generated_code: html,
      status: "review",
      preview_url: `${appUrl}${previewPath}`,
    }).eq("id", projectId);

    // Notify client
    const client = project.clients as { email: string; name: string };
    if (client) {
      await sendDesignReadyEmail(
        client.email,
        client.name,
        projectId,
        `${appUrl}/portal/project/${projectId}`
      );
    }

    return NextResponse.json({ success: true, projectId });
  } catch (error) {
    console.error("[ai/generate]", error);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
