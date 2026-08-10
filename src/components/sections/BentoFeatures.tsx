"use client";

import { EyebrowBadge } from "../ui/EyebrowBadge";
import {
  FilmStrip,
  Sparkle,
  TrendUp,
  UserCircle,
} from "@phosphor-icons/react";

const CAPABILITIES = [
  {
    title: "Viral 3D Reels & Short-Form Motion",
    category: "01 / SHORT-FORM LAB",
    description: "High-retention 3D animations designed to capture viewer attention in the first 0.5s of scroll.",
    icon: FilmStrip,
    colSpan: "md:col-span-2",
  },
  {
    title: "Kinetic Social Brand Identities",
    category: "02 / SPATIAL BRANDING",
    description: "3D logos, story kits, motion guidelines, and spatial brand assets tailored for feeds.",
    icon: Sparkle,
    colSpan: "md:col-span-1",
  },
  {
    title: "Virtual Creators & 3D Mascots",
    category: "03 / AVATAR LAB",
    description: "Custom 3D brand representatives and digital avatars that host campaigns and build cult followings.",
    icon: UserCircle,
    colSpan: "md:col-span-1",
  },
  {
    title: "Social Campaign Strategy & Reach",
    category: "04 / GROWTH & CULT FOLLOWINGS",
    description: "Data-informed creative direction that transforms casual scrollers into passionate brand advocates.",
    icon: TrendUp,
    colSpan: "md:col-span-2",
  },
];

export function BentoFeatures() {
  return (
    <section id="bento" className="w-full bg-[#09090b] text-white px-4 py-16 md:px-12 md:py-32 border-t border-white/10">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10 md:mb-14">
          <EyebrowBadge>SOCIAL MEDIA AGENCY SERVICES</EyebrowBadge>
          <h2 className="font-serif italic mt-3 sm:mt-4 text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white max-w-3xl leading-tight">
            Engineered for Feeds. <br />
            <span className="text-zinc-300 font-serif italic">Crafted for Cult Followings.</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {CAPABILITIES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`card-surface p-5 sm:p-7 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 ${item.colSpan}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <span className="text-[9px] sm:text-[10px] font-mono font-medium tracking-wider text-zinc-400">
                      {item.category}
                    </span>
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 flex items-center justify-center text-white">
                      <Icon size={13} weight="bold" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-zinc-400">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 sm:mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[9px] sm:text-[10px] text-zinc-500 font-mono">
                  <span>AGENCY SERVICE 0{idx + 1}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
