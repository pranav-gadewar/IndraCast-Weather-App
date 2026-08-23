"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import {
  Sun,
  Moon,
  Menu,
  X,
  User,
  ChevronDown,
  LogOut,
  Shield,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { setAuthCookies, clearAuthCookies } from "@/lib/cookieUtils";
import { usePreloader } from "@/context/PreloaderContext";

export default function Navbar() {
  // 1️⃣ ALL Hooks declared unconditionally at the top level
  const { setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { triggerPreloader } = usePreloader();

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<{ name?: string; email?: string; role?: string } | null>(null);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  /* 🔥 Listen Firebase Auth State & Sync Cookies */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setUserData(null);
        clearAuthCookies();
        return;
      }

      setUser(firebaseUser);

      try {
        const docSnap = await getDoc(doc(db, "users", firebaseUser.uid));
        let role = "user";
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          role = data.role || "user";
        }
        const token = await firebaseUser.getIdToken();
        setAuthCookies(token, role);
      } catch (err) {
        console.error("Error fetching user metadata:", err);
      }
    });

    return () => unsub();
  }, []);

  /* CLOSE PROFILE DROPDOWN ON OUTSIDE CLICK */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2️⃣ Early returns AFTER all hooks are called
  if (pathname?.startsWith("/admin")) return null;
  if (!mounted) return <div className="h-14 w-full" />;

  const isDark = resolvedTheme === "dark";

  /* 🔥 Logout Function */
  const handleLogout = async () => {
    setProfileOpen(false);
    await triggerPreloader("logout", 2000);
    await signOut(auth);
    clearAuthCookies();
    setUser(null);
    setUserData(null);
    router.push("/auth/login");
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">

          {/* LOGO */}
          <div className="flex-1">
            <Link
              href="/"
              className="text-xl font-bold text-blue-600 dark:text-blue-400"
            >
              IndraCast
            </Link>
          </div>

          {/* NAV LINKS */}
          <div className="hidden md:flex flex-[2] justify-center gap-8">
            <NavLink href="/" active={pathname === "/"}>Home</NavLink>
            <NavLink href="/services" active={pathname === "/services"}>
              Services
            </NavLink>
            <NavLink href="/about" active={pathname === "/about"}>
              About
            </NavLink>
            <NavLink href="/contact" active={pathname === "/contact"}>
              Contact
            </NavLink>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-1 justify-end items-center gap-2 sm:gap-4">

            {/* THEME TOGGLE */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* 🔥 If NOT logged in → show Login */}
            {!user && (
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}

            {/* 🔥 Logged-in Profile */}
            {user && (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <div className="h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <User className="h-4 w-4" />
                  </div>

                  <span className="text-sm font-semibold hidden sm:block max-w-[120px] truncate">
                    {userData?.name || "User"}
                  </span>

                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden z-50">
                    <div className="p-3.5 border-b border-gray-100 dark:border-white/10 text-sm bg-gray-50/50 dark:bg-white/5">
                      <p className="font-bold text-gray-900 dark:text-white truncate">
                        {userData?.name || "User"}
                      </p>
                      <p className="text-gray-500 text-xs truncate">
                        {userData?.email || user.email}
                      </p>
                      {userData?.role === "admin" && (
                        <span className="mt-1.5 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          Admin
                        </span>
                      )}
                    </div>

                    <div className="p-1.5 space-y-0.5">
                      {/* <DropdownLink href="/profile" icon={<User className="h-4 w-4" />}>
                        Profile
                      </DropdownLink>

                      <DropdownLink href="/history" icon={<Clock className="h-4 w-4" />}>
                        History
                      </DropdownLink>

                      <DropdownLink href="/settings" icon={<Settings className="h-4 w-4" />}>
                        Settings
                      </DropdownLink> */}

                      {/* Admin dashboard option visible ONLY to admins */}
                      {userData?.role === "admin" && (
                        <DropdownLink
                          href="/admin/dashboard"
                          icon={<Shield className="h-4 w-4 text-amber-500" />}
                        >
                          Admin Dashboard
                        </DropdownLink>
                      )}

                      {/* <hr className="my-1 border-gray-100 dark:border-white/10" /> */}

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MOBILE MENU */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <div className="md:hidden absolute w-full bg-white dark:bg-black border-b px-4 py-4 space-y-2">
          <MobileNavLink href="/">Home</MobileNavLink>
          <MobileNavLink href="/about">About</MobileNavLink>
          <MobileNavLink href="/services">Services</MobileNavLink>
          <MobileNavLink href="/contact">Contact</MobileNavLink>
        </div>
      )}
    </nav>
  );
}

/* ---------- Components ---------- */

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium hover:text-blue-500 transition-colors ${
        active
          ? "text-blue-600 dark:text-blue-400 font-semibold"
          : "text-gray-600 dark:text-gray-400"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium"
    >
      {children}
    </Link>
  );
}

function DropdownLink({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
    >
      {icon}
      {children}
    </Link>
  );
}
