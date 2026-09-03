"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Mail, Lock, ArrowRight, ShieldCheck, AlertTriangle, KeyRound, Key } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithCustomToken, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { clearAuthCookies } from "@/lib/cookieUtils";
import { getSystemSettings } from "@/lib/systemSettings";
import { usePreloader } from "@/context/PreloaderContext";
import { isValidPasscode } from "@/lib/passcodeUtils";

function LoginContent() {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const { triggerPreloader } = usePreloader();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login Mode state: 'passcode' (Default) | 'password'
  const [loginMode, setLoginMode] = useState<"passcode" | "password">("passcode");

  // Attempt counters
  const [passcodeAttempts, setPasscodeAttempts] = useState(0);
  const [passwordAttempts, setPasswordAttempts] = useState(0);

  // Set when the user explicitly asked to reset a forgotten passcode, so a
  // successful password sign-in routes to passcode setup even though this
  // account already has one configured.
  const [forcePasscodeReset, setForcePasscodeReset] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passcode, setPasscode] = useState(["", "", "", "", "", ""]);

  useEffect(() => setMounted(true), []);

  const backgroundImage =
    mounted && resolvedTheme === "dark"
      ? "/auth/login/login3.jpg"
      : "/auth/login/login.jpg";

  // Passcode digit box handler
  const handleDigitInput = (value: string, index: number) => {
    const sanitized = value.replace(/\D/g, "");
    if (!sanitized && value !== "") return;

    const char = sanitized.slice(-1);
    const newPasscode = [...passcode];
    newPasscode[index] = char;
    setPasscode(newPasscode);

    if (char && index < 5) {
      document.getElementById(`login-digit-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !passcode[index] && index > 0) {
      document.getElementById(`login-digit-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setPasscode(pasted.split(""));
      document.getElementById("login-digit-5")?.focus();
    }
  };

  /* -------- PASSCODE LOGIN -------- */
  const handlePasscodeLogin = async () => {
    const codeStr = passcode.join("");
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!isValidPasscode(codeStr)) {
      setError("Please enter a complete 6-digit passcode.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/auth/passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          email: email.trim(),
          passcode: codeStr,
        }),
      });

      let data: { success?: boolean; error?: string; lockout?: boolean; failedAttempts?: number; role?: string; customToken?: string | null; uid?: string } = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error("Server error handling passcode authentication. Please try again later.");
      }

      if (!res.ok || !data.success) {
        const nextAttempts = (data.failedAttempts !== undefined) ? data.failedAttempts : passcodeAttempts + 1;
        setPasscodeAttempts(nextAttempts);

        if (data.lockout || nextAttempts >= 3) {
          setError("You've reached the maximum passcode attempts. Please login using your password.");
          setLoginMode("password");
        } else {
          setError(data.error || "Invalid email or passcode.");
        }
        return;
      }

      // Check Maintenance Mode for non-admin role. The verify call above
      // already issued a session cookie on success, so it must be revoked
      // again here rather than left valid for a blocked user.
      const settings = await getSystemSettings();
      if (settings.maintenanceMode && data.role !== "admin") {
        await clearAuthCookies();
        throw new Error("MAINTENANCE_MODE");
      }

      // Passcode login has no password to sign into Firebase with, so the
      // server minted a custom token instead — exchange it for a real
      // Firebase Auth session (this is what lets client-side Firestore
      // reads, e.g. on the admin panel, work the same as a password login).
      if (data.customToken) {
        try {
          await signInWithCustomToken(auth, data.customToken);
        } catch (fbErr) {
          console.warn("Could not establish Firebase session from custom token:", fbErr);
        }
      }

      // Sign-in successful via passcode -> trigger preloader & redirect
      await triggerPreloader("login", 2000);

      if (data.role === "admin") {
        router.push("/admin/dashboard");
      } else if (redirectUrl && redirectUrl.startsWith("/")) {
        router.push(redirectUrl);
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      if (errorObj.message === "MAINTENANCE_MODE") {
        setError("The website is currently under maintenance. Please try again later.");
      } else {
        setError(errorObj.message || "Failed to authenticate with passcode.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* -------- PASSWORD LOGIN -------- */
  const handlePasswordLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 1️⃣ Firebase Auth password sign in
      const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCred.user;
      const idToken = await user.getIdToken();

      // 2️⃣ Check Firestore user record for role & passcode configuration status
      let role = "user";
      let passcodeConfigured = false;

      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        const userData = docSnap.data();
        role = userData.role || "user";
        passcodeConfigured = userData.passcodeConfigured === true;
      }

      // Reset password attempt count on success
      setPasswordAttempts(0);

      // 3️⃣ Check Maintenance Mode
      const settings = await getSystemSettings();
      if (settings.maintenanceMode && role !== "admin") {
        await signOut(auth);
        await clearAuthCookies();
        throw new Error("MAINTENANCE_MODE");
      }

      // 4️⃣ Establish the app's own signed session (independently verifies
      // idToken server-side rather than trusting anything set here).
      const sessionRes = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!sessionRes.ok) {
        throw new Error("Failed to establish a secure session. Please try again.");
      }

      // 5️⃣ Passcode setup/reset flow: mandatory for first-time users, and
      // also routed here when the user explicitly asked to reset a
      // forgotten passcode (their real password just proved their identity).
      if (!passcodeConfigured || forcePasscodeReset) {
        router.push(redirectUrl ? `/auth/setup-passcode?redirect=${encodeURIComponent(redirectUrl)}` : "/auth/setup-passcode");
        return;
      }

      // Successful login trigger
      await triggerPreloader("login", 2000);

      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (redirectUrl && redirectUrl.startsWith("/")) {
        router.push(redirectUrl);
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      const errorObj = err as { code?: string; message?: string };
      const nextFail = passwordAttempts + 1;
      setPasswordAttempts(nextFail);

      if (nextFail >= 3) {
        setError("Too many failed attempts. Please reset your password.");
      } else if (errorObj.message === "MAINTENANCE_MODE") {
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

  const handleForgotPasscode = async () => {
    setLoginMode("password");
    setForcePasscodeReset(true);
    setError("Please log in using your password to reset your 6-digit passcode.");
  };

  const isPasscodeComplete = passcode.join("").length === 6;
  const isFormValid = loginMode === "passcode" ? (email.trim().length > 0 && isPasscodeComplete) : (email.trim().length > 0 && password.length > 0);

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row pt-14 bg-white dark:bg-black transition-colors duration-500 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-blue-500/10 blur-3xl -z-10 pointer-events-none" />

      {/* LEFT FORM */}
      <div className="relative flex w-full items-center justify-center px-6 py-12 lg:px-8 lg:w-[45%] xl:w-[40%] bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/80">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative w-full max-w-sm space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-amber-500 text-white shadow-lg">
              <ShieldCheck className="h-6 w-6" />
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome back
            </h1>

            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400">
              Sign in with your{" "}
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {loginMode === "passcode" ? "6-Digit Passcode" : "Password"}
              </span>{" "}
              to access IndraCast.
            </p>
          </div>

          {/* FORM & MODE TRANSITION */}
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (loginMode === "passcode") handlePasscodeLogin();
              else handlePasswordLogin();
            }}
          >
            {/* COMMON EMAIL INPUT */}
            <div className="space-y-1.5">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 py-3.5 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:text-white text-sm font-semibold"
                />
              </div>
            </div>

            {/* SMOOTH ANIMATED DUAL MODE CONTAINER */}
            <AnimatePresence mode="wait">
              {loginMode === "passcode" ? (
                <motion.div
                  key="passcode-mode"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4 overflow-hidden pt-1"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                        6-Digit Passcode
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPasscode}
                        className="text-[11px] font-bold text-amber-500 hover:underline"
                      >
                        Forgot Passcode?
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-1.5">
                      {passcode.map((digit, idx) => (
                        <input
                          key={`login-p-${idx}`}
                          id={`login-digit-${idx}`}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleDigitInput(e.target.value, idx)}
                          onKeyDown={(e) => handleKeyDown(e, idx)}
                          onPaste={handlePaste}
                          className="h-11 w-11 text-center text-lg font-black rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="pt-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMode("password");
                        setError("");
                      }}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
                    >
                      <Key className="h-3.5 w-3.5" /> Login with password
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="password-mode"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4 overflow-hidden pt-1"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                        Password
                      </label>
                      <Link
                        href={redirectUrl ? `/auth/forgot-password?redirect=${encodeURIComponent(redirectUrl)}` : "/auth/forgot-password"}
                        className="text-[11px] font-bold text-blue-600 hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                      <input
                        type="password"
                        name="password"
                        required={loginMode === "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 py-3.5 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:text-white text-sm font-semibold"
                      />
                    </div>
                  </div>

                  <div className="pt-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (passcodeAttempts < 3) {
                          setLoginMode("passcode");
                          setError("");
                        } else {
                          setError("Maximum passcode attempts reached. Please continue using password login.");
                        }
                      }}
                      className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1.5"
                    >
                      <KeyRound className="h-3.5 w-3.5" /> Login with 6-digit passcode
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="p-3.5 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-amber-500 py-4 text-white font-extrabold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-40 text-sm"
            >
              {loading ? "Authenticating..." : `Sign In with ${loginMode === "passcode" ? "Passcode" : "Password"}`}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="pt-5 border-t border-slate-200 dark:border-zinc-800 text-center text-xs font-semibold text-slate-500">
            New to IndraCast?{" "}
            <Link
              href={redirectUrl ? `/auth/signup?redirect=${encodeURIComponent(redirectUrl)}` : "/auth/signup"}
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-20 min-h-screen flex items-center justify-center bg-white dark:bg-black">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
