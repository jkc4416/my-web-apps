import Link from "next/link";

export default function BlogArticle({ post, children }) {
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
        <nav style={{ marginBottom: 24, fontSize: 12 }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>
            ← 홈
          </Link>
          <span style={{ color: "rgba(255,255,255,0.2)", margin: "0 8px" }}>/</span>
          <Link href="/blog" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
            블로그
          </Link>
        </nav>

        <article>
          <header style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>
              <span>{post.category}</span>
              <span style={{ margin: "0 8px", color: "rgba(255,255,255,0.2)" }}>·</span>
              <span>{post.date}</span>
            </div>
            <h1
              style={{
                fontSize: 30,
                fontWeight: 900,
                lineHeight: 1.25,
                marginBottom: 12,
                color: "rgba(255,255,255,0.95)",
              }}
            >
              {post.title}
            </h1>
            <p style={{ fontSize: 15, lineHeight: 1.65, color: "rgba(255,255,255,0.55)" }}>
              {post.excerpt}
            </p>
          </header>

          <div
            style={{
              fontSize: 14.5,
              lineHeight: 1.85,
              color: "rgba(255,255,255,0.72)",
            }}
          >
            {children}
          </div>

          {post.relatedApp && (
            <aside
              style={{
                marginTop: 40,
                padding: 20,
                background: "rgba(168,85,247,0.08)",
                border: "1px solid rgba(168,85,247,0.18)",
                borderRadius: 16,
              }}
            >
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
                🛠️ 이 글과 관련된 도구
              </div>
              <Link
                href={post.relatedApp}
                style={{
                  display: "inline-block",
                  padding: "10px 18px",
                  background: "linear-gradient(135deg, #a855f7, #ec4899)",
                  color: "#fff",
                  borderRadius: 999,
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                바로 사용해보기 →
              </Link>
            </aside>
          )}

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <Link
              href="/blog"
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 13,
                textDecoration: "none",
              }}
            >
              ← 다른 글 더 보기
            </Link>
          </div>
        </article>

        {/* JSON-LD: Article schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: post.title,
              description: post.excerpt,
              datePublished: post.date,
              author: { "@type": "Organization", name: "FunAppBox" },
              publisher: {
                "@type": "Organization",
                name: "FunAppBox",
                url: "https://www.funappbox.com",
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://www.funappbox.com/blog/${post.slug}`,
              },
            }),
          }}
        />
      </div>
    </main>
  );
}

export const articleStyles = {
  h2: {
    fontSize: 22,
    fontWeight: 800,
    marginTop: 32,
    marginBottom: 14,
    color: "rgba(255,255,255,0.92)",
    paddingBottom: 8,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  h3: {
    fontSize: 17,
    fontWeight: 700,
    marginTop: 22,
    marginBottom: 10,
    color: "rgba(255,255,255,0.88)",
  },
  p: { marginBottom: 14 },
  ul: { paddingLeft: 22, listStyle: "disc", marginBottom: 14 },
  li: { marginBottom: 6 },
  strong: { color: "rgba(255,255,255,0.92)", fontWeight: 700 },
  code: {
    background: "rgba(255,255,255,0.06)",
    padding: "2px 6px",
    borderRadius: 4,
    fontFamily: "ui-monospace, 'SF Mono', monospace",
    fontSize: 13,
    color: "#fbbf24",
  },
  blockquote: {
    borderLeft: "3px solid rgba(168,85,247,0.5)",
    paddingLeft: 16,
    margin: "16px 0",
    color: "rgba(255,255,255,0.6)",
    fontStyle: "italic",
  },
};
