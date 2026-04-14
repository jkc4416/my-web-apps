"use client";

import { useState, useCallback, useEffect } from "react";
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
  const maxTries = 6;

  const submit = useCallback(() => {
    if (current.length !== answer.length || gameState !== "playing") return;
    const result = checkGuess(current, answer);
    const newGuesses = [...guesses, { word: current, result }];
    setGuesses(newGuesses);
    setCurrent("");

    if (current === answer) {
      setGameState("won");
    } else if (newGuesses.length >= maxTries) {
      setGameState("lost");
    }
  }, [current, answer, guesses, gameState, maxTries]);

  // Keyboard
  useEffect(() => {
    const handleKey = (e) => {
      if (gameState !== "playing") return;
      if (e.key === "Enter") submit();
      else if (e.key === "Backspace") setCurrent((c) => c.slice(0, -1));
      else if (/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z]$/.test(e.key) && current.length < answer.length) {
        setCurrent((c) => c + e.key);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState, submit, current, answer.length]);

  const share = () => {
    const grid = guesses.map((g) => g.result.map((r) => r === "correct" ? "🟩" : r === "present" ? "🟨" : "⬛").join("")).join("\n");
    const text = `한글 워들 ${gameState === "won" ? guesses.length : "X"}/${maxTries}\n\n${grid}\n\n나도 도전 → funappbox.com/wordle-kr`;
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
            <input type="text" value={current} onChange={(e) => { const v = e.target.value; if (v.length <= answer.length) setCurrent(v); }}
              placeholder={`${answer.length}글자 입력...`} aria-label="단어 입력"
              className="w-full rounded-xl px-4 py-3 text-center text-[16px] font-bold outline-none"
              style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", color: "#e2e8f0" }}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }} />
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
