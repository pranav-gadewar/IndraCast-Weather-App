"use client";

import Image from "next/image";
import Link from "next/link";

const weatherCards = [
  {
    title: "Sunny Conditions",
    image: "/quick-view/1.jpg",
    desc: "Clear skies with bright sunshine. Ideal for outdoor activities and travel.",
  },
  {
    title: "Rain Forecast",
    image: "/quick-view/2.jpg",
    desc: "Possible rainfall in several regions. Carry umbrellas when heading out.",
  },
  {
    title: "Wind Updates",
    image: "/quick-view/3.jpg",
    desc: "Moderate wind speeds expected. Coastal areas may experience stronger gusts.",
  },
  {
    title: "Humidity Levels",
    image: "/quick-view/4.jpg",
    desc: "Humidity rising in urban zones. Stay hydrated throughout the day.",
  },
];

export default function QuickView() {
  return (
    <section className="w-full bg-white dark:bg-[#020617] text-gray-900 dark:text-white selection:bg-blue-500/30 transition-colors">

      {/* --- PREMIUM HEADER SECTION --- */}
      <div className="pt-32 pb-20 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/20 px-3 py-1 mb-8 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-xs font-semibold tracking-wide uppercase text-blue-700 dark:text-blue-300">
            Live Precision
          </span>
        </div>

        <h1 className="text-5xl md:text-8xl font-hero tracking-tight mb-8 bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-white/40 bg-clip-text text-transparent">
          The world&apos;s sky, <br /> in your palm.
        </h1>

        <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
          IndraCast delivers hyper-local atmospheric data with a stunning 3D
          interface. Experience the weather, don&apos;t just read about it.
        </p>
      </div>

      {/* --- HERO IMAGE --- */}
      <div className="relative max-w-6xl mx-auto px-6 mb-32">
        <div className="relative w-full h-[300px] sm:h-[500px] md:h-[700px] flex items-center justify-center rounded-[2rem] md:rounded-[3rem] bg-gradient-to-b from-gray-200/60 to-transparent dark:from-white/5 border border-gray-200 dark:border-white/10 overflow-hidden">
          <div className="relative w-full h-full p-4 sm:p-8 md:p-12">
            <Image
              src="/quick-view/mobile-image.png"
              alt="IndraCast App Interface"
              fill
              priority
              className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.2)] md:drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </div>

      {/* --- FEATURE GRID --- */}
      <div className="pb-32 px-6 max-w-7xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {weatherCards.map((card, i) => (
            <div
              key={i}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-white/5 p-8 transition-all duration-500 hover:bg-gray-100 dark:hover:bg-[#1e293b] hover:border-gray-300 dark:hover:border-white/20"
            >
              <div className="relative z-10">
                <h3 className="text-xl font-semibold mb-3 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-light">
                  {card.desc}
                </p>
              </div>

              {/* Image Container */}
              <div className="mt-12 relative h-40 w-full rounded-2xl overflow-hidden shadow-inner">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 dark:opacity-60 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#0f172a] via-transparent to-transparent" />
              </div>

              {/* Action Tag */}
              <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <Link href="/services" className="inline-flex items-center gap-1">
                View Details
                </Link>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- FOOTER TEXT --- */}
      <div className="py-20 border-t border-gray-200 dark:border-white/5 px-6 text-center">
        <p className="text-[11px] text-gray-500 dark:text-gray-500 tracking-widest uppercase font-medium">
          IndraCast © 2026 — Engineered for the elements.
        </p>
      </div>
    </section>
  );
}
