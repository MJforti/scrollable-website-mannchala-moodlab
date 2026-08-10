"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { EyebrowBadge } from "../ui/EyebrowBadge";
import { FilmStrip, Sparkle, TrendUp, CaretDown } from "@phosphor-icons/react";

const FRAME_COUNT = 120;

const ANNOTATIONS = [
  {
    id: "card-1",
    show: 0.12,
    hide: 0.36,
    badge: "01 / VIRAL 3D REELS",
    title: "Thumb-Stopping Content",
    description: "High-retention 3D reels, TikTok motion, and short-form assets engineered to hook viewers in 0.5 seconds.",
    icon: FilmStrip,
    position: "top-28 inset-x-4 max-w-[calc(100vw-2rem)] md:top-1/4 md:left-16 md:right-auto md:max-w-sm",
  },
  {
    id: "card-2",
    show: 0.40,
    hide: 0.65,
    badge: "02 / SPATIAL BRANDING",
    title: "3D Social Identities",
    description: "Building kinetic 3D logos, virtual brand mascots, and immersive spatial kits tailored for digital feeds.",
    icon: Sparkle,
    position: "top-32 inset-x-4 max-w-[calc(100vw-2rem)] md:top-1/3 md:right-16 md:left-auto md:max-w-sm",
  },
  {
    id: "card-3",
    show: 0.70,
    hide: 0.92,
    badge: "03 / CULTURAL IMPACT",
    title: "Trend Engineering & Reach",
    description: "Architecting cultural hype campaigns and organic social strategies that turn casual scrollers into cult followers.",
    icon: TrendUp,
    position: "bottom-20 inset-x-4 max-w-[calc(100vw-2rem)] md:bottom-1/4 md:left-24 md:right-auto md:max-w-sm",
  },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const tickingRef = useRef(false);
  const currentFrameIndexRef = useRef(0);
  const prevVisibleIdsRef = useRef("");

  const [visibleCards, setVisibleCards] = useState<string[]>([]);

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

    // Zoom on mobile for readability
    if (window.innerWidth <= 768) {
      drawW *= 1.25;
      drawH *= 1.25;
    }

    const drawX = (cw - drawW) / 2;
    const drawY = (ch - drawH) / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, []);

  // Resize canvas with devicePixelRatio
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
      img.src = `/frames/smartphone/frame_${num}.jpg`;

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

  // Scroll Handler
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

        // Hero overlay text fade out during initial 10% scroll
        if (heroTextRef.current) {
          const opacity = Math.max(0, 1 - progress / 0.10);
          heroTextRef.current.style.opacity = String(opacity);
          heroTextRef.current.style.transform = `translateY(${progress * -40}px)`;
        }

        // Card visibility logic
        const activeIds: string[] = [];
        ANNOTATIONS.forEach((card) => {
          if (progress >= card.show && progress <= card.hide) {
            activeIds.push(card.id);
          }
        });

        const activeStr = activeIds.sort().join(",");
        if (activeStr !== prevVisibleIdsRef.current) {
          prevVisibleIdsRef.current = activeStr;
          setVisibleCards(activeIds);
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
      id="hero"
      ref={sectionRef}
      className="relative w-full bg-[#09090b] max-md:h-[180vh] h-[200vh]"
    >
      {/* Sticky Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#09090b] flex items-center justify-center">
        <canvas ref={canvasRef} className="block h-full w-full object-cover" />

        {/* Hero Overlay Text */}
        <div
          ref={heroTextRef}
          className="absolute inset-0 flex flex-col items-center justify-between pointer-events-none py-20 px-4 md:py-28 md:px-6 text-center z-20 transition-opacity duration-300 ease-out"
        >
          <div className="flex flex-col items-center gap-3 sm:gap-4 max-w-4xl">
            <EyebrowBadge>3D SOCIAL MEDIA & CONTENT AGENCY</EyebrowBadge>
            <h1 className="font-serif italic font-semibold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white leading-[1.05]">
              Viral 3D Content & <br />
              <span className="text-zinc-300 font-serif italic">
                Social Motion Engineering
              </span>
            </h1>
          </div>

          <div className="flex flex-col items-center gap-1 font-mono text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest">
            <span>Scroll to Explore 3D Social Lab</span>
            <CaretDown size={12} className="animate-bounce text-white" />
          </div>
        </div>

        {/* Minimalist Floating Annotation Cards */}
        {ANNOTATIONS.map((card) => {
          const isVisible = visibleCards.includes(card.id);
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`absolute ${card.position} pointer-events-auto transition-all duration-500 ease-out z-30 ${
                isVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-4 scale-95 pointer-events-none"
              }`}
            >
              <div className="card-surface p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                  <span className="text-[9px] sm:text-[10px] font-mono font-medium text-zinc-400 tracking-wider">
                    {card.badge}
                  </span>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <Icon size={12} weight="bold" />
                  </div>
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight mb-1">
                  {card.title}
                </h3>
                <p className="text-[11px] sm:text-xs leading-relaxed text-zinc-400">
                  {card.description}
                </p>
              </div>
            </div>
          );
        })}

        {/* Minimal Bottom Indicator */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 sm:bottom-6 z-20 px-4 md:px-12 flex items-center justify-between font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-zinc-500">
          <span>01 / 3D REELS HERO</span>
          <span className="hidden sm:inline">MANNCHALA MOODLAB</span>
          <span>Scroll ↓</span>
        </div>
      </div>
    </section>
  );
}
