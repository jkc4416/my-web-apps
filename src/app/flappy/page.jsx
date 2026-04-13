"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const W = 400;
const H = 600;
const GRAVITY = 0.45;
const JUMP = -7.5;
const PIPE_W = 60;
const GAP = 160;
const PIPE_SPEED = 2.5;
const BIRD_X = 80;
const BIRD_R = 16;

function createPipe(x) {
  const minTop = 80;
  const maxTop = H - GAP - 80;
  const top = Math.floor(Math.random() * (maxTop - minTop)) + minTop;
  return { x, top, scored: false };
}

export default function FlappyPage() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("idle"); // idle | playing | over
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const birdRef = useRef({ y: H / 2, vel: 0, rot: 0 });
  const pipesRef = useRef([]);
  const scoreRef = useRef(0);
  const frameRef = useRef(0);
  const loopRef = useRef(null);
  const gameStateRef = useRef("idle");

  useEffect(() => {
    const saved = localStorage.getItem("flappy-high-score");
    if (saved) setHighScore(Number(saved));
  }, []);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const bird = birdRef.current;
    const pipes = pipesRef.current;
    const frame = frameRef.current;

    // Sky gradient
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
      const sr = ((i * 7) % 3) * 0.3 + 0.5;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
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

    // Ground pattern
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    for (let i = 0; i < W / 20 + 1; i++) {
      const gx = ((i * 20 - (frame * PIPE_SPEED) % 20) + W) % W;
      ctx.fillRect(gx, groundY + 5, 10, 2);
      ctx.fillRect(gx + 5, groundY + 15, 10, 2);
    }

    // Pipes
    pipes.forEach((pipe) => {
      // Top pipe
      const topGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_W, 0);
      topGrad.addColorStop(0, "#2d1b69");
      topGrad.addColorStop(0.5, "#4c2d8a");
      topGrad.addColorStop(1, "#2d1b69");
      ctx.fillStyle = topGrad;
      ctx.beginPath();
      ctx.roundRect(pipe.x, 0, PIPE_W, pipe.top, [0, 0, 8, 8]);
      ctx.fill();

      // Top pipe cap
      ctx.fillStyle = "#6b3fa0";
      ctx.beginPath();
      ctx.roundRect(pipe.x - 4, pipe.top - 20, PIPE_W + 8, 20, [6, 6, 0, 0]);
      ctx.fill();

      // Bottom pipe
      const bottomY = pipe.top + GAP;
      const botGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_W, 0);
      botGrad.addColorStop(0, "#2d1b69");
      botGrad.addColorStop(0.5, "#4c2d8a");
      botGrad.addColorStop(1, "#2d1b69");
      ctx.fillStyle = botGrad;
      ctx.beginPath();
      ctx.roundRect(pipe.x, bottomY, PIPE_W, H - bottomY - 40, [8, 8, 0, 0]);
      ctx.fill();

      // Bottom pipe cap
      ctx.fillStyle = "#6b3fa0";
      ctx.beginPath();
      ctx.roundRect(pipe.x - 4, bottomY, PIPE_W + 8, 20, [0, 0, 6, 6]);
      ctx.fill();

      // Pipe glow
      ctx.shadowColor = "#7c3aed";
      ctx.shadowBlur = 15;
      ctx.fillStyle = "transparent";
      ctx.fillRect(pipe.x, pipe.top - 2, PIPE_W, 4);
      ctx.fillRect(pipe.x, bottomY - 2, PIPE_W, 4);
      ctx.shadowBlur = 0;
    });

    // Bird
    ctx.save();
    ctx.translate(BIRD_X, bird.y);
    ctx.rotate(Math.min(Math.max(bird.rot, -0.5), 1.2));

    // Bird glow
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 20;

    // Body
    const bodyGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, BIRD_R);
    bodyGrad.addColorStop(0, "#fde68a");
    bodyGrad.addColorStop(0.7, "#f59e0b");
    bodyGrad.addColorStop(1, "#d97706");
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, BIRD_R, BIRD_R * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Wing
    const wingY = Math.sin(frame * 0.15) * 3;
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.ellipse(-4, wingY + 2, 10, 6, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(7, -4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1a2e";
    ctx.beginPath();
    ctx.arc(8, -4, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(20, 2);
    ctx.lineTo(12, 5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Score display during play
    if (gameStateRef.current === "playing") {
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.font = "bold 64px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(scoreRef.current), W / 2, 90);
    }
  }, []);

  const tick = useCallback(() => {
    const bird = birdRef.current;
    const pipes = pipesRef.current;
    frameRef.current++;

    // Bird physics
    bird.vel += GRAVITY;
    bird.y += bird.vel;
    bird.rot = bird.vel * 0.06;

    // Move pipes
    pipes.forEach((pipe) => {
      pipe.x -= PIPE_SPEED;
    });

    // Remove off-screen pipes
    while (pipes.length > 0 && pipes[0].x < -PIPE_W) {
      pipes.shift();
    }

    // Add new pipes
    const lastPipe = pipes[pipes.length - 1];
    if (!lastPipe || lastPipe.x < W - 220) {
      pipes.push(createPipe(W + 20));
    }

    // Score
    pipes.forEach((pipe) => {
      if (!pipe.scored && pipe.x + PIPE_W < BIRD_X) {
        pipe.scored = true;
        scoreRef.current++;
        setScore(scoreRef.current);
      }
    });

    // Collision detection
    const groundY = H - 40;
    let dead = false;

    // Ground/ceiling
    if (bird.y + BIRD_R > groundY || bird.y - BIRD_R < 0) {
      dead = true;
    }

    // Pipes
    pipes.forEach((pipe) => {
      const birdLeft = BIRD_X - BIRD_R * 0.7;
      const birdRight = BIRD_X + BIRD_R * 0.7;
      const birdTop = bird.y - BIRD_R * 0.7;
      const birdBottom = bird.y + BIRD_R * 0.7;

      if (birdRight > pipe.x && birdLeft < pipe.x + PIPE_W) {
        if (birdTop < pipe.top || birdBottom > pipe.top + GAP) {
          dead = true;
        }
      }
    });

    if (dead) {
      gameStateRef.current = "over";
      setGameState("over");
      const finalScore = scoreRef.current;
      setHighScore((prev) => {
        const best = Math.max(prev, finalScore);
        localStorage.setItem("flappy-high-score", String(best));
        return best;
      });
      return;
    }

    draw();
  }, [draw]);

  const jump = useCallback(() => {
    if (gameStateRef.current === "playing") {
      birdRef.current.vel = JUMP;
    }
  }, []);

  const startGame = useCallback(() => {
    birdRef.current = { y: H / 2, vel: 0, rot: 0 };
    pipesRef.current = [createPipe(W + 100)];
    scoreRef.current = 0;
    frameRef.current = 0;
    setScore(0);
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
      if (delta >= interval) {
        lastTime = timestamp - (delta % interval);
        tick();
      }
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
        if (gameStateRef.current === "playing") {
          jump();
        } else {
          startGame();
        }
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
      if (gameStateRef.current === "playing") {
        jump();
      } else {
        startGame();
      }
    };

    canvas.addEventListener("touchstart", handleTouch, { passive: false });
    canvas.addEventListener("mousedown", handleTouch);
    return () => {
      canvas.removeEventListener("touchstart", handleTouch);
      canvas.removeEventListener("mousedown", handleTouch);
    };
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
    <div
      className="min-h-screen text-white flex flex-col items-center relative"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #1a1040 0%, #0c0820 40%, #06040f 100%)",
        fontFamily:
          "'Pretendard Variable','Pretendard',-apple-system,sans-serif",
      }}
    >
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95"
        style={{
          color: "rgba(255,255,255,.4)",
          background: "rgba(255,255,255,.03)",
          border: "1px solid rgba(255,255,255,.06)",
          backdropFilter: "blur(12px)",
        }}
      >
        ← 홈
      </Link>

      {/* Header */}
      <div className="w-full max-w-[440px] px-5 pt-14 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1
              className="text-2xl font-black tracking-tight"
              style={{
                background: "linear-gradient(135deg, #fbbf24, #f59e0b, #ef4444)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Flappy Bird
            </h1>
            <p
              className="text-[11px] mt-1"
              style={{ color: "rgba(255,255,255,.25)" }}
            >
              {gameState === "playing"
                ? "탭 또는 스페이스바로 점프!"
                : gameState === "over"
                  ? "게임 오버!"
                  : "탭 또는 스페이스바로 시작"}
            </p>
          </div>
          <div className="flex gap-3">
            <div
              className="text-center px-3 py-2 rounded-xl"
              style={{
                background: "rgba(255,255,255,.03)",
                border: "1px solid rgba(255,255,255,.06)",
              }}
            >
              <div
                className="text-[9px] uppercase tracking-widest mb-0.5"
                style={{ color: "rgba(255,255,255,.2)" }}
              >
                Score
              </div>
              <div className="text-lg font-black tabular-nums text-amber-400">
                {score}
              </div>
            </div>
            <div
              className="text-center px-3 py-2 rounded-xl"
              style={{
                background: "rgba(255,255,255,.03)",
                border: "1px solid rgba(255,255,255,.06)",
              }}
            >
              <div
                className="text-[9px] uppercase tracking-widest mb-0.5"
                style={{ color: "rgba(255,255,255,.2)" }}
              >
                Best
              </div>
              <div className="text-lg font-black tabular-nums text-purple-400">
                {highScore}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="rounded-2xl"
          style={{
            border: "1px solid rgba(255,255,255,.06)",
            boxShadow: "0 0 40px rgba(124,58,237,0.08)",
            touchAction: "none",
            cursor: "pointer",
            maxWidth: "100vw",
          }}
        />

        {/* Overlay */}
        {gameState !== "playing" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
            }}
          >
            {gameState === "over" && (
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">💥</div>
                <div className="text-3xl font-black text-red-400 mb-1">
                  Game Over
                </div>
                <div style={{ color: "rgba(255,255,255,.4)" }} className="text-sm">
                  점수: {score}점
                  {score >= highScore && score > 0 && (
                    <span className="text-yellow-400 ml-2">🏆 최고 기록!</span>
                  )}
                </div>
              </div>
            )}

            {gameState === "idle" && (
              <div className="text-center mb-6">
                <div
                  className="text-6xl mb-4"
                  style={{ animation: "pulse 2s ease-in-out infinite" }}
                >
                  🐤
                </div>
                <p
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,.3)" }}
                >
                  파이프 사이를 통과하세요!
                </p>
              </div>
            )}

            <button
              onClick={startGame}
              className="px-8 py-3 rounded-2xl font-bold text-[15px] transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                color: "#000",
                boxShadow: "0 8px 25px rgba(251,191,36,0.2)",
              }}
            >
              {gameState === "over" ? "다시 하기" : "게임 시작"}
            </button>

            <p
              className="text-[11px] mt-4"
              style={{ color: "rgba(255,255,255,.2)" }}
            >
              스페이스바 / 클릭 / 탭
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="mt-8 pb-8 text-center text-[11px] leading-relaxed"
        style={{ color: "rgba(255,255,255,.12)" }}
      >
        <p>🐤 탭/클릭으로 점프 | 파이프를 통과하면 +1점</p>
        <p>천장과 바닥, 파이프에 닿으면 게임 오버</p>
      </div>
    </div>
  );
}
