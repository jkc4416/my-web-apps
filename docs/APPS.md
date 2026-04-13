# App Documentation

## Overview

FunAppBox contains 10 mini web apps. All apps are client-side only (no API routes, no database) and are deployed as a single Next.js application.

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
