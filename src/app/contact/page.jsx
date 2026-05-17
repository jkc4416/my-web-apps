import Link from "next/link";

const CONTACT_EMAIL = "ourbaby0321@gmail.com";

export default function ContactPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 50% 0%, #0c4a6e 0%, #06192e 40%, #03060d 100%)",
        color: "rgba(255,255,255,0.85)",
        fontFamily:
          "'Pretendard Variable','Pretendard',-apple-system,sans-serif",
        padding: "60px 20px 40px",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
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
            background: "linear-gradient(135deg, #38bdf8, #818cf8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          문의하기
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 14,
            marginBottom: 36,
          }}
        >
          의견·제안·버그신고·광고문의를 환영합니다.
        </p>

        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              marginBottom: 8,
            }}
          >
            📧 이메일
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#38bdf8",
              textDecoration: "none",
              wordBreak: "break-all",
            }}
          >
            {CONTACT_EMAIL}
          </a>
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.4)",
              marginTop: 10,
              lineHeight: 1.7,
            }}
          >
            보통 24~48시간 이내에 답변드립니다. 한국어/영어 모두 가능합니다.
          </p>
        </div>

        <Section title="어떤 문의를 받나요?">
          <ul style={{ listStyle: "disc", paddingLeft: 20, lineHeight: 1.9 }}>
            <li>
              <strong>버그 신고:</strong> 사용 중 발견한 오류, 잘못된
              계산 결과, 깨진 화면 등
            </li>
            <li>
              <strong>기능 제안:</strong> 추가했으면 하는 기능, 개선
              아이디어
            </li>
            <li>
              <strong>새 도구 제안:</strong> 만들어주셨으면 하는 새로운
              도구·게임 아이디어
            </li>
            <li>
              <strong>광고·제휴 문의:</strong> 광고 배치, 브랜드 콜라보,
              제휴 제안
            </li>
            <li>
              <strong>저작권·법적 문의:</strong> 콘텐츠 사용권한, DMCA
              관련 문의
            </li>
            <li>
              <strong>개인정보 관련 문의:</strong> 데이터 처리·삭제 요청
            </li>
          </ul>
        </Section>

        <Section title="버그 신고 시 알려주시면 좋은 정보">
          <ul style={{ listStyle: "disc", paddingLeft: 20, lineHeight: 1.9 }}>
            <li>어떤 도구·게임에서 발생했는지 (예: 한글 워들)</li>
            <li>어떤 동작을 했을 때 발생했는지 (재현 단계)</li>
            <li>사용 중인 기기(PC/모바일)와 브라우저(Chrome, Safari 등)</li>
            <li>가능하다면 화면 캡처 첨부</li>
          </ul>
        </Section>

        <Section title="자주 묻는 질문">
          <FAQ
            q="게임 기록이 사라졌어요!"
            a="모든 기록은 사용자의 브라우저에 저장됩니다. 시크릿 모드, 브라우저 데이터 삭제, 다른 기기 사용 시 기록이 보이지 않을 수 있습니다."
          />
          <FAQ
            q="모바일 앱은 없나요?"
            a="현재는 웹 버전만 제공됩니다. 브라우저에서 '홈 화면에 추가'를 사용하면 앱처럼 사용 가능합니다."
          />
          <FAQ
            q="데이터가 외부로 전송되나요?"
            a="아닙니다. 입력하신 정보(이름, 생년월일 등)는 모두 사용자의 브라우저에만 저장되며 서버나 외부로 전송되지 않습니다. 자세한 내용은 개인정보처리방침을 참고하세요."
          />
          <FAQ
            q="새로운 도구를 추가해주세요!"
            a="이메일로 제안해주시면 검토 후 가능한 한 빠르게 반영하겠습니다."
          />
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
          fontSize: 18,
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

function FAQ({ q, a }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "rgba(255,255,255,0.85)",
          marginBottom: 4,
        }}
      >
        Q. {q}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.55)",
          lineHeight: 1.7,
        }}
      >
        {a}
      </div>
    </div>
  );
}
