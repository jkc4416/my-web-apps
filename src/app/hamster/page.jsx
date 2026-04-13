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
  const [toyTaps, setToyTaps] = useState(0);
  const [toyTime, setToyTime] = useState(0);

  const wheelActive = wheelPhase !== "none";
  const toyActive = toyPhase !== "none";
  const busy = wheelActive || toyActive;

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
    const saved = localStorage.getItem(SAVE_KEY);
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
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastSaved: Date.now() }));
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
    localStorage.removeItem(SAVE_KEY);
    setState(getDefaultState()); setIsSleeping(false); setWheelPhase("none"); setToyPhase("none"); setShowShop(false);
    updatePos(CAGE_W / 2, CAGE_H / 2);
    showBubble("새 햄스터를 입양했어요!"); spawnParticles("🎀", 6);
  }, [showBubble, spawnParticles, updatePos]);

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
        <div className="relative rounded-3xl mb-4 overflow-hidden" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", animation: "glow 4s ease-in-out infinite", height: CAGE_H + 80 }}>

          {/* Sawdust floor — color changes with freshness */}
          <div className="absolute bottom-0 left-0 right-0 h-14" style={{ background: `linear-gradient(to top, ${sawdustColor}12, transparent)` }} />
          {Array.from({ length: 30 }).map((_, i) => {
            const isDirty = (i * 37) % 100 > state.sawdustFresh;
            return <div key={i} className="absolute rounded-full" style={{ width: 4 + (i % 3), height: 2, background: isDirty ? "rgba(100,100,100,0.12)" : `${sawdustColor}15`, left: `${(i * 11.3) % 97}%`, bottom: 10 + (i % 7) * 4 }} />;
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
