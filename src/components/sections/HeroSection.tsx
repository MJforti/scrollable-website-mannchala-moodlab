"use client";

import { FilmStrip, Sparkle, TrendUp, CaretDown } from "@phosphor-icons/react";
import { EyebrowBadge } from "../ui/EyebrowBadge";
import { ScrollSequence, type SequenceCard } from "../ui/ScrollSequence";

const framePath = (i: number) => `/frames/smartphone/frame_${String(i).padStart(4, "0")}.jpg`;

const ANNOTATIONS: SequenceCard[] = [
  {
    id: "card-1",
    show: 0.12,
    hide: 0.36,
    badge: "01 / REELS & SHORT-FORM",
    title: "Viral Short-Form Content",
    description: "High-retention Reels, TikTok content, and short-form video production engineered to hook scrollers in 0.5 seconds.",
    icon: FilmStrip,
    position: "top-28 inset-x-4 max-w-[calc(100vw-2rem)] md:top-1/4 md:left-16 md:right-auto md:max-w-sm",
  },
  {
    id: "card-2",
    show: 0.40,
    hide: 0.65,
    badge: "02 / BRAND STRATEGY",
    title: "Creative Campaign Studio",
    description: "Building high-converting brand mythologies, kinetic identity systems, and visual storytelling for ambitious client brands.",
    icon: Sparkle,
    position: "top-32 inset-x-4 max-w-[calc(100vw-2rem)] md:top-1/3 md:right-16 md:left-auto md:max-w-sm",
  },
  {
    id: "card-3",
    show: 0.70,
    hide: 0.92,
    badge: "03 / INFLUENCER & HYPE",
    title: "Cultural Impact & Growth",
    description: "Architecting hype campaigns, creator collaborations, and organic growth strategies that turn casual scrollers into loyal advocates.",
    icon: TrendUp,
    position: "bottom-20 inset-x-4 max-w-[calc(100vw-2rem)] md:bottom-1/4 md:left-24 md:right-auto md:max-w-sm",
  },
];

export function HeroSection() {
  return (
    <ScrollSequence
      id="hero"
      framePath={framePath}
      frameCount={120}
      cards={ANNOTATIONS}
      label="01 / CREATIVE AGENCY HERO"
      introLift
      intro={(ref) => (
        <div
          ref={ref}
          className="absolute inset-0 flex flex-col items-center justify-between pointer-events-none pt-28 pb-16 px-4 md:py-24 md:px-6 text-center z-20"
        >
          <div className="flex flex-col items-center gap-3 sm:gap-4 max-w-4xl p-6 sm:p-7 md:p-8 rounded-3xl apple-text-glass pointer-events-auto border border-white/15">
            <EyebrowBadge>CREATIVE & SOCIAL MEDIA AGENCY</EyebrowBadge>
            <h1 className="font-serif italic font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[1.05] drop-shadow-xl">
              Viral Social Content & <br />
              <span className="text-zinc-200 font-serif italic font-medium drop-shadow-md">
                Creative Brand Architecture
              </span>
            </h1>
          </div>

          <div className="flex flex-col items-center gap-1.5 font-mono text-[9px] sm:text-[10px] text-zinc-300 font-medium uppercase tracking-widest apple-text-glass px-4 py-1.5 rounded-full border border-white/15">
            <span>Scroll to Explore Creative Lab</span>
            <CaretDown size={13} className="animate-bounce text-white" />
          </div>
        </div>
      )}
    />
  );
}
