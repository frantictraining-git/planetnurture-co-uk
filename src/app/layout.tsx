import type { Metadata } from "next";
import { Playfair_Display, Inter, Space_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Planet Nurture — Environmental and Eco-Journal",
  description: "Planet Nurture is a premium editorial-first publication covering environmental issues, green technology, and ecological sustainability.",
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body bg-[var(--color-paper)] text-black">
        <CustomCursor />
        
        <SmoothScroll>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
