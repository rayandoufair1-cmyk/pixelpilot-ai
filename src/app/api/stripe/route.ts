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
    return NextResponse.json({ error: "Webhook signature failed" }, { status: 400 });
  }

  const supabase = await createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { metadata?: { projectId?: string }; id: string };
    const projectId = session.metadata?.projectId;
    if (!projectId) return NextResponse.json({ received: true });

    // Mark project as paid, trigger generation
    await supabase.from("projects").update({
      stripe_session_id: session.id,
      paid_at: new Date().toISOString(),
    }).eq("id", projectId);

    // Trigger AI generation via internal API call
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    fetch(`${appUrl}/api/ai/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    }).catch(console.error);
  }

  return NextResponse.json({ received: true });
}
