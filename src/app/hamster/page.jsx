"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ===== CONSTANTS =====
const DECAY_INTERVAL = 3000;
const DECAY_AMOUNT = 0.4;
const SAVE_KEY = "hamster-save-v3";
const XP_PER_ACTION = 8;
const XP_PER_LEVEL = 100;
const WHEEL_DURATION = 8000;
const COIN_PER_TAP = 2;
const CAGE_W = 340;
const CAGE_H = 220;

const FOODS = [
  { id: "seed", name: "해바라기씨", emoji: "🌻", cost: 0, hunger: 15, happiness: 3 },
  { id: "carrot", name: "당근", emoji: "🥕", cost: 5, hunger: 25, happiness: 5 },
  { id: "cheese", name: "치즈", emoji: "🧀", cost: 10, hunger: 20, happiness: 10 },
  { id: "strawberry", name: "딸기", emoji: "🍓", cost: 15, hunger: 15, happiness: 15 },
  { id: "cake", name: "케이크", emoji: "🍰", cost: 30, hunger: 30, happiness: 25 },
];

const TOYS = [
  { id: "ball", name: "공", emoji: "⚽", cost: 20, happiness: 20, energy: -5 },
  { id: "tunnel", name: "터널", emoji: "🕳️", cost: 35, happiness: 30, energy: -8 },
  { id: "swing", name: "그네", emoji: "🎠", cost: 50, happiness: 40, energy: -10 },
];

const HAMSTER_NAMES = ["몽실이", "뭉치", "콩이", "도토리", "솜이", "밤이", "쪼꼬", "구름이"];

const MOODS = {
  happy: { face: "😊", msg: "기분 좋아요~!", color: "#fbbf24" },
  love: { face: "😍", msg: "최고예요~! 사랑해요!", color: "#ec4899" },
  eating: { face: "😋", msg: "냠냠 맛있다~!", color: "#f97316" },
  sleepy: { face: "😴", msg: "졸려요... zzZ", color: "#818cf8" },
  sleeping: { face: "💤", msg: "쿨쿨...", color: "#6366f1" },
  hungry: { face: "🥺", msg: "배고파요...", color: "#ef4444" },
  dirty: { face: "😣", msg: "목욕하고 싶어요...", color: "#a3a3a3" },
  sad: { face: "😢", msg: "관심 좀 주세요...", color: "#64748b" },
  playing: { face: "🤩", msg: "신난다~!", color: "#22d3ee" },
  running: { face: "🏃", msg: "달린다~!", color: "#4ade80" },
  clean: { face: "✨", msg: "깨끗해서 기분 좋아요!", color: "#a78bfa" },
  idle: { face: "🐹", msg: "...", color: "#fbbf24" },
};

const TITLES = [
  "아기 햄스터", "꼬마 햄스터", "씩씩한 햄스터", "똒똒한 햄스터",
  "용감한 햄스터", "인기쟁이 햄스터", "슈퍼 햄스터", "전설의 햄스터",
  "우주 햄스터", "신화의 햄스터",
];

// Pixel sizes per level tier: every 5 levels
const SIZES = [
  { pixel: 4, cols: 7, label: "아기" },    // lv 1-4
  { pixel: 5, cols: 9, label: "꼬마" },    // lv 5-9
  { pixel: 5, cols: 11, label: "청소년" }, // lv 10-14
  { pixel: 6, cols: 11, label: "어른" },   // lv 15-19
  { pixel: 7, cols: 13, label: "왕" },     // lv 20+
];

function getSizeTier(level) {
  if (level < 5) return 0;
  if (level < 10) return 1;
  if (level < 15) return 2;
  if (level < 20) return 3;
  return 4;
}

// Pixel art hamster sprites (0=transparent, 1=body, 2=ear/dark, 3=belly, 4=eye, 5=nose, 6=cheek)
const SPRITES = [
  // Tier 0: tiny baby (7 cols)
  {
    normal: [
      [0,0,2,0,2,0,0],
      [0,1,1,1,1,1,0],
      [1,4,1,5,1,4,1],
      [1,6,1,1,1,6,1],
      [0,1,3,3,3,1,0],
      [0,0,1,0,1,0,0],
    ],
    sleep: [
      [0,0,2,0,2,0,0],
      [0,1,1,1,1,1,0],
      [1,1,1,5,1,1,1],
      [1,6,1,1,1,6,1],
      [0,1,3,3,3,1,0],
      [0,0,1,0,1,0,0],
    ],
  },
  // Tier 1: small (9 cols)
  {
    normal: [
      [0,0,0,2,0,2,0,0,0],
      [0,0,2,1,1,1,2,0,0],
      [0,1,1,1,1,1,1,1,0],
      [0,1,4,1,5,1,4,1,0],
      [1,1,6,1,1,1,6,1,1],
      [0,1,1,3,3,3,1,1,0],
      [0,0,1,3,3,3,1,0,0],
      [0,0,1,0,0,0,1,0,0],
    ],
    sleep: [
      [0,0,0,2,0,2,0,0,0],
      [0,0,2,1,1,1,2,0,0],
      [0,1,1,1,1,1,1,1,0],
      [0,1,1,1,5,1,1,1,0],
      [1,1,6,1,1,1,6,1,1],
      [0,1,1,3,3,3,1,1,0],
      [0,0,1,3,3,3,1,0,0],
      [0,0,1,0,0,0,1,0,0],
    ],
  },
  // Tier 2: medium (11 cols)
  {
    normal: [
      [0,0,0,2,2,0,2,2,0,0,0],
      [0,0,2,2,1,1,1,2,2,0,0],
      [0,0,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,0],
      [0,1,4,1,1,5,1,1,4,1,0],
      [1,1,6,6,1,1,1,6,6,1,1],
      [0,1,1,1,3,3,3,1,1,1,0],
      [0,0,1,3,3,3,3,3,1,0,0],
      [0,0,0,1,1,0,1,1,0,0,0],
    ],
    sleep: [
      [0,0,0,2,2,0,2,2,0,0,0],
      [0,0,2,2,1,1,1,2,2,0,0],
      [0,0,1,1,1,1,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,1,5,1,1,1,1,0],
      [1,1,6,6,1,1,1,6,6,1,1],
      [0,1,1,1,3,3,3,1,1,1,0],
      [0,0,1,3,3,3,3,3,1,0,0],
      [0,0,0,1,1,0,1,1,0,0,0],
    ],
  },
  // Tier 3: large (11 cols, taller)
  {
    normal: [
      [0,0,0,2,2,0,2,2,0,0,0],
      [0,0,2,2,1,1,1,2,2,0,0],
      [0,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,0],
      [1,1,4,4,1,5,1,4,4,1,1],
      [1,1,6,6,1,1,1,6,6,1,1],
      [0,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,3,3,3,3,3,1,1,0],
      [0,0,1,3,3,3,3,3,1,0,0],
      [0,0,1,1,0,0,0,1,1,0,0],
    ],
    sleep: [
      [0,0,0,2,2,0,2,2,0,0,0],
      [0,0,2,2,1,1,1,2,2,0,0],
      [0,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,5,1,1,1,1,1],
      [1,1,6,6,1,1,1,6,6,1,1],
      [0,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,3,3,3,3,3,1,1,0],
      [0,0,1,3,3,3,3,3,1,0,0],
      [0,0,1,1,0,0,0,1,1,0,0],
    ],
  },
  // Tier 4: king (13 cols)
  {
    normal: [
      [0,0,0,0,7,0,7,0,7,0,0,0,0],
      [0,0,0,2,2,0,0,0,2,2,0,0,0],
      [0,0,2,2,1,1,1,1,1,2,2,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,0],
      [1,1,4,4,1,1,5,1,1,4,4,1,1],
      [1,1,6,6,1,1,1,1,1,6,6,1,1],
      [0,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,3,3,3,3,3,1,1,1,0],
      [0,0,1,3,3,3,3,3,3,3,1,0,0],
      [0,0,0,1,1,0,0,0,1,1,0,0,0],
    ],
    sleep: [
      [0,0,0,0,7,0,7,0,7,0,0,0,0],
      [0,0,0,2,2,0,0,0,2,2,0,0,0],
      [0,0,2,2,1,1,1,1,1,2,2,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,1,1,1,5,1,1,1,1,1,1],
      [1,1,6,6,1,1,1,1,1,6,6,1,1],
      [0,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,3,3,3,3,3,1,1,1,0],
      [0,0,1,3,3,3,3,3,3,3,1,0,0],
      [0,0,0,1,1,0,0,0,1,1,0,0,0],
    ],
  },
];

const COLORS = {
  0: "transparent",
  1: "#e8a87c",  // body
  2: "#c4844c",  // ear/dark
  3: "#fde8c8",  // belly
  4: "#2a1a0a",  // eye
  5: "#d4836a",  // nose
  6: "#ffaaaa",  // cheek
  7: "#fbbf24",  // crown
};

function clamp(v, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

function getDefaultState() {
  return {
    name: HAMSTER_NAMES[Math.floor(Math.random() * HAMSTER_NAMES.length)],
    hunger: 80, happiness: 80, energy: 80, cleanliness: 80,
    coins: 10, xp: 0, level: 1, totalActions: 0,
    createdAt: Date.now(), lastSaved: Date.now(),
  };
}

// Pixel Hamster renderer
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
  const [wheelPhase, setWheelPhase] = useState("none"); // none | appearing | approaching | ready | running | finishing
  const [wheelTaps, setWheelTaps] = useState(0);
  const [wheelTime, setWheelTime] = useState(0);
  const wheelActive = wheelPhase !== "none";
  const [isSleeping, setIsSleeping] = useState(false);
  const [bubbleMsg, setBubbleMsg] = useState("");
  const [bounce, setBounce] = useState(false);
  const [nameEditing, setNameEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  // Hamster position & movement — use refs to avoid stale closures
  const [hamX, setHamX] = useState(CAGE_W / 2);
  const [hamY, setHamY] = useState(CAGE_H / 2);
  const [hamFlip, setHamFlip] = useState(false);
  const [hamAction, setHamAction] = useState("idle"); // idle, walk, sniff, groom
  const hamPosRef = useRef({ x: CAGE_W / 2, y: CAGE_H / 2 });
  const moveTimerRef = useRef(null);
  const animRef = useRef(null);
  const wheelTimerRef = useRef(null);
  const decayRef = useRef(null);
  const particleId = useRef(0);
  // Keep ref in sync
  const updatePos = useCallback((x, y) => {
    hamPosRef.current = { x, y };
    setHamX(x);
    setHamY(y);
  }, []);

  // Load
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const elapsed = (Date.now() - (parsed.lastSaved || Date.now())) / 1000;
      const decayTicks = Math.min(Math.floor(elapsed / 3), 200);
      const decay = decayTicks * DECAY_AMOUNT;
      setState({
        ...parsed,
        hunger: clamp((parsed.hunger || 80) - decay * 0.8),
        happiness: clamp((parsed.happiness || 80) - decay * 0.5),
        energy: clamp(Math.min((parsed.energy || 80) + decay * 0.3, 100)),
        cleanliness: clamp((parsed.cleanliness || 80) - decay * 0.6),
      });
    } else {
      setState(getDefaultState());
    }
  }, []);

  // Save
  useEffect(() => {
    if (!state) return;
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastSaved: Date.now() }));
  }, [state]);

  // Animate hamster to a target position (reusable)
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
      if (t < 1) { animRef.current = requestAnimationFrame(step); }
      else { animRef.current = null; if (onDone) onDone(); }
    };
    animRef.current = requestAnimationFrame(step);
  }, [updatePos]);

  // Random hamster movement
  useEffect(() => {
    if (!state || wheelActive || isSleeping) {
      clearTimeout(moveTimerRef.current);
      return;
    }

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
        const duration = 1000 + Math.random() * 1500;

        animateTo(targetX, targetY, duration, () => setHamAction("idle"));
      }

      moveTimerRef.current = setTimeout(doMove, 2000 + Math.random() * 3000);
    };

    moveTimerRef.current = setTimeout(doMove, 1500 + Math.random() * 2000);
    return () => { clearTimeout(moveTimerRef.current); if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [state?.level, isSleeping, wheelActive, animateTo]);

  // Stat decay
  useEffect(() => {
    if (!state || isSleeping) return;
    decayRef.current = setInterval(() => {
      setState((s) => ({
        ...s,
        hunger: clamp(s.hunger - DECAY_AMOUNT * 0.8),
        happiness: clamp(s.happiness - DECAY_AMOUNT * 0.5),
        energy: clamp(s.energy - DECAY_AMOUNT * 0.3),
        cleanliness: clamp(s.cleanliness - DECAY_AMOUNT * 0.6),
      }));
    }, DECAY_INTERVAL);
    return () => clearInterval(decayRef.current);
  }, [state !== null, isSleeping]);

  // Mood
  useEffect(() => {
    if (!state) return;
    if (isSleeping) { setMood("sleeping"); return; }
    if (wheelActive) { setMood("running"); return; }
    const avg = (state.hunger + state.happiness + state.energy + state.cleanliness) / 4;
    if (avg > 85) setMood("love");
    else if (state.hunger < 20) setMood("hungry");
    else if (state.cleanliness < 20) setMood("dirty");
    else if (state.energy < 20) setMood("sleepy");
    else if (state.happiness < 20) setMood("sad");
    else if (avg > 60) setMood("happy");
    else setMood("idle");
  }, [state, isSleeping, wheelActive]);

  const spawnParticles = useCallback((emoji, count = 5) => {
    const newP = Array.from({ length: count }, () => ({
      id: ++particleId.current, emoji,
      x: 40 + Math.random() * 20, y: 20 + Math.random() * 20,
      dx: (Math.random() - 0.5) * 60, dy: -(30 + Math.random() * 40),
    }));
    setParticles((p) => [...p, ...newP]);
    setTimeout(() => setParticles((p) => p.filter((pp) => !newP.find((np) => np.id === pp.id))), 1200);
  }, []);

  const showBubble = useCallback((msg) => {
    setBubbleMsg(msg);
    setTimeout(() => setBubbleMsg(""), 2000);
  }, []);

  const doBounce = useCallback(() => {
    setBounce(true);
    setTimeout(() => setBounce(false), 500);
  }, []);

  const gainXP = useCallback((amount) => {
    setState((s) => {
      const newXP = s.xp + amount;
      const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
      if (newLevel > s.level) {
        showBubble(`🎉 레벨 ${newLevel} 달성! 햄스터가 커졌어요!`);
        spawnParticles("⭐", 8);
      }
      return { ...s, xp: newXP, level: newLevel, totalActions: s.totalActions + 1 };
    });
  }, [showBubble, spawnParticles]);

  const feed = useCallback((food) => {
    if (!state || isSleeping || wheelActive) return;
    if (state.coins < food.cost) { showBubble("코인이 부족해요!"); return; }
    if (state.hunger > 95) { showBubble("배가 불러요~"); return; }
    setMood("eating");
    setState((s) => ({ ...s, hunger: clamp(s.hunger + food.hunger), happiness: clamp(s.happiness + food.happiness), coins: s.coins - food.cost }));
    spawnParticles(food.emoji, 4); showBubble(MOODS.eating.msg); doBounce(); gainXP(XP_PER_ACTION);
    setShowShop(false);
    setTimeout(() => setMood("happy"), 1500);
  }, [state, isSleeping, wheelActive, spawnParticles, showBubble, doBounce, gainXP]);

  const play = useCallback((toy) => {
    if (!state || isSleeping || wheelActive) return;
    if (state.coins < toy.cost) { showBubble("코인이 부족해요!"); return; }
    if (state.energy < 10) { showBubble("너무 피곤해요..."); return; }
    setMood("playing");
    setState((s) => ({ ...s, happiness: clamp(s.happiness + toy.happiness), energy: clamp(s.energy + toy.energy), coins: s.coins - toy.cost }));
    spawnParticles(toy.emoji, 4); showBubble(MOODS.playing.msg); doBounce(); gainXP(XP_PER_ACTION);
    setShowShop(false);
    setTimeout(() => setMood("happy"), 2000);
  }, [state, isSleeping, wheelActive, spawnParticles, showBubble, doBounce, gainXP]);

  const sleep = useCallback(() => {
    if (!state || wheelActive) return;
    if (state.energy > 90) { showBubble("아직 안 졸려요~"); return; }
    setIsSleeping(true); showBubble(MOODS.sleeping.msg); spawnParticles("💤", 3);
    const timer = setInterval(() => {
      setState((s) => {
        if (s.energy >= 100) {
          clearInterval(timer); setIsSleeping(false); setMood("happy");
          showBubble("푹 잤어요! 상쾌~!"); spawnParticles("☀️", 5);
          return { ...s, energy: 100 };
        }
        return { ...s, energy: clamp(s.energy + 2) };
      });
    }, 500);
    gainXP(XP_PER_ACTION);
  }, [state, wheelActive, spawnParticles, showBubble, gainXP]);

  const clean = useCallback(() => {
    if (!state || isSleeping || wheelActive) return;
    if (state.cleanliness > 90) { showBubble("이미 깨끗해요~"); return; }
    setMood("clean");
    setState((s) => ({ ...s, cleanliness: clamp(s.cleanliness + 35), happiness: clamp(s.happiness + 5) }));
    spawnParticles("🫧", 6); showBubble(MOODS.clean.msg); doBounce(); gainXP(XP_PER_ACTION);
    setTimeout(() => setMood("happy"), 1500);
  }, [state, isSleeping, wheelActive, spawnParticles, showBubble, doBounce, gainXP]);

  // Wheel position in cage
  const WHEEL_X = CAGE_W - 80;
  const WHEEL_Y = CAGE_H * 0.35;
  const WHEEL_SIZE = 64;

  const startWheel = useCallback(() => {
    if (!state || isSleeping || wheelActive) return;
    if (state.energy < 15) { showBubble("너무 피곤해요..."); return; }

    // Phase 1: wheel appears
    setWheelPhase("appearing");
    showBubble("오! 쳇바퀴다!");

    // Phase 2: hamster runs to wheel
    setTimeout(() => {
      setWheelPhase("approaching");
      setHamFlip(false); // face right toward wheel
      const t = getSizeTier(state.level);
      const spriteH = SPRITES[t].normal.length * SIZES[t].pixel;
      const targetX = WHEEL_X - 20;
      const targetY = WHEEL_Y + WHEEL_SIZE / 2 - spriteH / 2;
      animateTo(targetX, targetY, 1000, () => {
        setWheelPhase("ready");
        showBubble("준비 완료! 아래 버튼을 눌러주세요!");
      });
    }, 600);
  }, [state, isSleeping, wheelActive, showBubble, animateTo]);

  const startRunning = useCallback(() => {
    if (wheelPhase !== "ready") return;
    setWheelPhase("running");
    setWheelTaps(0);
    setWheelTime(WHEEL_DURATION);
    showBubble("빨리 눌러요! 🏃");

    const start = Date.now();
    wheelTimerRef.current = setInterval(() => {
      const remaining = WHEEL_DURATION - (Date.now() - start);
      if (remaining <= 0) {
        clearInterval(wheelTimerRef.current);
        setWheelPhase("finishing");
        setWheelTime(0);
        setWheelTaps((taps) => {
          const earned = Math.floor(taps * COIN_PER_TAP);
          setState((s) => ({ ...s, coins: s.coins + earned, energy: clamp(s.energy - 15), happiness: clamp(s.happiness + 10) }));
          showBubble(`🎉 ${earned} 코인 획득!`);
          spawnParticles("🪙", 8);
          gainXP(XP_PER_ACTION * 2);
          return 0;
        });
        // Hamster hops off — walk to a random spot instead of teleporting
        setTimeout(() => {
          setWheelPhase("none");
          const t = getSizeTier(state.level);
          const spriteW = SPRITES[t].normal[0].length * SIZES[t].pixel;
          const margin = 15;
          const wanderX = margin + Math.random() * (CAGE_W * 0.5 - spriteW);
          const wanderY = CAGE_H * 0.3 + Math.random() * (CAGE_H * 0.3);
          animateTo(wanderX, wanderY, 1200, () => setHamAction("idle"));
        }, 1500);
      } else {
        setWheelTime(remaining);
      }
    }, 100);
  }, [wheelPhase, showBubble, spawnParticles, gainXP, state, animateTo]);

  const tapWheel = useCallback(() => {
    if (wheelPhase !== "running") return;
    setWheelTaps((t) => t + 1);
    doBounce();
  }, [wheelPhase, doBounce]);

  const petHamster = useCallback(() => {
    if (isSleeping || wheelActive) return;
    setState((s) => ({ ...s, happiness: clamp(s.happiness + 2) }));
    spawnParticles("❤️", 3); doBounce();
  }, [isSleeping, wheelActive, spawnParticles, doBounce]);

  const saveName = useCallback(() => {
    if (nameInput.trim()) setState((s) => ({ ...s, name: nameInput.trim() }));
    setNameEditing(false);
  }, [nameInput]);

  const resetGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setState(getDefaultState()); setIsSleeping(false); setWheelPhase("none"); setShowShop(false);
    updatePos(CAGE_W / 2, CAGE_H / 2);
    showBubble("새 햄스터를 입양했어요!"); spawnParticles("🎀", 6);
  }, [showBubble, spawnParticles]);

  if (!state) return null;

  const moodData = MOODS[mood] || MOODS.idle;
  const overallHealth = Math.round((state.hunger + state.happiness + state.energy + state.cleanliness) / 4);
  const xpInLevel = state.xp % XP_PER_LEVEL;
  const title = TITLES[Math.min(state.level - 1, TITLES.length - 1)];
  const tier = getSizeTier(state.level);
  const spriteInfo = SIZES[tier];

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: "radial-gradient(ellipse at 50% 30%, #2a1810 0%, #1a0e08 40%, #0c0604 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>

      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{ color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(12px)" }}>← 홈</Link>

      {/* Particles */}
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
      `}</style>

      <div className="max-w-[420px] mx-auto px-4 pb-8">

        {/* Header */}
        <div className="pt-14 pb-2 flex items-center justify-between">
          <div>
            {nameEditing ? (
              <div className="flex items-center gap-2">
                <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} maxLength={8} autoFocus onKeyDown={(e) => e.key === "Enter" && saveName()} className="bg-transparent border-b border-amber-500/50 text-lg font-black text-amber-300 w-28 outline-none" />
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
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,.25)" }}>{title} · {spriteInfo.label} 사이즈</span>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
            <span className="text-lg">🪙</span>
            <span className="text-sm font-bold tabular-nums ml-1 text-amber-300">{state.coins}</span>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] mb-1" style={{ color: "rgba(255,255,255,.2)" }}>
            <span>EXP</span><span>{xpInLevel} / {XP_PER_LEVEL}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.04)" }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(xpInLevel / XP_PER_LEVEL) * 100}%`, background: "linear-gradient(90deg, #fbbf24, #f59e0b)" }} />
          </div>
        </div>

        {/* Cage / Hamster Area */}
        <div className="relative rounded-3xl mb-4 overflow-hidden" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", animation: "glow 4s ease-in-out infinite", height: CAGE_H + 80 }}>

          {/* Cage floor */}
          <div className="absolute bottom-0 left-0 right-0 h-12" style={{ background: "linear-gradient(to top, rgba(160,120,60,0.08), transparent)" }} />
          <div className="absolute bottom-8 left-0 right-0" style={{ height: 2, background: "rgba(255,255,255,.03)" }} />

          {/* Sawdust dots */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute rounded-full" style={{ width: 3, height: 2, background: "rgba(200,160,100,0.06)", left: `${(i * 17) % 100}%`, bottom: 12 + (i % 5) * 4 }} />
          ))}

          {/* Wheel — visible when mini-game active */}
          {wheelPhase !== "none" && (
            <div className="absolute z-5" style={{ right: 24, top: WHEEL_Y - 8, transition: "opacity 0.5s", opacity: wheelPhase === "appearing" ? 0.5 : 1 }}>
              {/* Stand */}
              <div className="absolute" style={{ width: 4, height: WHEEL_SIZE + 16, background: "rgba(180,140,100,0.25)", borderRadius: 2, left: WHEEL_SIZE / 2 - 2, top: 0 }} />
              {/* Wheel circle */}
              <div className="rounded-full flex items-center justify-center" style={{
                width: WHEEL_SIZE, height: WHEEL_SIZE,
                border: "3px solid rgba(251,191,36,0.35)",
                background: "rgba(251,191,36,0.04)",
                animation: wheelPhase === "running" ? `wheelSpin ${Math.max(0.1, 0.6 - wheelTaps * 0.005)}s linear infinite` : "none",
                boxShadow: wheelPhase === "running" ? "0 0 20px rgba(251,191,36,0.15)" : "none",
                transition: "box-shadow 0.3s",
              }}>
                {/* Spokes */}
                {[0, 45, 90, 135].map((deg) => (
                  <div key={deg} className="absolute" style={{ width: 1, height: WHEEL_SIZE - 10, background: "rgba(251,191,36,0.15)", transform: `rotate(${deg}deg)` }} />
                ))}
                {/* Center */}
                <div className="rounded-full" style={{ width: 8, height: 8, background: "rgba(251,191,36,0.4)" }} />
              </div>
              {/* Base */}
              <div className="absolute" style={{ width: WHEEL_SIZE + 8, height: 4, background: "rgba(180,140,100,0.2)", borderRadius: 2, left: -4, top: WHEEL_SIZE + 12 }} />
            </div>
          )}

          {/* Wheel decoration (idle, faint) */}
          {wheelPhase === "none" && (
            <div className="absolute top-4 right-4 opacity-[0.06]">
              <div className="w-10 h-10 rounded-full border-2 border-white" />
            </div>
          )}

          {/* Water bottle */}
          <div className="absolute top-4 left-4 text-xl opacity-[0.12]">🍶</div>

          {/* Speech Bubble */}
          {bubbleMsg && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-2xl text-[13px] font-medium whitespace-nowrap" style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.7)", animation: "bubbleIn 0.3s ease-out", backdropFilter: "blur(8px)" }}>
              {bubbleMsg}
            </div>
          )}

          {/* ZZZ */}
          {isSleeping && (
            <div className="absolute z-10" style={{ left: hamX + 30, top: hamY - 15 }}>
              {[0, 0.4, 0.8].map((delay, i) => (
                <span key={i} className="absolute text-sm" style={{ animation: `zzz 2s ${delay}s ease-out infinite`, right: i * 10, top: -i * 8 }}>💤</span>
              ))}
            </div>
          )}

          {/* Hamster */}
          <button
            onClick={petHamster}
            className="absolute outline-none select-none"
            style={{
              left: hamX,
              top: hamY,
              transition: (hamAction === "walk" || wheelPhase === "approaching") ? "none" : "left 0.3s, top 0.3s",
              cursor: wheelActive ? "default" : "pointer",
              animation: bounce ? "hamsterBounce 0.5s ease"
                : isSleeping ? "hamsterSleep 3s ease-in-out infinite"
                : wheelPhase === "running" ? "hamsterWalk 0.15s ease infinite"
                : wheelPhase === "approaching" ? "hamsterWalk 0.3s ease infinite"
                : hamAction === "walk" ? "hamsterWalk 0.3s ease infinite"
                : hamAction === "sniff" ? "hamsterSniff 0.6s ease infinite"
                : "none",
              zIndex: 10,
            }}
          >
            <PixelHamster tier={tier} sleeping={isSleeping} flip={hamFlip} />
          </button>

          {/* Mood indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center z-10">
            <span className="text-lg">{moodData.face}</span>
            <span className="text-[11px] ml-1.5" style={{ color: moodData.color }}>{moodData.msg}</span>
          </div>

          {/* Wheel running stats */}
          {wheelPhase === "running" && (
            <div className="absolute top-3 left-4 text-left z-10">
              <div className="flex items-center gap-2 text-[12px]">
                <span className="font-black text-amber-400 text-lg tabular-nums">{wheelTaps}</span>
                <span style={{ color: "rgba(255,255,255,.25)" }}>탭</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span style={{ color: "rgba(255,255,255,.25)" }}>🪙 ≈{wheelTaps * COIN_PER_TAP}</span>
                <span style={{ color: "rgba(255,255,255,.15)" }}>|</span>
                <span style={{ color: wheelTime < 3000 ? "#ef4444" : "rgba(255,255,255,.25)" }}>{(wheelTime / 1000).toFixed(1)}초</span>
              </div>
            </div>
          )}

          {/* Finishing message */}
          {wheelPhase === "finishing" && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 text-center">
              <div className="text-lg">😮‍💨</div>
              <div className="text-[11px]" style={{ color: "rgba(255,255,255,.3)" }}>수고했어~!</div>
            </div>
          )}
        </div>

        {/* Wheel tap button — appears below cage when ready or running */}
        {(wheelPhase === "ready" || wheelPhase === "running") && (
          <button
            onClick={wheelPhase === "ready" ? startRunning : tapWheel}
            className="w-full rounded-2xl py-5 mb-4 text-center font-black transition-all active:scale-[0.96]"
            style={{
              background: wheelPhase === "running"
                ? `linear-gradient(135deg, rgba(251,191,36,${0.15 + Math.min(wheelTaps * 0.002, 0.25)}), rgba(245,158,11,${0.15 + Math.min(wheelTaps * 0.002, 0.25)}))`
                : "linear-gradient(135deg, rgba(74,222,128,0.15), rgba(34,211,153,0.15))",
              border: `1px solid ${wheelPhase === "running" ? "rgba(251,191,36,0.3)" : "rgba(74,222,128,0.3)"}`,
              color: wheelPhase === "running" ? "#fbbf24" : "#4ade80",
              fontSize: wheelPhase === "running" ? 18 : 15,
            }}
          >
            {wheelPhase === "ready" ? "🏃 달려! 탭하여 시작!" : `☸️ 탭! 탭! 탭! (${wheelTaps})`}
          </button>
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
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${stat.value}%`, background: stat.color, opacity: stat.value < 20 ? 1 : 0.7, animation: stat.value < 20 ? "pulse 1s infinite" : "none" }} />
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
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: "먹이", emoji: "🌻", onClick: () => feed(FOODS[0]), disabled: isSleeping || wheelActive },
            { label: "목욕", emoji: "🛁", onClick: clean, disabled: isSleeping || wheelActive },
            { label: "재우기", emoji: "🌙", onClick: sleep, disabled: wheelActive || isSleeping },
            { label: "쳇바퀴", emoji: "☸️", onClick: startWheel, disabled: isSleeping || wheelActive },
          ].map((action) => (
            <button key={action.label} onClick={action.onClick} disabled={action.disabled}
              className="rounded-2xl py-3 text-center transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
              <div className="text-2xl mb-1">{action.emoji}</div>
              <div className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,.35)" }}>{action.label}</div>
            </button>
          ))}
        </div>

        {/* Shop */}
        <button onClick={() => setShowShop(!showShop)} className="w-full rounded-2xl py-3 mb-4 text-center font-semibold text-[13px] transition-all active:scale-[0.98]" style={{ background: showShop ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,.03)", border: `1px solid ${showShop ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,.06)"}`, color: showShop ? "#fbbf24" : "rgba(255,255,255,.4)" }}>
          🏪 {showShop ? "상점 닫기" : "상점 열기"}
        </button>

        {showShop && (
          <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)" }}>
            <div className="flex gap-2 mb-3">
              {[{ id: "food", label: "🍽️ 먹이" }, { id: "toy", label: "🎮 장난감" }].map((tab) => (
                <button key={tab.id} onClick={() => setShopTab(tab.id)} className="flex-1 py-2 rounded-xl text-[12px] font-medium transition-all" style={{ background: shopTab === tab.id ? "rgba(251,191,36,0.1)" : "transparent", color: shopTab === tab.id ? "#fbbf24" : "rgba(255,255,255,.3)", border: shopTab === tab.id ? "1px solid rgba(251,191,36,0.15)" : "1px solid transparent" }}>{tab.label}</button>
              ))}
            </div>
            <div className="space-y-2">
              {(shopTab === "food" ? FOODS : TOYS).map((item) => (
                <button key={item.id} onClick={() => shopTab === "food" ? feed(item) : play(item)} disabled={state.coins < item.cost || isSleeping || wheelActive}
                  className="w-full flex items-center justify-between p-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-40" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="text-left">
                      <div className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,.6)" }}>{item.name}</div>
                      <div className="text-[10px]" style={{ color: "rgba(255,255,255,.2)" }}>{shopTab === "food" ? `포만감 +${item.hunger} 행복 +${item.happiness}` : `행복 +${item.happiness} 에너지 ${item.energy}`}</div>
                    </div>
                  </div>
                  <span className="text-[12px] font-bold" style={{ color: state.coins >= item.cost ? "#fbbf24" : "#ef4444" }}>{item.cost === 0 ? "무료" : `🪙 ${item.cost}`}</span>
                </button>
              ))}
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

        <button onClick={() => { if (confirm("정말 새 햄스터를 입양할까요? 현재 진행이 초기화됩니다.")) resetGame(); }} className="w-full rounded-2xl py-2.5 text-center text-[11px] transition-all active:scale-[0.98]" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.08)", color: "rgba(239,68,68,.4)" }}>
          🐹 새 햄스터 입양하기
        </button>

        <div className="mt-6 text-center text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,.08)" }}>
          <p>🐹 햄스터를 탭하면 쓰다듬을 수 있어요</p>
          <p>레벨업하면 햄스터가 점점 커져요!</p>
        </div>
      </div>
    </div>
  );
}
