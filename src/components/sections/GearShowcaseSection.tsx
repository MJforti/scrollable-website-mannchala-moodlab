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
    badge: "01 / 3D SHORT-FORM",
    title: "High-Octane 3D Motion",
    description: "Multi-layered raytraced assets, liquid dynamics, and custom lighting designed specifically for vertical social feeds.",
    icon: FilmStrip,
    position: "top-1/4 left-6 md:left-16",
  },
  {
    id: "gear-spec-2",
    show: 0.40,
    hide: 0.65,
    badge: "02 / VIRTUAL CREATORS",
    title: "3D Mascots & Avatars",
    description: "Designing stylized 3D brand mascots and virtual creators that host campaigns and boost engagement.",
    icon: UserCircle,
    position: "top-1/3 right-6 md:right-16",
  },
  {
    id: "gear-spec-3",
    show: 0.70,
    hide: 0.92,
    badge: "03 / CROSS-PLATFORM",
    title: "Omnichannel Social Kits",
    description: "Lossless frame-sequence rendering optimized for seamless playback across Instagram, TikTok, YouTube Shorts, and Web.",
    icon: Devices,
    position: "bottom-1/4 left-6 md:left-24",
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

  const [loaded, setLoaded] = useState(false);
  const [visibleSpecs, setVisibleSpecs] = useState<string[]>([]);

  // Preload frames
  useEffect(() => {
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const num = String(i).padStart(4, "0");
      img.src = `/frames/gear/frame_${num}.jpg`;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) setLoaded(true);
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) setLoaded(true);
      };
      imgs.push(img);
    }
    framesRef.current = imgs;
  }, []);

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

  useEffect(() => {
    if (!loaded) return;
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [loaded, resizeCanvas]);

  // Scroll handler
  useEffect(() => {
    if (!loaded) return;

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
  }, [loaded, drawFrame]);

  return (
    <section
      id="gear"
      ref={sectionRef}
      className="relative w-full bg-[#09090b] text-white border-t border-white/10"
      style={{ height: "200vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#09090b] flex items-center justify-center">
        <canvas ref={canvasRef} className="block h-full w-full object-cover opacity-90" />

        {/* Section Intro Overlay */}
        <div
          ref={introTextRef}
          className="absolute top-24 inset-x-0 flex flex-col items-center text-center px-6 pointer-events-none z-20"
        >
          <EyebrowBadge>SOCIAL MOTION & CONTENT ENGINE</EyebrowBadge>
          <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-tighter text-white max-w-2xl leading-tight">
            Cinematic 3D Reels & <br />
            <span className="text-zinc-400 font-normal">Social Motion Production</span>
          </h2>
        </div>

        {/* Minimalist Spec Cards */}
        {TECH_SPECS.map((spec) => {
          const isVisible = visibleSpecs.includes(spec.id);
          const Icon = spec.icon;
          return (
            <div
              key={spec.id}
              className={`absolute ${spec.position} max-w-sm pointer-events-auto transition-all duration-500 ease-out z-30 ${
                isVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-4 scale-95 pointer-events-none"
              }`}
            >
              <div className="card-surface p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-medium text-zinc-400 tracking-wider">
                    {spec.badge}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <Icon size={13} weight="bold" />
                  </div>
                </div>
                <h3 className="text-base font-semibold text-white tracking-tight mb-1">
                  {spec.title}
                </h3>
                <p className="text-xs leading-relaxed text-zinc-400">
                  {spec.description}
                </p>
              </div>
            </div>
          );
        })}

        {/* Minimal Bottom Indicator */}
        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 px-6 md:px-12 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
          <span>02 / SOCIAL MOTION SUITE</span>
          <span>MANNCHALA MOODLAB</span>
          <span>Scroll ↓</span>
        </div>
      </div>
    </section>
  );
}
