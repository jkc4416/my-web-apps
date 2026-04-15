"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";

const DIFFS = [
  { name: "초급", rows: 9, cols: 9, mines: 10 },
  { name: "중급", rows: 12, cols: 12, mines: 30 },
  { name: "고급", rows: 16, cols: 16, mines: 60 },
];

function createBoard(rows, cols, mines, firstR, firstC) {
  const board = Array(rows).fill(null).map(() => Array(cols).fill(null).map(() => ({ mine: false, revealed: false, flagged: false, count: 0 })));
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows), c = Math.floor(Math.random() * cols);
    if (board[r][c].mine || (Math.abs(r - firstR) <= 1 && Math.abs(c - firstC) <= 1)) continue;
    board[r][c].mine = true;
    placed++;
  }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    if (board[r][c].mine) continue;
    let cnt = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].mine) cnt++;
    }
    board[r][c].count = cnt;
  }
  return board;
}

function reveal(board, r, c) {
  const rows = board.length, cols = board[0].length;
  if (r < 0 || r >= rows || c < 0 || c >= cols) return;
  const cell = board[r][c];
  if (cell.revealed || cell.flagged) return;
  cell.revealed = true;
  if (cell.count === 0 && !cell.mine) {
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) reveal(board, r + dr, c + dc);
  }
}

const NUM_COLORS = ["", "#3b82f6", "#22c55e", "#ef4444", "#7c3aed", "#a16207", "#06b6d4", "#000", "#6b7280"];

export default function MinesweeperPage() {
  const [diff, setDiff] = useState(0);
  const [board, setBoard] = useState(null);
  const [gameState, setGameState] = useState("idle"); // idle, playing, won, lost
  const [flagMode, setFlagMode] = useState(false);
  const [time, setTime] = useState(0);
  const [timerRef, setTimerRef] = useState(null);
  const [bestTimes, setBestTimes] = useState([null, null, null]); // best per difficulty (seconds), null = no record

  // Load + persist best times
  useEffect(() => {
    try { const s = localStorage.getItem("minesweeper-best"); if (s) setBestTimes(JSON.parse(s)); } catch {}
  }, []);
  useEffect(() => { try { localStorage.setItem("minesweeper-best", JSON.stringify(bestTimes)); } catch {} }, [bestTimes]);

  const { rows, cols, mines } = DIFFS[diff];

  // Cleanup timer on unmount
  useEffect(() => { return () => { if (timerRef) clearInterval(timerRef); }; }, [timerRef]);

  const startGame = useCallback((firstR, firstC) => {
    const b = createBoard(rows, cols, mines, firstR, firstC);
    reveal(b, firstR, firstC);
    setBoard(b.map((r) => r.map((c) => ({ ...c }))));
    setGameState("playing");
    setTime(0);
    const t = setInterval(() => setTime((p) => p + 1), 1000);
    setTimerRef(t);
  }, [rows, cols, mines]);

  const handleCell = useCallback((r, c) => {
    if (gameState === "idle") { startGame(r, c); return; }
    if (gameState !== "playing" || !board) return;

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    const cell = newBoard[r][c];

    if (flagMode) {
      if (!cell.revealed) cell.flagged = !cell.flagged;
    } else {
      if (cell.flagged) return;
      if (cell.mine) {
        // Game over — reveal all mines
        newBoard.forEach((row) => row.forEach((c) => { if (c.mine) c.revealed = true; }));
        setBoard(newBoard);
        setGameState("lost");
        if (timerRef) clearInterval(timerRef);
        return;
      }
      reveal(newBoard, r, c);
    }

    setBoard(newBoard);

    // Check win
    const unrevealed = newBoard.flat().filter((c) => !c.revealed && !c.mine).length;
    if (unrevealed === 0) {
      setGameState("won");
      if (timerRef) clearInterval(timerRef);
      // Record best time for current difficulty
      setBestTimes((prev) => {
        const next = [...prev];
        if (next[diff] === null || time < next[diff]) next[diff] = time;
        return next;
      });
    }
  }, [board, gameState, flagMode, startGame, timerRef, diff, time]);

  const reset = () => {
    setBoard(null);
    setGameState("idle");
    setFlagMode(false);
    setTime(0);
    if (timerRef) clearInterval(timerRef);
  };

  const flagCount = board ? board.flat().filter((c) => c.flagged).length : 0;
  const cellPx = Math.min(Math.floor((Math.min(typeof window !== "undefined" ? window.innerWidth : 440, 440) - 40) / cols), 32);

  return (
    <div className="min-h-screen text-white flex flex-col items-center" style={{ background: "radial-gradient(ellipse at 50% 0%, #0a0a1a 0%, #060610 40%, #030308 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{ color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(12px)" }}>← 홈</Link>

      <div className="w-full max-w-[500px] px-4 pt-14 pb-8">
        <header className="text-center mb-4">
          <h1 className="text-2xl font-black" style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>💣 지뢰찾기</h1>
        </header>

        {/* Controls */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1.5">
            {DIFFS.map((d, i) => (
              <button key={i} onClick={() => { setDiff(i); reset(); }}
                className="px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all"
                style={diff === i ? { background: "rgba(96,165,250,.1)", color: "#60a5fa", border: "1px solid rgba(96,165,250,.2)" } : { color: "rgba(255,255,255,.2)", border: "1px solid transparent" }}>
                {d.name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span style={{ color: "rgba(255,255,255,.25)" }}>💣 {mines - flagCount}</span>
            <span style={{ color: "rgba(255,255,255,.25)" }}>⏱ {time}s</span>
            {bestTimes[diff] !== null && <span style={{ color: "#fbbf24" }}>🏆 {bestTimes[diff]}s</span>}
          </div>
        </div>

        {/* Flag toggle + reset */}
        <div className="flex gap-2 mb-3">
          <button onClick={() => setFlagMode(!flagMode)}
            className="flex-1 py-2 rounded-lg text-[11px] font-semibold transition-all"
            style={{ background: flagMode ? "rgba(239,68,68,.15)" : "rgba(255,255,255,.03)", border: `1px solid ${flagMode ? "rgba(239,68,68,.3)" : "rgba(255,255,255,.06)"}`, color: flagMode ? "#f87171" : "rgba(255,255,255,.3)" }}>
            {flagMode ? "🚩 깃발 모드 ON" : "👆 탐색 모드"}
          </button>
          <button onClick={reset} className="px-4 py-2 rounded-lg text-[11px] font-semibold" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", color: "rgba(255,255,255,.3)" }}>🔄</button>
        </div>

        {/* Board */}
        <div className="flex justify-center">
          <div className="inline-grid gap-px rounded-xl overflow-hidden select-none" style={{ gridTemplateColumns: `repeat(${cols}, ${cellPx}px)`, background: "rgba(255,255,255,.04)", touchAction: "manipulation" }}>
            {(board || Array(rows).fill(null).map(() => Array(cols).fill({ mine: false, revealed: false, flagged: false, count: 0 }))).flat().map((cell, idx) => {
              const r = Math.floor(idx / cols), c = idx % cols;
              return (
                <button key={idx} onClick={() => handleCell(r, c)}
                  className="flex items-center justify-center font-bold transition-all active:scale-90"
                  style={{
                    width: cellPx, height: cellPx, fontSize: cellPx * 0.45,
                    background: cell.revealed ? (cell.mine ? "rgba(239,68,68,.15)" : "rgba(255,255,255,.02)") : "rgba(255,255,255,.06)",
                    color: cell.revealed && cell.count > 0 ? NUM_COLORS[cell.count] : "rgba(255,255,255,.4)",
                  }}>
                  {cell.flagged && !cell.revealed ? "🚩" : cell.revealed ? (cell.mine ? "💣" : cell.count > 0 ? cell.count : "") : ""}
                </button>
              );
            })}
          </div>
        </div>

        {/* Game over overlay */}
        {(gameState === "won" || gameState === "lost") && (
          <div className="mt-4 text-center rounded-2xl p-5" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
            <div className="text-3xl mb-2">{gameState === "won" ? "🎉" : "💥"}</div>
            <div className="text-lg font-black mb-1">{gameState === "won" ? "클리어!" : "게임 오버"}</div>
            <div className="text-[12px] mb-1" style={{ color: "rgba(255,255,255,.3)" }}>{time}초 · {DIFFS[diff].name}</div>
            {gameState === "won" && bestTimes[diff] === time && <div className="text-[11px] mb-2 text-amber-400 font-bold">🏆 최고 기록!</div>}
            {gameState === "won" && bestTimes[diff] !== null && bestTimes[diff] !== time && <div className="text-[10px] mb-2" style={{ color: "rgba(255,255,255,.3)" }}>최고 기록: {bestTimes[diff]}초</div>}
            <div className="mb-3" />
            <button onClick={reset} className="px-6 py-2.5 rounded-xl font-bold text-[13px] transition-all active:scale-95" style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)" }}>다시 하기</button>
          </div>
        )}
      </div>
    </div>
  );
}
