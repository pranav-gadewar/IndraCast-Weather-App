"use client";

import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setMessage("");

      await sendPasswordResetEmail(auth, email);

      setMessage("Password reset link sent! Check your email.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black px-6">
      <div className="w-full max-w-md space-y-8 bg-slate-50 dark:bg-zinc-900 p-10 rounded-3xl shadow-xl">

        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Reset Password
          </h1>
          <p className="text-slate-500 dark:text-zinc-400">
            Enter your email and we’ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-4 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:text-white"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-semibold">{error}</p>
          )}

          {message && (
            <p className="text-green-600 text-sm font-semibold">{message}</p>
          )}

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 py-4 text-white font-bold hover:bg-blue-700 active:scale-[0.98]"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center pt-4">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
