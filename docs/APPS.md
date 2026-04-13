# App Documentation

## Overview

FunAppBox contains 13 mini web apps and games. All apps are client-side only (no API routes, no database) and are deployed as a single Next.js application.

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
- **Features:** Compound interest simulation, monthly contribution, yearly growth chart, total profit calculation
- **Key Tech:** Recharts for data visualization
- **Dependency:** `recharts` package

## 7. 컬러크래프트 (Color Craft)

- **Route:** `/color`
- **Source:** `color-craft.jsx`
- **Features:** Color palette generator with 4 harmony modes (analogous, complementary, triadic, monochromatic), HSL-to-HEX conversion, click-to-copy
- **Key Tech:** Color theory algorithms, Clipboard API

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
- **Key Tech:** localStorage for persistence, date arithmetic
- **Note:** Requires `"use client"` — localStorage is browser-only

---

## Games

## 11. 스네이크 게임 (Snake Game)

- **Route:** `/snake`
- **Features:** Classic snake game, arrow key + swipe + mobile D-pad controls, score tracking with localStorage high score, speed increases with score
- **Key Tech:** Canvas API, requestAnimationFrame game loop, touch/swipe detection
- **Controls:** Arrow keys (desktop), swipe or D-pad buttons (mobile), Space/Enter to start

## 12. 플래피버드 (Flappy Bird)

- **Route:** `/flappy`
- **Features:** Flappy Bird clone with neon dark theme, pipe navigation, collision detection, animated bird with wing flap and rotation, star parallax background
- **Key Tech:** Canvas API, requestAnimationFrame at 60fps, gravity/jump physics
- **Controls:** Space/↑ (desktop), tap/click (mobile)

## 13. 햄스터 키우기 (Hamster Pet)

- **Route:** `/hamster`
- **Features:**
  - **Pixel art hamster** with 5 growth tiers (아기→꼬마→청소년→어른→왕), each with unique sprite and sleeping expression
  - **4 stats:** hunger, happiness, energy, cleanliness (decay over time)
  - **Random roaming:** hamster walks around cage naturally with smooth eased animation
  - **Actions:** feed, bathe, sleep, pet (tap hamster)
  - **Wheel mini-game:** wheel appears → hamster walks to it → tap button rapidly to earn coins
  - **Toy system:** buy toys permanently (ball, tunnel, swing), interactive play sequence with tap mechanic
  - **Poop system:** hamster poops periodically, tap to clean, affects cleanliness/happiness
  - **Sawdust system:** degrades over time (turns gray visually), buy new sawdust from shop, covers entire cage floor
  - **Shop:** 3 tabs (food, toys, maintenance), 5 foods, 3 toys (permanent), sawdust
  - **Level/XP system:** 10 title tiers, size grows every 5 levels, king tier has golden crown
  - **Persistence:** full state saved to localStorage including offline time decay
- **Key Tech:** CSS pixel art rendering, ref-based position tracking, multi-phase animation sequences, seeded pseudo-random sawdust distribution
- **Note:** Requires `"use client"` — localStorage and timers are browser-only
