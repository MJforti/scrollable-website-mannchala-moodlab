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
    title: "Social Media Management & Reels",
    category: "01 / FEED & REELS OPS",
    description: "End-to-end Instagram & TikTok channel management, viral Reels production, and community engagement.",
    icon: FilmStrip,
    colSpan: "md:col-span-2",
  },
  {
    title: "Brand Identity & Visual Systems",
    category: "02 / CREATIVE DIRECTION",
    description: "Custom brand guidelines, kinetic social templates, content kits, and creative direction.",
    icon: Sparkle,
    colSpan: "md:col-span-1",
  },
  {
    title: "Influencer & Creator Campaigns",
    category: "03 / INFLUENCER LAB",
    description: "High-impact creator partnerships, talent outreach, and authentic digital brand ambassadorships.",
    icon: UserCircle,
    colSpan: "md:col-span-1",
  },
  {
    title: "Performance Content & Brand Growth",
    category: "04 / STRATEGY & PAID SOCIAL",
    description: "Data-driven social media strategies and ad content production engineered for measurable client ROI.",
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
          <EyebrowBadge>CREATIVE & SOCIAL MEDIA SERVICES</EyebrowBadge>
          <h2 className="font-serif italic mt-3 sm:mt-4 text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white max-w-3xl leading-tight drop-shadow-xl">
            Engineered for Feeds. <br />
            <span className="text-zinc-200 font-serif italic font-medium drop-shadow-md">Built for Client Growth.</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {CAPABILITIES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`card-surface p-5 sm:p-7 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 shadow-xl border-white/15 ${item.colSpan}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <span className="text-[9px] sm:text-[10px] font-mono font-semibold tracking-wider text-zinc-300">
                      {item.category}
                    </span>
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/15 flex items-center justify-center text-white">
                      <Icon size={13} weight="bold" />
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-zinc-300 font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 sm:mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[9px] sm:text-[10px] text-zinc-400 font-mono font-medium">
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
