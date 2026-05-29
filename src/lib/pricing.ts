import type { SubscriptionPlan } from "@/types";

export const SUBSCRIPTION_PLAN: SubscriptionPlan = {
  id: "all-access",
  name: "All Access",
  price: 20,
  priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || "",
  description: "Unlimited AI-powered projects, every month",
  badge: "Cancel anytime",
  features: [
    "Unlimited projects — no caps, ever",
    "All project types: websites, stores, landing pages, blogs, portfolios",
    "Full AI generation: design + code + copy",
    "Mobile-responsive & SEO-optimized by default",
    "Unlimited revisions",
    "Priority AI generation queue",
    "Deployed on global CDN (Vercel)",
    "Email & chat support",
    "Cancel anytime — no lock-in",
  ],
};

/** Alias kept for components that haven't migrated yet */
export const PRICING_PLANS = [SUBSCRIPTION_PLAN];

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  website: "Business Website",
  landing: "Landing Page",
  ecommerce: "Online Store",
  blog: "Blog",
  portfolio: "Portfolio",
  saas: "SaaS Landing Page",
};

export const PROJECT_TYPE_ICONS: Record<string, string> = {
  website: "🌐",
  landing: "🎯",
  ecommerce: "🛒",
  blog: "✍️",
  portfolio: "🎨",
  saas: "⚡",
};
