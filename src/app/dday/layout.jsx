export const metadata = {
  title: "디데이 메이커 | D-Day 카운터 & 날짜 계산기",
  description:
    "시험, 기념일, 여행 등 중요한 날까지 남은 일수를 계산하세요. 여러 디데이를 등록하고 관리할 수 있는 무료 D-Day 카운터.",
  keywords: [
    "디데이",
    "D-Day",
    "디데이 계산기",
    "날짜 계산",
    "남은 일수",
    "기념일 계산",
    "카운트다운",
    "시험 디데이",
    "디데이 카운터",
    "날짜 카운터",
  ],
  openGraph: {
    title: "디데이 메이커 | D-Day 카운터 & 날짜 계산기",
    description:
      "중요한 날까지 남은 일수를 계산하세요. 여러 디데이를 등록하고 관리할 수 있습니다.",
    type: "website",
    url: "/dday",
  },
  twitter: {
    card: "summary_large_image",
    title: "디데이 메이커",
    description: "중요한 날까지 카운트다운 — 무료 D-Day 카운터",
  },
  alternates: {
    canonical: "/dday",
  },
};

export default function Layout({ children }) {
  return children;
}
