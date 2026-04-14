"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";

const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function checkWinner(b) {
  for (const [a, c, d] of LINES) { if (b[a] && b[a] === b[c] && b[a] === b[d]) return { winner: b[a], line: [a, c, d] }; }
  if (b.every(Boolean)) return { winner: "draw", line: null };
  return null;
}

// Minimax AI
function minimax(board, isMax, alpha, beta) {
  const result = checkWinner(board);
  if (result) { if (result.winner === "O") return 10; if (result.winner === "X") return -10; return 0; }
  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i]) continue;
      board[i] = "O"; best = Math.max(best, minimax(board, false, alpha, beta)); board[i] = null;
      alpha = Math.max(alpha, best); if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i]) continue;
      board[i] = "X"; best = Math.min(best, minimax(board, true, alpha, beta)); board[i] = null;
      beta = Math.min(beta, best); if (beta <= alpha) break;
    }
    return best;
  }
}

function aiMove(board) {
  let bestVal = -Infinity, bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    board[i] = "O";
    const val = minimax(board, false, -Infinity, Infinity);
    board[i] = null;
    if (val > bestVal) { bestVal = val; bestMove = i; }
  }
  return bestMove;
}

export default function TicTacToePage() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState({ win: 0, lose: 0, draw: 0 });
  const [difficulty, setDifficulty] = useState("hard"); // easy, hard

  useEffect(() => {
    try { const s = localStorage.getItem("ttt-score"); if (s) setScore(JSON.parse(s)); } catch {}
  }, []);

  const saveScore = useCallback((s) => {
    setScore(s);
    try { localStorage.setItem("ttt-score", JSON.stringify(s)); } catch {}
  }, []);

  // AI turn
  useEffect(() => {
    if (isPlayerTurn || result) return;
    const timer = setTimeout(() => {
      const newBoard = [...board];
      let move;
      if (difficulty === "easy" && Math.random() < 0.4) {
        const empty = board.map((v, i) => v === null ? i : -1).filter((i) => i >= 0);
        move = empty[Math.floor(Math.random() * empty.length)];
      } else {
        move = aiMove([...newBoard]);
      }
      if (move === -1) return;
      newBoard[move] = "O";
      setBoard(newBoard);
      const res = checkWinner(newBoard);
      if (res) {
        setResult(res);
        if (res.winner === "O") saveScore({ ...score, lose: score.lose + 1 });
        else if (res.winner === "draw") saveScore({ ...score, draw: score.draw + 1 });
      }
      setIsPlayerTurn(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [isPlayerTurn, board, result, difficulty, score, saveScore]);

  const handleClick = useCallback((i) => {
    if (board[i] || !isPlayerTurn || result) return;
    const newBoard = [...board];
    newBoard[i] = "X";
    setBoard(newBoard);
    const res = checkWinner(newBoard);
    if (res) {
      setResult(res);
      if (res.winner === "X") saveScore({ ...score, win: score.win + 1 });
      else if (res.winner === "draw") saveScore({ ...score, draw: score.draw + 1 });
      return;
    }
    setIsPlayerTurn(false);
  }, [board, isPlayerTurn, result, score, saveScore]);

  const restart = () => { setBoard(Array(9).fill(null)); setIsPlayerTurn(true); setResult(null); };

  return (
    <div className="min-h-screen text-white flex flex-col items-center" style={{ background: "radial-gradient(ellipse at 50% 0%, #1a1008 0%, #0e0806 40%, #080504 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{ color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(12px)" }}>← 홈</Link>

      <div className="w-full max-w-[440px] px-5 pt-14 pb-8">
        <header className="text-center mb-4">
          <h1 className="text-2xl font-black" style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>❌⭕ 틱택토</h1>
          <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,.25)" }}>AI와 대결! 당신은 X, AI는 O</p>
        </header>

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1.5">
            {[["easy", "쉬움"], ["hard", "어려움"]].map(([d, label]) => (
              <button key={d} onClick={() => { setDifficulty(d); restart(); }}
                className="px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all"
                style={difficulty === d ? { background: "rgba(245,158,11,.1)", color: "#f59e0b", border: "1px solid rgba(245,158,11,.2)" } : { color: "rgba(255,255,255,.2)", border: "1px solid transparent" }}>
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-3 text-[11px]">
            <span style={{ color: "#4ade80" }}>승 {score.win}</span>
            <span style={{ color: "rgba(255,255,255,.2)" }}>무 {score.draw}</span>
            <span style={{ color: "#f87171" }}>패 {score.lose}</span>
          </div>
        </div>

        {/* Board */}
        <div className="flex justify-center mb-4">
          <div className="grid grid-cols-3 gap-2">
            {board.map((cell, i) => {
              const isWinLine = result?.line?.includes(i);
              return (
                <button key={i} onClick={() => handleClick(i)}
                  className="w-24 h-24 rounded-xl flex items-center justify-center text-4xl font-black transition-all active:scale-95"
                  style={{
                    background: isWinLine ? "rgba(251,191,36,.1)" : "rgba(255,255,255,.03)",
                    border: `2px solid ${isWinLine ? "rgba(251,191,36,.3)" : "rgba(255,255,255,.06)"}`,
                    color: cell === "X" ? "#60a5fa" : cell === "O" ? "#f87171" : "transparent",
                  }}>
                  {cell || "·"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-4">
          {result ? (
            <div>
              <div className="text-2xl mb-2">{result.winner === "X" ? "🎉 승리!" : result.winner === "O" ? "😢 패배..." : "🤝 무승부"}</div>
              <button onClick={restart} className="px-6 py-2.5 rounded-xl font-bold text-[13px] transition-all active:scale-95" style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}>다시 하기</button>
            </div>
          ) : (
            <p className="text-[12px]" style={{ color: "rgba(255,255,255,.2)" }}>{isPlayerTurn ? "당신의 차례 (X)" : "AI 생각 중..."}</p>
          )}
        </div>
      </div>
    </div>
  );
}
