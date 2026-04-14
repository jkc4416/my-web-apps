"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ===== CONSTANTS =====
const DECAY_INTERVAL = 3000;
const DECAY_AMOUNT = 0.4;
const SAVE_KEY = "hamster-save-v4";
const XP_PER_ACTION = 8;
const XP_PER_LEVEL = 100;
const WHEEL_DURATION = 8000;
const TOY_PLAY_DURATION = 6000;
const COIN_PER_TAP = 2;
const CAGE_W = 340;
const CAGE_H = 220;
const POOP_INTERVAL = 25000; // poop every ~25s
const SAWDUST_DECAY_INTERVAL = 5000;
const SAWDUST_DECAY_RATE = 0.3;

const FOODS = [
  { id: "seed", name: "해바라기씨", emoji: "🌻", cost: 0, hunger: 15, happiness: 3 },
  { id: "carrot", name: "당근", emoji: "🥕", cost: 5, hunger: 25, happiness: 5 },
  { id: "cheese", name: "치즈", emoji: "🧀", cost: 10, hunger: 20, happiness: 10 },
  { id: "strawberry", name: "딸기", emoji: "🍓", cost: 15, hunger: 15, happiness: 15 },
  { id: "cake", name: "케이크", emoji: "🍰", cost: 30, hunger: 30, happiness: 25 },
];

const TOYS = [
  { id: "ball", name: "공", emoji: "⚽", cost: 200, happiness: 25, energy: -5 },
  { id: "tunnel", name: "터널", emoji: "🕳️", cost: 350, happiness: 35, energy: -8 },
  { id: "swing", name: "그네", emoji: "🎠", cost: 500, happiness: 45, energy: -10 },
];

const SAWDUST_ITEM = { id: "sawdust", name: "새 톱밥", emoji: "🪵", cost: 15 };

const HAMSTER_NAMES = ["몽실이", "뭉치", "콩이", "도토리", "솜이", "밤이", "쪼꼬", "구름이"];

const MOODS = {
  happy: { face: "😊", msg: "기분 좋아요~!", color: "#fbbf24" },
  love: { face: "😍", msg: "최고예요~! 사랑해요!", color: "#ec4899" },
  eating: { face: "😋", msg: "냠냠 맛있다~!", color: "#f97316" },
  sleepy: { face: "😴", msg: "졸려요... zzZ", color: "#818cf8" },
  sleeping: { face: "💤", msg: "쿨쿨...", color: "#6366f1" },
  hungry: { face: "🥺", msg: "배고파요...", color: "#ef4444" },
  dirty: { face: "😣", msg: "더러워요...", color: "#a3a3a3" },
  sad: { face: "😢", msg: "관심 좀 주세요...", color: "#64748b" },
  playing: { face: "🤩", msg: "신난다~!", color: "#22d3ee" },
  running: { face: "🏃", msg: "달린다~!", color: "#4ade80" },
  clean: { face: "✨", msg: "깨끗해서 기분 좋아요!", color: "#a78bfa" },
  idle: { face: "🐹", msg: "...", color: "#fbbf24" },
};

const TITLES = [
  "아기 햄스터", "꼬마 햄스터", "씩씩한 햄스터", "똑똑한 햄스터",
  "용감한 햄스터", "인기쟁이 햄스터", "슈퍼 햄스터", "전설의 햄스터",
  "우주 햄스터", "신화의 햄스터",
];

const SIZES = [
  { pixel: 4, cols: 7, label: "아기" },
  { pixel: 5, cols: 9, label: "꼬마" },
  { pixel: 5, cols: 11, label: "청소년" },
  { pixel: 6, cols: 11, label: "어른" },
  { pixel: 7, cols: 13, label: "왕" },
];

function getSizeTier(level) {
  if (level < 5) return 0;
  if (level < 10) return 1;
  if (level < 15) return 2;
  if (level < 20) return 3;
  return 4;
}

const SPRITES = [
  { normal: [[0,0,2,0,2,0,0],[0,1,1,1,1,1,0],[1,4,1,5,1,4,1],[1,6,1,1,1,6,1],[0,1,3,3,3,1,0],[0,0,1,0,1,0,0]], sleep: [[0,0,2,0,2,0,0],[0,1,1,1,1,1,0],[1,1,1,5,1,1,1],[1,6,1,1,1,6,1],[0,1,3,3,3,1,0],[0,0,1,0,1,0,0]] },
  { normal: [[0,0,0,2,0,2,0,0,0],[0,0,2,1,1,1,2,0,0],[0,1,1,1,1,1,1,1,0],[0,1,4,1,5,1,4,1,0],[1,1,6,1,1,1,6,1,1],[0,1,1,3,3,3,1,1,0],[0,0,1,3,3,3,1,0,0],[0,0,1,0,0,0,1,0,0]], sleep: [[0,0,0,2,0,2,0,0,0],[0,0,2,1,1,1,2,0,0],[0,1,1,1,1,1,1,1,0],[0,1,1,1,5,1,1,1,0],[1,1,6,1,1,1,6,1,1],[0,1,1,3,3,3,1,1,0],[0,0,1,3,3,3,1,0,0],[0,0,1,0,0,0,1,0,0]] },
  { normal: [[0,0,0,2,2,0,2,2,0,0,0],[0,0,2,2,1,1,1,2,2,0,0],[0,0,1,1,1,1,1,1,1,0,0],[0,1,1,1,1,1,1,1,1,1,0],[0,1,4,1,1,5,1,1,4,1,0],[1,1,6,6,1,1,1,6,6,1,1],[0,1,1,1,3,3,3,1,1,1,0],[0,0,1,3,3,3,3,3,1,0,0],[0,0,0,1,1,0,1,1,0,0,0]], sleep: [[0,0,0,2,2,0,2,2,0,0,0],[0,0,2,2,1,1,1,2,2,0,0],[0,0,1,1,1,1,1,1,1,0,0],[0,1,1,1,1,1,1,1,1,1,0],[0,1,1,1,1,5,1,1,1,1,0],[1,1,6,6,1,1,1,6,6,1,1],[0,1,1,1,3,3,3,1,1,1,0],[0,0,1,3,3,3,3,3,1,0,0],[0,0,0,1,1,0,1,1,0,0,0]] },
  { normal: [[0,0,0,2,2,0,2,2,0,0,0],[0,0,2,2,1,1,1,2,2,0,0],[0,1,1,1,1,1,1,1,1,1,0],[0,1,1,1,1,1,1,1,1,1,0],[1,1,4,4,1,5,1,4,4,1,1],[1,1,6,6,1,1,1,6,6,1,1],[0,1,1,1,1,1,1,1,1,1,0],[0,1,1,3,3,3,3,3,1,1,0],[0,0,1,3,3,3,3,3,1,0,0],[0,0,1,1,0,0,0,1,1,0,0]], sleep: [[0,0,0,2,2,0,2,2,0,0,0],[0,0,2,2,1,1,1,2,2,0,0],[0,1,1,1,1,1,1,1,1,1,0],[0,1,1,1,1,1,1,1,1,1,0],[1,1,1,1,1,5,1,1,1,1,1],[1,1,6,6,1,1,1,6,6,1,1],[0,1,1,1,1,1,1,1,1,1,0],[0,1,1,3,3,3,3,3,1,1,0],[0,0,1,3,3,3,3,3,1,0,0],[0,0,1,1,0,0,0,1,1,0,0]] },
  { normal: [[0,0,0,0,7,0,7,0,7,0,0,0,0],[0,0,0,2,2,0,0,0,2,2,0,0,0],[0,0,2,2,1,1,1,1,1,2,2,0,0],[0,1,1,1,1,1,1,1,1,1,1,1,0],[0,1,1,1,1,1,1,1,1,1,1,1,0],[1,1,4,4,1,1,5,1,1,4,4,1,1],[1,1,6,6,1,1,1,1,1,6,6,1,1],[0,1,1,1,1,1,1,1,1,1,1,1,0],[0,1,1,1,3,3,3,3,3,1,1,1,0],[0,0,1,3,3,3,3,3,3,3,1,0,0],[0,0,0,1,1,0,0,0,1,1,0,0,0]], sleep: [[0,0,0,0,7,0,7,0,7,0,0,0,0],[0,0,0,2,2,0,0,0,2,2,0,0,0],[0,0,2,2,1,1,1,1,1,2,2,0,0],[0,1,1,1,1,1,1,1,1,1,1,1,0],[0,1,1,1,1,1,1,1,1,1,1,1,0],[1,1,1,1,1,1,5,1,1,1,1,1,1],[1,1,6,6,1,1,1,1,1,6,6,1,1],[0,1,1,1,1,1,1,1,1,1,1,1,0],[0,1,1,1,3,3,3,3,3,1,1,1,0],[0,0,1,3,3,3,3,3,3,3,1,0,0],[0,0,0,1,1,0,0,0,1,1,0,0,0]] },
];

const COLORS = { 0: "transparent", 1: "#e8a87c", 2: "#c4844c", 3: "#fde8c8", 4: "#2a1a0a", 5: "#d4836a", 6: "#ffaaaa", 7: "#fbbf24" };

function clamp(v, min = 0, max = 100) { return Math.max(min, Math.min(max, v)); }

function getDefaultState() {
  return {
    name: HAMSTER_NAMES[Math.floor(Math.random() * HAMSTER_NAMES.length)],
    hunger: 80, happiness: 80, energy: 80, cleanliness: 80,
    coins: 10, xp: 0, level: 1, totalActions: 0,
    ownedToys: [], poops: [], sawdustFresh: 100,
    createdAt: Date.now(), lastSaved: Date.now(),
  };
}

function PixelHamster({ tier, sleeping, flip }) {
  const sprite = SPRITES[tier];
  const grid = sleeping ? sprite.sleep : sprite.normal;
  const size = SIZES[tier];
  return (
    <div style={{ display: "inline-grid", gridTemplateColumns: `repeat(${grid[0].length}, ${size.pixel}px)`, transform: flip ? "scaleX(-1)" : "none", imageRendering: "pixelated" }}>
      {grid.flat().map((c, i) => (
        <div key={i} style={{ width: size.pixel, height: size.pixel, background: COLORS[c] || "transparent" }} />
      ))}
    </div>
  );
}

export default function HamsterPage() {
  const [state, setState] = useState(null);
  const [mood, setMood] = useState("idle");
  const [particles, setParticles] = useState([]);
  const [showShop, setShowShop] = useState(false);
  const [shopTab, setShopTab] = useState("food");
  // Wheel
  const [wheelPhase, setWheelPhase] = useState("none");
  const [wheelTaps, setWheelTaps] = useState(0);
  const [wheelTime, setWheelTime] = useState(0);
  // Toy play
  const [toyPhase, setToyPhase] = useState("none"); // none | appearing | approaching | ready | playing
  const [activeToy, setActiveToy] = useState(null);
  // Ball billiards mini-game
  const [ballGame, setBallGame] = useState(null); // null | { phase: "aiming"|"rolling"|"done", ball, goal, obstacles, shots, successful }
  const [toyTaps, setToyTaps] = useState(0);
  const [toyTime, setToyTime] = useState(0);

  const wheelActive = wheelPhase !== "none";
  const toyActive = toyPhase !== "none";
  const ballActive = ballGame !== null;
  const busy = wheelActive || toyActive || ballActive;

  const [isSleeping, setIsSleeping] = useState(false);
  const [bubbleMsg, setBubbleMsg] = useState("");
  const [bounce, setBounce] = useState(false);
  const [nameEditing, setNameEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [hamX, setHamX] = useState(CAGE_W / 2);
  const [hamY, setHamY] = useState(CAGE_H / 2);
  const [hamFlip, setHamFlip] = useState(false);
  const [hamAction, setHamAction] = useState("idle");
  const hamPosRef = useRef({ x: CAGE_W / 2, y: CAGE_H / 2 });
  const moveTimerRef = useRef(null);
  const animRef = useRef(null);
  const wheelTimerRef = useRef(null);
  const toyTimerRef = useRef(null);
  const sleepTimerRef = useRef(null);
  const decayRef = useRef(null);
  const poopTimerRef = useRef(null);
  const sawdustTimerRef = useRef(null);
  const particleId = useRef(0);

  const updatePos = useCallback((x, y) => {
    hamPosRef.current = { x, y };
    setHamX(x); setHamY(y);
  }, []);

  // Load
  useEffect(() => {
    let saved; try { saved = localStorage.getItem(SAVE_KEY); } catch {}
    if (saved) {
      const parsed = JSON.parse(saved);
      const elapsed = (Date.now() - (parsed.lastSaved || Date.now())) / 1000;
      const decayTicks = Math.min(Math.floor(elapsed / 3), 200);
      const decay = decayTicks * DECAY_AMOUNT;
      const sawdustDecay = Math.min(elapsed / 5 * SAWDUST_DECAY_RATE, 100);
      setState({
        ...parsed,
        hunger: clamp((parsed.hunger || 80) - decay * 0.8),
        happiness: clamp((parsed.happiness || 80) - decay * 0.5),
        energy: clamp(Math.min((parsed.energy || 80) + decay * 0.3, 100)),
        cleanliness: clamp((parsed.cleanliness || 80) - decay * 0.6),
        sawdustFresh: clamp((parsed.sawdustFresh ?? 100) - sawdustDecay),
        ownedToys: parsed.ownedToys || [],
        poops: parsed.poops || [],
      });
    } else {
      setState(getDefaultState());
    }
  }, []);

  // Save
  useEffect(() => {
    if (!state) return;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastSaved: Date.now() })); } catch {}
  }, [state]);

  // Animate to position
  const animateTo = useCallback((targetX, targetY, duration, onDone) => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const startX = hamPosRef.current.x;
    const startY = hamPosRef.current.y;
    setHamFlip(targetX < startX);
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      updatePos(startX + (targetX - startX) * ease, startY + (targetY - startY) * ease);
      if (t < 1) animRef.current = requestAnimationFrame(step);
      else { animRef.current = null; if (onDone) onDone(); }
    };
    animRef.current = requestAnimationFrame(step);
  }, [updatePos]);

  // Random movement
  useEffect(() => {
    if (!state || busy || isSleeping) { clearTimeout(moveTimerRef.current); return; }
    const doMove = () => {
      const actions = ["idle", "idle", "walk", "walk", "walk", "sniff", "groom"];
      const action = actions[Math.floor(Math.random() * actions.length)];
      setHamAction(action);
      if (action === "walk") {
        const t = getSizeTier(state.level);
        const spriteW = SPRITES[t].normal[0].length * SIZES[t].pixel;
        const spriteH = SPRITES[t].normal.length * SIZES[t].pixel;
        const margin = 15;
        const targetX = margin + Math.random() * (CAGE_W - spriteW - margin * 2);
        const targetY = CAGE_H * 0.25 + Math.random() * (CAGE_H * 0.45 - spriteH);
        animateTo(targetX, targetY, 1000 + Math.random() * 1500, () => setHamAction("idle"));
      }
      moveTimerRef.current = setTimeout(doMove, 2000 + Math.random() * 3000);
    };
    moveTimerRef.current = setTimeout(doMove, 1500 + Math.random() * 2000);
    return () => { clearTimeout(moveTimerRef.current); if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [state?.level, isSleeping, busy, animateTo]);

  // Stat decay — poop and sawdust affect rates
  useEffect(() => {
    if (!state || isSleeping) return;
    decayRef.current = setInterval(() => {
      setState((s) => {
        const poopPenalty = Math.min(s.poops.length * 0.15, 1.5);
        const sawdustPenalty = s.sawdustFresh < 30 ? (30 - s.sawdustFresh) * 0.02 : 0;
        const extraDecay = poopPenalty + sawdustPenalty;
        return {
          ...s,
          hunger: clamp(s.hunger - DECAY_AMOUNT * 0.8),
          happiness: clamp(s.happiness - DECAY_AMOUNT * 0.5 - extraDecay * 0.3),
          energy: clamp(s.energy - DECAY_AMOUNT * 0.3),
          cleanliness: clamp(s.cleanliness - DECAY_AMOUNT * 0.6 - extraDecay * 0.5),
        };
      });
    }, DECAY_INTERVAL);
    return () => clearInterval(decayRef.current);
  }, [state !== null, isSleeping]);

  // Poop generation
  useEffect(() => {
    if (!state || isSleeping) return;
    poopTimerRef.current = setInterval(() => {
      setState((s) => {
        if (s.poops.length >= 8) return s;
        const newPoop = {
          id: Date.now(),
          x: 15 + Math.random() * (CAGE_W - 40),
          y: CAGE_H * 0.5 + Math.random() * (CAGE_H * 0.25),
        };
        return { ...s, poops: [...s.poops, newPoop] };
      });
    }, POOP_INTERVAL + Math.random() * 10000);
    return () => clearInterval(poopTimerRef.current);
  }, [state !== null, isSleeping]);

  // Sawdust decay
  useEffect(() => {
    if (!state) return;
    sawdustTimerRef.current = setInterval(() => {
      setState((s) => ({ ...s, sawdustFresh: clamp(s.sawdustFresh - SAWDUST_DECAY_RATE) }));
    }, SAWDUST_DECAY_INTERVAL);
    return () => clearInterval(sawdustTimerRef.current);
  }, [state !== null]);

  // Mood
  useEffect(() => {
    if (!state) return;
    if (isSleeping) { setMood("sleeping"); return; }
    if (wheelActive) { setMood("running"); return; }
    if (toyActive && toyPhase === "playing") { setMood("playing"); return; }
    const avg = (state.hunger + state.happiness + state.energy + state.cleanliness) / 4;
    if (state.poops.length >= 4) setMood("dirty");
    else if (avg > 85) setMood("love");
    else if (state.hunger < 20) setMood("hungry");
    else if (state.cleanliness < 20) setMood("dirty");
    else if (state.energy < 20) setMood("sleepy");
    else if (state.happiness < 20) setMood("sad");
    else if (avg > 60) setMood("happy");
    else setMood("idle");
  }, [state, isSleeping, wheelActive, toyActive, toyPhase]);

  const spawnParticles = useCallback((emoji, count = 5) => {
    const newP = Array.from({ length: count }, () => ({
      id: ++particleId.current, emoji,
      x: 40 + Math.random() * 20, y: 20 + Math.random() * 20,
      dx: (Math.random() - 0.5) * 60, dy: -(30 + Math.random() * 40),
    }));
    setParticles((p) => [...p, ...newP]);
    setTimeout(() => setParticles((p) => p.filter((pp) => !newP.find((np) => np.id === pp.id))), 1200);
  }, []);

  const showBubble = useCallback((msg) => { setBubbleMsg(msg); setTimeout(() => setBubbleMsg(""), 2000); }, []);
  const doBounce = useCallback(() => { setBounce(true); setTimeout(() => setBounce(false), 500); }, []);

  const gainXP = useCallback((amount) => {
    setState((s) => {
      const newXP = s.xp + amount;
      const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
      if (newLevel > s.level) { showBubble(`🎉 레벨 ${newLevel} 달성! 햄스터가 커졌어요!`); spawnParticles("⭐", 8); }
      return { ...s, xp: newXP, level: newLevel, totalActions: s.totalActions + 1 };
    });
  }, [showBubble, spawnParticles]);

  // ===== ACTIONS =====
  const feed = useCallback((food) => {
    if (!state || isSleeping || busy) return;
    if (state.coins < food.cost) { showBubble("코인이 부족해요!"); return; }
    if (state.hunger > 95) { showBubble("배가 불러요~"); return; }
    setMood("eating");
    setState((s) => ({ ...s, hunger: clamp(s.hunger + food.hunger), happiness: clamp(s.happiness + food.happiness), coins: s.coins - food.cost }));
    spawnParticles(food.emoji, 4); showBubble(MOODS.eating.msg); doBounce(); gainXP(XP_PER_ACTION);
    setShowShop(false);
    setTimeout(() => setMood("happy"), 1500);
  }, [state, isSleeping, busy, spawnParticles, showBubble, doBounce, gainXP]);

  // Buy toy (permanent)
  const buyToy = useCallback((toy) => {
    if (!state || state.coins < toy.cost) { showBubble("코인이 부족해요!"); return; }
    setState((s) => ({ ...s, coins: s.coins - toy.cost, ownedToys: [...s.ownedToys, toy.id] }));
    showBubble(`${toy.emoji} ${toy.name} 구매 완료! 영구 소유!`);
    spawnParticles(toy.emoji, 5);
  }, [state, showBubble, spawnParticles]);

  // Play with owned toy
  const playToy = useCallback((toy) => {
    if (!state || isSleeping || busy) return;
    if (state.energy < 10) { showBubble("너무 피곤해요..."); return; }
    // Ball → billiards mini-game
    if (toy.id === "ball") {
      const level = state.level;
      // Difficulty scales: 1-3 obstacles based on level
      const obstacleCount = Math.min(1 + Math.floor(level / 3), 4);
      const obstacles = [];
      for (let i = 0; i < obstacleCount; i++) {
        // Place in middle area, avoiding ball start and goal zones
        const w = 14 + Math.random() * 10;
        const h = 14 + Math.random() * 10;
        const x = CAGE_W * 0.3 + Math.random() * (CAGE_W * 0.4 - w);
        const y = CAGE_H * 0.2 + Math.random() * (CAGE_H * 0.5 - h);
        obstacles.push({ x, y, w, h });
      }
      const goalX = CAGE_W - 40 - Math.random() * 20;
      const goalY = 30 + Math.random() * (CAGE_H * 0.6);
      setActiveToy(toy);
      setBallGame({
        phase: "aiming",
        ball: { x: 40, y: CAGE_H * 0.4, vx: 0, vy: 0 },
        goal: { x: goalX, y: goalY, r: 14 },
        obstacles,
        shots: 3,
        shotsUsed: 0,
        successful: false,
      });
      showBubble("⚽ 공을 드래그해서 골인시켜봐!");
      return;
    }
    setActiveToy(toy);
    setToyPhase("appearing");
    showBubble(`${toy.emoji} ${toy.name}이다!`);

    setTimeout(() => {
      setToyPhase("approaching");
      setHamFlip(false);
      const t = getSizeTier(state.level);
      const spriteH = SPRITES[t].normal.length * SIZES[t].pixel;
      // Toy position: left-center of cage
      const toyX = 60;
      const toyY = CAGE_H * 0.4;
      animateTo(toyX + 20, toyY + 10 - spriteH / 2, 1000, () => {
        setToyPhase("ready");
        showBubble("놀자~! 아래 버튼을 눌러주세요!");
      });
    }, 500);
  }, [state, isSleeping, busy, showBubble, animateTo]);

  const startPlaying = useCallback(() => {
    if (toyPhase !== "ready") return;
    setToyPhase("playing");
    setToyTaps(0);
    setToyTime(TOY_PLAY_DURATION);
    showBubble("신난다~! 🤩");
    const start = Date.now();
    toyTimerRef.current = setInterval(() => {
      const remaining = TOY_PLAY_DURATION - (Date.now() - start);
      if (remaining <= 0) {
        clearInterval(toyTimerRef.current);
        setToyTime(0);
        setState((s) => ({
          ...s,
          happiness: clamp(s.happiness + activeToy.happiness),
          energy: clamp(s.energy + activeToy.energy),
        }));
        showBubble("재밌었다~! 😊");
        spawnParticles("⭐", 5);
        gainXP(XP_PER_ACTION * 2);
        setTimeout(() => {
          setToyPhase("none");
          setActiveToy(null);
          const t = getSizeTier(state.level);
          const spriteW = SPRITES[t].normal[0].length * SIZES[t].pixel;
          const wanderX = 15 + Math.random() * (CAGE_W * 0.5 - spriteW);
          const wanderY = CAGE_H * 0.3 + Math.random() * (CAGE_H * 0.3);
          animateTo(wanderX, wanderY, 1200, () => setHamAction("idle"));
        }, 1200);
      } else { setToyTime(remaining); }
    }, 100);
  }, [toyPhase, activeToy, showBubble, spawnParticles, gainXP, state, animateTo]);

  const tapToy = useCallback(() => {
    if (toyPhase !== "playing") return;
    setToyTaps((t) => t + 1); doBounce();
  }, [toyPhase, doBounce]);

  const sleep = useCallback(() => {
    if (!state || busy) return;
    if (state.energy > 90) { showBubble("아직 안 졸려요~"); return; }
    setIsSleeping(true); showBubble(MOODS.sleeping.msg); spawnParticles("💤", 3);
    if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    sleepTimerRef.current = setInterval(() => {
      setState((s) => {
        if (s.energy >= 100) {
          clearInterval(sleepTimerRef.current); sleepTimerRef.current = null;
          setIsSleeping(false); setMood("happy");
          showBubble("푹 잤어요! 상쾌~!"); spawnParticles("☀️", 5);
          return { ...s, energy: 100 };
        }
        return { ...s, energy: clamp(s.energy + 2) };
      });
    }, 500);
    gainXP(XP_PER_ACTION);
  }, [state, busy, spawnParticles, showBubble, gainXP]);

  const clean = useCallback(() => {
    if (!state || isSleeping || busy) return;
    if (state.cleanliness > 90) { showBubble("이미 깨끗해요~"); return; }
    setMood("clean");
    setState((s) => ({ ...s, cleanliness: clamp(s.cleanliness + 35), happiness: clamp(s.happiness + 5) }));
    spawnParticles("🫧", 6); showBubble(MOODS.clean.msg); doBounce(); gainXP(XP_PER_ACTION);
    setTimeout(() => setMood("happy"), 1500);
  }, [state, isSleeping, busy, spawnParticles, showBubble, doBounce, gainXP]);

  // Clean poop
  const cleanPoop = useCallback((poopId) => {
    setState((s) => ({ ...s, poops: s.poops.filter((p) => p.id !== poopId), cleanliness: clamp(s.cleanliness + 3), happiness: clamp(s.happiness + 1) }));
    spawnParticles("✨", 2);
  }, [spawnParticles]);

  // Buy sawdust
  const changeSawdust = useCallback(() => {
    if (!state) return;
    if (state.coins < SAWDUST_ITEM.cost) { showBubble("코인이 부족해요!"); return; }
    setState((s) => ({ ...s, sawdustFresh: 100, coins: s.coins - SAWDUST_ITEM.cost }));
    showBubble("새 톱밥으로 교체! ✨"); spawnParticles("🪵", 4); gainXP(XP_PER_ACTION);
  }, [state, showBubble, spawnParticles, gainXP]);

  // Wheel
  const WHEEL_X = CAGE_W - 80;
  const WHEEL_Y = CAGE_H * 0.35;
  const WHEEL_SIZE = 64;

  const startWheel = useCallback(() => {
    if (!state || isSleeping || busy) return;
    if (state.energy < 15) { showBubble("너무 피곤해요..."); return; }
    setWheelPhase("appearing"); showBubble("오! 쳇바퀴다!");
    setTimeout(() => {
      setWheelPhase("approaching"); setHamFlip(false);
      const t = getSizeTier(state.level);
      const spriteH = SPRITES[t].normal.length * SIZES[t].pixel;
      animateTo(WHEEL_X - 20, WHEEL_Y + WHEEL_SIZE / 2 - spriteH / 2, 1000, () => {
        setWheelPhase("ready"); showBubble("준비 완료! 아래 버튼을 눌러주세요!");
      });
    }, 600);
  }, [state, isSleeping, busy, showBubble, animateTo, WHEEL_X, WHEEL_Y, WHEEL_SIZE]);

  const startRunning = useCallback(() => {
    if (wheelPhase !== "ready") return;
    setWheelPhase("running"); setWheelTaps(0); setWheelTime(WHEEL_DURATION);
    showBubble("빨리 눌러요! 🏃");
    const start = Date.now();
    wheelTimerRef.current = setInterval(() => {
      const remaining = WHEEL_DURATION - (Date.now() - start);
      if (remaining <= 0) {
        clearInterval(wheelTimerRef.current); setWheelPhase("finishing"); setWheelTime(0);
        setWheelTaps((taps) => {
          const earned = Math.floor(taps * COIN_PER_TAP);
          setState((s) => ({ ...s, coins: s.coins + earned, energy: clamp(s.energy - 15), happiness: clamp(s.happiness + 10) }));
          showBubble(`🎉 ${earned} 코인 획득!`); spawnParticles("🪙", 8); gainXP(XP_PER_ACTION * 2);
          return 0;
        });
        setTimeout(() => {
          setWheelPhase("none");
          const t = getSizeTier(state.level);
          const spriteW = SPRITES[t].normal[0].length * SIZES[t].pixel;
          animateTo(15 + Math.random() * (CAGE_W * 0.5 - spriteW), CAGE_H * 0.3 + Math.random() * CAGE_H * 0.3, 1200, () => setHamAction("idle"));
        }, 1500);
      } else { setWheelTime(remaining); }
    }, 100);
  }, [wheelPhase, showBubble, spawnParticles, gainXP, state, animateTo]);

  const tapWheel = useCallback(() => {
    if (wheelPhase !== "running") return;
    setWheelTaps((t) => t + 1); doBounce();
  }, [wheelPhase, doBounce]);

  const petHamster = useCallback(() => {
    if (isSleeping || busy) return;
    setState((s) => ({ ...s, happiness: clamp(s.happiness + 2) }));
    spawnParticles("❤️", 3); doBounce();
  }, [isSleeping, busy, spawnParticles, doBounce]);

  const saveName = useCallback(() => { if (nameInput.trim()) setState((s) => ({ ...s, name: nameInput.trim() })); setNameEditing(false); }, [nameInput]);

  const resetGame = useCallback(() => {
    try { localStorage.removeItem(SAVE_KEY); } catch {}
    if (sleepTimerRef.current) { clearInterval(sleepTimerRef.current); sleepTimerRef.current = null; }
    if (wheelTimerRef.current) { clearInterval(wheelTimerRef.current); wheelTimerRef.current = null; }
    if (toyTimerRef.current) { clearInterval(toyTimerRef.current); toyTimerRef.current = null; }
    setState(getDefaultState()); setIsSleeping(false); setWheelPhase("none"); setToyPhase("none"); setShowShop(false); setBallGame(null);
    updatePos(CAGE_W / 2, CAGE_H / 2);
    showBubble("새 햄스터를 입양했어요!"); spawnParticles("🎀", 6);
  }, [showBubble, spawnParticles, updatePos]);

  // ===== BILLIARDS BALL MINI-GAME =====
  const BALL_R = 8;
  const BALL_FRICTION = 0.97;
  const BALL_STOP = 0.15;
  const ballRafRef = useRef(null);
  const ballAimRef = useRef(null); // {startX, startY, curX, curY}
  const [, forceRender] = useState(0);

  const endBallGame = useCallback((success, firstTry) => {
    setBallGame((g) => g ? { ...g, phase: "done", successful: success } : null);
    if (success) {
      const bonusCoin = firstTry ? 15 : 8;
      const bonusXP = firstTry ? XP_PER_ACTION * 3 : XP_PER_ACTION * 2;
      setState((s) => ({
        ...s,
        happiness: clamp(s.happiness + (firstTry ? 40 : 25)),
        energy: clamp(s.energy - 5),
        coins: s.coins + bonusCoin,
      }));
      showBubble(firstTry ? `🎯 원샷 성공! +${bonusCoin}🪙` : `⚽ 성공! +${bonusCoin}🪙`);
      spawnParticles(firstTry ? "⭐" : "✨", firstTry ? 10 : 6);
      gainXP(bonusXP);
    } else {
      setState((s) => ({ ...s, happiness: clamp(s.happiness + 8), energy: clamp(s.energy - 3) }));
      showBubble("아쉬워요... 다음엔 성공!");
      spawnParticles("💨", 3);
      gainXP(XP_PER_ACTION);
    }
    setTimeout(() => { setBallGame(null); setActiveToy(null); }, 1800);
  }, [showBubble, spawnParticles, gainXP]);

  const ballPhysicsStep = useCallback(() => {
    setBallGame((g) => {
      if (!g || g.phase !== "rolling") return g;
      const ball = { ...g.ball };
      ball.x += ball.vx;
      ball.y += ball.vy;
      ball.vx *= BALL_FRICTION;
      ball.vy *= BALL_FRICTION;

      // Wall bouncing (use 15% damping on walls for realism)
      if (ball.x - BALL_R < 5) { ball.x = 5 + BALL_R; ball.vx = -ball.vx * 0.85; }
      if (ball.x + BALL_R > CAGE_W - 5) { ball.x = CAGE_W - 5 - BALL_R; ball.vx = -ball.vx * 0.85; }
      if (ball.y - BALL_R < 5) { ball.y = 5 + BALL_R; ball.vy = -ball.vy * 0.85; }
      if (ball.y + BALL_R > CAGE_H - 5) { ball.y = CAGE_H - 5 - BALL_R; ball.vy = -ball.vy * 0.85; }

      // Obstacle collisions (AABB with closest-point resolution)
      for (const ob of g.obstacles) {
        const closestX = Math.max(ob.x, Math.min(ball.x, ob.x + ob.w));
        const closestY = Math.max(ob.y, Math.min(ball.y, ob.y + ob.h));
        const dx = ball.x - closestX;
        const dy = ball.y - closestY;
        const distSq = dx * dx + dy * dy;
        if (distSq < BALL_R * BALL_R) {
          // Resolve: push out along normal, reflect velocity
          const dist = Math.sqrt(distSq) || 0.01;
          const nx = dx / dist;
          const ny = dy / dist;
          const penetration = BALL_R - dist;
          ball.x += nx * penetration;
          ball.y += ny * penetration;
          const vdotn = ball.vx * nx + ball.vy * ny;
          ball.vx = (ball.vx - 2 * vdotn * nx) * 0.85;
          ball.vy = (ball.vy - 2 * vdotn * ny) * 0.85;
        }
      }

      // Goal check
      const gdx = ball.x - g.goal.x;
      const gdy = ball.y - g.goal.y;
      if (Math.sqrt(gdx * gdx + gdy * gdy) < g.goal.r) {
        setTimeout(() => endBallGame(true, g.shotsUsed === 1), 0);
        return { ...g, ball, phase: "done", successful: true };
      }

      // Stopped?
      const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      if (speed < BALL_STOP) {
        ball.vx = 0; ball.vy = 0;
        if (g.shotsUsed >= g.shots) {
          setTimeout(() => endBallGame(false, false), 0);
          return { ...g, ball, phase: "done" };
        }
        return { ...g, ball, phase: "aiming" };
      }
      return { ...g, ball };
    });
  }, [endBallGame]);

  // Ball physics loop
  useEffect(() => {
    if (!ballGame || ballGame.phase !== "rolling") return;
    const loop = () => {
      ballPhysicsStep();
      ballRafRef.current = requestAnimationFrame(loop);
    };
    ballRafRef.current = requestAnimationFrame(loop);
    return () => { if (ballRafRef.current) cancelAnimationFrame(ballRafRef.current); };
  }, [ballGame?.phase, ballPhysicsStep]);

  // Ball aim pointer handlers (attach to cage element in render)
  const getCagePoint = (e, cageEl) => {
    const rect = cageEl.getBoundingClientRect();
    const scaleX = CAGE_W / rect.width;
    const scaleY = CAGE_H / rect.height;
    const cx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const cy = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    return { x: cx * scaleX, y: cy * scaleY };
  };

  const ballPointerDown = useCallback((e) => {
    if (!ballGame || ballGame.phase !== "aiming") return;
    const cageEl = e.currentTarget;
    const p = getCagePoint(e, cageEl);
    const dx = p.x - ballGame.ball.x;
    const dy = p.y - ballGame.ball.y;
    // Allow clicking anywhere — drag sets direction
    ballAimRef.current = { startX: p.x, startY: p.y, curX: p.x, curY: p.y, cageEl };
    forceRender((n) => n + 1);
    e.preventDefault();
  }, [ballGame]);

  const ballPointerMove = useCallback((e) => {
    if (!ballAimRef.current || !ballGame || ballGame.phase !== "aiming") return;
    const p = getCagePoint(e, ballAimRef.current.cageEl);
    ballAimRef.current.curX = p.x;
    ballAimRef.current.curY = p.y;
    forceRender((n) => n + 1);
    e.preventDefault();
  }, [ballGame]);

  const ballPointerUp = useCallback(() => {
    if (!ballAimRef.current || !ballGame || ballGame.phase !== "aiming") return;
    const aim = ballAimRef.current;
    // Launch: direction = from startPoint → currentPoint (natural slingshot from start)
    // We treat start as anchor; ball launches in the drag direction from start
    const dx = aim.curX - aim.startX;
    const dy = aim.curY - aim.startY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    ballAimRef.current = null;
    if (dist < 8) { forceRender((n) => n + 1); return; } // too small, cancel
    // Power proportional to drag distance, capped
    const maxPower = 12;
    const power = Math.min(dist / 12, maxPower);
    const vx = (dx / dist) * power;
    const vy = (dy / dist) * power;
    setBallGame((g) => g ? { ...g, phase: "rolling", ball: { ...g.ball, vx, vy }, shotsUsed: g.shotsUsed + 1 } : null);
  }, [ballGame]);

  if (!state) return null;

  const moodData = MOODS[mood] || MOODS.idle;
  const overallHealth = Math.round((state.hunger + state.happiness + state.energy + state.cleanliness) / 4);
  const xpInLevel = state.xp % XP_PER_LEVEL;
  const title = TITLES[Math.min(state.level - 1, TITLES.length - 1)];
  const tier = getSizeTier(state.level);
  const spriteInfo = SIZES[tier];
  // Sawdust color interpolation: fresh=#c4a86c, dirty=#888
  const sawdustR = Math.round(196 - (100 - state.sawdustFresh) * 0.68);
  const sawdustG = Math.round(168 - (100 - state.sawdustFresh) * 0.32);
  const sawdustB = Math.round(108 + (100 - state.sawdustFresh) * 0.28);
  const sawdustColor = `rgb(${sawdustR},${sawdustG},${sawdustB})`;

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: "radial-gradient(ellipse at 50% 30%, #2a1810 0%, #1a0e08 40%, #0c0604 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>

      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{ color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(12px)" }}>← 홈</Link>

      <div className="fixed inset-0 pointer-events-none z-40">
        {particles.map((p) => (
          <span key={p.id} className="absolute text-2xl" style={{ left: `${p.x}%`, top: `${p.y}%`, animation: "particleFly 1.2s ease-out forwards", "--dx": `${p.dx}px`, "--dy": `${p.dy}px` }}>{p.emoji}</span>
        ))}
      </div>

      <style>{`
        @keyframes particleFly { 0% { opacity:1; transform:translate(0,0) scale(1); } 100% { opacity:0; transform:translate(var(--dx),var(--dy)) scale(0.3); } }
        @keyframes hamsterBounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
        @keyframes hamsterWalk { 0%,100% { transform:translateY(0); } 25% { transform:translateY(-3px); } 75% { transform:translateY(1px); } }
        @keyframes hamsterSniff { 0%,100% { transform:rotate(0); } 25% { transform:rotate(-5deg); } 75% { transform:rotate(5deg); } }
        @keyframes hamsterSleep { 0%,100% { transform:translateY(0); } 50% { transform:translateY(2px); } }
        @keyframes zzz { 0% { opacity:0; transform:translateY(0) scale(0.5); } 50% { opacity:1; transform:translateY(-20px) scale(1); } 100% { opacity:0; transform:translateY(-40px) scale(0.5); } }
        @keyframes bubbleIn { 0% { opacity:0; transform:translateY(8px) scale(0.8); } 100% { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes glow { 0%,100% { box-shadow:0 0 20px rgba(251,191,36,0.05); } 50% { box-shadow:0 0 30px rgba(251,191,36,0.12); } }
        @keyframes wheelSpin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes toyBob { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-4px); } }
        @keyframes poopAppear { from { transform:scale(0); } to { transform:scale(1); } }
      `}</style>

      <div className="max-w-[420px] mx-auto px-4 pb-8">
        {/* Header */}
        <div className="pt-14 pb-2 flex items-center justify-between">
          <div>
            {nameEditing ? (
              <div className="flex items-center gap-2">
                <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} maxLength={8} autoFocus onKeyDown={(e) => e.key === "Enter" && saveName()} aria-label="햄스터 이름" className="bg-transparent border-b border-amber-500/50 text-lg font-black text-amber-300 w-28 outline-none" />
                <button onClick={saveName} className="text-xs text-amber-400">확인</button>
              </div>
            ) : (
              <button onClick={() => { setNameEditing(true); setNameInput(state.name); }} className="group">
                <h1 className="text-2xl font-black" style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{state.name}</h1>
                <span className="text-[10px] group-hover:opacity-100 opacity-0 transition-opacity" style={{ color: "rgba(255,255,255,.2)" }}>탭하여 이름 변경</span>
              </button>
            )}
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.15)", color: "#fbbf24" }}>Lv.{state.level}</span>
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,.25)" }}>{title} · {spriteInfo.label}</span>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
            <span className="text-lg">🪙</span>
            <span className="text-sm font-bold tabular-nums ml-1 text-amber-300">{state.coins}</span>
          </div>
        </div>

        {/* XP */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] mb-1" style={{ color: "rgba(255,255,255,.2)" }}><span>EXP</span><span>{xpInLevel} / {XP_PER_LEVEL}</span></div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.04)" }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(xpInLevel / XP_PER_LEVEL) * 100}%`, background: "linear-gradient(90deg, #fbbf24, #f59e0b)" }} />
          </div>
        </div>

        {/* ===== CAGE ===== */}
        <div
          className="relative rounded-3xl mb-4 overflow-hidden"
          style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", animation: "glow 4s ease-in-out infinite", height: CAGE_H + 80, touchAction: ballActive ? "none" : "auto", cursor: ballActive && ballGame?.phase === "aiming" ? "crosshair" : "default" }}
          onMouseDown={ballActive ? ballPointerDown : undefined}
          onMouseMove={ballActive ? ballPointerMove : undefined}
          onMouseUp={ballActive ? ballPointerUp : undefined}
          onMouseLeave={ballActive ? ballPointerUp : undefined}
          onTouchStart={ballActive ? ballPointerDown : undefined}
          onTouchMove={ballActive ? ballPointerMove : undefined}
          onTouchEnd={ballActive ? ballPointerUp : undefined}
        >

          {/* Sawdust bedding — covers entire cage like a real hamster home */}
          <div className="absolute inset-0 rounded-3xl" style={{ background: `${sawdustColor}08` }} />
          <div className="absolute bottom-0 left-0 right-0" style={{ height: "70%", background: `linear-gradient(to top, ${sawdustColor}18, ${sawdustColor}0a, transparent)` }} />
          {/* Dense sawdust chips — spread across entire cage */}
          {Array.from({ length: 140 }).map((_, i) => {
            const isDirty = (i * 31 + 7) % 100 > state.sawdustFresh;
            const seed = i * 17 + 3;
            const x = (seed * 7.3) % 97;
            const yPct = (seed * 3.7) % 85 + 8; // 8%~93% of cage height
            const w = 3 + (seed % 5);
            const h = 1.5 + (seed % 3) * 0.5;
            const rot = (seed * 13) % 180;
            // Bottom-heavy opacity: denser at bottom, sparser at top
            const depthFade = 0.5 + (yPct / 100) * 0.5;
            const baseAlpha = (0.08 + (seed % 4) * 0.025) * depthFade;
            const freshColor = `rgba(${sawdustR},${sawdustG},${sawdustB},${baseAlpha})`;
            const dirtyAlpha = (0.06 + (seed % 3) * 0.02) * depthFade;
            const dirtyColor = `rgba(${90 + (seed % 20)},${85 + (seed % 15)},${80 + (seed % 10)},${dirtyAlpha})`;
            return <div key={i} className="absolute" style={{ width: w, height: h, borderRadius: 1, background: isDirty ? dirtyColor : freshColor, left: `${x}%`, top: `${yPct}%`, transform: `rotate(${rot}deg)` }} />;
          })}
          {/* Bigger sawdust clumps — also spread across whole cage */}
          {Array.from({ length: 40 }).map((_, i) => {
            const isDirty = (i * 43 + 11) % 100 > state.sawdustFresh;
            const seed = i * 23 + 5;
            const x = (seed * 4.7) % 92 + 2;
            const yPct = (seed * 2.9) % 80 + 12;
            const w = 5 + (seed % 5);
            const h = 2 + (seed % 3);
            const rot = (seed * 9) % 160;
            const depthFade = 0.4 + (yPct / 100) * 0.6;
            const freshColor = `rgba(${sawdustR - 10},${sawdustG - 5},${sawdustB - 15},${(0.1 + (seed % 3) * 0.03) * depthFade})`;
            const dirtyColor = `rgba(${80 + (seed % 15)},${78 + (seed % 12)},${75 + (seed % 10)},${(0.08 + (seed % 3) * 0.025) * depthFade})`;
            return <div key={`clump${i}`} className="absolute" style={{ width: w, height: h, borderRadius: 2, background: isDirty ? dirtyColor : freshColor, left: `${x}%`, top: `${yPct}%`, transform: `rotate(${rot}deg)` }} />;
          })}

          {/* Sawdust freshness indicator */}
          <div className="absolute bottom-1 right-2 text-[9px] flex items-center gap-1" style={{ color: state.sawdustFresh > 50 ? "rgba(255,255,255,.12)" : state.sawdustFresh > 20 ? "rgba(255,200,100,.25)" : "rgba(255,100,100,.35)" }}>
            🪵 {Math.round(state.sawdustFresh)}%
          </div>

          {/* Water bottle */}
          <div className="absolute top-4 left-4 text-xl opacity-[0.12]">🍶</div>

          {/* Wheel (idle faint) */}
          {wheelPhase === "none" && !toyActive && <div className="absolute top-4 right-4 opacity-[0.06]"><div className="w-10 h-10 rounded-full border-2 border-white" /></div>}

          {/* Wheel (active) */}
          {wheelPhase !== "none" && (
            <div className="absolute z-5" style={{ right: 24, top: WHEEL_Y - 8, transition: "opacity 0.5s", opacity: wheelPhase === "appearing" ? 0.5 : 1 }}>
              <div className="absolute" style={{ width: 4, height: WHEEL_SIZE + 16, background: "rgba(180,140,100,0.25)", borderRadius: 2, left: WHEEL_SIZE / 2 - 2 }} />
              <div className="rounded-full flex items-center justify-center" style={{ width: WHEEL_SIZE, height: WHEEL_SIZE, border: "3px solid rgba(251,191,36,0.35)", background: "rgba(251,191,36,0.04)", animation: wheelPhase === "running" ? `wheelSpin ${Math.max(0.1, 0.6 - wheelTaps * 0.005)}s linear infinite` : "none", boxShadow: wheelPhase === "running" ? "0 0 20px rgba(251,191,36,0.15)" : "none" }}>
                {[0, 45, 90, 135].map((deg) => <div key={deg} className="absolute" style={{ width: 1, height: WHEEL_SIZE - 10, background: "rgba(251,191,36,0.15)", transform: `rotate(${deg}deg)` }} />)}
                <div className="rounded-full" style={{ width: 8, height: 8, background: "rgba(251,191,36,0.4)" }} />
              </div>
              <div className="absolute" style={{ width: WHEEL_SIZE + 8, height: 4, background: "rgba(180,140,100,0.2)", borderRadius: 2, left: -4, top: WHEEL_SIZE + 12 }} />
            </div>
          )}

          {/* Toy (active) */}
          {toyActive && activeToy && (
            <div className="absolute z-5 text-3xl" style={{ left: 55, top: CAGE_H * 0.38, animation: toyPhase === "playing" ? "toyBob 0.4s ease infinite" : "none", transition: "opacity 0.5s", opacity: toyPhase === "appearing" ? 0.5 : 1 }}>
              {activeToy.emoji}
            </div>
          )}

          {/* ===== BILLIARDS BALL MINI-GAME ===== */}
          {ballGame && (
            <>
              {/* Overlay to show SVG-based game scaled to CAGE_W/CAGE_H */}
              <svg viewBox={`0 0 ${CAGE_W} ${CAGE_H + 80}`} preserveAspectRatio="none" className="absolute inset-0 z-20 pointer-events-none" style={{ width: "100%", height: "100%" }}>
                {/* Obstacles */}
                {ballGame.obstacles.map((ob, i) => (
                  <rect key={i} x={ob.x} y={ob.y} width={ob.w} height={ob.h} rx="3" fill="rgba(120,80,200,0.25)" stroke="rgba(168,85,247,0.5)" strokeWidth="1.5" />
                ))}
                {/* Goal (glowing hole) */}
                <circle cx={ballGame.goal.x} cy={ballGame.goal.y} r={ballGame.goal.r + 4} fill="none" stroke="rgba(74,222,128,0.3)" strokeWidth="2">
                  <animate attributeName="r" values={`${ballGame.goal.r + 4};${ballGame.goal.r + 10};${ballGame.goal.r + 4}`} dur="1.5s" repeatCount="indefinite" />
                </circle>
                <circle cx={ballGame.goal.x} cy={ballGame.goal.y} r={ballGame.goal.r} fill="rgba(74,222,128,0.2)" stroke="#4ade80" strokeWidth="2" />
                <text x={ballGame.goal.x} y={ballGame.goal.y + 4} textAnchor="middle" fontSize="12" fill="#4ade80" fontWeight="bold">🎯</text>

                {/* Aim line (while dragging) */}
                {ballGame.phase === "aiming" && ballAimRef.current && (() => {
                  const aim = ballAimRef.current;
                  const dx = aim.curX - aim.startX;
                  const dy = aim.curY - aim.startY;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  if (dist < 5) return null;
                  const power = Math.min(dist / 12, 12);
                  const powerPct = (power / 12) * 100;
                  const lineLen = Math.min(dist, 80);
                  const endX = ballGame.ball.x + (dx / dist) * lineLen;
                  const endY = ballGame.ball.y + (dy / dist) * lineLen;
                  const powerColor = powerPct > 80 ? "#ef4444" : powerPct > 50 ? "#fbbf24" : "#4ade80";
                  return (
                    <>
                      <line x1={ballGame.ball.x} y1={ballGame.ball.y} x2={endX} y2={endY} stroke={powerColor} strokeWidth="2" strokeDasharray="4 3" opacity="0.8" />
                      <polygon points={`${endX},${endY} ${endX - (dx / dist) * 8 - (dy / dist) * 4},${endY - (dy / dist) * 8 + (dx / dist) * 4} ${endX - (dx / dist) * 8 + (dy / dist) * 4},${endY - (dy / dist) * 8 - (dx / dist) * 4}`} fill={powerColor} opacity="0.8" />
                    </>
                  );
                })()}

                {/* Ball */}
                <circle cx={ballGame.ball.x} cy={ballGame.ball.y} r={BALL_R + 2} fill="rgba(251,191,36,0.3)" />
                <circle cx={ballGame.ball.x} cy={ballGame.ball.y} r={BALL_R} fill="url(#ballGrad)" stroke="#f59e0b" strokeWidth="1" />
                <defs>
                  <radialGradient id="ballGrad" cx="30%" cy="30%">
                    <stop offset="0%" stopColor="#fde68a" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </radialGradient>
                </defs>
              </svg>

              {/* HUD */}
              <div className="absolute top-3 left-3 z-30 px-2.5 py-1 rounded-lg text-[10px] font-bold pointer-events-none" style={{ background: "rgba(0,0,0,0.4)", color: "#fff", backdropFilter: "blur(6px)" }}>
                🎯 {ballGame.shots - ballGame.shotsUsed}/{ballGame.shots}샷
              </div>
              {ballGame.phase === "aiming" && ballGame.shotsUsed === 0 && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-full text-[10px] pointer-events-none" style={{ background: "rgba(168,85,247,0.2)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.3)" }}>
                  공을 드래그해서 방향·파워 조절
                </div>
              )}
              {ballGame.phase === "done" && (
                <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                  <div className="px-4 py-2 rounded-xl text-center" style={{ background: ballGame.successful ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.15)", border: `1px solid ${ballGame.successful ? "rgba(74,222,128,0.4)" : "rgba(248,113,113,0.3)"}`, backdropFilter: "blur(8px)" }}>
                    <div className="text-2xl">{ballGame.successful ? "🎉" : "😢"}</div>
                    <div className="text-[11px] font-bold" style={{ color: ballGame.successful ? "#4ade80" : "#f87171" }}>{ballGame.successful ? "골인!" : "실패..."}</div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Poops — clickable to clean */}
          {state.poops.map((poop) => (
            <button key={poop.id} onClick={() => cleanPoop(poop.id)} className="absolute cursor-pointer hover:scale-125 transition-transform active:scale-90 z-10" style={{ left: poop.x, top: poop.y, animation: "poopAppear 0.3s ease", fontSize: 14 }} title="탭하여 치우기">
              💩
            </button>
          ))}

          {/* Speech Bubble */}
          {bubbleMsg && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-2xl text-[13px] font-medium whitespace-nowrap" style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.7)", animation: "bubbleIn 0.3s ease-out", backdropFilter: "blur(8px)" }}>
              {bubbleMsg}
            </div>
          )}

          {/* ZZZ */}
          {isSleeping && (
            <div className="absolute z-10" style={{ left: hamX + 30, top: hamY - 15 }}>
              {[0, 0.4, 0.8].map((delay, i) => <span key={i} className="absolute text-sm" style={{ animation: `zzz 2s ${delay}s ease-out infinite`, right: i * 10, top: -i * 8 }}>💤</span>)}
            </div>
          )}

          {/* Hamster */}
          <button onClick={petHamster} className="absolute outline-none select-none" style={{
            left: hamX, top: hamY,
            transition: (hamAction === "walk" || wheelPhase === "approaching" || toyPhase === "approaching") ? "none" : "left 0.3s, top 0.3s",
            cursor: busy ? "default" : "pointer",
            animation: bounce ? "hamsterBounce 0.5s ease" : isSleeping ? "hamsterSleep 3s ease-in-out infinite" : (wheelPhase === "running" || toyPhase === "playing") ? "hamsterWalk 0.15s ease infinite" : (wheelPhase === "approaching" || toyPhase === "approaching") ? "hamsterWalk 0.3s ease infinite" : hamAction === "walk" ? "hamsterWalk 0.3s ease infinite" : hamAction === "sniff" ? "hamsterSniff 0.6s ease infinite" : "none",
            zIndex: 10,
          }}>
            <PixelHamster tier={tier} sleeping={isSleeping} flip={hamFlip} />
          </button>

          {/* Mood */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center z-10">
            <span className="text-lg">{moodData.face}</span>
            <span className="text-[11px] ml-1.5" style={{ color: moodData.color }}>{moodData.msg}</span>
          </div>

          {/* Wheel stats */}
          {wheelPhase === "running" && (
            <div className="absolute top-3 left-4 z-10">
              <div className="flex items-center gap-2 text-[12px]"><span className="font-black text-amber-400 text-lg tabular-nums">{wheelTaps}</span><span style={{ color: "rgba(255,255,255,.25)" }}>탭</span></div>
              <div className="flex items-center gap-2 text-[11px]"><span style={{ color: "rgba(255,255,255,.25)" }}>🪙 ≈{wheelTaps * COIN_PER_TAP}</span><span style={{ color: wheelTime < 3000 ? "#ef4444" : "rgba(255,255,255,.25)" }}>{(wheelTime / 1000).toFixed(1)}초</span></div>
            </div>
          )}

          {/* Toy play stats */}
          {toyPhase === "playing" && (
            <div className="absolute top-3 left-4 z-10">
              <div className="flex items-center gap-2 text-[12px]"><span className="font-black text-cyan-400 text-lg tabular-nums">{toyTaps}</span><span style={{ color: "rgba(255,255,255,.25)" }}>탭</span></div>
              <div className="text-[11px]" style={{ color: toyTime < 2000 ? "#ef4444" : "rgba(255,255,255,.25)" }}>{(toyTime / 1000).toFixed(1)}초</div>
            </div>
          )}
        </div>

        {/* Wheel / Toy action button */}
        {(wheelPhase === "ready" || wheelPhase === "running") && (
          <button onClick={wheelPhase === "ready" ? startRunning : tapWheel}
            className="w-full rounded-2xl py-5 mb-4 text-center font-black transition-all active:scale-[0.96]"
            style={{ background: wheelPhase === "running" ? `linear-gradient(135deg, rgba(251,191,36,${0.15 + Math.min(wheelTaps * 0.002, 0.25)}), rgba(245,158,11,${0.15 + Math.min(wheelTaps * 0.002, 0.25)}))` : "linear-gradient(135deg, rgba(74,222,128,0.15), rgba(34,211,153,0.15))", border: `1px solid ${wheelPhase === "running" ? "rgba(251,191,36,0.3)" : "rgba(74,222,128,0.3)"}`, color: wheelPhase === "running" ? "#fbbf24" : "#4ade80", fontSize: wheelPhase === "running" ? 18 : 15 }}>
            {wheelPhase === "ready" ? "🏃 달려! 탭하여 시작!" : `☸️ 탭! 탭! 탭! (${wheelTaps})`}
          </button>
        )}
        {(toyPhase === "ready" || toyPhase === "playing") && (
          <button onClick={toyPhase === "ready" ? startPlaying : tapToy}
            className="w-full rounded-2xl py-5 mb-4 text-center font-black transition-all active:scale-[0.96]"
            style={{ background: toyPhase === "playing" ? `linear-gradient(135deg, rgba(34,211,238,${0.15 + Math.min(toyTaps * 0.003, 0.25)}), rgba(96,165,250,${0.15 + Math.min(toyTaps * 0.003, 0.25)}))` : "linear-gradient(135deg, rgba(74,222,128,0.15), rgba(34,211,153,0.15))", border: `1px solid ${toyPhase === "playing" ? "rgba(34,211,238,0.3)" : "rgba(74,222,128,0.3)"}`, color: toyPhase === "playing" ? "#22d3ee" : "#4ade80", fontSize: toyPhase === "playing" ? 18 : 15 }}>
            {toyPhase === "ready" ? `${activeToy?.emoji} 놀자! 탭하여 시작!` : `${activeToy?.emoji} 놀기! (${toyTaps})`}
          </button>
        )}

        {/* Poop warning */}
        {state.poops.length > 0 && (
          <div className="rounded-2xl p-2.5 mb-3 flex items-center justify-between" style={{ background: "rgba(180,120,60,0.08)", border: "1px solid rgba(180,120,60,0.12)" }}>
            <span className="text-[11px]" style={{ color: "rgba(255,200,150,.5)" }}>💩 똥 {state.poops.length}개 — 탭하여 치워주세요!</span>
            <button onClick={() => setState((s) => ({ ...s, poops: [], cleanliness: clamp(s.cleanliness + s.poops.length * 3), happiness: clamp(s.happiness + 3) }))} className="text-[10px] px-2.5 py-1 rounded-lg active:scale-95" style={{ background: "rgba(255,255,255,.05)", color: "rgba(255,255,255,.35)" }}>전부 치우기</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: "배고픔", value: state.hunger, emoji: "🍖", color: "#f97316", bg: "rgba(249,115,22,0.08)" },
            { label: "행복도", value: state.happiness, emoji: "💛", color: "#fbbf24", bg: "rgba(251,191,36,0.08)" },
            { label: "에너지", value: state.energy, emoji: "⚡", color: "#4ade80", bg: "rgba(74,222,128,0.08)" },
            { label: "청결도", value: state.cleanliness, emoji: "✨", color: "#a78bfa", bg: "rgba(167,139,250,0.08)" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl p-3" style={{ background: stat.bg, border: "1px solid rgba(255,255,255,.04)" }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,.4)" }}>{stat.emoji} {stat.label}</span>
                <span className="text-[11px] font-bold tabular-nums" style={{ color: stat.color }}>{Math.round(stat.value)}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.04)" }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${stat.value}%`, background: stat.color, opacity: stat.value < 20 ? 1 : 0.7 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Overall */}
        <div className="rounded-2xl p-3 mb-4 text-center" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)" }}>
          <span className="text-[11px]" style={{ color: "rgba(255,255,255,.25)" }}>종합 건강</span>
          <span className="text-lg font-black ml-2" style={{ color: overallHealth > 70 ? "#4ade80" : overallHealth > 40 ? "#fbbf24" : "#ef4444" }}>{overallHealth}%</span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[
            { label: "먹이", emoji: "🌻", onClick: () => feed(FOODS[0]), disabled: isSleeping || busy },
            { label: "목욕", emoji: "🛁", onClick: clean, disabled: isSleeping || busy },
            { label: "재우기", emoji: "🌙", onClick: sleep, disabled: busy || isSleeping },
            { label: "쳇바퀴", emoji: "☸️", onClick: startWheel, disabled: isSleeping || busy },
          ].map((a) => (
            <button key={a.label} onClick={a.onClick} disabled={a.disabled} className="rounded-2xl py-3 text-center transition-all active:scale-95 disabled:opacity-30" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
              <div className="text-2xl mb-1">{a.emoji}</div>
              <div className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,.35)" }}>{a.label}</div>
            </button>
          ))}
        </div>

        {/* Owned toys */}
        {state.ownedToys.length > 0 && (
          <div className="mb-4">
            <div className="text-[10px] mb-1.5 ml-1" style={{ color: "rgba(255,255,255,.15)" }}>보유 장난감 (탭하여 놀기)</div>
            <div className="flex gap-2">
              {state.ownedToys.map((tid) => {
                const toy = TOYS.find((t) => t.id === tid);
                if (!toy) return null;
                return (
                  <button key={tid} onClick={() => playToy(toy)} disabled={isSleeping || busy} className="rounded-2xl px-4 py-2.5 text-center transition-all active:scale-95 disabled:opacity-30" style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.1)" }}>
                    <span className="text-xl">{toy.emoji}</span>
                    <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,.25)" }}>{toy.name}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Shop */}
        <button onClick={() => setShowShop(!showShop)} className="w-full rounded-2xl py-3 mb-4 text-center font-semibold text-[13px] transition-all active:scale-[0.98]" style={{ background: showShop ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,.03)", border: `1px solid ${showShop ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,.06)"}`, color: showShop ? "#fbbf24" : "rgba(255,255,255,.4)" }}>
          🏪 {showShop ? "상점 닫기" : "상점 열기"}
        </button>

        {showShop && (
          <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)" }}>
            <div className="flex gap-2 mb-3">
              {[{ id: "food", label: "🍽️ 먹이" }, { id: "toy", label: "🎮 장난감" }, { id: "etc", label: "🧹 관리" }].map((tab) => (
                <button key={tab.id} onClick={() => setShopTab(tab.id)} className="flex-1 py-2 rounded-xl text-[12px] font-medium transition-all" style={{ background: shopTab === tab.id ? "rgba(251,191,36,0.1)" : "transparent", color: shopTab === tab.id ? "#fbbf24" : "rgba(255,255,255,.3)", border: shopTab === tab.id ? "1px solid rgba(251,191,36,0.15)" : "1px solid transparent" }}>{tab.label}</button>
              ))}
            </div>
            <div className="space-y-2">
              {shopTab === "food" && FOODS.map((item) => (
                <button key={item.id} onClick={() => feed(item)} disabled={state.coins < item.cost || isSleeping || busy} className="w-full flex items-center justify-between p-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-40" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)" }}>
                  <div className="flex items-center gap-3"><span className="text-2xl">{item.emoji}</span><div className="text-left"><div className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,.6)" }}>{item.name}</div><div className="text-[10px]" style={{ color: "rgba(255,255,255,.2)" }}>포만감 +{item.hunger} 행복 +{item.happiness}</div></div></div>
                  <span className="text-[12px] font-bold" style={{ color: state.coins >= item.cost ? "#fbbf24" : "#ef4444" }}>{item.cost === 0 ? "무료" : `🪙 ${item.cost}`}</span>
                </button>
              ))}
              {shopTab === "toy" && TOYS.map((item) => {
                const owned = state.ownedToys.includes(item.id);
                return (
                  <button key={item.id} onClick={() => !owned && buyToy(item)} disabled={owned || state.coins < item.cost || isSleeping || busy} className="w-full flex items-center justify-between p-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-40" style={{ background: "rgba(255,255,255,.02)", border: `1px solid ${owned ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,.04)"}` }}>
                    <div className="flex items-center gap-3"><span className="text-2xl">{item.emoji}</span><div className="text-left"><div className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,.6)" }}>{item.name}</div><div className="text-[10px]" style={{ color: "rgba(255,255,255,.2)" }}>행복 +{item.happiness} 에너지 {item.energy} · 영구 소유</div></div></div>
                    <span className="text-[12px] font-bold" style={{ color: owned ? "#4ade80" : state.coins >= item.cost ? "#fbbf24" : "#ef4444" }}>{owned ? "✓ 보유" : `🪙 ${item.cost}`}</span>
                  </button>
                );
              })}
              {shopTab === "etc" && (
                <button onClick={changeSawdust} disabled={state.coins < SAWDUST_ITEM.cost} className="w-full flex items-center justify-between p-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-40" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)" }}>
                  <div className="flex items-center gap-3"><span className="text-2xl">{SAWDUST_ITEM.emoji}</span><div className="text-left"><div className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,.6)" }}>{SAWDUST_ITEM.name}</div><div className="text-[10px]" style={{ color: "rgba(255,255,255,.2)" }}>톱밥 신선도 100%로 교체 (현재 {Math.round(state.sawdustFresh)}%)</div></div></div>
                  <span className="text-[12px] font-bold" style={{ color: state.coins >= SAWDUST_ITEM.cost ? "#fbbf24" : "#ef4444" }}>🪙 {SAWDUST_ITEM.cost}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)" }}>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div><div className="text-[10px]" style={{ color: "rgba(255,255,255,.2)" }}>함께한 날</div><div className="text-sm font-bold text-amber-300">{Math.max(1, Math.floor((Date.now() - state.createdAt) / 86400000))}일</div></div>
            <div><div className="text-[10px]" style={{ color: "rgba(255,255,255,.2)" }}>돌봄 횟수</div><div className="text-sm font-bold text-amber-300">{state.totalActions}회</div></div>
            <div><div className="text-[10px]" style={{ color: "rgba(255,255,255,.2)" }}>레벨</div><div className="text-sm font-bold text-amber-300">Lv.{state.level}</div></div>
          </div>
        </div>

        <button onClick={() => { if (confirm("정말 새 햄스터를 입양할까요?")) resetGame(); }} className="w-full rounded-2xl py-2.5 text-center text-[11px] transition-all active:scale-[0.98]" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.08)", color: "rgba(239,68,68,.4)" }}>
          🐹 새 햄스터 입양하기
        </button>
      </div>
    </div>
  );
}
