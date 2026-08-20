"use client";

import { usePreloader } from "@/context/PreloaderContext";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, CloudRain, Lock, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Preloader() {
  const { preloaderType } = usePreloader();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!preloaderType) return null;

  const isDark = !mounted || resolvedTheme === "dark";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none transition-colors duration-300 ${
          isDark ? "bg-slate-955 bg-slate-950 text-white" : "bg-white text-slate-900"
        }`}
      >
        {/* Glow ambient spots */}
        <div className={`absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full blur-3xl ${
          isDark ? "bg-blue-600/10" : "bg-blue-400/10"
        }`} />
        <div className={`absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full blur-3xl ${
          isDark ? "bg-amber-500/10" : "bg-amber-400/10"
        }`} />

        <div className="relative flex flex-col items-center text-center px-6 max-w-md space-y-8">
          
          {/* 1️⃣ INITIAL VISIT PRELOADER */}
          {preloaderType === "initial" && (
            <>
              {/* Spinning Sun & Cloud Logo Container */}
              <div className="relative flex items-center justify-center h-28 w-28">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                  className="absolute"
                >
                  <Sun className="h-16 w-16 text-amber-500" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute mt-6 ml-6"
                >
                  <CloudRain className="h-12 w-12 text-blue-400" />
                </motion.div>
              </div>

              <div className="space-y-2">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-black tracking-widest bg-gradient-to-r from-blue-500 to-amber-500 bg-clip-text text-transparent"
                >
                  INDRACAST
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className={`text-xs font-bold uppercase tracking-widest ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Initializing live weather matrices...
                </motion.p>
              </div>
            </>
          )}

          {/* 2️⃣ SUCCESSFUL LOGIN PRELOADER */}
          {preloaderType === "login" && (
            <>
              {/* Pulsing Shield/Lock graphic */}
              <div className="relative flex items-center justify-center h-28 w-28">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  className={`absolute h-24 w-24 rounded-full flex items-center justify-center border-2 ${
                    isDark
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-emerald-500/5 border-emerald-500/20"
                  }`}
                >
                  <Lock className="h-10 w-10 text-emerald-500" />
                </motion.div>
                <div className={`absolute h-28 w-28 rounded-full border animate-ping ${
                  isDark ? "border-emerald-500/10" : "border-emerald-500/20"
                }`} />
              </div>

              <div className="space-y-2">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl font-black tracking-wide text-emerald-500"
                >
                  Access Granted
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`text-xs font-bold uppercase tracking-widest ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Decrypting user profile & operations...
                </motion.p>
              </div>
            </>
          )}

          {/* 3️⃣ LOGOUT PRELOADER */}
          {preloaderType === "logout" && (
            <>
              {/* Clearing sessions graphic */}
              <div className="relative flex items-center justify-center h-28 w-28">
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="absolute h-24 w-24 rounded-full border-2 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent"
                />
                <LogOut className="h-10 w-10 text-red-500" />
              </div>

              <div className="space-y-2">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-2xl font-black tracking-wide text-red-500"
                >
                  Signing Out
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`text-xs font-bold uppercase tracking-widest ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Safely clearing secure session state...
                </motion.p>
              </div>
            </>
          )}

          {/* Bottom generic loading bars */}
          <div className={`w-48 h-1 rounded-full overflow-hidden ${
            isDark ? "bg-white/10" : "bg-slate-200"
          }`}>
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="h-full w-24 bg-gradient-to-r from-blue-500 to-amber-500 rounded-full"
            />
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
