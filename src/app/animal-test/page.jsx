"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

const ANIMALS = [
  { id: "cat", name: "고양이", emoji: "🐱", desc: "독립적이고 우아한 당신! 혼자만의 시간을 즐기며 예리한 관찰력을 가졌어요. 차가워 보이지만 마음을 연 사람에겐 한없이 다정해요.", traits: ["독립적", "우아함", "관찰력", "도도함"], color: "#a78bfa" },
  { id: "dog", name: "강아지", emoji: "🐶", desc: "충성스럽고 활발한 당신! 사람을 좋아하고 에너지가 넘쳐요. 누구와든 금방 친해지는 사교성의 달인이에요.", traits: ["충성심", "활발함", "사교성", "낙천적"], color: "#fbbf24" },
  { id: "fox", name: "여우", emoji: "🦊", desc: "영리하고 매력적인 당신! 상황 파악이 빠르고 처세술이 뛰어나요. 미스터리한 분위기로 사람들을 끌어당겨요.", traits: ["영리함", "매력", "적응력", "재치"], color: "#f97316" },
  { id: "bear", name: "곰", emoji: "🐻", desc: "듬직하고 따뜻한 당신! 겉은 무뚝뚝하지만 속은 부드러워요. 주변 사람들에게 안정감을 주는 존재예요.", traits: ["듬직함", "따뜻함", "인내심", "신뢰감"], color: "#92400e" },
  { id: "rabbit", name: "토끼", emoji: "🐰", desc: "귀엽고 섬세한 당신! 감수성이 풍부하고 센스가 넘쳐요. 겁이 좀 있지만 순발력과 직감이 뛰어나요.", traits: ["섬세함", "감수성", "순발력", "귀여움"], color: "#ec4899" },
  { id: "eagle", name: "독수리", emoji: "🦅", desc: "카리스마 넘치는 리더형! 높은 곳에서 큰 그림을 보는 전략가예요. 목표를 향한 집중력이 놀라워요.", traits: ["리더십", "집중력", "전략적", "카리스마"], color: "#6366f1" },
  { id: "dolphin", name: "돌고래", emoji: "🐬", desc: "똑똑하고 유쾌한 당신! 소통 능력이 뛰어나고 팀워크를 중시해요. 긍정적인 에너지로 주변을 밝혀요.", traits: ["소통력", "유쾌함", "지능", "협동심"], color: "#22d3ee" },
  { id: "owl", name: "부엉이", emoji: "🦉", desc: "지적이고 신비로운 당신! 깊이 있는 사고와 통찰력을 가졌어요. 조용하지만 말 한마디에 무게가 있어요.", traits: ["지적", "통찰력", "신비로움", "차분함"], color: "#818cf8" },
];

const QUESTIONS = [
  { q: "주말에 가장 하고 싶은 것은?", a: [{ text: "집에서 혼자 쉬기", scores: { cat: 3, owl: 2, bear: 1 } }, { text: "친구들과 만나기", scores: { dog: 3, dolphin: 2, rabbit: 1 } }, { text: "새로운 곳 탐험", scores: { fox: 3, eagle: 2, dolphin: 1 } }, { text: "책이나 영화 감상", scores: { owl: 3, cat: 2, bear: 1 } }] },
  { q: "친구들 사이에서 나의 역할은?", a: [{ text: "리더·의사결정자", scores: { eagle: 3, fox: 2, dog: 1 } }, { text: "분위기 메이커", scores: { dolphin: 3, dog: 2, rabbit: 1 } }, { text: "조용한 참모·조언자", scores: { owl: 3, cat: 2, bear: 1 } }, { text: "다 맞춰주는 타입", scores: { bear: 3, rabbit: 2, dog: 1 } }] },
  { q: "스트레스를 받으면?", a: [{ text: "혼자 있고 싶다", scores: { cat: 3, owl: 2, eagle: 1 } }, { text: "친한 사람에게 털어놓는다", scores: { dog: 3, dolphin: 2, rabbit: 1 } }, { text: "맛있는 것을 먹는다", scores: { bear: 3, rabbit: 2, fox: 1 } }, { text: "운동이나 활동으로 풀기", scores: { eagle: 3, fox: 2, dolphin: 1 } }] },
  { q: "첫인상으로 가장 많이 듣는 말은?", a: [{ text: "차분하다/조용하다", scores: { cat: 3, owl: 2, bear: 1 } }, { text: "밝다/에너지 넘친다", scores: { dog: 3, dolphin: 2, fox: 1 } }, { text: "카리스마 있다/강해보인다", scores: { eagle: 3, fox: 2, cat: 1 } }, { text: "귀엽다/순해보인다", scores: { rabbit: 3, bear: 2, dog: 1 } }] },
  { q: "일할 때 나의 스타일은?", a: [{ text: "혼자 집중해서 깊게", scores: { cat: 3, owl: 2, eagle: 1 } }, { text: "여럿이 함께 협력", scores: { dolphin: 3, dog: 2, bear: 1 } }, { text: "빠르게 판단·실행", scores: { fox: 3, eagle: 2, dolphin: 1 } }, { text: "꼼꼼하게 천천히", scores: { rabbit: 3, bear: 2, owl: 1 } }] },
  { q: "이상적인 여행 스타일은?", a: [{ text: "계획 없이 자유롭게", scores: { fox: 3, cat: 2, dolphin: 1 } }, { text: "꼼꼼한 계획대로", scores: { owl: 3, rabbit: 2, eagle: 1 } }, { text: "액티비티 가득", scores: { eagle: 3, dog: 2, fox: 1 } }, { text: "느긋하게 힐링", scores: { bear: 3, cat: 2, rabbit: 1 } }] },
  { q: "화가 나면 어떻게 표현하나요?", a: [{ text: "말은 안 하지만 태도로 보여줌", scores: { cat: 3, owl: 2, fox: 1 } }, { text: "바로 말로 표현함", scores: { dog: 3, eagle: 2, dolphin: 1 } }, { text: "일단 참고 나중에 말함", scores: { bear: 3, rabbit: 2, owl: 1 } }, { text: "유머로 넘김", scores: { fox: 3, dolphin: 2, dog: 1 } }] },
];

export default function AnimalTestPage() {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState({});
  const [result, setResult] = useState(null);

  const choose = useCallback((answer) => {
    const newScores = { ...scores };
    Object.entries(answer.scores).forEach(([animal, pts]) => {
      newScores[animal] = (newScores[animal] || 0) + pts;
    });
    setScores(newScores);

    if (current + 1 >= QUESTIONS.length) {
      const sorted = Object.entries(newScores).sort((a, b) => b[1] - a[1]);
      const topAnimal = ANIMALS.find((a) => a.id === sorted[0][0]);
      setResult(topAnimal);
    } else {
      setCurrent(current + 1);
    }
  }, [current, scores]);

  const restart = () => { setCurrent(0); setScores({}); setResult(null); };

  const share = () => {
    if (!result) return;
    const text = `나의 닮은 동물은 ${result.emoji} ${result.name}!\n${result.traits.join(", ")}\n\n나도 테스트하기 → funappbox.com/animal-test`;
    if(navigator.share)try{navigator.share({ title: "닮은 동물 테스트", text });}catch{}
    else { try { navigator.clipboard.writeText(text); } catch {} alert("복사되었습니다!"); }
  };

  return (
    <div className="min-h-screen text-white" style={{ background: "radial-gradient(ellipse at 50% 0%, #1a1208 0%, #0e0a06 40%, #08060a 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{ color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(12px)" }}>← 홈</Link>

      <div className="max-w-[440px] mx-auto px-5 pb-16">
        <header className="pt-16 pb-6 text-center">
          <div className="text-4xl mb-3">🐾</div>
          <h1 className="text-2xl font-black" style={{ background: "linear-gradient(135deg, #fbbf24, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>닮은 동물 테스트</h1>
          <p className="text-[11px] mt-2" style={{ color: "rgba(255,255,255,.25)" }}>7가지 질문으로 알아보는 나의 닮은 동물</p>
        </header>

        {!result ? (
          <div>
            <div className="flex items-center justify-between mb-2 text-[11px]" style={{ color: "rgba(255,255,255,.2)" }}>
              <span>{current + 1} / {QUESTIONS.length}</span>
            </div>
            <div className="h-1 rounded-full mb-6 overflow-hidden" style={{ background: "rgba(255,255,255,.04)" }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((current + 1) / QUESTIONS.length) * 100}%`, background: "linear-gradient(90deg, #fbbf24, #f97316)" }} />
            </div>

            <div className="text-center mb-5">
              <h2 className="text-[16px] font-bold">{QUESTIONS[current].q}</h2>
            </div>

            <div className="space-y-2.5">
              {QUESTIONS[current].a.map((answer, i) => (
                <button key={i} onClick={() => choose(answer)}
                  className="w-full text-left p-4 rounded-2xl text-[13px] font-medium transition-all active:scale-[0.98]"
                  style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
                  {answer.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-7xl mb-4">{result.emoji}</div>
            <div className="text-[12px] mb-1" style={{ color: "rgba(255,255,255,.25)" }}>당신과 닮은 동물은...</div>
            <h2 className="text-3xl font-black mb-3" style={{ color: result.color }}>{result.name}</h2>
            <p className="text-[13px] leading-relaxed mb-5 px-2" style={{ color: "rgba(255,255,255,.4)" }}>{result.desc}</p>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {result.traits.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full text-[11px] font-medium" style={{ background: `${result.color}15`, border: `1px solid ${result.color}25`, color: result.color }}>{t}</span>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={restart} className="flex-1 py-3 rounded-2xl text-[13px] font-semibold transition-all active:scale-95" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", color: "rgba(255,255,255,.4)" }}>다시하기</button>
              <button onClick={share} className="flex-1 py-3 rounded-2xl text-[13px] font-semibold transition-all active:scale-95" style={{ background: `linear-gradient(135deg, ${result.color}, #fbbf24)` }}>공유하기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
