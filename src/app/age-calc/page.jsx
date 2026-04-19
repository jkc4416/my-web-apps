"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const 별자리 = [
  { name: "물병자리", emoji: "♒", start: [1, 20], end: [2, 18] },
  { name: "물고기자리", emoji: "♓", start: [2, 19], end: [3, 20] },
  { name: "양자리", emoji: "♈", start: [3, 21], end: [4, 19] },
  { name: "황소자리", emoji: "♉", start: [4, 20], end: [5, 20] },
  { name: "쌍둥이자리", emoji: "♊", start: [5, 21], end: [6, 21] },
  { name: "게자리", emoji: "♋", start: [6, 22], end: [7, 22] },
  { name: "사자자리", emoji: "♌", start: [7, 23], end: [8, 22] },
  { name: "처녀자리", emoji: "♍", start: [8, 23], end: [9, 22] },
  { name: "천칭자리", emoji: "♎", start: [9, 23], end: [10, 23] },
  { name: "전갈자리", emoji: "♏", start: [10, 24], end: [11, 22] },
  { name: "사수자리", emoji: "♐", start: [11, 23], end: [12, 21] },
  { name: "염소자리", emoji: "♑", start: [12, 22], end: [1, 19] },
];

const 띠이름 = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];
const 띠이모지 = ["🐭", "🐮", "🐯", "🐰", "🐲", "🐍", "🐴", "🐑", "🐵", "🐔", "🐶", "🐷"];

function getZodiac(month, day) {
  for (const z of 별자리) {
    const [sm, sd] = z.start, [em, ed] = z.end;
    if (sm <= em) { if ((month === sm && day >= sd) || (month === em && day <= ed) || (month > sm && month < em)) return z; }
    else { if ((month === sm && day >= sd) || (month === em && day <= ed) || month > sm || month < em) return z; }
  }
  return 별자리[11];
}

export default function AgeCalcPage() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const result = useMemo(() => {
    const y = parseInt(year), m = parseInt(month), d = parseInt(day);
    if (isNaN(y) || isNaN(m) || isNaN(d) || y < 1900 || y > new Date().getFullYear() || m < 1 || m > 12 || d < 1 || d > 31) return null;

    const today = new Date();
    const birth = new Date(y, m - 1, d);
    // Validate actual date (catches Feb 30, etc.)
    if (birth.getFullYear() !== y || birth.getMonth() !== m - 1 || birth.getDate() !== d) return null;
    if (birth > today) return null;

    // 만 나이
    let age = today.getFullYear() - y;
    if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) age--;

    // 한국 나이 (2023년 폐지, 참고용)
    const koreanAge = today.getFullYear() - y + 1;

    // 다음 생일까지
    let nextBday = new Date(today.getFullYear(), m - 1, d);
    if (nextBday <= today) nextBday = new Date(today.getFullYear() + 1, m - 1, d);
    const daysUntilBday = Math.ceil((nextBday - today) / 86400000);

    // 살아온 일수
    const daysLived = Math.floor((today - birth) / 86400000);

    // 띠
    const 띠idx = (y - 4) % 12;
    const 띠 = { name: 띠이름[띠idx < 0 ? 띠idx + 12 : 띠idx], emoji: 띠이모지[띠idx < 0 ? 띠idx + 12 : 띠idx] };

    // 별자리
    const zodiac = getZodiac(m, d);

    // 탄생석
    const birthstones = ["가넷", "자수정", "아쿠아마린", "다이아몬드", "에메랄드", "진주", "루비", "페리도트", "사파이어", "오팔", "토파즈", "터키석"];
    const birthstone = birthstones[m - 1];

    // 요일
    const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const birthDay = dayNames[birth.getDay()];

    return { age, koreanAge, daysUntilBday, daysLived, 띠, zodiac, birthstone, birthDay };
  }, [year, month, day]);

  return (
    <div className="min-h-screen text-white" style={{ background: "radial-gradient(ellipse at 50% 0%, #1a0e1e 0%, #0c0612 40%, #060308 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{ color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(12px)" }}>← 홈</Link>

      <div className="max-w-[440px] mx-auto px-5 pb-16">
        <header className="pt-16 pb-6 text-center">
          <div className="text-4xl mb-3">🎂</div>
          <h1 className="text-2xl font-black" style={{ background: "linear-gradient(135deg, #f472b6, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>나이 계산기</h1>
          <p className="text-[11px] mt-2" style={{ color: "rgba(255,255,255,.25)" }}>만 나이, 띠, 별자리, 다음 생일까지 한번에</p>
        </header>

        <div className="rounded-2xl p-5 mb-4" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <input type="number" placeholder="년" value={year} onChange={(e) => setYear(e.target.value)} inputMode="numeric" aria-label="년"
                className="w-full rounded-xl px-3 py-3 text-center text-[15px] font-bold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)", color: "#e2e8f0" }} />
              <span className="block text-center text-[9px] mt-1" style={{ color: "rgba(255,255,255,.15)" }}>년</span>
            </div>
            <div>
              <input type="number" placeholder="월" value={month} onChange={(e) => setMonth(e.target.value)} inputMode="numeric" aria-label="월"
                className="w-full rounded-xl px-3 py-3 text-center text-[15px] font-bold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)", color: "#e2e8f0" }} />
              <span className="block text-center text-[9px] mt-1" style={{ color: "rgba(255,255,255,.15)" }}>월</span>
            </div>
            <div>
              <input type="number" placeholder="일" value={day} onChange={(e) => setDay(e.target.value)} inputMode="numeric" aria-label="일"
                className="w-full rounded-xl px-3 py-3 text-center text-[15px] font-bold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)", color: "#e2e8f0" }} />
              <span className="block text-center text-[9px] mt-1" style={{ color: "rgba(255,255,255,.15)" }}>일</span>
            </div>
          </div>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="rounded-2xl p-6 text-center" style={{ background: "linear-gradient(135deg, rgba(244,114,182,0.08), rgba(167,139,250,0.08))", border: "1px solid rgba(244,114,182,0.12)" }}>
              <div className="text-[11px] mb-1" style={{ color: "rgba(255,255,255,.25)" }}>만 나이</div>
              <div className="text-5xl font-black" style={{ color: "#f472b6" }}>{result.age}세</div>
              <div className="text-[11px] mt-2" style={{ color: "rgba(255,255,255,.2)" }}>(한국 나이 {result.koreanAge}세 · 태어난 {result.birthDay})</div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-2xl p-4 text-center" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
                <div className="text-3xl mb-1">{result.띠.emoji}</div>
                <div className="text-[13px] font-bold">{result.띠.name}띠</div>
              </div>
              <div className="rounded-2xl p-4 text-center" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
                <div className="text-3xl mb-1">{result.zodiac.emoji}</div>
                <div className="text-[13px] font-bold">{result.zodiac.name}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "다음 생일까지", value: `${result.daysUntilBday}일`, color: "#fbbf24" },
                { label: "살아온 일수", value: `${result.daysLived.toLocaleString()}일`, color: "#34d399" },
                { label: "탄생석", value: result.birthstone, color: "#a78bfa" },
              ].map((s) => (
                <div key={s.label} className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)" }}>
                  <div className="text-[15px] font-black" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,.15)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
