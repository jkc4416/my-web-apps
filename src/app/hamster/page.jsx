"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ===== CONSTANTS =====
const DECAY_INTERVAL = 3000; // stats decay every 3s
const DECAY_AMOUNT = 0.4;
const SAVE_KEY = "hamster-save-v2";
const XP_PER_ACTION = 8;
const XP_PER_LEVEL = 100;
const WHEEL_DURATION = 8000;
const COIN_PER_TAP = 2;

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
  "아기 햄스터", "꼬마 햄스터", "씩씩한 햄스터", "똑똑한 햄스터",
  "용감한 햄스터", "인기쟁이 햄스터", "슈퍼 햄스터", "전설의 햄스터",
  "우주 햄스터", "신화의 햄스터",
];

function clamp(v, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

function getDefaultState() {
  return {
    name: HAMSTER_NAMES[Math.floor(Math.random() * HAMSTER_NAMES.length)],
    hunger: 80,
    happiness: 80,
    energy: 80,
    cleanliness: 80,
    coins: 10,
    xp: 0,
    level: 1,
    totalActions: 0,
    createdAt: Date.now(),
    lastSaved: Date.now(),
  };
}

export default function HamsterPage() {
  const [state, setState] = useState(null);
  const [mood, setMood] = useState("idle");
  const [particles, setParticles] = useState([]);
  const [showShop, setShowShop] = useState(false);
  const [shopTab, setShopTab] = useState("food");
  const [wheelActive, setWheelActive] = useState(false);
  const [wheelTaps, setWheelTaps] = useState(0);
  const [wheelTime, setWheelTime] = useState(0);
  const [isSleeping, setIsSleeping] = useState(false);
  const [bubbleMsg, setBubbleMsg] = useState("");
  const [bounce, setBounce] = useState(false);
  const [nameEditing, setNameEditing] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const wheelTimerRef = useRef(null);
  const decayRef = useRef(null);
  const particleId = useRef(0);

  // Load
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Apply time-based decay for time away
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

  // Mood calculator
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

  // Particles
  const spawnParticles = useCallback((emoji, count = 5) => {
    const newP = Array.from({ length: count }, () => ({
      id: ++particleId.current,
      emoji,
      x: 40 + Math.random() * 20,
      y: 20 + Math.random() * 20,
      dx: (Math.random() - 0.5) * 60,
      dy: -(30 + Math.random() * 40),
    }));
    setParticles((p) => [...p, ...newP]);
    setTimeout(() => {
      setParticles((p) => p.filter((pp) => !newP.find((np) => np.id === pp.id)));
    }, 1200);
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
        showBubble(`🎉 레벨 ${newLevel} 달성!`);
        spawnParticles("⭐", 8);
      }
      return { ...s, xp: newXP, level: newLevel, totalActions: s.totalActions + 1 };
    });
  }, [showBubble, spawnParticles]);

  // Actions
  const feed = useCallback((food) => {
    if (!state || isSleeping || wheelActive) return;
    if (state.coins < food.cost) { showBubble("코인이 부족해요!"); return; }
    if (state.hunger > 95) { showBubble("배가 불러요~"); return; }
    setMood("eating");
    setState((s) => ({
      ...s,
      hunger: clamp(s.hunger + food.hunger),
      happiness: clamp(s.happiness + food.happiness),
      coins: s.coins - food.cost,
    }));
    spawnParticles(food.emoji, 4);
    showBubble(MOODS.eating.msg);
    doBounce();
    gainXP(XP_PER_ACTION);
    setShowShop(false);
    setTimeout(() => setMood("happy"), 1500);
  }, [state, isSleeping, wheelActive, spawnParticles, showBubble, doBounce, gainXP]);

  const play = useCallback((toy) => {
    if (!state || isSleeping || wheelActive) return;
    if (state.coins < toy.cost) { showBubble("코인이 부족해요!"); return; }
    if (state.energy < 10) { showBubble("너무 피곤해요..."); return; }
    setMood("playing");
    setState((s) => ({
      ...s,
      happiness: clamp(s.happiness + toy.happiness),
      energy: clamp(s.energy + toy.energy),
      coins: s.coins - toy.cost,
    }));
    spawnParticles(toy.emoji, 4);
    showBubble(MOODS.playing.msg);
    doBounce();
    gainXP(XP_PER_ACTION);
    setShowShop(false);
    setTimeout(() => setMood("happy"), 2000);
  }, [state, isSleeping, wheelActive, spawnParticles, showBubble, doBounce, gainXP]);

  const sleep = useCallback(() => {
    if (!state || wheelActive) return;
    if (state.energy > 90) { showBubble("아직 안 졸려요~"); return; }
    setIsSleeping(true);
    showBubble(MOODS.sleeping.msg);
    spawnParticles("💤", 3);
    const timer = setInterval(() => {
      setState((s) => {
        if (s.energy >= 100) {
          clearInterval(timer);
          setIsSleeping(false);
          setMood("happy");
          showBubble("푹 잤어요! 상쾌~!");
          spawnParticles("☀️", 5);
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
    setState((s) => ({
      ...s,
      cleanliness: clamp(s.cleanliness + 35),
      happiness: clamp(s.happiness + 5),
    }));
    spawnParticles("🫧", 6);
    showBubble(MOODS.clean.msg);
    doBounce();
    gainXP(XP_PER_ACTION);
    setTimeout(() => setMood("happy"), 1500);
  }, [state, isSleeping, wheelActive, spawnParticles, showBubble, doBounce, gainXP]);

  // Wheel mini-game
  const startWheel = useCallback(() => {
    if (!state || isSleeping || wheelActive) return;
    if (state.energy < 15) { showBubble("너무 피곤해요..."); return; }
    setWheelActive(true);
    setWheelTaps(0);
    setWheelTime(WHEEL_DURATION);
    showBubble("빨리 탭하세요! 🏃");

    const start = Date.now();
    wheelTimerRef.current = setInterval(() => {
      const remaining = WHEEL_DURATION - (Date.now() - start);
      if (remaining <= 0) {
        clearInterval(wheelTimerRef.current);
        setWheelActive(false);
        setWheelTime(0);
        setWheelTaps((taps) => {
          const earned = Math.floor(taps * COIN_PER_TAP);
          setState((s) => ({
            ...s,
            coins: s.coins + earned,
            energy: clamp(s.energy - 15),
            happiness: clamp(s.happiness + 10),
          }));
          showBubble(`🎉 ${earned} 코인 획득!`);
          spawnParticles("🪙", 8);
          gainXP(XP_PER_ACTION * 2);
          return 0;
        });
      } else {
        setWheelTime(remaining);
      }
    }, 100);
  }, [state, isSleeping, wheelActive, showBubble, spawnParticles, gainXP]);

  const tapWheel = useCallback(() => {
    if (!wheelActive) return;
    setWheelTaps((t) => t + 1);
    doBounce();
  }, [wheelActive, doBounce]);

  // Pet (tap hamster)
  const petHamster = useCallback(() => {
    if (isSleeping || wheelActive) return;
    setState((s) => ({ ...s, happiness: clamp(s.happiness + 2) }));
    spawnParticles("❤️", 3);
    doBounce();
  }, [isSleeping, wheelActive, spawnParticles, doBounce]);

  // Rename
  const saveName = useCallback(() => {
    if (nameInput.trim()) {
      setState((s) => ({ ...s, name: nameInput.trim() }));
    }
    setNameEditing(false);
  }, [nameInput]);

  // Reset
  const resetGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setState(getDefaultState());
    setIsSleeping(false);
    setWheelActive(false);
    setShowShop(false);
    showBubble("새 햄스터를 입양했어요!");
    spawnParticles("🎀", 6);
  }, [showBubble, spawnParticles]);

  if (!state) return null;

  const moodData = MOODS[mood] || MOODS.idle;
  const overallHealth = Math.round((state.hunger + state.happiness + state.energy + state.cleanliness) / 4);
  const xpInLevel = state.xp % XP_PER_LEVEL;
  const title = TITLES[Math.min(state.level - 1, TITLES.length - 1)];

  // Hamster size grows with level
  const hamsterScale = 1 + Math.min(state.level - 1, 9) * 0.03;

  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: "radial-gradient(ellipse at 50% 30%, #2a1810 0%, #1a0e08 40%, #0c0604 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>

      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{ color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(12px)" }}>← 홈</Link>

      {/* Particles */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {particles.map((p) => (
          <span key={p.id} className="absolute text-2xl" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            animation: "particleFly 1.2s ease-out forwards",
            "--dx": `${p.dx}px`, "--dy": `${p.dy}px`,
          }}>{p.emoji}</span>
        ))}
      </div>

      <style>{`
        @keyframes particleFly {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0.3); }
        }
        @keyframes hamsterBounce {
          0%, 100% { transform: scale(${hamsterScale}) translateY(0); }
          50% { transform: scale(${hamsterScale * 1.1}) translateY(-12px); }
        }
        @keyframes hamsterIdle {
          0%, 100% { transform: scale(${hamsterScale}) translateY(0); }
          50% { transform: scale(${hamsterScale}) translateY(-4px); }
        }
        @keyframes hamsterSleep {
          0%, 100% { transform: scale(${hamsterScale}) translateY(0) rotate(-3deg); }
          50% { transform: scale(${hamsterScale}) translateY(2px) rotate(3deg); }
        }
        @keyframes wheelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bubbleIn {
          0% { opacity: 0; transform: translateY(8px) scale(0.8); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251,191,36,0.1); }
          50% { box-shadow: 0 0 30px rgba(251,191,36,0.2); }
        }
        @keyframes zzz {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          50% { opacity: 1; transform: translateY(-20px) scale(1); }
          100% { opacity: 0; transform: translateY(-40px) scale(0.5); }
        }
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
                <h1 className="text-2xl font-black" style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {state.name}
                </h1>
                <span className="text-[10px] group-hover:opacity-100 opacity-0 transition-opacity" style={{ color: "rgba(255,255,255,.2)" }}>탭하여 이름 변경</span>
              </button>
            )}
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.15)", color: "#fbbf24" }}>Lv.{state.level}</span>
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,.25)" }}>{title}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-center px-3 py-1.5 rounded-xl" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
              <span className="text-lg">🪙</span>
              <span className="text-sm font-bold tabular-nums ml-1 text-amber-300">{state.coins}</span>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-[10px] mb-1" style={{ color: "rgba(255,255,255,.2)" }}>
            <span>EXP</span>
            <span>{xpInLevel} / {XP_PER_LEVEL}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.04)" }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(xpInLevel / XP_PER_LEVEL) * 100}%`, background: "linear-gradient(90deg, #fbbf24, #f59e0b)" }} />
          </div>
        </div>

        {/* Hamster Area */}
        <div className="relative rounded-3xl p-6 mb-4" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", animation: "glow 4s ease-in-out infinite", minHeight: 260 }}>

          {/* Background decoration */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: "linear-gradient(to top, rgba(139,92,246,0.03), transparent)" }} />
            <div className="absolute top-4 right-4 text-3xl opacity-[0.04]">🌙</div>
          </div>

          {/* Speech Bubble */}
          {bubbleMsg && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-2xl text-[13px] font-medium whitespace-nowrap" style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(255,255,255,.7)", animation: "bubbleIn 0.3s ease-out", backdropFilter: "blur(8px)" }}>
              {bubbleMsg}
            </div>
          )}

          {/* Sleeping ZZZ */}
          {isSleeping && (
            <div className="absolute top-8 right-12 z-10">
              {[0, 0.4, 0.8].map((delay, i) => (
                <span key={i} className="absolute text-xl" style={{ animation: `zzz 2s ${delay}s ease-out infinite`, right: i * 15, top: -i * 8 }}>💤</span>
              ))}
            </div>
          )}

          {/* Hamster Character */}
          <div className="flex justify-center items-center py-6 relative">
            <button onClick={wheelActive ? tapWheel : petHamster} className="relative outline-none select-none" style={{
              animation: bounce ? `hamsterBounce 0.5s ease` : isSleeping ? `hamsterSleep 3s ease-in-out infinite` : `hamsterIdle 2.5s ease-in-out infinite`,
              cursor: "pointer", fontSize: 0,
            }}>
              {/* Hamster body */}
              <div className="relative">
                {/* Shadow */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full" style={{ background: "rgba(0,0,0,0.2)", filter: "blur(4px)" }} />

                {/* Main body */}
                <div className="relative" style={{ width: 100, height: 90 }}>
                  {/* Body */}
                  <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(ellipse at 45% 40%, #f5d0a9, #dba06a, #c4844c)", boxShadow: "inset 0 -8px 15px rgba(0,0,0,0.15), inset 0 4px 10px rgba(255,255,255,0.1)" }} />

                  {/* Belly */}
                  <div className="absolute rounded-full" style={{ width: 60, height: 50, bottom: 5, left: 20, background: "radial-gradient(ellipse, #fde8c8, #f5d0a9)", opacity: 0.8 }} />

                  {/* Left ear */}
                  <div className="absolute rounded-full" style={{ width: 22, height: 22, top: -6, left: 10, background: "radial-gradient(circle, #e8a87c, #c4844c)", boxShadow: "inset 0 2px 4px rgba(255,200,150,0.3)" }} />
                  <div className="absolute rounded-full" style={{ width: 12, height: 12, top: -1, left: 15, background: "#f5c0a0" }} />

                  {/* Right ear */}
                  <div className="absolute rounded-full" style={{ width: 22, height: 22, top: -6, right: 10, background: "radial-gradient(circle, #e8a87c, #c4844c)", boxShadow: "inset 0 2px 4px rgba(255,200,150,0.3)" }} />
                  <div className="absolute rounded-full" style={{ width: 12, height: 12, top: -1, right: 15, background: "#f5c0a0" }} />

                  {/* Eyes */}
                  {isSleeping ? (
                    <>
                      <div className="absolute" style={{ top: 28, left: 25, width: 14, height: 3, borderRadius: 2, background: "#4a3520" }} />
                      <div className="absolute" style={{ top: 28, right: 25, width: 14, height: 3, borderRadius: 2, background: "#4a3520" }} />
                    </>
                  ) : (
                    <>
                      <div className="absolute rounded-full" style={{ top: 24, left: 26, width: 14, height: 14, background: "#2a1a0a" }}>
                        <div className="absolute rounded-full" style={{ top: 2, left: 4, width: 5, height: 5, background: "#fff" }} />
                      </div>
                      <div className="absolute rounded-full" style={{ top: 24, right: 26, width: 14, height: 14, background: "#2a1a0a" }}>
                        <div className="absolute rounded-full" style={{ top: 2, left: 4, width: 5, height: 5, background: "#fff" }} />
                      </div>
                    </>
                  )}

                  {/* Cheeks */}
                  <div className="absolute rounded-full" style={{ top: 36, left: 8, width: 18, height: 14, background: "rgba(255,150,150,0.35)" }} />
                  <div className="absolute rounded-full" style={{ top: 36, right: 8, width: 18, height: 14, background: "rgba(255,150,150,0.35)" }} />

                  {/* Nose */}
                  <div className="absolute rounded-full" style={{ top: 38, left: "50%", marginLeft: -4, width: 8, height: 6, background: "#d4836a" }} />

                  {/* Mouth */}
                  {mood === "eating" ? (
                    <div className="absolute rounded-full" style={{ top: 46, left: "50%", marginLeft: -5, width: 10, height: 8, background: "#c4644c" }} />
                  ) : mood === "happy" || mood === "love" || mood === "playing" ? (
                    <div className="absolute" style={{ top: 46, left: "50%", marginLeft: -6, width: 12, height: 6, borderBottom: "2px solid #c4844c", borderRadius: "0 0 6px 6px" }} />
                  ) : (
                    <div className="absolute" style={{ top: 48, left: "50%", marginLeft: -3, width: 6, height: 2, borderRadius: 1, background: "#c4844c" }} />
                  )}

                  {/* Paws */}
                  <div className="absolute rounded-full" style={{ bottom: -2, left: 18, width: 16, height: 10, background: "#dba06a" }} />
                  <div className="absolute rounded-full" style={{ bottom: -2, right: 18, width: 16, height: 10, background: "#dba06a" }} />
                </div>
              </div>

              {/* Wheel overlay when running */}
              {wheelActive && (
                <div className="absolute -right-16 top-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 rounded-full border-2" style={{ borderColor: "rgba(251,191,36,0.3)", animation: `wheelSpin ${Math.max(0.2, 1 - wheelTaps * 0.01)}s linear infinite` }}>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">☸️</div>
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* Mood indicator */}
          <div className="text-center">
            <span className="text-2xl">{moodData.face}</span>
            <p className="text-[12px] mt-1" style={{ color: moodData.color }}>{moodData.msg}</p>
          </div>

          {/* Wheel mini-game overlay */}
          {wheelActive && (
            <div className="mt-3 text-center">
              <div className="text-sm font-bold text-amber-300 mb-1">🏃 쳇바퀴 타임! 빨리 탭하세요!</div>
              <div className="flex items-center justify-center gap-4">
                <span className="text-xs" style={{ color: "rgba(255,255,255,.3)" }}>{(wheelTime / 1000).toFixed(1)}초</span>
                <span className="text-lg font-black text-amber-400">{wheelTaps} 탭</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,.3)" }}>≈ {wheelTaps * COIN_PER_TAP} 코인</span>
              </div>
            </div>
          )}
        </div>

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

        {/* Overall Health */}
        <div className="rounded-2xl p-3 mb-4 text-center" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)" }}>
          <span className="text-[11px]" style={{ color: "rgba(255,255,255,.25)" }}>종합 건강</span>
          <span className="text-lg font-black ml-2" style={{ color: overallHealth > 70 ? "#4ade80" : overallHealth > 40 ? "#fbbf24" : "#ef4444" }}>{overallHealth}%</span>
        </div>

        {/* Action Buttons */}
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

        {/* Shop Button */}
        <button onClick={() => setShowShop(!showShop)}
          className="w-full rounded-2xl py-3 mb-4 text-center font-semibold text-[13px] transition-all active:scale-[0.98]"
          style={{ background: showShop ? "rgba(251,191,36,0.15)" : "rgba(255,255,255,.03)", border: `1px solid ${showShop ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,.06)"}`, color: showShop ? "#fbbf24" : "rgba(255,255,255,.4)" }}>
          🏪 {showShop ? "상점 닫기" : "상점 열기"}
        </button>

        {/* Shop */}
        {showShop && (
          <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)" }}>
            <div className="flex gap-2 mb-3">
              {[{ id: "food", label: "🍽️ 먹이" }, { id: "toy", label: "🎮 장난감" }].map((tab) => (
                <button key={tab.id} onClick={() => setShopTab(tab.id)}
                  className="flex-1 py-2 rounded-xl text-[12px] font-medium transition-all"
                  style={{ background: shopTab === tab.id ? "rgba(251,191,36,0.1)" : "transparent", color: shopTab === tab.id ? "#fbbf24" : "rgba(255,255,255,.3)", border: shopTab === tab.id ? "1px solid rgba(251,191,36,0.15)" : "1px solid transparent" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {(shopTab === "food" ? FOODS : TOYS).map((item) => (
                <button key={item.id} onClick={() => shopTab === "food" ? feed(item) : play(item)}
                  disabled={state.coins < item.cost || isSleeping || wheelActive}
                  className="w-full flex items-center justify-between p-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-40"
                  style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="text-left">
                      <div className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,.6)" }}>{item.name}</div>
                      <div className="text-[10px]" style={{ color: "rgba(255,255,255,.2)" }}>
                        {shopTab === "food" ? `포만감 +${item.hunger} 행복 +${item.happiness}` : `행복 +${item.happiness} 에너지 ${item.energy}`}
                      </div>
                    </div>
                  </div>
                  <span className="text-[12px] font-bold" style={{ color: state.coins >= item.cost ? "#fbbf24" : "#ef4444" }}>
                    {item.cost === 0 ? "무료" : `🪙 ${item.cost}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)" }}>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-[10px]" style={{ color: "rgba(255,255,255,.2)" }}>함께한 날</div>
              <div className="text-sm font-bold text-amber-300">{Math.max(1, Math.floor((Date.now() - state.createdAt) / 86400000))}일</div>
            </div>
            <div>
              <div className="text-[10px]" style={{ color: "rgba(255,255,255,.2)" }}>돌봄 횟수</div>
              <div className="text-sm font-bold text-amber-300">{state.totalActions}회</div>
            </div>
            <div>
              <div className="text-[10px]" style={{ color: "rgba(255,255,255,.2)" }}>레벨</div>
              <div className="text-sm font-bold text-amber-300">Lv.{state.level}</div>
            </div>
          </div>
        </div>

        {/* Reset */}
        <button onClick={() => { if (confirm("정말 새 햄스터를 입양할까요? 현재 진행이 초기화됩니다.")) resetGame(); }}
          className="w-full rounded-2xl py-2.5 text-center text-[11px] transition-all active:scale-[0.98]"
          style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.08)", color: "rgba(239,68,68,.4)" }}>
          🐹 새 햄스터 입양하기
        </button>

        <div className="mt-6 text-center text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,.08)" }}>
          <p>🐹 햄스터를 탭하면 쓰다듬을 수 있어요</p>
          <p>쳇바퀴 미니게임으로 코인을 모아보세요</p>
        </div>
      </div>
    </div>
  );
}
