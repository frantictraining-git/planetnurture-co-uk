import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </SmoothScroll>
  );
}
