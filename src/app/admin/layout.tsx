"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  CloudSun,
  Users,
  User,
  Settings,
  X,
} from "lucide-react";

import AdminHeader from "@/components/admin/AdminHeader";
import { useSession } from "@/hooks/useSession";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);

  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setSidebarOpen(false);
  }

  // Gate on the app's own signed session (works for both password- and
  // passcode-authenticated admins) rather than Firebase's client auth state
  // alone, which a passcode login never establishes.
  const { session, loading: sessionLoading } = useSession();

  useEffect(() => {
    if (sessionLoading) return;

    if (!session) {
      router.replace("/auth/login?redirect=/admin/dashboard");
      return;
    }

    if (session.role !== "admin") {
      router.replace("/");
    }
  }, [session, sessionLoading, router]);

  const adminUser = session
    ? { uid: session.uid, name: session.name, email: session.email, role: session.role }
    : null;

  if (sessionLoading || !session || session.role !== "admin") {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mb-4" />
        <p className="text-slate-400 text-base font-semibold">Verifying admin credentials...</p>
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Weather Forecast", href: "/admin/forecast", icon: CloudSun },
    { label: "Active Users", href: "/admin/users", icon: Users },
    { label: "Profile", href: "/admin/profile", icon: User },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="h-screen max-h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* SEPARATE ADMIN HEADER */}
      <AdminHeader
        adminUser={adminUser}
        isSidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:flex w-64 border-r border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl flex-col justify-between p-5 shrink-0 overflow-y-auto">
          <div className="space-y-5">
            <div className="px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                Navigation
              </span>
            </div>

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      active
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-400 text-center font-semibold">
              IndraCast Admin v1.0
            </p>
          </div>
        </aside>

        {/* MOBILE SIDEBAR DRAWER */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="relative w-64 max-w-[80vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between z-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                    Admin Menu
                  </span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          active
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-400 text-center font-semibold">
                  IndraCast Admin Portal
                </p>
              </div>
            </aside>
          </div>
        )}

        {/* MAIN CONTENT OUTLET */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8 min-h-0">
          {children}
        </main>
      </div>
    </div>
  );
}
