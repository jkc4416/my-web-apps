# App Documentation

## Overview

FunAppBox contains **27 mini web apps, tools, tests, and games**. All apps are client-side only (no API routes, no database) and deployed as a single Next.js application.

---

## Tools (14)

### 1. 이름궁합 (/name-test)
- Korean stroke count + 음양오행 analysis, 4 themes (romance/friendship/business/soulmate)
- Canvas API image export, Enter key submits, share via Web Share API
- Korean Unicode decomposition for syllable analysis

### 2. 만능 계산기 (/calculator)
- Salary (after-tax), BMI, unit converter, discount, percentage calculators
- Single interface with calculator-type selector

### 3. MBTI 인사이트 (/mbti)
- All 16 MBTI types: traits, strengths, weaknesses, career aptitude, compatibility
- Static data-driven UI

### 4. 맞춤법 왕 (/spelling)
- Korean spelling quiz with commonly confused words
- **Persisted:** best streak + total stats (plays, correct, quiz count, best score)
- Modes: basic (15s), challenge (10s), endless

### 5. 사운드포커스 (/sound)
- Ambient sound mixer: rain, waves, fire, wind, birds, thunder
- Per-sound volume + master volume
- Web Audio API with BiquadFilter for procedural noise
- Sleep timer support

### 6. 투자 시뮬레이터 (/invest)
- 12 assets: Samsung, SK Hynix, Kakao, Naver, KOSPI, S&P 500, Nasdaq, Apple, Tesla, Bitcoin, Ethereum, Gold
- Data range: 2005~2026
- Lump-sum + DCA (dollar-cost averaging) modes
- Period presets: 1년, 3년, 5년, 10년, 15년, 20년, 전체 + custom start/end dates
- CAGR calculation, yearly chart (Recharts)
- Timezone-safe (day-15 dates)

### 7. 컬러크래프트 (/color)
- Palette generator (analogous, complementary, triadic, monochromatic, random)
- Gradient tool, box shadow, color converter, contrast checker, button generator, font pairing, image extractor
- **Slide Palette tool:** input main color → 6-color presentation palette

### 8. 타이핑 챌린지 (/typing)
- Korean typing test with WPM and accuracy
- **Persisted:** stats (tests, best WPM, avg), rankings, nickname
- **IME-safe:** onCompositionStart/End prevents Korean jamo overwrite
- Modes: sentence, timed, practice

### 9. 밥뭐먹지 (/menu)
- Random menu picker with category filters (한식/중식/일식/양식/분식/etc.)
- Custom user items mode
- **Persisted:** selection history + custom items
- Roulette animation

### 10. 디데이 메이커 (/dday)
- Multi-event D-Day counter, sorted by date
- 4 themes, preset events (TOEIC, etc.)
- localStorage persistence

### 11. 사주 & 운세 (/fortune)
- Birth input validation (1920~current year)
- Saju 4 pillars (년주/월주/일주/시주) via 천간지지
- Five elements bar chart, yin/yang balance
- Daily fortune: 5 categories (총운/애정/재물/건강/직장) with star ratings
- Lucky items (color/number/direction/food), zodiac (띠) fortune
- Deterministic daily hash; birth data persisted

### 12. QR코드 생성기 (/qrcode)
- Text/URL/Wi-Fi/phone/email to QR via external API
- Ctrl/Cmd+Enter shortcut, download as blob, history
- onError fallback if API fails

### 13. 글자수 세기 (/charcount)
- Realtime: chars (w/w-o spaces), words, sentences, paragraphs, lines, bytes
- Korean/English/numbers/spaces/special distribution (bar chart)
- Reading time estimate (200 wpm)

### 14. 나이 계산기 (/age-calc)
- Manse-age, Korean-age, 띠, zodiac sign, birthstone
- Days lived, days until next birthday
- Full Feb 30/31 validation via date round-trip

---

## Utilities (3)

### 15. 비밀번호 생성기 (/password)
- Crypto.getRandomValues for secure randomness (lazy init via useEffect — SSR safe)
- Length 4~64 slider
- Options: lowercase, uppercase, numbers, symbols
- Strength meter (4 tiers: 약함/보통/강함/매우 강함)
- 10-item history (session)

### 16. 단위 변환기 (/unit-convert)
- 6 categories: 길이, 무게, 온도, 넓이, 속도, 데이터 (with 평 for Korean users)
- Swap button for quick inversion
- **Persisted:** last-used category

### 17. 밸런스 게임 (/balance)
- 30 either-or questions
- Per-question seeded vote percentages (different for each question)
- Progress bar, result summary, Web Share API

---

## Psych Tests (3)

### 18. 닮은 동물 테스트 (/animal-test)
- 7 questions, 8 animal results (cat/dog/fox/bear/rabbit/eagle/dolphin/owl)
- Score-based with weighted answers
- All 8 animals reachable (verified via simulation)

### 19. 전생 테스트 (/past-life)
- Birth-date hash → 8 past life types (왕족/학자/무사/예술가/상인/치유사/탐험가/수도승)
- Input validation for year/month/day range
- Enter key submits

### 20. 연애 타로 (/tarot)
- 3-card spread: 과거/현재/미래
- 15 major arcana cards shuffled
- Flip animation, love heart rating (1-5)
- Detailed reading + advice per card

---

## Games (7)

### 21. 스네이크 게임 (/snake)
- Classic snake with Canvas rendering
- Arrow keys / swipe / mobile D-pad
- Speed increases with score
- High score persisted
- Mobile-responsive canvas

### 22. 플래피버드 (/flappy)
- Canvas-based Flappy Bird with physics (gravity halved from original)
- **HP system:** 3 hearts, invincibility frames after hit
- **6 items:** 🛡️ shield, ❤️ heal, ⚡ 2x speed, 🐌 slow, 🔹 tiny hitbox, 🧲 magnet (attracts items)
- **Seeds (🌾):** 3 per pipe, currency for shop
- **Shop every 30 pipes:** 5 items (HP+1, wide gap, shield, 2x seeds, revive)
- Instant death on falling off-screen bottom

### 23. 햄스터 키우기 (/hamster)
- **Pixel art hamster** with 5 growth tiers (아기→꼬마→청소년→어른→왕), crown at max
- **4 stats:** hunger, happiness, energy, cleanliness (decay over time)
- Random cage roaming with ref-based smooth easing
- Poop system (max 8), sawdust freshness (decays, turns gray)
- **3 full mini-games:**
  - **Wheel:** hamster walks to wheel → tap rapidly for coins
  - **Ball billiards:** drag to aim, physics-based with wall + obstacle bouncing (SVG)
  - **Swing rhythm:** pendulum, tap at peak for PERFECT/GOOD/MISS grading
  - **Rhythm mic (purchase):** 3-lane falling notes, Perfect/Good/Miss timing
- **30 decorations** across 5 slots (hat/face/neck/back/aura)
- **Shop** with 4 tabs (food, toys, decor, 관리)
- localStorage full state + offline time decay
- Sawdust (180 chips) memoized — only re-renders on ≥2% freshness change

### 24. 2048 (/game2048)
- Classic tile merge puzzle
- **Undo** button (1 level) + Ctrl/Cmd+Z
- Tile spawn + merge animations
- Proper tile colors up to 8192 with glow
- Keep-playing option after 2048
- Restart confirm (2-tap within 3s) if score > 0
- Best score: lazy useState init (race-safe), functional setState

### 25. 한글 워들 (/wordle-kr)
- Daily word puzzle (50 words, all 4 chars)
- **Stats persisted:** played, wins, streak, bestStreak, distribution[6]
- **Today's progress persisted:** guesses + state restored on revisit
- Distribution bar chart with current-win highlight
- IME-safe input handling

### 26. 지뢰찾기 (/minesweeper)
- 3 difficulties: 초급 (9×9/10), 중급 (12×12/30), 고급 (16×16/60)
- First-click safe zone (3×3)
- Flag mode toggle
- **Best time per difficulty** persisted
- "🏆 최고 기록!" on new record

### 27. 틱택토 (/tictactoe)
- Minimax AI with alpha-beta pruning (0 losses on hard in 100 random games)
- Easy mode: 40% random moves
- Win/loss/draw score tracking
- Winning line highlighted

---

## Quality Audit History

Multiple rounds of systematic review covering:
- localStorage try/catch for Safari private mode (all apps)
- Clipboard + share API error handling (all apps with share)
- Timer/interval leak prevention (ref-based cleanup)
- requestAnimationFrame cleanup balance
- Input validation (NaN guards, date round-trip, range checks)
- Mobile responsive canvas scaling
- Event listener cleanup audit (balanced)
- Accessibility (aria-labels on all inputs)
- Console.log/debugger leak check (0 found)
- React key audit (no Math.random keys)
- Race condition fixes (high scores use functional setState)
- Memo optimization (hamster sawdust)
- Dynamic sitemap date
- theme-color meta for mobile browsers
- Korean IME composition handling
