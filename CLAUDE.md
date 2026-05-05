# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` runs the Vite dev server (root is `client/`, alias `@` resolves to `client/src`).
- `npm run build` runs `tsc` (typecheck, noEmit, strict) then `vite build` to `dist/`.
- `npm run preview` serves the production build locally.

There is no test runner and no lint script configured. Type errors will fail `build`.

## Deployment

`.github/workflows/deploy.yml` deploys to GitHub Pages on every push to `main`: it runs `npm ci && npm run build` and uploads `dist/` as the Pages artifact. `client/public/.nojekyll` and `client/public/404.html` ship with the build.

## Architecture

Multi-page React SPA on top of GitHub Pages. Pure frontend. No backend, no database. The `replit.md` file in the repo describes an Express/Drizzle/Postgres/TanStack-Query stack that does not exist in `package.json`; treat it as stale and ignore it. Actual stack: React 18 + TypeScript + Vite + Tailwind + framer-motion + lucide-react + react-hook-form + **wouter** (router) + **@mdx-js/rollup** + **@mdx-js/react** (case studies as MDX) + **recharts** (case-study charts, lazy-loaded).

### Routing

`client/src/App.tsx` is a wouter `<Switch>` shell. All non-home pages are `React.lazy`-imported so they ship in their own chunks:

| Path | Page | Notes |
|---|---|---|
| `/` | `pages/HomePage.tsx` | Condensed identity (Hero + featured stats + featured work + about teaser + contact CTA). Eager. |
| `/work` | `pages/WorkPage.tsx` | Full project landing with `TechStackFrequency` + filters + grid. Lazy. |
| `/work/:id` | `pages/WorkDetailPage.tsx` | Project deep dive (case study). Lazy. Pulls in Recharts. |
| `/case/:id` | `Redirect` to `/work/:id` | Backward-compat for the previous URL scheme. |
| `/experience` | `pages/ExperiencePage.tsx` | `ExperienceTimeline` + tabbed Experience + DomainMatrix. Lazy. |
| `/about` | `pages/AboutPage.tsx` | Long-form bio + ByTheNumbers + Skills + Education + Leadership. Lazy. |
| `/contact` | `pages/ContactPage.tsx` | Contact form + Calendly + socials. Lazy. |
| anything else | `NoMatch` | Inline 404. |

GitHub Pages SPA fallback: `client/public/404.html` encodes the requested path as `?/...` and redirects to `/`; a small inline script at the top of `client/index.html`'s `<body>` decodes it back into the real URL via `history.replaceState` before React mounts. Together they let direct loads of any deep URL resolve correctly.

### Page composition

Pages are thin: each page renders its own header block (terminal-style `$` prompt, gradient-text H1, accent rule, intro paragraph) followed by reusing the established section components (`Hero`, `About`, `ByTheNumbers`, `Experience`, `ExperienceTimeline`, `Skills`, `DomainMatrix`, `Education`, `Leadership`, `Contact`). No page directly authors the inner content; it composes existing section components separated by `<div class="section-divider" />`.

`SectionWrapper` (`components/layout/SectionWrapper.tsx`) gives each section its `id`, padding, max-width (`max-w-7xl`), and framer-motion `whileInView` animation. Used by sections, not by pages directly.

### Navigation

`components/layout/Navigation.tsx` is route-based, not section-based:

- Top-level routes are `/work`, `/experience`, `/about`, `/contact`. Logo links to `/`.
- Active route is detected via `useLocation()` from wouter; the matching link gets `aria-current="page"` and the animated underline indicator (`layoutId="nav-indicator"`).
- `/work/:id` is treated as active for the `/work` nav item via `isActive` helper.
- Mobile menu auto-closes on route change.

`components/layout/Footer.tsx` mirrors the top nav with a small text-link row plus social links.

### Content is data, not JSX (with one exception)

Most content lives in `client/src/data/*.ts` (`personal`, `experience`, `projects`, `skills`, `education`, `leadership`, `caseStudies`). Section components import these and render them. **To change copy, edit the data file, not the component.**

`PortfolioProject` carries an optional `metrics?: PortfolioMetric[]` field. These render as `MetricChip`s above the card description and again above the case-study fold. Add or remove `metrics` entries to control the visual.

**Exception, case studies.** Each `client/src/case-studies/<project-id>.mdx` is content authored as MDX, not data. The slug must match a `PortfolioProject.id`. `data/caseStudies.ts` discovers them via `import.meta.glob` at build time and exposes a `caseStudySlugs` Set. If a case study exists for a project, `PortfolioCard` auto-shows a "Read case study" link to `/work/<id>`. Custom MDX components (`Diagram`, `MetricRow`, `ResultsChart`, `Callout`) are injected via `MDXProvider` in `WorkDetailPage`, so authors use them inline in MDX without importing.

### Work page filtering

`pages/WorkPage.tsx` owns filter state (type, tech multi-select, search query, sort key) and syncs it to the URL query string (`?type=rnd&tech=Python,XGBoost&q=foo&sort=az`) via `URLSearchParams` + `history.replaceState`. The state is also read from the URL on mount, so filtered URLs are shareable. `components/work/ProjectFilters.tsx` is a controlled presentation component; `components/work/ProjectGrid.tsx` is a stateless wrapper around the array of `PortfolioCard`.

### Visual interstitials

These are inline-data SVG/chart components that render real numbers from the data layer or hard-coded constants:

- `components/sections/ByTheNumbers.tsx`: aggregate scale numbers (sea states, model fits, DOE cases). 6-cell grid, 6-col on `lg`+.
- `components/sections/DomainMatrix.tsx`: 7×6 capability-by-domain heat grid. Lives on `/experience` (it used to live in Skills).
- `components/sections/ExperienceTimeline.tsx`: horizontal SVG career timeline parsing date periods from `experience.ts`. Sits above the tabbed Experience view.
- `components/sections/TechStackFrequency.tsx`: top-10 technology counts as horizontal gradient bars. Sits at the top of `/work`.

These read their data from inline constants because the values rarely change. If they grow, lift to `data/`.

### Styling

- Tailwind with `darkMode: "class"`. Custom palette in `tailwind.config.ts` (`bg`, `primary`, `accent`, `surface`, `text`, `terminal.*`). Prefer these tokens over raw hex.
- Global styles in `client/src/index.css` define `.gradient-text`, `.glass`, `.glass-strong`, `.glow-border`, `.section-divider`, and the `.case-study-prose` typography for MDX content. Glass classes have solid-color fallback when `backdrop-filter` is unavailable.
- Inter and Fira Code load from Google Fonts in `client/index.html`. `font-mono` maps to Fira Code.
- A `prefers-reduced-motion` rule disables animations globally. Keep that working when adding new animated elements.

### Em-dash discipline

User preference: zero em-dash (`—`, U+2014) characters anywhere in user-facing copy, comments, MDX, or strings. They read as AI-generated. Use `:`, `,`, `;`, periods, parentheses, or rephrase. En-dashes (`–`, U+2013) are fine for date ranges (`Mar 2024 – Present`) and number ranges (`5–7×`). Run `Grep` for `—` across `client/` after any text edit; it should return zero matches.

### shadcn/ui

`components.json` is configured for shadcn (style `new-york`, aliases set), but no shadcn components or Radix dependencies are installed. `client/src/components/ui/` only holds small bespoke components (`AnimatedCounter`, `Badge`, `MetricChip`). Adding a real shadcn component requires installing the underlying Radix package; do not assume it is present.

### Build layout note

`vite.config.ts` sets `root: client/` and `outDir: <repo>/dist`. TypeScript is configured with `allowImportingTsExtensions` and `noEmit: true`, so `tsc` only typechecks and Vite emits. The MDX plugin (`@mdx-js/rollup`) runs with `enforce: "pre"` so it transforms `.mdx` to JSX before the React plugin sees it. `client/src/mdx.d.ts` declares the MDX module type and references `vite/client` types so `import.meta.glob` typechecks.

### Bundle expectations

After lazy-splitting, target chunk sizes (gzipped):

- `index` (home page bundle): ~110 KB
- `WorkPage`: ~3 KB
- `WorkDetailPage` (Recharts): ~117 KB, only loaded on `/work/:id`
- `ExperiencePage`: ~7 KB
- `AboutPage`: ~7 KB
- `ContactPage`: ~11 KB
- Each MDX case study: 3 to 4 KB

Watch the `index` chunk in particular when adding new home-page features. Heavy deps (charts, MDX, route-only utilities) should stay behind a lazy import.
