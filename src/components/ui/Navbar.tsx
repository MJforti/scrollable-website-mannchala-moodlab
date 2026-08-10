"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center px-3 py-3 md:py-5 pointer-events-none">
      <nav
        className={`pointer-events-auto flex items-center justify-between gap-4 md:gap-8 px-4 md:px-6 py-2.5 md:py-3 rounded-full transition-all duration-500 max-w-[95vw] md:max-w-none ${
          scrolled
            ? "glass-nav shadow-2xl scale-[0.98]"
            : "glass-nav text-white"
        }`}
      >
        {/* Brand Name */}
        <a href="#" className="font-semibold tracking-tighter text-xs md:text-sm uppercase text-white hover:opacity-80 transition-opacity flex items-center gap-2 shrink-0">
          <span className="font-bold text-white">MANNCHALA MOODLAB</span>
          <span className="text-[9px] font-mono text-zinc-300 bg-white/15 px-2 py-0.5 rounded-full hidden lg:inline-block font-medium">
            CREATIVE AGENCY
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-tight text-zinc-300">
          <a href="#hero" className="transition-colors hover:text-white">
            Social Media
          </a>
          <a href="#gear" className="transition-colors hover:text-white">
            Creative Studio
          </a>
          <a href="#bento" className="transition-colors hover:text-white">
            Services
          </a>
        </div>

        {/* Start Project CTA */}
        <a
          href="#gear"
          className="group inline-flex items-center gap-1 rounded-full bg-white px-3.5 py-1.5 text-[11px] md:text-xs font-bold text-zinc-950 transition-all duration-300 hover:bg-zinc-200 shadow-md shrink-0"
        >
          <span>Hire Agency</span>
          <ArrowUpRight size={12} weight="bold" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </nav>
    </header>
  );
}
