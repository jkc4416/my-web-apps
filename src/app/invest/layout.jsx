export const metadata = {
  title: "투자 시뮬레이터 — 복리 계산기, 적립식 투자 수익률 시뮬레이션",
  description:
    "초기 투자금과 월 적립금을 입력하면 복리 효과를 시뮬레이션합니다. KOSPI, S&P 500 등 실제 지수 기반 수익률 분석. 연도별 자산 성장 그래프, 총 수익금 계산. 무료 투자 시뮬레이터.",
  keywords: ["투자 시뮬레이터", "복리 계산기", "적립식 투자", "수익률 계산", "재테크 계산기", "자산 성장", "월적립 투자", "KOSPI", "S&P 500"],
  openGraph: {
    title: "투자 시뮬레이터 — 복리 수익률 시뮬레이션",
    description: "복리의 마법을 체험하세요. 무료 투자 시뮬레이터.",
    type: "website",
    url: "https://www.funappbox.com/invest",
  },
  twitter: { card: "summary_large_image", title: "투자 시뮬레이터", description: "복리 수익률 시뮬레이션 — 무료 투자 계산기" },
  alternates: { canonical: "https://www.funappbox.com/invest" },
};
export default function Layout({ children }) { return children; }
