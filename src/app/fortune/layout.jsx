export const metadata = {
  title: "사주팔자 & 오늘의 운세 | 무료 운세 풀이",
  description:
    "생년월일로 보는 사주팔자 분석과 매일 바뀌는 오늘의 운세. 오행 분석, 성격 해석, 애정운, 재물운, 건강운까지 무료로 확인하세요.",
  keywords: [
    "사주팔자",
    "오늘의 운세",
    "무료 운세",
    "사주 풀이",
    "오행 분석",
    "띠 운세",
    "애정운",
    "재물운",
    "건강운",
    "토정비결",
  ],
  openGraph: {
    title: "사주팔자 & 오늘의 운세",
    description: "생년월일로 보는 사주팔자와 매일 바뀌는 오늘의 운세",
    type: "website",
    url: "/fortune",
  },
  twitter: {
    card: "summary_large_image",
    title: "사주팔자 & 오늘의 운세",
    description: "무료 사주 풀이와 오늘의 운세를 확인하세요",
  },
  alternates: { canonical: "/fortune" },
};

export default function Layout({ children }) {
  return children;
}
