import Link from "next/link";
import { POSTS } from "./posts";

export default function BlogIndex() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 50% 0%, #1a1530 0%, #0a0815 40%, #050308 100%)",
        color: "rgba(255,255,255,0.85)",
        fontFamily:
          "'Pretendard Variable','Pretendard',-apple-system,sans-serif",
        padding: "60px 20px 40px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <Link
          href="/"
          style={{
            display: "inline-block",
            color: "rgba(255,255,255,0.4)",
            fontSize: 12,
            textDecoration: "none",
            marginBottom: 20,
          }}
        >
          ← 홈으로
        </Link>

        <h1
          style={{
            fontSize: 36,
            fontWeight: 900,
            marginBottom: 8,
            background: "linear-gradient(135deg, #a78bfa, #f472b6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          블로그
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 14,
            marginBottom: 36,
            lineHeight: 1.7,
          }}
        >
          FunAppBox의 도구를 더 깊이 활용할 수 있는 가이드와 인사이트.
          MBTI·사주·맞춤법·투자 등 각 분야의 입문서를 정리했습니다.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{
                display: "block",
                padding: 20,
                borderRadius: 16,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.4)",
                  marginBottom: 6,
                }}
              >
                <span>{post.emoji}</span>
                <span style={{ marginLeft: 6 }}>{post.category}</span>
                <span style={{ margin: "0 8px", color: "rgba(255,255,255,0.2)" }}>·</span>
                <span>{post.date}</span>
              </div>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.92)",
                  marginBottom: 6,
                  lineHeight: 1.35,
                }}
              >
                {post.title}
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "rgba(255,255,255,0.5)",
                  lineHeight: 1.65,
                }}
              >
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
