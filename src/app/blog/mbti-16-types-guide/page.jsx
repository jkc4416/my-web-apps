import BlogArticle, { articleStyles as s } from "../../../components/BlogArticle";
import { POSTS } from "../posts";

const post = POSTS.find((p) => p.slug === "mbti-16-types-guide");

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p style={s.p}>
        MBTI(Myers-Briggs Type Indicator)는 1940년대에 캐서린 쿡 브릭스와 그녀의 딸
        이사벨 브릭스 마이어스가 칼 융의 심리 유형 이론을 기반으로 개발한
        성격 유형 분류 도구입니다. 사람의 성향을 <strong style={s.strong}>4개 차원</strong>으로
        분석해 총 <strong style={s.strong}>16가지 유형</strong>으로 분류합니다.
        이 글에서는 4개 차원의 의미부터 16가지 유형별 특징, 강점·약점, 추천 직업,
        연애 스타일까지 한 번에 정리합니다.
      </p>

      <h2 style={s.h2}>MBTI 4가지 차원</h2>
      <h3 style={s.h3}>1. E (외향) vs I (내향) — 에너지 방향</h3>
      <p style={s.p}>
        외향형은 사람과 함께 있을 때 에너지를 얻고, 내향형은 혼자만의 시간으로
        에너지를 충전합니다. 외향형이 사교적이고 내향형이 부끄럼이 많다는 오해가
        흔하지만, 실제로는 <strong style={s.strong}>에너지 충전 방식의 차이</strong>입니다.
        내향형도 친한 사람과는 매우 활발할 수 있습니다.
      </p>
      <h3 style={s.h3}>2. S (감각) vs N (직관) — 정보 인식 방식</h3>
      <p style={s.p}>
        감각형은 구체적·현실적인 정보를 선호하고, 직관형은 추상적·미래지향적인
        패턴을 잘 봅니다. 감각형은 디테일에 강하고, 직관형은 큰 그림을 잘 봅니다.
        S 유형이 70% 정도로 다수이며, N 유형은 30% 정도로 소수입니다.
      </p>
      <h3 style={s.h3}>3. T (사고) vs F (감정) — 판단 기준</h3>
      <p style={s.p}>
        사고형은 논리·일관성·공정성을 기준으로 판단하고, 감정형은 사람의 가치관·
        조화를 기준으로 판단합니다. T가 무정하고 F가 비논리적이라는 오해가 있지만,
        둘 다 합리적 판단을 합니다. <strong style={s.strong}>중요한 기준이 다를 뿐</strong>입니다.
      </p>
      <h3 style={s.h3}>4. J (판단) vs P (인식) — 생활 양식</h3>
      <p style={s.p}>
        판단형은 계획과 마감을 선호하고, 인식형은 유연성과 즉흥성을 좋아합니다.
        J는 일정표대로 움직이는 것을 좋아하고, P는 마지막 순간에 몰아치는 경향이
        있습니다.
      </p>

      <h2 style={s.h2}>16가지 유형별 특징</h2>

      <h3 style={s.h3}>🟣 분석가 그룹 (NT)</h3>
      <p style={s.p}>
        <strong style={s.strong}>INTJ (전략가)</strong> — 독립적이고 결단력 있는
        장기 계획가. 효율과 시스템을 중시. 추천 직업: 과학자, 전략 컨설턴트, CTO.
      </p>
      <p style={s.p}>
        <strong style={s.strong}>INTP (논리술사)</strong> — 호기심 많고 이론적인 사색가.
        새로운 아이디어 탐구를 즐김. 추천 직업: 연구원, 철학자, 소프트웨어 엔지니어.
      </p>
      <p style={s.p}>
        <strong style={s.strong}>ENTJ (통솔자)</strong> — 카리스마 있는 리더. 목표 달성에
        뛰어남. 추천 직업: CEO, 기업가, 변호사.
      </p>
      <p style={s.p}>
        <strong style={s.strong}>ENTP (변론가)</strong> — 호기심 많고 도전적인 토론가.
        새로운 가능성을 끊임없이 탐색. 추천 직업: 발명가, 마케터, 기업가.
      </p>

      <h3 style={s.h3}>🟢 외교관 그룹 (NF)</h3>
      <p style={s.p}>
        <strong style={s.strong}>INFJ (옹호자)</strong> — 통찰력 있고 이상주의적.
        사람들을 돕는 데 헌신. 추천 직업: 상담사, 작가, 사회복지사.
      </p>
      <p style={s.p}>
        <strong style={s.strong}>INFP (중재자)</strong> — 시적이고 친절한 이상주의자.
        자신의 가치관에 충실. 추천 직업: 작가, 예술가, 심리상담사.
      </p>
      <p style={s.p}>
        <strong style={s.strong}>ENFJ (선도자)</strong> — 카리스마 있고 영감을 주는 리더.
        타인의 성장을 돕는 데 능숙. 추천 직업: 교사, HR 전문가, 정치인.
      </p>
      <p style={s.p}>
        <strong style={s.strong}>ENFP (활동가)</strong> — 열정적이고 창의적. 사람들에게
        영감을 불어넣음. 추천 직업: 저널리스트, 배우, 광고기획자.
      </p>

      <h3 style={s.h3}>🔵 관리자 그룹 (SJ)</h3>
      <p style={s.p}>
        <strong style={s.strong}>ISTJ (현실주의자)</strong> — 사실에 입각하고 신뢰할 수 있는
        실용주의자. 추천 직업: 회계사, 군인, 공무원.
      </p>
      <p style={s.p}>
        <strong style={s.strong}>ISFJ (수호자)</strong> — 헌신적이고 따뜻한 보호자.
        세심한 배려가 강점. 추천 직업: 간호사, 교사, 사서.
      </p>
      <p style={s.p}>
        <strong style={s.strong}>ESTJ (경영자)</strong> — 체계적이고 전통을 중시.
        조직 관리 능력 탁월. 추천 직업: 관리자, 군 장교, 판사.
      </p>
      <p style={s.p}>
        <strong style={s.strong}>ESFJ (집정관)</strong> — 사교적이고 협력적.
        타인의 필요를 잘 파악. 추천 직업: HR 매니저, 의료진, 이벤트 플래너.
      </p>

      <h3 style={s.h3}>🟠 탐험가 그룹 (SP)</h3>
      <p style={s.p}>
        <strong style={s.strong}>ISTP (장인)</strong> — 실용적인 문제 해결사. 손재주가 좋고
        독립적. 추천 직업: 엔지니어, 정비사, 외과의사.
      </p>
      <p style={s.p}>
        <strong style={s.strong}>ISFP (모험가)</strong> — 예술적 감각이 뛰어난 자유로운 영혼.
        추천 직업: 디자이너, 음악가, 사진작가.
      </p>
      <p style={s.p}>
        <strong style={s.strong}>ESTP (사업가)</strong> — 활동적이고 즉흥적. 실용적인 행동파.
        추천 직업: 영업, 운동선수, 응급구조사.
      </p>
      <p style={s.p}>
        <strong style={s.strong}>ESFP (연예인)</strong> — 사교적이고 자발적. 분위기 메이커.
        추천 직업: 배우, 이벤트 플래너, 영업.
      </p>

      <h2 style={s.h2}>MBTI 활용 시 주의할 점</h2>
      <ul style={s.ul}>
        <li style={s.li}>MBTI는 <strong style={s.strong}>경향성</strong>일 뿐, 사람을 단정짓는 도구가 아닙니다.</li>
        <li style={s.li}>상황·기분에 따라 결과가 달라질 수 있습니다.</li>
        <li style={s.li}>공식 MBTI 검사는 자격 있는 전문가가 시행하는 유료 검사입니다.</li>
        <li style={s.li}>학술적으로는 신뢰성·타당성 논란이 있는 도구입니다.</li>
        <li style={s.li}>채용·인사 결정에 사용하는 것은 권장되지 않습니다.</li>
      </ul>

      <h2 style={s.h2}>유형별 연애 스타일</h2>
      <p style={s.p}>
        NT 유형(분석가)은 지적인 대화와 독립성을 중시합니다. NF 유형(외교관)은
        깊은 정서적 연결과 의미를 추구합니다. SJ 유형(관리자)은 안정성과 책임감을
        중요하게 생각합니다. SP 유형(탐험가)은 즉흥적이고 모험적인 데이트를 좋아합니다.
      </p>
      <p style={s.p}>
        가장 흔하게 추천되는 궁합은 <strong style={s.strong}>NF-NT (직관형 끼리)</strong>,{" "}
        <strong style={s.strong}>SJ-SP (현실형 끼리)</strong> 조합입니다. 다만 같은 유형
        끼리 만나면 비슷한 단점이 강화될 수 있어 보완적인 유형도 좋은 선택입니다.
      </p>

      <h2 style={s.h2}>마치며</h2>
      <p style={s.p}>
        MBTI는 자기 이해와 타인 이해의 출발점으로 활용하기 좋은 도구입니다.
        본인이 어느 유형에 속하는지 모르겠다면 FunAppBox의 무료 MBTI 테스트로
        가볍게 확인해보세요. 16가지 유형 중 본인과 가장 가까운 유형과 함께
        강점·약점·어울리는 직업·연애 스타일을 한 번에 보여드립니다.
      </p>
    </BlogArticle>
  );
}
