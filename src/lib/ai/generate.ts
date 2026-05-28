import { anthropic, CLAUDE_MODEL } from "./claude";
import type { IntakeData } from "@/types";

export async function generateWebsite(intake: IntakeData): Promise<string> {
  const systemPrompt = `You are an expert web developer specializing in beautiful, conversion-optimized websites.
Generate complete, production-ready HTML/CSS/JS code for a business website.
Requirements:
- Use Tailwind CSS via CDN
- Mobile-first responsive design
- Modern animations with subtle CSS transitions
- SEO-optimized semantic HTML
- Fast-loading, no heavy dependencies
- Include all requested pages as anchor sections or separate HTML files
- Professional, polished aesthetic matching the brand style
- Always include: header with nav, hero section, about, services/features, contact form, footer
Return ONLY the complete HTML code starting with <!DOCTYPE html>`;

  const userPrompt = `Create a complete website for:

Business: ${intake.business_name}
Type: ${intake.business_type}
Description: ${intake.description}
Target Audience: ${intake.target_audience}
Style: ${intake.style}
Color Palette: ${intake.color_palette}
Pages/Sections: ${intake.pages.join(", ")}
Features: ${intake.features.join(", ")}
${intake.competitors ? `Competitors to outshine: ${intake.competitors}` : ""}
${intake.brand_colors?.length ? `Brand colors: ${intake.brand_colors.join(", ")}` : ""}

Generate a stunning, fully functional single-page website with smooth scrolling between sections.
Make it look like it was designed by a top-tier agency. Include micro-animations, hover effects, and a hero with a compelling CTA.`;

  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 16000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  // Extract HTML if wrapped in markdown code blocks
  const html = content.text
    .replace(/^```html\n?/i, "")
    .replace(/\n?```$/i, "")
    .trim();

  return html;
}

export async function generateProposal(intake: IntakeData, tier: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Write a professional web design proposal for ${intake.business_name} (${intake.business_type}).
They selected the ${tier} package.
Project scope: ${intake.pages.join(", ")} pages/sections, features: ${intake.features.join(", ")}.
Write in a confident, professional tone. Include: project overview, deliverables, timeline (realistic for AI-powered delivery), and next steps.
Format in clean markdown.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");
  return content.text;
}
