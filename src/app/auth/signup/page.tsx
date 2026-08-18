// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   ArrowRight,
//   UserPlus,
//   Mail,
//   Lock,
//   User,
//   MapPin,
//   Phone,
//   Calendar,
//   Globe,
//   Eye,
//   EyeOff,
// } from "lucide-react";
// import { useTheme } from "next-themes";

// export default function SignupPage() {
//   const { resolvedTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => setMounted(true), []);

//   const inputClass =
//     "w-full rounded-2xl py-3.5 pl-12 pr-12 font-medium " +
//     "bg-white/90 dark:bg-zinc-950/80 backdrop-blur " +
//     "border border-slate-200/80 dark:border-white/10 " +
//     "text-slate-900 dark:text-white " +
//     "placeholder:text-slate-400 dark:placeholder:text-zinc-500 " +
//     "outline-none transition-all duration-200 " +
//     "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20";

//   return (
//     <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-black">

//       {/* LEFT VISUAL */}
//       <div className="relative hidden lg:block lg:flex-1 h-full">
//         {mounted && (
//           <Image
//             src={
//               resolvedTheme === "dark"
//                 ? "/auth/signup/signup-dark.jpg"
//                 : "/auth/signup/signup-light.jpg"
//             }
//             alt="Signup"
//             fill
//             priority
//             className="object-cover"
//           />
//         )}
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 via-transparent to-yellow-400/30 dark:to-black/85" />
//       </div>

//       {/* RIGHT FORM */}
//       <div className="relative flex w-full flex-col lg:w-[55%] h-full bg-slate-50 dark:bg-black">
//         <div className="flex-1 overflow-y-auto px-6 py-14 mt-18">
//           <div className="mx-auto max-w-xl space-y-12">

//             {/* HEADER */}
//             <div className="space-y-4">
//               <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-yellow-400 text-white shadow-xl">
//                 <UserPlus className="h-6 w-6" />
//               </div>

//               <h1 className="text-4xl font-black text-slate-900 dark:text-white">
//                 Create your account
//               </h1>

//               <p className="text-slate-600 dark:text-zinc-400">
//                 It takes less than a minute to get started.
//               </p>
//             </div>

//             {/* FORM (UI ONLY) */}
//             <form className="space-y-10">

//               <Section title="Account Information">
//                 <Field label="Full Name *" icon={<User />}>
//                   <input className={inputClass} />
//                 </Field>

//                 <Field label="Email Address *" icon={<Mail />}>
//                   <input type="email" className={inputClass} />
//                 </Field>

//                 <Field label="Password *" icon={<Lock />} span>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     className={inputClass}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500"
//                   >
//                     {showPassword ? <EyeOff /> : <Eye />}
//                   </button>
//                 </Field>
//               </Section>

//               <Section title="Personal Details">
//                 <Field label="Phone Number" icon={<Phone />}>
//                   <input className={inputClass} />
//                 </Field>

//                 <Field label="Gender" icon={<User />}>
//                   <select className={inputClass}>
//                     <option value="">Select</option>
//                     <option>Male</option>
//                     <option>Female</option>
//                     <option>Other</option>
//                   </select>
//                 </Field>

//                 <Field label="Age" icon={<Calendar />} span>
//                   <input type="number" className={inputClass} />
//                 </Field>
//               </Section>

//               <Section title="Location">
//                 <Field label="City" icon={<MapPin />}>
//                   <input className={inputClass} />
//                 </Field>

//                 <Field label="State" icon={<Globe />}>
//                   <input className={inputClass} />
//                 </Field>

//                 <Field label="Country" icon={<Globe />} span>
//                   <input defaultValue="India" className={inputClass} />
//                 </Field>
//               </Section>

//               <button
//                 type="button"
//                 className="flex w-full items-center justify-center gap-3 rounded-2xl 
//                 bg-gradient-to-r from-blue-600 to-yellow-400 py-4 font-black text-white shadow-xl
//                 hover:opacity-90 active:scale-[0.98]"
//               >
//                 Create Account <ArrowRight />
//               </button>
//             </form>

//             <div className="text-center pt-8 border-t border-slate-200 dark:border-white/10">
//               Already have an account?{" "}
//               <Link href="/auth/login" className="text-blue-600 font-bold hover:underline">
//                 Sign in
//               </Link>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------- Helpers ---------- */

// function Section({ title, children }: { title: string; children: React.ReactNode }) {
//   return (
//     <div className="space-y-5">
//       <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
//         {title}
//       </h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {children}
//       </div>
//     </div>
//   );
// }

// function Field({
//   label,
//   icon,
//   span,
//   children,
// }: {
//   label: string;
//   icon: React.ReactNode;
//   span?: boolean;
//   children: React.ReactNode;
// }) {
//   return (
//     <div className={`space-y-1.5 ${span ? "md:col-span-2" : ""}`}>
//       <label className="ml-1 text-[11px] font-black uppercase tracking-widest text-slate-400">
//         {label}
//       </label>
//       <div className="relative">
//         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//           {icon}
//         </span>
//         {children}
//       </div>
//     </div>
//   );
// }


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
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function SignupPage() {
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // form state
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
    "w-full rounded-2xl py-3.5 pl-12 pr-12 font-medium " +
    "bg-white/90 dark:bg-zinc-950/80 backdrop-blur " +
    "border border-slate-200/80 dark:border-white/10 " +
    "text-slate-900 dark:text-white " +
    "placeholder:text-slate-400 dark:placeholder:text-zinc-500 " +
    "outline-none transition-all duration-200 " +
    "focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20";

  /* ----------- HANDLE CHANGE ----------- */
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ----------- SIGNUP ----------- */
  const handleSignup = async () => {
    try {
      setLoading(true);
      setError("");

      if (!form.email || !form.password || !form.name) {
        throw new Error("Please fill required fields.");
      }

      // 1️⃣ Create Firebase auth user
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const uid = userCred.user.uid;

      // 2️⃣ Store extra details in Firestore
      await setDoc(doc(db, "users", uid), {
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

      router.push("/"); // redirect after signup
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-black">

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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/50 via-transparent to-yellow-400/30 dark:to-black/85" />
      </div>

      {/* FORM */}
      <div className="relative flex w-full flex-col lg:w-[55%] h-full bg-slate-50 dark:bg-black">
        <div className="flex-1 overflow-y-auto px-6 py-14 mt-18">
          <div className="mx-auto max-w-xl space-y-12">

            {/* HEADER */}
            <div className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-yellow-400 text-white shadow-xl">
                <UserPlus className="h-6 w-6" />
              </div>

              <h1 className="text-4xl font-black text-slate-900 dark:text-white">
                Create your account
              </h1>

              <p className="text-slate-600 dark:text-zinc-400">
                It takes less than a minute to get started.
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
                <Field label="Full Name *" icon={<User />}>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>

                <Field label="Email Address *" icon={<Mail />}>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>

                <Field label="Password *" icon={<Lock />} span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </Field>
              </Section>

              {/* PERSONAL */}
              <Section title="Personal Details">
                <Field label="Phone Number" icon={<Phone />}>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>

                <Field label="Gender" icon={<User />}>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </Field>

                <Field label="Age" icon={<Calendar />} span>
                  <input
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>
              </Section>

              {/* LOCATION */}
              <Section title="Location">
                <Field label="City" icon={<MapPin />}>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>

                <Field label="State" icon={<Globe />}>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>

                <Field label="Country" icon={<Globe />} span>
                  <input value="India" disabled className={inputClass} />
                </Field>
              </Section>

              {error && (
                <p className="text-red-500 text-sm font-semibold">{error}</p>
              )}

              <button
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl 
                bg-gradient-to-r from-blue-600 to-yellow-400 py-4 font-black text-white shadow-xl
                hover:opacity-90 active:scale-[0.98]"
              >
                {loading ? "Creating Account..." : "Create Account"}
                <ArrowRight />
              </button>
            </form>

            <div className="text-center pt-8 border-t border-slate-200 dark:border-white/10">
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

function Section({ title, children }: any) {
  return (
    <div className="space-y-5">
      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
}

function Field({ label, icon, span, children }: any) {
  return (
    <div className={`space-y-1.5 ${span ? "md:col-span-2" : ""}`}>
      <label className="ml-1 text-[11px] font-black uppercase tracking-widest text-slate-400">
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
