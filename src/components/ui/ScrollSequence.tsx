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
/** Letterbox on phones whose viewport is narrower than this aspect ratio. */
const LETTERBOX_BELOW_ASPECT = 0.8;
/** Fraction of the frame's width shown in the phone letterbox. */
const LETTERBOX_VISIBLE = 0.72;
/** Cross-blend granularity between neighbouring frames. */
const BLEND_STEPS = 16;
/** Above this average frame time (ms) while scrubbing, blending is turned off. */
const MAX_BLEND_FRAME_MS = 24;
/** Opacity steps used to feather the letterbox edges. */
const FEATHER_BANDS = 10;

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
    let blendSteps = BLEND_STEPS;
    let frameTime = 16.7; // moving average of rAF interval while animating, ms
    let frameSamples = 0;
    let lastTick = 0;

    // Tiny offscreen canvas used to fake a blur for the phone letterbox backdrop.
    const blur = document.createElement("canvas");
    blur.width = 32;
    blur.height = 18;
    const bctx = blur.getContext("2d")!;

    const nearestReady = (want: number) => {
      for (let d = 0; d < frameCount; d++) {
        if (want - d >= 0 && ready[want - d]) return want - d;
        if (want + d < frameCount && ready[want + d]) return want + d;
      }
      return -1;
    };

    // Draws the playhead at a fractional frame position. Consecutive frames are
    // cross-blended by the fractional part, so 120 frames read as continuous
    // motion instead of visible steps.
    const draw = (pos: number) => {
      const base = Math.floor(pos);
      const a = nearestReady(base);
      if (a < 0) return;
      let t = a === base ? pos - base : 0;
      const b = a + 1 < frameCount && ready[a + 1] ? a + 1 : -1;
      if (b < 0) t = 0;
      t = Math.round(t * blendSteps) / blendSteps;
      let first = a;
      if (t === 1) { first = b; t = 0; } // rounded up: just show the next frame
      const key = first + t;
      if (key === drawn) return;

      const imgA = frames[first]!;
      const imgB = b >= 0 && t > 0 ? frames[b]! : null;
      const cw = canvas.width, ch = canvas.height;
      const ir = imgA.naturalWidth / imgA.naturalHeight;
      // Cover-fit size.
      let w = cw, h = cw / ir;
      if (h < ch) { h = ch; w = ch * ir; }
      ctx.globalAlpha = 1;
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, cw, ch);

      if (cw / ch < LETTERBOX_BELOW_ASPECT && window.innerWidth <= 768) {
        // Portrait phone: cover-fit would crop most of a landscape frame.
        // Paint a blurred, dimmed cover copy as the backdrop (downscale then
        // upscale; works without ctx.filter, which older Safari lacks), then
        // the frame itself showing LETTERBOX_VISIBLE of its width.
        // The dim is baked into the tiny blur canvas, so the backdrop and the
        // edge bands below are each a single cheap upscale of a 32x18 source.
        const bw = blur.width, bh = blur.height;
        bctx.globalAlpha = 1;
        bctx.drawImage(imgA, 0, 0, bw, bh);
        bctx.fillStyle = "rgba(9,9,11,0.55)";
        bctx.fillRect(0, 0, bw, bh);
        const bx = (cw - w) / 2, by = (ch - h) / 2;
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(blur, bx, by, w, h);

        const fw = cw / LETTERBOX_VISIBLE;
        const fh = fw / ir;
        const fx = (cw - fw) / 2, fy = Math.round((ch - fh) / 2);
        ctx.drawImage(imgA, fx, fy, fw, fh);
        if (imgB) {
          ctx.globalAlpha = t;
          ctx.drawImage(imgB, fx, fy, fw, fh);
        }

        // Feather the frame's top and bottom edges: repaint the backdrop over
        // thin bands with decreasing opacity (no per-frame offscreen masking).
        const fade = fh * 0.16;
        const band = fade / FEATHER_BANDS;
        const sy = bh / h; // dest -> blur-source scale
        // Bands are snapped to whole pixels and abut exactly, so no seams show.
        for (let k = 0; k < FEATHER_BANDS; k++) {
          ctx.globalAlpha = 1 - (k + 0.5) / FEATHER_BANDS;
          const topA = Math.round(fy + k * band), topB = Math.round(fy + (k + 1) * band);
          const botA = Math.round(fy + fh - (k + 1) * band), botB = Math.round(fy + fh - k * band);
          for (const [y0, y1] of [[topA, topB], [botA, botB]]) {
            if (y1 > y0) ctx.drawImage(blur, 0, (y0 - by) * sy, bw, (y1 - y0) * sy, 0, y0, cw, y1 - y0);
          }
        }
        ctx.globalAlpha = 1;
      } else {
        ctx.drawImage(imgA, (cw - w) / 2, (ch - h) / 2, w, h);
        if (imgB) {
          ctx.globalAlpha = t;
          ctx.drawImage(imgB, (cw - w) / 2, (ch - h) / 2, w, h);
          ctx.globalAlpha = 1;
        }
      }
      drawn = key;
    };

    const resize = () => {
      // Phones get a lower backing-store ratio: far less to paint per frame,
      // and the difference is invisible on photographic frames.
      const cap = window.innerWidth <= 768 ? 1.5 : 2;
      const dpr = Math.min(window.devicePixelRatio || 1, cap);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      drawn = -1;
      draw(cur);
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
          const finish = () => {
            if (disposed) return res();
            if (img.naturalWidth) {
              frames[i] = img;
              ready[i] = true;
              // Redraw if this frame is closer to the playhead than what's shown.
              if (drawn < 0 || Math.abs(i - cur) < Math.abs(Math.floor(drawn) - cur) || i === Math.floor(cur) + 1) {
                drawn = -1;
                draw(cur);
              }
            }
            loadedCount++;
            if (loadedCount % 6 === 0 || loadedCount === frameCount) setLoaded(loadedCount);
            res();
          };
          // Decode off the main thread before the frame is used, so the first
          // draw of each frame during scroll doesn't stall on JPEG decoding.
          if (img.naturalWidth && img.decode) img.decode().then(finish, finish);
          else finish();
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

    const tick = (now: number) => {
      raf = 0;
      // Adaptive quality: blending repaints the canvas (and any frosted glass
      // over it) on nearly every frame. If the device can't keep up, fall back
      // to whole frames, which repaint only when the frame index changes.
      if (lastTick && blendSteps > 1) {
        const dt = now - lastTick;
        if (dt < 200) {
          frameTime = frameTime * 0.9 + dt * 0.1;
          if (++frameSamples > 30 && frameTime > MAX_BLEND_FRAME_MS) {
            blendSteps = 1;
            drawn = -1;
          }
        }
      }
      lastTick = now;
      update();
      if (reduce) return draw(0);
      // Light easing only: Lenis already smooths wheel input, so heavy easing
      // here would just add lag.
      cur += (target - cur) * 0.3;
      if (Math.abs(target - cur) < 0.01) cur = target;
      draw(cur);
      if (visible && cur !== target) raf = requestAnimationFrame(tick);
      else lastTick = 0;
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
