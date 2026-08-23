"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  CloudSun,
  Building2,
  History,
} from "lucide-react";

const services = [
  {
    title: "Weather by Current Location",
    description:
      "Automatically detect your current location and display real-time weather conditions such as temperature, humidity, and wind speed.",
    icon: MapPin,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    title: "Weather Across India",
    description:
      "Browse weather conditions for multiple Indian states and cities through a clean and organized dashboard view.",
    icon: Building2,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    title: "Search Any City or State",
    description:
      "Manually check the current weather of any Indian city or state with fast and accurate results.",
    icon: CloudSun,
    color: "text-amber-500 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    title: "Weather Search History",
    description:
      "View your previously searched locations, allowing quick access to recent weather data and trends.",
    icon: History,
    color: "text-sky-500 dark:text-sky-400",
    bg: "bg-sky-500/10",
  },
];

export default function Services() {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-10 bottom-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 sm:mb-16 text-center"
        >
          <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/40 px-4 py-1.5 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
            Our Meteorological Services
          </span>

          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything you need to stay{" "}
            <span className="block sm:inline bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500 bg-clip-text text-transparent">
              weather-aware
            </span>
          </h2>

          <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-sm sm:text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
            IndraCast provides a focused set of weather services designed
            specifically for Indian locations — simple, fast, and reliable.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/60 p-6 shadow-sm hover:shadow-xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${service.bg} border border-white/20`}>
                    <Icon className={`h-6 w-6 ${service.color}`} />
                  </div>

                  <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
                    {service.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
