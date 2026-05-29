import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

/** @deprecated Use createSubscriptionCheckout for new projects */
export async function createPaymentIntent(
  amount: number,
  metadata: Record<string, string>
) {
  return stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
    metadata,
    automatic_payment_methods: { enabled: true },
  });
}

/**
 * Creates a Stripe Subscription checkout session.
 * Used for the first project — the subscription covers all future projects.
 */
export async function createSubscriptionCheckout(
  priceId: string,
  clientEmail: string,
  projectId: string,
  successUrl: string,
  cancelUrl: string
) {
  return stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: clientEmail,
    metadata: { projectId },
    subscription_data: {
      metadata: { projectId },
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}

/** @deprecated — kept for backward compat with old one-time checkouts */
export async function createCheckoutSession(
  priceId: string,
  clientEmail: string,
  projectId: string,
  successUrl: string,
  cancelUrl: string
) {
  return stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: clientEmail,
    metadata: { projectId },
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
}
