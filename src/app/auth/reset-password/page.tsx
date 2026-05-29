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
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // ── Method 1: Parse #access_token from URL hash (implicit flow) ──────────
    // Supabase embeds the token directly in the hash when flowType=implicit.
    // This is the most reliable method — no async event timing issues.
    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token") ?? "";
    const type = params.get("type");

    if (accessToken && type === "recovery") {
      supabase.auth
        .setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(({ error: sessionError }) => {
          if (sessionError) {
            setError("This reset link has expired. Please request a new one.");
          } else {
            setSessionReady(true);
            // Remove token from URL bar so it can't be accidentally reused
            window.history.replaceState(null, "", window.location.pathname);
          }
          setChecking(false);
        });
      return; // don't set up the listener — hash was the source of truth
    }

    // ── Method 2: onAuthStateChange (hash already consumed on prior load) ────
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
          setSessionReady(true);
          setChecking(false);
        }
      }
    );

    // ── Method 3: Existing session fallback ──────────────────────────────────
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
        setChecking(false);
      }
    });

    // After 5 s with no session → show "link expired"
    const timeout = setTimeout(() => setChecking(false), 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords don't match — please re-enter them.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      router.push("/portal/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black text-slate-900">
            ✦ PixelPilot <span className="text-violet-600">AI</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-800 mt-4">Set a new password</h1>
        </div>

        {/* Verifying */}
        {checking && (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 shadow-sm text-center">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500 text-sm">Verifying your reset link…</p>
          </div>
        )}

        {/* Expired */}
        {!checking && !sessionReady && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
            <div className="text-4xl mb-4">⏰</div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Link expired</h2>
            <p className="text-slate-500 text-sm mb-6">
              This reset link has expired or already been used. Links are valid for 1 hour.
            </p>
            <Link
              href="/auth/reset"
              className="inline-block bg-violet-600 text-white font-semibold rounded-xl px-6 py-3 text-sm hover:bg-violet-700 transition-colors"
            >
              Request a new link →
            </Link>
          </div>
        )}

        {/* Password form */}
        {!checking && sessionReady && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <p className="text-slate-500 text-sm mb-6">
              Choose a strong password — at least 8 characters.
            </p>
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
                  autoFocus
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
                className="w-full bg-violet-600 text-white font-semibold rounded-xl py-3 text-sm hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Set New Password →"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
