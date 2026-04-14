# FunAppBox

A collection of 14 fun and useful mini web apps & games built with Next.js 15 and Tailwind CSS.

**Live:** [https://www.funappbox.com](https://www.funappbox.com)

## Apps

| # | App | Route | Description |
|---|-----|-------|-------------|
| 1 | 이름궁합 | `/name-test` | Name compatibility test using Korean stroke count & five elements analysis |
| 2 | 만능 계산기 | `/calculator` | Multi-purpose calculator (salary, BMI, unit conversion, discount) |
| 3 | MBTI 인사이트 | `/mbti` | Deep analysis of 16 MBTI personality types |
| 4 | 맞춤법 왕 | `/spelling` | Korean spelling quiz with commonly confused words |
| 5 | 사운드포커스 | `/sound` | Ambient sound mixer for focus (rain, waves, fire, etc.) |
| 6 | 투자 시뮬레이터 | `/invest` | Historical investment simulator with 12 assets (2005~2026) |
| 7 | 컬러크래프트 | `/color` | Color palette generator (analogous, complementary, triadic, monochromatic) |
| 8 | 타이핑 챌린지 | `/typing` | Korean typing speed and accuracy test |
| 9 | 밥뭐먹지 | `/menu` | Random menu picker with category filters |
| 10 | 디데이 메이커 | `/dday` | D-Day counter with localStorage persistence |
| 11 | 스네이크 게임 | `/snake` | Classic snake game with Canvas rendering |
| 12 | 플래피버드 | `/flappy` | Flappy Bird with neon dark theme |
| 13 | 햄스터 키우기 | `/hamster` | Virtual pet raising game with pixel art hamster |
| 14 | 사주 & 운세 | `/fortune` | Saju (Four Pillars) analysis + daily fortune |

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
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/app/
├── layout.jsx              # Root layout (GA4, AdSense, SEO, verification)
├── page.jsx                # Hub page (bento grid, JSON-LD, SEO text)
├── globals.css             # Tailwind config + animations
├── sitemap.js              # Auto-generated sitemap.xml (15 URLs)
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
├── hamster/                # 햄스터 키우기
└── fortune/                # 사주 & 오늘의 운세
```

Each app directory contains `page.jsx` (client component) + `layout.jsx` (SEO metadata).

## SEO

- Per-page metadata with Korean long-tail keywords
- JSON-LD WebSite structured data on hub page
- Auto-generated `sitemap.xml` with priority differentiation
- `robots.txt` allowing all crawlers
- Google Search Console verified + sitemap submitted
- Naver Search Advisor verified + sitemap submitted

## Deployment

Auto-deploys to Vercel on push to `main`. Domain `www.funappbox.com` with HTTPS.

## License

Private project.
