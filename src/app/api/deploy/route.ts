import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendGoLiveEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { projectId } = await req.json();
    const supabase = await createAdminClient();

    const { data: project } = await supabase
      .from("projects")
      .select("*, clients(*)")
      .eq("id", projectId)
      .single();

    if (!project || project.status !== "approved") {
      return NextResponse.json({ error: "Project not ready for deployment" }, { status: 400 });
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

    const client = project.clients as { email: string; name: string };
    if (client) {
      await sendGoLiveEmail(client.email, client.name, liveUrl);
    }

    return NextResponse.json({ success: true, liveUrl });
  } catch (error) {
    console.error("[deploy]", error);
    return NextResponse.json({ error: "Deployment failed" }, { status: 500 });
  }
}
