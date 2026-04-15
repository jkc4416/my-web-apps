# CLAUDE.md

## Project Overview

FunAppBox — a Next.js 15 monorepo containing **27 standalone mini web apps, tools, tests, and games** served under a single domain (www.funappbox.com). Each app is a client component (`"use client"`) with its own route and SEO layout.

## Key Commands

```bash
npm run dev          # Start dev server (Turbopack) on localhost:3000
npm run build        # Production build
npm run lint         # ESLint (0 errors, 0 warnings)
git push             # Auto-deploys to Vercel
```

## Architecture

- **Framework:** Next.js 15.5 App Router with Turbopack
- **UI:** React 19.1, Tailwind CSS 4 (no tailwind.config — uses `@theme inline` in globals.css)
- **State:** 100% client-side. No backend/database. Many apps use localStorage for persistence.
- **Analytics:** GA4 (G-9B1VWBK256) loaded via `next/script` in body (not head — App Router silently ignores head scripts)
- **Monetization:** Google AdSense (ca-pub-7511894317730921) loaded via `next/script` in body, `ads.txt` in `public/`
- **SEO:** Each app has its own `layout.jsx` exporting `metadata`. Hub page has JSON-LD `WebSite` structured data.
- **Sitemap:** Dynamic via `src/app/sitemap.js` — `lastModified` uses today's date each build
- **Deployment:** Vercel, auto-deploy on push to main

## File Conventions

- App pages use `.jsx` extension
- Each app directory has `page.jsx` (client component) + `layout.jsx` (server component for metadata)
- Root `layout.jsx` contains GA4 scripts, AdSense script, verification codes, shared metadata with `title.template`, and `viewport` export with `themeColor: "#0a0a0f"`
- `public/ads.txt` contains AdSense publisher authorization
- App list (27): name-test, calculator, mbti, spelling, sound, invest, color, typing, menu, dday, snake, flappy, hamster, fortune, balance, qrcode, game2048, charcount, animal-test, age-calc, password, wordle-kr, past-life, tarot, minesweeper, tictactoe, unit-convert

## Domain & Verification

- Domain: `www.funappbox.com` (non-www redirects to www via Vercel)
- Google Search Console: verified via meta tag
- Naver Search Advisor: verified via meta tag + HTML file
- GA4 Measurement ID: `G-9B1VWBK256`
- AdSense Publisher ID: `ca-pub-7511894317730921`

## Persistence Layer

All localStorage operations are wrapped in try/catch for Safari private browsing compatibility. Key inventory:

| App | localStorage keys |
|-----|-------------------|
| dday | `dd-list` |
| hamster | `hamster-save-v5` (full state + offline decay) |
| snake | `snake-high-score` |
| flappy | `flappy-high-score`, `flappy-coins` |
| fortune | `fortune-birth` |
| qrcode | `qr-history` |
| game2048 | `2048-best` (lazy-init to avoid race) |
| tictactoe | `ttt-score` |
| spelling | `spelling-best`, `spelling-stats` |
| typing | `typing-stats`, `typing-ranks`, `typing-nick` |
| wordle-kr | `wordle-kr-stats`, `wordle-kr-last-day/guesses/state` |
| minesweeper | `minesweeper-best` (per-difficulty array) |
| menu | `menu-history`, `menu-custom` |
| unit-convert | `unit-convert-cat` |

## Important Notes

- `next/script` must be placed inside `<body>`, not `<head>` in App Router — scripts in head are silently ignored
- Naver verification uses `verification.other` in metadata (Next.js only natively supports google/yandex/yahoo)
- All 27 apps are client components using React hooks — `"use client"` directive is required at top of each page.jsx
- All localStorage calls are wrapped in try/catch for Safari private browsing compatibility
- All navigator.clipboard / navigator.share calls are wrapped in try/catch
- Korean IME composition is handled correctly in typing + wordle-kr (onCompositionStart/End pattern)
- The invest app uses Recharts, data spans 2005~2026 with period presets
- Sound app uses Web Audio API (AudioContext)
- Snake, flappy, hamster (SVG mini-games), and invest (Recharts) use canvas or SVG
- Hamster game uses CSS pixel art with 5-tier growth sprites, sawdust memoized for perf
- Fortune app uses traditional saju (천간지지) calculation with input validation
- Game2048 uses synchronous useState lazy initializer for best score (prevents race condition)

## Known Safe Patterns

- `setHighScore((prev) => Math.max(prev, new))` — race-safe high score updates
- `typeof window !== "undefined"` guard in useState initializers that touch localStorage
- `compositionRef.current` flag to prevent controlled input overwrite during Korean IME composition
- `useMemo` keyed on quantized value (e.g., `Math.floor(state.sawdustFresh/2)`) to limit re-renders
