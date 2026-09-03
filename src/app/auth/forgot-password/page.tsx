"use client";

import { useState, Suspense } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ForgotPasswordContent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      let data: { success?: boolean; error?: string; message?: string } = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error("Server error processing reset request. Please try again later.");
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send reset link.");
      }

      setMessage(data.message || "Password reset link sent! Check your email inbox.");
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black px-6 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-blue-500/10 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-amber-500/5 blur-3xl -z-10 pointer-events-none" />

      <div className="w-full max-w-md space-y-8 border border-slate-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl relative">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
            Enter your email and we’ll send you a secure password reset link.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          <div className="space-y-1.5">
            <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="email"
                required
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/80 py-4 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:text-white text-sm font-semibold"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold bg-red-500/10 border border-red-500/20 p-3 rounded-xl">{error}</p>
          )}

          {message && (
            <p className="text-green-600 dark:text-green-400 text-xs font-bold bg-green-500/10 border border-green-500/20 p-3 rounded-xl">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-amber-500 py-4 text-white font-extrabold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 text-sm"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-800/80">
          <Link
            href={redirectUrl ? `/auth/login?redirect=${encodeURIComponent(redirectUrl)}` : "/auth/login"}
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline"
          >
            <ArrowLeft size={14} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-20 min-h-screen flex items-center justify-center bg-white dark:bg-black">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
