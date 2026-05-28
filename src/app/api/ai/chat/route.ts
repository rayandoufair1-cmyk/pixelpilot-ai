import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { chatWithClient } from "@/lib/ai/chat";

export async function POST(req: NextRequest) {
  try {
    const { projectId, message } = await req.json();
    const supabase = await createAdminClient();

    // Fetch project
    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Save user message
    await supabase.from("messages").insert({
      project_id: projectId,
      role: "user",
      content: message,
    });

    // Fetch conversation history
    const { data: history } = await supabase
      .from("messages")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true })
      .limit(20);

    // Generate AI response
    const reply = await chatWithClient(history || [], project);

    // Save assistant message
    const { data: savedMessage } = await supabase
      .from("messages")
      .insert({ project_id: projectId, role: "assistant", content: reply })
      .select()
      .single();

    return NextResponse.json({ message: savedMessage });
  } catch (error) {
    console.error("[ai/chat]", error);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
