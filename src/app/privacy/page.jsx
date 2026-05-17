import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 50% 0%, #0f172a 0%, #060a17 40%, #03060d 100%)",
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
            color: "rgba(255,255,255,0.95)",
          }}
        >
          개인정보처리방침
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 36 }}>
          최종 업데이트: 2026년 5월 17일
        </p>

        <Section title="1. 개요">
          <p>
            FunAppBox(www.funappbox.com, 이하 "본 사이트")는 사용자의
            개인정보를 매우 중요하게 생각합니다. 본 개인정보처리방침은 본
            사이트가 수집하는 정보의 종류, 사용 목적, 보호 방법을
            설명합니다.
          </p>
          <p style={{ marginTop: 10 }}>
            본 사이트는 <strong>회원가입을 요구하지 않으며,
            사용자로부터 이름·이메일·전화번호 등의 개인정보를 직접
            수집하지 않습니다.</strong>
          </p>
        </Section>

        <Section title="2. 수집하는 정보">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 8, marginBottom: 6 }}>
            가. 사용자가 직접 입력하는 정보
          </h3>
          <p>
            계산기, 이름궁합, 사주 등에서 사용자가 입력하는 정보(이름,
            생년월일 등)는 <strong>오직 사용자의 브라우저(localStorage)에만
            저장</strong>되며, 본 사이트 서버나 외부로 전송되지 않습니다.
            브라우저 데이터를 삭제하면 함께 사라집니다.
          </p>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 16, marginBottom: 6 }}>
            나. 자동으로 수집되는 정보
          </h3>
          <p>본 사이트는 다음 정보를 자동으로 수집합니다:</p>
          <ul style={{ listStyle: "disc", paddingLeft: 20, lineHeight: 1.9, marginTop: 6 }}>
            <li>방문 기록(페이지 URL, 방문 시간, 체류 시간)</li>
            <li>기기 정보(브라우저 종류, OS, 화면 크기)</li>
            <li>IP 주소(국가·도시 단위 통계 목적)</li>
            <li>유입 경로(검색어, 추천 사이트)</li>
          </ul>
        </Section>

        <Section title="3. 정보 사용 목적">
          <ul style={{ listStyle: "disc", paddingLeft: 20, lineHeight: 1.9 }}>
            <li>서비스 제공 및 개선</li>
            <li>사이트 이용 통계 분석</li>
            <li>광고 게재 및 효과 측정</li>
            <li>오류 추적 및 보안</li>
          </ul>
        </Section>

        <Section title="4. 쿠키 및 유사 기술">
          <p>
            본 사이트는 다음 기술을 사용합니다:
          </p>
          <ul style={{ listStyle: "disc", paddingLeft: 20, lineHeight: 1.9, marginTop: 6 }}>
            <li>
              <strong>localStorage:</strong> 사용자의 게임 기록, 설정,
              입력값 저장. 외부 전송 없음.
            </li>
            <li>
              <strong>쿠키:</strong> Google Analytics·AdSense가 광고 및
              분석 목적으로 사용.
            </li>
          </ul>
          <p style={{ marginTop: 10 }}>
            사용자는 브라우저 설정에서 쿠키·localStorage 사용을 거부할 수
            있으나, 일부 기능이 정상 동작하지 않을 수 있습니다.
          </p>
        </Section>

        <Section title="5. 제3자 서비스">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 8, marginBottom: 6 }}>
            가. Google Analytics
          </h3>
          <p>
            본 사이트는 방문자 분석을 위해 Google Analytics 4(GA4)를
            사용합니다. Google은 익명화된 데이터를 수집하여 사이트 운영자에게
            방문자 통계를 제공합니다.{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#60a5fa", textDecoration: "underline" }}
            >
              Google 개인정보 정책
            </a>
          </p>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 16, marginBottom: 6 }}>
            나. Google AdSense
          </h3>
          <p>
            본 사이트는 광고 게재를 위해 Google AdSense를 사용합니다.
            Google은 광고 게재를 위해 쿠키를 사용하며, 사용자의 관심사에
            맞는 광고를 표시할 수 있습니다.{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#60a5fa", textDecoration: "underline" }}
            >
              Google 광고 정책
            </a>
          </p>
          <p style={{ marginTop: 10 }}>
            사용자는{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#60a5fa", textDecoration: "underline" }}
            >
              Google 광고 설정
            </a>
            에서 맞춤 광고를 비활성화할 수 있습니다.
          </p>
        </Section>

        <Section title="6. 정보 보호">
          <p>
            본 사이트는 SSL/TLS 암호화 통신(HTTPS)을 사용하며, 사용자가
            직접 입력하는 정보는 브라우저에만 저장되어 외부로 전송되지
            않습니다. 따라서 입력 정보 자체에 대한 해킹·유출 위험은
            기술적으로 매우 낮습니다.
          </p>
        </Section>

        <Section title="7. 미성년자 보호">
          <p>
            본 사이트는 만 14세 미만 아동의 개인정보를 의도적으로
            수집하지 않습니다. 다만 입력값 자체를 수집·전송하지 않으므로
            연령 확인 절차는 두지 않습니다.
          </p>
        </Section>

        <Section title="8. 정책 변경">
          <p>
            본 개인정보처리방침은 법령 또는 서비스 변경 시 수정될 수
            있으며, 변경 시 본 페이지에 게시합니다.
          </p>
        </Section>

        <Section title="9. 문의">
          <p>
            개인정보 처리에 관한 문의는{" "}
            <Link
              href="/contact"
              style={{ color: "#60a5fa", textDecoration: "underline" }}
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
    <section style={{ marginBottom: 28 }}>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: "rgba(255,255,255,0.95)",
          marginBottom: 12,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          fontSize: 13,
          lineHeight: 1.8,
          color: "rgba(255,255,255,0.7)",
        }}
      >
        {children}
      </div>
    </section>
  );
}
