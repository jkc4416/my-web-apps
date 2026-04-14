"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const LIVES = [
  { id: "king", name: "왕족", emoji: "👑", era: "조선시대", desc: "전생에서 당신은 백성을 다스리던 왕족이었습니다. 높은 카리스마와 리더십을 타고났으며, 사람들을 이끄는 운명을 가졌어요. 현생에서도 리더의 자질이 곳곳에 드러나고 있어요.", traits: ["카리스마", "결단력", "리더십"], color: "#fbbf24" },
  { id: "scholar", name: "학자", emoji: "📚", era: "고려시대", desc: "전생에서 당신은 학문에 몰두하던 학자였습니다. 지식에 대한 탐구심이 남달랐으며, 조용히 세상의 이치를 깨우치던 사람이었어요. 현생에서도 배움에 대한 열정이 강해요.", traits: ["지적 호기심", "깊은 사고", "끈기"], color: "#818cf8" },
  { id: "warrior", name: "무사", emoji: "⚔️", era: "삼국시대", desc: "전생에서 당신은 전장을 누비던 용맹한 무사였습니다. 강인한 의지와 정의감으로 사람들을 지켰어요. 현생에서도 도전을 두려워하지 않는 용기가 있어요.", traits: ["용기", "정의감", "강인함"], color: "#ef4444" },
  { id: "artist", name: "예술가", emoji: "🎨", era: "르네상스", desc: "전생에서 당신은 아름다움을 창조하던 예술가였습니다. 뛰어난 감수성과 창의력으로 사람들에게 감동을 줬어요. 현생에서도 예술적 감각이 남다릅니다.", traits: ["창의력", "감수성", "심미안"], color: "#ec4899" },
  { id: "merchant", name: "상인", emoji: "💰", era: "실크로드", desc: "전생에서 당신은 세계를 누비던 대상인이었습니다. 뛰어난 협상력과 모험심으로 큰 부를 일궜어요. 현생에서도 재물운과 사교성이 돋보여요.", traits: ["사교성", "모험심", "재물운"], color: "#f97316" },
  { id: "healer", name: "치유사", emoji: "🌿", era: "중세시대", desc: "전생에서 당신은 사람들의 아픔을 치유하던 치유사였습니다. 따뜻한 마음과 공감 능력으로 많은 이를 도왔어요. 현생에서도 주변을 돌보는 성향이 강해요.", traits: ["공감력", "따뜻함", "치유력"], color: "#4ade80" },
  { id: "explorer", name: "탐험가", emoji: "🗺️", era: "대항해시대", desc: "전생에서 당신은 미지의 세계를 탐험하던 모험가였습니다. 호기심과 용기로 새로운 땅을 개척했어요. 현생에서도 새로운 것에 대한 열망이 강해요.", traits: ["호기심", "도전정신", "자유로움"], color: "#22d3ee" },
  { id: "monk", name: "수도승", emoji: "🧘", era: "동양 고대", desc: "전생에서 당신은 깊은 명상에 잠기던 수도승이었습니다. 내면의 평화를 추구하며 진리를 탐구했어요. 현생에서도 차분한 내면과 직관력을 가지고 있어요.", traits: ["명상", "직관력", "평화로움"], color: "#a78bfa" },
];

function hashBirth(y, m, d) {
  let h = 0;
  const s = `${y}-${m}-${d}`;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function PastLifePage() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [showResult, setShowResult] = useState(false);

  const result = useMemo(() => {
    const y = parseInt(year), m = parseInt(month), d = parseInt(day);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
    const hash = hashBirth(y, m, d);
    return LIVES[hash % LIVES.length];
  }, [year, month, day]);

  const share = () => {
    if (!result) return;
    const text = `나의 전생은 ${result.emoji} ${result.era}의 ${result.name}!\n${result.traits.join(", ")}\n\n나도 알아보기 → funappbox.com/past-life`;
    if(navigator.share)try{navigator.share({ title: "전생 테스트", text });}catch{}
    else { try { navigator.clipboard.writeText(text); } catch {} alert("복사되었습니다!"); }
  };

  return (
    <div className="min-h-screen text-white" style={{ background: "radial-gradient(ellipse at 50% 0%, #1a1020 0%, #0c0812 40%, #060408 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{ color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(12px)" }}>← 홈</Link>

      <div className="max-w-[440px] mx-auto px-5 pb-16">
        <header className="pt-16 pb-6 text-center">
          <div className="text-4xl mb-3">🔮</div>
          <h1 className="text-2xl font-black" style={{ background: "linear-gradient(135deg, #a78bfa, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>나의 전생 테스트</h1>
          <p className="text-[11px] mt-2" style={{ color: "rgba(255,255,255,.25)" }}>생년월일로 알아보는 나의 전생</p>
        </header>

        {!showResult ? (
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[{ v: year, s: setYear, p: "년", l: "년" }, { v: month, s: setMonth, p: "월", l: "월" }, { v: day, s: setDay, p: "일", l: "일" }].map((f) => (
                <div key={f.l}><input type="number" placeholder={f.p} value={f.v} onChange={(e) => f.s(e.target.value)} inputMode="numeric" aria-label={f.l}
                  className="w-full rounded-xl px-3 py-3 text-center text-[15px] font-bold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)", color: "#e2e8f0" }} />
                <span className="block text-center text-[9px] mt-1" style={{ color: "rgba(255,255,255,.15)" }}>{f.l}</span></div>
              ))}
            </div>
            <button onClick={() => { if (result) setShowResult(true); }} disabled={!result}
              className="w-full py-4 rounded-2xl font-bold text-[14px] transition-all active:scale-[0.97] disabled:opacity-30"
              style={{ background: "linear-gradient(135deg, #a78bfa, #f472b6)", boxShadow: "0 8px 25px rgba(167,139,250,0.2)" }}>
              🔮 전생 보기
            </button>
          </div>
        ) : result ? (
          <div className="text-center">
            <div className="text-7xl mb-4">{result.emoji}</div>
            <div className="text-[12px] mb-1" style={{ color: "rgba(255,255,255,.25)" }}>{result.era}</div>
            <h2 className="text-3xl font-black mb-3" style={{ color: result.color }}>당신의 전생은 {result.name}</h2>
            <p className="text-[13px] leading-relaxed mb-5 px-2" style={{ color: "rgba(255,255,255,.4)" }}>{result.desc}</p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {result.traits.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full text-[11px] font-medium" style={{ background: `${result.color}15`, border: `1px solid ${result.color}25`, color: result.color }}>{t}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowResult(false)} className="flex-1 py-3 rounded-2xl text-[13px] font-semibold" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", color: "rgba(255,255,255,.4)" }}>다시하기</button>
              <button onClick={share} className="flex-1 py-3 rounded-2xl text-[13px] font-semibold" style={{ background: `linear-gradient(135deg, ${result.color}, #f472b6)` }}>공유하기</button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
