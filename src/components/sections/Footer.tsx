"use client";

import { ArrowUp } from "@phosphor-icons/react";

export function Footer() {
  return (
    <footer className="w-full bg-[#09090b] text-white px-4 py-12 md:px-12 md:py-16 border-t border-white/10 relative">
      <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left">
        <div>
          <span className="font-bold tracking-tighter text-sm uppercase block leading-none mb-1.5 text-white">
            MANNCHALA MOODLAB
          </span>
          <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] sm:text-[11px] text-zinc-400 font-mono font-medium">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span>Full-Service Creative & Social Media Agency © 2026</span>
          </div>
        </div>

        <div className="flex items-center gap-6 sm:gap-8 text-xs text-zinc-300 font-semibold tracking-tight">
          <a href="#bento" className="hover:text-white transition-colors">
            Services
          </a>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdgKjJwaQ2tXy_GmTArmQPoomcawP-KB9g9tyM9g4FKVRHTGw/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Hire Agency
          </a>
        </div>

        <a
          href="#hero"
          className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-zinc-950 transition-all duration-300 shadow-sm active:scale-95"
          aria-label="Back to top"
        >
          <ArrowUp size={14} weight="bold" />
        </a>
      </div>
    </footer>
  );
}
