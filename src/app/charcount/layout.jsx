export const metadata = {
  title: "글자수 세기 — 실시간 글자수 카운터",
  description: "글자수, 단어수, 바이트, 문장수를 실시간으로 세어드립니다. 한글/영문/숫자/특수문자 구성 비율, 예상 읽기 시간까지. 블로그, 자소서, SNS 글 작성에 필수.",
  keywords: ["글자수 세기", "글자수 카운터", "바이트 계산", "단어수", "자소서 글자수", "글자 수 세기 사이트"],
  openGraph: { title: "글자수 세기 — 실시간 카운터", description: "글자수, 바이트, 단어수를 실시간으로 세기", type: "website", url: "https://www.funappbox.com/charcount" },
  twitter: { card: "summary_large_image", title: "글자수 세기", description: "실시간 글자수 카운터 — 무료" },
  alternates: { canonical: "https://www.funappbox.com/charcount" },
};
export default function Layout({ children }) { return children; }
