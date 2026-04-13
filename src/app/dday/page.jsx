"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";

/*
  ╔══════════════════════════════════════════════════════════════╗
  ║  디데이 메이커 — Redesigned                                    ║
  ║  Design: Calm Emotional + Sky-Violet Accent                  ║
  ║  Palette: Deep midnight + sky blue / violet dual accent      ║
  ╚══════════════════════════════════════════════════════════════╝
*/

const PRESETS = [
  { id:"suneung-2026",name:"2026 수능",date:"2026-11-19",emoji:"📝",cat:"exam",info:"2026학년도 수능은 11월 19일(목) 시행 예정. 국어·수학·영어·탐구·제2외국어 영역 구성." },
  { id:"christmas-2026",name:"크리스마스",date:"2026-12-25",emoji:"🎄",cat:"holiday" },
  { id:"newyear-2027",name:"2027 새해",date:"2027-01-01",emoji:"🎆",cat:"holiday" },
  { id:"seollal-2027",name:"2027 설날",date:"2027-02-07",emoji:"🧧",cat:"holiday" },
  { id:"gosi-2026",name:"9급 공무원",date:"2026-03-08",emoji:"📋",cat:"exam",info:"9급 국가공무원 필기시험. 국어·영어·한국사 필수 + 선택 2과목." },
  { id:"toeic-2026",name:"TOEIC",date:"2026-05-24",emoji:"🌐",cat:"exam",info:"TOEIC 정기시험. LC 100문항 + RC 100문항 구성." },
  { id:"chuseok-2026",name:"2026 추석",date:"2026-10-05",emoji:"🌕",cat:"holiday" },
  { id:"valentines-2027",name:"발렌타인",date:"2027-02-14",emoji:"💕",cat:"holiday" },
];

const THEMES = [
  { id:"minimal",name:"미니멀",accent:"#e2e8f0",bg:["#0c1220","#141c2e"] },
  { id:"cherry",name:"벚꽃",accent:"#fda4af",bg:["#2a0a18","#3d1028"] },
  { id:"night",name:"밤하늘",accent:"#93c5fd",bg:["#081028","#0c1838"] },
  { id:"pastel",name:"파스텔",accent:"#d8b4fe",bg:["#1a0c30","#241240"] },
  { id:"ocean",name:"바다",accent:"#67e8f9",bg:["#061820","#0a2430"] },
  { id:"forest",name:"숲",accent:"#86efac",bg:["#081810","#0c2418"] },
  { id:"sunset",name:"노을",accent:"#fdba74",bg:["#201008","#2e1810"] },
  { id:"lavender",name:"라벤더",accent:"#c4b5fd",bg:["#140c28","#1c1238"] },
  { id:"cozy",name:"따뜻한",accent:"#fde68a",bg:["#1a1008","#261810"] },
  { id:"mono",name:"모노",accent:"#a3a3a3",bg:["#0a0a0a","#151515"] },
];

function calcDday(ds) {
  const t = new Date(ds + "T00:00:00"), n = new Date(), td = new Date(n.getFullYear(), n.getMonth(), n.getDate());
  return Math.ceil((t - td) / 864e5);
}

function calcCountdown(ds) {
  const t = new Date(ds + "T00:00:00"), n = new Date(), d = t - n;
  if (d <= 0) return { d: 0, h: 0, m: 0, s: 0, passed: true };
  return { d: Math.floor(d / 864e5), h: Math.floor((d % 864e5) / 36e5), m: Math.floor((d % 36e5) / 6e4), s: Math.floor((d % 6e4) / 1e3), passed: false };
}

function fmtDate(ds) {
  const d = new Date(ds), days = ["일","월","화","수","목","금","토"];
  return `${d.getFullYear()}. ${d.getMonth()+1}. ${d.getDate()}. (${days[d.getDay()]})`;
}

const EMOJIS = ["📌","📝","🎂","💕","🎓","✈️","💼","🏋️","🎯","🎪","🎄","🎆","📋","🏆","💍","🏠","🚗","👶","🐾","⭐","💝","🎸","🏖️","🧑‍💻"];

export default function DdayMaker() {
  const [pg, setPg] = useState("home");
  const [ddays, setDdays] = useState(() => { try { return JSON.parse(localStorage.getItem("dd-list") || "[]"); } catch { return []; } });
  const [viewing, setViewing] = useState(null);
  const [theme, setTheme] = useState("night");
  const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0, passed: false });
  const [infoP, setInfoP] = useState(null);
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newEmoji, setNewEmoji] = useState("📌");
  const cvs = useRef(null);

  useEffect(() => { localStorage.setItem("dd-list", JSON.stringify(ddays)); }, [ddays]);

  useEffect(() => {
    if (!viewing) return;
    const tick = () => setCd(calcCountdown(viewing.date));
    tick(); const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [viewing]);

  const addDday = useCallback(() => {
    if (!newName.trim() || !newDate) return;
    const entry = { id: Date.now().toString(), name: newName.trim(), date: newDate, emoji: newEmoji, theme };
    setDdays(p => [entry, ...p]);
    setViewing(entry); setPg("view");
    setNewName(""); setNewDate(""); setNewEmoji("📌");
  }, [newName, newDate, newEmoji, theme]);

  const addPreset = (p) => {
    const exists = ddays.find(d => d.id === p.id);
    if (exists) { setViewing(exists); } else {
      const entry = { ...p, theme: "night" };
      setDdays(prev => [entry, ...prev]);
      setViewing(entry);
    }
    setTheme("night"); setPg("view");
  };

  const removeDday = (id) => { setDdays(p => p.filter(d => d.id !== id)); if (viewing?.id === id) setPg("home"); };

  const openView = (d) => { setViewing(d); setTheme(d.theme || "night"); setPg("view"); };

  const changeTheme = (tid) => {
    setTheme(tid);
    if (viewing) {
      const up = { ...viewing, theme: tid };
      setViewing(up); setDdays(p => p.map(d => d.id === up.id ? up : d));
    }
  };

  const genImage = useCallback((fmt) => {
    const c = cvs.current; if (!c || !viewing) return;
    const x = c.getContext("2d");
    const isStory = fmt === "story";
    c.width = isStory ? 540 : 540; c.height = isStory ? 960 : 540;
    const w = c.width, h = c.height;
    const th = THEMES.find(t => t.id === theme) || THEMES[2];
    const days = calcDday(viewing.date);

    const g = x.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, th.bg[0]); g.addColorStop(1, th.bg[1]);
    x.fillStyle = g; x.fillRect(0, 0, w, h);

    // Decorative circles
    x.globalAlpha = 0.04; x.fillStyle = th.accent;
    x.beginPath(); x.arc(w * 0.8, h * 0.2, 120, 0, Math.PI * 2); x.fill();
    x.beginPath(); x.arc(w * 0.15, h * 0.8, 80, 0, Math.PI * 2); x.fill();
    x.globalAlpha = 1;

    const cy = isStory ? h * 0.38 : h * 0.42;
    x.textAlign = "center";

    x.font = `${isStory ? 56 : 44}px sans-serif`;
    x.fillText(viewing.emoji, w / 2, cy - (isStory ? 110 : 75));

    x.fillStyle = "rgba(255,255,255,0.8)"; x.font = `bold ${isStory ? 28 : 24}px sans-serif`;
    x.fillText(viewing.name, w / 2, cy - (isStory ? 45 : 28));

    x.fillStyle = th.accent; x.font = `bold ${isStory ? 68 : 56}px sans-serif`;
    const ddTxt = days === 0 ? "D-DAY" : days > 0 ? `D-${days}` : `D+${Math.abs(days)}`;
    x.fillText(ddTxt, w / 2, cy + (isStory ? 45 : 35));

    x.fillStyle = "rgba(255,255,255,0.3)"; x.font = `${isStory ? 15 : 13}px sans-serif`;
    x.fillText(fmtDate(viewing.date), w / 2, cy + (isStory ? 80 : 65));

    x.fillStyle = "rgba(255,255,255,0.1)"; x.font = "11px sans-serif";
    x.fillText("디데이 메이커", w / 2, h - 25);

    const l = document.createElement("a");
    l.download = `디데이_${viewing.name}_${fmt}.png`;
    l.href = c.toDataURL(); l.click();
  }, [viewing, theme]);

  const th = THEMES.find(t => t.id === theme) || THEMES[2];
  const days = viewing ? calcDday(viewing.date) : 0;
  const sorted = useMemo(() => [...ddays].sort((a, b) => Math.abs(calcDday(a.date)) - Math.abs(calcDday(b.date))), [ddays]);

  return (
    <div className="min-h-screen text-white overflow-x-hidden transition-all duration-1000"
      style={{ background: pg === "view" ? `linear-gradient(135deg, ${th.bg[0]}, ${th.bg[1]})` : "radial-gradient(ellipse at 50% 0%, #0c1028 0%, #080c1a 40%, #04060e 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        @keyframes si { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pop { 0% { transform:scale(.82); opacity:0; } 60% { transform:scale(1.06); } 100% { transform:scale(1); opacity:1; } }
        @keyframes countTick { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes orbF { 0%,100% { transform:translate(0,0); } 33% { transform:translate(18px,-25px); } 66% { transform:translate(-14px,18px); } }
        .si { animation: si 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
        .pop { animation: pop 0.5s ease-out forwards; }
        .ct { animation: countTick 0.3s ease-out; }
        .od { animation: orbF 18s ease-in-out infinite; }
        .gl { background:rgba(255,255,255,.03); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,.06); }
        .gl2 { background:rgba(255,255,255,.06); backdrop-filter:blur(28px); -webkit-backdrop-filter:blur(28px); border:1px solid rgba(255,255,255,.08); }
        ::-webkit-scrollbar { display:none; } input:focus { outline:none; }
      `}</style>
      <canvas ref={cvs} className="hidden" />

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[550px] h-[550px] rounded-full od transition-all duration-[2s]" style={{ background: `radial-gradient(circle, ${th.accent}06, transparent 70%)`, top: "-20%", right: "-22%" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full od transition-all duration-[2s]" style={{ background: `radial-gradient(circle, ${th.accent}04, transparent 70%)`, bottom: "5%", left: "-15%", animationDelay: "-7s" }} />
      </div>

      {/* Home */}<Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{color:"rgba(255,255,255,.4)",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",backdropFilter:"blur(12px)"}}>← 홈</Link>
      {/* Header */}
      <header className="sticky top-0 z-30" style={{ background: pg === "view" ? `${th.bg[0]}dd` : "rgba(8,12,26,.88)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          {pg !== "home" ? (
            <button onClick={() => setPg("home")} className="text-[13px] hover:text-white transition-colors" style={{ color: "rgba(255,255,255,.3)" }}>← 홈</button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg">📅</span>
              <span className="text-[16px] font-black" style={{ background: "linear-gradient(135deg, #93c5fd, #c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>디데이 메이커</span>
            </div>
          )}
          {pg === "home" && (
            <button onClick={() => setPg("create")} className="text-[11px] px-3 py-1.5 rounded-full transition-all active:scale-95"
              style={{ background: "rgba(147,197,253,.1)", color: "#93c5fd", border: "1px solid rgba(147,197,253,.15)" }}>
              + 새 디데이
            </button>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 pb-28 relative z-10">
        {/* ===== HOME ===== */}
        {pg === "home" && (
          <div className="si">
            {sorted.length > 0 ? (
              <div className="mt-4 space-y-2.5">
                {sorted.map((dd, i) => {
                  const d = calcDday(dd.date); const isToday = d === 0; const past = d < 0;
                  return (
                    <button key={dd.id} onClick={() => openView(dd)}
                      className="w-full text-left p-4.5 rounded-2xl gl hover:bg-white/[0.04] active:scale-[0.98] transition-all si"
                      style={{ padding: "18px 20px", animationDelay: `${i * 50}ms`, animationFillMode: "backwards" }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{dd.emoji}</span>
                          <div>
                            <div className="text-[13px] font-bold">{dd.name}</div>
                            <div className="text-[10px]" style={{ color: "rgba(255,255,255,.15)" }}>{fmtDate(dd.date)}</div>
                          </div>
                        </div>
                        <div className="text-[20px] font-black tabular-nums" style={{ color: isToday ? "#fbbf24" : past ? "rgba(255,255,255,.2)" : "#93c5fd" }}>
                          {isToday ? "D-DAY" : d > 0 ? `D-${d}` : `D+${Math.abs(d)}`}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">📅</div>
                <h2 className="text-[20px] font-black mb-2">디데이를 추가해보세요</h2>
                <p className="text-[12px] mb-6" style={{ color: "rgba(255,255,255,.2)" }}>시험, 기념일, 생일 등을 등록하세요</p>
                <button onClick={() => setPg("create")}
                  className="px-6 py-3 rounded-2xl font-bold text-[13px] active:scale-95 transition-all"
                  style={{ background: "linear-gradient(135deg, #93c5fd, #c4b5fd)", color: "#fff", boxShadow: "0 8px 25px -6px rgba(147,197,253,.25)" }}>
                  + 디데이 만들기
                </button>
              </div>
            )}

            {/* Ad placeholder removed */}

            {/* Presets */}
            <div className="mt-4">
              <h3 className="text-[9px] uppercase tracking-[0.2em] mb-3 ml-0.5" style={{ color: "rgba(255,255,255,.1)" }}>Popular D-days</h3>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.slice(0, 6).map((p, i) => {
                  const d = calcDday(p.date);
                  return (
                    <button key={p.id} onClick={() => addPreset(p)}
                      className="text-left p-3.5 rounded-xl gl hover:bg-white/[0.04] active:scale-[0.98] transition-all si"
                      style={{ animationDelay: `${i * 40}ms`, animationFillMode: "backwards" }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{p.emoji}</span>
                        <span className="text-[11px] font-bold">{p.name}</span>
                      </div>
                      <div className="text-[14px] font-black tabular-nums" style={{ color: d <= 0 ? "rgba(255,255,255,.2)" : "#93c5fd" }}>
                        {d === 0 ? "D-DAY" : d > 0 ? `D-${d}` : `D+${Math.abs(d)}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exam info links */}
            <div className="mt-6">
              <h3 className="text-[9px] uppercase tracking-[0.2em] mb-2 ml-0.5" style={{ color: "rgba(255,255,255,.1)" }}>Exam Info</h3>
              {PRESETS.filter(p => p.info).map(p => (
                <button key={p.id} onClick={() => { setInfoP(p); setPg("info"); }}
                  className="w-full text-left p-3.5 rounded-xl gl hover:bg-white/[0.04] transition-all flex items-center justify-between mb-2 active:scale-[0.98]">
                  <div className="flex items-center gap-2">
                    <span>{p.emoji}</span><span className="text-[12px]" style={{ color: "rgba(255,255,255,.35)" }}>{p.name} 정보</span>
                  </div>
                  <span style={{ color: "rgba(255,255,255,.08)" }}>→</span>
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-2" style={{ color: "rgba(255,255,255,.08)", fontSize: 10.5, lineHeight: 1.9, borderTop: "1px solid rgba(255,255,255,.03)", paddingTop: 16 }}>
              <h2 style={{ color: "rgba(255,255,255,.12)", fontSize: 11, fontWeight: 700 }}>디데이 메이커</h2>
              <p>D-day를 예쁘게 카운트다운하고, 10가지 테마로 꾸며 공유할 수 있는 도구입니다.</p>
            </div>
          </div>
        )}

        {/* ===== CREATE ===== */}
        {pg === "create" && (
          <div className="py-5 si">
            <h2 className="text-[18px] font-black text-center mb-5">새 디데이</h2>

            <div className="space-y-4">
              {/* Emoji */}
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] mb-2 ml-0.5" style={{ color: "rgba(255,255,255,.12)" }}>아이콘</label>
                <div className="flex gap-1.5 flex-wrap">
                  {EMOJIS.map(e => (
                    <button key={e} onClick={() => setNewEmoji(e)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all active:scale-90"
                      style={newEmoji === e ? { background: "rgba(147,197,253,.12)", border: "1px solid rgba(147,197,253,.25)", transform: "scale(1.1)" } : { background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)" }}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] mb-2 ml-0.5" style={{ color: "rgba(255,255,255,.12)" }}>이름</label>
                <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="수능, 100일, 유럽여행..." maxLength={20}
                  className="w-full rounded-2xl px-5 py-3.5 text-[13px] font-medium transition-all"
                  style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", color: "#e2e8f0" }}
                  onFocus={e => e.target.style.borderColor = "rgba(147,197,253,.3)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.06)"} />
              </div>

              {/* Date */}
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] mb-2 ml-0.5" style={{ color: "rgba(255,255,255,.12)" }}>날짜</label>
                <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
                  className="w-full rounded-2xl px-5 py-3.5 text-[13px] transition-all"
                  style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", color: "#e2e8f0", colorScheme: "dark" }} />
              </div>

              {/* Preview */}
              {newDate && (
                <div className="text-center p-4 rounded-2xl" style={{ background: "rgba(147,197,253,.05)", border: "1px solid rgba(147,197,253,.1)" }}>
                  <div className="text-[11px]" style={{ color: "rgba(255,255,255,.2)" }}>{fmtDate(newDate)}</div>
                  <div className="text-[22px] font-black mt-1" style={{ color: "#93c5fd" }}>
                    {(() => { const d = calcDday(newDate); return d === 0 ? "D-DAY!" : d > 0 ? `D-${d}` : `D+${Math.abs(d)}`; })()}
                  </div>
                </div>
              )}
            </div>

            <button onClick={addDday} disabled={!newName.trim() || !newDate}
              className="w-full mt-6 rounded-2xl font-bold text-[14px] transition-all active:scale-[0.97]"
              style={{ padding: "18px 0", ...(newName.trim() && newDate) ? { background: "linear-gradient(135deg, #93c5fd, #c4b5fd)", color: "#fff", boxShadow: "0 12px 35px -8px rgba(147,197,253,.25)" } : { background: "rgba(255,255,255,.03)", color: "rgba(255,255,255,.15)" } }}>
              ✨ 디데이 생성
            </button>
          </div>
        )}

        {/* ===== VIEW ===== */}
        {pg === "view" && viewing && (
          <div className="py-8 text-center pop">
            {/* Emoji + Name */}
            <div className="text-5xl mb-2">{viewing.emoji}</div>
            <h2 className="text-[20px] font-black mb-0.5">{viewing.name}</h2>
            <div className="text-[11px] mb-8" style={{ color: "rgba(255,255,255,.2)" }}>{fmtDate(viewing.date)}</div>

            {/* Big D-day */}
            <div className="mb-6">
              <div className="text-[60px] font-black tabular-nums tracking-wider leading-none ct" style={{ color: th.accent }}>
                {days === 0 ? "D-DAY!" : days > 0 ? `D-${days}` : `D+${Math.abs(days)}`}
              </div>
            </div>

            {/* Live countdown */}
            {days > 0 && (
              <div className="flex justify-center gap-3 mb-8 p-5 rounded-2xl gl2">
                {[["일", cd.d], ["시간", cd.h], ["분", cd.m], ["초", cd.s]].map(([l, v], i) => (
                  <div key={l} className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-[28px] font-black tabular-nums font-mono ct" style={{ color: th.accent }}>{String(v).padStart(2, "0")}</div>
                      <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,.15)" }}>{l}</div>
                    </div>
                    {i < 3 && <span className="text-[20px] -mt-3" style={{ color: "rgba(255,255,255,.08)" }}>:</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Progress */}
            <div className="mb-6 px-6">
              <div className="h-[4px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.04)" }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: days <= 0 ? "100%" : `${Math.max(5, 100 - (days / 365) * 100)}%`, background: th.accent }} />
              </div>
            </div>

            {/* Theme selector */}
            <div className="mb-5">
              <div className="text-[9px] uppercase tracking-[0.2em] mb-2" style={{ color: "rgba(255,255,255,.1)" }}>Theme</div>
              <div className="flex gap-1.5 justify-center flex-wrap px-4">
                {THEMES.map(t => (
                  <button key={t.id} onClick={() => changeTheme(t.id)}
                    className="w-6.5 h-6.5 rounded-full transition-all"
                    style={{ width: 26, height: 26, background: `linear-gradient(135deg, ${t.bg[0]}, ${t.bg[1]})`, border: theme === t.id ? `2px solid ${t.accent}` : "2px solid transparent", transform: theme === t.id ? "scale(1.15)" : "scale(1)" }}
                    title={t.name} />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button onClick={() => genImage("square")} className="py-3 rounded-2xl gl text-[11px] font-medium transition-all active:scale-95" style={{ color: "rgba(255,255,255,.35)" }}>📸 정사각형</button>
              <button onClick={() => genImage("story")} className="py-3 rounded-2xl gl text-[11px] font-medium transition-all active:scale-95" style={{ color: "rgba(255,255,255,.35)" }}>📱 스토리</button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-5">
              <button onClick={() => {
                const t = `${viewing.emoji} ${viewing.name}: ${days === 0 ? "D-DAY!" : days > 0 ? `D-${days}` : `D+${Math.abs(days)}`}`;
                if (navigator.share) navigator.share({ title: "디데이", text: t, url: location.href }); else { navigator.clipboard.writeText(t); alert("복사됨!"); }
              }} className="py-3 rounded-2xl gl text-[11px] font-medium transition-all active:scale-95" style={{ color: "rgba(255,255,255,.35)" }}>🔗 공유</button>
              <button onClick={() => { if (confirm("삭제할까요?")) removeDday(viewing.id); }}
                className="py-3 rounded-2xl text-[11px] font-medium transition-all active:scale-95" style={{ background: "rgba(248,113,113,.06)", border: "1px solid rgba(248,113,113,.1)", color: "rgba(248,113,113,.5)" }}>🗑️ 삭제</button>
            </div>

            {/* Ad placeholder removed */}

            {/* Exam info link */}
            {viewing.info && (
              <button onClick={() => { setInfoP(viewing); setPg("info"); }}
                className="w-full py-3 rounded-2xl text-[12px] font-medium transition-all active:scale-[0.98] mb-4"
                style={{ border: `1px solid ${th.accent}20`, color: th.accent, background: `${th.accent}05` }}>
                📖 {viewing.name} 정보
              </button>
            )}

            {/* Other d-days */}
            {sorted.filter(d => d.id !== viewing.id).length > 0 && (
              <div className="mt-2 text-left">
                <h3 className="text-[9px] uppercase tracking-[0.2em] mb-2 ml-0.5" style={{ color: "rgba(255,255,255,.08)" }}>Other</h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {sorted.filter(d => d.id !== viewing.id).map(d => {
                    const dd = calcDday(d.date);
                    return (
                      <button key={d.id} onClick={() => openView(d)}
                        className="flex-shrink-0 text-center p-3 rounded-xl gl hover:bg-white/[0.04] transition-all min-w-[72px] active:scale-95">
                        <div className="text-lg">{d.emoji}</div>
                        <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,.2)" }}>{d.name}</div>
                        <div className="text-[11px] font-bold tabular-nums mt-0.5" style={{ color: th.accent }}>
                          {dd === 0 ? "D-DAY" : dd > 0 ? `D-${dd}` : `D+${Math.abs(dd)}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== EXAM INFO ===== */}
        {pg === "info" && infoP && (
          <div className="py-5 si">
            <div className="text-center mb-4">
              <span className="text-4xl">{infoP.emoji}</span>
              <h2 className="text-[20px] font-black mt-2">{infoP.name}</h2>
              <div className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,.2)" }}>{fmtDate(infoP.date)}</div>
              <div className="text-[22px] font-black mt-2" style={{ color: "#93c5fd" }}>
                {(() => { const d = calcDday(infoP.date); return d === 0 ? "D-DAY" : d > 0 ? `D-${d}` : `D+${Math.abs(d)}`; })()}
              </div>
            </div>

            <button onClick={() => addPreset(infoP)}
              className="w-full py-3.5 rounded-2xl font-bold text-[13px] active:scale-[0.97] transition-all mb-4"
              style={{ background: "linear-gradient(135deg, #93c5fd, #c4b5fd)", color: "#fff", boxShadow: "0 8px 25px -6px rgba(147,197,253,.2)" }}>
              📅 내 디데이에 추가
            </button>

            {/* Ad placeholder removed */}

            <div className="gl2 rounded-2xl p-5 mb-4">
              <h3 className="text-[9px] uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(255,255,255,.12)" }}>Info</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,.4)" }}>{infoP.info}</p>
            </div>

            <div className="gl rounded-2xl p-5 mb-4">
              <h3 className="text-[9px] uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(255,255,255,.12)" }}>준비 팁</h3>
              <div className="space-y-2 text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,.3)" }}>
                <p>1. 남은 기간을 역산하여 주차별 학습 계획을 세우세요.</p>
                <p>2. 기출문제 풀이는 최소 3회독을 권장합니다.</p>
                <p>3. 시험 2주 전부터는 실전 모의고사로 시간 관리를 연습하세요.</p>
                <p>4. 충분한 수면과 규칙적인 생활 리듬을 유지하세요.</p>
                <p>5. 당일 준비물(수험표, 신분증, 필기구)을 미리 확인하세요.</p>
              </div>
            </div>

            {/* Ad placeholder removed */}

            {/* Related */}
            <div className="gl rounded-2xl p-4">
              <h3 className="text-[9px] uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(255,255,255,.1)" }}>Other Exams</h3>
              {PRESETS.filter(p => p.info && p.id !== infoP.id).map(p => (
                <button key={p.id} onClick={() => { setInfoP(p); window.scrollTo(0, 0); }}
                  className="w-full text-left p-3 rounded-xl gl hover:bg-white/[0.04] transition-all flex items-center justify-between mb-2 last:mb-0 active:scale-[0.98]">
                  <div className="flex items-center gap-2">
                    <span>{p.emoji}</span>
                    <div><div className="text-[11px] font-bold" style={{ color: "rgba(255,255,255,.4)" }}>{p.name}</div><div className="text-[9px]" style={{ color: "rgba(255,255,255,.12)" }}>{fmtDate(p.date)}</div></div>
                  </div>
                  <span className="text-[12px] font-bold tabular-nums" style={{ color: "#93c5fd" }}>D-{calcDday(p.date)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Anchor ad placeholder removed */}
    </div>
  );
}
