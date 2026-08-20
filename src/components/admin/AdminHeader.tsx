"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Shield, LogOut, Menu, X } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { clearAuthCookies } from "@/lib/cookieUtils";
import { useRouter } from "next/navigation";
import { usePreloader } from "@/context/PreloaderContext";

interface AdminHeaderProps {
  adminUser: any;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export default function AdminHeader({
  adminUser,
  onToggleSidebar,
  isSidebarOpen,
}: AdminHeaderProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { triggerPreloader } = usePreloader();

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  const handleLogout = async () => {
    await triggerPreloader("logout", 2000);
    await signOut(auth);
    clearAuthCookies();
    router.push("/auth/login");
  };

  return (
    <header className="w-full h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between shrink-0 z-40">
      {/* Left Title & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            aria-label="Toggle Navigation Menu"
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}

        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-tight">
              IndraCast Admin
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              System Control & Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          System Operational
        </div>

        {/* Theme Toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            title="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Admin Profile & Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-500/30">
              {adminUser?.name?.charAt(0) || "A"}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs md:text-sm font-bold text-slate-900 dark:text-white max-w-[140px] truncate leading-tight">
                {adminUser?.name || "Admin"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[140px] truncate leading-tight">
                {adminUser?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl border border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
