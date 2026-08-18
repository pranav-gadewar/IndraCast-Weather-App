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
    <section className="relative min-h-[90vh] flex flex-col items-center overflow-hidden pt-16">
      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px] dark:bg-blue-400/5" />
        <div className="absolute top-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-yellow-200/10 blur-[100px] dark:bg-yellow-500/5" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start"
          >
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/20 px-3 py-1 text-xs font-semibold tracking-wide text-blue-700 dark:text-blue-300 uppercase shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              India-focused Weather Dashboard
            </motion.span>

            <motion.h1
              variants={itemVariants}
              className="mt-8 text-5xl md:text-7xl font-bold tracking-tight text-black dark:text-white leading-[1.1]"
            >
              Weather that moves
              <span className="block bg-gradient-to-r from-blue-600 via-blue-400 to-yellow-500 bg-clip-text text-transparent">
                with India
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-8 max-w-lg text-lg md:text-xl text-gray-500 dark:text-gray-400 leading-relaxed"
            >
              IndraCast delivers clean, accurate, and location-specific weather
              insights for cities across the subcontinent—all in a beautifully
              minimal interface.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-wrap gap-5"
            >
              {/* <button className="group flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-[15px] text-white font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                Explore Weather
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="rounded-full border border-gray-200 dark:border-white/10 px-8 py-4 text-[15px] font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95">
                Learn More
              </button> */}
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-[15px] font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                Explore Weather
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center rounded-full border border-gray-200 dark:border-white/10 px-8 py-4 text-[15px] font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all active:scale-95"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Visual - Ultra Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="relative"
          >
            {/* The Glass Card */}
            <div className="relative z-10 overflow-hidden rounded-[2.5rem] border border-white/40 dark:border-white/10 bg-white/30 dark:bg-white/5 p-1 backdrop-blur-2xl shadow-2xl">
              <div className="rounded-[2.2rem] bg-white/40 dark:bg-black/40 p-10">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                      Current Condition
                    </h3>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      Pune, Maharashtra
                    </p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="p-3 rounded-2xl bg-yellow-400/20 text-yellow-500">
                        <CloudSun className="h-8 w-8" />
                      </div>
                      <span className="text-xl font-medium text-gray-700 dark:text-gray-200">
                        Clear Sky
                      </span>
                    </div>
                    <span className="text-5xl font-light tracking-tighter text-black dark:text-white">
                      32°C
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-3xl border border-white/20 bg-white/20 dark:bg-white/5 p-5">
                      <div className="flex items-center gap-3 mb-2 text-blue-500">
                        <CloudRain className="h-5 w-5" />
                        <span className="text-xs font-semibold uppercase opacity-60">
                          Humidity
                        </span>
                      </div>
                      <span className="text-2xl font-semibold">58%</span>
                    </div>

                    <div className="rounded-3xl border border-white/20 bg-white/20 dark:bg-white/5 p-5">
                      <div className="flex items-center gap-3 mb-2 text-sky-400">
                        <Wind className="h-5 w-5" />
                        <span className="text-xs font-semibold uppercase opacity-60">
                          Wind
                        </span>
                      </div>
                      <span className="text-2xl font-semibold">
                        12 <span className="text-sm font-normal">km/h</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative background element for the card */}
            <div className="absolute -bottom-6 -right-6 -z-10 h-32 w-32 rounded-full bg-blue-500/20 blur-2xl" />
          </motion.div>
        </div>
      </div>
      {/* ===== Brand Identity Section ===== */}
      <div className="w-full flex flex-col items-center text-center mt-20 px-6">
        {/* Logo */}
        <Image
          src="/logo/indracast-logo.png"
          alt="IndraCast Logo"
          width={120}
          height={120}
          className="mb-6 opacity-90"
        />

        {/* Tagline */}
        <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
          IndraCast Weather Intelligence
        </h3>

        {/* Description */}
        <p className="max-w-2xl mt-4 text-gray-600 dark:text-gray-400">
          Clean, accurate, India-focused weather insights designed for clarity,
          reliability, and a beautiful user experience.
        </p>

        {/* Optional Stats / Info Row */}
        <div className="flex flex-wrap justify-center gap-10 mt-10 text-sm text-gray-500 dark:text-gray-400">
          <span>🇮🇳 India Focused</span>
          <span>⚡ Real-time Updates</span>
          <span>🌦 Minimal Interface</span>
        </div>
      </div>
    </section>
  );
}
