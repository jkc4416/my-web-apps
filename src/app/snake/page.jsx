"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const CELL = 20;
const COLS = 20;
const ROWS = 20;
const W = COLS * CELL;
const H = ROWS * CELL;

const DIR = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

function randomFood(snake) {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

export default function SnakePage() {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("idle"); // idle | playing | over
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const snakeRef = useRef([{ x: 10, y: 10 }]);
  const dirRef = useRef({ x: 1, y: 0 });
  const nextDirRef = useRef({ x: 1, y: 0 });
  const foodRef = useRef({ x: 15, y: 10 });
  const scoreRef = useRef(0);
  const loopRef = useRef(null);
  const touchRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("snake-high-score");
    if (saved) setHighScore(Number(saved));
  }, []);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#0a0a12";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, H);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(W, y * CELL);
      ctx.stroke();
    }

    // Food glow
    const food = foodRef.current;
    const grd = ctx.createRadialGradient(
      food.x * CELL + CELL / 2,
      food.y * CELL + CELL / 2,
      2,
      food.x * CELL + CELL / 2,
      food.y * CELL + CELL / 2,
      CELL * 1.5
    );
    grd.addColorStop(0, "rgba(239,68,68,0.3)");
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.fillRect(
      food.x * CELL - CELL,
      food.y * CELL - CELL,
      CELL * 3,
      CELL * 3
    );

    // Food
    ctx.fillStyle = "#ef4444";
    ctx.shadowColor = "#ef4444";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(
      food.x * CELL + 2,
      food.y * CELL + 2,
      CELL - 4,
      CELL - 4,
      4
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      const ratio = 1 - i / snake.length;
      const g = Math.round(200 + 55 * ratio);
      const b = Math.round(100 + 155 * ratio);

      if (i === 0) {
        // Head
        ctx.fillStyle = `rgb(80, ${g}, ${b})`;
        ctx.shadowColor = `rgba(80, ${g}, ${b}, 0.5)`;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.roundRect(
          seg.x * CELL + 1,
          seg.y * CELL + 1,
          CELL - 2,
          CELL - 2,
          5
        );
        ctx.fill();
        ctx.shadowBlur = 0;

        // Eyes
        const d = dirRef.current;
        ctx.fillStyle = "#fff";
        const cx = seg.x * CELL + CELL / 2;
        const cy = seg.y * CELL + CELL / 2;
        ctx.beginPath();
        ctx.arc(cx + d.y * 3 - d.x * 0 + 3, cy + d.x * 3 + d.y * 0 - 1, 2, 0, Math.PI * 2);
        ctx.arc(cx + d.y * 3 - d.x * 0 - 3, cy + d.x * 3 + d.y * 0 + 1, 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Body
        ctx.fillStyle = `rgba(80, ${g}, ${b}, ${0.4 + 0.6 * ratio})`;
        ctx.beginPath();
        ctx.roundRect(
          seg.x * CELL + 2,
          seg.y * CELL + 2,
          CELL - 4,
          CELL - 4,
          4
        );
        ctx.fill();
      }
    });
  }, []);

  const tick = useCallback(() => {
    const snake = snakeRef.current;
    dirRef.current = nextDirRef.current;
    const dir = dirRef.current;

    const head = {
      x: (snake[0].x + dir.x + COLS) % COLS,
      y: (snake[0].y + dir.y + ROWS) % ROWS,
    };

    // Self collision
    if (snake.some((s) => s.x === head.x && s.y === head.y)) {
      setGameState("over");
      const finalScore = scoreRef.current;
      setHighScore((prev) => {
        const best = Math.max(prev, finalScore);
        localStorage.setItem("snake-high-score", String(best));
        return best;
      });
      return;
    }

    const newSnake = [head, ...snake];

    // Eat food
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      scoreRef.current += 10;
      setScore(scoreRef.current);
      foodRef.current = randomFood(newSnake);
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    draw();
  }, [draw]);

  const startGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    foodRef.current = randomFood([{ x: 10, y: 10 }]);
    scoreRef.current = 0;
    setScore(0);
    setGameState("playing");
    draw();
  }, [draw]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") {
      if (loopRef.current) clearInterval(loopRef.current);
      return;
    }

    const speed = Math.max(60, 120 - Math.floor(scoreRef.current / 50) * 10);
    loopRef.current = setInterval(tick, speed);

    return () => clearInterval(loopRef.current);
  }, [gameState, score, tick]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (DIR[e.key]) {
        e.preventDefault();
        const newDir = DIR[e.key];
        // Prevent 180-degree turn
        if (
          newDir.x !== -dirRef.current.x ||
          newDir.y !== -dirRef.current.y
        ) {
          nextDirRef.current = newDir;
        }
      }
      if (e.key === " " || e.key === "Enter") {
        if (gameState !== "playing") startGame();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState, startGame]);

  // Touch/swipe controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      touchRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e) => {
      if (!touchRef.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchRef.current.x;
      const dy = touch.clientY - touchRef.current.y;

      if (Math.abs(dx) < 20 && Math.abs(dy) < 20) {
        if (gameState !== "playing") startGame();
        return;
      }

      let newDir;
      if (Math.abs(dx) > Math.abs(dy)) {
        newDir = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
      } else {
        newDir = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
      }

      if (
        newDir.x !== -dirRef.current.x ||
        newDir.y !== -dirRef.current.y
      ) {
        nextDirRef.current = newDir;
      }
      touchRef.current = null;
    };

    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
    };
  }, [gameState, startGame]);

  // Initial draw
  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center relative"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #0a1a0a 0%, #060e06 40%, #030803 100%)",
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
                background: "linear-gradient(135deg, #4ade80, #22d3ee)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Snake Game
            </h1>
            <p
              className="text-[11px] mt-1"
              style={{ color: "rgba(255,255,255,.25)" }}
            >
              {gameState === "playing"
                ? "화살표 키 또는 스와이프로 조작"
                : gameState === "over"
                  ? "게임 오버!"
                  : "스페이스바 또는 탭하여 시작"}
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
              <div className="text-lg font-black tabular-nums text-emerald-400">
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
              <div className="text-lg font-black tabular-nums text-cyan-400">
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
            boxShadow: "0 0 40px rgba(74,222,128,0.05)",
            touchAction: "none",
          }}
        />

        {/* Overlay */}
        {gameState !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          >
            {gameState === "over" && (
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">💀</div>
                <div className="text-3xl font-black text-red-400 mb-1">
                  Game Over
                </div>
                <div
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,.4)" }}
                >
                  점수: {score}점
                  {score >= highScore && score > 0 && (
                    <span className="text-yellow-400 ml-2">🏆 최고 기록!</span>
                  )}
                </div>
              </div>
            )}

            {gameState === "idle" && (
              <div className="text-6xl mb-6" style={{ animation: "pulse 2s ease-in-out infinite" }}>
                🐍
              </div>
            )}

            <button
              onClick={startGame}
              className="px-8 py-3 rounded-2xl font-bold text-[15px] transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg, #4ade80, #22d3ee)",
                color: "#000",
                boxShadow: "0 8px 25px rgba(74,222,128,0.2)",
              }}
            >
              {gameState === "over" ? "다시 하기" : "게임 시작"}
            </button>

            <p
              className="text-[11px] mt-4"
              style={{ color: "rgba(255,255,255,.2)" }}
            >
              스페이스바 / Enter / 탭
            </p>
          </div>
        )}
      </div>

      {/* Mobile D-Pad */}
      <div className="mt-6 sm:hidden">
        <div className="grid grid-cols-3 gap-2 w-[180px] mx-auto">
          <div />
          <button
            onTouchStart={() => {
              if (dirRef.current.y !== 1) nextDirRef.current = { x: 0, y: -1 };
              if (gameState !== "playing") startGame();
            }}
            className="h-14 rounded-xl flex items-center justify-center text-xl active:scale-90 transition-transform"
            style={{
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            ↑
          </button>
          <div />
          <button
            onTouchStart={() => {
              if (dirRef.current.x !== 1) nextDirRef.current = { x: -1, y: 0 };
              if (gameState !== "playing") startGame();
            }}
            className="h-14 rounded-xl flex items-center justify-center text-xl active:scale-90 transition-transform"
            style={{
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            ←
          </button>
          <button
            onTouchStart={() => {
              if (dirRef.current.y !== -1) nextDirRef.current = { x: 0, y: 1 };
              if (gameState !== "playing") startGame();
            }}
            className="h-14 rounded-xl flex items-center justify-center text-xl active:scale-90 transition-transform"
            style={{
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            ↓
          </button>
          <button
            onTouchStart={() => {
              if (dirRef.current.x !== -1) nextDirRef.current = { x: 1, y: 0 };
              if (gameState !== "playing") startGame();
            }}
            className="h-14 rounded-xl flex items-center justify-center text-xl active:scale-90 transition-transform"
            style={{
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* Footer info */}
      <div
        className="mt-8 pb-8 text-center text-[11px] leading-relaxed"
        style={{ color: "rgba(255,255,255,.12)" }}
      >
        <p>🎮 화살표 키로 방향 전환 | 먹이를 먹으면 점수 +10</p>
        <p>속도는 점수가 올라갈수록 빨라집니다</p>
      </div>
    </div>
  );
}
