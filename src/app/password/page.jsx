"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

function generatePassword(length, options) {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let chars = "";
  if (options.lower) chars += lower;
  if (options.upper) chars += upper;
  if (options.numbers) chars += numbers;
  if (options.symbols) chars += symbols;
  if (!chars) chars = lower + numbers;

  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (v) => chars[v % chars.length]).join("");
}

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  if (score <= 2) return { label: "약함", color: "#ef4444", pct: 25 };
  if (score <= 3) return { label: "보통", color: "#f97316", pct: 50 };
  if (score <= 4) return { label: "강함", color: "#fbbf24", pct: 75 };
  return { label: "매우 강함", color: "#4ade80", pct: 100 };
}

export default function PasswordPage() {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({ lower: true, upper: true, numbers: true, symbols: true });
  const [password, setPassword] = useState(() => generatePassword(16, { lower: true, upper: true, numbers: true, symbols: true }));
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);

  const generate = useCallback(() => {
    const pw = generatePassword(length, options);
    setPassword(pw);
    setCopied(false);
    setHistory((h) => [pw, ...h].slice(0, 10));
  }, [length, options]);

  const copy = useCallback(() => {
    try { navigator.clipboard.writeText(password); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  const strength = getStrength(password);

  const toggleOption = (key) => {
    const next = { ...options, [key]: !options[key] };
    if (!next.lower && !next.upper && !next.numbers && !next.symbols) return;
    setOptions(next);
  };

  return (
    <div className="min-h-screen text-white" style={{ background: "radial-gradient(ellipse at 50% 0%, #0a1a18 0%, #060e0c 40%, #030806 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{ color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(12px)" }}>← 홈</Link>

      <div className="max-w-[440px] mx-auto px-5 pb-16">
        <header className="pt-16 pb-6 text-center">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-2xl font-black" style={{ background: "linear-gradient(135deg, #4ade80, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>비밀번호 생성기</h1>
          <p className="text-[11px] mt-2" style={{ color: "rgba(255,255,255,.25)" }}>안전한 랜덤 비밀번호를 즉시 생성</p>
        </header>

        {/* Password display */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
          <div className="font-mono text-[18px] font-bold text-center py-3 px-2 rounded-xl mb-3 break-all leading-relaxed select-all" style={{ background: "rgba(0,0,0,.3)", color: "#e2e8f0", letterSpacing: 1 }}>{password}</div>

          {/* Strength */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.04)" }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${strength.pct}%`, background: strength.color }} />
            </div>
            <span className="text-[11px] font-bold" style={{ color: strength.color }}>{strength.label}</span>
          </div>

          <div className="flex gap-2">
            <button onClick={copy} className="flex-1 py-3 rounded-xl font-bold text-[13px] transition-all active:scale-95" style={{ background: "linear-gradient(135deg, #4ade80, #22d3ee)" }}>
              {copied ? "✓ 복사됨" : "📋 복사하기"}
            </button>
            <button onClick={generate} className="flex-1 py-3 rounded-xl font-bold text-[13px] transition-all active:scale-95" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", color: "rgba(255,255,255,.4)" }}>
              🔄 재생성
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)" }}>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px]" style={{ color: "rgba(255,255,255,.3)" }}>길이</span>
              <span className="text-[14px] font-black tabular-nums" style={{ color: "#4ade80" }}>{length}</span>
            </div>
            <input type="range" min={4} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-emerald-400" />
            <div className="flex justify-between text-[9px] mt-1" style={{ color: "rgba(255,255,255,.1)" }}><span>4</span><span>64</span></div>
          </div>

          <div className="space-y-2">
            {[
              { key: "lower", label: "소문자 (a-z)" },
              { key: "upper", label: "대문자 (A-Z)" },
              { key: "numbers", label: "숫자 (0-9)" },
              { key: "symbols", label: "특수문자 (!@#$%)" },
            ].map((opt) => (
              <button key={opt.key} onClick={() => toggleOption(opt.key)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[12px] transition-all"
                style={{ background: options[opt.key] ? "rgba(74,222,128,0.06)" : "rgba(255,255,255,.01)", border: `1px solid ${options[opt.key] ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,.04)"}`, color: options[opt.key] ? "#4ade80" : "rgba(255,255,255,.25)" }}>
                <span>{opt.label}</span>
                <span>{options[opt.key] ? "✓" : "✕"}</span>
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)" }}>
            <h3 className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,.12)" }}>최근 생성</h3>
            <div className="space-y-1">
              {history.slice(0, 5).map((pw, i) => (
                <button key={i} onClick={() => { setPassword(pw); setCopied(false); }}
                  className="w-full text-left font-mono text-[11px] px-2 py-1.5 rounded-lg truncate transition-all hover:bg-white/[0.03]" style={{ color: "rgba(255,255,255,.2)" }}>
                  {pw}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
