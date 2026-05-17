import Link from "next/link";

const LINKS = [
  { href: "/about", label: "소개" },
  { href: "/blog", label: "블로그" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/terms", label: "이용약관" },
  { href: "/contact", label: "문의" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        marginTop: 48,
        padding: "32px 20px 40px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(0,0,0,0.2)",
        color: "rgba(255,255,255,0.4)",
        fontFamily:
          "'Pretendard Variable','Pretendard',-apple-system,sans-serif",
        fontSize: 12,
        textAlign: "center",
      }}
    >
      <nav
        aria-label="사이트 정보"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "center",
          marginBottom: 14,
        }}
      >
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              color: "rgba(255,255,255,0.5)",
              textDecoration: "none",
            }}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div style={{ color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>
        © {year} FunAppBox. 27가지 무료 온라인 도구·게임을 한 곳에서.
      </div>
      <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 11 }}>
        funappbox.com — 설치 없이 브라우저에서 바로 사용하는 무료 웹 도구
      </div>
    </footer>
  );
}
