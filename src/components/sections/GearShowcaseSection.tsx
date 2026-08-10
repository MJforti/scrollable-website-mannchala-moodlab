"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { EyebrowBadge } from "../ui/EyebrowBadge";
import { FilmStrip, UserCircle, Devices } from "@phosphor-icons/react";

const FRAME_COUNT = 120;

const TECH_SPECS = [
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introTextRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const currentFrameIndexRef = useRef(0);
  const prevVisibleIdsRef = useRef("");

  const [visibleSpecs, setVisibleSpecs] = useState<string[]>([]);

  // Cover-fit Canvas Drawer
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = framesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;

    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, cw, ch);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;

    let drawW: number;
    let drawH: number;

    if (canvasRatio > imgRatio) {
      drawW = cw;
      drawH = cw / imgRatio;
    } else {
      drawH = ch;
      drawW = ch * imgRatio;
    }

    if (window.innerWidth <= 768) {
      drawW *= 1.25;
      drawH *= 1.25;
    }

    const drawX = (cw - drawW) / 2;
    const drawY = (ch - drawH) / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // Canvas DPI resizing
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    drawFrame(currentFrameIndexRef.current);
  }, [drawFrame]);

  // Load frames silently in background
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const num = String(i).padStart(4, "0");
      img.src = `/frames/gear/frame_${num}.jpg`;

      if (i === 1) {
        img.onload = () => {
          resizeCanvas();
          drawFrame(0);
        };
      } else {
        img.onload = () => {
          if (currentFrameIndexRef.current === i - 1) {
            drawFrame(i - 1);
          }
        };
      }
      imgs.push(img);
    }
    framesRef.current = imgs;
  }, [drawFrame, resizeCanvas]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) {
          tickingRef.current = false;
          return;
        }

        const rect = section.getBoundingClientRect();
        const scrollableHeight = section.offsetHeight - window.innerHeight;
        const rawProgress = -rect.top / scrollableHeight;
        const progress = Math.min(1, Math.max(0, rawProgress));

        const frameIndex = Math.min(
          FRAME_COUNT - 1,
          Math.floor(progress * FRAME_COUNT)
        );

        if (frameIndex !== currentFrameIndexRef.current) {
          currentFrameIndexRef.current = frameIndex;
          drawFrame(frameIndex);
        }

        // Section intro fade out
        if (introTextRef.current) {
          const opacity = Math.max(0, 1 - progress / 0.10);
          introTextRef.current.style.opacity = String(opacity);
        }

        // Spec card visibility
        const activeIds: string[] = [];
        TECH_SPECS.forEach((spec) => {
          if (progress >= spec.show && progress <= spec.hide) {
            activeIds.push(spec.id);
          }
        });

        const activeStr = activeIds.sort().join(",");
        if (activeStr !== prevVisibleIdsRef.current) {
          prevVisibleIdsRef.current = activeStr;
          setVisibleSpecs(activeIds);
        }

        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [drawFrame]);

  return (
    <section
      id="gear"
      ref={sectionRef}
      className="relative w-full bg-[#09090b] text-white border-t border-white/10 max-md:h-[180vh] h-[200vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#09090b] flex items-center justify-center">
        <canvas ref={canvasRef} className="block h-full w-full object-cover opacity-90" />

        {/* Section Intro Overlay with Apple UI Glass Effect */}
        <div
          ref={introTextRef}
          className="absolute top-16 sm:top-20 inset-x-0 flex flex-col items-center text-center px-4 md:px-6 pointer-events-none z-20"
        >
          <div className="flex flex-col items-center p-6 sm:p-7 md:p-8 rounded-3xl apple-text-glass pointer-events-auto max-w-3xl">
            <EyebrowBadge>CREATIVE STUDIO & CAMPAIGN ENGINE</EyebrowBadge>
            <h2 className="font-serif italic mt-3 sm:mt-4 text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-lg">
              Cinematic Short-Form & <br />
              <span className="text-zinc-200 font-serif italic font-medium drop-shadow-md">Full-Scale Client Campaigns</span>
            </h2>
          </div>
        </div>

        {/* Minimalist Spec Cards */}
        {TECH_SPECS.map((spec) => {
          const isVisible = visibleSpecs.includes(spec.id);
          const Icon = spec.icon;
          return (
            <div
              key={spec.id}
              className={`absolute ${spec.position} pointer-events-auto transition-all duration-500 ease-out z-30 ${
                isVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-4 scale-95 pointer-events-none"
              }`}
            >
              <div className="card-surface p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                  <span className="text-[9px] sm:text-[10px] font-mono font-semibold text-zinc-300 tracking-wider">
                    {spec.badge}
                  </span>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/15 flex items-center justify-center text-white">
                    <Icon size={12} weight="bold" />
                  </div>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mb-1">
                  {spec.title}
                </h3>
                <p className="text-[11px] sm:text-xs leading-relaxed text-zinc-300 font-normal">
                  {spec.description}
                </p>
              </div>
            </div>
          );
        })}

        {/* Minimal Bottom Indicator */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 sm:bottom-6 z-20 px-4 md:px-12 flex items-center justify-between font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-zinc-400 font-medium">
          <span>02 / CREATIVE STUDIO SUITE</span>
          <span className="hidden sm:inline">MANNCHALA MOODLAB</span>
          <span>Scroll ↓</span>
        </div>
      </div>
    </section>
  );
}
