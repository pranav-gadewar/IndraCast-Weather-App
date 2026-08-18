"use client";

export default function HomeVideo() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/hero/videos/home_video.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      {/* Optional overlay */}
      {/* <div className="absolute inset-0 bg-black/20 dark:bg-black/40" /> */}
    </section>
  );
}
