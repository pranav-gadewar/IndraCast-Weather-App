"use client";

import { motion } from "framer-motion";
import { Sparkles, Video } from "lucide-react";

export default function HomeVideo() {
  return (
    <section className="relative py-12 sm:py-16 md:py-24 w-full bg-white dark:bg-[#020617] transition-colors overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] h-[200px] sm:h-[400px] bg-blue-500/10 dark:bg-blue-600/10 blur-[90px] sm:blur-[120px] rounded-full" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800/50 bg-blue-50/60 dark:bg-blue-900/20 px-3.5 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
            Atmospheric Motion Showcase
          </motion.div>
          
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Subcontinent Weather Dynamics
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto font-light">
            Real-time atmospheric motion capture showcasing weather patterns across mountain ranges and coastal zones.
          </p>
        </div>

        {/* Video Card Container - Aspect 16:9 Zero-Crop Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-video rounded-2xl sm:rounded-3xl border border-gray-200 dark:border-white/10 bg-black overflow-hidden shadow-2xl"
        >
          <video
            className="w-full h-full object-contain sm:object-cover bg-black"
            src="/hero/videos/home_video.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />

          {/* Floating Live Telemetry Badge Overlay */}
          <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 flex items-center justify-between pointer-events-none">
            <div className="backdrop-blur-md bg-black/60 border border-white/20 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full text-white shadow-xl flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-bold tracking-wider uppercase text-gray-200">
                Live Subcontinent Feed
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 backdrop-blur-md bg-black/60 border border-white/20 px-3.5 py-1.5 rounded-full text-white/90 text-xs font-semibold">
              <Video className="h-3.5 w-3.5 text-blue-400" /> HD Motion Telemetry
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
