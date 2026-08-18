"use client";

import { Mail, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden pt-16">
      {/* Background accents */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute top-72 right-20 h-80 w-80 rounded-full bg-yellow-400/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-28">
        {/* Header */}
        <div className="mb-20 text-center">
          <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/40 px-4 py-1 text-sm font-medium text-blue-700 dark:text-blue-300">
            Contact
          </span>

          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight">
            Get in touch with
            <span className="block bg-gradient-to-r from-blue-600 to-yellow-400 bg-clip-text text-transparent">
              IndraCast
            </span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Have a question, suggestion, or feedback?  
            We’d love to hear from you.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Info */}
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Let’s Talk
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
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
                <div className="h-12 w-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-500">
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

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Write your message here..."
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                type="button"
                className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-sm font-semibold text-white hover:bg-blue-700 transition-all active:scale-95"
              >
                Send Message
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
