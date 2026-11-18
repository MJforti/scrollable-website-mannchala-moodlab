"use client";

import { FilmStrip, UserCircle, Devices } from "@phosphor-icons/react";
import { EyebrowBadge } from "../ui/EyebrowBadge";
import { ScrollSequence, type SequenceCard } from "../ui/ScrollSequence";

const framePath = (i: number) => `/frames/gear/frame_${String(i).padStart(4, "0")}.jpg`;

const TECH_SPECS: SequenceCard[] = [
  {
    id: "gear-spec-1",
    show: 0.12,
    hide: 0.36,
    badge: "01 / SHORT-FORM REELS",
    title: "High-Retention Motion Video",
    description: "Cinematic short-form video production, motion graphics, and dynamic editing designed specifically for vertical feeds.",
    icon: FilmStrip,
    position: "top-28 inset-x-4 max-w-[calc(100vw-2rem)] md:top-1/4 md:left-16 md:right-auto md:max-w-sm",
  },
  {
    id: "gear-spec-2",
    show: 0.40,
    hide: 0.65,
    badge: "02 / TALENT & INFLUENCER LAB",
    title: "Creator Network Operations",
    description: "Pairing visionary brands with top digital creators for authentic, high-converting influencer campaigns.",
    icon: UserCircle,
    position: "top-32 inset-x-4 max-w-[calc(100vw-2rem)] md:top-1/3 md:right-16 md:left-auto md:max-w-sm",
  },
  {
    id: "gear-spec-3",
    show: 0.70,
    hide: 0.92,
    badge: "03 / OMNICHANNEL PRODUCTION",
    title: "Full-Suite Digital Campaigns",
    description: "Multi-platform video assets and campaign content optimized for seamless playback across Instagram, TikTok, YouTube, and Web.",
    icon: Devices,
    position: "bottom-20 inset-x-4 max-w-[calc(100vw-2rem)] md:bottom-1/4 md:left-24 md:right-auto md:max-w-sm",
  },
];

export function GearShowcaseSection() {
  return (
    <ScrollSequence
      id="gear"
      framePath={framePath}
      frameCount={120}
      cards={TECH_SPECS}
      label="02 / CREATIVE STUDIO SUITE"
      className="text-white border-t border-white/10"
      canvasClassName="opacity-90"
      intro={(ref) => (
        <div
          ref={ref}
          className="absolute top-16 sm:top-20 inset-x-0 flex flex-col items-center text-center px-4 md:px-6 pointer-events-none z-20"
        >
          <div className="flex flex-col items-center p-6 sm:p-7 md:p-8 rounded-3xl apple-text-glass pointer-events-auto max-w-3xl border border-white/15">
            <EyebrowBadge>CREATIVE STUDIO & CAMPAIGN ENGINE</EyebrowBadge>
            <h2 className="font-serif italic mt-3 sm:mt-4 text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-xl">
              Cinematic Short-Form & <br />
              <span className="text-zinc-200 font-serif italic font-medium drop-shadow-md">Full-Scale Client Campaigns</span>
            </h2>
          </div>
        </div>
      )}
    />
  );
}
