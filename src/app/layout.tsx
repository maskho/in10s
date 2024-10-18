import type { Metadata } from "next";
import "./globals.css";
import { Quicksand } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "in10s",
  description: "Intensify your exam preparation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(quicksand.className, "antialiased min-h-screen pt-20")}
      >
        <Providers>
          <Navbar />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
