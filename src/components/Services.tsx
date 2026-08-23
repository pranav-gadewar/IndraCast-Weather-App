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
    color: "text-blue-600",
  },
  {
    title: "Weather Across India",
    description:
      "Browse weather conditions for multiple Indian states and cities through a clean and organized dashboard view.",
    icon: Building2,
    color: "text-indigo-600",
  },
  {
    title: "Search Any City or State",
    description:
      "Manually check the current weather of any Indian city or state with fast and accurate results.",
    icon: CloudSun,
    color: "text-amber-500",
  },
  {
    title: "Weather Search History",
    description:
      "View your previously searched locations, allowing quick access to recent weather data and trends.",
    icon: History,
    color: "text-sky-500",
  },
];

export default function Services() {
  return (
    <section className="relative py-24">
      {/* Background accents */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute right-10 bottom-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-16 text-center">
          <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-900/40 px-4 py-1 text-sm font-medium text-blue-700 dark:text-blue-300">
            Our Services
          </span>

          <h2 className="mt-6 text-3xl md:text-4xl font-extrabold">
            Everything you need to stay
            <span className="block bg-gradient-to-r from-blue-600 to-amber-500 bg-clip-text text-transparent">
              weather-aware
            </span>
          </h2>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            IndraCast provides a focused set of weather services designed
            specifically for Indian locations — simple, fast, and reliable.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-6 shadow-sm hover:shadow-lg transition"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-900">
                  <Icon className={`h-6 w-6 ${service.color}`} />
                </div>

                <h3 className="text-lg font-semibold mb-2">
                  {service.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
