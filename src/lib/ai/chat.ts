import { anthropic, CLAUDE_MODEL } from "./claude";
import type { Message, Project } from "@/types";

export async function chatWithClient(
  messages: Message[],
  project: Project
): Promise<string> {
  const systemPrompt = `You are an AI project manager for PixelPilot AI, a premium web design agency.
You are managing the website project for ${project.intake_data.business_name}.
Project status: ${project.status}
Be helpful, professional, and proactive. You can:
- Answer questions about the project timeline and deliverables
- Collect feedback on designs
- Explain what's happening at each stage
- Reassure clients and set clear expectations
- Escalate urgent issues appropriately
Keep responses concise and friendly. Never make promises about timelines you can't guarantee.`;

  const formattedMessages = messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1024,
    system: systemPrompt,
    messages: formattedMessages,
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");
  return content.text;
}
