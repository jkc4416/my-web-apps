export const metadata = {
  title: "사이트 소개 — FunAppBox는 어떤 곳인가요?",
  description:
    "FunAppBox는 설치 없이 브라우저에서 바로 사용하는 무료 웹 도구와 미니 게임 모음 사이트입니다. 27가지 도구·게임의 미션, 운영 원칙, 만든 이유를 소개합니다.",
  alternates: { canonical: "https://www.funappbox.com/about" },
  openGraph: {
    title: "FunAppBox 사이트 소개",
    description: "27가지 무료 웹 도구와 게임을 한 곳에. 우리의 미션과 운영 원칙.",
    type: "website",
    url: "https://www.funappbox.com/about",
  },
};

export default function Layout({ children }) {
  return children;
}
