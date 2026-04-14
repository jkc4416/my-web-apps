"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const W = 400;
const H = 600;
const GRAVITY = 0.225; // halved from 0.45
const JUMP = -3.75;
const PIPE_W = 60;
const GAP = 160;
const BASE_PIPE_SPEED = 2.5;
const BIRD_X = 80;
const BIRD_R = 16;
const MAX_HP = 3;
const ITEM_SIZE = 20;
const ITEM_SPAWN_CHANCE = 0.3; // 30% chance per pipe
const EFFECT_DURATION = 300; // frames (~5 seconds at 60fps)
const INVINCIBLE_FRAMES = 90; // 1.5s invincibility after hit

const ITEMS = [
  { type: "shield", emoji: "🛡️", color: "#60a5fa", desc: "보호막" },
  { type: "health", emoji: "❤️", color: "#ef4444", desc: "체력 회복" },
  { type: "speed2x", emoji: "⚡", color: "#fbbf24", desc: "2배속" },
  { type: "slow", emoji: "🐌", color: "#a78bfa", desc: "슬로우" },
  { type: "tiny", emoji: "🔹", color: "#34d399", desc: "작아지기" },
  { type: "magnet", emoji: "🧲", color: "#f472b6", desc: "자동 점수" },
];

function createPipe(x) {
  const minTop = 80;
  const maxTop = H - GAP - 80;
  const top = Math.floor(Math.random() * (maxTop - minTop)) + minTop;
  // Maybe spawn an item in the gap
  let item = null;
  if (Math.random() < ITEM_SPAWN_CHANCE) {
    const itemType = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    item = {
      type: itemType.type,
      emoji: itemType.emoji,
      color: itemType.color,
      y: top + GAP * 0.3 + Math.random() * GAP * 0.4,
      collected: false,
    };
  }
  return { x, top, scored: false, item };
}

export default function FlappyPage() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [hp, setHp] = useState(MAX_HP);
  const [activeEffects, setActiveEffects] = useState([]);

  const birdRef = useRef({ y: H / 2, vel: 0, rot: 0 });
  const pipesRef = useRef([]);
  const scoreRef = useRef(0);
  const hpRef = useRef(MAX_HP);
  const frameRef = useRef(0);
  const loopRef = useRef(null);
  const gameStateRef = useRef("idle");
  const effectsRef = useRef([]); // { type, endFrame }
  const invincibleRef = useRef(0); // invincibility frames after hit
  const speedMultRef = useRef(1);
  const birdSizeRef = useRef(1); // 1 = normal, 0.6 = tiny

  useEffect(() => {
    try { const saved = localStorage.getItem("flappy-high-score"); if (saved) setHighScore(Number(saved)); } catch {}
  }, []);

  // Sync active effects to state for HUD display
  const syncEffects = useCallback(() => {
    const frame = frameRef.current;
    const active = effectsRef.current.filter(e => e.endFrame > frame);
    effectsRef.current = active;
    setActiveEffects(active.map(e => e.type));

    // Calculate current speed multiplier
    let speed = 1;
    if (active.some(e => e.type === "speed2x")) speed *= 2;
    if (active.some(e => e.type === "slow")) speed *= 0.5;
    speedMultRef.current = speed;

    // Bird size
    birdSizeRef.current = active.some(e => e.type === "tiny") ? 0.6 : 1;
  }, []);

  const applyItem = useCallback((type) => {
    const frame = frameRef.current;
    if (type === "health") {
      if (hpRef.current < MAX_HP) {
        hpRef.current++;
        setHp(hpRef.current);
      }
      return;
    }
    if (type === "shield" || type === "speed2x" || type === "slow" || type === "tiny" || type === "magnet") {
      // Remove existing same-type effect and add new
      effectsRef.current = effectsRef.current.filter(e => e.type !== type);
      effectsRef.current.push({ type, endFrame: frame + EFFECT_DURATION });
    }
  }, []);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const bird = birdRef.current;
    const pipes = pipesRef.current;
    const frame = frameRef.current;
    const birdScale = birdSizeRef.current;
    const hasShield = effectsRef.current.some(e => e.type === "shield" && e.endFrame > frame);

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#0c1222");
    sky.addColorStop(0.6, "#1a1040");
    sky.addColorStop(1, "#0a0a18");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Stars
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    for (let i = 0; i < 40; i++) {
      const sx = (i * 97 + frame * 0.1) % W;
      const sy = (i * 53) % (H * 0.6);
      ctx.beginPath();
      ctx.arc(sx, sy, ((i * 7) % 3) * 0.3 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ground
    const groundY = H - 40;
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, groundY, W, 40);
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(W, groundY);
    ctx.stroke();

    const pipeSpeed = BASE_PIPE_SPEED * speedMultRef.current;
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    for (let i = 0; i < W / 20 + 1; i++) {
      const gx = ((i * 20 - (frame * pipeSpeed) % 20) + W) % W;
      ctx.fillRect(gx, groundY + 5, 10, 2);
      ctx.fillRect(gx + 5, groundY + 15, 10, 2);
    }

    // Pipes + items
    pipes.forEach((pipe) => {
      const topGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_W, 0);
      topGrad.addColorStop(0, "#2d1b69"); topGrad.addColorStop(0.5, "#4c2d8a"); topGrad.addColorStop(1, "#2d1b69");
      ctx.fillStyle = topGrad;
      ctx.beginPath(); ctx.roundRect(pipe.x, 0, PIPE_W, pipe.top, [0, 0, 8, 8]); ctx.fill();
      ctx.fillStyle = "#6b3fa0";
      ctx.beginPath(); ctx.roundRect(pipe.x - 4, pipe.top - 20, PIPE_W + 8, 20, [6, 6, 0, 0]); ctx.fill();

      const bottomY = pipe.top + GAP;
      const botGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_W, 0);
      botGrad.addColorStop(0, "#2d1b69"); botGrad.addColorStop(0.5, "#4c2d8a"); botGrad.addColorStop(1, "#2d1b69");
      ctx.fillStyle = botGrad;
      ctx.beginPath(); ctx.roundRect(pipe.x, bottomY, PIPE_W, H - bottomY - 40, [8, 8, 0, 0]); ctx.fill();
      ctx.fillStyle = "#6b3fa0";
      ctx.beginPath(); ctx.roundRect(pipe.x - 4, bottomY, PIPE_W + 8, 20, [0, 0, 6, 6]); ctx.fill();

      // Item
      if (pipe.item && !pipe.item.collected) {
        const ix = pipe.x + PIPE_W / 2;
        const iy = pipe.item.y;
        // Glow
        ctx.shadowColor = pipe.item.color;
        ctx.shadowBlur = 12;
        ctx.font = `${ITEM_SIZE}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(pipe.item.emoji, ix, iy + Math.sin(frame * 0.08) * 4);
        ctx.shadowBlur = 0;
      }
    });

    // Bird
    ctx.save();
    ctx.translate(BIRD_X, bird.y);
    ctx.rotate(Math.min(Math.max(bird.rot, -0.5), 1.2));
    ctx.scale(birdScale, birdScale);

    // Shield visual
    if (hasShield) {
      ctx.strokeStyle = "rgba(96,165,250,0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, BIRD_R + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(96,165,250,0.08)";
      ctx.fill();
    }

    // Invincibility flash
    if (invincibleRef.current > 0 && Math.floor(frame / 4) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    // Body
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 20;
    const bodyGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, BIRD_R);
    bodyGrad.addColorStop(0, "#fde68a"); bodyGrad.addColorStop(0.7, "#f59e0b"); bodyGrad.addColorStop(1, "#d97706");
    ctx.fillStyle = bodyGrad;
    ctx.beginPath(); ctx.ellipse(0, 0, BIRD_R, BIRD_R * 0.85, 0, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Wing
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath(); ctx.ellipse(-4, Math.sin(frame * 0.15) * 3 + 2, 10, 6, -0.2, 0, Math.PI * 2); ctx.fill();

    // Eye
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(7, -4, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1a1a2e";
    ctx.beginPath(); ctx.arc(8, -4, 2.5, 0, Math.PI * 2); ctx.fill();

    // Beak
    ctx.fillStyle = "#ef4444";
    ctx.beginPath(); ctx.moveTo(12, 0); ctx.lineTo(20, 2); ctx.lineTo(12, 5); ctx.closePath(); ctx.fill();

    ctx.globalAlpha = 1;
    ctx.restore();

    // HUD — HP hearts
    if (gameStateRef.current === "playing") {
      ctx.textAlign = "left";
      for (let i = 0; i < MAX_HP; i++) {
        ctx.font = "18px sans-serif";
        ctx.fillText(i < hpRef.current ? "❤️" : "🖤", 12 + i * 24, 30);
      }

      // Score
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.font = "bold 64px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(scoreRef.current), W / 2, 90);

      // Active effects icons
      const activeNow = effectsRef.current.filter(e => e.endFrame > frame);
      activeNow.forEach((eff, i) => {
        const item = ITEMS.find(it => it.type === eff.type);
        if (!item) return;
        const remaining = Math.ceil((eff.endFrame - frame) / 60);
        ctx.font = "14px sans-serif";
        ctx.textAlign = "right";
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillText(`${item.emoji} ${remaining}s`, W - 12, 28 + i * 20);
      });
    }
  }, []);

  const tick = useCallback(() => {
    const bird = birdRef.current;
    const pipes = pipesRef.current;
    frameRef.current++;
    const frame = frameRef.current;
    const pipeSpeed = BASE_PIPE_SPEED * speedMultRef.current;
    const birdScale = birdSizeRef.current;

    if (invincibleRef.current > 0) invincibleRef.current--;

    // Bird physics
    bird.vel += GRAVITY;
    bird.y += bird.vel;
    bird.rot = bird.vel * 0.06;

    // Move pipes
    pipes.forEach((pipe) => { pipe.x -= pipeSpeed; });

    while (pipes.length > 0 && pipes[0].x < -PIPE_W) pipes.shift();

    const lastPipe = pipes[pipes.length - 1];
    if (!lastPipe || lastPipe.x < W - 220) pipes.push(createPipe(W + 20));

    // Magnet auto-score
    const hasMagnet = effectsRef.current.some(e => e.type === "magnet" && e.endFrame > frame);

    // Score + item collection
    pipes.forEach((pipe) => {
      if (!pipe.scored && (pipe.x + PIPE_W < BIRD_X || (hasMagnet && pipe.x < BIRD_X + 60))) {
        pipe.scored = true;
        scoreRef.current++;
        setScore(scoreRef.current);
      }

      // Item collection
      if (pipe.item && !pipe.item.collected) {
        const ix = pipe.x + PIPE_W / 2;
        const iy = pipe.item.y;
        const dist = Math.sqrt((BIRD_X - ix) ** 2 + (bird.y - iy) ** 2);
        if (dist < (BIRD_R * birdScale + ITEM_SIZE * 0.6)) {
          pipe.item.collected = true;
          applyItem(pipe.item.type);
        }
      }
    });

    // Collision detection
    const groundY = H - 40;
    const hitR = BIRD_R * birdScale * 0.7;
    let hit = false;

    if (bird.y + hitR > groundY || bird.y - hitR < 0) hit = true;

    if (!hit) {
      pipes.forEach((pipe) => {
        const birdLeft = BIRD_X - hitR;
        const birdRight = BIRD_X + hitR;
        const birdTop = bird.y - hitR;
        const birdBottom = bird.y + hitR;
        if (birdRight > pipe.x && birdLeft < pipe.x + PIPE_W) {
          if (birdTop < pipe.top || birdBottom > pipe.top + GAP) hit = true;
        }
      });
    }

    if (hit) {
      const hasShield = effectsRef.current.some(e => e.type === "shield" && e.endFrame > frame);

      if (hasShield) {
        // Shield absorbs hit, remove shield
        effectsRef.current = effectsRef.current.filter(e => e.type !== "shield");
        invincibleRef.current = INVINCIBLE_FRAMES;
      } else if (invincibleRef.current <= 0) {
        hpRef.current--;
        setHp(hpRef.current);

        if (hpRef.current <= 0) {
          // Game over
          gameStateRef.current = "over";
          setGameState("over");
          const finalScore = scoreRef.current;
          setHighScore((prev) => {
            const best = Math.max(prev, finalScore);
            try { localStorage.setItem("flappy-high-score", String(best)); } catch {}
            return best;
          });
          return;
        }
        // Took damage but alive — brief invincibility
        invincibleRef.current = INVINCIBLE_FRAMES;
        bird.vel = JUMP * 0.7; // bounce up slightly on hit
      }
    }

    syncEffects();
    draw();
  }, [draw, applyItem, syncEffects]);

  const jump = useCallback(() => {
    if (gameStateRef.current === "playing") {
      birdRef.current.vel = JUMP;
    }
  }, []);

  const startGame = useCallback(() => {
    birdRef.current = { y: H / 2, vel: 0, rot: 0 };
    pipesRef.current = [createPipe(W + 100)];
    scoreRef.current = 0;
    hpRef.current = MAX_HP;
    frameRef.current = 0;
    effectsRef.current = [];
    invincibleRef.current = 0;
    speedMultRef.current = 1;
    birdSizeRef.current = 1;
    setScore(0);
    setHp(MAX_HP);
    setActiveEffects([]);
    gameStateRef.current = "playing";
    setGameState("playing");
    draw();
  }, [draw]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
      return;
    }
    let lastTime = 0;
    const fps = 60;
    const interval = 1000 / fps;
    const loop = (timestamp) => {
      if (gameStateRef.current !== "playing") return;
      const delta = timestamp - lastTime;
      if (delta >= interval) { lastTime = timestamp - (delta % interval); tick(); }
      loopRef.current = requestAnimationFrame(loop);
    };
    loopRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(loopRef.current);
  }, [gameState, tick]);

  // Keyboard
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        if (gameStateRef.current === "playing") jump();
        else startGame();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [jump, startGame]);

  // Touch
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleTouch = (e) => {
      e.preventDefault();
      if (gameStateRef.current === "playing") jump();
      else startGame();
    };
    canvas.addEventListener("touchstart", handleTouch, { passive: false });
    canvas.addEventListener("mousedown", handleTouch);
    return () => { canvas.removeEventListener("touchstart", handleTouch); canvas.removeEventListener("mousedown", handleTouch); };
  }, [jump, startGame]);

  // Idle animation
  useEffect(() => {
    if (gameState !== "idle") return;
    let frame = 0;
    const idleLoop = () => {
      frame++;
      birdRef.current.y = H / 2 + Math.sin(frame * 0.04) * 15;
      birdRef.current.rot = Math.sin(frame * 0.04) * 0.1;
      frameRef.current = frame;
      draw();
      loopRef.current = requestAnimationFrame(idleLoop);
    };
    loopRef.current = requestAnimationFrame(idleLoop);
    return () => cancelAnimationFrame(loopRef.current);
  }, [gameState, draw]);

  return (
    <div className="min-h-screen text-white flex flex-col items-center relative" style={{ background: "radial-gradient(ellipse at 50% 0%, #1a1040 0%, #0c0820 40%, #06040f 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{ color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(12px)" }}>← 홈</Link>

      {/* Header */}
      <div className="w-full max-w-[440px] px-5 pt-14 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Flappy Bird</h1>
            <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,.25)" }}>
              {gameState === "playing" ? "탭으로 점프! 아이템을 모으세요!" : gameState === "over" ? "게임 오버!" : "탭 또는 스페이스바로 시작"}
            </p>
          </div>
          <div className="flex gap-2">
            <div className="text-center px-3 py-1.5 rounded-xl" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
              <div className="text-[8px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,.2)" }}>Score</div>
              <div className="text-lg font-black tabular-nums text-amber-400">{score}</div>
            </div>
            <div className="text-center px-3 py-1.5 rounded-xl" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
              <div className="text-[8px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,.2)" }}>Best</div>
              <div className="text-lg font-black tabular-nums text-purple-400">{highScore}</div>
            </div>
          </div>
        </div>

        {/* HP + Active Effects bar */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-0.5">
            {Array.from({ length: MAX_HP }, (_, i) => (
              <span key={i} className="text-sm">{i < hp ? "❤️" : "🖤"}</span>
            ))}
          </div>
          {activeEffects.length > 0 && (
            <div className="flex gap-1">
              {activeEffects.map((type) => {
                const item = ITEMS.find(it => it.type === type);
                return item ? <span key={type} className="text-sm" title={item.desc}>{item.emoji}</span> : null;
              })}
            </div>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="relative">
        <canvas ref={canvasRef} width={W} height={H} className="rounded-2xl" style={{ border: "1px solid rgba(255,255,255,.06)", boxShadow: "0 0 40px rgba(124,58,237,0.08)", touchAction: "none", cursor: "pointer", maxWidth: "calc(100vw - 40px)", height: "auto" }} />

        {/* Overlay */}
        {gameState !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
            {gameState === "over" && (
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">💥</div>
                <div className="text-3xl font-black text-red-400 mb-1">Game Over</div>
                <div className="text-sm" style={{ color: "rgba(255,255,255,.4)" }}>
                  점수: {score}점
                  {score >= highScore && score > 0 && <span className="text-yellow-400 ml-2">🏆 최고 기록!</span>}
                </div>
              </div>
            )}
            {gameState === "idle" && (
              <div className="text-center mb-6">
                <div className="text-6xl mb-4" style={{ animation: "pulse 2s ease-in-out infinite" }}>🐤</div>
                <p className="text-sm" style={{ color: "rgba(255,255,255,.3)" }}>파이프 사이를 통과하세요!</p>
                <p className="text-[11px] mt-2" style={{ color: "rgba(255,255,255,.2)" }}>❤️ 체력 3칸 | 아이템을 모아 생존하세요</p>
              </div>
            )}
            <button onClick={startGame} className="px-8 py-3 rounded-2xl font-bold text-[15px] transition-all active:scale-95" style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#000", boxShadow: "0 8px 25px rgba(251,191,36,0.2)" }}>
              {gameState === "over" ? "다시 하기" : "게임 시작"}
            </button>
            <p className="text-[11px] mt-4" style={{ color: "rgba(255,255,255,.2)" }}>스페이스바 / 클릭 / 탭</p>
          </div>
        )}
      </div>

      {/* Item legend */}
      <div className="w-full max-w-[440px] px-5 mt-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {ITEMS.map((item) => (
            <span key={item.type} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${item.color}10`, border: `1px solid ${item.color}20`, color: `${item.color}80` }}>
              {item.emoji} {item.desc}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 pb-8 text-center text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,.08)" }}>
        <p>🐤 탭/클릭으로 점프 | ❤️ 체력 {MAX_HP}칸 | 아이템으로 생존!</p>
      </div>
    </div>
  );
}
