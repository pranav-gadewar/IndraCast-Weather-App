"use client";

import { motion } from "framer-motion";
import { CloudSun, CloudRain, Wind, ArrowRight } from "lucide-react";
import { Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col items-center overflow-hidden pt-12 sm:pt-16">
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] left-1/2 h-[350px] sm:h-[500px] w-[350px] sm:w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[100px] sm:blur-[120px] dark:bg-blue-400/5" />
        <div className="absolute top-[20%] right-[10%] h-[300px] sm:h-[400px] w-[300px] sm:w-[400px] rounded-full bg-amber-200/10 blur-[90px] sm:blur-[100px] dark:bg-amber-500/5" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 md:py-20 w-full">
        <div className="grid grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-2 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start"
          >
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800/50 bg-blue-50/60 dark:bg-blue-900/20 px-3.5 py-1 text-xs font-semibold tracking-wide text-blue-700 dark:text-blue-300 uppercase shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              India-focused Weather Dashboard
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="mt-5 sm:mt-6 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]"
            >
              Weather that moves
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500 bg-clip-text text-transparent">
                with India
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-4 sm:mt-6 max-w-lg text-sm sm:text-base md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light"
            >
              IndraCast delivers clean, accurate, and location-specific weather
              insights for cities across the subcontinent—all in a beautifully
              minimal interface.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4 w-full"
            >
              <Link
                href="/services"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 sm:px-7 sm:py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 active:scale-95 whitespace-nowrap shrink-0"
              >
                Explore Weather
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-gray-200 dark:border-white/10 px-5 py-3 sm:px-7 sm:py-3.5 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95 whitespace-nowrap shrink-0"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Visual - Ultra Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="relative w-full"
          >
            {/* The Glass Card */}
            <div className="relative z-10 overflow-hidden rounded-3xl sm:rounded-[2.5rem] border border-white/40 dark:border-white/10 bg-white/40 dark:bg-white/5 p-1 backdrop-blur-2xl shadow-2xl">
              <div className="rounded-[1.4rem] sm:rounded-[2.2rem] bg-white/60 dark:bg-black/50 p-4 sm:p-6 md:p-8">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                      Current Condition
                    </h3>
                    <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                      Pune, Maharashtra
                    </p>
                  </div>
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="space-y-6 sm:space-y-8">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2.5 sm:p-3.5 rounded-2xl bg-amber-400/20 text-amber-500 shrink-0">
                        <CloudSun className="h-6 w-6 sm:h-8 sm:w-8" />
                      </div>
                      <span className="text-base sm:text-xl font-medium text-gray-700 dark:text-gray-200">
                        Clear Sky
                      </span>
                    </div>
                    <span className="text-4xl sm:text-5xl font-light tracking-tighter text-black dark:text-white">
                      32°C
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="rounded-2xl sm:rounded-3xl border border-white/30 dark:border-white/10 bg-white/30 dark:bg-white/5 p-3.5 sm:p-5">
                      <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2 text-blue-500">
                        <CloudRain className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-[10px] sm:text-xs font-semibold uppercase opacity-70">
                          Humidity
                        </span>
                      </div>
                      <span className="text-xl sm:text-2xl font-bold">58%</span>
                    </div>

                    <div className="rounded-2xl sm:rounded-3xl border border-white/30 dark:border-white/10 bg-white/30 dark:bg-white/5 p-3.5 sm:p-5">
                      <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2 text-sky-400">
                        <Wind className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-[10px] sm:text-xs font-semibold uppercase opacity-70">
                          Wind
                        </span>
                      </div>
                      <span className="text-xl sm:text-2xl font-bold">
                        12 <span className="text-xs sm:text-sm font-normal text-gray-500">km/h</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative background glow element */}
            <div className="absolute -bottom-6 -right-6 -z-10 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />
          </motion.div>
        </div>
      </div>

      {/* ===== Brand Identity Section ===== */}
      <div className="w-full flex flex-col items-center text-center mt-12 sm:mt-20 px-4 sm:px-6">
        <Image
          src="/logo/indracast-logo.png"
          alt="IndraCast Logo"
          width={100}
          height={100}
          className="mb-4 sm:mb-6 opacity-90 w-20 sm:w-28 h-auto"
        />

        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          IndraCast Weather Intelligence
        </h3>

        <p className="max-w-2xl mt-3 sm:mt-4 text-xs sm:text-base text-gray-600 dark:text-gray-400 font-light leading-relaxed">
          Clean, accurate, India-focused weather insights designed for clarity,
          reliability, and a beautiful user experience.
        </p>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-6 sm:mt-10 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
          <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
            🇮🇳 India Focused
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
            ⚡ Real-time Telemetry
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
            🌦 Minimalist UI
          </span>
        </div>
      </div>
    </section>
  );
}
