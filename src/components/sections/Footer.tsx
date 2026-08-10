import { ArrowUp } from "@phosphor-icons/react/dist/ssr";

export function Footer() {
  return (
    <footer className="w-full bg-[#09090b] text-white px-4 py-10 md:px-12 md:py-14 border-t border-white/10">
      <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left">
        <div>
          <span className="font-semibold tracking-tighter text-sm uppercase block leading-none mb-1">
            MANNCHALA MOODLAB
          </span>
          <span className="text-[10px] sm:text-[11px] text-zinc-500 font-mono">
            3D Social Media Agency & Content Lab © 2026
          </span>
        </div>

        <div className="flex items-center gap-6 sm:gap-8 text-xs text-zinc-400 font-medium tracking-tight">
          <a href="#hero" className="hover:text-white transition-colors">
            Social Reels
          </a>
          <a href="#gear" className="hover:text-white transition-colors">
            3D Motion
          </a>
          <a href="#bento" className="hover:text-white transition-colors">
            Services
          </a>
        </div>

        <a
          href="#hero"
          className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-zinc-950 transition-all duration-300"
          aria-label="Back to top"
        >
          <ArrowUp size={13} weight="bold" />
        </a>
      </div>
    </footer>
  );
}
