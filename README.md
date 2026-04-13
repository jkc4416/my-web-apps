# FunAppBox

A collection of 10 fun and useful mini web apps built with Next.js 15 and Tailwind CSS.

**Live:** [https://www.funappbox.com](https://www.funappbox.com)

## Apps

| # | App | Route | Description |
|---|-----|-------|-------------|
| 1 | 이름궁합 | `/name-test` | Name compatibility test using Korean stroke count & five elements analysis |
| 2 | 만능 계산기 | `/calculator` | Multi-purpose calculator (salary, BMI, unit conversion, discount) |
| 3 | MBTI 인사이트 | `/mbti` | Deep analysis of 16 MBTI personality types |
| 4 | 맞춤법 왕 | `/spelling` | Korean spelling quiz with commonly confused words |
| 5 | 사운드포커스 | `/sound` | Ambient sound mixer for focus (rain, waves, fire, etc.) |
| 6 | 투자 시뮬레이터 | `/invest` | Compound interest investment simulator with yearly projections |
| 7 | 컬러크래프트 | `/color` | Color palette generator (analogous, complementary, triadic, monochromatic) |
| 8 | 타이핑 챌린지 | `/typing` | Korean typing speed and accuracy test |
| 9 | 밥뭐먹지 | `/menu` | Random menu picker with category filters |
| 10 | 디데이 메이커 | `/dday` | D-Day counter with localStorage persistence |

## Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Styling:** Tailwind CSS 4
- **Charts:** Recharts
- **Deployment:** Vercel
- **Domain:** www.funappbox.com
- **Analytics:** Google Analytics 4
- **Monetization:** Google AdSense

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/app/
├── layout.jsx              # Root layout (GA4, AdSense, SEO metadata, verification)
├── page.jsx                # Hub page (bento grid with 10 app cards)
├── globals.css             # Tailwind config + animations
├── sitemap.js              # Auto-generated sitemap.xml
├── robots.js               # robots.txt configuration
├── name-test/
│   ├── layout.jsx          # SEO metadata
│   └── page.jsx            # App component
├── calculator/
│   ├── layout.jsx
│   └── page.jsx
├── mbti/
│   ├── layout.jsx
│   └── page.jsx
├── spelling/
│   ├── layout.jsx
│   └── page.jsx
├── sound/
│   ├── layout.jsx
│   └── page.jsx
├── invest/
│   ├── layout.jsx
│   └── page.jsx
├── color/
│   ├── layout.jsx
│   └── page.jsx
├── typing/
│   ├── layout.jsx
│   └── page.jsx
├── menu/
│   ├── layout.jsx
│   └── page.jsx
└── dday/
    ├── layout.jsx
    └── page.jsx
```

## SEO

- Per-page metadata (title, description, keywords, OpenGraph, Twitter Card)
- Auto-generated `sitemap.xml` with all 11 URLs
- `robots.txt` allowing all crawlers
- Google Search Console verified
- Naver Search Advisor verified

## Deployment

The app auto-deploys to Vercel on push to `main`. Custom domain `www.funappbox.com` is configured with automatic HTTPS.

## License

Private project.
