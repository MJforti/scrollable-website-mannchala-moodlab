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
            ? "glass-nav shadow-2xl scale-[0.98] border-white/20"
            : "glass-nav text-white border-white/10"
        }`}
      >
        {/* Brand Name */}
        <a href="#" className="font-semibold tracking-tighter text-xs md:text-sm uppercase text-white hover:opacity-85 transition-opacity flex items-center gap-2.5 shrink-0">
          <span className="font-bold tracking-tight text-white">MANNCHALA MOODLAB</span>
          <span className="text-[9px] font-mono text-zinc-300 bg-white/15 px-2 py-0.5 rounded-full hidden lg:inline-block font-semibold border border-white/10">
            CREATIVE AGENCY
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-tight text-zinc-300">
          <a href="#bento" className="transition-colors hover:text-white flex items-center gap-1.5">
            <span>Services</span>
          </a>
        </div>

        {/* Hire Agency CTA - Redirects to Google Form */}
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSdgKjJwaQ2tXy_GmTArmQPoomcawP-KB9g9tyM9g4FKVRHTGw/viewform"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-[11px] md:text-xs font-bold text-zinc-950 transition-all duration-300 hover:bg-zinc-200 hover:shadow-lg shadow-md shrink-0 active:scale-95"
        >
          <span>Hire Agency</span>
          <ArrowUpRight size={13} weight="bold" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </nav>
    </header>
  );
}
