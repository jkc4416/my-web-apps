"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";

const WORDS = ["사과나무","행복하다","대한민국","컴퓨터실","도서관에","치킨집에","학교가자","고양이가","강아지가","햄버거를","떡볶이를","김치찌개","된장찌개","불고기를","비빔밥을","냉면먹자","삼겹살을","피자한판","초밥먹자","커피한잔","라떼한잔","주말여행","바다가자","산책하자","운동하자","음악듣자","영화보자","게임하자","공부하자","청소하자","요리하자","장보러가","편의점에","마트가자","카페가자","서울시내","부산가자","제주도로","봄바람이","여름날씨","가을하늘","겨울눈이","벚꽃피다","단풍나무","눈사람을","생일축하","새해복을","토요일에","일요일에","월요일에"];

function getDaily() {
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return WORDS[seed % WORDS.length];
}

function checkGuess(guess, answer) {
  const result = Array(answer.length).fill("absent"); // absent, present, correct
  const ansArr = [...answer];
  const guessArr = [...guess];

  // First pass: correct positions
  guessArr.forEach((ch, i) => {
    if (ch === ansArr[i]) {
      result[i] = "correct";
      ansArr[i] = null;
    }
  });

  // Second pass: present but wrong position
  guessArr.forEach((ch, i) => {
    if (result[i] === "correct") return;
    const idx = ansArr.indexOf(ch);
    if (idx !== -1) {
      result[i] = "present";
      ansArr[idx] = null;
    }
  });

  return result;
}

const COLORS = { correct: "#4ade80", present: "#fbbf24", absent: "rgba(255,255,255,.08)" };
const BG = { correct: "rgba(74,222,128,0.15)", present: "rgba(251,191,36,0.15)", absent: "rgba(255,255,255,.03)" };

export default function WordleKrPage() {
  const [answer] = useState(() => getDaily());
  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState("");
  const [gameState, setGameState] = useState("playing"); // playing, won, lost
  const [stats, setStats] = useState({ played: 0, wins: 0, streak: 0, bestStreak: 0, distribution: [0, 0, 0, 0, 0, 0] });
  const [todayKey] = useState(() => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; });
  const composingRef = useRef(false);
  const recordedRef = useRef(false);
  const maxTries = 6;

  // Load + persist stats
  useEffect(() => {
    try {
      const s = localStorage.getItem("wordle-kr-stats"); if (s) setStats(JSON.parse(s));
      const lastDay = localStorage.getItem("wordle-kr-last-day");
      const lastGuesses = localStorage.getItem("wordle-kr-last-guesses");
      const lastState = localStorage.getItem("wordle-kr-last-state");
      // Restore today's progress
      if (lastDay === todayKey) {
        if (lastGuesses) setGuesses(JSON.parse(lastGuesses));
        if (lastState && lastState !== "playing") { setGameState(lastState); recordedRef.current = true; }
      }
    } catch {}
  }, [todayKey]);
  useEffect(() => { try { localStorage.setItem("wordle-kr-stats", JSON.stringify(stats)); } catch {} }, [stats]);
  useEffect(() => { try { localStorage.setItem("wordle-kr-last-day", todayKey); localStorage.setItem("wordle-kr-last-guesses", JSON.stringify(guesses)); localStorage.setItem("wordle-kr-last-state", gameState); } catch {} }, [todayKey, guesses, gameState]);

  const submit = useCallback(() => {
    if (current.length !== answer.length || gameState !== "playing") return;
    const result = checkGuess(current, answer);
    const newGuesses = [...guesses, { word: current, result }];
    setGuesses(newGuesses);
    setCurrent("");

    if (current === answer) {
      setGameState("won");
      if (!recordedRef.current) {
        recordedRef.current = true;
        setStats((s) => {
          const dist = [...s.distribution];
          dist[newGuesses.length - 1]++;
          const newStreak = s.streak + 1;
          return { played: s.played + 1, wins: s.wins + 1, streak: newStreak, bestStreak: Math.max(s.bestStreak, newStreak), distribution: dist };
        });
      }
    } else if (newGuesses.length >= maxTries) {
      setGameState("lost");
      if (!recordedRef.current) {
        recordedRef.current = true;
        setStats((s) => ({ ...s, played: s.played + 1, streak: 0 }));
      }
    }
  }, [current, answer, guesses, gameState, maxTries]);

  // Global keyboard shortcuts only — character input is handled by the <input> onChange
  // (having both caused each character to be entered twice)
  useEffect(() => {
    const handleKey = (e) => {
      if (gameState !== "playing") return;
      // Skip if the input itself is focused — input's own handlers manage Enter
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      if (composingRef.current) return;
      if (e.key === "Enter") submit();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState, submit]);

  const share = () => {
    const grid = guesses.map((g) => g.result.map((r) => r === "correct" ? "🟩" : r === "present" ? "🟨" : "⬛").join("")).join("\n");
    const text = `한글 워들 ${gameState === "won" ? guesses.length : "X"}/${maxTries}\n\n${grid}\n\n나도 도전 → www.funappbox.com/wordle-kr`;
    if(navigator.share)try{navigator.share({ title: "한글 워들", text });}catch{}
    else { try { navigator.clipboard.writeText(text); } catch {} alert("복사되었습니다!"); }
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center" style={{ background: "radial-gradient(ellipse at 50% 0%, #0a1a0a 0%, #060e06 40%, #030803 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{ color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(12px)" }}>← 홈</Link>

      <div className="w-full max-w-[440px] px-5 pt-14 pb-16">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-black" style={{ background: "linear-gradient(135deg, #4ade80, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>한글 워들</h1>
          <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,.25)" }}>{answer.length}글자 단어를 맞춰보세요! ({maxTries}번 기회)</p>
        </header>

        {/* Grid */}
        <div className="space-y-1.5 mb-6">
          {Array.from({ length: maxTries }, (_, row) => {
            const guess = guesses[row];
            const isCurrent = row === guesses.length && gameState === "playing";
            const word = guess ? guess.word : isCurrent ? current : "";
            return (
              <div key={row} className="flex gap-1.5 justify-center">
                {Array.from({ length: answer.length }, (_, col) => {
                  const ch = word[col] || "";
                  const status = guess?.result[col];
                  return (
                    <div key={col} className="w-12 h-12 flex items-center justify-center rounded-lg text-[18px] font-black transition-all duration-300"
                      style={{
                        background: status ? BG[status] : isCurrent && col < current.length ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.02)",
                        border: `2px solid ${status ? COLORS[status] : isCurrent && col === current.length ? "rgba(255,255,255,.2)" : "rgba(255,255,255,.04)"}`,
                        color: status ? COLORS[status] : "rgba(255,255,255,.6)",
                      }}>
                      {ch}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Input for mobile */}
        {gameState === "playing" && (
          <div className="space-y-2">
            <input type="text" value={current} autoFocus
              onChange={(e) => { const v = e.target.value; if (v.length <= answer.length + 1) setCurrent(v.slice(0, answer.length)); }}
              onCompositionStart={() => { composingRef.current = true; }}
              onCompositionEnd={(e) => { composingRef.current = false; const v = e.target.value; setCurrent(v.slice(0, answer.length)); }}
              placeholder={`${answer.length}글자 입력...`} aria-label="단어 입력"
              className="w-full rounded-xl px-4 py-3 text-center text-[16px] font-bold outline-none"
              style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", color: "#e2e8f0" }}
              onKeyDown={(e) => { if (e.key === "Enter" && !composingRef.current) submit(); }} />
            <button onClick={submit} disabled={current.length !== answer.length}
              className="w-full py-3 rounded-xl font-bold text-[14px] transition-all active:scale-[0.97] disabled:opacity-30"
              style={{ background: "linear-gradient(135deg, #4ade80, #22d3ee)" }}>
              확인
            </button>
          </div>
        )}

        {/* Result */}
        {gameState !== "playing" && (
          <div className="text-center">
            <div className="text-4xl mb-2">{gameState === "won" ? "🎉" : "😢"}</div>
            <h2 className="text-xl font-black mb-1">{gameState === "won" ? `${guesses.length}번 만에 맞췄어요!` : "아쉬워요!"}</h2>
            {gameState === "lost" && <p className="text-[13px] mb-3" style={{ color: "rgba(255,255,255,.3)" }}>정답: <strong className="text-emerald-400">{answer}</strong></p>}

            {/* Stats */}
            {stats.played > 0 && (
              <div className="mt-4 mb-3 grid grid-cols-4 gap-2">
                {[["플레이", stats.played, "#fbbf24"], ["승률", `${Math.round(stats.wins / stats.played * 100)}%`, "#4ade80"], ["연승", stats.streak, "#60a5fa"], ["최고연승", stats.bestStreak, "#a78bfa"]].map(([l, v, c]) => (
                  <div key={l} className="rounded-lg p-2" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
                    <div className="text-base font-black tabular-nums" style={{ color: c }}>{v}</div>
                    <div className="text-[9px]" style={{ color: "rgba(255,255,255,.3)" }}>{l}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Distribution */}
            {stats.wins > 0 && (
              <div className="rounded-xl p-3 mb-3" style={{ background: "rgba(255,255,255,.02)" }}>
                <div className="text-[10px] text-left mb-1.5" style={{ color: "rgba(255,255,255,.3)" }}>시도 분포</div>
                {stats.distribution.map((c, i) => {
                  const max = Math.max(...stats.distribution, 1);
                  const pct = (c / max) * 100;
                  return (
                    <div key={i} className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] w-3" style={{ color: "rgba(255,255,255,.4)" }}>{i + 1}</span>
                      <div className="flex-1 h-4 rounded relative" style={{ background: "rgba(255,255,255,.04)" }}>
                        <div className="h-full rounded flex items-center justify-end px-1.5 text-[9px] font-bold" style={{ width: `${Math.max(pct, c > 0 ? 8 : 0)}%`, background: i + 1 === guesses.length && gameState === "won" ? "#4ade80" : "rgba(255,255,255,.15)", color: c > 0 ? "#fff" : "transparent" }}>{c || ""}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button onClick={() => window.location.reload()} className="flex-1 py-3 rounded-xl text-[13px] font-semibold" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", color: "rgba(255,255,255,.4)" }}>내일 다시</button>
              <button onClick={share} className="flex-1 py-3 rounded-xl text-[13px] font-semibold" style={{ background: "linear-gradient(135deg, #4ade80, #fbbf24)" }}>결과 공유</button>
            </div>
          </div>
        )}

        <div className="mt-6 text-[10px] text-center" style={{ color: "rgba(255,255,255,.08)" }}>
          <p>🟩 위치·글자 정확 | 🟨 글자는 맞지만 위치 다름 | ⬛ 없는 글자</p>
        </div>
      </div>
    </div>
  );
}
