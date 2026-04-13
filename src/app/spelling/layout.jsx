export const metadata = {
  title: "맞춤법 왕 | 헷갈리는 한국어 맞춤법 퀴즈",
  description:
    "왠지 vs 웬지, 됬다 vs 됐다, 안돼 vs 안되 — 자주 틀리는 한국어 맞춤법을 퀴즈로 재미있게 마스터하세요. 단계별 난이도로 실력을 테스트합니다.",
  keywords: [
    "맞춤법",
    "맞춤법 퀴즈",
    "한국어 맞춤법",
    "맞춤법 검사",
    "헷갈리는 맞춤법",
    "띄어쓰기",
    "국어 퀴즈",
    "맞춤법 테스트",
    "됬다 됐다",
    "왠지 웬지",
  ],
  openGraph: {
    title: "맞춤법 왕 | 헷갈리는 한국어 맞춤법 퀴즈",
    description:
      "자주 틀리는 한국어 맞춤법을 퀴즈로 재미있게 마스터하세요.",
    type: "website",
    url: "/spelling",
  },
  twitter: {
    card: "summary_large_image",
    title: "맞춤법 왕",
    description: "왠지? 웬지? 됬다? 됐다? — 헷갈리는 맞춤법 퀴즈 도전!",
  },
  alternates: {
    canonical: "/spelling",
  },
};

export default function Layout({ children }) {
  return children;
}
