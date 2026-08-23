"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Mail, Lock, ArrowRight, ShieldCheck, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { setAuthCookies, clearAuthCookies } from "@/lib/cookieUtils";
import { getSystemSettings } from "@/lib/systemSettings";
import { usePreloader } from "@/context/PreloaderContext";

export default function LoginPage() {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const { triggerPreloader } = usePreloader();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => setMounted(true), []);

  const backgroundImage =
    mounted && resolvedTheme === "dark"
      ? "/auth/login/login3.jpg"
      : "/auth/login/login.jpg";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* -------- LOGIN FUNCTION -------- */
  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      // 1️⃣ Firebase Auth login
      const userCred = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCred.user;
      const idToken = await user.getIdToken();

      // 2️⃣ Fetch Firestore user role
      let role = "user";
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        const userData = docSnap.data();
        role = userData.role || "user";
      }

      // 3️⃣ Fetch System Settings & Enforce Maintenance Mode
      const settings = await getSystemSettings();
      if (settings.maintenanceMode && role !== "admin") {
        // Sign out non-admin user immediately
        await signOut(auth);
        clearAuthCookies();
        throw new Error("MAINTENANCE_MODE");
      }

      // 4️⃣ Set Auth cookies for middleware
      setAuthCookies(idToken, role);

      // Trigger successful login preloader
      await triggerPreloader("login", 2000);

      // 5️⃣ Role-based redirect: Admin → /admin/dashboard, Normal User → /
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      const errorObj = err as { code?: string; message?: string };
      if (errorObj.message === "MAINTENANCE_MODE") {
        setError("The website is currently under maintenance. Please try again later.");
      } else if (
        errorObj.code === "auth/invalid-credential" ||
        errorObj.code === "auth/user-not-found" ||
        errorObj.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password.");
      } else {
        setError(errorObj.message || "Failed to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row pt-14 bg-white dark:bg-black transition-colors duration-500 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-blue-500/10 blur-3xl -z-10 pointer-events-none" />

      {/* LEFT FORM */}
      <div className="relative flex w-full items-center justify-center px-6 py-12 lg:px-8 lg:w-[45%] xl:w-[40%] bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/80">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative w-full max-w-sm space-y-10">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-amber-500 text-white shadow-lg">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome back
            </h1>

            <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
              Sign in to continue exploring{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400">
                IndraCast
              </span>
              .
            </p>
          </div>

          {/* FORM */}
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 py-4 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:text-white text-sm font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 py-4 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:text-white text-sm font-semibold"
                />
              </div>

              <div className="flex justify-end pt-1">
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-amber-500 py-4 text-white font-extrabold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 text-sm"
            >
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 text-center text-xs font-semibold text-slate-500">
            New to IndraCast?{" "}
            <Link
              href="/auth/signup"
              className="text-blue-600 font-bold hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* RIGHT VISUAL */}
      <div className="relative hidden lg:block flex-1 overflow-hidden">
        {mounted && (
          <Image
            src={backgroundImage}
            alt="Weather Visual"
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
        )}
      </div>
    </div>
  );
}
