# Mannchala Moodlab: scroll-driven agency website

The website for **Mannchala Moodlab**, a creative and social media agency. As you scroll, full-screen image sequences play like a video scrubbed by the scrollbar, with service cards appearing at set points along the way.

**Live site:** https://mannchala-moodlab-3d.vercel.app

## Features

- **Scroll-scrubbed hero and studio sections:** 120-frame image sequences drawn to a canvas and driven by scroll position.
- **Smooth playback:** neighbouring frames cross-blend so motion reads as continuous; frames are decoded ahead of use, and loading goes coarse-to-fine so any scroll position has a nearby frame early.
- **Adaptive quality:** devices that can't keep up fall back to whole frames automatically.
- **Mobile letterboxing:** on portrait phones the landscape frames are shown wider over a blurred backdrop, so the artwork isn't cropped away.
- **Accessible motion:** respects `prefers-reduced-motion` (a static frame, no smooth scrolling).
- Smooth scrolling with Lenis, glass-style UI, bento services grid, ticker and footer.

## Tech stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS 4, Framer Motion, Lenis
- Phosphor and Lucide icons
- Deployed on Vercel

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000. For a production build:

```bash
npm run build
npm start
```

## Project structure

```
src/
  app/                    layout, global styles, home page
  components/
    sections/             Hero, Gear showcase, Bento features, Footer
    ui/ScrollSequence.tsx the scroll-scrub engine shared by both sequences
    providers/            Lenis smooth scrolling
public/frames/            image sequences (smartphone/, gear/), frame_0001.jpg … frame_0120.jpg
```

## Changing a sequence

1. Export the new animation as numbered JPGs (`frame_0001.jpg`, `frame_0002.jpg`, …) into a folder under `public/frames/`.
2. Point the section's `framePath` at that folder and set `frameCount` in `src/components/sections/`.
3. Adjust each card's `show` and `hide` values (0–1 of the section's scroll) to time the overlays.

The repository also includes the [scroll-world](https://github.com/oso95/scroll-world) skill in `.claude/skills/` for generating new scroll-through scenes.

## License

[MIT](LICENSE)
