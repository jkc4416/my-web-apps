# App Documentation

## Overview

FunAppBox contains 14 mini web apps and games. All apps are client-side only (no API routes, no database) and are deployed as a single Next.js application.

---

## 1. 이름궁합 (Name Compatibility)

- **Route:** `/name-test`
- **Source:** `name-compatibility.jsx`
- **Features:** Korean stroke count analysis, five elements (음양오행) compatibility, 4 themes (romance, friendship, business, soulmate), result sharing, image export via Canvas API
- **Key Tech:** Canvas API for image generation, Korean Unicode decomposition

## 2. 만능 계산기 (Multi Calculator)

- **Route:** `/calculator`
- **Source:** `calculator-hub.jsx`
- **Features:** Salary calculator (after-tax), BMI calculator, unit converter, discount calculator, percentage calculator
- **Key Tech:** Multiple calculator modes in a single interface

## 3. MBTI 인사이트 (MBTI Insight)

- **Route:** `/mbti`
- **Source:** `mbti-insight.jsx`
- **Features:** All 16 MBTI types with personality traits, strengths, weaknesses, career aptitude, compatibility
- **Key Tech:** Static data-driven UI

## 4. 맞춤법 왕 (Spelling Quiz)

- **Route:** `/spelling`
- **Source:** `spelling-quiz.jsx`
- **Features:** Quiz on commonly confused Korean words, score tracking, difficulty levels
- **Key Tech:** Quiz state machine with timer

## 5. 사운드포커스 (Sound Focus)

- **Route:** `/sound`
- **Source:** `sound-focus.jsx`
- **Features:** Ambient sound mixer (rain, waves, fire, wind, birds, thunder), per-sound volume control, simultaneous playback
- **Key Tech:** Web Audio API (AudioContext), procedural noise generation with BiquadFilter
- **Note:** Requires `"use client"` — AudioContext is browser-only

## 6. 투자 시뮬레이터 (Investment Simulator)

- **Route:** `/invest`
- **Source:** `investment-sim.jsx`
- **Features:**
  - 12 assets: Samsung, SK Hynix, Kakao, Naver, KOSPI, S&P 500, Nasdaq, Apple, Tesla, Bitcoin, Ethereum, Gold
  - Data range: 2005~2026 (varies by asset)
  - Lump-sum and DCA (dollar-cost averaging) modes
  - Period presets: 1년, 3년, 5년, 10년, 15년, 20년, 전체
  - Custom start/end date selection
  - CAGR calculation, yearly growth chart via Recharts
  - Result image export and share
- **Key Tech:** Recharts, linear price interpolation, timezone-safe date handling (day-15)
- **Dependency:** `recharts` package

## 7. 컬러크래프트 (Color Craft)

- **Route:** `/color`
- **Source:** `color-craft.jsx`
- **Features:** Color palette generator with 4 harmony modes (analogous, complementary, triadic, monochromatic), HSL-to-HEX conversion, click-to-copy
- **Key Tech:** Color theory algorithms, Clipboard API (with try/catch)

## 8. 타이핑 챌린지 (Typing Challenge)

- **Route:** `/typing`
- **Source:** `typing-challenge.jsx`
- **Features:** Korean typing speed test, WPM calculation, accuracy measurement, real-time character highlighting
- **Key Tech:** Real-time input comparison, WPM calculation

## 9. 밥뭐먹지 (Menu Picker)

- **Route:** `/menu`
- **Source:** `menu-roulette.jsx`
- **Features:** Random menu picker with category filters (Korean, Chinese, Japanese, Western, snacks, etc.), roulette animation
- **Key Tech:** Animated random selection with interval-based cycling

## 10. 디데이 메이커 (D-Day Maker)

- **Route:** `/dday`
- **Source:** `dday-maker.jsx`
- **Features:** D-Day counter, multiple events, add/remove events, sorted by date, persistent storage
- **Key Tech:** localStorage (with try/catch), date arithmetic

---

## Games

## 11. 스네이크 게임 (Snake Game)

- **Route:** `/snake`
- **Features:** Classic snake game, arrow key + swipe + mobile D-pad controls, score tracking with localStorage high score, speed increases with score, mobile-responsive canvas
- **Key Tech:** Canvas API, setInterval game loop, touch/swipe detection
- **Controls:** Arrow keys (desktop), swipe or D-pad buttons (mobile), Space/Enter to start

## 12. 플래피버드 (Flappy Bird)

- **Route:** `/flappy`
- **Features:** Flappy Bird clone with neon dark theme, pipe navigation, collision detection, animated bird with wing flap and rotation, star parallax background, mobile-responsive canvas
- **Key Tech:** Canvas API, requestAnimationFrame at 60fps, gravity/jump physics
- **Controls:** Space/↑ (desktop), tap/click (mobile)

## 13. 햄스터 키우기 (Hamster Pet)

- **Route:** `/hamster`
- **Features:**
  - **Pixel art hamster** with 5 growth tiers (아기→꼬마→청소년→어른→왕), grows every 5 levels, king has golden crown
  - **4 stats:** hunger, happiness, energy, cleanliness (decay over time, affected by poop count and sawdust freshness)
  - **Random roaming:** hamster walks around cage naturally with smooth eased animation via ref-based position tracking
  - **Actions:** feed, bathe, sleep (ref-managed timer), pet (tap hamster)
  - **Wheel mini-game:** wheel appears → hamster walks to it → "달려!" button → tap rapidly to earn coins → hamster walks away
  - **Toy system:** buy toys permanently (200~500 coins), interactive play sequence with tap mechanic
  - **Poop system:** hamster poops every ~25s (max 8), tap individual or "clean all", affects cleanliness/happiness decay
  - **Sawdust system:** degrades over time (chips turn gray), buy new sawdust from shop, covers entire cage floor with depth gradient
  - **Shop:** 3 tabs (food, toys, maintenance), 5 foods, 3 toys (permanent), sawdust
  - **Level/XP system:** 10 title tiers, size grows every 5 levels
  - **Persistence:** full state saved to localStorage (with try/catch) including offline time decay
  - **Reset safety:** clears all active timers (sleep, wheel, toy) on reset
- **Key Tech:** CSS pixel art rendering, ref-based position tracking, multi-phase animation sequences, seeded pseudo-random sawdust distribution

---

## 14. 사주 & 오늘의 운세 (Fortune)

- **Route:** `/fortune`
- **Features:**
  - **Birth input:** year/month/day (validated 1920~2025, 1~12, 1~31), optional hour, gender
  - **Saju analysis:** 4 pillars (년주/월주/일주/시주) with 천간지지
  - **Five elements:** 목화토금수 bar chart, weakest element recommendation
  - **Yin/yang balance:** visual comparison
  - **Daily fortune:** 5 categories (총운/애정/재물/건강/직장) with star ratings, deterministic daily hash
  - **Lucky items:** color, number, direction, food (changes daily)
  - **Zodiac fortune:** 12 animal zodiac (띠) fortune
  - **Share:** Web Share API with clipboard fallback (try/catch)
  - **Persistence:** birth data saved to localStorage (with try/catch), returns to fortune tab on revisit
  - **Summary card:** average score with 대길/길/보통/소길 rating
- **Key Tech:** Traditional saju (천간지지) calculation, deterministic hash-based fortune, input validation
- **Note:** Disclaimer clearly states this is entertainment content
