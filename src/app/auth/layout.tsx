export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-white dark:bg-zinc-950">
      {/* Navbar sits on top */}
      {/* <Navbar /> */}

      {/* Main content area. 
         Notice: We don't force centering here so that the Login 
         page can use its own split-screen logic.
      */}
      <main className="flex-grow flex flex-col">
        {children}
      </main>

      {/* <Footer /> */}
    </div>
  );
}