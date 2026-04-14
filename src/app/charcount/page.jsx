"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function CharCountPage() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split("\n").length : 0;
    const sentences = text.trim() ? text.split(/[.!?。]+/).filter((s) => s.trim()).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
    const bytes = new Blob([text]).size;
    const korean = (text.match(/[가-힣ㄱ-ㅎㅏ-ㅣ]/g) || []).length;
    const english = (text.match(/[a-zA-Z]/g) || []).length;
    const numbers = (text.match(/[0-9]/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    const special = chars - korean - english - numbers - spaces;
    const readingTime = Math.max(1, Math.ceil(words / 200)); // ~200 words/min
    return { chars, charsNoSpace, words, lines, sentences, paragraphs, bytes, korean, english, numbers, spaces, special, readingTime };
  }, [text]);

  const clear = () => setText("");

  return (
    <div className="min-h-screen text-white" style={{ background: "radial-gradient(ellipse at 50% 0%, #0a1620 0%, #060e14 40%, #03080c 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{ color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(12px)" }}>← 홈</Link>

      <div className="max-w-[500px] mx-auto px-5 pb-16">
        <header className="pt-16 pb-6 text-center">
          <div className="text-4xl mb-3">📝</div>
          <h1 className="text-2xl font-black" style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>글자수 세기</h1>
          <p className="text-[11px] mt-2" style={{ color: "rgba(255,255,255,.25)" }}>실시간으로 글자수, 단어수, 바이트를 세어드립니다</p>
        </header>

        {/* Main counter */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "글자 (공백 포함)", value: stats.chars, color: "#38bdf8" },
            { label: "글자 (공백 제외)", value: stats.charsNoSpace, color: "#818cf8" },
            { label: "바이트 (Bytes)", value: stats.bytes, color: "#a78bfa" },
          ].map((s) => (
            <div key={s.label} className="text-center p-3 rounded-2xl" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
              <div className="text-2xl font-black tabular-nums" style={{ color: s.color }}>{s.value.toLocaleString()}</div>
              <div className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,.2)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Textarea */}
        <div className="relative mb-4">
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="여기에 텍스트를 입력하거나 붙여넣으세요..." rows={8} aria-label="텍스트 입력"
            className="w-full rounded-2xl px-5 py-4 text-[14px] resize-y outline-none leading-relaxed"
            style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", color: "#e2e8f0", minHeight: 160 }}
            onFocus={(e) => e.target.style.borderColor = "rgba(56,189,248,.3)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,.06)"} />
          {text && (
            <button onClick={clear} className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] transition-all active:scale-95" style={{ background: "rgba(255,255,255,.05)", color: "rgba(255,255,255,.3)" }}>지우기</button>
          )}
        </div>

        {/* Detail stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: "단어 수", value: stats.words, emoji: "📖" },
            { label: "문장 수", value: stats.sentences, emoji: "💬" },
            { label: "줄 수", value: stats.lines, emoji: "📄" },
            { label: "문단 수", value: stats.paragraphs, emoji: "📑" },
            { label: "예상 읽기 시간", value: `${stats.readingTime}분`, emoji: "⏱️" },
            { label: "공백 수", value: stats.spaces, emoji: "⬜" },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)" }}>
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,.3)" }}>{s.emoji} {s.label}</span>
              <span className="text-[13px] font-bold tabular-nums" style={{ color: "rgba(255,255,255,.5)" }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* Character breakdown */}
        {text.length > 0 && (
          <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)" }}>
            <h3 className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,.15)" }}>문자 구성</h3>
            <div className="space-y-2">
              {[
                { label: "한글", value: stats.korean, color: "#38bdf8" },
                { label: "영문", value: stats.english, color: "#34d399" },
                { label: "숫자", value: stats.numbers, color: "#fbbf24" },
                { label: "특수문자", value: stats.special, color: "#f472b6" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span style={{ color: "rgba(255,255,255,.3)" }}>{s.label}</span>
                    <span className="font-bold tabular-nums" style={{ color: s.color }}>{s.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.04)" }}>
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${stats.charsNoSpace > 0 ? (s.value / stats.charsNoSpace) * 100 : 0}%`, background: s.color, opacity: 0.6 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
