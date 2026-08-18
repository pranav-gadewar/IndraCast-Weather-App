// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useTheme } from "next-themes";
// import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";

// export default function LoginPage() {
//   const { resolvedTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => setMounted(true), []);

//   const backgroundImage =
//     mounted && resolvedTheme === "dark"
//       ? "/auth/login/login3.jpg"
//       : "/auth/login/login.jpg";

//   return (
//     <div className="flex min-h-[calc(100vh-56px)] w-full flex-col lg:flex-row pt-14 bg-white dark:bg-black transition-colors duration-500">

//       {/* LEFT FORM */}
//       <div className="relative flex w-full items-center justify-center px-8 py-12 lg:w-[45%] xl:w-[40%] bg-slate-50/60 dark:bg-zinc-950/70 backdrop-blur-xl">
//         <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

//         <div className="relative w-full max-w-sm space-y-10">

//           {/* Header */}
//           <div className="space-y-4">
//             <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
//               <ShieldCheck className="h-7 w-7" />
//             </div>

//             <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white">
//               Welcome back
//             </h1>

//             <p className="text-lg text-slate-500 dark:text-zinc-400">
//               Sign in to continue exploring{" "}
//               <span className="font-bold text-blue-600 dark:text-blue-400">
//                 IndraCast
//               </span>.
//             </p>
//           </div>

//           {/* Form (UI only) */}
//           <form className="space-y-6">

//             <div className="space-y-2">
//               <label className="ml-1 text-xs font-bold uppercase text-slate-700 dark:text-zinc-300">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//                 <input
//                   type="email"
//                   required
//                   className="w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-4 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:text-white"
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label className="ml-1 text-xs font-bold uppercase text-slate-700 dark:text-zinc-300">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//                 <input
//                   type="password"
//                   required
//                   className="w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-4 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:text-white"
//                 />
//               </div>
//             </div>

//             <button
//               type="button"
//               className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 dark:bg-blue-600 py-4 text-white font-bold hover:bg-slate-800 dark:hover:bg-blue-700 active:scale-[0.98]"
//             >
//               Sign In <ArrowRight />
//             </button>
//           </form>

//           <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 text-center">
//             New to IndraCast?{" "}
//             <Link href="/auth/signup" className="text-blue-600 font-bold hover:underline">
//               Create an account
//             </Link>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT VISUAL */}
//       <div className="relative hidden lg:block flex-1 overflow-hidden">
//         {mounted && (
//           <Image
//             src={backgroundImage}
//             alt="Weather Visual"
//             fill
//             priority
//             className="object-cover"
//           />
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const { resolvedTheme } = useTheme();
  const router = useRouter();

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

  const handleChange = (e: any) => {
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
        form.password,
      );

      const uid = userCred.user.uid;

      // 2️⃣ Fetch Firestore user role
      const docSnap = await getDoc(doc(db, "users", uid));

      if (!docSnap.exists()) {
        throw new Error("User profile not found.");
      }

      const userData = docSnap.data();

      // 3️⃣ Role-based redirect
      if (userData.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)] w-full flex-col lg:flex-row pt-14 bg-white dark:bg-black transition-colors duration-500">
      {/* LEFT FORM */}
      <div className="relative flex w-full items-center justify-center px-8 py-12 lg:w-[45%] xl:w-[40%] bg-slate-50/60 dark:bg-zinc-950/70 backdrop-blur-xl">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative w-full max-w-sm space-y-10">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
              <ShieldCheck className="h-7 w-7" />
            </div>

            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white">
              Welcome back
            </h1>

            <p className="text-lg text-slate-500 dark:text-zinc-400">
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
              <label className="ml-1 text-xs font-bold uppercase text-slate-700 dark:text-zinc-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-4 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-xs font-bold uppercase text-slate-700 dark:text-zinc-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-4 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:text-white"
                />
              </div>

              <div className="flex justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-semibold">{error}</p>
            )}

            <button
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-900 dark:bg-blue-600 py-4 text-white font-bold hover:bg-slate-800 dark:hover:bg-blue-700 active:scale-[0.98]"
            >
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight />
            </button>
          </form>

          <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 text-center">
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
