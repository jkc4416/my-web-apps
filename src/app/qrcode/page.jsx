"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

// Simple QR code generator using Canvas — supports alphanumeric up to ~100 chars
// Uses Google Charts API for QR generation via image load
const QR_API = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=";

export default function QRCodePage() {
  const [input, setInput] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const imgRef = useRef(null);

  useEffect(() => {
    try { const saved = localStorage.getItem("qr-history"); if (saved) setHistory(JSON.parse(saved)); } catch {}
  }, []);

  const generate = useCallback(() => {
    if (!input.trim()) return;
    setGenerating(true);
    const encoded = encodeURIComponent(input.trim());
    const url = `${QR_API}${encoded}`;
    setQrUrl(url);
    setGenerating(false);
    setHistory((h) => {
      const next = [{ text: input.trim(), date: new Date().toLocaleDateString("ko-KR") }, ...h.filter((x) => x.text !== input.trim())].slice(0, 10);
      try { localStorage.setItem("qr-history", JSON.stringify(next)); } catch {}
      return next;
    });
  }, [input]);

  const download = useCallback(() => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `qr-${Date.now()}.png`;
    a.target = "_blank";
    a.click();
  }, [qrUrl]);

  const copyUrl = useCallback(() => {
    if (!input.trim()) return;
    try { navigator.clipboard.writeText(input.trim()); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [input]);

  const presets = [
    { label: "내 Wi-Fi", template: "WIFI:T:WPA;S:네트워크이름;P:비밀번호;;" },
    { label: "전화번호", template: "tel:010-0000-0000" },
    { label: "이메일", template: "mailto:example@email.com" },
  ];

  return (
    <div className="min-h-screen text-white" style={{ background: "radial-gradient(ellipse at 50% 0%, #0a1828 0%, #060e18 40%, #030810 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{ color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(12px)" }}>← 홈</Link>

      <div className="max-w-[440px] mx-auto px-5 pb-16">
        <header className="pt-16 pb-6 text-center">
          <div className="text-4xl mb-3">📱</div>
          <h1 className="text-2xl font-black" style={{ background: "linear-gradient(135deg, #60a5fa, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>QR코드 생성기</h1>
          <p className="text-[11px] mt-2" style={{ color: "rgba(255,255,255,.25)" }}>텍스트, URL, Wi-Fi 정보를 QR코드로 변환</p>
        </header>

        {/* Input */}
        <div className="rounded-2xl p-5 mb-4" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="URL, 텍스트, 전화번호 등을 입력하세요" rows={3} aria-label="QR코드 내용"
            className="w-full rounded-xl px-4 py-3 text-[14px] resize-none outline-none" style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)", color: "#e2e8f0" }}
            onFocus={(e) => e.target.style.borderColor = "rgba(96,165,250,.3)"} onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,.06)"} />
          <div className="flex gap-1.5 mt-2 overflow-x-auto">
            {presets.map((p) => (
              <button key={p.label} onClick={() => setInput(p.template)} className="flex-shrink-0 px-2.5 py-1 rounded-lg text-[10px] transition-all active:scale-95" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", color: "rgba(255,255,255,.3)" }}>
                {p.label}
              </button>
            ))}
          </div>
          <button onClick={generate} disabled={!input.trim() || generating}
            className="w-full mt-3 py-3.5 rounded-2xl font-bold text-[14px] transition-all active:scale-[0.97] disabled:opacity-30"
            style={{ background: "linear-gradient(135deg, #60a5fa, #34d399)", boxShadow: "0 8px 25px rgba(96,165,250,0.2)" }}>
            {generating ? "생성 중..." : "QR코드 생성"}
          </button>
        </div>

        {/* QR Result */}
        {qrUrl && (
          <div className="rounded-2xl p-6 mb-4 text-center" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}>
            <div className="bg-white rounded-xl p-4 inline-block mb-4">
              <img ref={imgRef} src={qrUrl} alt="QR Code" width={200} height={200} className="block" onError={(e) => { e.target.style.display = "none"; }} />
            </div>
            <div className="text-[11px] mb-4 px-4 truncate" style={{ color: "rgba(255,255,255,.25)" }}>{input}</div>
            <div className="flex gap-2">
              <button onClick={download} className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold transition-all active:scale-95" style={{ background: "linear-gradient(135deg, #60a5fa, #34d399)" }}>📥 다운로드</button>
              <button onClick={copyUrl} className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold transition-all active:scale-95" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", color: "rgba(255,255,255,.4)" }}>
                {copied ? "✓ 복사됨" : "📋 텍스트 복사"}
              </button>
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)" }}>
            <h3 className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,.15)" }}>최근 생성</h3>
            <div className="space-y-1.5">
              {history.map((h, i) => (
                <button key={i} onClick={() => { setInput(h.text); }} className="w-full text-left px-3 py-2 rounded-lg text-[12px] truncate transition-all hover:bg-white/[0.03]" style={{ color: "rgba(255,255,255,.3)" }}>
                  {h.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
