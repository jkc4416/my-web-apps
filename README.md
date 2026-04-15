# FunAppBox

A collection of **27 fun and useful mini web apps & games** built with Next.js 15 and Tailwind CSS.

**Live:** [https://www.funappbox.com](https://www.funappbox.com)

## Apps

### Tools (14)

| # | App | Route | Description |
|---|-----|-------|-------------|
| 1 | 이름궁합 | `/name-test` | Name compatibility test using Korean stroke count & five elements |
| 2 | 만능 계산기 | `/calculator` | Multi-purpose calculator (salary, BMI, unit conversion, discount) |
| 3 | MBTI 인사이트 | `/mbti` | Deep analysis of 16 MBTI personality types |
| 4 | 맞춤법 왕 | `/spelling` | Korean spelling quiz with persistent stats |
| 5 | 사운드포커스 | `/sound` | Ambient sound mixer for focus (rain, waves, fire, etc.) |
| 6 | 투자 시뮬레이터 | `/invest` | Historical investment simulator (12 assets, 2005~2026) |
| 7 | 컬러크래프트 | `/color` | Color palette + slide palette for presentations |
| 8 | 타이핑 챌린지 | `/typing` | Korean typing test with WPM stats (IME-safe) |
| 9 | 밥뭐먹지 | `/menu` | Random menu picker with custom items |
| 10 | 디데이 메이커 | `/dday` | D-Day counter with localStorage persistence |
| 11 | 사주 & 운세 | `/fortune` | Saju (Four Pillars) + daily fortune |
| 12 | QR코드 생성기 | `/qrcode` | Text/URL to QR code with download |
| 13 | 글자수 세기 | `/charcount` | Realtime char/word/byte counter |
| 14 | 나이 계산기 | `/age-calc` | Age, zodiac, birthstone, days lived |

### Utilities (3)

| # | App | Route | Description |
|---|-----|-------|-------------|
| 15 | 비밀번호 생성기 | `/password` | Crypto-secure password generator with strength meter |
| 16 | 단위 변환기 | `/unit-convert` | 6 categories (length, weight, temp, area, speed, data) |
| 17 | 밸런스 게임 | `/balance` | 30 either-or questions with vote percentages |

### Psych tests (3)

| # | App | Route | Description |
|---|-----|-------|-------------|
| 18 | 닮은 동물 테스트 | `/animal-test` | 7-question quiz, 8 animal types |
| 19 | 전생 테스트 | `/past-life` | Birth-date based past life reveal |
| 20 | 연애 타로 | `/tarot` | 3-card tarot spread for love fortune |

### Games (7)

| # | App | Route | Description |
|---|-----|-------|-------------|
| 21 | 스네이크 게임 | `/snake` | Classic snake game with Canvas |
| 22 | 플래피버드 | `/flappy` | Flappy Bird with HP, 6 items, 5-item shop, seeds/coins |
| 23 | 햄스터 키우기 | `/hamster` | Virtual pet with pixel art, 30 decor, 3 mini-games |
| 24 | 2048 | `/game2048` | Tile puzzle with undo, animations, keep-playing |
| 25 | 한글 워들 | `/wordle-kr` | Daily word puzzle with streak + distribution stats |
| 26 | 지뢰찾기 | `/minesweeper` | 3 difficulties with per-difficulty best time |
| 27 | 틱택토 | `/tictactoe` | AI opponent with minimax algorithm |

## Tech Stack

- **Framework:** Next.js 15.5 (App Router, Turbopack)
- **UI:** React 19.1, Tailwind CSS 4
- **Charts:** Recharts 3.8
- **Deployment:** Vercel (auto-deploy on push to main)
- **Domain:** www.funappbox.com
- **Analytics:** Google Analytics 4
- **Monetization:** Google AdSense

## Getting Started

```bash
npm install
npm run dev          # dev server on localhost:3000
npm run build        # production build
npm run lint         # ESLint
```

## Project Structure

```
src/app/
├── layout.jsx              # Root layout (GA4, AdSense, SEO, viewport)
├── page.jsx                # Hub page (bento grid, JSON-LD)
├── globals.css             # Tailwind config + animations
├── sitemap.js              # Dynamic sitemap.xml (28 URLs, today's date)
├── robots.js               # robots.txt
└── <27 app directories>/   # each has page.jsx + layout.jsx
```

Each app directory has `page.jsx` (client component) + `layout.jsx` (SEO metadata).

## Quality & Persistence

- **localStorage** (wrapped in try/catch for Safari private mode): dday, hamster, snake, flappy, fortune, qrcode, game2048, tictactoe, spelling (stats), typing (stats/ranks/nick), wordle-kr (stats/daily progress), minesweeper (best times), menu (history/custom), unit-convert (last category), password (session)
- **Clipboard API** (wrapped): all 10+ apps with share functionality
- **Canvas/SVG**: snake, flappy, invest (Recharts), hamster (SVG mini-games), name-test (export)
- **Web Audio API**: sound
- **Korean IME composition** handled correctly in typing + wordle-kr

## SEO

- Per-page Korean long-tail keyword metadata (title, desc, keywords, OG, Twitter)
- JSON-LD WebSite structured data on hub page
- Dynamic sitemap with today's date as lastModified (re-crawl friendly)
- robots.txt + ads.txt + naver/google verification
- Google Search Console + Naver Search Advisor verified

## Deployment

Auto-deploys to Vercel on `main` push. Domain has automatic HTTPS.

## License

Private project.
