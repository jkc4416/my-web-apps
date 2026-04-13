export const metadata = {
  title: "만능 계산기 | 연봉, BMI, 단위변환, 할인 계산",
  description:
    "연봉 실수령액 계산기, BMI 계산기, 단위 변환기, 할인율 계산기 등 일상에서 필요한 다양한 계산을 한 곳에서 무료로 이용하세요.",
  keywords: [
    "만능 계산기",
    "연봉 계산기",
    "실수령액 계산",
    "BMI 계산기",
    "단위 변환",
    "할인 계산기",
    "퍼센트 계산기",
    "무료 온라인 계산기",
  ],
  openGraph: {
    title: "만능 계산기 | 연봉, BMI, 단위변환, 할인 계산",
    description:
      "연봉 실수령액, BMI, 단위 변환, 할인율 등 일상 계산을 한 곳에서 해결하세요.",
    type: "website",
    url: "/calculator",
  },
  twitter: {
    card: "summary_large_image",
    title: "만능 계산기",
    description: "연봉, BMI, 단위변환, 할인율 — 일상 계산을 한 곳에서",
  },
  alternates: {
    canonical: "/calculator",
  },
};

export default function Layout({ children }) {
  return children;
}
