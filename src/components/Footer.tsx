import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-16 px-4 sm:px-8 md:px-16 text-white relative z-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl md:text-4xl font-display font-normal mb-4">
              Planet<span className="italic text-white/50">Nurture.</span>
            </h3>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm mb-6">
              A premium, editorial-first digital publication documenting environmental ideas, ecological insights, and sustainable practices. We are dedicated to nurturing conversations that inspire action for our planet.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white/30 hover:text-[var(--color-accent-light)] transition-colors">
                <span className="text-xs font-mono uppercase tracking-widest">Instagram</span>
              </a>
              <a href="#" className="text-white/30 hover:text-[var(--color-accent-light)] transition-colors">
                <span className="text-xs font-mono uppercase tracking-widest">Twitter / X</span>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 mb-6">Navigation</h4>
            <ul className="space-y-4 text-sm font-light text-white/60">
              <li><Link href="/" className="hover:text-white transition-colors">The Journal</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/studio/structure/post" className="hover:text-white transition-colors">Studio Portal</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 mb-6">Connect</h4>
            <ul className="space-y-4 text-sm font-light text-white/60">
              <li>
                <p className="text-white mb-1">Email</p>
                <a href="mailto:hello@planetnurture.co.uk" className="hover:text-[var(--color-accent-light)] transition-colors">hello@planetnurture.co.uk</a>
              </li>
            </ul>
          </div>

        </div>
        
        {/* Legal & Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/40 font-light">
          <p>© {new Date().getFullYear()} Planet Nurture. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
