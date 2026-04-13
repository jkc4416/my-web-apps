export const metadata = {
  title: "타이핑 챌린지 | 한글 타자 속도 측정",
  description:
    "한글 타이핑 속도와 정확도를 실시간으로 측정하세요. WPM(분당 타수) 기록으로 타자 실력 향상을 추적합니다. 무료 온라인 타자 연습.",
  keywords: [
    "타이핑 테스트",
    "타자 속도 측정",
    "한글 타자",
    "타자 연습",
    "WPM 측정",
    "타이핑 속도",
    "타자 실력",
    "분당 타수",
    "온라인 타자",
  ],
  openGraph: {
    title: "타이핑 챌린지 | 한글 타자 속도 측정",
    description:
      "한글 타이핑 속도와 정확도를 측정하세요. WPM 기록으로 실력 향상을 추적합니다.",
    type: "website",
    url: "/typing",
  },
  twitter: {
    card: "summary_large_image",
    title: "타이핑 챌린지",
    description: "한글 타자 속도 & 정확도 측정 — 무료 온라인 타이핑 테스트",
  },
  alternates: {
    canonical: "/typing",
  },
};

export default function Layout({ children }) {
  return children;
}
