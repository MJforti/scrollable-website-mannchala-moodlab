"use client";

import { Sparkle } from "@phosphor-icons/react";

const TICKER_ITEMS = [
  "100M+ REELS & SHORT-FORM VIEWS",
  "50+ BRAND CAMPAIGNS LAUNCHED",
  "VIRAL CREATIVE & CONTENT LAB",
  "4.9/5 CLIENT SATISFACTION RATING",
  "10x AVERAGE ORGANIC REACH",
  "FULL-SERVICE DIGITAL STRATEGY",
];

export function TickerBar() {
  return (
    <div className="w-full bg-[#0d0d11] border-y border-white/10 py-3.5 overflow-hidden select-none pointer-events-auto">
      <div className="animate-marquee items-center whitespace-nowrap">
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 px-6 shrink-0">
            <span className="text-[11px] font-mono font-bold tracking-[0.18em] text-zinc-300 uppercase">
              {item}
            </span>
            <Sparkle size={12} weight="fill" className="text-zinc-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
