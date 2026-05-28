import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { sendGoLiveEmail } from "@/lib/email";

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

    const { data: project } = await supabase
      .from("projects")
      .select("*, clients(*)")
      .eq("id", projectId)
      .single();

    if (!project || project.status !== "approved") {
      return NextResponse.json({ error: "Project not ready for deployment" }, { status: 400 });
    }

    // Verify the project belongs to this user
    const clientRecord = project.clients as { user_id: string; email: string; name: string };
    if (clientRecord.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await supabase.from("projects").update({ status: "deploying" }).eq("id", projectId);

    // Deploy to Vercel via API
    const deployResponse = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `pixelpilot-${projectId.slice(0, 8)}`,
        files: [
          {
            file: "index.html",
            data: project.generated_code,
            encoding: "utf-8",
          },
        ],
        projectSettings: { framework: null },
        teamId: process.env.VERCEL_TEAM_ID,
      }),
    });

    const deployment = await deployResponse.json();
    if (!deployResponse.ok) throw new Error(deployment.error?.message || "Deploy failed");

    const liveUrl = `https://${deployment.url}`;

    await supabase.from("projects").update({
      status: "live",
      live_url: liveUrl,
    }).eq("id", projectId);

    if (clientRecord) {
      await sendGoLiveEmail(clientRecord.email, clientRecord.name, liveUrl);
    }

    return NextResponse.json({ success: true, liveUrl });
  } catch (error) {
    console.error("[deploy]", error);
    return NextResponse.json({ error: "Deployment failed" }, { status: 500 });
  }
}
