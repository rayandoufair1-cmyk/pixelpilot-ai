import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const STATUS_LABELS: Record<string, string> = {
  intake: "Intake",
  generating: "AI Generating",
  review: "In Review",
  approved: "Approved",
  deploying: "Deploying",
  live: "Live",
};

export const STATUS_COLORS: Record<string, string> = {
  intake: "bg-gray-100 text-gray-700",
  generating: "bg-blue-100 text-blue-700",
  review: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  deploying: "bg-purple-100 text-purple-700",
  live: "bg-emerald-100 text-emerald-700",
};
