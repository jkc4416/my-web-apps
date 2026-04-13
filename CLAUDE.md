# CLAUDE.md

## Project Overview

FunAppBox — a Next.js 15 monorepo containing 13 standalone mini web apps and games served under a single domain (www.funappbox.com). Each app is a client component (`"use client"`) with its own route and SEO layout.

## Key Commands

```bash
npm run dev          # Start dev server (Turbopack) on localhost:3000
npm run build        # Production build
npm run lint         # ESLint
git push             # Auto-deploys to Vercel
```

## Architecture

- **Framework:** Next.js 15 App Router with Turbopack
- **Styling:** Tailwind CSS 4 (no tailwind.config — uses `@theme inline` in globals.css)
- **State:** All client-side, no backend/database. D-Day and hamster apps use localStorage.
- **Analytics:** GA4 (G-9B1VWBK256) loaded via `next/script` in body (not head — head doesn't work in App Router)
- **Monetization:** Google AdSense (ca-pub-7511894317730921) loaded via `next/script` in body, `ads.txt` in `public/`
- **SEO:** Each app has its own `layout.jsx` exporting `metadata` for title/description/keywords/OG/Twitter
- **Sitemap:** Auto-generated via `src/app/sitemap.js`
- **Deployment:** Vercel, auto-deploy on push to main

## File Conventions

- App pages use `.jsx` extension
- Each app directory has `page.jsx` (client component) + `layout.jsx` (server component for metadata)
- Source `.jsx` files (e.g., `name-compatibility.jsx`) in `src/app/` are the originals for the first 10 apps — the route pages are copies with `"use client"` prepended
- Game apps (snake, flappy, hamster) were written directly as route pages
- Root `layout.jsx` contains GA4 scripts, AdSense script, verification codes, and shared metadata with `title.template`
- `public/ads.txt` contains AdSense publisher authorization

## Domain & Verification

- Domain: `www.funappbox.com` (non-www redirects to www via Vercel)
- Google Search Console: verified via meta tag
- Naver Search Advisor: verified via meta tag
- GA4 Measurement ID: `G-9B1VWBK256`
- AdSense Publisher ID: `ca-pub-7511894317730921`

## Important Notes

- `next/script` must be placed inside `<body>`, not `<head>` in App Router — scripts in head are silently ignored
- Naver verification uses `verification.other` in metadata (Next.js only natively supports google/yandex/yahoo)
- All 13 apps are client components using React hooks — `"use client"` directive is required at top of each page.jsx
- The invest app uses Recharts for charting
- The sound app uses Web Audio API (AudioContext)
- Snake and flappy games use Canvas API for rendering
- Hamster game uses CSS pixel art with 5-tier growth sprites and localStorage for persistence
