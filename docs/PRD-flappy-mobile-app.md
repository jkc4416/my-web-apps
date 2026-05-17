# PRD: 플래피버드 모바일 앱 (Capacitor)

## 1. 개요

FunAppBox의 플래피버드 웹 게임을 **Capacitor**를 활용하여 iOS / Android 네이티브 앱으로 패키징 및 배포한다.  
기존 React + Canvas 코드를 최대한 그대로 유지하면서, 네이티브 앱 경험(전체화면, 앱 아이콘, 스토어 배포)을 제공하는 것이 목표이다.

---

## 2. 목표

| 항목 | 내용 |
|------|------|
| 플랫폼 | iOS 15+, Android 8.0+ (API 26+) |
| 배포 채널 | Apple App Store, Google Play Store |
| 앱 이름 | 플래피버드 (Flappy Bird) |
| 번들 ID | `com.funappbox.flappybird` |
| 프레임워크 | Capacitor 6 (Ionic 팀 제공) |
| 코드 변경 범위 | 최소화 — Next.js 의존 제거 + 독립 빌드 설정만 추가 |

---

## 3. 현재 아키텍처 분석

### 3.1 게임 구성 파일

| 파일 | 역할 | 크기 |
|------|------|------|
| `src/app/flappy/page.jsx` | 게임 전체 로직 (단일 컴포넌트) | 568줄, 28KB |
| `src/app/flappy/layout.jsx` | SEO 메타데이터 (앱에서는 불필요) | 16줄 |
| `src/app/globals.css` | Tailwind + 애니메이션 keyframes | 57줄 |

### 3.2 의존성

| 구분 | 사용 여부 | 앱에서 필요 |
|------|-----------|-------------|
| React 19 (useState, useEffect, useRef, useCallback) | O | O |
| Next.js `Link` (홈 버튼) | O | **X — 제거/교체 필요** |
| Next.js `layout.jsx` (metadata) | O | **X — 불필요** |
| Tailwind CSS | O | O (빌드 시 포함) |
| Canvas API | O | O (WebView에서 동작) |
| localStorage | O | O (WebView에서 동작) |
| 외부 이미지/폰트 | X | - |
| 서버 사이드 기능 | X | - |

### 3.3 게임 특성 (모바일 호환성)

- **입력**: 탭(터치) 기반 — 모바일에 최적화되어 있음
- **렌더링**: Canvas 2D — WebView에서 완벽 동작
- **화면 크기**: 400×600 고정 캔버스, CSS로 중앙 정렬 — 반응형 스케일링 추가 필요
- **저장**: localStorage — WebView에서 기본 지원
- **네트워크**: 불필요 (완전 오프라인 동작)
- **성능**: 60fps requestAnimationFrame — 최신 모바일 WebView에서 문제 없음

---

## 4. 기술 구현 계획

### 4.1 프로젝트 구조

```
flappy-bird-app/               # 새로운 독립 프로젝트
├── src/
│   ├── App.jsx                 # 메인 컴포넌트 (page.jsx 기반)
│   ├── main.jsx                # React 엔트리포인트
│   ├── index.html              # SPA 진입점
│   └── styles.css              # Tailwind + 게임 CSS
├── public/
│   ├── icon.png                # 앱 아이콘 (1024×1024)
│   └── splash.png              # 스플래시 스크린
├── android/                    # Capacitor 자동 생성
├── ios/                        # Capacitor 자동 생성
├── capacitor.config.ts         # Capacitor 설정
├── vite.config.js              # Vite 빌드 설정
├── tailwind.config.js          # Tailwind 설정
├── package.json
└── README.md
```

### 4.2 기존 파일 → 새 프로젝트로 옮길 파일

| 원본 파일 | 목적지 | 수정 사항 |
|-----------|--------|-----------|
| `src/app/flappy/page.jsx` | `flappy-bird-app/src/App.jsx` | (1) `"use client"` 제거, (2) `import Link` 제거 → 홈 버튼 제거 또는 앱 종료 버튼으로 교체, (3) `export default` 유지, (4) 컴포넌트 이름 `App`으로 변경 |
| `src/app/globals.css` | `flappy-bird-app/src/styles.css` | Tailwind import 유지, 게임 관련 keyframes만 포함, 허브 페이지 전용 애니메이션 제거 |

> **layout.jsx는 옮기지 않는다** — SEO 메타데이터는 웹 전용이며, 앱에서는 네이티브 앱 설정으로 대체된다.

### 4.3 코드 수정 상세

#### A. Next.js 의존 제거

```jsx
// Before (page.jsx)
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// After (App.jsx)
import { useState, useEffect, useRef, useCallback } from "react";
```

#### B. 홈 버튼 교체

```jsx
// Before
<Link href="/" className="fixed top-4 left-4 ...">← 홈</Link>

// After — 앱에서는 불필요 (OS 뒤로가기로 대체) → 제거
```

#### C. 반응형 캔버스 스케일링 추가

```jsx
// 디바이스 화면에 맞게 캔버스 스케일링
const scale = Math.min(
  window.innerWidth / W,
  window.innerHeight / H
);
// canvas 외부 div에 transform: scale(scale) 적용
```

#### D. 모바일 최적화

```jsx
// 상태바 영역 안전 마진
<div style={{ paddingTop: "env(safe-area-inset-top)" }}>

// 터치 이벤트 기본 동작 방지 (스크롤/바운스 차단)
document.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
```

---

## 5. 구현 단계 (Step-by-step)

### Phase 1: 프로젝트 세팅 (1일)

```bash
# 1. 새 프로젝트 생성
npm create vite@latest flappy-bird-app -- --template react
cd flappy-bird-app

# 2. 의존성 설치
npm install
npm install -D tailwindcss @tailwindcss/vite

# 3. Capacitor 설치
npm install @capacitor/core @capacitor/cli
npx cap init "FlappyBird" "com.funappbox.flappybird"

# 4. 플랫폼 추가
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
```

### Phase 2: 코드 이식 (1일)

1. `page.jsx` → `App.jsx` 복사 및 수정 (위 4.3 참조)
2. `globals.css` → `styles.css` 복사 및 정리
3. Tailwind 설정
4. 로컬 브라우저에서 `npm run dev`로 동작 확인

### Phase 3: 네이티브 빌드 (1~2일)

```bash
# 웹 빌드
npm run build

# Capacitor에 웹 빌드 복사
npx cap sync

# iOS (Xcode 필요)
npx cap open ios

# Android (Android Studio 필요)
npx cap open android
```

### Phase 4: 앱 최적화 (2~3일)

- [ ] 앱 아이콘 제작 (1024×1024 PNG)
- [ ] 스플래시 스크린 제작
- [ ] 전체화면 모드 설정 (StatusBar 숨기기)
- [ ] 세로 고정 (orientation: portrait)
- [ ] 터치 바운스/줌 방지
- [ ] Safe area 대응 (노치/펀치홀)
- [ ] 캔버스 해상도 devicePixelRatio 대응
- [ ] 앱 종료 시 게임 상태 저장

### Phase 5: 스토어 배포 (3~5일)

**Apple App Store:**
- [ ] Apple Developer 계정 등록 ($99/년)
- [ ] App Store Connect에 앱 등록
- [ ] 스크린샷 (6.7", 6.5", 5.5" 각 최소 1장)
- [ ] 개인정보처리방침 URL
- [ ] 앱 심사 제출 (보통 24~48시간)

**Google Play Store:**
- [ ] Google Play Developer 계정 등록 ($25 일회성)
- [ ] Play Console에 앱 등록
- [ ] 스크린샷, 기능 그래픽 (1024×500)
- [ ] 개인정보처리방침 URL
- [ ] 내부 테스트 → 프로덕션 출시

---

## 6. Capacitor 설정

```typescript
// capacitor.config.ts
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.funappbox.flappybird",
  appName: "플래피버드",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0a1628",
    },
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#0a1628",
      showSpinner: false,
    },
  },
  ios: {
    contentInset: "always",
    preferredContentMode: "mobile",
  },
  android: {
    backgroundColor: "#0a1628",
  },
};

export default config;
```

---

## 7. 수익화 (선택)

| 방법 | 구현 난이도 | 비고 |
|------|-------------|------|
| AdMob 배너 광고 | 중 | `@capacitor-community/admob` 플러그인 |
| AdMob 전면 광고 (게임오버 시) | 중 | 게임오버 화면에 삽입 |
| 인앱 결제 (코인 패키지) | 상 | `@capacitor-community/in-app-purchase` |
| 광고 제거 유료 버전 | 중 | 별도 앱 또는 인앱 결제 |

> 초기 버전은 광고 없이 배포하고, 다운로드 추이를 보고 AdMob 추가 권장.

---

## 8. 타임라인

| 단계 | 기간 | 산출물 |
|------|------|--------|
| Phase 1: 프로젝트 세팅 | 1일 | Vite + Capacitor 프로젝트 |
| Phase 2: 코드 이식 | 1일 | 브라우저에서 동작하는 독립 게임 |
| Phase 3: 네이티브 빌드 | 1~2일 | iOS/Android 디바이스 테스트 |
| Phase 4: 앱 최적화 | 2~3일 | 최종 앱 (아이콘, 스플래시, UX) |
| Phase 5: 스토어 배포 | 3~5일 | App Store + Play Store 출시 |
| **합계** | **약 8~12일** | |

---

## 9. 필수 준비물

| 항목 | 상태 | 비용 |
|------|------|------|
| Mac (Xcode용) | 보유 | - |
| Xcode (최신) | 설치 필요 | 무료 |
| Android Studio | 설치 필요 | 무료 |
| Apple Developer 계정 | 미가입 | $99/년 |
| Google Play Developer 계정 | 미가입 | $25 일회성 |
| 앱 아이콘 (1024×1024) | 미제작 | 직접 제작 or 외주 |
| 개인정보처리방침 페이지 | 미작성 | funappbox.com에 추가 |

---

## 10. 리스크

| 리스크 | 영향 | 대응 |
|--------|------|------|
| iOS WebView 성능 이슈 | Canvas 프레임 드롭 | devicePixelRatio 조정, 렌더링 최적화 |
| App Store 심사 거절 | 배포 지연 | 가이드라인 사전 준수 (4.2 — 최소 기능) |
| "Flappy Bird" 상표 이슈 | 스토어 거절 가능 | 앱 이름을 "플래피 챌린지" 등으로 변경 |
| Safe area 미대응 | 노치에 UI 가림 | CSS env() + Capacitor 플러그인 |
