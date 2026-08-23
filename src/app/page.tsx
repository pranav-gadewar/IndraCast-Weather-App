import Hero from "@/components/Hero";
import HomeVideo from "@/components/HomeVideo";
import QuickView from "@/components/QuickView";
import Services from "@/components/Services";

export default function Home() {
  return (
    <main className="overflow-x-hidden w-full">
      <Hero />
      <Services />
      <HomeVideo />
      <QuickView />
    </main>
  );
}
