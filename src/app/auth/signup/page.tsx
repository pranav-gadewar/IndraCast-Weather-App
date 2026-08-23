"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  UserPlus,
  Mail,
  Lock,
  User,
  MapPin,
  Phone,
  Calendar,
  Globe,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { setAuthCookies } from "@/lib/cookieUtils";
import { getSystemSettings } from "@/lib/systemSettings";

export default function SignupPage() {
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    age: "",
    city: "",
    state: "",
    country: "India",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setMounted(true), []);

  const inputClass =
    "w-full rounded-2xl py-3.5 pl-12 pr-12 text-sm font-semibold " +
    "bg-white/80 dark:bg-slate-950/80 backdrop-blur " +
    "border border-slate-200 dark:border-slate-800 " +
    "text-slate-900 dark:text-white " +
    "placeholder:text-gray-400 " +
    "outline-none transition-all duration-200 " +
    "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  /* ----------- HANDLE CHANGE ----------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ----------- SIGNUP ----------- */
  const handleSignup = async () => {
    try {
      setLoading(true);
      setError("");

      // Check Registration System Settings
      const settings = await getSystemSettings();
      if (!settings.userRegistration) {
        throw new Error("REGISTRATION_PAUSED");
      }

      if (!form.email || !form.password || !form.name) {
        throw new Error("Please fill in all required fields (Name, Email, Password).");
      }

      // 1️⃣ Create Firebase auth user
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCred.user;
      const idToken = await user.getIdToken();

      // 2️⃣ Store user metadata in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        email: form.email,
        phone: form.phone || "",
        gender: form.gender || "",
        age: form.age || "",
        city: form.city || "",
        state: form.state || "",
        country: "India",
        role: "user",
        createdAt: serverTimestamp(),
      });

      // 3️⃣ Set Auth cookies
      setAuthCookies(idToken, "user");

      // 4️⃣ Redirect to landing page logged in
      router.push("/");
    } catch (err: unknown) {
      const errorObj = err as { code?: string; message?: string };
      if (errorObj.message === "REGISTRATION_PAUSED") {
        setError("New user registrations are currently paused by system administration.");
      } else if (errorObj.code === "auth/email-already-in-use") {
        setError("This email address is already in use.");
      } else if (errorObj.code === "auth/weak-password") {
        setError("Password should be at least 6 characters long.");
      } else {
        setError(errorObj.message || "Failed to create account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-black relative">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-blue-500/5 blur-3xl -z-10 pointer-events-none" />

      {/* LEFT IMAGE */}
      <div className="relative hidden lg:block lg:flex-1 h-full">
        {mounted && (
          <Image
            src={
              resolvedTheme === "dark"
                ? "/auth/signup/signup-dark.jpg"
                : "/auth/signup/signup-light.jpg"
            }
            alt="Signup"
            fill
            priority
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-transparent to-amber-500/20 dark:to-black/85" />
      </div>

      {/* FORM */}
      <div className="relative flex w-full flex-col lg:w-[55%] h-full bg-slate-50/50 dark:bg-slate-900/10 backdrop-blur-xl border-l border-slate-200/50 dark:border-slate-800/80">
        <div className="flex-1 overflow-y-auto px-6 py-14 mt-14">
          <div className="mx-auto max-w-xl space-y-12">
            {/* HEADER */}
            <div className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-amber-500 text-white shadow-xl">
                <UserPlus className="h-6 w-6" />
              </div>

              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Create your account
              </h1>

              <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
                It takes less than a minute to get started with IndraCast.
              </p>
            </div>

            {/* FORM */}
            <form
              className="space-y-10"
              onSubmit={(e) => {
                e.preventDefault();
                handleSignup();
              }}
            >
              {/* ACCOUNT */}
              <Section title="Account Information">
                <Field label="Full Name *" icon={<User className="h-4.5 w-4.5" />}>
                  <input
                    required
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>

                <Field label="Email Address *" icon={<Mail className="h-4.5 w-4.5" />}>
                  <input
                    required
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>

                <Field label="Password *" icon={<Lock className="h-4.5 w-4.5" />} span>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </Field>
              </Section>

              {/* PERSONAL */}
              <Section title="Personal Details">
                <Field label="Phone Number" icon={<Phone className="h-4.5 w-4.5" />}>
                  <input
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>

                <Field label="Gender" icon={<User className="h-4.5 w-4.5" />}>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </Field>

                <Field label="Age" icon={<Calendar className="h-4.5 w-4.5" />} span>
                  <input
                    type="number"
                    name="age"
                    placeholder="25"
                    value={form.age}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>
              </Section>

              {/* LOCATION */}
              <Section title="Location">
                <Field label="City" icon={<MapPin className="h-4.5 w-4.5" />}>
                  <input
                    name="city"
                    placeholder="Mumbai"
                    value={form.city}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>

                <Field label="State" icon={<Globe className="h-4.5 w-4.5" />}>
                  <input
                    name="state"
                    placeholder="Maharashtra"
                    value={form.state}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>

                <Field label="Country" icon={<Globe className="h-4.5 w-4.5" />} span>
                  <input value="India" disabled className={`${inputClass} opacity-60 cursor-not-allowed`} />
                </Field>
              </Section>

              {error && (
                <div className="p-3.5 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl 
                bg-gradient-to-r from-blue-600 to-amber-500 py-4 font-extrabold text-white shadow-xl
                hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 text-sm"
              >
                {loading ? "Creating Account..." : "Create Account"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="text-center pt-8 border-t border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-500">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 font-bold hover:underline"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- HELPERS ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  span,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  span?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${span ? "md:col-span-2" : ""}`}>
      <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}
