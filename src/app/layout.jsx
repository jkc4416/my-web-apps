import "./globals.css";

export const metadata = {
  title: "웹 도구 모음 | 계산기, 테스트, 유틸리티",
  description:
    "연봉 계산기, 이름궁합, MBTI 테스트, 맞춤법 퀴즈, 타이핑 테스트 등 다양한 무료 온라인 도구",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
