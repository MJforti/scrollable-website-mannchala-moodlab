import { ReactNode } from "react";

export function EyebrowBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 font-mono text-[10px] font-medium tracking-[0.2em] text-zinc-300 uppercase backdrop-blur-md">
      {children}
    </span>
  );
}
