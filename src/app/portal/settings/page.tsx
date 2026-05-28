"use client";
import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [pwState, setPwState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    if (newPw !== confirmPw) { setPwError("Passwords don't match"); return; }
    if (newPw.length < 8) { setPwError("Password must be at least 8 characters"); return; }
    setPwState("loading");
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) { setPwError(error.message); setPwState("error"); }
    else { setPwState("done"); setNewPw(""); setConfirmPw(""); }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account preferences and security</p>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Change Password</h2>
        <p className="text-slate-500 text-sm mb-6">
          Choose a strong password at least 8 characters long.
        </p>

        {pwState === "done" ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 text-sm flex items-center gap-2">
            ✅ Password updated successfully.
          </div>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                New password
              </label>
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                required
                placeholder="At least 8 characters"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirm new password
              </label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                required
                placeholder="Same password again"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            {pwError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
                {pwError}
              </div>
            )}
            <button
              type="submit"
              disabled={pwState === "loading"}
              className="bg-violet-600 text-white font-semibold rounded-xl px-6 py-3 text-sm hover:bg-violet-700 transition-colors disabled:opacity-50"
            >
              {pwState === "loading" ? "Updating…" : "Update Password"}
            </button>
          </form>
        )}
      </div>

      {/* Support */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Need Help?</h2>
        <p className="text-slate-500 text-sm mb-4">
          Our team is available to help with anything related to your projects.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="mailto:hello@pixelpilot.ai"
            className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 hover:border-violet-300 hover:text-violet-700 transition-colors"
          >
            📧 hello@pixelpilot.ai
          </a>
          <a
            href="/portal/support"
            className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 hover:border-violet-300 hover:text-violet-700 transition-colors"
          >
            💬 Support Center
          </a>
        </div>
      </div>

      {/* Sign out */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Sign Out</h2>
        <p className="text-slate-500 text-sm mb-4">
          Sign out of your PixelPilot AI account on this device.
        </p>
        <button
          onClick={handleSignOut}
          className="border border-slate-300 text-slate-600 font-semibold rounded-xl px-6 py-3 text-sm hover:bg-slate-50 hover:border-slate-400 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
