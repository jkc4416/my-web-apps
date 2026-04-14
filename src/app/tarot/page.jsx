"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

const CARDS = [
  { id: 0, name: "바보", emoji: "🃏", meaning: "새로운 시작, 순수한 마음으로 용기를 내세요. 지금 시작하는 연애가 의외로 좋은 인연일 수 있어요.", advice: "두려워하지 말고 한 발짝 내딛어보세요.", love: 4 },
  { id: 1, name: "마법사", emoji: "🧙", meaning: "당신에게는 상대를 사로잡을 매력이 있어요. 자신감을 가지세요. 적극적으로 다가가면 좋은 결과가 있을 거예요.", advice: "지금 가진 매력을 최대한 발휘할 때예요.", love: 5 },
  { id: 2, name: "여사제", emoji: "🌙", meaning: "직감을 믿으세요. 마음 깊은 곳에서 이미 답을 알고 있어요. 서두르지 말고 상대의 진심을 느껴보세요.", advice: "조용히 기다리면 답이 올 거예요.", love: 3 },
  { id: 3, name: "여황제", emoji: "👸", meaning: "풍요롭고 따뜻한 에너지가 가득해요. 사랑을 주고받기에 최적의 시기! 감사하는 마음을 표현하세요.", advice: "사랑은 줄수록 커진다는 걸 기억하세요.", love: 5 },
  { id: 4, name: "황제", emoji: "🤴", meaning: "안정적이고 든든한 관계를 원하고 있어요. 지금 만나는 사람이라면 신뢰를 쌓아가는 시기예요.", advice: "진지하게 관계를 발전시킬 때예요.", love: 4 },
  { id: 5, name: "연인들", emoji: "💑", meaning: "운명적인 만남이 예고되어 있어요! 이미 만났다면, 둘의 관계가 한층 깊어질 시기예요.", advice: "마음을 열고 사랑을 받아들이세요.", love: 5 },
  { id: 6, name: "전차", emoji: "🏎️", meaning: "적극적으로 행동할 때예요! 고민만 하지 말고 용기를 내세요. 관계에서 주도적인 역할이 좋아요.", advice: "망설이지 말고 고백하세요!", love: 4 },
  { id: 7, name: "힘", emoji: "🦁", meaning: "인내심이 필요한 시기예요. 상대를 이해하고 기다려주세요. 부드러운 힘이 관계를 단단하게 만들어요.", advice: "급하게 결론 내지 마세요. 시간이 답이에요.", love: 3 },
  { id: 8, name: "은둔자", emoji: "🏔️", meaning: "혼자만의 시간이 필요해요. 연애보다 자기 자신에게 집중하세요. 내면이 성장하면 더 좋은 인연이 와요.", advice: "지금은 자기 성장에 집중하세요.", love: 2 },
  { id: 9, name: "운명의 수레바퀴", emoji: "🎡", meaning: "변화가 찾아오고 있어요! 새로운 인연이 들어오거나, 기존 관계에 전환점이 올 수 있어요.", advice: "변화를 두려워하지 마세요. 흐름에 맡기세요.", love: 4 },
  { id: 10, name: "정의", emoji: "⚖️", meaning: "균형 잡힌 관계가 중요해요. 한쪽만 노력하는 건 아닌지 돌아보세요. 공정한 사랑이 행복의 열쇠예요.", advice: "서로 주고받는 관계를 만들어가세요.", love: 3 },
  { id: 11, name: "별", emoji: "⭐", meaning: "희망적인 에너지가 가득해요! 마음먹은 대로 잘 풀릴 시기. 긍정적인 마음이 좋은 인연을 끌어당겨요.", advice: "긍정의 힘을 믿으세요. 별이 빛나고 있어요.", love: 5 },
  { id: 12, name: "달", emoji: "🌑", meaning: "불안한 감정이 있을 수 있어요. 하지만 그것은 환상일 뿐! 진실을 보려고 노력하면 오해가 풀려요.", advice: "감정에 휘둘리지 말고 사실을 확인하세요.", love: 2 },
  { id: 13, name: "태양", emoji: "☀️", meaning: "밝고 행복한 에너지! 연애운이 최고조예요. 솔로라면 곧 좋은 만남이, 커플이라면 행복한 시간이 기다려요.", advice: "웃으면 복이 와요. 즐거운 데이트 하세요!", love: 5 },
  { id: 14, name: "세계", emoji: "🌍", meaning: "완성과 성취의 카드! 오래된 연애라면 결실을 맺을 시기. 솔로라면 이상적인 상대를 만날 수 있어요.", advice: "모든 것이 잘 흘러가고 있어요. 믿으세요.", love: 5 },
];

export default function TarotPage() {
  const [phase, setPhase] = useState("intro"); // intro, picking, reveal
  const [flipped, setFlipped] = useState([false, false, false]);
  const [picked, setPicked] = useState([]);
  const [shuffled, setShuffled] = useState([]);

  const start = useCallback(() => {
    const shuffledCards = [...CARDS].sort(() => Math.random() - 0.5);
    setShuffled(shuffledCards);
    setPicked(shuffledCards.slice(0, 3));
    setFlipped([false, false, false]);
    setPhase("picking");
  }, []);

  const flipCard = (idx) => {
    setFlipped((f) => { const n = [...f]; n[idx] = true; return n; });
    if (flipped.filter(Boolean).length === 2) {
      setTimeout(() => setPhase("reveal"), 600);
    }
  };

  const labels = ["과거", "현재", "미래"];

  const share = () => {
    const text = picked.map((c, i) => `${labels[i]}: ${c.emoji} ${c.name}`).join("\n");
    const msg = `🔮 나의 연애 타로 결과\n\n${text}\n\n나도 보기 → funappbox.com/tarot`;
    if (navigator.share) navigator.share({ title: "연애 타로", text: msg });
    else { try { navigator.clipboard.writeText(msg); } catch {} alert("복사되었습니다!"); }
  };

  return (
    <div className="min-h-screen text-white" style={{ background: "radial-gradient(ellipse at 50% 0%, #1a0a20 0%, #0c0614 40%, #060308 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{ color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(12px)" }}>← 홈</Link>

      <div className="max-w-[440px] mx-auto px-5 pb-16">
        <header className="pt-16 pb-6 text-center">
          <div className="text-4xl mb-3">🔮</div>
          <h1 className="text-2xl font-black" style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>연애 타로</h1>
          <p className="text-[11px] mt-2" style={{ color: "rgba(255,255,255,.25)" }}>3장의 카드로 보는 과거·현재·미래의 연애운</p>
        </header>

        {phase === "intro" && (
          <div className="text-center">
            <div className="text-6xl mb-6" style={{ animation: "pulse 2s ease-in-out infinite" }}>🃏</div>
            <p className="text-[13px] mb-6 leading-relaxed" style={{ color: "rgba(255,255,255,.3)" }}>마음을 가다듬고 연애에 대한 고민을 떠올리세요. 준비가 되었다면 카드를 뽑아보세요.</p>
            <button onClick={start} className="px-8 py-4 rounded-2xl font-bold text-[15px] transition-all active:scale-[0.97]" style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", boxShadow: "0 8px 25px rgba(192,132,252,0.2)" }}>
              🔮 카드 뽑기
            </button>
          </div>
        )}

        {(phase === "picking" || phase === "reveal") && (
          <div>
            {/* Cards */}
            <div className="flex gap-3 justify-center mb-6">
              {picked.map((card, i) => (
                <div key={i} className="text-center">
                  <div className="text-[10px] mb-2 font-semibold" style={{ color: "rgba(255,255,255,.3)" }}>{labels[i]}</div>
                  <button onClick={() => !flipped[i] && phase === "picking" && flipCard(i)} disabled={flipped[i]}
                    className="w-24 h-36 rounded-xl flex items-center justify-center transition-all duration-500"
                    style={{
                      background: flipped[i] ? "linear-gradient(135deg, rgba(192,132,252,0.15), rgba(244,114,182,0.15))" : "linear-gradient(135deg, #4c1d95, #7e22ce)",
                      border: `2px solid ${flipped[i] ? "rgba(192,132,252,0.3)" : "rgba(255,255,255,.1)"}`,
                      transform: flipped[i] ? "rotateY(0)" : "rotateY(0)",
                      boxShadow: flipped[i] ? "0 0 20px rgba(192,132,252,0.15)" : "none",
                    }}>
                    {flipped[i] ? (
                      <div>
                        <div className="text-3xl mb-1">{card.emoji}</div>
                        <div className="text-[10px] font-bold" style={{ color: "#c084fc" }}>{card.name}</div>
                      </div>
                    ) : (
                      <div className="text-2xl">🂠</div>
                    )}
                  </button>
                  {flipped[i] && <div className="flex justify-center mt-1.5">{Array.from({ length: 5 }, (_, s) => <span key={s} style={{ color: s < card.love ? "#f472b6" : "rgba(255,255,255,.1)", fontSize: 10 }}>♥</span>)}</div>}
                </div>
              ))}
            </div>

            {/* Detailed readings */}
            {phase === "reveal" && (
              <div className="space-y-3">
                {picked.map((card, i) => (
                  <div key={i} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{card.emoji}</span>
                      <span className="text-[13px] font-bold">{labels[i]} — {card.name}</span>
                    </div>
                    <p className="text-[12px] leading-relaxed mb-2" style={{ color: "rgba(255,255,255,.35)" }}>{card.meaning}</p>
                    <p className="text-[11px] font-medium" style={{ color: "#c084fc" }}>💡 {card.advice}</p>
                  </div>
                ))}

                <div className="flex gap-2 mt-4">
                  <button onClick={start} className="flex-1 py-3 rounded-2xl text-[13px] font-semibold" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", color: "rgba(255,255,255,.4)" }}>다시 뽑기</button>
                  <button onClick={share} className="flex-1 py-3 rounded-2xl text-[13px] font-semibold" style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>공유하기</button>
                </div>
              </div>
            )}

            {phase === "picking" && <p className="text-center text-[12px] mt-2" style={{ color: "rgba(255,255,255,.2)" }}>카드를 탭하여 뒤집으세요 ({flipped.filter(Boolean).length}/3)</p>}
          </div>
        )}

        <div className="mt-8 text-center text-[10px]" style={{ color: "rgba(255,255,255,.06)" }}>
          <p>⚠️ 재미 목적의 콘텐츠이며 실제 점술이 아닙니다.</p>
        </div>
      </div>
    </div>
  );
}
