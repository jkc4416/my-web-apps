import Script from "next/script";
import "./globals.css";

const GA_ID = "G-9B1VWBK256";
const ADSENSE_ID = "ca-pub-7511894317730921";
const SITE_URL = "https://www.funappbox.com";
const SITE_NAME = "FunAppBox";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FunAppBox — 무료 온라인 도구 & 게임 모음 | 이름궁합, MBTI, 계산기, 운세",
    template: "%s | FunAppBox",
  },
  description:
    "이름궁합 테스트, 만능 계산기, MBTI 분석, 맞춤법 퀴즈, 타이핑 테스트, 투자 시뮬레이터, 오늘의 운세, 스네이크 게임, 햄스터 키우기 등 14가지 무료 온라인 도구와 게임을 지금 바로 사용하세요.",
  keywords: [
    "무료 온라인 도구",
    "웹 도구 모음",
    "이름궁합 테스트",
    "MBTI 테스트",
    "맞춤법 퀴즈",
    "타이핑 테스트",
    "투자 시뮬레이터",
    "연봉 계산기",
    "색상 팔레트",
    "디데이 계산기",
    "메뉴 추천",
    "집중 사운드",
    "오늘의 운세",
    "사주팔자",
    "스네이크 게임",
    "플래피버드",
    "햄스터 키우기",
    "브라우저 게임",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "FunAppBox — 무료 온라인 도구 & 게임 14종",
    description:
      "이름궁합, MBTI, 계산기, 맞춤법, 운세, 스네이크, 햄스터 키우기 등 14가지 무료 웹 도구와 게임",
  },
  twitter: {
    card: "summary_large_image",
    title: "FunAppBox — 무료 온라인 도구 & 게임 14종",
    description:
      "이름궁합, MBTI, 계산기, 맞춤법, 운세, 스네이크, 햄스터 키우기 등 무료 웹 도구와 게임",
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
      "naver-site-verification": "fcc59b1aaa1b8cfdb86cfa6b79e45e74ce89c17f",
      "google-adsense-account": "ca-pub-7511894317730921",
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
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
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
