"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

function friendlyError(msg: string): string {
  if (msg.includes("Invalid login credentials"))
    return "Incorrect email or password. Double-check and try again.";
  if (msg.includes("Email not confirmed"))
    return "Please confirm your email first — check your inbox for the confirmation link.";
  if (msg.includes("User already registered"))
    return "An account with this email already exists. Try signing in instead.";
  if (msg.includes("Password should be"))
    return "Password must be at least 6 characters.";
  if (msg.includes("rate limit") || msg.includes("too many"))
    return "Too many attempts. Please wait a few minutes and try again.";
  return msg;
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"signin" | "signup" | "magic">("signin");
  const [sent, setSent] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    setLoading(true);
    setError("");

    try {
      if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setSent(true);
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // After login, redirect to the `next` param if present (e.g. post-payment flow)
        // Only allow relative URLs to prevent open redirect attacks
        const params = new URLSearchParams(window.location.search);
        const next = params.get("next");
        const destination = next && next.startsWith("/") ? next : "/portal/dashboard";
        router.push(destination);
        router.refresh();
      }
    } catch (err) {
      setError(friendlyError(err instanceof Error ? err.message : "Authentication failed"));
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
        <div className="text-4xl mb-4">📬</div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Check your inbox</h2>
        <p className="text-slate-500 text-sm mb-1">
          We sent a {mode === "magic" ? "magic sign-in link" : "confirmation link"} to{" "}
          <strong>{email}</strong>.
        </p>
        <p className="text-slate-400 text-xs mb-6">
          Don't see it? Check your spam folder.
        </p>
        <button
          onClick={() => { setSent(false); setError(""); }}
          className="text-violet-600 hover:underline text-sm font-medium"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
      {/* Mode tabs */}
      <div className="flex border border-slate-200 rounded-xl p-1 mb-6 gap-1">
        {[
          { key: "signin", label: "Sign In" },
          { key: "magic", label: "Magic Link" },
          { key: "signup", label: "Sign Up" },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => { setMode(key as typeof mode); setError(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              mode === key
                ? "bg-violet-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Helper text per mode */}
      <p className="text-slate-400 text-xs mb-4">
        {mode === "signin" && "Sign in with your email and password."}
        {mode === "magic" && "We'll email you a one-click sign-in link — no password needed."}
        {mode === "signup" && "Create a new account. You'll receive a confirmation email."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@company.com"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {mode !== "magic" && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              placeholder="••••••••"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full">
          {mode === "magic"
            ? "Send Magic Link →"
            : mode === "signup"
            ? "Create Account →"
            : "Sign In →"}
        </Button>
      </form>

      {mode === "signin" && (
        <p className="text-center text-slate-400 text-xs mt-4">
          <Link href="/auth/reset" className="hover:text-violet-600 transition-colors">
            Forgot your password?
          </Link>
        </p>
      )}
    </div>
  );
}
