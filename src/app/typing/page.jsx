"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";

/*
  ╔══════════════════════════════════════════════════════════════╗
  ║  타이핑 챌린지 — Redesigned                                    ║
  ║  Design: Competitive Energy + Amber Glow                     ║
  ║  Palette: Deep warm dark + amber/gold accents                ║
  ╚══════════════════════════════════════════════════════════════╝
*/

const TEXTS = {
  proverb: { name: "명언", emoji: "📜", items: [
    "뜻이 있는 곳에 길이 있다","천 리 길도 한 걸음부터 시작된다","오늘 할 일을 내일로 미루지 마라",
    "가는 말이 고와야 오는 말이 곱다","시작이 반이다","낮말은 새가 듣고 밤말은 쥐가 듣는다",
    "세 살 버릇 여든까지 간다","호랑이도 제 말 하면 온다","고생 끝에 낙이 온다",
    "꿈을 꾸지 않으면 아무 일도 일어나지 않는다","배움에는 끝이 없다","실패는 성공의 어머니이다",
    "급할수록 돌아가라","백문이 불여일견이다","하늘은 스스로 돕는 자를 돕는다",
  ]},
  essay: { name: "수필", emoji: "📖", items: [
    "나는 나비의 날개에서 가을을 보았다 그것은 누구의 것도 아닌 자유로운 비행이었다",
    "봄비가 내리는 창가에 앉아 책 한 권을 펼쳤다 글자 사이로 따뜻한 햇살이 스며들었다",
    "도시의 불빛 아래에서 별을 찾는 사람들이 있다 그들은 하늘이 아니라 마음속을 올려다본다",
    "오래된 골목길을 걸으면 시간이 천천히 흐르는 것 같다 벽 틈새로 피어난 작은 꽃이 인사를 건넨다",
    "가을 저녁 노을 앞에 서면 말이 필요 없어진다 그저 바라보는 것만으로 충분한 순간들이 있다",
    "비 오는 날 카페에서 마시는 커피 한 잔은 세상 그 어떤 것보다 따뜻하다",
    "길을 잃었을 때 비로소 새로운 풍경을 발견하게 된다 그것이 여행의 진정한 의미일지도 모른다",
  ]},
  news: { name: "뉴스", emoji: "📰", items: [
    "정부는 올해 경제 성장률 전망치를 상향 조정했다고 발표했다",
    "인공지능 기술의 발전이 다양한 산업 분야에 혁신적인 변화를 가져오고 있다",
    "기후 변화에 대응하기 위한 국제 사회의 노력이 가속화되고 있다",
    "반도체 산업의 호황으로 관련 기업들의 실적이 크게 개선되었다",
    "새로운 교육 정책이 시행되면서 학생들의 학습 환경에 변화가 예상된다",
    "국내 스타트업 생태계가 빠르게 성장하며 글로벌 시장에서 주목받고 있다",
  ]},
  coding: { name: "코딩", emoji: "💻", items: [
    "const result = array.filter(item => item.value > 10).map(item => item.name);",
    "function calculateSum(numbers) { return numbers.reduce((acc, num) => acc + num, 0); }",
    "import { useState, useEffect } from 'react';",
    "const fetchData = async () => { const response = await fetch(url); return response.json(); };",
    "export default function App() { return <div className='container'>Hello World</div>; }",
    "if (condition && isValid) { handleSubmit(data); } else { showError('Invalid input'); }",
    "const [count, setCount] = useState(0);",
    "document.querySelector('.button').addEventListener('click', handleClick);",
  ]},
  hard: { name: "고난도", emoji: "🔥", items: [
    "밑빠진 독에 물 붓기라는 속담처럼 허무한 일도 있지만 그래도 포기하지 않는 것이 중요하다",
    "쌍쌍이 찌그러진 찐빵을 쪄낸 뒤 빨갛게 익은 딸기를 올려놓았다",
    "칠천칠백칠십칠 명의 참가자가 철저한 준비를 거쳐 체계적으로 참여했다",
    "흐릿한 안개 속에서 희미하게 빛나는 불빛을 따라 걸어갔다",
    "창밖으로 쏟아지는 빗줄기를 바라보며 지난 시절의 추억에 잠겼다",
  ]},
};

function getRandText(cat, n = 5) {
  const pool = cat === "all" ? Object.values(TEXTS).flatMap(t => t.items) : TEXTS[cat]?.items || [];
  return [...pool].sort(() => Math.random() - 0.5).slice(0, n).join(" ");
}

export default function TypingChallenge() {
  const [pg, setPg] = useState("home");
  const [mode, setMode] = useState("timed");
  const [cat, setCat] = useState("all");
  const [target, setTarget] = useState("");
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startT, setStartT] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpmHist, setWpmHist] = useState([]);
  const [curWpm, setCurWpm] = useState(0);
  const [curAcc, setCurAcc] = useState(100);
  const [stats, setStats] = useState({ tests: 0, best: 0, avg: 0, total: 0 });
  const [ranks, setRanks] = useState([]);
  const [nick, setNick] = useState("");
  const [showRank, setShowRank] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const wpmRef = useRef(null);
  const cvs = useRef(null);

  // Timer
  useEffect(() => {
    if (started && !finished && mode === "timed") {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => { if (t <= 1) { doFinish(); return 0; } return t - 1; });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [started, finished, mode]);

  // WPM tracker
  useEffect(() => {
    if (started && !finished) {
      wpmRef.current = setInterval(() => {
        if (!startT) return;
        const el = (Date.now() - startT) / 60000; if (el <= 0) return;
        let ok = 0; for (let i = 0; i < typed.length && i < target.length; i++) { if (typed[i] === target[i]) ok++; }
        const wpm = Math.round(ok / el);
        setCurWpm(wpm);
        setWpmHist(p => [...p, { t: Math.round(el * 60), wpm }]);
      }, 2000);
      return () => clearInterval(wpmRef.current);
    }
  }, [started, finished, startT, typed, target]);

  const doStart = useCallback((m, c) => {
    setMode(m); setCat(c);
    const txt = getRandText(c, m === "sentence" ? 1 : 8);
    setTarget(txt); setTyped(""); setStarted(false); setFinished(false);
    setStartT(null); setTimeLeft(60); setWpmHist([]); setCurWpm(0); setCurAcc(100); setShowRank(false);
    setPg("test");
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const composingRef = useRef(false);

  const processInput = useCallback((v) => {
    if (!started && v.length > 0) { setStarted(true); setStartT(Date.now()); }
    setTyped(v);
    let ok = 0; for (let i = 0; i < v.length && i < target.length; i++) { if (v[i] === target[i]) ok++; }
    setCurAcc(v.length > 0 ? Math.round((ok / v.length) * 100) : 100);
    if (mode === "sentence" && v.length >= target.length) doFinish(v);
    if ((mode === "timed" || mode === "practice") && v.length > target.length - 30) {
      setTarget(p => p + " " + getRandText(cat, 3));
    }
  }, [started, target, mode, cat]);

  const handleInput = useCallback((e) => {
    if (finished) return;
    const v = e.target.value;
    // During IME composition, only update the display but don't process
    if (composingRef.current) {
      setTyped(v);
      return;
    }
    processInput(v);
  }, [finished, processInput]);

  const handleCompositionEnd = useCallback((e) => {
    composingRef.current = false;
    if (finished) return;
    processInput(e.target.value);
  }, [finished, processInput]);

  const doFinish = useCallback((ft) => {
    const t = ft || typed;
    setFinished(true); clearInterval(timerRef.current); clearInterval(wpmRef.current);
    const el = (Date.now() - (startT || Date.now())) / 60000;
    let ok = 0; for (let i = 0; i < t.length && i < target.length; i++) { if (t[i] === target[i]) ok++; }
    const wpm = el > 0 ? Math.round(ok / el) : 0;
    const acc = t.length > 0 ? Math.round((ok / t.length) * 100) : 0;
    setCurWpm(wpm); setCurAcc(acc);
    setStats(p => ({ tests: p.tests + 1, best: Math.max(p.best, wpm), total: p.total + wpm, avg: Math.round((p.total + wpm) / (p.tests + 1)) }));
    setPg("result");
  }, [typed, target, startT]);

  const submitRank = () => {
    if (!nick.trim()) return;
    setRanks(p => [...p, { name: nick, wpm: curWpm, acc: curAcc }].sort((a, b) => b.wpm - a.wpm).slice(0, 20));
    setShowRank(false);
  };

  const saveImg = useCallback(() => {
    const c = cvs.current; if (!c) return; const x = c.getContext("2d");
    c.width = 600; c.height = 300;
    const g = x.createRadialGradient(300, 140, 0, 300, 150, 320);
    g.addColorStop(0, "#1a1208"); g.addColorStop(1, "#0a0806");
    x.fillStyle = g; x.fillRect(0, 0, 600, 300);
    x.textAlign = "center";
    x.fillStyle = "#555"; x.font = "12px sans-serif"; x.fillText("타이핑 챌린지", 300, 28);
    x.fillStyle = "#fbbf24"; x.font = "bold 60px sans-serif"; x.fillText(`${curWpm} WPM`, 300, 120);
    x.fillStyle = curAcc >= 95 ? "#2dd4bf" : curAcc >= 80 ? "#fbbf24" : "#f87171";
    x.font = "bold 22px sans-serif"; x.fillText(`정확도 ${curAcc}%`, 300, 160);
    x.fillStyle = "#444"; x.font = "11px sans-serif"; x.fillText("나도 도전 →", 300, 270);
    const l = document.createElement("a"); l.download = `타이핑_${curWpm}WPM.png`; l.href = c.toDataURL(); l.click();
  }, [curWpm, curAcc]);

  // Rendered text with highlighting
  const renderedText = useMemo(() => {
    if (!target) return null;
    const chars = [];
    for (let i = 0; i < target.length; i++) {
      let cls = ""; let stl = { color: "rgba(255,255,255,.18)" };
      if (i < typed.length) {
        if (typed[i] === target[i]) { stl = { color: "#2dd4bf" }; }
        else { stl = { color: "#f87171", background: "rgba(248,113,113,.1)", borderRadius: 2 }; }
      } else if (i === typed.length) {
        stl = { color: "#fff", background: "rgba(251,191,36,.15)", borderRadius: 2, borderLeft: "2px solid #fbbf24" };
      }
      chars.push(<span key={i} style={stl}>{target[i] === " " ? "\u00A0" : target[i]}</span>);
    }
    return chars;
  }, [target, typed]);

  const accCol = curAcc >= 95 ? "#2dd4bf" : curAcc >= 85 ? "#fbbf24" : "#f87171";
  const grade = curWpm >= 400 ? { l: "⚡ 초인", c: "#fbbf24", d: "상위 1%" } : curWpm >= 300 ? { l: "👑 달인", c: "#f59e0b", d: "상위 5%" } : curWpm >= 200 ? { l: "🔥 고수", c: "#2dd4bf", d: "상위 15%" } : curWpm >= 100 ? { l: "📝 중수", c: "#60a5fa", d: "상위 40%" } : { l: "🌱 초보", c: "#a78bfa", d: "꾸준히 연습!" };

  return (
    <div className="min-h-screen text-white" style={{ background: "radial-gradient(ellipse at 50% 0%, #1a1208 0%, #0e0a06 40%, #08060a 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        @keyframes si { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes orbF { 0%,100% { transform:translate(0,0); } 33% { transform:translate(14px,-20px); } 66% { transform:translate(-10px,14px); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
        .si { animation: si 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
        .od { animation: orbF 16s ease-in-out infinite; }
        .gl { background:rgba(255,255,255,.03); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,.06); }
        .gl2 { background:rgba(255,255,255,.06); backdrop-filter:blur(28px); -webkit-backdrop-filter:blur(28px); border:1px solid rgba(255,255,255,.08); }
        ::-webkit-scrollbar { display:none; }
        input:focus,textarea:focus { outline:none; }
      `}</style>
      <canvas ref={cvs} className="hidden" />

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[500px] h-[500px] rounded-full od" style={{ background: "radial-gradient(circle,rgba(251,191,36,.05),transparent 70%)", top: "-18%", right: "-20%" }} />
        <div className="absolute w-[350px] h-[350px] rounded-full od" style={{ background: "radial-gradient(circle,rgba(245,158,11,.04),transparent 70%)", bottom: "8%", left: "-12%", animationDelay: "-6s" }} />
      </div>

      {/* Home */}<Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{color:"rgba(255,255,255,.4)",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",backdropFilter:"blur(12px)"}}>← 홈</Link>
      {/* Header */}
      <header className="sticky top-0 z-30" style={{ background: "rgba(14,10,6,.88)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between">
          {pg !== "home" ? (
            <button onClick={() => { setPg("home"); setStarted(false); setFinished(false); clearInterval(timerRef.current); }}
              className="text-[13px] hover:text-white transition-colors" style={{ color: "rgba(255,255,255,.3)" }}>← 홈</button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xl">⌨️</span>
              <span className="text-[16px] font-black" style={{ background: "linear-gradient(135deg, #fbbf24, #f59e0b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>타이핑 챌린지</span>
            </div>
          )}
          {pg === "test" && started && !finished && (
            <div className="flex items-center gap-4 text-[13px]">
              <span className="font-black tabular-nums" style={{ color: "#fbbf24" }}>{curWpm} <span className="text-[9px]" style={{ color: "rgba(255,255,255,.15)" }}>WPM</span></span>
              <span className="font-bold tabular-nums" style={{ color: accCol }}>{curAcc}%</span>
              {mode === "timed" && <span className={`font-mono font-bold tabular-nums`} style={{ color: timeLeft <= 10 ? "#f87171" : "rgba(255,255,255,.3)" }}>{timeLeft}s</span>}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pb-16 relative z-10">
        {/* ===== HOME ===== */}
        {pg === "home" && (
          <div className="si">
            <div className="text-center py-8">
              <div className="text-5xl mb-3">⌨️</div>
              <h2 className="text-[24px] font-black">타이핑 챌린지</h2>
              <p className="text-[12px] mt-2" style={{ color: "rgba(255,255,255,.2)" }}>당신의 타이핑 속도를 측정하세요</p>
            </div>

            {/* Stats */}
            {stats.tests > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-6">
                {[["최고 기록", stats.best, "#fbbf24", "WPM"], ["평균", stats.avg, "#2dd4bf", "WPM"], ["테스트", stats.tests, "#a78bfa", "회"]].map(([l, v, c, u]) => (
                  <div key={l} className="text-center p-3 rounded-2xl gl">
                    <div className="text-[9px] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,.12)" }}>{l}</div>
                    <div className="text-xl font-black tabular-nums mt-1" style={{ color: c }}>{v}<span className="text-[9px] ml-0.5" style={{ color: "rgba(255,255,255,.12)" }}>{u}</span></div>
                  </div>
                ))}
              </div>
            )}

            {/* Ad placeholder removed */}

            {/* Modes */}
            <div className="space-y-2.5 mb-6">
              {[
                { m: "timed", name: "1분 테스트", emoji: "⏱️", desc: "60초간 최대한 빠르게", grad: "from-amber-500 to-yellow-600" },
                { m: "sentence", name: "문장 테스트", emoji: "📝", desc: "주어진 문장을 정확하게", grad: "from-blue-500 to-cyan-500" },
                { m: "practice", name: "연습 모드", emoji: "🎯", desc: "시간 제한 없이 자유롭게", grad: "from-emerald-500 to-teal-500" },
              ].map(({ m, name, emoji, desc, grad }, i) => (
                <button key={m} onClick={() => doStart(m, cat)}
                  className="w-full text-left p-5 rounded-2xl gl hover:bg-white/[0.04] active:scale-[0.98] transition-all si"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}>
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-xl shadow-lg`}>{emoji}</div>
                    <div>
                      <div className="text-[14px] font-bold">{name}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,.2)" }}>{desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Category */}
            <div>
              <h3 className="text-[9px] uppercase tracking-[0.2em] mb-2 ml-0.5" style={{ color: "rgba(255,255,255,.12)" }}>Text Category</h3>
              <div className="flex gap-2 flex-wrap">
                {[{ id: "all", name: "전체", emoji: "📚" }, ...Object.entries(TEXTS).map(([id, t]) => ({ id, name: t.name, emoji: t.emoji }))].map(c => (
                  <button key={c.id} onClick={() => setCat(c.id)}
                    className="px-3 py-2 rounded-xl text-[10px] font-semibold transition-all"
                    style={cat === c.id ? { background: "rgba(251,191,36,.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,.2)" } : { color: "rgba(255,255,255,.2)", border: "1px solid transparent" }}>
                    {c.emoji} {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Rankings */}
            {ranks.length > 0 && (
              <div className="mt-6 gl rounded-2xl p-4">
                <h3 className="text-[9px] uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(255,255,255,.12)" }}>🏆 Ranking</h3>
                {ranks.slice(0, 8).map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold w-4" style={{ color: i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : i === 2 ? "#d97706" : "rgba(255,255,255,.15)" }}>{i + 1}</span>
                      <span className="text-[12px]" style={{ color: "rgba(255,255,255,.4)" }}>{r.name}</span>
                    </div>
                    <span className="text-[12px] font-bold tabular-nums" style={{ color: "#fbbf24" }}>{r.wpm} <span className="text-[9px]" style={{ color: "rgba(255,255,255,.12)" }}>WPM</span></span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 space-y-2" style={{ color: "rgba(255,255,255,.08)", fontSize: 10.5, lineHeight: 1.9, borderTop: "1px solid rgba(255,255,255,.03)", paddingTop: 16 }}>
              <h2 style={{ color: "rgba(255,255,255,.12)", fontSize: 11, fontWeight: 700 }}>타이핑 챌린지</h2>
              <p>한글/영어 타이핑 속도를 측정합니다. 명언, 수필, 뉴스, 코딩 등 다양한 텍스트로 연습하세요.</p>
            </div>
          </div>
        )}

        {/* ===== TEST ===== */}
        {pg === "test" && (
          <div className="py-4 si">
            {/* Timer bar */}
            {mode === "timed" && (
              <div className="mb-4">
                <div className="h-[4px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.04)" }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(timeLeft / 60) * 100}%`, background: timeLeft <= 10 ? "#f87171" : "linear-gradient(90deg, #fbbf2488, #fbbf24)" }} />
                </div>
                {!started && <div className="text-center mt-3 text-[12px]" style={{ color: "rgba(255,255,255,.2)" }}>타이핑을 시작하면 타이머가 시작됩니다</div>}
              </div>
            )}

            {/* Live stats */}
            {started && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[["WPM", curWpm, "#fbbf24"], ["정확도", `${curAcc}%`, accCol], [mode === "timed" ? "남은 시간" : "입력", mode === "timed" ? `${timeLeft}s` : typed.length, "rgba(255,255,255,.4)"]].map(([l, v, c]) => (
                  <div key={l} className="text-center p-2 rounded-xl gl">
                    <div className="text-[9px] uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,.1)" }}>{l}</div>
                    <div className="text-[16px] font-black tabular-nums mt-0.5 font-mono" style={{ color: c }}>{v}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Text display */}
            <div className="p-5 rounded-2xl gl2 mb-4 min-h-[140px] max-h-[260px] overflow-y-auto cursor-text"
              onClick={() => inputRef.current?.focus()}>
              <div className="text-[15px] leading-[2.4] font-mono tracking-wide break-all">{renderedText}</div>
            </div>

            {/* Hidden input */}
            <textarea ref={inputRef} value={typed} onChange={handleInput} disabled={finished}
              onCompositionStart={() => { composingRef.current = true; }}
              onCompositionEnd={handleCompositionEnd}
              className="w-full h-0 opacity-0 absolute" autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" />

            <button onClick={() => inputRef.current?.focus()}
              className="w-full py-3 rounded-2xl text-[12px] transition-all active:scale-[0.98] gl hover:bg-white/[0.04]"
              style={{ color: "rgba(255,255,255,.25)", border: "1px dashed rgba(255,255,255,.06)" }}>
              {started ? "여기를 탭하여 계속 입력..." : "탭하여 타이핑 시작 →"}
            </button>

            {mode === "practice" && started && (
              <button onClick={() => doFinish()}
                className="w-full mt-2 py-3 rounded-2xl gl text-[12px] font-medium active:scale-[0.98]" style={{ color: "rgba(255,255,255,.25)" }}>
                ✓ 연습 종료
              </button>
            )}
          </div>
        )}

        {/* ===== RESULT ===== */}
        {pg === "result" && (
          <div className="py-6 si">
            {/* Main score */}
            <div className="text-center mb-6">
              <div className="text-5xl mb-2">⌨️</div>
              <div className="text-[56px] font-black tabular-nums font-mono leading-none" style={{ color: "#fbbf24" }}>{curWpm}</div>
              <div className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,.2)" }}>WPM</div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[["정확도", `${curAcc}%`, accCol], ["입력 글자", typed.length, "#60a5fa"], ["오타", (() => { let e = 0; for (let i = 0; i < typed.length && i < target.length; i++) if (typed[i] !== target[i]) e++; return e; })(), "#f87171"]].map(([l, v, c]) => (
                <div key={l} className="text-center p-3 rounded-2xl gl">
                  <div className="text-[9px] uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,.1)" }}>{l}</div>
                  <div className="text-xl font-black tabular-nums mt-1" style={{ color: c }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Grade */}
            <div className="gl2 rounded-2xl p-5 text-center mb-5" style={{ boxShadow: `inset 0 0 60px ${grade.c}08` }}>
              <div className="text-[9px] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,.12)" }}>Grade</div>
              <div className="text-[24px] font-black mt-1" style={{ color: grade.c }}>{grade.l}</div>
              <div className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,.2)" }}>{grade.d}</div>
            </div>

            {/* WPM chart */}
            {wpmHist.length > 2 && (
              <div className="gl rounded-2xl p-4 mb-5">
                <h3 className="text-[9px] uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(255,255,255,.12)" }}>Speed Graph</h3>
                <div className="h-20 flex items-end gap-0.5">
                  {wpmHist.map((d, i) => {
                    const max = Math.max(...wpmHist.map(w => w.wpm), 1);
                    const h = Math.max(4, (d.wpm / max) * 100);
                    return (
                      <div key={i} className="flex-1 rounded-t transition-all" title={`${d.t}s: ${d.wpm}`}
                        style={{ height: `${h}%`, background: `linear-gradient(to top, rgba(251,191,36,.15), #fbbf24)`, minWidth: 3 }} />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1" style={{ fontSize: 9, color: "rgba(255,255,255,.08)" }}>
                  <span>시작</span><span>종료</span>
                </div>
              </div>
            )}

            {/* Ad placeholder removed */}

            {/* Actions */}
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {[["🔄 다시", () => doStart(mode, cat)], ["📸 저장", saveImg], ["🔗 공유", () => { const t = `타이핑 챌린지: ${curWpm} WPM (${curAcc}%)`; if (navigator.share) navigator.share({ title: "타이핑", text: t, url: location.href }); else { try{navigator.clipboard.writeText(t);}catch{} alert("복사됨!"); } }]].map(([l, fn], i) => (
                <button key={i} onClick={fn}
                  className={`py-3.5 rounded-2xl text-[11px] font-semibold tracking-[0.05em] transition-all active:scale-95 ${i === 1 ? "" : "gl hover:bg-white/[0.05]"}`}
                  style={i === 1 ? { background: "linear-gradient(135deg, #fbbf24, #f59e0b)", color: "#000", boxShadow: "0 8px 20px -5px rgba(251,191,36,.2)" } : { color: "rgba(255,255,255,.35)" }}>
                  {l}
                </button>
              ))}
            </div>

            {/* Ranking */}
            {!showRank ? (
              <button onClick={() => setShowRank(true)}
                className="w-full py-3.5 rounded-2xl text-[12px] font-bold transition-all active:scale-[0.98]"
                style={{ border: "1px solid rgba(251,191,36,.2)", color: "#fbbf24", background: "rgba(251,191,36,.03)" }}>
                🏆 랭킹 등록
              </button>
            ) : (
              <div className="flex gap-2">
                <input type="text" value={nick} onChange={e => setNick(e.target.value)} placeholder="닉네임" maxLength={10}
                  className="flex-1 rounded-2xl px-4 py-3 text-[13px]" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", color: "#e2e8f0", outline: "none" }} />
                <button onClick={submitRank} className="px-6 py-3 rounded-2xl font-bold text-[13px] active:scale-95" style={{ background: "#fbbf24", color: "#000" }}>등록</button>
              </div>
            )}

            {/* Other modes */}
            <div className="gl rounded-2xl p-4 mt-4">
              <h3 className="text-[9px] uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(255,255,255,.12)" }}>Other Modes</h3>
              <div className="flex gap-2">
                {[["timed", "⏱️ 1분"], ["sentence", "📝 문장"], ["practice", "🎯 연습"]].filter(([m]) => m !== mode).map(([m, l]) => (
                  <button key={m} onClick={() => doStart(m, cat)}
                    className="flex-1 py-2.5 rounded-xl gl text-[11px] font-medium transition-all active:scale-95 hover:bg-white/[0.04]" style={{ color: "rgba(255,255,255,.3)" }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Anchor ad placeholder removed */}
    </div>
  );
}
