"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

export type SequenceCard = {
  id: string;
  show: number;
  hide: number;
  badge: string;
  title: string;
  description: string;
  icon: PhosphorIcon;
  position: string;
};

type Props = {
  id: string;
  framePath: (index1: number) => string;
  frameCount: number;
  cards: SequenceCard[];
  label: string;
  /** Overlay that fades out over the first 10% of the scroll. */
  intro: (ref: RefObject<HTMLDivElement | null>) => ReactNode;
  introLift?: boolean;
  className?: string;
  canvasClassName?: string;
};

const BG = "#09090b";

/**
 * Scroll-scrubbed image sequence. Techniques adapted from the scroll-world
 * scrub engine: priority preloading (coarse keyframes first, then fill),
 * nearest-loaded-frame fallback, a lerped playhead so the scrub glides instead
 * of stepping, a render loop that only runs while the section is on screen,
 * and a static frame under prefers-reduced-motion.
 */
export function ScrollSequence({
  id,
  framePath,
  frameCount,
  cards,
  label,
  intro,
  introLift = false,
  className = "",
  canvasClassName = "",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  const [activeCards, setActiveCards] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frames: (HTMLImageElement | null)[] = new Array(frameCount).fill(null);
    const ready: boolean[] = new Array(frameCount).fill(false);
    let disposed = false;
    let drawn = -1;
    let cur = 0; // smoothed playhead (frame units)
    let target = 0;
    let raf = 0;
    let visible = false;
    let lastCardKey = "";
    let loadedCount = 0;

    const draw = (want: number) => {
      // Fall back to the nearest frame that has finished loading.
      let idx = -1;
      for (let d = 0; d < frameCount; d++) {
        if (want - d >= 0 && ready[want - d]) { idx = want - d; break; }
        if (want + d < frameCount && ready[want + d]) { idx = want + d; break; }
      }
      if (idx < 0 || idx === drawn) return;
      const img = frames[idx]!;
      const cw = canvas.width, ch = canvas.height;
      const ir = img.naturalWidth / img.naturalHeight;
      let w = cw, h = cw / ir;
      if (h < ch) { h = ch; w = ch * ir; }
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      drawn = idx;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      drawn = -1;
      draw(Math.round(cur));
    };

    // Load order: first frame, then progressively finer strides, so any scroll
    // position has a close frame available early.
    const order: number[] = [];
    const seen = new Set<number>();
    for (let stride = 32; stride >= 1; stride = Math.floor(stride / 2)) {
      for (let i = 0; i < frameCount; i += stride) {
        if (!seen.has(i)) { seen.add(i); order.push(i); }
      }
    }
    const load = (i: number) =>
      new Promise<void>((res) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = img.onerror = () => {
          if (disposed) return res();
          if (img.naturalWidth) {
            frames[i] = img;
            ready[i] = true;
            if (Math.abs(i - Math.round(cur)) < Math.abs(drawn - Math.round(cur)) || drawn < 0) {
              drawn = -1;
              draw(Math.round(cur));
            }
          }
          loadedCount++;
          if (loadedCount % 6 === 0 || loadedCount === frameCount) setLoaded(loadedCount);
          res();
        };
        img.src = framePath(i + 1);
      });
    const queue = reduce ? [0] : order;
    let qi = 0;
    const worker = async () => {
      while (!disposed && qi < queue.length) await load(queue[qi++]);
    };
    for (let k = 0; k < 6; k++) worker();

    const progress = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      return Math.min(1, Math.max(0, -rect.top / scrollable));
    };

    const update = () => {
      const p = progress();
      target = p * (frameCount - 1);

      if (introRef.current) {
        introRef.current.style.opacity = String(Math.max(0, 1 - p / 0.1));
        if (introLift) introRef.current.style.transform = `translateY(${p * -40}px)`;
      }
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (pctRef.current) pctRef.current.textContent = `${Math.round(p * 100)}%`;

      const active = cards.filter((c) => p >= c.show && p <= c.hide).map((c) => c.id);
      const key = active.join(",");
      if (key !== lastCardKey) { lastCardKey = key; setActiveCards(active); }
    };

    const tick = () => {
      raf = 0;
      update();
      if (reduce) return draw(0);
      cur += (target - cur) * 0.18;
      if (Math.abs(target - cur) < 0.05) cur = target;
      draw(Math.round(cur));
      if (visible && cur !== target) raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    io.observe(section);

    resize();
    cur = target = progress() * (frameCount - 1);
    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", resize);

    return () => {
      disposed = true;
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", resize);
    };
  }, [frameCount, framePath, cards, introLift]);

  const loading = loaded < Math.min(frameCount, 24);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative w-full bg-[#09090b] max-md:h-[180vh] h-[200vh] ${className}`}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#09090b] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`block h-full w-full transition-opacity duration-700 ${loading && loaded === 0 ? "opacity-0" : ""} ${canvasClassName}`}
        />

        {intro(introRef)}

        {cards.map((card) => {
          const on = activeCards.includes(card.id);
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              aria-hidden={!on}
              className={`absolute ${card.position} transition-all duration-500 ease-out z-30 ${
                on
                  ? "opacity-100 translate-y-0 scale-100 shadow-2xl pointer-events-auto"
                  : "opacity-0 translate-y-4 scale-95 pointer-events-none"
              }`}
            >
              <div className="card-surface p-4 sm:p-6 border border-white/20">
                <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-zinc-300 tracking-wider">
                    {card.badge}
                  </span>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/15 flex items-center justify-center text-white border border-white/10 shadow-inner">
                    <Icon size={13} weight="bold" />
                  </div>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mb-1">{card.title}</h3>
                <p className="text-[11px] sm:text-xs leading-relaxed text-zinc-300 font-normal">{card.description}</p>
              </div>
            </div>
          );
        })}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 sm:h-32 z-10 bg-gradient-to-t from-black/75 via-black/40 to-transparent"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-4 sm:bottom-6 z-20 px-4 md:px-12 flex flex-col gap-2 [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">
          <div className="w-full bg-white/20 h-0.5 rounded-full overflow-hidden">
            <div ref={barRef} className="bg-white h-full w-full origin-left" style={{ transform: "scaleX(0)" }} />
          </div>
          <div className="flex items-center justify-between font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-zinc-100 font-semibold">
            <span>{label}</span>
            <span className="hidden sm:inline">
              {loading ? `LOADING ${Math.round((loaded / frameCount) * 100)}%` : "MANNCHALA MOODLAB"}
            </span>
            <span>
              SEQUENCE <span ref={pctRef}>0%</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
