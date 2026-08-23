"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Send, CheckCircle, Sparkles, MessageSquare } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // 1️⃣ Send email via SMTP API endpoint
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to transmit message.");
      }

      // 2️⃣ Record message in Firestore database
      try {
        await addDoc(collection(db, "messages"), {
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          createdAt: serverTimestamp(),
        });
      } catch (dbErr) {
        console.warn("Firestore message save skipped:", dbErr);
      }

      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      console.error("Error submitting contact form:", err);
      setError(errorObj.message || "Failed to transmit message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden w-full min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-white transition-colors">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-32 left-1/3 h-72 sm:h-96 w-72 sm:w-96 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-600/10" />
        <div className="absolute top-72 right-10 sm:right-20 h-64 sm:h-80 w-64 sm:w-80 rounded-full bg-amber-400/15 blur-3xl dark:bg-amber-500/10" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24 md:py-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12 sm:mb-16 md:mb-20 text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 px-3.5 py-1 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40">
            <Sparkles className="h-3.5 w-3.5 text-blue-500" />
            Get In Touch
          </span>

          <h1 className="mt-4 sm:mt-6 text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15]">
            Get in touch with{" "}
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500 bg-clip-text text-transparent">
              IndraCast
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-sm sm:text-lg text-gray-600 dark:text-gray-400 font-light leading-relaxed">
            Have a question, feedback, or suggestion? We&apos;d love to hear from you.
          </p>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Left Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 sm:space-y-8"
          >
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" /> Let&apos;s Connect
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                IndraCast is engineered with a focus on clarity, high-precision telemetry, and
                uncompromised user experience. Whether you have ideas for platform enhancements or questions about weather API integration, reach out directly.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200/80 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 backdrop-blur-xl shadow-sm">
                <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Email Address</p>
                  <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white truncate">
                    pranav.gadewar.dev@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200/80 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 backdrop-blur-xl shadow-sm">
                <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Met Station Headquarter</p>
                  <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                    India (Subcontinent Regional Hub)
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Form Container */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-2xl p-5 sm:p-8 md:p-10 shadow-2xl"
          >
            <h3 className="text-lg sm:text-xl font-bold mb-5 sm:mb-6 text-slate-900 dark:text-white">
              Send a Direct Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/30 px-3.5 sm:px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="rahul@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/30 px-3.5 sm:px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold mb-1.5 text-gray-700 dark:text-gray-300">
                  Message
                </label>
                <textarea
                  rows={4}
                  name="message"
                  required
                  placeholder="Write your message or inquiry..."
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/30 px-3.5 sm:px-4 py-3 text-sm sm:text-base outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-slate-900 dark:text-white"
                />
              </div>

              {error && (
                <p className="text-xs font-bold text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                  {error}
                </p>
              )}

              {submitted && (
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  Thank you! Your message has been transmitted successfully.
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex items-center justify-center gap-2 w-full sm:w-auto rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? "Transmitting..." : "Send Message"}
                <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Footer note */}
        <div className="mt-16 sm:mt-24 text-center text-xs sm:text-sm text-gray-500 font-medium">
          We typically respond within 24–48 hours.
        </div>
      </div>
    </section>
  );
}
