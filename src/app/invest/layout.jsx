export const metadata = {
  title: "투자 시뮬레이터 | 복리 수익률 계산기",
  description:
    "초기 투자금과 월 적립금을 입력하면 복리 효과를 시뮬레이션합니다. 연도별 자산 성장 추이, 총 수익금, 수익률을 한눈에 확인하세요.",
  keywords: [
    "투자 시뮬레이터",
    "복리 계산기",
    "수익률 계산",
    "적립식 투자",
    "자산 성장",
    "투자 수익",
    "복리 효과",
    "재테크 계산기",
    "월적립 투자",
  ],
  openGraph: {
    title: "투자 시뮬레이터 | 복리 수익률 계산기",
    description:
      "초기 투자금과 월 적립금으로 복리 수익을 시뮬레이션합니다. 연도별 자산 성장 추이를 확인하세요.",
    type: "website",
    url: "/invest",
  },
  twitter: {
    card: "summary_large_image",
    title: "투자 시뮬레이터",
    description: "복리의 마법을 시뮬레이션 — 무료 투자 수익률 계산기",
  },
  alternates: {
    canonical: "/invest",
  },
};

export default function Layout({ children }) {
  return children;
}
