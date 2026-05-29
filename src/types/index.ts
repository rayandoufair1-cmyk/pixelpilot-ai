export type ProjectStatus =
  | "intake"
  | "generating"
  | "review"
  | "approved"
  | "deploying"
  | "live";

export type ProjectType =
  | "website"
  | "landing"
  | "ecommerce"
  | "blog"
  | "portfolio"
  | "saas";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "inactive";

// Legacy — kept so old DB rows don't break reads
export type PricingTier = "starter" | "pro" | "enterprise" | "subscription";

export interface Client {
  id: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  user_id?: string;
  stripe_customer_id?: string;
  subscription_id?: string;
  subscription_status?: SubscriptionStatus;
  subscription_period_end?: string;
  created_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  status: ProjectStatus;
  project_type?: ProjectType;
  /** Legacy column — still present on old rows */
  tier?: PricingTier;
  intake_data: IntakeData;
  generated_code?: string;
  preview_url?: string;
  live_url?: string;
  stripe_session_id?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface IntakeData {
  business_name: string;
  business_type: string;
  description: string;
  target_audience: string;
  color_palette: string;
  style: "modern" | "classic" | "minimal" | "bold" | "playful";
  pages: string[];
  features: string[];
  project_type?: string;
  competitors?: string;
  logo_url?: string;
  brand_colors?: string[];
}

export interface Message {
  id: string;
  project_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  priceId: string;
  description: string;
  features: string[];
  badge?: string;
}

/** @deprecated Use SubscriptionPlan */
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  priceId: string;
  popular?: boolean;
}
