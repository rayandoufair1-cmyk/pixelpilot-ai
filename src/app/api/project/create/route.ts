import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { PROJECT_TYPE_LABELS } from "@/lib/pricing";
import { z } from "zod";

const createSchema = z.object({
  intake: z.object({
    project_type: z.string().min(1),
    business_name: z.string().min(1),
    business_type: z.string().min(1),
    description: z.string().min(10),
    target_audience: z.string().min(1),
    color_palette: z.string(),
    style: z.enum(["modern", "classic", "minimal", "bold", "playful"]),
    pages: z.array(z.string()),
    features: z.array(z.string()),
    competitors: z.string().optional(),
  }),
});

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

export async function POST(req: NextRequest) {
  try {
    // Auth
    const userClient = await createClient();
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const supabase = await createAdminClient();

    // Find client + check subscription
    let { data: client } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    // Email fallback — link unattached client
    if (!client && user.email) {
      const { data: unlinked } = await supabase
        .from("clients")
        .select("*")
        .eq("email", user.email)
        .is("user_id", null)
        .maybeSingle();
      if (unlinked) {
        await supabase.from("clients").update({ user_id: user.id }).eq("id", unlinked.id);
        client = { ...unlinked, user_id: user.id };
      }
    }

    if (!client) {
      return NextResponse.json(
        { error: "No account found. Please subscribe first." },
        { status: 403 }
      );
    }

    if (!ACTIVE_STATUSES.has(client.subscription_status ?? "")) {
      return NextResponse.json(
        { error: "An active subscription is required to create projects." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const data = createSchema.parse(body);

    const typeLabel = PROJECT_TYPE_LABELS[data.intake.project_type] ?? "Website";
    const projectName = `${data.intake.business_name} ${typeLabel}`;

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        client_id: client.id,
        name: projectName,
        status: "intake",
        project_type: data.intake.project_type,
        tier: "subscription",
        intake_data: data.intake,
        paid_at: new Date().toISOString(), // subscription already paid
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // Kick off AI generation (fire and forget)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    fetch(`${appUrl}/api/ai/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id }),
    }).catch((err) => console.error("[project/create] generate trigger failed:", err));

    return NextResponse.json({ projectId: project.id });
  } catch (error) {
    console.error("[project/create]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
