import BlogArticle, { articleStyles as s } from "../../../components/BlogArticle";
import { POSTS } from "../posts";

const post = POSTS.find((p) => p.slug === "investing-backtesting");

export default function Page() {
  return (
    <BlogArticle post={post}>
      <p style={s.p}>
        "그때 비트코인을 샀더라면…", "10년 전 삼성전자를 1000만원어치 샀다면 지금 얼마였을까?"
        같은 상상은 누구나 한 번쯤 해봤을 것입니다. <strong style={s.strong}>백테스팅(Backtesting)</strong>은
        과거 가격 데이터를 이용해 이런 가정을 실제로 시뮬레이션해보는 기법입니다.
        투자 전략의 과거 성과를 검증하는 데 사용되며, 전문 트레이더부터 일반 투자자까지 폭넓게 활용됩니다.
      </p>

      <h2 style={s.h2}>백테스팅의 핵심 지표</h2>

      <h3 style={s.h3}>1. CAGR (연평균 복리 수익률)</h3>
      <p style={s.p}>
        <strong style={s.strong}>Compound Annual Growth Rate</strong>의 약자로, "매년 몇 %씩 균등하게
        성장한 것과 같은가?"를 나타냅니다. 단순 수익률보다 더 정확한 비교 지표입니다.
      </p>
      <p style={s.p}>
        공식: <code style={s.code}>CAGR = (최종가치 / 초기투자)^(1/년수) - 1</code>
      </p>
      <ul style={s.ul}>
        <li style={s.li}>예: 100만원 → 10년 후 200만원 = CAGR 약 7.18%</li>
        <li style={s.li}>예: 100만원 → 10년 후 1000만원 = CAGR 약 25.89%</li>
      </ul>

      <h3 style={s.h3}>2. Drawdown (최대 손실 구간)</h3>
      <p style={s.p}>
        고점에서 저점까지 떨어진 비율을 의미합니다. <strong style={s.strong}>MDD(Maximum Drawdown)</strong>는
        과거 가장 큰 손실 구간을 나타내며, 변동성과 심리적 부담을 판단하는 중요한 지표입니다.
      </p>
      <p style={s.p}>
        예: 비트코인이 2021년 11월 약 8,000만원에서 2022년 11월 약 2,000만원으로 떨어졌을 때 MDD는 약 75%.
      </p>

      <h3 style={s.h3}>3. 변동성 (Volatility)</h3>
      <p style={s.p}>
        수익률의 표준편차로 측정합니다. 같은 CAGR이라도 변동성이 낮으면 안정적, 높으면 위험합니다.
      </p>

      <h3 style={s.h3}>4. 샤프 지수 (Sharpe Ratio)</h3>
      <p style={s.p}>
        <strong style={s.strong}>위험 대비 수익률</strong>을 측정. (수익률 − 무위험수익률) / 변동성.
        1.0 이상이면 좋음, 2.0 이상이면 매우 우수.
      </p>

      <h2 style={s.h2}>주요 자산의 장기 CAGR (참고)</h2>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>S&amp;P500:</strong> 약 10% (1928~2024 평균, 배당 포함)</li>
        <li style={s.li}><strong style={s.strong}>코스피:</strong> 약 6~8% (1980~2024 평균, 배당 포함)</li>
        <li style={s.li}><strong style={s.strong}>금:</strong> 약 3~5% (1970~2024)</li>
        <li style={s.li}><strong style={s.strong}>비트코인:</strong> 매우 변동성 크지만 출시 이후 평균 매우 높음 (그러나 MDD도 80%+)</li>
        <li style={s.li}><strong style={s.strong}>국채:</strong> 약 2~4%</li>
        <li style={s.li}><strong style={s.strong}>부동산:</strong> 지역별 편차 큼, 한국 아파트 약 5~7%</li>
      </ul>
      <blockquote style={s.blockquote}>
        장기적으로 인플레이션(약 2~3%)을 이기지 못하면 자산 가치는 실질적으로 감소합니다.
      </blockquote>

      <h2 style={s.h2}>백테스팅의 함정 (Survivorship Bias)</h2>
      <p style={s.p}>
        과거 데이터로 보는 수익률에는 함정이 있습니다. 대표적인 것이{" "}
        <strong style={s.strong}>생존자 편향(Survivorship Bias)</strong>입니다.
      </p>
      <p style={s.p}>
        지금 잘 나가는 종목을 과거로 가서 샀다고 가정하면 당연히 좋은 결과가 나옵니다.
        그러나 같은 시점에 사라진 종목·실패한 회사들도 함께 고려해야 정확한 판단이 가능합니다.
      </p>
      <p style={s.p}>
        예: 1990년대 닷컴 버블 시기에 살아남은 회사만 보면 IT 투자가 매우 좋아 보이지만,
        실제로는 수많은 회사가 망했습니다.
      </p>

      <h2 style={s.h2}>실전 투자 vs 백테스팅의 차이</h2>
      <ul style={s.ul}>
        <li style={s.li}><strong style={s.strong}>심리적 압박:</strong> 백테스팅에서는 -50% 손실도 숫자지만, 실제로는 견디기 어렵습니다.</li>
        <li style={s.li}><strong style={s.strong}>거래 비용:</strong> 수수료·세금이 반영되지 않은 백테스팅은 과대평가됩니다.</li>
        <li style={s.li}><strong style={s.strong}>슬리피지:</strong> 큰 금액 주문 시 호가 차이로 실제 체결가가 다릅니다.</li>
        <li style={s.li}><strong style={s.strong}>유동성:</strong> 과거에는 충분했던 유동성이 현재는 부족할 수 있습니다.</li>
        <li style={s.li}><strong style={s.strong}>미래는 다름:</strong> 과거 결과가 미래를 보장하지 않습니다.</li>
      </ul>

      <h2 style={s.h2}>건전한 백테스팅 활용법</h2>
      <ol style={{ ...s.ul, listStyle: "decimal" }}>
        <li style={s.li}><strong style={s.strong}>전략의 안정성 확인:</strong> 여러 기간·여러 자산에 동일 전략을 적용해보세요.</li>
        <li style={s.li}><strong style={s.strong}>최악의 시나리오 점검:</strong> CAGR보다 MDD에 집중하세요.</li>
        <li style={s.li}><strong style={s.strong}>분산 투자 효과 확인:</strong> 단일 자산보다 60/40 (주식/채권) 같은 포트폴리오 백테스트.</li>
        <li style={s.li}><strong style={s.strong}>비용 반영:</strong> 0.5~1% 정도의 거래비용 가정.</li>
        <li style={s.li}><strong style={s.strong}>본인 위험감수도 확인:</strong> MDD 30%를 견딜 수 있는지 자문.</li>
      </ol>

      <h2 style={s.h2}>장기 투자 vs 단기 매매</h2>
      <p style={s.p}>
        백테스팅 결과는 보통 <strong style={s.strong}>장기일수록 더 안정적</strong>입니다.
        S&amp;P500의 경우, 20년 이상 보유 시 손실 확률이 0%에 수렴합니다.
        반면 1년 보유 시 손실 확률은 약 25%입니다. "Time in the market beats timing the market"이라는
        격언이 있는 이유입니다.
      </p>

      <h2 style={s.h2}>마치며</h2>
      <p style={s.p}>
        백테스팅은 과거를 통해 미래를 추정하는 도구지만, 절대적인 보장은 아닙니다.
        FunAppBox의 <strong style={s.strong}>투자 시뮬레이터</strong>에서 비트코인·삼성전자·S&amp;P500 등
        주요 자산의 과거 수익률을 다양한 시점·기간으로 시뮬레이션해보세요. CAGR과 그래프로
        '만약 그때 샀다면?'을 직관적으로 확인할 수 있습니다.
      </p>
    </BlogArticle>
  );
}
