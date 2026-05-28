"use client";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Use implicit flow so no PKCE code-verifier is generated.
    // The email link will contain the access_token directly in the URL hash —
    // no verifier stored in the browser, no cross-tab mismatch.
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { flowType: "implicit" } }
    );

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black text-slate-900">
            ✦ PixelPilot <span className="text-violet-600">AI</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-800 mt-4">Reset your password</h1>
        </div>

        {sent ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
            <div className="text-4xl mb-4">📬</div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Check your email</h2>
            <p className="text-slate-500 text-sm mb-6">
              We sent a password reset link to <strong>{email}</strong>.
            </p>
            <Link href="/auth/login" className="text-violet-600 hover:underline text-sm font-medium">
              ← Back to sign in
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Your email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@company.com"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{error}</div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 text-white font-semibold rounded-xl py-3 hover:bg-violet-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send Reset Link →"}
              </button>
            </form>
            <p className="text-center mt-4">
              <Link href="/auth/login" className="text-slate-400 hover:text-slate-600 text-sm transition-colors">
                ← Back to sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
