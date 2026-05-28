export type ProjectStatus =
  | "intake"
  | "generating"
  | "review"
  | "approved"
  | "deploying"
  | "live";

export type PricingTier = "starter" | "pro" | "enterprise";

export interface Client {
  id: string;
  email: string;
  name: string;
  company?: string;
  phone?: string;
  created_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  name: string;
  status: ProjectStatus;
  tier: PricingTier;
  intake_data: IntakeData;
  generated_code?: string;
  preview_url?: string;
  live_url?: string;
  stripe_payment_intent_id?: string;
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

export interface PricingPlan {
  id: PricingTier;
  name: string;
  price: number;
  description: string;
  features: string[];
  priceId: string;
  popular?: boolean;
}
