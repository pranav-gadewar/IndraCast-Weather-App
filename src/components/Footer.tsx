"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Do not render footer on admin portal routes
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Brand */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              IndraCast
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              A modern, India-focused weather dashboard built with clarity and
              performance in mind.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Services
            </Link>
            <Link
              href="/about"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} IndraCast. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
