"use client";

import { EyebrowBadge } from "../ui/EyebrowBadge";
import {
  FilmStrip,
  Sparkle,
  TrendUp,
  UserCircle,
  ArrowUpRight,
} from "@phosphor-icons/react";

const CAPABILITIES = [
  {
    title: "Social Media Management & Viral Reels",
    category: "01 / FEED & REELS OPS",
    description: "End-to-end Instagram & TikTok channel management, viral Reels production, and community engagement engineered for maximum retention.",
    icon: FilmStrip,
    colSpan: "md:col-span-2",
    stat: "100M+ Views",
  },
  {
    title: "Brand Identity & Visual Systems",
    category: "02 / CREATIVE DIRECTION",
    description: "Custom brand guidelines, kinetic social templates, content kits, and creative direction.",
    icon: Sparkle,
    colSpan: "md:col-span-1",
    stat: "Full Identity",
  },
  {
    title: "Influencer & Creator Campaigns",
    category: "03 / INFLUENCER LAB",
    description: "High-impact creator partnerships, talent outreach, and authentic digital brand ambassadorships.",
    icon: UserCircle,
    colSpan: "md:col-span-1",
    stat: "Creator Network",
  },
  {
    title: "Performance Content & Brand Growth",
    category: "04 / STRATEGY & PAID SOCIAL",
    description: "Data-driven social media strategies and ad content production engineered for measurable client ROI.",
    icon: TrendUp,
    colSpan: "md:col-span-2",
    stat: "10x ROI Focus",
  },
];

export function BentoFeatures() {
  return (
    <section id="bento" className="w-full bg-[#09090b] text-white px-4 py-16 md:px-12 md:py-32 border-t border-white/10 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1200px] relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <EyebrowBadge>CREATIVE & SOCIAL MEDIA SERVICES</EyebrowBadge>
          <h2 className="font-serif italic mt-4 text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white max-w-3xl leading-tight drop-shadow-xl">
            Engineered for Feeds. <br />
            <span className="text-zinc-300 font-serif italic font-medium drop-shadow-md">Built for Client Growth.</span>
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-zinc-400 max-w-xl font-sans font-normal leading-relaxed">
            Full-service creative production, creator ops, and social media growth strategies tailored for ambitious brands.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {CAPABILITIES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`card-surface p-6 sm:p-8 flex flex-col justify-between group cursor-pointer border border-white/15 hover:border-white/30 ${item.colSpan}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-zinc-300 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                      {item.category}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10 group-hover:bg-white group-hover:text-zinc-950 transition-all duration-300">
                      <Icon size={15} weight="bold" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2.5 group-hover:text-zinc-100 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-zinc-300 font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-400 font-mono font-semibold">
                  <span className="text-zinc-300">{item.stat}</span>
                  <div className="flex items-center gap-1 text-white group-hover:translate-x-0.5 transition-transform">
                    <span>Explore</span>
                    <ArrowUpRight size={12} weight="bold" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
