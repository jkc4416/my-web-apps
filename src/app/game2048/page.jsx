"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

const SIZE = 4;

// Tile colors — official 2048 palette with better dark-theme contrast for high values
const TILE_STYLES = {
  2:    { bg: "#eee4da", fg: "#776e65" },
  4:    { bg: "#ede0c8", fg: "#776e65" },
  8:    { bg: "#f2b179", fg: "#ffffff" },
  16:   { bg: "#f59563", fg: "#ffffff" },
  32:   { bg: "#f67c5f", fg: "#ffffff" },
  64:   { bg: "#f65e3b", fg: "#ffffff" },
  128:  { bg: "#edcf72", fg: "#ffffff" },
  256:  { bg: "#edcc61", fg: "#ffffff" },
  512:  { bg: "#edc850", fg: "#ffffff" },
  1024: { bg: "#edc53f", fg: "#ffffff" },
  2048: { bg: "#edc22e", fg: "#ffffff" },
  4096: { bg: "#3c3a32", fg: "#ffffff" },
  8192: { bg: "#1a1a1a", fg: "#ffffff" },
};

let tileIdCounter = 0;
function nextId() { return ++tileIdCounter; }

function emptyBoard() { return Array(SIZE).fill(null).map(() => Array(SIZE).fill(null)); }

function addRandom(board) {
  const empty = [];
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (!board[r][c]) empty.push([r, c]);
  if (empty.length === 0) return false;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = { id: nextId(), value: Math.random() < 0.9 ? 2 : 4, isNew: true };
  return true;
}

function createBoard() {
  const b = emptyBoard();
  addRandom(b); addRandom(b);
  return b;
}

function cloneBoard(b) { return b.map((row) => row.map((t) => t ? { ...t } : null)); }

function boardsEqual(a, b) {
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    const av = a[r][c]?.value || 0;
    const bv = b[r][c]?.value || 0;
    if (av !== bv) return false;
  }
  return true;
}

// Slide + merge one row to the left. Returns new row array (length SIZE).
function slideRow(row) {
  const filtered = row.filter((t) => t);
  const result = [];
  let score = 0;
  for (let i = 0; i < filtered.length; i++) {
    // Clear merge flags from input
    const cur = { ...filtered[i], isNew: false, merged: false };
    if (i + 1 < filtered.length && filtered[i].value === filtered[i + 1].value) {
      const merged = { id: nextId(), value: cur.value * 2, merged: true };
      result.push(merged);
      score += merged.value;
      i++;
    } else {
      result.push(cur);
    }
  }
  while (result.length < SIZE) result.push(null);
  return { row: result, score };
}

function rotateCW(board) {
  const out = emptyBoard();
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) out[c][SIZE - 1 - r] = board[r][c];
  return out;
}

function rotateCCW(board) {
  const out = emptyBoard();
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) out[SIZE - 1 - c][r] = board[r][c];
  return out;
}

function flipH(board) {
  return board.map((row) => [...row].reverse());
}

function move(board, dir) {
  // Normalize: always slide left. Transform board so the target direction = left.
  let b = cloneBoard(board);
  if (dir === "right") b = flipH(b);
  else if (dir === "up") b = rotateCCW(b);
  else if (dir === "down") b = rotateCW(b);

  let totalScore = 0;
  const newBoard = b.map((row) => {
    const { row: newRow, score } = slideRow(row);
    totalScore += score;
    return newRow;
  });

  // Un-rotate
  let out = newBoard;
  if (dir === "right") out = flipH(out);
  else if (dir === "up") out = rotateCW(out);
  else if (dir === "down") out = rotateCCW(out);

  return { board: out, score: totalScore, moved: !boardsEqual(board, out) };
}

function canMove(board) {
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    if (!board[r][c]) return true;
    const v = board[r][c].value;
    if (c + 1 < SIZE && board[r][c + 1]?.value === v) return true;
    if (r + 1 < SIZE && board[r + 1][c]?.value === v) return true;
  }
  return false;
}

export default function Game2048Page() {
  const [board, setBoard] = useState(() => createBoard());
  const [prevBoard, setPrevBoard] = useState(null);
  const [prevScore, setPrevScore] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const boardRef = useRef(null);
  const touchRef = useRef(null);
  const movingRef = useRef(false);

  useEffect(() => {
    try { const s = localStorage.getItem("2048-best"); if (s) setBest(Number(s)); } catch {}
  }, []);

  const doMove = useCallback((dir) => {
    if (gameOver) return;
    if (movingRef.current) return;
    movingRef.current = true;
    setTimeout(() => { movingRef.current = false; }, 80);

    const result = move(board, dir);
    if (!result.moved) return;

    // Save for undo
    setPrevBoard(cloneBoard(board));
    setPrevScore(score);

    addRandom(result.board);
    setBoard(result.board);
    const newScore = score + result.score;
    setScore(newScore);
    if (newScore > best) {
      setBest(newScore);
      try { localStorage.setItem("2048-best", String(newScore)); } catch {}
    }

    // Check 2048
    if (!won && result.board.some((row) => row.some((t) => t && t.value >= 2048))) {
      setWon(true);
    }
    if (!canMove(result.board)) setGameOver(true);
  }, [board, score, best, gameOver, won]);

  const undo = useCallback(() => {
    if (!prevBoard || gameOver) return;
    setBoard(prevBoard);
    setScore(prevScore);
    setPrevBoard(null);
    setGameOver(false);
  }, [prevBoard, prevScore, gameOver]);

  const restart = useCallback(() => {
    setBoard(createBoard());
    setScore(0); setPrevBoard(null); setPrevScore(0);
    setGameOver(false); setWon(false); setKeepPlaying(false);
    setConfirmRestart(false);
  }, []);

  const handleRestartClick = () => {
    if (score > 0 && !gameOver && !confirmRestart) {
      setConfirmRestart(true);
      setTimeout(() => setConfirmRestart(false), 3000);
    } else {
      restart();
    }
  };

  // Keyboard
  useEffect(() => {
    const dirs = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
    const handleKey = (e) => {
      if (dirs[e.key]) {
        e.preventDefault();
        doMove(dirs[e.key]);
      } else if ((e.key === "z" || e.key === "Z") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault(); undo();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [doMove, undo]);

  // Touch/swipe — ONLY on board element, not window
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;

    const handleStart = (e) => {
      const t = e.touches[0];
      touchRef.current = { x: t.clientX, y: t.clientY };
    };
    const handleMove = (e) => {
      // Prevent scrolling while swiping on board
      if (touchRef.current) e.preventDefault();
    };
    const handleEnd = (e) => {
      if (!touchRef.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchRef.current.x;
      const dy = t.clientY - touchRef.current.y;
      touchRef.current = null;
      const THRESHOLD = 20;
      if (Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return;
      if (Math.abs(dx) > Math.abs(dy)) doMove(dx > 0 ? "right" : "left");
      else doMove(dy > 0 ? "down" : "up");
    };

    el.addEventListener("touchstart", handleStart, { passive: true });
    el.addEventListener("touchmove", handleMove, { passive: false });
    el.addEventListener("touchend", handleEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", handleStart);
      el.removeEventListener("touchmove", handleMove);
      el.removeEventListener("touchend", handleEnd);
    };
  }, [doMove]);

  const showWonOverlay = won && !keepPlaying && !gameOver;

  return (
    <div className="min-h-screen text-white flex flex-col items-center" style={{ background: "radial-gradient(ellipse at 50% 0%, #1a1408 0%, #0e0a06 40%, #08060a 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{ color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(12px)" }}>← 홈</Link>

      <style>{`
        @keyframes tileAppear { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes tileMerge { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
        .tile-new { animation: tileAppear 0.2s ease-out; }
        .tile-merged { animation: tileMerge 0.25s ease-out; }
      `}</style>

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

        <div className="flex gap-2 mb-4">
          <button onClick={handleRestartClick} className="flex-1 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all active:scale-95" style={{ background: confirmRestart ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,.03)", border: `1px solid ${confirmRestart ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,.06)"}`, color: confirmRestart ? "#f87171" : "rgba(255,255,255,.35)" }}>
            {confirmRestart ? "⚠️ 정말 새 게임? 다시 탭" : "🔄 새 게임"}
          </button>
          <button onClick={undo} disabled={!prevBoard || gameOver} className="flex-1 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", color: "rgba(255,255,255,.35)" }}>
            ↶ 되돌리기
          </button>
        </div>
      </div>

      {/* Board */}
      <div ref={boardRef} className="relative rounded-2xl p-2 select-none" style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)", touchAction: "none", width: "min(calc(100vw - 40px), 400px)" }}>
        <div className="grid grid-cols-4 gap-1.5" style={{ aspectRatio: "1 / 1" }}>
          {board.flat().map((tile, i) => {
            const val = tile?.value || 0;
            const style = TILE_STYLES[val];
            const size = val >= 10000 ? 14 : val >= 1000 ? 18 : val >= 100 ? 22 : 28;
            return (
              <div key={i} className="flex items-center justify-center rounded-lg relative" style={{ background: "rgba(255,255,255,.03)", aspectRatio: "1 / 1" }}>
                {tile && (
                  <div
                    key={tile.id}
                    className={`absolute inset-0 flex items-center justify-center rounded-lg font-black ${tile.isNew ? "tile-new" : ""} ${tile.merged ? "tile-merged" : ""}`}
                    style={{
                      background: style?.bg || "#3c3a32",
                      color: style?.fg || "#ffffff",
                      fontSize: size,
                      boxShadow: val >= 128 ? `0 0 20px ${style?.bg}40` : "none",
                    }}>
                    {val}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Won overlay */}
        {showWonOverlay && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl" style={{ background: "rgba(237,194,46,0.3)", backdropFilter: "blur(4px)" }}>
            <div className="text-5xl mb-2">🎉</div>
            <div className="text-2xl font-black mb-1">2048 달성!</div>
            <div className="text-[13px] mb-4" style={{ color: "rgba(255,255,255,.7)" }}>점수: {score}</div>
            <div className="flex gap-2">
              <button onClick={() => setKeepPlaying(true)} className="px-5 py-2.5 rounded-xl font-bold text-[13px] transition-all active:scale-95" style={{ background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.25)", color: "#fff" }}>계속 플레이</button>
              <button onClick={restart} className="px-5 py-2.5 rounded-xl font-bold text-[14px] transition-all active:scale-95" style={{ background: "linear-gradient(135deg, #edc22e, #f59563)", color: "#1a1408" }}>다시 하기</button>
            </div>
          </div>
        )}

        {/* Game over overlay */}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl" style={{ background: "rgba(0,0,0,.7)", backdropFilter: "blur(4px)" }}>
            <div className="text-5xl mb-2">💀</div>
            <div className="text-2xl font-black mb-1">게임 오버</div>
            <div className="text-[13px] mb-1" style={{ color: "rgba(255,255,255,.4)" }}>점수: {score}</div>
            {score === best && score > 0 && <div className="text-[12px] mb-4 text-amber-400">🏆 최고 기록!</div>}
            {score !== best && <div className="mb-4" />}
            <button onClick={restart} className="px-6 py-2.5 rounded-xl font-bold text-[14px] transition-all active:scale-95" style={{ background: "linear-gradient(135deg, #edc22e, #f59563)", color: "#1a1408" }}>다시 하기</button>
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-[11px] px-5 pb-6" style={{ color: "rgba(255,255,255,.15)" }}>
        <p>⌨️ 화살표 키 또는 보드 위 스와이프</p>
        <p className="mt-1">↶ Ctrl/Cmd+Z 되돌리기 (1단계)</p>
      </div>
    </div>
  );
}
