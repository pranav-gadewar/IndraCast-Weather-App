// "use client";

// import Link from "next/link";
// import { useTheme } from "next-themes";
// import { useEffect, useRef, useState } from "react";
// import {
//   Sun,
//   Moon,
//   Menu,
//   X,
//   User,
//   ChevronDown,
//   LogOut,
//   Clock,
//   Settings,
//   Shield,
// } from "lucide-react";
// import { usePathname } from "next/navigation";

// export default function Navbar() {
//   const { setTheme, resolvedTheme } = useTheme();
//   const pathname = usePathname();

//   const [mounted, setMounted] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);

//   const profileRef = useRef<HTMLDivElement>(null);

//   useEffect(() => setMounted(true), []);
//   useEffect(() => setMenuOpen(false), [pathname]);

//   /* CLOSE PROFILE DROPDOWN */
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         profileRef.current &&
//         !profileRef.current.contains(e.target as Node)
//       ) {
//         setProfileOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   if (!mounted) return <div className="h-14 w-full" />;

//   const isDark = resolvedTheme === "dark";

//   return (
//     <nav className="fixed top-0 z-50 w-full border-b border-gray-200/50 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6">
//         <div className="flex h-14 items-center justify-between">

//           {/* LOGO */}
//           <div className="flex-1">
//             <Link
//               href="/"
//               className="text-xl font-bold text-blue-600 dark:text-blue-400"
//             >
//               IndraCast
//             </Link>
//           </div>

//           {/* DESKTOP LINKS */}
//           <div className="hidden md:flex flex-[2] justify-center gap-8">
//             <NavLink href="/" active={pathname === "/"}>Home</NavLink>
//             <NavLink href="/services" active={pathname === "/services"}>
//               Services
//             </NavLink>
//             <NavLink href="/about" active={pathname === "/about"}>
//               About
//             </NavLink>
//             <NavLink href="/contact" active={pathname === "/contact"}>
//               Contact
//             </NavLink>
//           </div>

//           {/* RIGHT CONTROLS */}
//           <div className="flex flex-1 justify-end items-center gap-2 sm:gap-4">

//             {/* THEME */}
//             <button
//               onClick={() => setTheme(isDark ? "light" : "dark")}
//               className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
//             >
//               {isDark ? (
//                 <Sun className="h-5 w-5 text-yellow-500" />
//               ) : (
//                 <Moon className="h-5 w-5" />
//               )}
//             </button>

//             {/* PROFILE BUTTON */}
//             <div ref={profileRef} className="relative">
//               <button
//                 onClick={() => setProfileOpen(!profileOpen)}
//                 className="flex items-center gap-1 p-1 rounded-full border hover:bg-gray-100 dark:hover:bg-white/10"
//               >
//                 <div className="h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
//                   <User className="h-4 w-4" />
//                 </div>
//                 <ChevronDown
//                   className={`h-3 w-3 transition ${
//                     profileOpen ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               {profileOpen && (
//                 <div className="absolute right-0 mt-3 w-48 rounded-2xl border bg-white dark:bg-zinc-950 shadow-xl">
//                   <div className="p-1">

//                     <DropdownLink
//                       href="/profile"
//                       icon={<User className="h-4 w-4" />}
//                     >
//                       Profile
//                     </DropdownLink>

//                     <DropdownLink
//                       href="/history"
//                       icon={<Clock className="h-4 w-4" />}
//                     >
//                       History
//                     </DropdownLink>

//                     <DropdownLink
//                       href="/settings"
//                       icon={<Settings className="h-4 w-4" />}
//                     >
//                       Settings
//                     </DropdownLink>

//                     {/* Optional Admin link always visible now */}
//                     <DropdownLink
//                       href="/admin"
//                       icon={<Shield className="h-4 w-4" />}
//                     >
//                       Admin Dashboard
//                     </DropdownLink>

//                     <hr className="my-1" />

//                     {/* UI logout only */}
//                     <button
//                       onClick={() => setProfileOpen(false)}
//                       className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
//                     >
//                       <LogOut className="h-4 w-4" />
//                       Logout
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* MOBILE MENU */}
//             <button
//               onClick={() => setMenuOpen(!menuOpen)}
//               className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
//             >
//               {menuOpen ? <X /> : <Menu />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* MOBILE DRAWER */}
//       {menuOpen && (
//         <div className="md:hidden absolute w-full bg-white dark:bg-black border-b px-4 py-4 space-y-2">
//           <MobileNavLink href="/">Home</MobileNavLink>
//           <MobileNavLink href="/about">About</MobileNavLink>
//           <MobileNavLink href="/services">Services</MobileNavLink>
//           <MobileNavLink href="/contact">Contact</MobileNavLink>
//         </div>
//       )}
//     </nav>
//   );
// }

// /* ---------- COMPONENTS ---------- */

// function NavLink({
//   href,
//   children,
//   active,
// }: {
//   href: string;
//   children: React.ReactNode;
//   active: boolean;
// }) {
//   return (
//     <Link
//       href={href}
//       className={`text-sm font-medium hover:text-blue-500 ${
//         active
//           ? "text-blue-600 dark:text-blue-400"
//           : "text-gray-600 dark:text-gray-400"
//       }`}
//     >
//       {children}
//     </Link>
//   );
// }

// function MobileNavLink({
//   href,
//   children,
// }: {
//   href: string;
//   children: React.ReactNode;
// }) {
//   return (
//     <Link
//       href={href}
//       className="block px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5"
//     >
//       {children}
//     </Link>
//   );
// }

// function DropdownLink({
//   href,
//   children,
//   icon,
// }: {
//   href: string;
//   children: React.ReactNode;
//   icon: React.ReactNode;
// }) {
//   return (
//     <Link
//       href={href}
//       className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
//     >
//       {icon}
//       {children}
//     </Link>
//   );
// }


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
  Clock,
  Settings,
  Shield,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar() {
  const { setTheme, resolvedTheme } = useTheme();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => setMenuOpen(false), [pathname]);

  /* 🔥 Listen Firebase Auth State */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setUserData(null);
        return;
      }

      setUser(firebaseUser);

      // Fetch Firestore user details
      const docSnap = await getDoc(doc(db, "users", firebaseUser.uid));
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    });

    return () => unsub();
  }, []);

  /* CLOSE PROFILE DROPDOWN */
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

  if (!mounted) return <div className="h-14 w-full" />;

  const isDark = resolvedTheme === "dark";

  /* 🔥 Logout Function */
  const handleLogout = async () => {
    await signOut(auth);
    setProfileOpen(false);
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
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
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
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
              >
                Login
              </Link>
            )}

            {/* 🔥 Logged-in Profile */}
            {user && (
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  <div className="h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>

                  <span className="text-sm font-semibold hidden sm:block">
                    {userData?.name || "User"}
                  </span>

                  <ChevronDown
                    className={`h-3 w-3 transition ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl border bg-white dark:bg-zinc-950 shadow-xl">
                    <div className="p-3 border-b text-sm">
                      <p className="font-semibold">
                        {userData?.name || "User"}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {userData?.email || user.email}
                      </p>
                    </div>

                    <div className="p-1">

                      <DropdownLink href="/profile" icon={<User />}>
                        Profile
                      </DropdownLink>

                      <DropdownLink href="/history" icon={<Clock />}>
                        History
                      </DropdownLink>

                      <DropdownLink href="/settings" icon={<Settings />}>
                        Settings
                      </DropdownLink>

                      {/* Admin only */}
                      {userData?.role === "admin" && (
                        <DropdownLink
                          href="/admin/dashboard"
                          icon={<Shield />}
                        >
                          Admin Dashboard
                        </DropdownLink>
                      )}

                      <hr className="my-1" />

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
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

function NavLink({ href, children, active }: any) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium hover:text-blue-500 ${
        active
          ? "text-blue-600 dark:text-blue-400"
          : "text-gray-600 dark:text-gray-400"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children }: any) {
  return (
    <Link
      href={href}
      className="block px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5"
    >
      {children}
    </Link>
  );
}

function DropdownLink({ href, children, icon }: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg"
    >
      {icon}
      {children}
    </Link>
  );
}
