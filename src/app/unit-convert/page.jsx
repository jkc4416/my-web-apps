"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

const CATEGORIES = [
  {
    name: "길이", emoji: "📏",
    units: [
      { id: "mm", name: "밀리미터 (mm)", factor: 0.001 },
      { id: "cm", name: "센티미터 (cm)", factor: 0.01 },
      { id: "m", name: "미터 (m)", factor: 1 },
      { id: "km", name: "킬로미터 (km)", factor: 1000 },
      { id: "in", name: "인치 (in)", factor: 0.0254 },
      { id: "ft", name: "피트 (ft)", factor: 0.3048 },
      { id: "yd", name: "야드 (yd)", factor: 0.9144 },
      { id: "mi", name: "마일 (mi)", factor: 1609.344 },
    ],
  },
  {
    name: "무게", emoji: "⚖️",
    units: [
      { id: "mg", name: "밀리그램 (mg)", factor: 0.000001 },
      { id: "g", name: "그램 (g)", factor: 0.001 },
      { id: "kg", name: "킬로그램 (kg)", factor: 1 },
      { id: "t", name: "톤 (t)", factor: 1000 },
      { id: "oz", name: "온스 (oz)", factor: 0.0283495 },
      { id: "lb", name: "파운드 (lb)", factor: 0.453592 },
      { id: "근", name: "근", factor: 0.6 },
    ],
  },
  {
    name: "온도", emoji: "🌡️",
    units: [
      { id: "c", name: "섭씨 (°C)", factor: null },
      { id: "f", name: "화씨 (°F)", factor: null },
      { id: "k", name: "켈빈 (K)", factor: null },
    ],
  },
  {
    name: "넓이", emoji: "📐",
    units: [
      { id: "sqm", name: "제곱미터 (m²)", factor: 1 },
      { id: "sqkm", name: "제곱킬로미터 (km²)", factor: 1e6 },
      { id: "ha", name: "헥타르 (ha)", factor: 10000 },
      { id: "pyeong", name: "평", factor: 3.3058 },
      { id: "sqft", name: "제곱피트 (ft²)", factor: 0.092903 },
      { id: "ac", name: "에이커 (ac)", factor: 4046.86 },
    ],
  },
  {
    name: "속도", emoji: "🚀",
    units: [
      { id: "ms", name: "m/s", factor: 1 },
      { id: "kmh", name: "km/h", factor: 0.277778 },
      { id: "mph", name: "mph", factor: 0.44704 },
      { id: "knot", name: "노트 (knot)", factor: 0.514444 },
    ],
  },
  {
    name: "데이터", emoji: "💾",
    units: [
      { id: "b", name: "바이트 (B)", factor: 1 },
      { id: "kb", name: "킬로바이트 (KB)", factor: 1024 },
      { id: "mb", name: "메가바이트 (MB)", factor: 1048576 },
      { id: "gb", name: "기가바이트 (GB)", factor: 1073741824 },
      { id: "tb", name: "테라바이트 (TB)", factor: 1099511627776 },
    ],
  },
];

function convertTemp(value, from, to) {
  let celsius;
  if (from === "c") celsius = value;
  else if (from === "f") celsius = (value - 32) * 5 / 9;
  else celsius = value - 273.15;

  if (to === "c") return celsius;
  if (to === "f") return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

export default function UnitConvertPage() {
  const [catIdx, setCatIdx] = useState(0);
  // Load saved category
  useEffect(() => {
    try { const c = localStorage.getItem("unit-convert-cat"); if (c !== null) { const i = Number(c); if (i >= 0 && i < CATEGORIES.length) setCatIdx(i); } } catch {}
  }, []);
  useEffect(() => { try { localStorage.setItem("unit-convert-cat", String(catIdx)); } catch {} }, [catIdx]);
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [value, setValue] = useState("1");

  const cat = CATEGORIES[catIdx];
  const from = cat.units[fromIdx] || cat.units[0];
  const to = cat.units[toIdx] || cat.units[1];

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v)) return "";
    if (cat.name === "온도") return convertTemp(v, from.id, to.id).toFixed(4).replace(/\.?0+$/, "");
    const base = v * from.factor;
    return (base / to.factor).toFixed(8).replace(/\.?0+$/, "");
  }, [value, from, to, cat]);

  const swap = () => { setFromIdx(toIdx); setToIdx(fromIdx); };

  return (
    <div className="min-h-screen text-white" style={{ background: "radial-gradient(ellipse at 50% 0%, #0a1620 0%, #060e14 40%, #03080c 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{ color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(12px)" }}>← 홈</Link>

      <div className="max-w-[440px] mx-auto px-5 pb-16">
        <header className="pt-16 pb-6 text-center">
          <div className="text-4xl mb-3">🔄</div>
          <h1 className="text-2xl font-black" style={{ background: "linear-gradient(135deg, #38bdf8, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>단위 변환기</h1>
          <p className="text-[11px] mt-2" style={{ color: "rgba(255,255,255,.25)" }}>길이, 무게, 온도, 넓이, 속도, 데이터 변환</p>
        </header>

        {/* Categories */}
        <div className="flex gap-1.5 overflow-x-auto mb-5 pb-1">
          {CATEGORIES.map((c, i) => (
            <button key={i} onClick={() => { setCatIdx(i); setFromIdx(0); setToIdx(1); }}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all"
              style={catIdx === i ? { background: "rgba(56,189,248,.1)", color: "#38bdf8", border: "1px solid rgba(56,189,248,.2)" } : { color: "rgba(255,255,255,.2)", border: "1px solid transparent" }}>
              {c.emoji} {c.name}
            </button>
          ))}
        </div>

        {/* Converter */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
          {/* From */}
          <div className="mb-3">
            <select value={fromIdx} onChange={(e) => setFromIdx(Number(e.target.value))} aria-label="변환 전 단위"
              className="w-full rounded-xl px-4 py-2.5 text-[12px] mb-2 appearance-none outline-none"
              style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)", color: "#e2e8f0" }}>
              {cat.units.map((u, i) => <option key={u.id} value={i}>{u.name}</option>)}
            </select>
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} inputMode="decimal" aria-label="변환할 값"
              className="w-full rounded-xl px-4 py-3 text-[18px] font-bold text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)", color: "#e2e8f0" }} />
          </div>

          {/* Swap */}
          <div className="flex justify-center my-2">
            <button onClick={swap} className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 hover:bg-white/10"
              style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}>
              ⇅
            </button>
          </div>

          {/* To */}
          <div>
            <select value={toIdx} onChange={(e) => setToIdx(Number(e.target.value))} aria-label="변환 후 단위"
              className="w-full rounded-xl px-4 py-2.5 text-[12px] mb-2 appearance-none outline-none"
              style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)", color: "#e2e8f0" }}>
              {cat.units.map((u, i) => <option key={u.id} value={i}>{u.name}</option>)}
            </select>
            <div className="w-full rounded-xl px-4 py-3 text-[18px] font-bold text-center" style={{ background: "rgba(56,189,248,.06)", border: "1px solid rgba(56,189,248,.15)", color: "#38bdf8" }}>
              {result || "—"}
            </div>
          </div>
        </div>

        {/* Quick reference */}
        <div className="mt-4 text-center text-[10px]" style={{ color: "rgba(255,255,255,.1)" }}>
          <p>{value} {from.name.split("(")[0].trim()} = {result} {to.name.split("(")[0].trim()}</p>
        </div>
      </div>
    </div>
  );
}
