import BlogArticle, { articleStyles as s } from "../../../components/BlogArticle";
import { POSTS } from "../posts";

const post = POSTS.find((p) => p.slug === "wcag-color-contrast");

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p style={s.p}>
        웹사이트를 만들 때 가장 자주 간과되는 영역이 <strong style={s.strong}>색상 접근성</strong>입니다.
        디자이너는 미적인 균형을 우선시하다 보니 본인의 시력으로는 잘 보이는 색 조합이
        시력이 약하거나 색각이 다른 사용자에게는 거의 보이지 않을 수 있습니다.
        WCAG(Web Content Accessibility Guidelines)는 이런 문제를 해결하기 위해 색상 대비 기준을 제시합니다.
      </p>

      <h2 style={s.h2}>WCAG는 무엇인가?</h2>
      <p style={s.p}>
        WCAG는 W3C에서 만든 웹 접근성 가이드라인입니다. 현재 가장 널리 사용되는 버전은{" "}
        <strong style={s.strong}>WCAG 2.1·2.2</strong>이며, A · AA · AAA의 3등급으로 나뉩니다.
      </p>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>A:</strong> 기본 (최소 요구사항)</li>
        <li style={s.li}><strong style={s.strong}>AA:</strong> 표준 (대부분의 법적 요구사항)</li>
        <li style={s.li}><strong style={s.strong}>AAA:</strong> 향상 (고도 접근성)</li>
      </ul>

      <h2 style={s.h2}>색상 대비 비율(Contrast Ratio)</h2>
      <p style={s.p}>
        두 색상의 밝기 차이를 1:1 ~ 21:1 비율로 나타냅니다. 1:1은 같은 색(대비 없음),
        21:1은 검정 vs 흰색(최대 대비)입니다.
      </p>

      <h3 style={s.h3}>WCAG 기준</h3>
      <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse", marginBottom: 14 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <th style={{ padding: 8, textAlign: "left" }}>등급</th>
            <th style={{ padding: 8, textAlign: "left" }}>본문</th>
            <th style={{ padding: 8, textAlign: "left" }}>큰 글씨 (18pt 이상)</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <td style={{ padding: 8, color: "#fbbf24" }}>AA</td>
            <td style={{ padding: 8 }}>4.5:1 이상</td>
            <td style={{ padding: 8 }}>3:1 이상</td>
          </tr>
          <tr>
            <td style={{ padding: 8, color: "#4ade80" }}>AAA</td>
            <td style={{ padding: 8 }}>7:1 이상</td>
            <td style={{ padding: 8 }}>4.5:1 이상</td>
          </tr>
        </tbody>
      </table>

      <h2 style={s.h2}>왜 4.5:1인가?</h2>
      <p style={s.p}>
        4.5:1은 약한 시력(20/40 정도)의 사용자도 텍스트를 명확하게 읽을 수 있는 최저 기준입니다.
        한국 국민 중 약 8.6%가 시각 장애 또는 시력 저하를 겪고 있다는 통계를 고려하면,
        AA 기준 충족은 사실상 필수입니다.
      </p>

      <h2 style={s.h2}>실무 예시</h2>
      <h3 style={s.h3}>좋은 예 (AA 통과)</h3>
      <ul style={s.ul}>
        <li style={s.li}>검정 텍스트 (#000000) + 흰색 배경 (#FFFFFF) → 21:1 (최대)</li>
        <li style={s.li}>진한 회색 (#374151) + 흰색 배경 (#FFFFFF) → 10.31:1</li>
        <li style={s.li}>흰색 텍스트 (#FFFFFF) + 어두운 파랑 (#1E3A8A) → 9.42:1</li>
      </ul>

      <h3 style={s.h3}>나쁜 예 (AA 미달)</h3>
      <ul style={s.ul}>
        <li style={s.li}>연한 회색 텍스트 (#9CA3AF) + 흰색 배경 → 2.85:1 ❌</li>
        <li style={s.li}>분홍색 (#FBCFE8) + 흰색 배경 → 1.31:1 ❌</li>
        <li style={s.li}>노란색 (#FACC15) + 흰색 배경 → 1.42:1 ❌</li>
      </ul>
      <blockquote style={s.blockquote}>
        "디자인이 예쁘다" ≠ "잘 읽힌다". 대비 검사 도구로 항상 확인하세요.
      </blockquote>

      <h2 style={s.h2}>비결: 색상은 보조 수단으로만 사용</h2>
      <p style={s.p}>
        WCAG 1.4.1 가이드라인은 "정보 전달에 색상만 사용하지 말 것"을 명시합니다.
        예를 들어 빨간색만으로 "오류"를 표시하면 색각이 다른 사용자(약 8% 남성)는 인지하지 못합니다.
      </p>
      <ul style={s.ul}>
        <li style={s.li}>❌ 빨간색 입력 박스로만 에러 표시</li>
        <li style={s.li}>✅ 빨간색 + ⚠️ 아이콘 + 텍스트 "이메일 형식이 올바르지 않습니다"</li>
      </ul>

      <h2 style={s.h2}>다크 모드와 대비</h2>
      <p style={s.p}>
        다크 모드에서도 같은 기준이 적용됩니다. 검정 배경(#000000)에 너무 밝은 흰색을
        쓰면 눈부심이 심하므로, 보통 <strong style={s.strong}>약간 어두운 흰색</strong>{" "}
        (#E2E8F0 등)이나 <strong style={s.strong}>회색이 섞인 배경</strong>(#1F2937)을 사용합니다.
      </p>

      <h2 style={s.h2}>색맹 시뮬레이션</h2>
      <p style={s.p}>
        가장 흔한 색맹은 적록색맹(빨강·초록 구분 어려움)으로 남성 약 8%, 여성 약 0.5%가 해당됩니다.
        Chrome DevTools의 Rendering 탭에서 <strong style={s.strong}>Emulate vision deficiencies</strong>{" "}
        기능으로 시뮬레이션할 수 있습니다.
      </p>

      <h2 style={s.h2}>실무 체크리스트</h2>
      <ul style={s.ul}>
        <li style={s.li}>본문 텍스트는 최소 AA 기준(4.5:1) 충족</li>
        <li style={s.li}>중요한 정보는 색상 외에 텍스트·아이콘도 함께 사용</li>
        <li style={s.li}>링크는 밑줄 또는 굵게 등 색상 외 표시 추가</li>
        <li style={s.li}>버튼의 활성/비활성 상태를 색상만으로 구분하지 않기</li>
        <li style={s.li}>입력 폼의 에러 상태를 빨간 테두리 + 에러 메시지로 함께 표시</li>
        <li style={s.li}>호버·포커스 상태도 충분한 대비 유지</li>
      </ul>

      <h2 style={s.h2}>마치며</h2>
      <p style={s.p}>
        색상 접근성은 한 번 익히면 자연스럽게 적용할 수 있는 영역입니다.
        FunAppBox의 <strong style={s.strong}>컬러 크래프트</strong> 도구로 본인의 색상 조합이
        WCAG AA/AAA 기준을 통과하는지 즉시 확인해보세요. 부족한 대비라면 자동으로
        보정 색상도 추천해드립니다.
      </p>
    </BlogArticle>
  );
}
