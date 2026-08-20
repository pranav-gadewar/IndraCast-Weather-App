import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Galindo } from "next/font/google";
import Navbar from "@/components/Navbar";
import ThemeWrapper from "@/components/ThemeWrapper";
import { PreloaderProvider } from "@/context/PreloaderContext";
import Preloader from "@/components/Preloader";
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

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

const galindo = Galindo({
  weight: "400",
  variable: "--font-galindo",
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
          ${poppins.variable}
          ${galindo.variable}
          antialiased
          transition-colors
          duration-300
        `}
      >
        <ThemeWrapper>
          <PreloaderProvider>
            <Preloader />
            <Navbar />
            <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
              {children}
            </main>
            <Footer />
          </PreloaderProvider>
        </ThemeWrapper>
      </body>
    </html>
  );
}
