import Link from "next/link";

// Renders a rich SEO/AdSense content block to be placed at the bottom of each app page.
// Each app passes a content object with intro/features/howto/tips/faq/related fields.
export default function AppContent({
  appId,
  title,
  intro,
  features = [],
  howto = [],
  tips = [],
  faq = [],
  related = [],
}) {
  return (
    <section
      aria-label={`${title} 사용 가이드`}
      style={{
        maxWidth: 720,
        margin: "32px auto 0",
        padding: "0 20px",
        color: "rgba(255,255,255,0.7)",
        fontFamily:
          "'Pretendard Variable','Pretendard',-apple-system,sans-serif",
      }}
    >
      <article
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 16,
          padding: "24px 22px",
          fontSize: 13,
          lineHeight: 1.8,
        }}
      >
        {intro && (
          <Block title={`${title}란?`}>
            <p style={{ whiteSpace: "pre-line" }}>{intro}</p>
          </Block>
        )}

        {features.length > 0 && (
          <Block title="주요 기능">
            <ul style={listStyle}>
              {features.map((f, i) => (
                <li key={i}>
                  <strong>{f.title}</strong>
                  {f.desc ? ` — ${f.desc}` : ""}
                </li>
              ))}
            </ul>
          </Block>
        )}

        {howto.length > 0 && (
          <Block title="사용 방법">
            <ol style={{ ...listStyle, listStyle: "decimal" }}>
              {howto.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ol>
          </Block>
        )}

        {tips.length > 0 && (
          <Block title="활용 팁">
            <ul style={listStyle}>
              {tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </Block>
        )}

        {faq.length > 0 && (
          <Block title="자주 묻는 질문">
            {faq.map((item, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div
                  style={{
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.85)",
                    marginBottom: 4,
                  }}
                >
                  Q. {item.q}
                </div>
                <div style={{ color: "rgba(255,255,255,0.6)" }}>{item.a}</div>
              </div>
            ))}
          </Block>
        )}

        {related.length > 0 && (
          <Block title="관련 도구">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.7)",
                    fontSize: 12,
                    textDecoration: "none",
                  }}
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </Block>
        )}
      </article>

      {/* JSON-LD for FAQ schema (boosts SEO + AdSense valuable content signal) */}
      {faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faq.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.a,
                },
              })),
            }),
          }}
        />
      )}
    </section>
  );
}

const listStyle = {
  listStyle: "disc",
  paddingLeft: 20,
  margin: 0,
};

function Block({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h2
        style={{
          fontSize: 17,
          fontWeight: 800,
          color: "rgba(255,255,255,0.92)",
          marginBottom: 10,
          paddingBottom: 6,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {title}
      </h2>
      <div>{children}</div>
    </div>
  );
}
