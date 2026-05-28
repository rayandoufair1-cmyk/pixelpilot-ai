import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  try {
    // Auth check
    const userClient = await createClient();
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const supabase = await createAdminClient();

    // Get client record with stripe_customer_id
    const { data: client } = await supabase
      .from("clients")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!client?.stripe_customer_id) {
      // No billing history yet — redirect back with message
      return NextResponse.redirect(
        new URL("/portal/billing?error=no_billing_yet", req.url)
      );
    }

    // Create Stripe Customer Portal session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const session = await stripe.billingPortal.sessions.create({
      customer: client.stripe_customer_id,
      return_url: `${appUrl}/portal/billing`,
    });

    return NextResponse.redirect(session.url);
  } catch (error) {
    console.error("[billing/portal]", error);
    return NextResponse.redirect(
      new URL("/portal/billing?error=portal_failed", req.url)
    );
  }
}
