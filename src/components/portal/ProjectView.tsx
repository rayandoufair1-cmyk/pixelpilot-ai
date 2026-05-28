"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { STATUS_LABELS, STATUS_COLORS, formatDate } from "@/lib/utils";
import type { Project, Message } from "@/types";
import { Send, ExternalLink, ArrowLeft, RefreshCw } from "lucide-react";

interface ProjectViewProps {
  project: Project;
  initialMessages: Message[];
}

export function ProjectView({ project, initialMessages }: ProjectViewProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [approving, setApproving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "chat">("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);

    const optimistic: Message = {
      id: crypto.randomUUID(),
      project_id: project.id,
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, message: text }),
      });
      const { message } = await res.json();
      setMessages((prev) => [...prev, message]);
    } catch {
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(),
        project_id: project.id,
        role: "assistant",
        content: "Sorry, I had trouble responding. Please try again.",
        created_at: new Date().toISOString(),
      }]);
    } finally {
      setSending(false);
    }
  }

  async function approveDesign() {
    setApproving(true);
    await fetch("/api/projects/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id }),
    });
    window.location.reload();
  }

  async function requestDeploy() {
    setDeploying(true);
    await fetch("/api/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id }),
    });
    window.location.reload();
  }

  return (
    <div className="max-w-5xl h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/portal/dashboard" className="text-slate-400 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-slate-400 text-sm">Created {formatDate(project.created_at)}</p>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[project.status]}`}>
          {STATUS_LABELS[project.status]}
        </span>
        <Badge variant="purple">{project.tier}</Badge>
      </div>

      {/* CTA banners by status */}
      {project.status === "review" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 flex items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-amber-800">Your design is ready for review!</div>
            <div className="text-amber-600 text-sm">Preview it below, then approve or request changes via chat.</div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setActiveTab("preview")}>
              <ExternalLink className="w-4 h-4" /> Preview
            </Button>
            <Button size="sm" loading={approving} onClick={approveDesign}>
              Approve Design ✓
            </Button>
          </div>
        </div>
      )}

      {project.status === "approved" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-green-800">Design approved! Ready to deploy.</div>
            <div className="text-green-600 text-sm">Click deploy to make your site live on the internet.</div>
          </div>
          <Button size="sm" loading={deploying} onClick={requestDeploy}>
            <RefreshCw className="w-4 h-4" /> Deploy Now
          </Button>
        </div>
      )}

      {project.status === "live" && project.live_url && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <div>
              <div className="font-semibold text-emerald-800">Your site is live!</div>
              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 text-sm underline hover:text-emerald-800">
                {project.live_url}
              </a>
            </div>
          </div>
          <Button size="sm" asChild>
            <a href={project.live_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" /> Visit Site
            </a>
          </Button>
        </div>
      )}

      {/* Main panel: tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 flex flex-col h-[calc(100%-140px)]">
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === "chat" ? "text-violet-700 border-b-2 border-violet-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            💬 AI Chat
          </button>
          {project.preview_url && (
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === "preview" ? "text-violet-700 border-b-2 border-violet-600" : "text-slate-500 hover:text-slate-700"}`}
            >
              🖥️ Preview
            </button>
          )}
        </div>

        {activeTab === "chat" && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-slate-400 py-12">
                  <div className="text-4xl mb-3">🤖</div>
                  <p className="font-medium">Your AI project manager is here</p>
                  <p className="text-sm">Ask anything about your project, request changes, or check on status.</p>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-0.5">
                      🤖
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-violet-600 text-white rounded-br-sm"
                        : "bg-slate-100 text-slate-800 rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0">🤖</div>
                  <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-slate-100 flex gap-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your project, request changes..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <Button type="submit" size="sm" loading={sending} disabled={!input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </>
        )}

        {activeTab === "preview" && project.preview_url && (
          <iframe
            src={project.preview_url}
            className="flex-1 w-full rounded-b-2xl"
            title="Website Preview"
          />
        )}
      </div>
    </div>
  );
}
