"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

const SIZE = 4;
const COLORS = { 0: "rgba(255,255,255,.03)", 2: "#eee4da", 4: "#ede0c8", 8: "#f2b179", 16: "#f59563", 32: "#f67c5f", 64: "#f65e3b", 128: "#edcf72", 256: "#edcc61", 512: "#edc850", 1024: "#edc53f", 2048: "#edc22e" };
const TEXT_COLORS = { 0: "transparent", 2: "#776e65", 4: "#776e65" };

function createBoard() {
  const b = Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
  addRandom(b); addRandom(b);
  return b;
}

function addRandom(board) {
  const empty = [];
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (board[r][c] === 0) empty.push([r, c]);
  if (empty.length === 0) return false;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
  return true;
}

function clone(b) { return b.map((r) => [...r]); }

function slideRow(row) {
  const filtered = row.filter((v) => v !== 0);
  const result = [];
  let score = 0;
  for (let i = 0; i < filtered.length; i++) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      result.push(filtered[i] * 2);
      score += filtered[i] * 2;
      i++;
    } else {
      result.push(filtered[i]);
    }
  }
  while (result.length < SIZE) result.push(0);
  return { row: result, score };
}

function moveLeft(board) {
  let score = 0; let moved = false;
  const newBoard = board.map((row) => {
    const { row: newRow, score: s } = slideRow(row);
    score += s;
    if (newRow.some((v, i) => v !== row[i])) moved = true;
    return newRow;
  });
  return { board: newBoard, score, moved };
}

function rotate90(board) {
  const n = board.length;
  return board[0].map((_, c) => board.map((r) => r[c]).reverse());
}

function move(board, dir) {
  let b = clone(board);
  const rotations = { left: 0, up: 1, right: 2, down: 3 };
  const rot = rotations[dir];
  for (let i = 0; i < rot; i++) b = rotate90(b);
  const result = moveLeft(b);
  for (let i = 0; i < (4 - rot) % 4; i++) result.board = rotate90(result.board);
  return result;
}

function canMove(board) {
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    if (board[r][c] === 0) return true;
    if (c + 1 < SIZE && board[r][c] === board[r][c + 1]) return true;
    if (r + 1 < SIZE && board[r][c] === board[r + 1][c]) return true;
  }
  return false;
}

export default function Game2048Page() {
  const [board, setBoard] = useState(() => createBoard());
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const touchRef = useRef(null);

  useEffect(() => {
    try { const s = localStorage.getItem("2048-best"); if (s) setBest(Number(s)); } catch {}
  }, []);

  const doMove = useCallback((dir) => {
    if (gameOver) return;
    const result = move(board, dir);
    if (!result.moved) return;
    addRandom(result.board);
    setBoard(result.board);
    const newScore = score + result.score;
    setScore(newScore);
    if (newScore > best) {
      setBest(newScore);
      try { localStorage.setItem("2048-best", String(newScore)); } catch {}
    }
    // Check 2048
    if (!won && result.board.some((r) => r.some((v) => v >= 2048))) setWon(true);
    if (!canMove(result.board)) setGameOver(true);
  }, [board, score, best, gameOver, won]);

  const restart = () => { setBoard(createBoard()); setScore(0); setGameOver(false); setWon(false); };

  // Keyboard
  useEffect(() => {
    const dirs = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
    const handleKey = (e) => { if (dirs[e.key]) { e.preventDefault(); doMove(dirs[e.key]); } };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [doMove]);

  // Touch/swipe
  useEffect(() => {
    const handleStart = (e) => { touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const handleEnd = (e) => {
      if (!touchRef.current) return;
      const dx = e.changedTouches[0].clientX - touchRef.current.x;
      const dy = e.changedTouches[0].clientY - touchRef.current.y;
      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
      if (Math.abs(dx) > Math.abs(dy)) doMove(dx > 0 ? "right" : "left");
      else doMove(dy > 0 ? "down" : "up");
      touchRef.current = null;
    };
    window.addEventListener("touchstart", handleStart, { passive: true });
    window.addEventListener("touchend", handleEnd, { passive: true });
    return () => { window.removeEventListener("touchstart", handleStart); window.removeEventListener("touchend", handleEnd); };
  }, [doMove]);

  const cellSize = "calc((min(100vw - 56px, 400px)) / 4)";

  return (
    <div className="min-h-screen text-white flex flex-col items-center" style={{ background: "radial-gradient(ellipse at 50% 0%, #1a1408 0%, #0e0a06 40%, #08060a 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{ color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(12px)" }}>← 홈</Link>

      <div className="w-full max-w-[440px] px-5 pt-14 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-black" style={{ background: "linear-gradient(135deg, #edc22e, #f59563)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>2048</h1>
            <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,.25)" }}>타일을 합쳐 2048을 만드세요!</p>
          </div>
          <div className="flex gap-2">
            <div className="text-center px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
              <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,.2)" }}>점수</div>
              <div className="text-lg font-black tabular-nums text-amber-400">{score}</div>
            </div>
            <div className="text-center px-3 py-2 rounded-xl" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
              <div className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,.2)" }}>최고</div>
              <div className="text-lg font-black tabular-nums text-orange-400">{best}</div>
            </div>
          </div>
        </div>

        <button onClick={restart} className="mb-4 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all active:scale-95" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", color: "rgba(255,255,255,.35)" }}>🔄 새 게임</button>
      </div>

      {/* Board */}
      <div className="relative rounded-2xl p-2" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)", touchAction: "none" }}>
        <div className="grid grid-cols-4 gap-1.5">
          {board.flat().map((val, i) => (
            <div key={i} className="flex items-center justify-center rounded-lg font-black transition-all duration-100"
              style={{
                width: cellSize, height: cellSize, maxWidth: 100, maxHeight: 100,
                background: COLORS[val] || "#3c3a32",
                color: TEXT_COLORS[val] || "#f9f6f2",
                fontSize: val >= 1024 ? 18 : val >= 128 ? 22 : 26,
              }}>
              {val > 0 && val}
            </div>
          ))}
        </div>

        {/* Game Over / Won overlay */}
        {(gameOver || (won && !gameOver)) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl" style={{ background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)" }}>
            <div className="text-4xl mb-2">{gameOver ? "💀" : "🎉"}</div>
            <div className="text-2xl font-black mb-1">{gameOver ? "게임 오버" : "2048 달성!"}</div>
            <div className="text-[13px] mb-4" style={{ color: "rgba(255,255,255,.4)" }}>점수: {score}</div>
            <div className="flex gap-2">
              {won && !gameOver && (
                <button onClick={() => setWon(false)} className="px-5 py-2.5 rounded-xl font-bold text-[13px] transition-all active:scale-95" style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", color: "rgba(255,255,255,.6)" }}>계속 플레이</button>
              )}
              <button onClick={restart} className="px-5 py-2.5 rounded-xl font-bold text-[14px] transition-all active:scale-95" style={{ background: "linear-gradient(135deg, #edc22e, #f59563)" }}>다시 하기</button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-[11px]" style={{ color: "rgba(255,255,255,.1)" }}>
        <p>⌨️ 화살표 키 또는 스와이프로 조작</p>
      </div>
    </div>
  );
}
