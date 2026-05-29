import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { createSubscriptionCheckout } from "@/lib/stripe";
import { sendWelcomeEmail } from "@/lib/email";
import { SUBSCRIPTION_PLAN } from "@/lib/pricing";
import { z } from "zod";

const onboardingSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  phone: z.string().optional(),
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
    brand_colors: z.array(z.string()).optional(),
  }),
});

const PLACEHOLDER_PRICE_IDS = new Set(["", "price_starter", "price_pro", "price_enterprise"]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = onboardingSchema.parse(body);
    const supabase = await createAdminClient();

    // Validate Stripe keys
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Payment system not configured. Please contact hello@pixelpilot.ai." },
        { status: 503 }
      );
    }

    const priceId = SUBSCRIPTION_PLAN.priceId;
    if (!priceId || PLACEHOLDER_PRICE_IDS.has(priceId)) {
      console.error("[onboarding] Stripe price ID not configured. Set NEXT_PUBLIC_STRIPE_PRICE_ID.");
      return NextResponse.json(
        { error: "Our payment system is being set up — please contact hello@pixelpilot.ai." },
        { status: 503 }
      );
    }

    // Upsert client
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .upsert(
        { email: data.email, name: data.name, company: data.company, phone: data.phone },
        { onConflict: "email" }
      )
      .select()
      .single();

    if (clientError) throw clientError;

    // Create project (intake status — AI runs after payment confirmed by webhook)
    const projectName =
      `${data.intake.business_name} ` +
      ({ website: "Website", landing: "Landing Page", ecommerce: "Online Store",
         blog: "Blog", portfolio: "Portfolio", saas: "SaaS Page" }[data.intake.project_type] ?? "Website");

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        client_id: client.id,
        name: projectName,
        status: "intake",
        project_type: data.intake.project_type,
        tier: "subscription",
        intake_data: data.intake,
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // Insert lead record (best effort)
    supabase
      .from("leads")
      .insert({ name: data.name, email: data.email, company: data.company })
      .then(undefined, (e) => console.error("[onboarding] lead insert failed:", e));

    // Create Stripe subscription checkout
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const session = await createSubscriptionCheckout(
      priceId,
      data.email,
      project.id,
      `${appUrl}/portal/dashboard?payment=success&project=${project.id}`,
      `${appUrl}/pricing?cancelled=true`
    );

    // Send welcome email (non-blocking)
    sendWelcomeEmail(data.email, data.name, project.id).catch((e) =>
      console.error("[onboarding] welcome email failed:", e)
    );

    return NextResponse.json({ checkoutUrl: session.url, projectId: project.id });
  } catch (error) {
    console.error("[onboarding]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Please fill in all required fields correctly." },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message.includes("No such price")) {
      return NextResponse.json(
        { error: "Payment configuration error. Please contact hello@pixelpilot.ai." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong. Please try again or email hello@pixelpilot.ai." },
      { status: 500 }
    );
  }
}
