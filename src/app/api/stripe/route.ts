import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("[stripe webhook] signature failed:", err);
    return NextResponse.json({ error: "Webhook signature failed" }, { status: 400 });
  }

  const supabase = await createAdminClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pixelpilot-ai-lac.vercel.app";

  // ─── Subscription checkout completed ────────────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const projectId = session.metadata?.projectId;

    // Activate subscription on the client record
    const email = session.customer_email ?? session.customer_details?.email;
    if (email) {
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id ?? null;

      await supabase
        .from("clients")
        .update({
          stripe_customer_id: session.customer as string,
          ...(subscriptionId && {
            subscription_id: subscriptionId,
            subscription_status: "active",
          }),
        })
        .eq("email", email);
    }

    // Mark the initial project as paid and kick off AI generation
    if (projectId) {
      await supabase
        .from("projects")
        .update({ stripe_session_id: session.id, paid_at: new Date().toISOString() })
        .eq("id", projectId);

      fetch(`${appUrl}/api/ai/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      }).catch((err) => console.error("[stripe webhook] generate trigger failed:", err));
    }
  }

  // ─── Subscription updated (renewals, plan changes, payment failures) ─────────
  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    // current_period_end exists at runtime but the TypeScript types for this
    // Stripe API version may not expose it — access safely via index signature
    const rawSub = sub as unknown as Record<string, unknown>;
    const periodEnd = typeof rawSub.current_period_end === "number"
      ? new Date(rawSub.current_period_end * 1000).toISOString()
      : undefined;

    await supabase
      .from("clients")
      .update({
        subscription_status: sub.status as string,
        ...(periodEnd && { subscription_period_end: periodEnd }),
      })
      .eq("subscription_id", sub.id);
  }

  // ─── Subscription cancelled ──────────────────────────────────────────────────
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    await supabase
      .from("clients")
      .update({ subscription_status: "canceled" })
      .eq("subscription_id", sub.id);
  }

  // ─── Invoice paid — keep status in sync ─────────────────────────────────────
  if (event.type === "invoice.paid") {
    // The `dahlia` API version restructured Invoice — access subscription safely
    const rawInvoice = event.data.object as unknown as Record<string, unknown>;
    const sub = rawInvoice.subscription;
    const subId = typeof sub === "string" ? sub : (sub as Record<string, unknown> | null)?.id as string | null ?? null;

    if (subId) {
      await supabase
        .from("clients")
        .update({ subscription_status: "active" })
        .eq("subscription_id", subId);
    }
  }

  // ─── Payment failed ──────────────────────────────────────────────────────────
  if (event.type === "invoice.payment_failed") {
    const rawInvoice = event.data.object as unknown as Record<string, unknown>;
    const sub = rawInvoice.subscription;
    const subId = typeof sub === "string" ? sub : (sub as Record<string, unknown> | null)?.id as string | null ?? null;

    if (subId) {
      await supabase
        .from("clients")
        .update({ subscription_status: "past_due" })
        .eq("subscription_id", subId);
    }
  }

  return NextResponse.json({ received: true });
}
