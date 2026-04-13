import Script from "next/script";
import "./globals.css";

const GA_ID = "G-9B1VWBK256";
const SITE_URL = "https://funappbox.com";
const SITE_NAME = "FunAppBox";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FunAppBox | 재미있는 웹 도구 모음",
    template: "%s | FunAppBox",
  },
  description:
    "이름궁합, 계산기, MBTI, 맞춤법 퀴즈, 타이핑 테스트, 투자 시뮬레이터 등 무료 온라인 도구",
  keywords: [
    "온라인 도구",
    "무료 계산기",
    "이름궁합",
    "MBTI 테스트",
    "맞춤법 퀴즈",
    "타이핑 테스트",
    "투자 시뮬레이터",
    "색상 팔레트",
    "디데이 계산기",
    "메뉴 추천",
    "집중 사운드",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "FunAppBox | 재미있는 웹 도구 모음",
    description:
      "이름궁합, 계산기, MBTI, 맞춤법 퀴즈 등 10가지 무료 온라인 도구",
  },
  twitter: {
    card: "summary_large_image",
    title: "FunAppBox | 무료 온라인 도구 10종",
    description:
      "이름궁합, 계산기, MBTI, 맞춤법 퀴즈 등 10가지 무료 온라인 도구",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: "cBLKQjaTrczqWZUpAzNwVJ-fB4hnxMyesvcRLS7_sAI",
    other: {
      "naver-site-verification": "naverf940320fdd24874640fa7506720856a2",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
