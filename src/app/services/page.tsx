// "use client";

// import { useState } from "react";
// import { Search } from "lucide-react";

// export default function ServicesPage() {
//   const [location, setLocation] = useState("");

//   return (
//     <div className="pt-16">
//       {/* HERO */}
//       <section className="relative overflow-hidden">
//         <div className="absolute inset-0 -z-10">
//           <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
//           <div className="absolute top-40 right-20 h-[400px] w-[400px] rounded-full bg-yellow-400/20 blur-3xl" />
//         </div>

//         <div className="py-28 text-center">
//           <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
//             Weather Services
//             <span className="block bg-gradient-to-r from-blue-600 to-yellow-400 bg-clip-text text-transparent">
//               Built for India
//             </span>
//           </h1>
//           <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
//             Real-time forecasts, historical insights, and location-based
//             weather data — all in one clean dashboard.
//           </p>
//         </div>
//       </section>

//       {/* SEARCH */}
//       <section className="py-10 px-6 flex justify-center">
//         <div className="w-full max-w-xl flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/60 backdrop-blur-xl p-3 shadow-lg">
//           <Search className="text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search city or state (India)"
//             value={location}
//             onChange={(e) => setLocation(e.target.value)}
//             className="flex-1 bg-transparent outline-none text-sm"
//           />
//           <button className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition">
//             Search
//           </button>
//         </div>
//       </section>

//       {/* CURRENT WEATHER */}
//       <section className="py-16 text-center">
//         <h2 className="text-2xl font-semibold mb-8">
//           Current Weather
//         </h2>

//         <div className="inline-block rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl px-16 py-10 shadow-xl">
//           <p className="text-6xl font-light tracking-tight">28°C</p>
//           <p className="mt-2 text-lg font-medium">Partly Cloudy</p>
//           <p className="mt-1 text-sm opacity-70">Pune, Maharashtra</p>
//         </div>
//       </section>

//       {/* HOURLY FORECAST */}
//       <section className="py-20 px-6">
//         <h2 className="text-2xl font-semibold mb-10 text-center">
//           Hourly Forecast
//         </h2>

//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-5xl mx-auto">
//           {["Now", "1 PM", "2 PM", "3 PM"].map((time, i) => (
//             <div
//               key={i}
//               className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-xl p-6 text-center hover:scale-[1.03] transition"
//             >
//               <p className="text-sm font-medium opacity-70">{time}</p>
//               <p className="mt-3 text-3xl font-semibold">29°</p>
//               <p className="mt-1 text-sm opacity-60">Cloudy</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* PAST WEATHER */}
//       <section className="py-20 px-6 bg-gray-50 dark:bg-black/40">
//         <h2 className="text-2xl font-semibold mb-10 text-center">
//           Past Hourly Weather
//         </h2>

//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-5xl mx-auto">
//           {["10 AM", "11 AM", "12 PM", "1 PM"].map((time, i) => (
//             <div
//               key={i}
//               className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl p-6 text-center"
//             >
//               <p className="text-sm font-medium opacity-70">{time}</p>
//               <p className="mt-3 text-3xl font-semibold">27°</p>
//               <p className="mt-1 text-sm opacity-60">Sunny</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* INFO */}
//       <section className="py-24 px-6 text-center">
//         <h2 className="text-2xl font-semibold mb-6">
//           Did You Know?
//         </h2>

//         <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300 leading-relaxed">
//           Modern weather forecasting combines satellite imagery, atmospheric
//           physics, and machine learning models to predict conditions with
//           remarkable accuracy. IndraCast is built to present this complex
//           data in a form that’s easy to understand and act upon.
//         </p>
//       </section>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ServicesPage() {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /* 🔐 Auth Protection */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  /* Prevent flash before auth check */
  if (loading) {
    return (
      <div className="pt-16 h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="pt-16">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute top-40 right-20 h-[400px] w-[400px] rounded-full bg-yellow-400/20 blur-3xl" />
        </div>

        <div className="py-28 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Weather Services
            <span className="block bg-gradient-to-r from-blue-600 to-yellow-400 bg-clip-text text-transparent">
              Built for India
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Real-time forecasts, historical insights, and location-based
            weather data — all in one clean dashboard.
          </p>
        </div>
      </section>

      {/* SEARCH */}
      <section className="py-10 px-6 flex justify-center">
        <div className="w-full max-w-xl flex items-center gap-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-black/60 backdrop-blur-xl p-3 shadow-lg">
          <Search className="text-gray-400" />
          <input
            type="text"
            placeholder="Search city or state (India)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <button className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition">
            Search
          </button>
        </div>
      </section>

      {/* CURRENT WEATHER */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-semibold mb-8">
          Current Weather
        </h2>

        <div className="inline-block rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl px-16 py-10 shadow-xl">
          <p className="text-6xl font-light tracking-tight">28°C</p>
          <p className="mt-2 text-lg font-medium">Partly Cloudy</p>
          <p className="mt-1 text-sm opacity-70">Pune, Maharashtra</p>
        </div>
      </section>

      {/* HOURLY FORECAST */}
      <section className="py-20 px-6">
        <h2 className="text-2xl font-semibold mb-10 text-center">
          Hourly Forecast
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {["Now", "1 PM", "2 PM", "3 PM"].map((time, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-xl p-6 text-center hover:scale-[1.03] transition"
            >
              <p className="text-sm font-medium opacity-70">{time}</p>
              <p className="mt-3 text-3xl font-semibold">29°</p>
              <p className="mt-1 text-sm opacity-60">Cloudy</p>
            </div>
          ))}
        </div>
      </section>

      {/* PAST WEATHER */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-black/40">
        <h2 className="text-2xl font-semibold mb-10 text-center">
          Past Hourly Weather
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {["10 AM", "11 AM", "12 PM", "1 PM"].map((time, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl p-6 text-center"
            >
              <p className="text-sm font-medium opacity-70">{time}</p>
              <p className="mt-3 text-3xl font-semibold">27°</p>
              <p className="mt-1 text-sm opacity-60">Sunny</p>
            </div>
          ))}
        </div>
      </section>

      {/* INFO */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-6">
          Did You Know?
        </h2>

        <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300 leading-relaxed">
          Modern weather forecasting combines satellite imagery, atmospheric
          physics, and machine learning models to predict conditions with
          remarkable accuracy. IndraCast is built to present this complex
          data in a form that’s easy to understand and act upon.
        </p>
      </section>
    </div>
  );
}
