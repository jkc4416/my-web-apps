import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/*
  ╔══════════════════════════════════════════════════════════════╗
  ║  사운드포커스 — Redesigned                                     ║
  ║  Design: Zen Ambient + Deep Ocean Palette                    ║
  ║  Aesthetic: Breathing orbs, minimal glass, immersive dark    ║
  ╚══════════════════════════════════════════════════════════════╝
*/

// ===== SOUNDS =====
const SOUNDS = [
  { id: "rain", name: "빗소리", emoji: "🌧️", color: "#60a5fa", group: "nature" },
  { id: "thunder", name: "천둥", emoji: "⛈️", color: "#818cf8", group: "nature" },
  { id: "wave", name: "파도", emoji: "🌊", color: "#22d3ee", group: "nature" },
  { id: "wind", name: "바람", emoji: "💨", color: "#94a3b8", group: "nature" },
  { id: "birds", name: "새소리", emoji: "🐦", color: "#4ade80", group: "nature" },
  { id: "crickets", name: "귀뚜라미", emoji: "🦗", color: "#a3e635", group: "nature" },
  { id: "fire", name: "모닥불", emoji: "🔥", color: "#fb923c", group: "nature" },
  { id: "river", name: "시냇물", emoji: "🏞️", color: "#38bdf8", group: "nature" },
  { id: "cafe", name: "카페", emoji: "☕", color: "#d4a574", group: "ambient" },
  { id: "keyboard", name: "키보드", emoji: "⌨️", color: "#a78bfa", group: "ambient" },
  { id: "clock", name: "시계", emoji: "🕐", color: "#fbbf24", group: "ambient" },
  { id: "fan", name: "선풍기", emoji: "🌀", color: "#67e8f9", group: "ambient" },
  { id: "train", name: "기차", emoji: "🚂", color: "#f87171", group: "ambient" },
  { id: "city", name: "도시", emoji: "🏙️", color: "#c084fc", group: "ambient" },
];

const PRESETS = [
  { id: "rainy-cafe", name: "빗소리 카페", emoji: "🌧️☕", desc: "비 오는 날 아늑한 카페", vols: { rain: 60, cafe: 40, keyboard: 15 } },
  { id: "beach", name: "해변", emoji: "🏖️", desc: "잔잔한 파도와 바람", vols: { wave: 70, wind: 30, birds: 15 } },
  { id: "forest", name: "깊은 숲", emoji: "🌲", desc: "새소리와 시냇물", vols: { birds: 50, river: 45, wind: 20, crickets: 10 } },
  { id: "library", name: "도서관", emoji: "📚", desc: "조용한 백색소음", vols: { fan: 25, clock: 15 } },
  { id: "camping", name: "캠핑", emoji: "⛺", desc: "모닥불과 귀뚜라미", vols: { fire: 60, crickets: 40, wind: 15 } },
  { id: "citynight", name: "도시 야경", emoji: "🌃", desc: "빗속 도시의 소음", vols: { rain: 40, city: 35, cafe: 15 } },
  { id: "trainride", name: "기차 안", emoji: "🚂", desc: "규칙적인 리듬", vols: { train: 55, rain: 25 } },
  { id: "storm", name: "폭풍우", emoji: "⛈️", desc: "압도적 빗소리", vols: { rain: 80, thunder: 50, wind: 40 } },
];

// ===== AUDIO ENGINE =====
class Engine {
  constructor() { this.ctx = null; this.nodes = {}; this.master = null; this.ok = false; }

  init() {
    if (this.ok) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.master = this.ctx.createGain();
    this.master.connect(this.ctx.destination);
    this.master.gain.value = 0.7;
    this.ok = true;
  }

  noise(type) {
    const len = this.ctx.sampleRate * 4;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    if (type === "white") { for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1; }
    else if (type === "brown") { let l = 0; for (let i = 0; i < len; i++) { d[i] = (l + 0.02 * (Math.random() * 2 - 1)) / 1.02; l = d[i]; d[i] *= 3.5; } }
    else { let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0; for (let i = 0; i < len; i++) { const w=Math.random()*2-1; b0=.99886*b0+w*.0555179;b1=.99332*b1+w*.0750759;b2=.969*b2+w*.153852;b3=.8665*b3+w*.310486;b4=.55*b4+w*.532952;b5=-.7616*b5-w*.016898;d[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.11;b6=w*.115926; } }
    return buf;
  }

  play(id) {
    if (!this.ok) this.init();
    if (this.nodes[id]) return;
    const gain = this.ctx.createGain(); gain.gain.value = 0;
    const filt = this.ctx.createBiquadFilter();
    let src;

    const configs = {
      rain:     { type: "pink", fType: "bandpass", freq: 800, Q: 0.5, lfoF: 0.15, lfoG: 0.15 },
      thunder:  { type: "brown", fType: "lowpass", freq: 200, Q: 1 },
      wave:     { type: "brown", fType: "lowpass", freq: 500, lfoF: 0.08, lfoG: 0.3 },
      wind:     { type: "brown", fType: "bandpass", freq: 300, Q: 0.3, lfoF: 0.05, lfoG: 0.25 },
      birds:    { type: "white", fType: "bandpass", freq: 3000, Q: 5, lfoF: 2.5, lfoG: 0.4, hpFreq: 2000 },
      crickets: { type: "white", fType: "bandpass", freq: 5000, Q: 10, lfoF: 6, lfoG: 0.45 },
      fire:     { type: "brown", fType: "bandpass", freq: 600, Q: 0.8, lfoF: 3, lfoG: 0.2 },
      river:    { type: "pink", fType: "bandpass", freq: 1200, Q: 0.4 },
      cafe:     { type: "pink", fType: "bandpass", freq: 500, Q: 0.3, lfoF: 0.3, lfoG: 0.1 },
      keyboard: { type: "white", fType: "bandpass", freq: 2000, Q: 3, lfoF: 4, lfoG: 0.45 },
      clock:    { osc: true, oscFreq: 800, lfoF: 1, lfoG: 1 },
      fan:      { type: "brown", fType: "lowpass", freq: 400 },
      train:    { type: "brown", fType: "lowpass", freq: 300, lfoF: 1.8, lfoG: 0.2 },
      city:     { type: "pink", fType: "lowpass", freq: 600, lfoF: 0.1, lfoG: 0.15 },
    };

    const cfg = configs[id]; if (!cfg) return;
    const extras = [];

    if (cfg.osc) {
      const osc = this.ctx.createOscillator(); osc.type = "sine"; osc.frequency.value = cfg.oscFreq;
      const tg = this.ctx.createGain(); tg.gain.value = 0;
      osc.connect(tg); tg.connect(gain);
      if (cfg.lfoF) { const lfo = this.ctx.createOscillator(); const lg = this.ctx.createGain(); lfo.frequency.value = cfg.lfoF; lg.gain.value = cfg.lfoG; lfo.connect(lg); lg.connect(tg.gain); lfo.start(); extras.push(lfo); }
      osc.start(); src = osc;
    } else {
      src = this.ctx.createBufferSource(); src.buffer = this.noise(cfg.type); src.loop = true;
      filt.type = cfg.fType; filt.frequency.value = cfg.freq; if (cfg.Q) filt.Q.value = cfg.Q;
      if (cfg.hpFreq) {
        const hp = this.ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = cfg.hpFreq;
        src.connect(filt); filt.connect(hp); hp.connect(gain);
      } else { src.connect(filt); filt.connect(gain); }
      if (cfg.lfoF) { const lfo = this.ctx.createOscillator(); const lg = this.ctx.createGain(); lfo.frequency.value = cfg.lfoF; lg.gain.value = cfg.lfoG; lfo.connect(lg); lg.connect(gain.gain); lfo.start(); extras.push(lfo); }
      src.start(0);
    }

    gain.connect(this.master);
    this.nodes[id] = { src, gain, extras };
  }

  vol(id, v) { if (this.nodes[id]) this.nodes[id].gain.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, v / 100)), this.ctx.currentTime + 0.1); }
  masterVol(v) { if (this.master) this.master.gain.linearRampToValueAtTime(v / 100, this.ctx.currentTime + 0.1); }

  stop(id) {
    if (!this.nodes[id]) return;
    const n = this.nodes[id];
    n.gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
    setTimeout(() => { try { n.src.stop(); } catch(e) {} n.extras.forEach(e => { try { e.stop(); } catch(ex) {} }); delete this.nodes[id]; }, 400);
  }

  stopAll() { Object.keys(this.nodes).forEach(id => this.stop(id)); }
  resume() { if (this.ctx?.state === "suspended") this.ctx.resume(); }
}

// ===== MAIN =====
export default function SoundFocus() {
  const eng = useRef(null);
  const [vols, setVols] = useState({});
  const [masterV, setMasterV] = useState(70);
  const [playing, setPlaying] = useState(false);
  const [preset, setPreset] = useState(null);
  const [tab, setTab] = useState("mixer");
  const [tmMode, setTmMode] = useState("pomo");
  const [pomoPhase, setPomoPhase] = useState("focus");
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [pomoRun, setPomoRun] = useState(false);
  const [pomoCount, setPomoCount] = useState(0);
  const [sleepActive, setSleepActive] = useState(false);
  const [sleepLeft, setSleepLeft] = useState(0);
  const [soundGroup, setSoundGroup] = useState("all");
  const pomoRef = useRef(null);
  const sleepRef = useRef(null);

  useEffect(() => { eng.current = new Engine(); return () => eng.current?.stopAll(); }, []);

  const active = useMemo(() => Object.entries(vols).filter(([_, v]) => v > 0), [vols]);

  const toggle = useCallback((id) => {
    eng.current.resume();
    setVols(prev => {
      const n = { ...prev };
      if (n[id] && n[id] > 0) { eng.current.stop(id); delete n[id]; }
      else { eng.current.init(); eng.current.play(id); n[id] = 50; eng.current.vol(id, 50); setPlaying(true); }
      if (Object.values(n).filter(v => v > 0).length === 0) setPlaying(false);
      return n;
    });
    setPreset(null);
  }, []);

  const changeVol = useCallback((id, v) => {
    eng.current?.vol(id, v);
    setVols(prev => { if (v === 0) { eng.current?.stop(id); const n = { ...prev }; delete n[id]; return n; } return { ...prev, [id]: v }; });
    setPreset(null);
  }, []);

  const changeMaster = useCallback((v) => { setMasterV(v); eng.current?.masterVol(v); }, []);

  const applyPreset = useCallback((p) => {
    eng.current.init(); eng.current.resume();
    Object.keys(vols).forEach(id => eng.current.stop(id));
    const nv = {};
    Object.entries(p.vols).forEach(([id, v]) => { eng.current.play(id); eng.current.vol(id, v); nv[id] = v; });
    setVols(nv); setPlaying(true); setPreset(p.id); setTab("mixer");
  }, [vols]);

  const stopAll = useCallback(() => { eng.current?.stopAll(); setVols({}); setPlaying(false); setPreset(null); }, []);

  // Pomodoro
  useEffect(() => {
    if (!pomoRun) return;
    pomoRef.current = setInterval(() => {
      setPomoTime(t => {
        if (t <= 1) {
          if (pomoPhase === "focus") { setPomoPhase("break"); setPomoCount(c => c + 1); return 5 * 60; }
          else { setPomoPhase("focus"); return 25 * 60; }
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(pomoRef.current);
  }, [pomoRun, pomoPhase]);

  // Sleep
  useEffect(() => {
    if (!sleepActive || sleepLeft <= 0) return;
    sleepRef.current = setInterval(() => {
      setSleepLeft(t => {
        if (t <= 1) { setSleepActive(false); stopAll(); return 0; }
        if (t <= 30) eng.current?.masterVol(Math.round(masterV * (t / 30)));
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(sleepRef.current);
  }, [sleepActive, sleepLeft, masterV, stopAll]);

  const fmt = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const filtered = soundGroup === "all" ? SOUNDS : SOUNDS.filter(s => s.group === soundGroup);
  const activePreset = preset ? PRESETS.find(p => p.id === preset) : null;

  // Dominant color from active sounds for ambient orbs
  const dominantColor = useMemo(() => {
    if (active.length === 0) return "#22d3ee";
    const topSound = SOUNDS.find(s => s.id === active[0][0]);
    return topSound?.color || "#22d3ee";
  }, [active]);

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: "radial-gradient(ellipse at 50% 0%, #061220 0%, #040c18 40%, #020610 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        @keyframes si { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes breathe { 0%,100% { opacity: 0.04; transform: scale(1); } 50% { opacity: 0.08; transform: scale(1.08); } }
        @keyframes orbDrift { 0%,100% { transform: translate(0,0); } 33% { transform: translate(18px,-25px); } 66% { transform: translate(-14px,18px); } }
        @keyframes pulse { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        .si { animation: si 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
        .breathe { animation: breathe 8s ease-in-out infinite; }
        .od { animation: orbDrift 16s ease-in-out infinite; }
        .gl { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.06); }
        .gl2 { background: rgba(255,255,255,0.06); backdrop-filter: blur(28px); -webkit-backdrop-filter: blur(28px); border: 1px solid rgba(255,255,255,0.08); }
        input[type=range] { -webkit-appearance: none; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.04); }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: white; cursor: pointer; box-shadow: 0 1px 6px rgba(0,0,0,0.4); }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Ambient orbs - react to dominant sound color */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[600px] h-[600px] rounded-full od" style={{ background: `radial-gradient(circle, ${dominantColor}${playing ? "0a" : "04"}, transparent 70%)`, top: "-20%", right: "-25%", transition: "background 2s" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full od" style={{ background: `radial-gradient(circle, ${dominantColor}${playing ? "08" : "03"}, transparent 70%)`, bottom: "5%", left: "-15%", animationDelay: "-6s", transition: "background 2s" }} />
        {playing && <div className="absolute w-[300px] h-[300px] rounded-full breathe" style={{ background: `radial-gradient(circle, ${dominantColor}0c, transparent 60%)`, top: "35%", left: "30%", transition: "background 2s" }} />}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30" style={{ background: "rgba(4,12,24,0.85)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-lg mx-auto px-5 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎧</span>
              <span className="text-[16px] font-black" style={{ background: "linear-gradient(135deg, #22d3ee, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>사운드포커스</span>
            </div>
            <div className="flex items-center gap-2">
              {sleepActive && (
                <span className="text-[10px] px-2 py-1 rounded-full" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.15)", color: "#818cf8" }}>😴 {fmt(sleepLeft)}</span>
              )}
              {playing && (
                <button onClick={stopAll} className="text-[11px] px-3 py-1.5 rounded-full transition-all active:scale-95" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.15)", color: "#f87171" }}>■ 정지</button>
              )}
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-1">
            {[["mixer", "🎛️ 믹서"], ["presets", "🎨 프리셋"], ["timer", "⏱️ 타이머"]].map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-xl text-[11px] font-semibold tracking-wide transition-all ${tab === t ? "text-white" : "hover:text-white/40"}`}
                style={tab === t ? { background: "rgba(255,255,255,0.06)", color: "#fff" } : { color: "rgba(255,255,255,0.2)" }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 pb-36 relative z-10">
        {/* ===== MIXER ===== */}
        {tab === "mixer" && (
          <div className="si">
            {/* Master */}
            <div className="mt-4 gl rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-widest w-12" style={{ color: "rgba(255,255,255,0.2)" }}>Master</span>
                <input type="range" min="0" max="100" value={masterV} onChange={e => changeMaster(+e.target.value)}
                  className="flex-1" style={{ background: `linear-gradient(to right, #22d3ee ${masterV}%, rgba(255,255,255,0.04) ${masterV}%)` }} />
                <span className="text-[11px] w-8 text-right tabular-nums" style={{ color: "rgba(255,255,255,0.2)" }}>{masterV}</span>
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 mt-4 mb-3">
              {[["all", "전체"], ["nature", "🌿 자연"], ["ambient", "🏙️ 환경"]].map(([g, l]) => (
                <button key={g} onClick={() => setSoundGroup(g)}
                  className="flex-1 py-2 rounded-xl text-[11px] font-medium transition-all"
                  style={soundGroup === g ? { background: "rgba(255,255,255,0.06)", color: "#fff" } : { color: "rgba(255,255,255,0.15)" }}>
                  {l}
                </button>
              ))}
            </div>

            {activePreset && (
              <div className="text-center mb-2">
                <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>{activePreset.emoji} {activePreset.name}</span>
              </div>
            )}

            {/* Sound Grid */}
            <div className="grid grid-cols-2 gap-2">
              {filtered.map((s, i) => {
                const v = vols[s.id] || 0;
                const on = v > 0;
                return (
                  <div key={s.id}
                    className={`rounded-2xl p-3.5 transition-all si ${on ? "gl2" : "gl hover:bg-white/[0.03]"}`}
                    style={{ animationDelay: `${i * 30}ms`, animationFillMode: "backwards" }}>
                    <button onClick={() => toggle(s.id)} className="w-full flex items-center gap-2.5 mb-2">
                      <span className={`text-xl transition-all duration-300 ${on ? "" : "grayscale opacity-40"}`}>{s.emoji}</span>
                      <span className={`text-[12px] font-medium transition-colors ${on ? "text-white" : ""}`} style={!on ? { color: "rgba(255,255,255,0.25)" } : {}}>{s.name}</span>
                      {on && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: s.color, animation: "pulse 2s ease-in-out infinite" }} />}
                    </button>
                    {on && (
                      <input type="range" min="0" max="100" value={v} onChange={e => changeVol(s.id, +e.target.value)}
                        className="w-full" style={{ background: `linear-gradient(to right, ${s.color} ${v}%, rgba(255,255,255,0.04) ${v}%)` }} />
                    )}
                  </div>
                );
              })}
            </div>

            {active.length > 0 && (
              <div className="text-center mt-3 text-[11px]" style={{ color: "rgba(255,255,255,0.12)" }}>{active.length}개 사운드 재생 중</div>
            )}

            {/* Ad */}
            <div className="w-full flex justify-center my-5">
              <div className="w-full h-[65px] rounded-2xl flex items-center justify-center" style={{ border: "1px dashed rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.05)", fontSize: 9, letterSpacing: "0.15em" }}>AD</div>
            </div>
          </div>
        )}

        {/* ===== PRESETS ===== */}
        {tab === "presets" && (
          <div className="mt-4 si">
            <h2 className="text-[9px] uppercase tracking-[0.2em] mb-3 ml-0.5" style={{ color: "rgba(255,255,255,0.12)" }}>Soundscapes</h2>
            <div className="space-y-2.5">
              {PRESETS.map((p, i) => (
                <button key={p.id} onClick={() => applyPreset(p)}
                  className={`w-full text-left p-4.5 rounded-2xl transition-all active:scale-[0.98] si ${preset === p.id ? "gl2" : "gl hover:bg-white/[0.04]"}`}
                  style={{ padding: "18px 20px", animationDelay: `${i * 50}ms`, animationFillMode: "backwards" }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{p.emoji}</span>
                        <span className="text-[13px] font-bold">{p.name}</span>
                        {preset === p.id && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(34,211,238,0.1)", color: "#22d3ee", border: "1px solid rgba(34,211,238,0.15)" }}>재생 중</span>}
                      </div>
                      <p className="text-[11px] ml-8" style={{ color: "rgba(255,255,255,0.2)" }}>{p.desc}</p>
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.08)" }}>▶</span>
                  </div>
                  <div className="flex gap-1 mt-2 ml-8">
                    {Object.keys(p.vols).map(sid => {
                      const snd = SOUNDS.find(x => x.id === sid);
                      return snd ? <span key={sid} className="text-xs">{snd.emoji}</span> : null;
                    })}
                  </div>
                </button>
              ))}
            </div>

            {/* SEO */}
            <div className="mt-8 space-y-2" style={{ color: "rgba(255,255,255,0.08)", fontSize: 10.5, lineHeight: 1.9, borderTop: "1px solid rgba(255,255,255,0.03)", paddingTop: 16 }}>
              <h2 style={{ color: "rgba(255,255,255,0.12)", fontSize: 11, fontWeight: 700 }}>백색소음이란?</h2>
              <p>백색소음은 모든 주파수 대역이 균일한 소리로, 집중력 향상과 수면에 도움을 줍니다. 자연음과 환경음을 조합하면 나만의 집중 환경을 만들 수 있습니다.</p>
            </div>

            <div className="w-full flex justify-center my-5">
              <div className="w-full h-[65px] rounded-2xl flex items-center justify-center" style={{ border: "1px dashed rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.05)", fontSize: 9 }}>AD</div>
            </div>
          </div>
        )}

        {/* ===== TIMER ===== */}
        {tab === "timer" && (
          <div className="mt-4 si">
            <div className="flex gap-2 mb-6">
              {[["pomo", "🍅 뽀모도로"], ["sleep", "😴 수면"]].map(([m, l]) => (
                <button key={m} onClick={() => { setTmMode(m); if (m === "pomo") { setPomoRun(false); setPomoTime(25 * 60); setPomoPhase("focus"); } }}
                  className="flex-1 py-2.5 rounded-xl text-[11px] font-semibold transition-all"
                  style={tmMode === m ? { background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.06)" } : { color: "rgba(255,255,255,0.2)", border: "1px solid transparent" }}>
                  {l}
                </button>
              ))}
            </div>

            {/* Pomodoro */}
            {tmMode === "pomo" && (
              <div className="text-center">
                <div className={`inline-block px-3 py-1 rounded-full text-[10px] mb-5`}
                  style={pomoPhase === "focus" ? { background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.15)" } : { background: "rgba(45,212,191,0.1)", color: "#2dd4bf", border: "1px solid rgba(45,212,191,0.15)" }}>
                  {pomoPhase === "focus" ? "🍅 집중" : "☕ 휴식"}
                </div>

                <div className="relative flex justify-center my-6">
                  <svg width="200" height="200">
                    <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
                    <circle cx="100" cy="100" r="85" fill="none"
                      stroke={pomoPhase === "focus" ? "#f87171" : "#2dd4bf"} strokeWidth="3"
                      strokeDasharray={2 * Math.PI * 85}
                      strokeDashoffset={2 * Math.PI * 85 * (1 - pomoTime / (pomoPhase === "focus" ? 25 * 60 : 5 * 60))}
                      strokeLinecap="round" transform="rotate(-90 100 100)" className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[48px] font-black tracking-wider font-mono" style={{ color: "rgba(255,255,255,0.85)" }}>{fmt(pomoTime)}</span>
                    <span className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.15)" }}>{pomoPhase === "focus" ? "집중" : "휴식"}</span>
                  </div>
                </div>

                <div className="flex gap-3 justify-center mb-5">
                  <button onClick={() => setPomoRun(!pomoRun)}
                    className="px-8 py-3 rounded-xl font-bold text-[13px] transition-all active:scale-95"
                    style={pomoRun ? { background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.06)" } : { background: pomoPhase === "focus" ? "linear-gradient(135deg, #f87171, #ef4444)" : "linear-gradient(135deg, #2dd4bf, #14b8a6)", color: "#fff", boxShadow: `0 8px 25px -6px ${pomoPhase === "focus" ? "rgba(248,113,113,0.25)" : "rgba(45,212,191,0.25)"}` }}>
                    {pomoRun ? "⏸ 일시정지" : "▶ 시작"}
                  </button>
                  <button onClick={() => { setPomoRun(false); setPomoTime(pomoPhase === "focus" ? 25 * 60 : 5 * 60); }}
                    className="px-4 py-3 rounded-xl text-[13px] transition-all active:scale-95 gl" style={{ color: "rgba(255,255,255,0.3)" }}>↺</button>
                </div>

                <div className="flex justify-center gap-1.5 mb-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: i < pomoCount % 4 ? "#f87171" : "rgba(255,255,255,0.06)" }} />
                  ))}
                  <span className="text-[10px] ml-2" style={{ color: "rgba(255,255,255,0.12)" }}>{pomoCount}회</span>
                </div>
              </div>
            )}

            {/* Sleep */}
            {tmMode === "sleep" && (
              <div className="text-center">
                {sleepActive ? (
                  <div>
                    <div className="text-[48px] font-black tracking-wider font-mono my-8" style={{ color: "rgba(255,255,255,0.8)" }}>{fmt(sleepLeft)}</div>
                    <p className="text-[12px] mb-5" style={{ color: "rgba(255,255,255,0.2)" }}>소리가 자동으로 줄어들며 꺼집니다</p>
                    <button onClick={() => { setSleepActive(false); clearInterval(sleepRef.current); eng.current?.masterVol(masterV); }}
                      className="px-6 py-3 rounded-xl text-[13px] font-medium gl transition-all active:scale-95" style={{ color: "rgba(255,255,255,0.4)" }}>타이머 취소</button>
                  </div>
                ) : (
                  <div>
                    <p className="text-[12px] mt-4 mb-6" style={{ color: "rgba(255,255,255,0.2)" }}>설정한 시간 후 자동으로 꺼집니다</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[15, 30, 60, 120].map(m => (
                        <button key={m} onClick={() => { setSleepLeft(m * 60); setSleepActive(true); }}
                          className="p-5 rounded-2xl gl hover:bg-white/[0.04] transition-all active:scale-95">
                          <div className="text-2xl mb-1">😴</div>
                          <div className="text-[14px] font-bold">{m}분</div>
                          <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.15)" }}>{m >= 60 ? `${m / 60}시간` : `${m}분`} 후 정지</div>
                        </button>
                      ))}
                    </div>
                    {!playing && <p className="text-[11px] mt-4" style={{ color: "rgba(251,191,36,0.3)" }}>먼저 사운드를 재생하세요</p>}
                  </div>
                )}
              </div>
            )}

            <div className="w-full flex justify-center my-5">
              <div className="w-full h-[65px] rounded-2xl flex items-center justify-center" style={{ border: "1px dashed rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.05)", fontSize: 9 }}>AD</div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Player */}
      {playing && (
        <div className="fixed bottom-0 left-0 right-0 z-30">
          <div className="text-center py-1" style={{ background: "rgba(4,12,24,0.5)" }}>
            <div className="inline-block rounded-xl px-6 py-0.5" style={{ border: "1px dashed rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.05)", fontSize: 8, letterSpacing: "0.2em" }}>ANCHOR AD</div>
          </div>
          <div style={{ background: "rgba(4,12,24,0.85)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", borderTop: "1px solid rgba(255,255,255,0.04)" }} className="px-5 py-2.5">
            <div className="max-w-lg mx-auto flex items-center gap-3">
              <div className="flex gap-0.5 flex-1 overflow-hidden">
                {active.slice(0, 6).map(([id]) => {
                  const s = SOUNDS.find(x => x.id === id);
                  return <span key={id} className="text-sm">{s?.emoji}</span>;
                })}
                {active.length > 6 && <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.15)" }}>+{active.length - 6}</span>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.12)" }}>🔊</span>
                <input type="range" min="0" max="100" value={masterV} onChange={e => changeMaster(+e.target.value)}
                  className="w-20" style={{ background: `linear-gradient(to right, #22d3ee ${masterV}%, rgba(255,255,255,0.04) ${masterV}%)` }} />
              </div>
              <button onClick={stopAll} className="text-[11px] px-2 py-1 rounded transition-all" style={{ color: "#f87171" }}>■</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer (when not playing) */}
      {!playing && (
        <footer className="fixed bottom-0 left-0 right-0 z-20" style={{ background: "linear-gradient(to top, rgba(2,6,16,0.97), rgba(2,6,16,0.5), transparent)" }}>
          <div className="text-center py-2.5">
            <div className="inline-block rounded-xl px-8 py-1.5" style={{ border: "1px dashed rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.05)", fontSize: 8, letterSpacing: "0.2em" }}>ANCHOR AD</div>
          </div>
        </footer>
      )}
    </div>
  );
}
