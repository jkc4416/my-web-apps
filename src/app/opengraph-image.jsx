import { ImageResponse } from "next/og";

export const alt = "FunAppBox — 무료 온라인 도구 & 게임 모음";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0c0618 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "sans-serif",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 140, marginBottom: 20 }}>🎮 🎨 🔮</div>
        <div
          style={{
            fontSize: 92,
            fontWeight: 900,
            letterSpacing: -2,
            background: "linear-gradient(135deg, #c084fc, #f472b6, #fbbf24)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: 20,
          }}
        >
          FunAppBox
        </div>
        <div style={{ fontSize: 40, color: "rgba(255,255,255,0.7)", textAlign: "center" }}>
          무료 온라인 도구 &amp; 게임 27종
        </div>
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.4)", marginTop: 24 }}>
          이름궁합 · MBTI · 사주 · 햄스터 · 플래피버드 · 2048 · …
        </div>
        <div style={{ fontSize: 22, color: "rgba(255,255,255,0.3)", marginTop: 50, letterSpacing: 4 }}>
          WWW.FUNAPPBOX.COM
        </div>
      </div>
    ),
    size
  );
}
