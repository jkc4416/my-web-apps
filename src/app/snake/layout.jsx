export const metadata = {
  title: "스네이크 게임 | 클래식 뱀 게임",
  description:
    "브라우저에서 바로 즐기는 클래식 스네이크 게임. 화살표 키 또는 스와이프로 조작하고 최고 점수에 도전하세요. 모바일 지원.",
  keywords: [
    "스네이크 게임",
    "뱀 게임",
    "Snake Game",
    "온라인 게임",
    "브라우저 게임",
    "무료 게임",
    "레트로 게임",
    "미니 게임",
  ],
  openGraph: {
    title: "스네이크 게임 | 클래식 뱀 게임",
    description:
      "브라우저에서 바로 즐기는 클래식 스네이크 게임. 최고 점수에 도전하세요!",
    type: "website",
    url: "/snake",
  },
  twitter: {
    card: "summary_large_image",
    title: "스네이크 게임",
    description: "클래식 뱀 게임 — 브라우저에서 바로 플레이",
  },
  alternates: {
    canonical: "/snake",
  },
};

export default function Layout({ children }) {
  return children;
}
