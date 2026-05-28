import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("[stripe webhook] signature failed:", err);
    return NextResponse.json({ error: "Webhook signature failed" }, { status: 400 });
  }

  const supabase = await createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      id: string;
      customer?: string | null;
      customer_email?: string | null;
      metadata?: { projectId?: string };
    };

    const projectId = session.metadata?.projectId;
    if (!projectId) return NextResponse.json({ received: true });

    // Mark project as paid
    await supabase
      .from("projects")
      .update({
        stripe_session_id: session.id,
        paid_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    // Save Stripe customer ID on the client record so we can open billing portal later
    if (session.customer) {
      // Get the client_id from the project
      const { data: project } = await supabase
        .from("projects")
        .select("client_id")
        .eq("id", projectId)
        .single();

      if (project?.client_id) {
        await supabase
          .from("clients")
          .update({ stripe_customer_id: session.customer })
          .eq("id", project.client_id);
      }
    }

    // Trigger AI generation (fire and forget)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    fetch(`${appUrl}/api/ai/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    }).catch((err) => console.error("[stripe webhook] generate trigger failed:", err));
  }

  return NextResponse.json({ received: true });
}
