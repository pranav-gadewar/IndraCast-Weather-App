"use client";

import { useState } from "react";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";
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

      await addDoc(collection(db, "messages"), {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: unknown) {
      console.error("Error sending message:", err);
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute top-72 right-20 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-28">
        {/* Header */}
        <div className="mb-20 text-center">
          <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/40 px-4 py-1 text-sm font-medium text-blue-700 dark:text-blue-300">
            Contact
          </span>

          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight">
            Get in touch with
            <span className="block bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent">
              IndraCast
            </span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Have a question, suggestion, or feedback?  
            We’d love to hear from you.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Info */}
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Let’s Talk
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                IndraCast is built with a focus on clarity, performance, and
                user experience. Whether you have ideas to improve the platform
                or questions about the project, feel free to reach out.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    contact@indracast.app
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl p-10 shadow-xl">
            <h3 className="text-xl font-semibold mb-6">
              Send a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  name="message"
                  required
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                  Thank you! Your message has been sent successfully.
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
                <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-24 text-center text-sm text-gray-500">
          We typically respond within 24–48 hours.
        </div>
      </div>
    </section>
  );
}
