import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IndraCast Authentication | Sign In & Account Management",
  description: "Secure IndraCast user authentication portal for real-time weather analytics and account access.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-white dark:bg-black text-slate-900 dark:text-white transition-colors duration-300">
      <main className="flex-grow flex flex-col w-full">
        {children}
      </main>
    </div>
  );
}