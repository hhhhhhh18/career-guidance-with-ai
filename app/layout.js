import ClientLayout from "./ClientLayout";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/components/theme-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Career Guidance",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body className={`${inter.className} bg-background text-foreground`}>

          
          <div id="main-content" className="transition-opacity duration-300">
            <ClientLayout>{children}</ClientLayout>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
