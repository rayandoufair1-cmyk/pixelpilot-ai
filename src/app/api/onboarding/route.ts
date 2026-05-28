import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/lib/stripe";
import { sendWelcomeEmail } from "@/lib/email";
import { PRICING_PLANS } from "@/lib/pricing";
import { z } from "zod";

const onboardingSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional(),
  tier: z.enum(["starter", "pro", "enterprise"]),
  intake: z.object({
    business_name: z.string().min(1),
    business_type: z.string().min(1),
    description: z.string().min(10),
    target_audience: z.string().min(1),
    color_palette: z.string(),
    style: z.enum(["modern", "classic", "minimal", "bold", "playful"]),
    pages: z.array(z.string()),
    features: z.array(z.string()),
    competitors: z.string().optional(),
    brand_colors: z.array(z.string()).optional(),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = onboardingSchema.parse(body);
    const supabase = await createAdminClient();

    // Upsert client
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .upsert({ email: data.email, name: data.name, company: data.company, phone: data.phone })
      .select()
      .single();

    if (clientError) throw clientError;

    // Create project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        client_id: client.id,
        name: `${data.intake.business_name} Website`,
        status: "intake",
        tier: data.tier,
        intake_data: data.intake,
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // Insert lead record
    await supabase.from("leads").insert({
      name: data.name,
      email: data.email,
      company: data.company,
    });

    // Create Stripe checkout session
    const plan = PRICING_PLANS.find((p) => p.id === data.tier)!;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const session = await createCheckoutSession(
      plan.priceId,
      data.email,
      project.id,
      `${appUrl}/portal/dashboard?payment=success&project=${project.id}`,
      `${appUrl}/pricing?cancelled=true`
    );

    // Send welcome email (non-blocking)
    sendWelcomeEmail(data.email, data.name, project.id).catch(console.error);

    return NextResponse.json({ checkoutUrl: session.url, projectId: project.id });
  } catch (error) {
    console.error("[onboarding]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
