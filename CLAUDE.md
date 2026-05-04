# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server (root is `client/`, alias `@` → `client/src`).
- `npm run build` — `tsc` typecheck (noEmit, strict) then `vite build` to `dist/`.
- `npm run preview` — Serve the production build locally.

There is no test runner and no lint script configured. Type errors will fail `build`.

## Deployment

`.github/workflows/deploy.yml` deploys to GitHub Pages on every push to `main`: it runs `npm ci && npm run build` and uploads `dist/` as the Pages artifact. `client/public/.nojekyll` and `client/public/404.html` ship with the build.

## Architecture

Single-page portfolio site. Pure frontend — **no backend, no database, no router library**. The `replit.md` in the repo describes an Express/Drizzle/Postgres/wouter/TanStack-Query stack that does not exist in `package.json`; treat it as stale and ignore it. Actual stack: React 18 + TypeScript + Vite + Tailwind + framer-motion + lucide-react + react-hook-form.

### Composition

`client/src/App.tsx` is the whole app: it mounts global chrome (`CustomCursor`, `ScrollProgress`, `Navigation`, `Footer`) and renders the section components in a fixed vertical order (`Hero → About → Experience → Projects → Skills → Education → Leadership → Contact`) separated by `<div class="section-divider" />`. Each section is wrapped by `components/layout/SectionWrapper.tsx`, which sets the section `id`, applies standard padding/max-width, and animates with framer-motion's `whileInView` using a variant from `lib/animations.ts` (default `fadeUp`).

### Navigation is hash-based, not routed

There is no router. "Pages" are sections inside one document, navigated via fragment IDs:

- `useScrollSpy` (`hooks/useScrollSpy.ts`) tracks which section ID is currently in view.
- `Navigation.tsx` writes that ID into the URL via `history.replaceState` and uses an `isScrollingTo` ref to suppress that write during programmatic scrolls (otherwise the scroll-spy fights the click).
- `App.tsx` reads `window.location.hash` on mount and scrolls to that section after a 300 ms delay (waits for sections to render).
- The `navHeight = 70` offset in `Navigation.scrollTo` and the `-70` offset in `App.tsx` must stay in sync with the fixed nav's height.

### Content is data, not JSX

All section content lives in `client/src/data/*.ts` (`personal`, `experience`, `projects`, `skills`, `education`, `leadership`). Section components import these and render them. **To change copy, edit the data file — not the component.** Each data module exports typed records (e.g. `ExperienceEntry`); add new entries by appending to the exported array.

### Styling

- Tailwind with `darkMode: "class"`. Custom palette is in `tailwind.config.ts` (`bg`, `primary`, `accent`, `surface`, `text`, `terminal.*`) — prefer these tokens over raw hex.
- Global styles in `client/src/index.css` define reusable utilities used throughout sections: `.gradient-text`, `.glass`, `.glass-strong`, `.glow-border`, `.terminal-window`, `.terminal-header`, `.terminal-dot`, `.section-divider`. Glass classes have a solid-color fallback for browsers without `backdrop-filter`.
- Inter and Fira Code are loaded from Google Fonts in `client/index.html`; `font-mono` maps to Fira Code.
- A `prefers-reduced-motion` rule disables animations globally — keep that working when adding new animated elements.

### shadcn/ui

`components.json` is configured for shadcn (style `new-york`, aliases set), but no shadcn components or Radix dependencies are installed. `client/src/components/ui/` currently holds only small bespoke components (`AnimatedCounter`, `Badge`, `ParticleField`, `TiltCard`). If you add a real shadcn component, you'll also need to add the underlying Radix package — don't assume it's already there.

### Build layout note

`vite.config.ts` sets `root: client/` and `outDir: <repo>/dist`. TypeScript is configured with `allowImportingTsExtensions` and `noEmit: true` — `tsc` only typechecks; Vite emits.
