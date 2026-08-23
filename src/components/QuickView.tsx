"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, Sparkles, Eye } from "lucide-react";

const weatherCards = [
  {
    id: 0,
    title: "Sunny Conditions",
    image: "/quick-view/1.jpg",
    desc: "Clear skies with bright sunshine. Ideal for outdoor activities, travel, and solar telemetry monitoring.",
    badge: "Clear & Bright",
    gradient: "from-amber-500/20 to-orange-500/10",
  },
  {
    id: 1,
    title: "Rain Forecast",
    image: "/quick-view/2.jpg",
    desc: "Possible rainfall in several regions. Carry umbrellas when heading out and track live monsoon shifts.",
    badge: "Monsoon Watch",
    gradient: "from-blue-500/20 to-indigo-500/10",
  },
  {
    id: 2,
    title: "Wind Updates",
    image: "/quick-view/3.jpg",
    desc: "Moderate wind speeds expected. Coastal areas may experience stronger localized wind vectors and gusts.",
    badge: "Breeze Vector",
    gradient: "from-sky-500/20 to-teal-500/10",
  },
  {
    id: 3,
    title: "Humidity Levels",
    image: "/quick-view/4.jpg",
    desc: "Humidity rising in urban zones. Stay hydrated and monitor micro-climate moisture indexes throughout the day.",
    badge: "Moisture Index",
    gradient: "from-cyan-500/20 to-emerald-500/10",
  },
];

export default function QuickView() {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const toggleCard = (id: number) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <section className="w-full bg-white dark:bg-[#020617] text-gray-900 dark:text-white selection:bg-blue-500/30 transition-colors overflow-x-hidden">
      {/* --- PREMIUM HEADER SECTION --- */}
      <div className="pt-20 sm:pt-28 md:pt-36 pb-14 sm:pb-20 px-4 sm:px-6 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800/50 bg-blue-50/60 dark:bg-blue-900/20 px-3.5 py-1.5 mb-6 sm:mb-8 shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-xs font-semibold tracking-wide uppercase text-blue-700 dark:text-blue-300">
            Live Telemetry Engine
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-hero tracking-tight mb-6 sm:mb-8 bg-gradient-to-b from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-white/90 dark:to-white/40 bg-clip-text text-transparent leading-[1.15]"
        >
          The world&apos;s sky, <br className="hidden sm:inline" /> in your palm.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed px-2"
        >
          IndraCast delivers hyper-local atmospheric data with a stunning interactive
          interface. Experience the weather, don&apos;t just read about it.
        </motion.p>
      </div>

      {/* --- HERO SHOWCASE IMAGE --- */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 mb-20 sm:mb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[220px] xs:h-[280px] sm:h-[450px] md:h-[620px] lg:h-[720px] flex items-center justify-center rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] bg-gradient-to-b from-gray-200/60 to-transparent dark:from-white/5 border border-gray-200 dark:border-white/10 overflow-hidden shadow-2xl"
        >
          <div className="relative w-full h-full p-2 sm:p-6 md:p-10">
            <Image
              src="/quick-view/mobile-image.png"
              alt="IndraCast Weather Interface"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              className="object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)] sm:drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]"
            />
          </div>
        </motion.div>
      </div>

      {/* --- TAP-TO-REVEAL FEATURE CARDS GRID --- */}
      <div className="pb-24 sm:pb-32 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Atmospheric Intelligence Cards
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
            Tap any card below to reveal detailed meteorological insights
          </p>
        </div>

        <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {weatherCards.map((card) => {
            const isExpanded = expandedCard === card.id;

            return (
              <motion.div
                key={card.id}
                layout
                onClick={() => toggleCard(card.id)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative cursor-pointer overflow-hidden rounded-3xl bg-gray-50 dark:bg-[#0f172a] border transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-xl ${
                  isExpanded
                    ? "border-blue-500/60 dark:border-blue-500/50 bg-gradient-to-b dark:from-[#0f172a] dark:to-[#1e293b] ring-2 ring-blue-500/30"
                    : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                }`}
              >
                {/* Header Row: Title & Tap Badge */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {card.badge}
                    </span>

                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 bg-gray-200/60 dark:bg-white/5 px-2 py-1 rounded-full">
                      <Eye className="h-3 w-3" />
                      {isExpanded ? "Hide" : "Tap"}
                      <ChevronDown
                        className={`h-3 w-3 transition-transform duration-300 ${
                          isExpanded ? "rotate-180 text-blue-500" : ""
                        }`}
                      />
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {card.title}
                  </h3>
                </div>

                {/* Card Image Wrapper (Always Visible) */}
                <div className="my-5 relative h-44 sm:h-48 w-full rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  
                  {/* SubtleOverlay Hint */}
                  {!isExpanded && (
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-xs font-semibold backdrop-blur-md bg-black/40 px-3 py-1.5 rounded-xl border border-white/20">
                      <span>Tap for description</span>
                      <ChevronDown className="h-3.5 w-3.5 text-blue-400 animate-bounce" />
                    </div>
                  )}
                </div>

                {/* Animated Expandable Description (Shown when Tapped) */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="overflow-hidden space-y-4"
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-normal pt-1 border-t border-gray-200/80 dark:border-white/10">
                        {card.desc}
                      </p>

                      <div className="pt-2">
                        <Link
                          href="/services"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95"
                        >
                          Explore Live Telemetry
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* --- FOOTER TEXT --- */}
      <div className="py-16 sm:py-20 border-t border-gray-200 dark:border-white/5 px-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 tracking-widest uppercase font-semibold">
          IndraCast © 2026 — Engineered for the elements.
        </p>
      </div>
    </section>
  );
}
