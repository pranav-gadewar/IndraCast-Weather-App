export default function AboutPage() {
  return (
    <section className="relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute top-80 right-16 h-80 w-80 rounded-full bg-yellow-400/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-6 py-28">
        {/* Heading */}
        <div className="mb-20 text-center">
          <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/40 px-4 py-1 text-sm font-medium text-blue-700 dark:text-blue-300">
            About IndraCast
          </span>

          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight">
            Built for clarity.
            <span className="block bg-gradient-to-r from-blue-600 to-yellow-400 bg-clip-text text-transparent">
              Designed for India.
            </span>
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            IndraCast is a modern, India-first weather dashboard focused on
            accuracy, simplicity, and thoughtful design — built to make weather
            information easy to consume and genuinely useful.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-20">
          {/* Why */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Why IndraCast?</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                Most weather applications today are cluttered with ads, packed
                with unnecessary features, or lack regional focus. They often
                overwhelm users instead of helping them make quick, informed
                decisions.
              </p>
              <p>
                IndraCast was created to fix that — by offering a clean,
                distraction-free experience focused exclusively on Indian cities
                and states, where weather patterns vary significantly across
                regions.
              </p>
            </div>
          </section>

          {/* What */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              What Does IndraCast Provide?
            </h2>

            <ul className="space-y-3 list-disc list-inside text-gray-700 dark:text-gray-300">
              <li>
                Real-time weather conditions for cities and states across India
              </li>
              <li>
                A minimal dashboard layout designed for fast readability
              </li>
              <li>
                Light and dark modes for comfortable viewing in any environment
              </li>
              <li>
                Storage of searched locations for future reference and insights
              </li>
            </ul>
          </section>

          {/* Tech Stack */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Technology Stack</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
              IndraCast is built using a carefully selected technology stack that
              balances performance, scalability, and developer experience —
              making the application reliable today and extensible tomorrow.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6">
                <h3 className="font-semibold mb-2">Next.js</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Powers the frontend and backend routing with server components,
                  fast navigation, and optimized rendering.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6">
                <h3 className="font-semibold mb-2">Supabase</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Stores searched weather data securely, enabling persistence,
                  history tracking, and future analytics.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6">
                <h3 className="font-semibold mb-2">Python</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Handles accurate weather data fetching and processing through
                  a dedicated backend service.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6">
                <h3 className="font-semibold mb-2">Tailwind CSS</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enables a consistent design system with rapid styling and
                  seamless dark mode support.
                </p>
              </div>
            </div>
          </section>

          {/* Vision */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Vision</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
              IndraCast is designed as a foundation rather than a finished idea.
              While the current focus is on clarity and reliability, the long-term
              vision includes deeper insights, historical trends, forecasts, and
              intelligent analytics — all without compromising simplicity.
            </p>
          </section>

          {/* Footer Note */}
          <div className="pt-12 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-500">
              Built with care using Next.js, Supabase, and Python.
              <br />
              Designed for developers, students, and everyday users across India.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
