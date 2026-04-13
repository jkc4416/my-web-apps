# FunAppBox

A collection of 13 fun and useful mini web apps & games built with Next.js 15 and Tailwind CSS.

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
| 11 | 스네이크 게임 | `/snake` | Classic snake game with Canvas rendering |
| 12 | 플래피버드 | `/flappy` | Flappy Bird with neon dark theme |
| 13 | 햄스터 키우기 | `/hamster` | Virtual pet raising game with pixel art hamster |

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
├── page.jsx                # Hub page (bento grid with 13 app cards)
├── globals.css             # Tailwind config + animations
├── sitemap.js              # Auto-generated sitemap.xml
├── robots.js               # robots.txt configuration
├── name-test/              # 이름궁합
├── calculator/             # 만능 계산기
├── mbti/                   # MBTI 인사이트
├── spelling/               # 맞춤법 왕
├── sound/                  # 사운드포커스
├── invest/                 # 투자 시뮬레이터
├── color/                  # 컬러크래프트
├── typing/                 # 타이핑 챌린지
├── menu/                   # 밥뭐먹지
├── dday/                   # 디데이 메이커
├── snake/                  # 스네이크 게임
├── flappy/                 # 플래피버드
└── hamster/                # 햄스터 키우기
```

Each app directory contains `page.jsx` (client component) + `layout.jsx` (SEO metadata).

## SEO

- Per-page metadata (title, description, keywords, OpenGraph, Twitter Card)
- Auto-generated `sitemap.xml` with all 14 URLs
- `robots.txt` allowing all crawlers
- Google Search Console verified
- Naver Search Advisor verified

## Deployment

The app auto-deploys to Vercel on push to `main`. Custom domain `www.funappbox.com` is configured with automatic HTTPS.

## License

Private project.
