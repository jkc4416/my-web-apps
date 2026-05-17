import Link from "next/link";

export default function AboutPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 50% 0%, #1e1b4b 0%, #0c0a1f 40%, #050410 100%)",
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
            fontSize: 32,
            fontWeight: 900,
            marginBottom: 8,
            background: "linear-gradient(135deg, #a78bfa, #f472b6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          FunAppBox 소개
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 36 }}>
          27가지 무료 온라인 도구와 미니 게임을 한 곳에서.
        </p>

        <Section title="우리의 미션">
          <p>
            <strong>FunAppBox</strong>는 일상에서 자주 필요한 작은 도구와
            짧은 시간 즐길 수 있는 미니 게임을 <strong>설치 없이 브라우저에서 바로</strong>{" "}
            사용할 수 있도록 모아둔 사이트입니다. 회원가입이나 결제 없이
            누구나 무료로 사용할 수 있으며, 데이터는 사용자의 브라우저에만
            저장되어 외부로 전송되지 않습니다.
          </p>
        </Section>

        <Section title="만든 이유">
          <p>
            계산기, 단위 변환기, 비밀번호 생성기, 색상 도구처럼 자주 쓰는
            도구를 매번 다른 사이트에서 찾는 번거로움을 줄이고 싶었습니다.
            동시에 짧은 휴식 시간에 부담 없이 즐길 수 있는 워들, 2048,
            지뢰찾기, 플래피버드 같은 캐주얼 게임을 한 곳에 모았습니다.
          </p>
          <p style={{ marginTop: 12 }}>
            모든 도구와 게임은 <strong>가벼우면서도 한국어 사용자에게 최적화</strong>되어
            있습니다. 한글 워들, 한국식 사주팔자, 한국식 만 나이 계산기,
            한국 맞춤법 퀴즈 등 한국어 사용자에게 필요한 기능을 직접
            구현했습니다.
          </p>
        </Section>

        <Section title="운영 원칙">
          <ul style={{ listStyle: "disc", paddingLeft: 20, lineHeight: 1.9 }}>
            <li>
              <strong>완전 무료:</strong> 모든 도구·게임은 영구 무료이며,
              회원가입이 필요하지 않습니다.
            </li>
            <li>
              <strong>설치 불필요:</strong> 모든 기능은 웹브라우저에서
              즉시 실행됩니다. 모바일·PC 모두 지원합니다.
            </li>
            <li>
              <strong>프라이버시 우선:</strong> 사용자 데이터(게임 기록,
              설정 등)는 사용자의 브라우저(localStorage)에만 저장됩니다.
              서버로 전송되지 않습니다.
            </li>
            <li>
              <strong>오프라인 가능:</strong> 대부분의 도구·게임은 첫 로딩
              이후 인터넷 연결 없이도 동작합니다.
            </li>
            <li>
              <strong>지속적 개선:</strong> 사용자 피드백을 받아 매주
              버그 수정과 기능 개선을 진행합니다.
            </li>
          </ul>
        </Section>

        <Section title="어떤 도구·게임이 있나요?">
          <p>현재 27개의 앱이 4개 카테고리로 제공됩니다:</p>
          <ul style={{ listStyle: "disc", paddingLeft: 20, lineHeight: 1.9, marginTop: 8 }}>
            <li>
              <strong>실용 도구 (10개):</strong> 만능 계산기, 단위 변환,
              나이 계산기, 디데이, 비밀번호 생성기, QR코드, 글자수 세기,
              색상 도구, 메뉴 추천, 집중 사운드
            </li>
            <li>
              <strong>테스트·점술 (8개):</strong> 이름 궁합, MBTI,
              동물 성격, 전생 테스트, 오늘의 운세(사주), 연애 타로,
              밸런스 게임, 맞춤법 퀴즈
            </li>
            <li>
              <strong>미니 게임 (8개):</strong> 한글 워들, 지뢰찾기,
              2048, 틱택토, 스네이크, 플래피버드, 햄스터 키우기,
              타이핑 챌린지
            </li>
            <li>
              <strong>기타 (1개):</strong> 투자 시뮬레이터
            </li>
          </ul>
        </Section>

        <Section title="기술 정보">
          <p>
            FunAppBox는 Next.js 15와 React 19로 제작되었으며, Vercel에서
            호스팅됩니다. 모든 페이지는 정적 사전 렌더링(SSG)되어 빠른
            로딩 속도를 제공합니다. 광고는 Google AdSense로 운영되며,
            사이트 운영 비용을 충당합니다.
          </p>
        </Section>

        <Section title="문의·제안">
          <p>
            새로운 도구 제안, 버그 신고, 광고 문의는{" "}
            <Link
              href="/contact"
              style={{ color: "#a78bfa", textDecoration: "underline" }}
            >
              문의 페이지
            </Link>
            를 통해 보내주세요.
          </p>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: "rgba(255,255,255,0.95)",
          marginBottom: 12,
          paddingBottom: 8,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontSize: 14,
          lineHeight: 1.8,
          color: "rgba(255,255,255,0.7)",
        }}
      >
        {children}
      </div>
    </section>
  );
}
