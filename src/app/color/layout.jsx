export const metadata = {
  title: "컬러크래프트 | 색상 팔레트 생성기",
  description:
    "유사색, 보색, 삼원색, 단색 조합으로 나만의 색상 팔레트를 만들어보세요. HEX 코드를 클릭 한 번으로 복사. 디자이너를 위한 무료 컬러 도구.",
  keywords: [
    "색상 팔레트",
    "컬러 팔레트",
    "색상 조합",
    "보색 찾기",
    "HEX 코드",
    "색상 생성기",
    "디자인 도구",
    "컬러 피커",
    "유사색",
    "컬러 스킴",
  ],
  openGraph: {
    title: "컬러크래프트 | 색상 팔레트 생성기",
    description:
      "유사색, 보색, 삼원색, 단색 조합으로 나만의 색상 팔레트를 만들어보세요.",
    type: "website",
    url: "/color",
  },
  twitter: {
    card: "summary_large_image",
    title: "컬러크래프트",
    description: "나만의 색상 팔레트 생성기 — 클릭으로 HEX 코드 복사",
  },
  alternates: {
    canonical: "/color",
  },
};

export default function Layout({ children }) {
  return children;
}
