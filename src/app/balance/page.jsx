"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

const QUESTIONS = [
  { a: "시간을 되돌리는 능력", b: "미래를 보는 능력" },
  { a: "평생 여름만 사는 세상", b: "평생 겨울만 사는 세상" },
  { a: "투명인간이 되기", b: "하늘을 나는 능력" },
  { a: "100억 받고 5년 감옥", b: "지금 그대로 살기" },
  { a: "모든 언어를 마스터", b: "모든 악기를 마스터" },
  { a: "좀비 세상에서 혼자 생존", b: "무인도에서 1년 생존" },
  { a: "절친의 비밀을 알게 됨", b: "절친이 내 비밀을 알게 됨" },
  { a: "맨날 치킨만 먹기", b: "맨날 피자만 먹기" },
  { a: "10년 후로 타임슬립", b: "10년 전으로 타임슬립" },
  { a: "엄청 잘생겼지만 가난", b: "못생겼지만 엄청 부자" },
  { a: "기억력이 완벽해지기", b: "IQ가 200이 되기" },
  { a: "영원히 25살 외모 유지", b: "영원히 건강한 몸" },
  { a: "사랑하는 사람과 가난하게", b: "안 사랑하는 사람과 부유하게" },
  { a: "세계 여행 무제한", b: "최고급 집 한 채" },
  { a: "1년 안식년 (월급 유지)", b: "연봉 2배 (휴가 없음)" },
  { a: "과거의 실수를 하나 지우기", b: "미래의 행운을 하나 확정" },
  { a: "매일 4시간만 자도 멀쩡", b: "먹어도 살이 안 찌는 체질" },
  { a: "소리를 못 듣기", b: "맛을 못 느끼기" },
  { a: "인생 리셋 (기억 유지)", b: "지금부터 매일 100만원 받기" },
  { a: "모든 동물과 대화 가능", b: "모든 기계를 조종 가능" },
  { a: "평생 대중교통만 이용", b: "평생 배달음식 금지" },
  { a: "전교 1등의 두뇌", b: "올림픽 선수급 운동 능력" },
  { a: "연예인급 외모", b: "재벌급 인맥" },
  { a: "하루 1시간만 폰 사용", b: "1년간 여행 금지" },
  { a: "고통 없이 사는 대신 기쁨도 없음", b: "극한의 기쁨과 극한의 고통 모두 경험" },
  { a: "10년간 매일 운동 1시간 필수", b: "10년간 라면만 먹기" },
  { a: "세상 모든 비밀을 아는 능력", b: "세상 누구든 설득하는 능력" },
  { a: "전생의 기억을 갖기", b: "내세를 선택할 수 있기" },
  { a: "항상 진실만 말해야 함", b: "다른 사람의 거짓을 항상 알아챔" },
  { a: "1주일에 한 번 순간이동", b: "하루에 1시간 시간 정지" },
];

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function BalancePage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null); // "a" | "b"
  const [votes, setVotes] = useState(() => QUESTIONS.map((_, i) => ({ a: 50 + (hashSeed(`qa${i}`) % 40), b: 50 + (hashSeed(`qb${i}`) % 40) })));
  const [history, setHistory] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const q = QUESTIONS[current];
  const total = votes[current].a + votes[current].b;
  const pctA = Math.round((votes[current].a / total) * 100);
  const pctB = 100 - pctA;

  const choose = useCallback((side) => {
    if (selected) return;
    setSelected(side);
    setVotes((v) => {
      const copy = [...v];
      copy[current] = { ...copy[current], [side]: copy[current][side] + 1 };
      return copy;
    });
    setHistory((h) => [...h, { q: current, side }]);
  }, [selected, current]);

  const next = useCallback(() => {
    if (current + 1 >= QUESTIONS.length) {
      setShowResult(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
  }, [current]);

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setHistory([]);
    setShowResult(false);
  };

  const share = () => {
    const text = `밸런스 게임 ${history.length}문제 완료!\n내 선택: ${history.map((h) => h.side === "a" ? "A" : "B").join("")}\n\n나도 해보기 → www.funappbox.com/balance`;
    if(navigator.share)try{navigator.share({ title: "밸런스 게임", text });}catch{}
    else { try { navigator.clipboard.writeText(text); } catch {} alert("복사되었습니다!"); }
  };

  return (
    <div className="min-h-screen text-white" style={{ background: "radial-gradient(ellipse at 50% 0%, #1a0a28 0%, #0c0618 40%, #04020a 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{ color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(12px)" }}>← 홈</Link>

      <div className="max-w-[440px] mx-auto px-5 pb-16">
        <header className="pt-16 pb-6 text-center">
          <div className="text-4xl mb-3">⚖️</div>
          <h1 className="text-2xl font-black" style={{ background: "linear-gradient(135deg, #f472b6, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>밸런스 게임</h1>
          <p className="text-[11px] mt-2" style={{ color: "rgba(255,255,255,.25)" }}>당신의 선택은? 어려운 양자택일 {QUESTIONS.length}제</p>
        </header>

        {!showResult ? (
          <div>
            {/* Progress */}
            <div className="flex items-center justify-between mb-2 text-[11px]" style={{ color: "rgba(255,255,255,.2)" }}>
              <span>{current + 1} / {QUESTIONS.length}</span>
              <span>{Math.round(((current + (selected ? 1 : 0)) / QUESTIONS.length) * 100)}%</span>
            </div>
            <div className="h-1 rounded-full mb-6 overflow-hidden" style={{ background: "rgba(255,255,255,.04)" }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((current + (selected ? 1 : 0)) / QUESTIONS.length) * 100}%`, background: "linear-gradient(90deg, #f472b6, #c084fc)" }} />
            </div>

            {/* Question */}
            <div className="text-center mb-5">
              <span className="text-[13px] font-bold" style={{ color: "rgba(255,255,255,.4)" }}>Q{current + 1}.</span>
            </div>

            <div className="space-y-3">
              {/* Option A */}
              <button onClick={() => choose("a")} disabled={!!selected}
                className="w-full rounded-2xl p-5 text-left transition-all active:scale-[0.98] relative overflow-hidden"
                style={{
                  background: selected === "a" ? "rgba(244,114,182,0.15)" : "rgba(255,255,255,.03)",
                  border: `2px solid ${selected === "a" ? "rgba(244,114,182,0.4)" : selected === "b" ? "rgba(255,255,255,.03)" : "rgba(255,255,255,.06)"}`,
                }}>
                {selected && <div className="absolute left-0 top-0 bottom-0 rounded-2xl transition-all duration-700" style={{ width: `${pctA}%`, background: "rgba(244,114,182,0.08)" }} />}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black" style={{ color: "#f472b6" }}>A</span>
                    <span className="text-[14px] font-medium">{q.a}</span>
                  </div>
                  {selected && <span className="text-[14px] font-black tabular-nums" style={{ color: "#f472b6" }}>{pctA}%</span>}
                </div>
              </button>

              {/* VS */}
              <div className="text-center">
                <span className="text-[12px] font-black px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,.04)", color: "rgba(255,255,255,.2)" }}>VS</span>
              </div>

              {/* Option B */}
              <button onClick={() => choose("b")} disabled={!!selected}
                className="w-full rounded-2xl p-5 text-left transition-all active:scale-[0.98] relative overflow-hidden"
                style={{
                  background: selected === "b" ? "rgba(192,132,252,0.15)" : "rgba(255,255,255,.03)",
                  border: `2px solid ${selected === "b" ? "rgba(192,132,252,0.4)" : selected === "a" ? "rgba(255,255,255,.03)" : "rgba(255,255,255,.06)"}`,
                }}>
                {selected && <div className="absolute left-0 top-0 bottom-0 rounded-2xl transition-all duration-700" style={{ width: `${pctB}%`, background: "rgba(192,132,252,0.08)" }} />}
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black" style={{ color: "#c084fc" }}>B</span>
                    <span className="text-[14px] font-medium">{q.b}</span>
                  </div>
                  {selected && <span className="text-[14px] font-black tabular-nums" style={{ color: "#c084fc" }}>{pctB}%</span>}
                </div>
              </button>
            </div>

            {/* Next button */}
            {selected && (
              <button onClick={next} className="w-full mt-5 rounded-2xl py-4 font-bold text-[14px] transition-all active:scale-[0.97]" style={{ background: "linear-gradient(135deg, #f472b6, #c084fc)", boxShadow: "0 8px 25px rgba(192,132,252,0.2)" }}>
                {current + 1 >= QUESTIONS.length ? "결과 보기" : "다음 질문 →"}
              </button>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-xl font-black mb-2">{QUESTIONS.length}문제 완료!</h2>
            <p className="text-[13px] mb-6" style={{ color: "rgba(255,255,255,.3)" }}>A를 {history.filter((h) => h.side === "a").length}번, B를 {history.filter((h) => h.side === "b").length}번 선택했어요</p>

            <div className="space-y-2 mb-6 max-h-[300px] overflow-y-auto">
              {history.map((h, i) => (
                <div key={i} className="flex items-center gap-2 text-[12px] rounded-xl p-2.5" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)" }}>
                  <span className="font-black" style={{ color: h.side === "a" ? "#f472b6" : "#c084fc" }}>{h.side.toUpperCase()}</span>
                  <span style={{ color: "rgba(255,255,255,.35)" }}>{h.side === "a" ? QUESTIONS[h.q].a : QUESTIONS[h.q].b}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={restart} className="flex-1 py-3 rounded-2xl text-[13px] font-semibold transition-all active:scale-95" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", color: "rgba(255,255,255,.4)" }}>다시하기</button>
              <button onClick={share} className="flex-1 py-3 rounded-2xl text-[13px] font-semibold transition-all active:scale-95" style={{ background: "linear-gradient(135deg, #f472b6, #c084fc)" }}>공유하기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
