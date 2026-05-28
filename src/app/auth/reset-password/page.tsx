"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // With implicit flow the email link carries #access_token=xxx&type=recovery
    // in the URL hash.  createBrowserClient detects the hash automatically and
    // fires onAuthStateChange with event "PASSWORD_RECOVERY" — no manual
    // exchangeCodeForSession call is needed (and there is no ?code= param).
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
        setChecking(false);
      }
    });

    // If the hash was already consumed before the listener registered,
    // getSession() will still return the active session.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
        setChecking(false);
      } else {
        // Give the listener a short window to fire before declaring expired.
        const timer = setTimeout(() => {
          setChecking(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/portal/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black text-slate-900">
            ✦ PixelPilot <span className="text-violet-600">AI</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-800 mt-4">Set a new password</h1>
        </div>

        {/* Verifying */}
        {checking && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
            <p className="text-slate-400 text-sm">Verifying reset link…</p>
          </div>
        )}

        {/* Expired */}
        {!checking && !sessionReady && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
            <div className="text-4xl mb-4">⏰</div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Link expired</h2>
            <p className="text-slate-500 text-sm mb-6">
              This reset link has expired or already been used.
            </p>
            <Link
              href="/auth/reset"
              className="inline-block bg-violet-600 text-white font-semibold rounded-xl px-6 py-3 text-sm hover:bg-violet-700 transition-colors"
            >
              Request a new link →
            </Link>
          </div>
        )}

        {/* Form */}
        {!checking && sessionReady && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  New password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="At least 8 characters"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  placeholder="Same password again"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-violet-600 text-white font-semibold rounded-xl py-3 hover:bg-violet-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Saving…" : "Set New Password →"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
