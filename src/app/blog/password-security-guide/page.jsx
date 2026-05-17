import BlogArticle, { articleStyles as s } from "../../../components/BlogArticle";
import { POSTS } from "../posts";

const post = POSTS.find((p) => p.slug === "password-security-guide");

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p style={s.p}>
        Have I Been Pwned 통계에 따르면 매년 수억 건의 비밀번호가 유출되고 있습니다.
        이런 환경에서 본인의 계정을 지키려면 단순히 "복잡한 비밀번호"가 아니라
        체계적인 비밀번호 전략이 필요합니다. 이 글에서는 보안 전문가들이 권장하는
        7가지 실전 원칙을 정리합니다.
      </p>

      <h2 style={s.h2}>원칙 1. 최소 12자 이상</h2>
      <p style={s.p}>
        해커의 무차별 대입 공격(Brute-force) 속도가 매년 빨라지고 있어, 과거 8자가 안전했다면
        지금은 12자도 위태롭습니다. 가능하면 <strong style={s.strong}>16자 이상</strong>을 권장합니다.
      </p>
      <ul style={s.ul}>
        <li style={s.li}>8자 영문+숫자: 약 22조 가지 → 현대 GPU로 수 시간 내 크랙</li>
        <li style={s.li}>12자 영문+숫자+특수: 약 5×10²² 가지 → 수백 년 필요</li>
        <li style={s.li}>16자 모든 문자: 사실상 무한대</li>
      </ul>

      <h2 style={s.h2}>원칙 2. 사이트마다 다른 비밀번호 사용</h2>
      <p style={s.p}>
        한 사이트에서 비밀번호가 유출되면 그 비밀번호로 다른 모든 사이트에 로그인을
        시도하는 <strong style={s.strong}>크리덴셜 스터핑(Credential Stuffing)</strong>이
        가장 흔한 해킹 패턴입니다. 절대로 비밀번호를 재사용하지 마세요.
      </p>

      <h2 style={s.h2}>원칙 3. 비밀번호 매니저 사용</h2>
      <p style={s.p}>
        모든 사이트에 다른 16자 비밀번호를 외울 수는 없습니다. <strong style={s.strong}>1Password,
        Bitwarden, Apple Keychain, Google Password Manager</strong> 같은 비밀번호 매니저를 사용하세요.
        하나의 마스터 비밀번호만 외우면 됩니다.
      </p>
      <blockquote style={s.blockquote}>
        Bitwarden은 오픈소스이며 개인용은 무료입니다. 부담 없이 시작할 수 있는 추천 매니저입니다.
      </blockquote>

      <h2 style={s.h2}>원칙 4. 2단계 인증(2FA) 활성화</h2>
      <p style={s.p}>
        비밀번호가 유출되어도 두 번째 인증 단계가 있으면 침입을 막을 수 있습니다.
        SMS보다 <strong style={s.strong}>Authenticator 앱(Google Authenticator, Authy)</strong>이나{" "}
        <strong style={s.strong}>물리적 보안 키(YubiKey)</strong>가 안전합니다.
      </p>
      <ul style={s.ul}>
        <li style={s.li}>가장 좋음: 하드웨어 보안키 (YubiKey, FIDO2)</li>
        <li style={s.li}>좋음: TOTP 앱 (Google Authenticator, Authy)</li>
        <li style={s.li}>보통: SMS 인증 (SIM swap 공격 위험)</li>
      </ul>

      <h2 style={s.h2}>원칙 5. 암호학적 안전 난수 사용</h2>
      <p style={s.p}>
        직접 만든 비밀번호는 패턴이 있기 마련입니다. 좋은 비밀번호는 완전히 무작위여야 합니다.
        Math.random() 같은 의사 난수 대신 <strong style={s.strong}>Web Crypto API의
        crypto.getRandomValues()</strong>로 생성된 비밀번호를 사용하세요.
      </p>
      <p style={s.p}>
        FunAppBox의 <strong style={s.strong}>비밀번호 생성기</strong>는 Web Crypto API 기반으로
        암호학적으로 안전한 비밀번호를 즉시 생성해줍니다.
      </p>

      <h2 style={s.h2}>원칙 6. 정기 점검 (Have I Been Pwned)</h2>
      <p style={s.p}>
        본인의 이메일·비밀번호가 유출된 적이 있는지 정기적으로 확인하세요.{" "}
        <strong style={s.strong}>haveibeenpwned.com</strong>에서 이메일로 무료 조회 가능합니다.
        유출된 비밀번호는 즉시 변경하세요.
      </p>

      <h2 style={s.h2}>원칙 7. 의심스러운 링크 클릭 금지 (피싱 방지)</h2>
      <p style={s.p}>
        아무리 강한 비밀번호라도 본인이 직접 가짜 사이트에 입력하면 무용지물입니다.
      </p>
      <ul style={s.ul}>
        <li style={s.li}>이메일·문자의 링크를 클릭하기 전 URL을 확인 (특히 도메인 철자)</li>
        <li style={s.li}>은행·결제는 즐겨찾기 또는 직접 입력으로 접속</li>
        <li style={s.li}>비밀번호 매니저는 가짜 사이트에서 자동완성을 거부하므로 추가 보호 효과</li>
      </ul>

      <h2 style={s.h2}>피해야 할 비밀번호 패턴</h2>
      <ul style={s.ul}>
        <li style={s.li}>이름·생일·전화번호 (홍길동1985, 0101234)</li>
        <li style={s.li}>키보드 순서 (qwerty, 123456, asdf1234)</li>
        <li style={s.li}>사전에 있는 단어 + 숫자 (password123)</li>
        <li style={s.li}>사이트 이름이 들어간 비밀번호 (instagram_pw1)</li>
        <li style={s.li}>흔한 치환 (P@ssw0rd, l3tm31n)</li>
      </ul>

      <h2 style={s.h2}>비밀번호 강도 평가법</h2>
      <p style={s.p}>
        비밀번호의 안전성은 <strong style={s.strong}>엔트로피(Entropy, bits)</strong>로 측정합니다.
        각 문자당 가능한 경우의 수의 log₂값을 더한 값입니다.
      </p>
      <ul style={s.ul}>
        <li style={s.li}>약함: 50 bits 미만 (즉시 크랙 가능)</li>
        <li style={s.li}>보통: 50~80 bits</li>
        <li style={s.li}>강함: 80~100 bits</li>
        <li style={s.li}>매우 강함: 100 bits 이상</li>
      </ul>
      <p style={s.p}>예: 16자 영문대소문자+숫자+특수문자 = 약 105 bits → 매우 안전.</p>

      <h2 style={s.h2}>패스키(Passkey) — 미래의 표준</h2>
      <p style={s.p}>
        Apple, Google, Microsoft가 공동으로 추진하는 <strong style={s.strong}>패스키</strong>는
        비밀번호를 완전히 대체하는 새로운 인증 방식입니다. 기기의 생체인증으로 로그인하며
        피싱이 불가능합니다. 점차 도입되고 있으니 패스키를 지원하는 사이트에서는 적극 활용하세요.
      </p>

      <h2 style={s.h2}>마치며</h2>
      <p style={s.p}>
        본인의 비밀번호가 약하다면 지금 당장 바꾸세요. FunAppBox의{" "}
        <strong style={s.strong}>비밀번호 생성기</strong>로 안전한 16자 비밀번호를 즉시 생성하고,
        비밀번호 매니저에 저장하는 것을 권장합니다. 입력값은 어디에도 전송되지 않으니 안심하세요.
      </p>
    </BlogArticle>
  );
}
