"use client";

import { Navbar } from "@/app/(provider)/components/navbar";
import { Toaster } from "@/components/ui/toaster";

import { ContextProvider } from "@/contexts/context-provider";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ContextProvider>
      <Navbar />
      <main className="flex min-h-[calc(100vh-140px)] sm:min-h-[calc(100vh-68px)] bg-muted flex-col items-center space-y-6 p-6">
        {children}
      </main>
      <Toaster />
    </ContextProvider>
  );
}
