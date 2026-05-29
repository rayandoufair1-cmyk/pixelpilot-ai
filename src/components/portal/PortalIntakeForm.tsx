"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  business_type: z.string().min(1, "Business type is required"),
  description: z.string().min(20, "Please describe your business (min 20 chars)"),
  target_audience: z.string().min(1, "Target audience is required"),
  style: z.enum(["modern", "classic", "minimal", "bold", "playful"]),
  color_palette: z.string().min(1, "Pick a color palette"),
  competitors: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const PROJECT_TYPES = [
  { value: "website", label: "Business Website", icon: "🌐", desc: "Full multi-page site" },
  { value: "landing", label: "Landing Page", icon: "🎯", desc: "Single-page sales page" },
  { value: "ecommerce", label: "Online Store", icon: "🛒", desc: "E-commerce with catalog" },
  { value: "blog", label: "Blog / Content", icon: "✍️", desc: "Content-driven site" },
  { value: "portfolio", label: "Portfolio", icon: "🎨", desc: "Showcase your work" },
  { value: "saas", label: "SaaS / App", icon: "⚡", desc: "Product landing page" },
] as const;

const PAGES = ["Home", "About", "Services", "Portfolio", "Blog", "Contact", "Pricing", "FAQ", "Team"];
const FEATURES = [
  "Contact Form", "Live Chat", "Newsletter Signup", "Booking System",
  "E-commerce Store", "Client Portal", "Photo Gallery", "Video Background",
  "Testimonials", "FAQ Section", "Social Media Feed", "Google Maps",
  "Dark Mode", "Multilingual", "Analytics", "Blog & CMS",
];
const STYLES = [
  { value: "modern", label: "Modern", desc: "Clean lines, bold typography" },
  { value: "classic", label: "Classic", desc: "Timeless, professional feel" },
  { value: "minimal", label: "Minimal", desc: "Less is more, whitespace" },
  { value: "bold", label: "Bold", desc: "High contrast, loud & proud" },
  { value: "playful", label: "Playful", desc: "Fun, energetic, approachable" },
] as const;
const PALETTES = [
  { value: "violet-indigo", label: "Violet & Indigo", colors: ["#7c3aed", "#4f46e5"] },
  { value: "blue-cyan", label: "Blue & Cyan", colors: ["#2563eb", "#06b6d4"] },
  { value: "emerald-teal", label: "Emerald & Teal", colors: ["#059669", "#0d9488"] },
  { value: "rose-pink", label: "Rose & Pink", colors: ["#e11d48", "#ec4899"] },
  { value: "amber-orange", label: "Amber & Orange", colors: ["#d97706", "#ea580c"] },
  { value: "slate-gray", label: "Slate & Gray", colors: ["#475569", "#6b7280"] },
];

interface PortalIntakeFormProps {
  prefillName?: string;
  prefillEmail?: string;
}

export function PortalIntakeForm({ prefillName, prefillEmail }: PortalIntakeFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState<string>("website");
  const [selectedPages, setSelectedPages] = useState<string[]>(["Home", "About", "Services", "Contact"]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(["Contact Form"]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { style: "modern", color_palette: "violet-indigo" },
  });

  function toggleItem(arr: string[], setArr: (v: string[]) => void, item: string) {
    setArr(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  }

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/project/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intake: {
            project_type: projectType,
            business_name: data.business_name,
            business_type: data.business_type,
            description: data.description,
            target_audience: data.target_audience,
            color_palette: data.color_palette,
            style: data.style,
            pages: selectedPages,
            features: selectedFeatures,
            competitors: data.competitors,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      router.push(`/portal/dashboard?project=${json.projectId}&created=true`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const STEP_LABELS = ["Project type", "Brand details", "Pages & features"];

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              s < step ? "bg-violet-600 text-white" : s === step ? "bg-violet-600 text-white ring-4 ring-violet-100" : "bg-slate-200 text-slate-400"
            }`}>
              {s < step ? "✓" : s}
            </div>
            {s < 3 && <div className={`flex-1 h-0.5 w-12 ${s < step ? "bg-violet-600" : "bg-slate-200"}`} />}
          </div>
        ))}
        <span className="ml-3 text-sm text-slate-500 font-medium">{STEP_LABELS[step - 1]}</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">

          {/* Step 1: Project type */}
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold text-slate-900">What are you building?</h2>
              <p className="text-slate-500 text-sm -mt-2">Your subscription includes all project types — pick whatever you need.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PROJECT_TYPES.map(({ value, label, icon, desc }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setProjectType(value)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      projectType === value
                        ? "border-violet-600 bg-violet-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="text-2xl mb-2">{icon}</div>
                    <div className="text-sm font-bold text-slate-800">{label}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2: Brand details */}
          {step === 2 && (
            <>
              <h2 className="text-xl font-bold text-slate-900">Tell us about your brand</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Business Name *" error={errors.business_name?.message}>
                    <input {...register("business_name")} placeholder="Acme Restaurant" className={inputCls(!!errors.business_name)} />
                  </Field>
                  <Field label="Business Type *" error={errors.business_type?.message}>
                    <input {...register("business_type")} placeholder="Restaurant, Law Firm, Gym..." className={inputCls(!!errors.business_type)} />
                  </Field>
                </div>
                <Field label="Describe your business *" error={errors.description?.message}>
                  <textarea {...register("description")} rows={3} placeholder="We're a family-owned Italian restaurant serving authentic Neapolitan pizza..." className={`${inputCls(!!errors.description)} resize-none`} />
                </Field>
                <Field label="Target audience *" error={errors.target_audience?.message}>
                  <input {...register("target_audience")} placeholder="Young professionals, families, local residents..." className={inputCls(!!errors.target_audience)} />
                </Field>
                <Field label="Competitors to outshine (optional)">
                  <input {...register("competitors")} placeholder="Website URLs of competitors..." className={inputCls(false)} />
                </Field>
                <Field label="Design style *">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {STYLES.map(({ value, label, desc }) => {
                      const current = watch("style");
                      return (
                        <label key={value} className={`cursor-pointer rounded-xl border-2 p-3 transition-all ${current === value ? "border-violet-600 bg-violet-50" : "border-slate-200 hover:border-slate-300"}`}>
                          <input type="radio" {...register("style")} value={value} className="sr-only" />
                          <div className="font-semibold text-slate-800 text-sm">{label}</div>
                          <div className="text-slate-500 text-xs">{desc}</div>
                        </label>
                      );
                    })}
                  </div>
                </Field>
                <Field label="Color palette *">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {PALETTES.map(({ value, label, colors }) => {
                      const current = watch("color_palette");
                      return (
                        <label key={value} className={`cursor-pointer rounded-xl border-2 p-3 transition-all ${current === value ? "border-violet-600 bg-violet-50" : "border-slate-200 hover:border-slate-300"}`}>
                          <input type="radio" {...register("color_palette")} value={value} className="sr-only" />
                          <div className="flex gap-1 mb-1">
                            {colors.map((c) => (
                              <div key={c} className="w-5 h-5 rounded-full" style={{ backgroundColor: c }} />
                            ))}
                          </div>
                          <div className="text-slate-700 text-xs font-medium">{label}</div>
                        </label>
                      );
                    })}
                  </div>
                </Field>
              </div>
            </>
          )}

          {/* Step 3: Pages & features */}
          {step === 3 && (
            <>
              <h2 className="text-xl font-bold text-slate-900">Pages & features</h2>
              <Field label="Which pages do you need?">
                <div className="flex flex-wrap gap-2">
                  {PAGES.map((page) => (
                    <button
                      key={page} type="button"
                      onClick={() => toggleItem(selectedPages, setSelectedPages, page)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        selectedPages.includes(page)
                          ? "bg-violet-600 text-white border-violet-600"
                          : "bg-white text-slate-600 border-slate-300 hover:border-violet-400"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Which features do you want?">
                <div className="flex flex-wrap gap-2">
                  {FEATURES.map((feature) => (
                    <button
                      key={feature} type="button"
                      onClick={() => toggleItem(selectedFeatures, setSelectedFeatures, feature)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        selectedFeatures.includes(feature)
                          ? "bg-violet-600 text-white border-violet-600"
                          : "bg-white text-slate-600 border-slate-300 hover:border-violet-400"
                      }`}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </Field>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                  <p className="font-semibold mb-1">Error</p>
                  <p>{error}</p>
                  <p className="mt-2 text-red-600">
                    Need help?{" "}
                    <a href="mailto:hello@pixelpilot.ai" className="underline font-medium">hello@pixelpilot.ai</a>
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <Button type="button" variant="ghost" onClick={() => setStep(step - 1)}>
              ← Back
            </Button>
          ) : <div />}

          {step < 3 ? (
            <Button
              type="button"
              onClick={async () => {
                if (step === 1) { setStep(2); return; }
                const fields = ["business_name", "business_type", "description", "target_audience", "style", "color_palette"] as const;
                const valid = await trigger(fields);
                if (valid) setStep(3);
              }}
            >
              Continue →
            </Button>
          ) : (
            <Button type="submit" loading={submitting}>
              {submitting ? "Launching AI…" : "Build My Project →"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full border rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors ${
    hasError ? "border-red-300 bg-red-50" : "border-slate-300 bg-white hover:border-slate-400"
  }`;
}
