"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    closed: {
      y: "-100%",
      borderBottomLeftRadius: "50%",
      borderBottomRightRadius: "50%",
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] as const }
    },
    open: {
      y: "0%",
      borderBottomLeftRadius: "0%",
      borderBottomRightRadius: "0%",
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1] as const }
    }
  };

  const linkVariants = {
    closed: { y: 100, opacity: 0 },
    open: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: 0.2 + (i * 0.1), duration: 0.8, ease: [0.76, 0, 0.24, 1] as const }
    })
  };

  const links = [
    { title: "The Journal", href: "/" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
    { title: "Studio Portal", href: "/studio" }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[9999] p-8 md:p-12 flex justify-between items-center pointer-events-none">
        {/* Logo */}
        <Link href="/" className="pointer-events-auto text-2xl font-display font-bold tracking-tight z-[10000] flex items-baseline select-none">
          <span className="text-black/80 font-normal">Planet</span>
          <span className="italic text-[var(--color-accent)] font-medium">Nurture.</span>
        </Link>
        
        {/* Hamburger Button */}
        <button 
          onClick={toggleMenu}
          className="pointer-events-auto flex flex-col justify-center items-end gap-2 w-12 h-12 z-[10000] group"
          aria-label="Toggle Menu"
        >
          <motion.span 
            animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 5 : 0, backgroundColor: isOpen ? "rgb(246, 245, 242)" : "rgb(17, 17, 17)" }}
            className="w-8 h-[2px] block transition-all duration-300"
          ></motion.span>
          <motion.span 
            animate={{ width: isOpen ? 0 : 20, opacity: isOpen ? 0 : 1, backgroundColor: "rgb(17, 17, 17)" }}
            className="h-[2px] block transition-all duration-300"
          ></motion.span>
          <motion.span 
            animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -5 : 0, backgroundColor: isOpen ? "rgb(246, 245, 242)" : "rgb(17, 17, 17)" }}
            className="w-8 h-[2px] block transition-all duration-300"
          ></motion.span>
        </button>
      </header>

      {/* Full Screen Overlay Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-[9998] bg-black text-white flex flex-col justify-center px-8 md:px-24"
          >
            {/* Grain Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 400 400%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]"></div>

            <nav className="flex flex-col gap-4 md:gap-8 relative z-10">
              {links.map((link, i) => (
                <div key={link.title} className="overflow-hidden">
                  <motion.div
                    custom={i}
                    variants={linkVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <Link 
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center gap-6 md:gap-8 inline-block"
                    >
                      <span className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-[var(--color-accent-light)] opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-out"></span>
                      <span className="text-5xl md:text-7xl lg:text-8xl font-display font-normal text-white/50 group-hover:text-white group-hover:-skew-x-6 group-hover:translate-x-4 transition-all duration-500 ease-out inline-block origin-left">
                        {link.title}
                      </span>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute bottom-12 left-8 md:left-24 right-8 md:right-24 flex justify-between text-[10px] font-mono uppercase tracking-[0.3em] text-white/40"
            >
              <span>Environment & Eco Journal</span>
              <a href="mailto:hello@planetnurture.co.uk" className="hover:text-white transition-colors">hello@planetnurture.co.uk</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
