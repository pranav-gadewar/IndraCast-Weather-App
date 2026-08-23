"use client";

import { motion } from "framer-motion";
import {
  CloudSun,
  ShieldCheck,
  Zap,
  Activity,
  Database,
  Cpu,
  Layers,
  Sparkles,
  Users,
  BarChart3,
  Mail,
  CheckCircle2,
  Compass,
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="pt-14 min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-white transition-colors relative overflow-x-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-6 left-1/4 h-72 sm:h-96 w-72 sm:w-96 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-600/10" />
        <div className="absolute top-80 right-10 sm:right-20 h-72 sm:h-96 w-72 sm:w-96 rounded-full bg-amber-400/15 blur-3xl dark:bg-amber-500/10" />
        <div className="absolute bottom-40 left-10 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 sm:pt-10 md:pt-12 pb-12 sm:pb-20 md:pb-24">
        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 px-4 py-1.5 text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40 shadow-sm">
            <Sparkles className="h-4 w-4 text-blue-500" />
            About IndraCast Engine
          </span>

          <h1 className="mt-6 text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15]">
            Architected for Precision.
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500 bg-clip-text text-transparent">
              Engineered for India.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-sm sm:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            <strong>IndraCast</strong> — derived from <em>Indra</em> (the ancient deity of thunderbolts and atmospheric weather) — is a state-of-the-art meteorological platform delivering real-time telemetry, air quality metrics, interactive analytics, and secure administrative controls.
          </p>
        </motion.div>

        {/* 4 HIGHLIGHT TILES */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20"
        >
          <HighlightCard
            icon={<Zap className="h-6 w-6 text-amber-500" />}
            title="Real-Time Telemetry"
            description="Live station data, UV index, wind vectors, and 24-hour timelines."
          />
          <HighlightCard
            icon={<ShieldCheck className="h-6 w-6 text-blue-500" />}
            title="Edge JWT Security"
            description="Tokenized session cookies and Next.js Edge Middleware route guards."
          />
          <HighlightCard
            icon={<BarChart3 className="h-6 w-6 text-emerald-500" />}
            title="Admin Analytics"
            description="Interactive SVG curves for temperature, humidity, AQI, & query volume."
          />
          <HighlightCard
            icon={<Users className="h-6 w-6 text-indigo-500" />}
            title="Role Management"
            description="Firestore user directory with live pagination and admin role promotion."
          />
        </motion.div>

        {/* CORE PLATFORM CAPABILITIES */}
        <section className="mb-20 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Platform Features & Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-2">
              Designed from the ground up to offer an uncompromised user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureBox
              icon={<CloudSun className="h-6 w-6 text-amber-500" />}
              title="Live Weather Services"
              items={[
                "Geocoded city search with autocomplete suggestions",
                "24-hour local hourly forecast timeline",
                "3-day extended meteorological outlook",
                "Air Quality Index (PM2.5) & UV index telemetry",
              ]}
            />

            <FeatureBox
              icon={<ShieldCheck className="h-6 w-6 text-blue-500" />}
              title="Authentication & Security"
              items={[
                "Firebase Auth with JWT session tokenization",
                "Edge Middleware route protection (/services, /admin)",
                "Preserved redirect URL flows across login/signup",
                "Secure Gmail SMTP contact form processing",
              ]}
            />

            <FeatureBox
              icon={<Activity className="h-6 w-6 text-emerald-500" />}
              title="Admin & Telemetry Portal"
              items={[
                "Interactive SVG analytics chart with metric toggles",
                "Paginated active users directory with role controls",
                "System configuration switches (Maintenance mode, °C/°F)",
                "Broadcast weather alert announcement banner system",
              ]}
            />
          </div>
        </section>

        {/* TECH STACK GRID */}
        <section className="mb-20">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6 sm:p-10 backdrop-blur-xl shadow-xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="h-7 w-7 text-blue-500" /> Technical Architecture Stack
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Built using production-grade modern Web technologies.
                </p>
              </div>

              <span className="px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold self-start sm:self-auto">
                Next.js 16 App Router
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <TechStackCard
                title="Next.js 16"
                category="Frontend & Edge Routing"
                description="App Router, Server Components, and Edge Middleware session evaluation."
                icon={<Cpu className="h-5 w-5 text-blue-500" />}
              />
              <TechStackCard
                title="Firebase Suite"
                category="Auth & Database"
                description="Firebase Auth with Firestore Realtime NoSQL for persistent state."
                icon={<Database className="h-5 w-5 text-amber-500" />}
              />
              <TechStackCard
                title="Weather Telemetry"
                category="API Integration"
                description="OpenWeatherMap & WeatherAPI.com high-precision meteorological telemetry."
                icon={<Compass className="h-5 w-5 text-emerald-500" />}
              />
              <TechStackCard
                title="Tailwind CSS 4"
                category="Styling & Motion"
                description="Glassmorphism UI, Framer Motion micro-animations, & adaptive dark mode."
                icon={<Sparkles className="h-5 w-5 text-indigo-500" />}
              />
            </div>
          </div>
        </section>

        {/* LEAD DEVELOPER & PROJECT CONTACT */}
        <section className="mb-16">
          <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-amber-500/10 p-6 sm:p-10 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
                Lead Project Engineer
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Pranav Gadewar
              </h3>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 max-w-xl">
                Created IndraCast with a focus on high-precision weather insights, beautiful UI responsiveness, robust JWT tokenization, and seamless regional coverage for India.
              </p>
              <div className="pt-2 flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                <Mail className="h-4 w-4 text-amber-500" />
                <span>pranav.gadewar.dev@gmail.com</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link
                href="/services"
                className="w-full sm:w-auto text-center rounded-2xl bg-blue-600 px-6 py-3 text-xs font-extrabold text-white hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-500/20"
              >
                Explore Weather Services
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 px-6 py-3 text-xs font-extrabold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95 shadow-sm"
              >
                Contact Developer
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER NOTE */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs font-semibold text-slate-500">
          IndraCast Weather System • Engineered with Next.js, Firebase & WeatherAPI.com • Designed for everyday users across India.
        </div>
      </div>
    </div>
  );
}

function HighlightCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-sm hover:border-blue-500/30 transition-all duration-200 space-y-3">
      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-fit">
        {icon}
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function FeatureBox({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6 backdrop-blur-xl shadow-lg space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      </div>
      <ul className="space-y-2.5 pt-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TechStackCard({
  title,
  category,
  description,
  icon,
}: {
  title: string;
  category: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-5 space-y-2 hover:border-blue-500/30 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {category}
        </span>
        {icon}
      </div>
      <h4 className="text-base font-extrabold text-slate-900 dark:text-white">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
        {description}
      </p>
    </div>
  );
}
