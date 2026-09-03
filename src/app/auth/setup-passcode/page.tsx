"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { isValidPasscode, isRestrictedPasscode } from "@/lib/passcodeUtils";

function PasscodeSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [passcode, setPasscode] = useState(["", "", "", "", "", ""]);
  const [confirmPasscode, setConfirmPasscode] = useState(["", "", "", "", "", ""]);

  // Guard route: user must be authenticated to setup passcode
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/auth/login?redirect=/auth/setup-passcode");
        return;
      }

      setUser(currentUser);

      try {
        const docSnap = await getDoc(doc(db, "users", currentUser.uid));
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role || "user");
        }
      } catch (err) {
        console.warn("Could not fetch user document during setup:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  const handleDigitInput = (
    value: string,
    index: number,
    isConfirm: boolean
  ) => {
    const sanitized = value.replace(/\D/g, "");
    if (!sanitized && value !== "") return;

    const char = sanitized.slice(-1);
    const targetArr = isConfirm ? [...confirmPasscode] : [...passcode];
    targetArr[index] = char;

    if (isConfirm) {
      setConfirmPasscode(targetArr);
    } else {
      setPasscode(targetArr);
    }

    // Auto focus next input
    if (char && index < 5) {
      const nextId = isConfirm ? `confirm-digit-${index + 1}` : `digit-${index + 1}`;
      document.getElementById(nextId)?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
    isConfirm: boolean
  ) => {
    const targetArr = isConfirm ? confirmPasscode : passcode;
    if (e.key === "Backspace" && !targetArr[index] && index > 0) {
      const prevId = isConfirm ? `confirm-digit-${index - 1}` : `digit-${index - 1}`;
      document.getElementById(prevId)?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    isConfirm: boolean
  ) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const arr = pasted.split("");
      if (isConfirm) {
        setConfirmPasscode(arr);
        document.getElementById("confirm-digit-5")?.focus();
      } else {
        setPasscode(arr);
        document.getElementById("digit-5")?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const p1 = passcode.join("");
    const p2 = confirmPasscode.join("");

    if (!isValidPasscode(p1) || !isValidPasscode(p2)) {
      setError("Please fill out all 6 digits for both passcode fields.");
      return;
    }

    if (p1 !== p2) {
      setError("Passcodes do not match. Please re-enter.");
      return;
    }

    if (isRestrictedPasscode(p1)) {
      setError("This passcode is too simple or predictable (e.g. 123456, 000000). Please choose a more secure PIN.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const token = await user.getIdToken();
      const res = await fetch("/api/auth/passcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "setup",
          uid: user.uid,
          email: user.email,
          newPasscode: p1,
          idToken: token,
          role: userRole,
        }),
      });

      let data: { success?: boolean; error?: string } = {};
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        throw new Error("Server error handling passcode setup. Please try again later.");
      }

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to set 6-digit passcode.");
      }

      // The server already persisted the hash and issued a signed session
      // cookie (Set-Cookie on this response) — nothing left to sync here.
      setSuccess(true);

      setTimeout(() => {
        if (userRole === "admin") {
          router.push("/admin/dashboard");
        } else if (redirectUrl && redirectUrl.startsWith("/")) {
          router.push(redirectUrl);
        } else {
          router.push("/");
        }
      }, 1500);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || "Failed to set passcode.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-slate-900 dark:text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mb-3" />
        <p className="text-xs font-semibold text-slate-500">Verifying session...</p>
      </div>
    );
  }

  const p1Valid = passcode.join("").length === 6;
  const p2Valid = confirmPasscode.join("").length === 6;
  const isFormValid = p1Valid && p2Valid;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-slate-900 dark:text-white p-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-blue-500/10 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-amber-500/10 blur-3xl -z-10 pointer-events-none" />

      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 shadow-lg">
            <KeyRound className="h-6 w-6" />
          </div>

          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Set 6-Digit Passcode
          </h1>

          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Configure your compulsory 6-digit passcode for fast, secure account access across IndraCast.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: PASSCODE */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Enter 6-Digit Passcode
            </label>
            <div className="flex items-center justify-between gap-2">
              {passcode.map((digit, idx) => (
                <input
                  key={`p1-${idx}`}
                  id={`digit-${idx}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitInput(e.target.value, idx, false)}
                  onKeyDown={(e) => handleKeyDown(e, idx, false)}
                  onPaste={(e) => handlePaste(e, false)}
                  className="h-12 w-12 text-center text-xl font-black rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              ))}
            </div>
          </div>

          {/* STEP 2: CONFIRM PASSCODE */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Confirm 6-Digit Passcode
            </label>
            <div className="flex items-center justify-between gap-2">
              {confirmPasscode.map((digit, idx) => (
                <input
                  key={`p2-${idx}`}
                  id={`confirm-digit-${idx}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitInput(e.target.value, idx, true)}
                  onKeyDown={(e) => handleKeyDown(e, idx, true)}
                  onPaste={(e) => handlePaste(e, true)}
                  className="h-12 w-12 text-center text-xl font-black rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>Passcode configured! Redirecting to application...</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!isFormValid || submitting || success}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-black hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-amber-500/20 disabled:opacity-40"
          >
            {submitting ? "Saving Passcode..." : "Save & Continue"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SetupPasscodePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
        </div>
      }
    >
      <PasscodeSetupContent />
    </Suspense>
  );
}
