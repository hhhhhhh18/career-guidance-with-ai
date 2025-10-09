"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "../components/header";
import { Toaster } from "sonner";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className={isLandingPage ? "" : "bg-black text-white"}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Toaster richColors />
        <footer className="bg-muted/50 py-12">
          <div className="container mx-auto px-4 text-center text-gray-200">
            <p>Made with 💗</p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}