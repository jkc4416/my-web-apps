import Link from "next/link";

export default function TermsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 50% 0%, #1f2937 0%, #0c1422 40%, #060a14 100%)",
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
          이용약관
        </h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginBottom: 36 }}>
          최종 업데이트: 2026년 5월 17일
        </p>

        <Section title="제1조 (목적)">
          <p>
            본 약관은 FunAppBox(www.funappbox.com, 이하 "본 사이트")가
            제공하는 웹 도구·게임 서비스(이하 "서비스")의 이용 조건과
            책임 범위를 정함을 목적으로 합니다.
          </p>
        </Section>

        <Section title="제2조 (서비스의 내용)">
          <p>
            본 사이트는 다음을 포함하는 무료 웹 기반 서비스를 제공합니다:
          </p>
          <ul style={{ listStyle: "disc", paddingLeft: 20, lineHeight: 1.9, marginTop: 6 }}>
            <li>계산기·단위 변환·디데이 등 실용 도구</li>
            <li>MBTI·이름궁합·운세 등 심리·점술 콘텐츠</li>
            <li>워들·2048·스네이크 등 캐주얼 게임</li>
            <li>기타 본 사이트가 제공하는 콘텐츠</li>
          </ul>
        </Section>

        <Section title="제3조 (서비스의 무료성)">
          <p>
            본 사이트의 모든 서비스는 별도의 회원가입이나 결제 없이
            무료로 제공됩니다. 다만 사이트 운영을 위해 Google AdSense
            광고가 표시될 수 있습니다.
          </p>
        </Section>

        <Section title="제4조 (이용자의 의무)">
          <p>이용자는 다음 행위를 해서는 안 됩니다:</p>
          <ul style={{ listStyle: "disc", paddingLeft: 20, lineHeight: 1.9, marginTop: 6 }}>
            <li>본 사이트의 정상적인 운영을 방해하는 행위</li>
            <li>자동화된 수단(봇, 크롤러)으로 대량 요청을 보내는 행위</li>
            <li>본 사이트의 콘텐츠를 무단으로 복제·재배포하는 행위</li>
            <li>타인의 권리를 침해하거나 법령을 위반하는 행위</li>
          </ul>
        </Section>

        <Section title="제5조 (지적재산권)">
          <p>
            본 사이트의 디자인, 코드, 게임 로직, 콘텐츠에 대한 저작권은
            FunAppBox에 귀속됩니다. 개인적·비상업적 사용은 허용되며,
            상업적 이용 및 무단 복제·재배포는 금지됩니다.
          </p>
          <p style={{ marginTop: 10 }}>
            본 사이트가 사용하는 오픈소스 라이브러리(React, Next.js,
            Tailwind CSS, Recharts 등)는 각 라이선스를 따릅니다.
          </p>
        </Section>

        <Section title="제6조 (콘텐츠의 정확성)">
          <p>
            본 사이트의 사주, 타로, 이름 궁합, MBTI 등 점술·심리
            콘텐츠는 <strong>오락 목적</strong>으로 제공되며, 실제 심리
            진단이나 점술의 정확성을 보장하지 않습니다.
          </p>
          <p style={{ marginTop: 10 }}>
            계산기·투자 시뮬레이터의 결과는 참고용이며, 실제 금융 결정에
            사용하기 전에 전문가의 조언을 받으시기 바랍니다.
          </p>
        </Section>

        <Section title="제7조 (책임의 한계)">
          <p>
            본 사이트는 다음 사항에 대해 책임을 지지 않습니다:
          </p>
          <ul style={{ listStyle: "disc", paddingLeft: 20, lineHeight: 1.9, marginTop: 6 }}>
            <li>천재지변, 통신장애 등 불가항력으로 인한 서비스 중단</li>
            <li>이용자의 귀책사유로 인한 데이터 손실(브라우저 데이터 삭제 등)</li>
            <li>본 사이트가 게재한 제3자 광고로 인한 손해</li>
            <li>외부 링크된 사이트의 내용 및 운영</li>
          </ul>
        </Section>

        <Section title="제8조 (광고)">
          <p>
            본 사이트는 Google AdSense를 통해 광고를 게재합니다. 광고의
            내용은 Google의 정책에 따라 자동으로 결정되며, 본 사이트는
            특정 광고에 대한 추천이나 보증을 제공하지 않습니다.
          </p>
        </Section>

        <Section title="제9조 (개인정보 처리)">
          <p>
            본 사이트의 개인정보 처리에 관한 사항은{" "}
            <Link
              href="/privacy"
              style={{ color: "#60a5fa", textDecoration: "underline" }}
            >
              개인정보처리방침
            </Link>
            에 따릅니다.
          </p>
        </Section>

        <Section title="제10조 (약관의 변경)">
          <p>
            본 약관은 법령 또는 서비스 변경 시 수정될 수 있으며, 변경 시
            본 페이지에 게시합니다. 변경 후에도 서비스를 계속 이용하는
            경우 변경된 약관에 동의한 것으로 간주합니다.
          </p>
        </Section>

        <Section title="제11조 (준거법 및 관할)">
          <p>
            본 약관은 대한민국 법령을 준거법으로 하며, 본 사이트 이용과
            관련한 분쟁은 대한민국 법원을 관할 법원으로 합니다.
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
