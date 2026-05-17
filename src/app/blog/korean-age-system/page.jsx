import BlogArticle, { articleStyles as s } from "../../../components/BlogArticle";
import { POSTS } from "../posts";

const post = POSTS.find((p) => p.slug === "korean-age-system");

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p style={s.p}>
        한국은 오랫동안 세 가지 나이 체계가 공존해 왔습니다. <strong style={s.strong}>한국식 나이(세는 나이),
        만 나이, 연 나이</strong>입니다. 외국인들에게는 매우 혼란스러운 시스템이었으나,
        2023년 6월 28일부터 시행된 <strong style={s.strong}>'만 나이 통일법'</strong>으로 모든
        행정·법적 나이는 만 나이로 통일되었습니다. 이 글에서는 세 가지 나이 체계의 차이와
        실생활 적용을 정리합니다.
      </p>

      <h2 style={s.h2}>세 가지 나이 체계 비교</h2>

      <h3 style={s.h3}>1. 한국식 나이 (세는 나이)</h3>
      <p style={s.p}>
        가장 오래된 한국 전통 방식. <strong style={s.strong}>태어나는 순간 1살, 매년 1월 1일에 +1살</strong>.
      </p>
      <ul style={s.ul}>
        <li style={s.li}>2026년 1월 1일 출생 → 2026년 1월 1일에 1살, 2027년 1월 1일에 2살</li>
        <li style={s.li}>2025년 12월 31일 출생 → 출생 당일 1살, 다음날(2026년 1월 1일)에 2살 (?!)</li>
      </ul>
      <p style={s.p}>
        마지막 사례 때문에 가장 큰 혼란을 야기했습니다. 12월 31일생은 태어난 다음날에 2살이 됩니다.
      </p>

      <h3 style={s.h3}>2. 만 나이 (실제 나이)</h3>
      <p style={s.p}>
        국제 표준 방식. <strong style={s.strong}>태어나는 순간 0살, 생일이 지나야 +1살</strong>.
      </p>
      <ul style={s.ul}>
        <li style={s.li}>2026년 5월 17일 기준, 2000년 3월 1일생 → 만 26세 (3월에 생일 지남)</li>
        <li style={s.li}>2026년 5월 17일 기준, 2000년 10월 1일생 → 만 25세 (10월에 생일)</li>
      </ul>

      <h3 style={s.h3}>3. 연 나이</h3>
      <p style={s.p}>
        과거 일부 법률·행정에서 사용된 방식. <strong style={s.strong}>현재 연도 - 출생 연도</strong>
        (생일 무관).
      </p>
      <ul style={s.ul}>
        <li style={s.li}>2026년에 2000년생 → 연 나이 26세 (생일과 무관)</li>
      </ul>
      <p style={s.p}>
        주류 구매(만 19세 이상), 청소년 보호법, 병역법 등 일부 법률에 여전히 사용됩니다.
      </p>

      <h2 style={s.h2}>2023년 만 나이 통일법</h2>
      <p style={s.p}>
        2023년 6월 28일 시행된 <strong style={s.strong}>'행정기본법 및 민법 일부개정법률'</strong>에
        따라 모든 법령·계약·공문서에서 나이는 <strong style={s.strong}>만 나이</strong>로 일원화되었습니다.
      </p>
      <p style={s.p}>주요 변화:</p>
      <ul style={s.ul}>
        <li style={s.li}>'세는 나이'라는 표현이 법적으로 사라짐</li>
        <li style={s.li}>나이로 인한 분쟁이 줄어듦 (예: 정년퇴직, 수당 지급)</li>
        <li style={s.li}>외국과의 나이 비교가 명확해짐</li>
        <li style={s.li}>일상 대화에서도 점차 만 나이가 표준화됨</li>
      </ul>

      <h2 style={s.h2}>그럼에도 연 나이가 남아있는 경우</h2>
      <p style={s.p}>예외적으로 다음은 여전히 연 나이를 사용합니다:</p>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>주류·담배 구매:</strong> 청소년 보호법상 연 나이 19세 (해당 연도 1월 1일 기준)</li>
        <li style={s.li}><strong style={s.strong}>병역법:</strong> 연 나이로 입영 대상 결정</li>
        <li style={s.li}><strong style={s.strong}>초·중·고 입학:</strong> 출생 연도 기준</li>
      </ul>
      <blockquote style={s.blockquote}>
        2026년 기준, 2007년생은 1월 1일부터 술·담배 구매 가능 (연 나이 19세).
      </blockquote>

      <h2 style={s.h2}>실생활 예시</h2>
      <h3 style={s.h3}>예시 1: 2000년 6월 1일생, 오늘은 2026년 5월 17일</h3>
      <ul style={s.ul}>
        <li style={s.li}>한국식 나이: 27살 (출생 시 1살 + 26번의 1월 1일)</li>
        <li style={s.li}>만 나이: 25세 (아직 6월 생일이 안 옴)</li>
        <li style={s.li}>연 나이: 26세 (2026 − 2000)</li>
      </ul>

      <h3 style={s.h3}>예시 2: 2000년 1월 15일생, 오늘은 2026년 5월 17일</h3>
      <ul style={s.ul}>
        <li style={s.li}>한국식 나이: 27살</li>
        <li style={s.li}>만 나이: 26세 (1월에 생일 지남)</li>
        <li style={s.li}>연 나이: 26세</li>
      </ul>

      <h2 style={s.h2}>외국에서는?</h2>
      <p style={s.p}>
        대부분의 국가는 <strong style={s.strong}>만 나이만 사용</strong>합니다. 미국·유럽·일본
        모두 만 나이가 표준이며, 한국의 '세는 나이'는 외국인에게 매우 낯선 개념입니다.
        만 나이 통일로 외국과의 나이 비교가 간단해졌습니다.
      </p>

      <h2 style={s.h2}>나이 계산 빠른 공식</h2>
      <h3 style={s.h3}>만 나이</h3>
      <p style={s.p}>
        오늘 날짜가 생일 이후라면: <code style={s.code}>올해 - 출생년</code>
        <br />
        오늘 날짜가 생일 이전이라면: <code style={s.code}>올해 - 출생년 - 1</code>
      </p>

      <h3 style={s.h3}>한국식 나이 (참고용)</h3>
      <p style={s.p}>
        <code style={s.code}>올해 - 출생년 + 1</code> (1월 1일부터 12월 31일까지 동일)
      </p>

      <h2 style={s.h2}>마치며</h2>
      <p style={s.p}>
        만 나이 통일법으로 한국의 나이 체계가 훨씬 단순해졌습니다. 그러나 여전히 일상에서는
        세 가지 나이가 혼용되곤 합니다. 본인의 정확한 만 나이가 궁금하다면 FunAppBox의{" "}
        <strong style={s.strong}>나이 계산기</strong>에서 생년월일을 입력하면 만 나이·한국식 나이·
        띠·별자리·다음 생일까지 한 번에 확인할 수 있습니다.
      </p>
    </BlogArticle>
  );
}
