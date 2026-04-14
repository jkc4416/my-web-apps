"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const W = 400;
const H = 600;
const GRAVITY = 0.225;
const JUMP = -3.75;
const PIPE_W = 60;
const GAP = 160;
const BASE_PIPE_SPEED = 2.5;
const BIRD_X = 80;
const BIRD_R = 16;
const MAX_HP = 3;
const ITEM_SIZE = 20;
const SEED_SIZE = 12;
const ITEM_SPAWN_CHANCE = 0.25;
const SEED_COUNT_PER_PIPE = 3;
const EFFECT_DURATION = 300;
const INVINCIBLE_FRAMES = 90;
const SHOP_INTERVAL = 30;
const MAGNET_RANGE = 120;

const ITEMS = [
  { type: "shield", emoji: "🛡️", color: "#60a5fa", desc: "보호막" },
  { type: "health", emoji: "❤️", color: "#ef4444", desc: "체력 회복" },
  { type: "speed2x", emoji: "⚡", color: "#fbbf24", desc: "2배속" },
  { type: "slow", emoji: "🐌", color: "#a78bfa", desc: "슬로우" },
  { type: "tiny", emoji: "🔹", color: "#34d399", desc: "작아지기" },
  { type: "magnet", emoji: "🧲", color: "#f472b6", desc: "아이템 자석" },
];

const SHOP_ITEMS = [
  { id: "extraHP", name: "체력 +1", emoji: "💖", cost: 20, desc: "최대 체력 +1 (이번 판)" },
  { id: "wideGap", name: "넓은 파이프", emoji: "↔️", cost: 15, desc: "파이프 간격 확대 (30초)" },
  { id: "shield", name: "보호막", emoji: "🛡️", cost: 25, desc: "즉시 보호막 획득" },
  { id: "doubleSeeds", name: "새모이 2배", emoji: "🌾", cost: 10, desc: "새모이 획득량 2배 (30초)" },
  { id: "revive", name: "부활권", emoji: "👼", cost: 50, desc: "다음 사망 시 부활 (1회)" },
];

function createPipe(x, gapOverride) {
  const gap = gapOverride || GAP;
  const minTop = 70;
  const maxTop = H - gap - 70;
  const top = Math.floor(Math.random() * (maxTop - minTop)) + minTop;
  let item = null;
  if (Math.random() < ITEM_SPAWN_CHANCE) {
    const it = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    item = { type: it.type, emoji: it.emoji, color: it.color, y: top + gap * 0.5, collected: false };
  }
  // Seeds (bird food) scattered in the gap
  const seeds = [];
  for (let i = 0; i < SEED_COUNT_PER_PIPE; i++) {
    seeds.push({ x: x + PIPE_W / 2 + (Math.random() - 0.5) * 30, y: top + gap * (0.2 + i * 0.25) + (Math.random() - 0.5) * 15, collected: false });
  }
  return { x, top, gap, scored: false, item, seeds };
}

export default function FlappyPage() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("idle"); // idle | playing | shop | over
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [hp, setHp] = useState(MAX_HP);
  const [coins, setCoins] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [activeEffects, setActiveEffects] = useState([]);
  const [shopOpen, setShopOpen] = useState(false);
  const [shopMsg, setShopMsg] = useState("");

  const birdRef = useRef({ y: H / 2, vel: 0, rot: 0 });
  const pipesRef = useRef([]);
  const scoreRef = useRef(0);
  const hpRef = useRef(MAX_HP);
  const maxHpRef = useRef(MAX_HP);
  const coinsRef = useRef(0);
  const frameRef = useRef(0);
  const loopRef = useRef(null);
  const gameStateRef = useRef("idle");
  const effectsRef = useRef([]);
  const invincibleRef = useRef(0);
  const speedMultRef = useRef(1);
  const birdSizeRef = useRef(1);
  const gapOverrideRef = useRef(null);
  const seedMultRef = useRef(1);
  const hasReviveRef = useRef(false);
  const pipeCountRef = useRef(0);
  const nextShopRef = useRef(SHOP_INTERVAL);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("flappy-high-score");
      if (saved) setHighScore(Number(saved));
      const tc = localStorage.getItem("flappy-coins");
      if (tc) { setTotalCoins(Number(tc)); coinsRef.current = Number(tc); setCoins(Number(tc)); }
    } catch {}
  }, []);

  const saveCoins = useCallback((c) => {
    setCoins(c); setTotalCoins(c); coinsRef.current = c;
    try { localStorage.setItem("flappy-coins", String(c)); } catch {}
  }, []);

  const syncEffects = useCallback(() => {
    const frame = frameRef.current;
    effectsRef.current = effectsRef.current.filter(e => e.endFrame > frame);
    setActiveEffects(effectsRef.current.map(e => e.type));
    let speed = 1;
    if (effectsRef.current.some(e => e.type === "speed2x")) speed *= 2;
    if (effectsRef.current.some(e => e.type === "slow")) speed *= 0.5;
    speedMultRef.current = speed;
    birdSizeRef.current = effectsRef.current.some(e => e.type === "tiny") ? 0.6 : 1;
    seedMultRef.current = effectsRef.current.some(e => e.type === "doubleSeeds") ? 2 : 1;
  }, []);

  const applyItem = useCallback((type) => {
    const frame = frameRef.current;
    if (type === "health") {
      if (hpRef.current < maxHpRef.current) { hpRef.current++; setHp(hpRef.current); }
      return;
    }
    effectsRef.current = effectsRef.current.filter(e => e.type !== type);
    effectsRef.current.push({ type, endFrame: frame + EFFECT_DURATION });
  }, []);

  const buyShopItem = useCallback((item) => {
    if (coinsRef.current < item.cost) { setShopMsg("새모이가 부족해요!"); return; }
    coinsRef.current -= item.cost;
    saveCoins(coinsRef.current);
    const frame = frameRef.current;
    switch (item.id) {
      case "extraHP": maxHpRef.current++; hpRef.current++; setHp(hpRef.current); break;
      case "wideGap": gapOverrideRef.current = GAP + 40; effectsRef.current.push({ type: "wideGap", endFrame: frame + 1800 }); break;
      case "shield": effectsRef.current = effectsRef.current.filter(e => e.type !== "shield"); effectsRef.current.push({ type: "shield", endFrame: frame + EFFECT_DURATION }); break;
      case "doubleSeeds": effectsRef.current = effectsRef.current.filter(e => e.type !== "doubleSeeds"); effectsRef.current.push({ type: "doubleSeeds", endFrame: frame + 1800 }); break;
      case "revive": hasReviveRef.current = true; break;
    }
    setShopMsg(`${item.emoji} ${item.name} 구매 완료!`);
    setTimeout(() => setShopMsg(""), 1500);
  }, [saveCoins]);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const bird = birdRef.current;
    const pipes = pipesRef.current;
    const frame = frameRef.current;
    const birdScale = birdSizeRef.current;
    const hasShield = effectsRef.current.some(e => e.type === "shield" && e.endFrame > frame);
    const hasMagnet = effectsRef.current.some(e => e.type === "magnet" && e.endFrame > frame);

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#0c1222"); sky.addColorStop(0.6, "#1a1040"); sky.addColorStop(1, "#0a0a18");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

    // Stars
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    for (let i = 0; i < 40; i++) { ctx.beginPath(); ctx.arc((i * 97 + frame * 0.1) % W, (i * 53) % (H * 0.6), ((i * 7) % 3) * 0.3 + 0.5, 0, Math.PI * 2); ctx.fill(); }

    // Ground
    const groundY = H - 40;
    ctx.fillStyle = "#1a1a2e"; ctx.fillRect(0, groundY, W, 40);
    const pipeSpeed = BASE_PIPE_SPEED * speedMultRef.current;
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    for (let i = 0; i < W / 20 + 1; i++) { const gx = ((i * 20 - (frame * pipeSpeed) % 20) + W) % W; ctx.fillRect(gx, groundY + 5, 10, 2); }

    // Pipes + items + seeds
    pipes.forEach((pipe) => {
      const topGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_W, 0);
      topGrad.addColorStop(0, "#2d1b69"); topGrad.addColorStop(0.5, "#4c2d8a"); topGrad.addColorStop(1, "#2d1b69");
      ctx.fillStyle = topGrad;
      ctx.beginPath(); ctx.roundRect(pipe.x, 0, PIPE_W, pipe.top, [0, 0, 8, 8]); ctx.fill();
      ctx.fillStyle = "#6b3fa0";
      ctx.beginPath(); ctx.roundRect(pipe.x - 4, pipe.top - 20, PIPE_W + 8, 20, [6, 6, 0, 0]); ctx.fill();

      const bottomY = pipe.top + pipe.gap;
      const botGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_W, 0);
      botGrad.addColorStop(0, "#2d1b69"); botGrad.addColorStop(0.5, "#4c2d8a"); botGrad.addColorStop(1, "#2d1b69");
      ctx.fillStyle = botGrad;
      ctx.beginPath(); ctx.roundRect(pipe.x, bottomY, PIPE_W, H - bottomY - 40, [8, 8, 0, 0]); ctx.fill();
      ctx.fillStyle = "#6b3fa0";
      ctx.beginPath(); ctx.roundRect(pipe.x - 4, bottomY, PIPE_W + 8, 20, [0, 0, 6, 6]); ctx.fill();

      // Seeds
      pipe.seeds.forEach((seed) => {
        if (seed.collected) return;
        ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 6;
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath(); ctx.arc(seed.x, seed.y + Math.sin(frame * 0.06 + seed.x) * 2, SEED_SIZE / 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath(); ctx.arc(seed.x, seed.y + Math.sin(frame * 0.06 + seed.x) * 2, SEED_SIZE / 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Item
      if (pipe.item && !pipe.item.collected) {
        const ix = pipe.x + PIPE_W / 2;
        const iy = pipe.item.y + Math.sin(frame * 0.08) * 4;
        // Magnet attraction line
        if (hasMagnet) {
          const dist = Math.sqrt((BIRD_X - ix) ** 2 + (bird.y - iy) ** 2);
          if (dist < MAGNET_RANGE) {
            ctx.strokeStyle = `rgba(244,114,182,${0.15 * (1 - dist / MAGNET_RANGE)})`;
            ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
            ctx.beginPath(); ctx.moveTo(BIRD_X, bird.y); ctx.lineTo(ix, iy); ctx.stroke();
            ctx.setLineDash([]);
          }
        }
        ctx.shadowColor = pipe.item.color; ctx.shadowBlur = 12;
        ctx.font = `${ITEM_SIZE}px sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(pipe.item.emoji, ix, iy);
        ctx.shadowBlur = 0;
      }
    });

    // Bird
    ctx.save();
    ctx.translate(BIRD_X, bird.y);
    ctx.rotate(Math.min(Math.max(bird.rot, -0.5), 1.2));
    ctx.scale(birdScale, birdScale);

    if (hasShield) {
      ctx.strokeStyle = "rgba(96,165,250,0.4)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, BIRD_R + 6, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "rgba(96,165,250,0.08)"; ctx.fill();
    }
    if (hasMagnet) {
      ctx.strokeStyle = "rgba(244,114,182,0.25)"; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.arc(0, 0, MAGNET_RANGE * 0.3, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
    }

    if (invincibleRef.current > 0 && Math.floor(frame / 4) % 2 === 0) ctx.globalAlpha = 0.4;

    ctx.shadowColor = "#fbbf24"; ctx.shadowBlur = 20;
    const bodyGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, BIRD_R);
    bodyGrad.addColorStop(0, "#fde68a"); bodyGrad.addColorStop(0.7, "#f59e0b"); bodyGrad.addColorStop(1, "#d97706");
    ctx.fillStyle = bodyGrad;
    ctx.beginPath(); ctx.ellipse(0, 0, BIRD_R, BIRD_R * 0.85, 0, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath(); ctx.ellipse(-4, Math.sin(frame * 0.15) * 3 + 2, 10, 6, -0.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(7, -4, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1a1a2e"; ctx.beginPath(); ctx.arc(8, -4, 2.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ef4444"; ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(20, 2); ctx.lineTo(12, 5); ctx.closePath(); ctx.fill();

    ctx.globalAlpha = 1;
    ctx.restore();

    // HUD
    if (gameStateRef.current === "playing") {
      ctx.textAlign = "left";
      for (let i = 0; i < maxHpRef.current; i++) { ctx.font = "16px sans-serif"; ctx.fillText(i < hpRef.current ? "❤️" : "🖤", 10 + i * 22, 28); }
      // Coins
      ctx.font = "bold 14px sans-serif"; ctx.fillStyle = "#fbbf24"; ctx.textAlign = "left";
      ctx.fillText(`🌾 ${coinsRef.current}`, 10, 52);
      // Score
      ctx.fillStyle = "rgba(255,255,255,0.15)"; ctx.font = "bold 56px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(String(scoreRef.current), W / 2, 85);
      // Next shop
      const untilShop = nextShopRef.current - pipeCountRef.current;
      if (untilShop <= 10 && untilShop > 0) {
        ctx.font = "bold 12px sans-serif"; ctx.fillStyle = "rgba(251,191,36,0.4)"; ctx.textAlign = "center";
        ctx.fillText(`🏪 상점까지 ${untilShop}`, W / 2, 110);
      }
      // Effects
      const activeNow = effectsRef.current.filter(e => e.endFrame > frame);
      activeNow.forEach((eff, i) => {
        const it = ITEMS.find(x => x.type === eff.type) || SHOP_ITEMS.find(x => x.id === eff.type);
        if (!it) return;
        const rem = Math.ceil((eff.endFrame - frame) / 60);
        ctx.font = "12px sans-serif"; ctx.textAlign = "right"; ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fillText(`${it.emoji || "✦"} ${rem}s`, W - 10, 24 + i * 18);
      });
      if (hasReviveRef.current) {
        ctx.font = "12px sans-serif"; ctx.textAlign = "right"; ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillText("👼 부활권", W - 10, 24 + effectsRef.current.length * 18);
      }
    }
  }, []);

  const tick = useCallback(() => {
    const bird = birdRef.current;
    const pipes = pipesRef.current;
    frameRef.current++;
    const frame = frameRef.current;
    const pipeSpeed = BASE_PIPE_SPEED * speedMultRef.current;
    const birdScale = birdSizeRef.current;
    const hasMagnet = effectsRef.current.some(e => e.type === "magnet" && e.endFrame > frame);

    // Check wideGap expiry
    if (gapOverrideRef.current && !effectsRef.current.some(e => e.type === "wideGap" && e.endFrame > frame)) {
      gapOverrideRef.current = null;
    }

    if (invincibleRef.current > 0) invincibleRef.current--;

    bird.vel += GRAVITY;
    bird.y += bird.vel;
    bird.rot = bird.vel * 0.06;

    // Bird fell off screen bottom → instant death
    if (bird.y > H + BIRD_R * 2) {
      gameStateRef.current = "over"; setGameState("over");
      setHighScore((prev) => { const best = Math.max(prev, scoreRef.current); try { localStorage.setItem("flappy-high-score", String(best)); } catch {} return best; });
      return;
    }

    pipes.forEach((pipe) => { pipe.x -= pipeSpeed; pipe.seeds.forEach(s => { s.x -= pipeSpeed; }); });
    while (pipes.length > 0 && pipes[0].x < -PIPE_W) pipes.shift();

    const lastPipe = pipes[pipes.length - 1];
    if (!lastPipe || lastPipe.x < W - 220) {
      pipes.push(createPipe(W + 20, gapOverrideRef.current));
    }

    // Score
    pipes.forEach((pipe) => {
      if (!pipe.scored && pipe.x + PIPE_W < BIRD_X) {
        pipe.scored = true; scoreRef.current++; pipeCountRef.current++; setScore(scoreRef.current);
        // Check shop trigger
        if (pipeCountRef.current >= nextShopRef.current) {
          nextShopRef.current += SHOP_INTERVAL;
          gameStateRef.current = "shop"; setGameState("shop"); setShopOpen(true);
        }
      }
    });

    // Seed + item collection
    pipes.forEach((pipe) => {
      pipe.seeds.forEach((seed) => {
        if (seed.collected) return;
        const dist = Math.sqrt((BIRD_X - seed.x) ** 2 + (bird.y - seed.y) ** 2);
        const collectRange = hasMagnet ? MAGNET_RANGE : (BIRD_R * birdScale + SEED_SIZE);
        if (dist < collectRange) {
          seed.collected = true;
          const gain = 1 * seedMultRef.current;
          coinsRef.current += gain; setCoins(coinsRef.current);
        }
      });
      if (pipe.item && !pipe.item.collected) {
        const ix = pipe.x + PIPE_W / 2;
        const iy = pipe.item.y;
        const dist = Math.sqrt((BIRD_X - ix) ** 2 + (bird.y - iy) ** 2);
        const collectRange = hasMagnet ? MAGNET_RANGE : (BIRD_R * birdScale + ITEM_SIZE * 0.6);
        if (dist < collectRange) {
          pipe.item.collected = true;
          applyItem(pipe.item.type);
        }
      }
    });

    // Collision
    const groundY = H - 40;
    const hitR = BIRD_R * birdScale * 0.7;
    let hit = false;
    if (bird.y + hitR > groundY || bird.y - hitR < 0) hit = true;
    if (!hit) {
      pipes.forEach((pipe) => {
        if (BIRD_X + hitR > pipe.x && BIRD_X - hitR < pipe.x + PIPE_W) {
          if (bird.y - hitR < pipe.top || bird.y + hitR > pipe.top + pipe.gap) hit = true;
        }
      });
    }

    if (hit) {
      const hasShield = effectsRef.current.some(e => e.type === "shield" && e.endFrame > frame);
      if (hasShield) {
        effectsRef.current = effectsRef.current.filter(e => e.type !== "shield");
        invincibleRef.current = INVINCIBLE_FRAMES;
      } else if (invincibleRef.current <= 0) {
        hpRef.current--; setHp(hpRef.current);
        if (hpRef.current <= 0) {
          if (hasReviveRef.current) {
            hasReviveRef.current = false;
            hpRef.current = 1; setHp(1);
            invincibleRef.current = INVINCIBLE_FRAMES * 2;
            bird.vel = JUMP;
            bird.y = Math.min(bird.y, H / 2);
          } else {
            gameStateRef.current = "over"; setGameState("over");
            saveCoins(coinsRef.current);
            setHighScore((prev) => { const best = Math.max(prev, scoreRef.current); try { localStorage.setItem("flappy-high-score", String(best)); } catch {} return best; });
            return;
          }
        } else {
          invincibleRef.current = INVINCIBLE_FRAMES;
          bird.vel = JUMP * 0.7;
        }
      }
    }

    syncEffects();
    draw();
  }, [draw, applyItem, syncEffects, saveCoins]);

  const jump = useCallback(() => {
    if (gameStateRef.current === "playing") birdRef.current.vel = JUMP;
  }, []);

  const startGame = useCallback(() => {
    birdRef.current = { y: H / 2, vel: 0, rot: 0 };
    pipesRef.current = [createPipe(W + 100, null)];
    scoreRef.current = 0; hpRef.current = MAX_HP; maxHpRef.current = MAX_HP;
    frameRef.current = 0; pipeCountRef.current = 0; nextShopRef.current = SHOP_INTERVAL;
    effectsRef.current = []; invincibleRef.current = 0; speedMultRef.current = 1;
    birdSizeRef.current = 1; gapOverrideRef.current = null; seedMultRef.current = 1;
    hasReviveRef.current = false;
    setScore(0); setHp(MAX_HP); setActiveEffects([]); setShopOpen(false);
    gameStateRef.current = "playing"; setGameState("playing");
    draw();
  }, [draw]);

  const resumeFromShop = useCallback(() => {
    setShopOpen(false);
    gameStateRef.current = "playing"; setGameState("playing");
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") { if (loopRef.current) cancelAnimationFrame(loopRef.current); return; }
    let lastTime = 0;
    const loop = (ts) => {
      if (gameStateRef.current !== "playing") return;
      const delta = ts - lastTime;
      if (delta >= 1000 / 60) { lastTime = ts - (delta % (1000 / 60)); tick(); }
      loopRef.current = requestAnimationFrame(loop);
    };
    loopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(loopRef.current);
  }, [gameState, tick]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        if (gameStateRef.current === "playing") jump();
        else if (gameStateRef.current === "idle" || gameStateRef.current === "over") startGame();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [jump, startGame]);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const handleTouch = (e) => {
      e.preventDefault();
      if (gameStateRef.current === "playing") jump();
      else if (gameStateRef.current === "idle" || gameStateRef.current === "over") startGame();
    };
    canvas.addEventListener("touchstart", handleTouch, { passive: false });
    canvas.addEventListener("mousedown", handleTouch);
    return () => { canvas.removeEventListener("touchstart", handleTouch); canvas.removeEventListener("mousedown", handleTouch); };
  }, [jump, startGame]);

  useEffect(() => {
    if (gameState !== "idle") return;
    let f = 0;
    const idle = () => { f++; birdRef.current.y = H / 2 + Math.sin(f * 0.04) * 15; birdRef.current.rot = Math.sin(f * 0.04) * 0.1; frameRef.current = f; draw(); loopRef.current = requestAnimationFrame(idle); };
    loopRef.current = requestAnimationFrame(idle);
    return () => cancelAnimationFrame(loopRef.current);
  }, [gameState, draw]);

  return (
    <div className="min-h-screen text-white flex flex-col items-center relative" style={{ background: "radial-gradient(ellipse at 50% 0%, #1a1040 0%, #0c0820 40%, #06040f 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{ color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(12px)" }}>← 홈</Link>

      <div className="w-full max-w-[440px] px-5 pt-14 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Flappy Bird</h1>
            <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,.2)" }}>
              {gameState === "playing" ? "새모이를 모아 상점에서 강화!" : gameState === "shop" ? "🏪 상점 오픈!" : gameState === "over" ? "게임 오버!" : "탭으로 시작 | 30파이프마다 상점"}
            </p>
          </div>
          <div className="flex gap-2">
            <div className="text-center px-2.5 py-1 rounded-xl" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
              <div className="text-[8px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,.15)" }}>점수</div>
              <div className="text-base font-black tabular-nums text-amber-400">{score}</div>
            </div>
            <div className="text-center px-2.5 py-1 rounded-xl" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
              <div className="text-[8px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,.15)" }}>최고</div>
              <div className="text-base font-black tabular-nums text-purple-400">{highScore}</div>
            </div>
            <div className="text-center px-2.5 py-1 rounded-xl" style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,.1)" }}>
              <div className="text-[8px] uppercase tracking-widest" style={{ color: "rgba(251,191,36,.3)" }}>🌾</div>
              <div className="text-base font-black tabular-nums text-amber-300">{coins}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-0.5">{Array.from({ length: maxHpRef.current }, (_, i) => <span key={i} className="text-sm">{i < hp ? "❤️" : "🖤"}</span>)}</div>
          {activeEffects.length > 0 && <div className="flex gap-1">{activeEffects.map((t) => { const it = ITEMS.find(x => x.type === t); return it ? <span key={t} className="text-xs" title={it.desc}>{it.emoji}</span> : null; })}</div>}
        </div>
      </div>

      {/* Canvas */}
      <div className="relative">
        <canvas ref={canvasRef} width={W} height={H} className="rounded-2xl" style={{ border: "1px solid rgba(255,255,255,.06)", boxShadow: "0 0 40px rgba(124,58,237,0.08)", touchAction: "none", cursor: "pointer", maxWidth: "calc(100vw - 40px)", height: "auto" }} />

        {/* Overlays */}
        {gameState === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
            <div className="text-6xl mb-4" style={{ animation: "pulse 2s ease-in-out infinite" }}>🐤</div>
            <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,.3)" }}>파이프 사이를 통과하세요!</p>
            <p className="text-[11px] mb-4" style={{ color: "rgba(255,255,255,.2)" }}>❤️×3 | 🌾 새모이 수집 | 🏪 30파이프마다 상점</p>
            <button onClick={startGame} className="px-8 py-3 rounded-2xl font-bold text-[15px] transition-all active:scale-95" style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#000" }}>게임 시작</button>
          </div>
        )}

        {gameState === "over" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
            <div className="text-5xl mb-3">💥</div>
            <div className="text-3xl font-black text-red-400 mb-1">Game Over</div>
            <div className="text-sm mb-4" style={{ color: "rgba(255,255,255,.4)" }}>
              점수: {score} | 새모이: {coins}🌾
              {score >= highScore && score > 0 && <span className="text-yellow-400 ml-2">🏆</span>}
            </div>
            <button onClick={startGame} className="px-8 py-3 rounded-2xl font-bold text-[15px] transition-all active:scale-95" style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#000" }}>다시 하기</button>
          </div>
        )}

        {/* Shop overlay */}
        {shopOpen && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
            <div className="text-3xl mb-2">🏪</div>
            <div className="text-xl font-black mb-1 text-amber-300">상점</div>
            <div className="text-[12px] mb-3" style={{ color: "rgba(255,255,255,.3)" }}>🌾 {coinsRef.current} 보유</div>
            {shopMsg && <div className="text-[12px] mb-2 text-emerald-400 font-bold">{shopMsg}</div>}
            <div className="space-y-1.5 w-[85%] max-h-[280px] overflow-y-auto mb-3">
              {SHOP_ITEMS.map((item) => (
                <button key={item.id} onClick={() => buyShopItem(item)} disabled={coinsRef.current < item.cost}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all active:scale-[0.97] disabled:opacity-30"
                  style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.emoji}</span>
                    <div>
                      <div className="text-[12px] font-bold" style={{ color: "rgba(255,255,255,.6)" }}>{item.name}</div>
                      <div className="text-[9px]" style={{ color: "rgba(255,255,255,.2)" }}>{item.desc}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold" style={{ color: coinsRef.current >= item.cost ? "#fbbf24" : "#ef4444" }}>🌾{item.cost}</span>
                </button>
              ))}
            </div>
            <button onClick={resumeFromShop} className="px-6 py-2.5 rounded-2xl font-bold text-[14px] transition-all active:scale-95" style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#000" }}>
              계속 플레이 →
            </button>
          </div>
        )}
      </div>

      {/* Item legend */}
      <div className="w-full max-w-[440px] px-5 mt-3">
        <div className="flex flex-wrap gap-1.5 justify-center">
          {ITEMS.map((item) => <span key={item.type} className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: `${item.color}10`, border: `1px solid ${item.color}20`, color: `${item.color}80` }}>{item.emoji} {item.desc}</span>)}
          <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(251,191,36,.08)", border: "1px solid rgba(251,191,36,.15)", color: "rgba(251,191,36,.6)" }}>🌾 새모이=코인</span>
        </div>
      </div>
      <div className="mt-3 pb-6 text-center text-[10px]" style={{ color: "rgba(255,255,255,.06)" }}>
        <p>❤️×3 | 🌾 새모이 수집 | 🏪 30파이프마다 상점</p>
      </div>
    </div>
  );
}
