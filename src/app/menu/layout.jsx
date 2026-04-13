export const metadata = {
  title: "밥뭐먹지 | 랜덤 메뉴 추천 룰렛",
  description:
    "오늘 뭐 먹을지 고민될 때! 한식, 중식, 일식, 양식, 분식 등 카테고리별로 랜덤 메뉴를 추천해드립니다. 점심 메뉴 고민 해결 룰렛.",
  keywords: [
    "밥뭐먹지",
    "메뉴 추천",
    "랜덤 메뉴",
    "점심 메뉴",
    "메뉴 룰렛",
    "오늘 뭐 먹지",
    "음식 추천",
    "랜덤 음식",
    "메뉴 고르기",
    "식사 추천",
  ],
  openGraph: {
    title: "밥뭐먹지 | 랜덤 메뉴 추천 룰렛",
    description:
      "오늘 뭐 먹을지 고민될 때! 카테고리별 랜덤 메뉴를 추천해드립니다.",
    type: "website",
    url: "/menu",
  },
  twitter: {
    card: "summary_large_image",
    title: "밥뭐먹지",
    description: "오늘 뭐 먹지? 랜덤 메뉴 룰렛으로 결정!",
  },
  alternates: {
    canonical: "/menu",
  },
};

export default function Layout({ children }) {
  return children;
}
