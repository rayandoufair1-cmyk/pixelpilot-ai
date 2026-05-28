import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";

export const metadata = { title: "Sign In — PixelPilot AI" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black text-slate-900">
            ✦ PixelPilot <span className="text-violet-600">AI</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-800 mt-4">Sign in to your account</h1>
          <p className="text-slate-500 text-sm mt-1">
            New client?{" "}
            <Link href="/pricing" className="text-violet-600 hover:underline font-medium">
              Start a project →
            </Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
