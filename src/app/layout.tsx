import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import ThemeWrapper from "@/components/ThemeWrapper";
import "./globals.css";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IndraCast - Your Weather Companion",
  description:
    "IndraCast is a modern weather application built with Next.js, providing accurate forecasts and a sleek user experience. Stay ahead of the weather with IndraCast.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          transition-colors
          duration-300
        `}
      >
        <ThemeWrapper>
          <Navbar />
          <main className="pt-6 bg-white dark:bg-black text-black dark:text-white">
            {children}
          </main>
          <Footer />
        </ThemeWrapper>
      </body>
    </html>
  );
}
