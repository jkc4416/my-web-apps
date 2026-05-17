import Link from "next/link";

const apps = [
  {
    id: 1,
    name: "이름궁합",
    description: "두 사람의 이름으로 운명을 읽다",
    href: "/name-test",
    emoji: "💕",
    gradient: "from-rose-500/20 to-pink-500/20",
    border: "hover:border-rose-500/30",
    glow: "group-hover:shadow-rose-500/10",
    accent: "text-rose-400",
    size: "normal",
  },
  {
    id: 2,
    name: "만능 계산기",
    description: "연봉, BMI, 단위변환까지 한 곳에서",
    href: "/calculator",
    emoji: "🧮",
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "hover:border-blue-500/30",
    glow: "group-hover:shadow-blue-500/10",
    accent: "text-blue-400",
    size: "featured",
  },
  {
    id: 3,
    name: "MBTI 인사이트",
    description: "16가지 유형 깊이 분석",
    href: "/mbti",
    emoji: "🧠",
    gradient: "from-violet-500/20 to-purple-500/20",
    border: "hover:border-violet-500/30",
    glow: "group-hover:shadow-violet-500/10",
    accent: "text-violet-400",
    size: "featured",
  },
  {
    id: 4,
    name: "맞춤법 왕",
    description: "헷갈리는 맞춤법 퀴즈 챌린지",
    href: "/spelling",
    emoji: "✏️",
    gradient: "from-emerald-500/20 to-green-500/20",
    border: "hover:border-emerald-500/30",
    glow: "group-hover:shadow-emerald-500/10",
    accent: "text-emerald-400",
    size: "normal",
  },
  {
    id: 5,
    name: "사운드포커스",
    description: "자연의 소리로 집중력 부스트",
    href: "/sound",
    emoji: "🎧",
    gradient: "from-cyan-500/20 to-teal-500/20",
    border: "hover:border-cyan-500/30",
    glow: "group-hover:shadow-cyan-500/10",
    accent: "text-cyan-400",
    size: "normal",
  },
  {
    id: 6,
    name: "투자 시뮬레이터",
    description: "복리의 마법을 시뮬레이션",
    href: "/invest",
    emoji: "📈",
    gradient: "from-amber-500/20 to-orange-500/20",
    border: "hover:border-amber-500/30",
    glow: "group-hover:shadow-amber-500/10",
    accent: "text-amber-400",
    size: "normal",
  },
  {
    id: 7,
    name: "컬러크래프트",
    description: "나만의 색상 팔레트 생성기",
    href: "/color",
    emoji: "🎨",
    gradient: "from-fuchsia-500/20 to-pink-500/20",
    border: "hover:border-fuchsia-500/30",
    glow: "group-hover:shadow-fuchsia-500/10",
    accent: "text-fuchsia-400",
    size: "normal",
  },
  {
    id: 8,
    name: "타이핑 챌린지",
    description: "타자 속도와 정확도 측정",
    href: "/typing",
    emoji: "⌨️",
    gradient: "from-yellow-500/20 to-amber-500/20",
    border: "hover:border-yellow-500/30",
    glow: "group-hover:shadow-yellow-500/10",
    accent: "text-yellow-400",
    size: "featured",
  },
  {
    id: 9,
    name: "밥뭐먹지",
    description: "랜덤 메뉴 룰렛으로 결정",
    href: "/menu",
    emoji: "🍽️",
    gradient: "from-orange-500/20 to-red-500/20",
    border: "hover:border-orange-500/30",
    glow: "group-hover:shadow-orange-500/10",
    accent: "text-orange-400",
    size: "featured",
  },
  {
    id: 10,
    name: "디데이 메이커",
    description: "중요한 날까지 카운트다운",
    href: "/dday",
    emoji: "📅",
    gradient: "from-sky-500/20 to-indigo-500/20",
    border: "hover:border-sky-500/30",
    glow: "group-hover:shadow-sky-500/10",
    accent: "text-sky-400",
    size: "normal",
  },
  {
    id: 11,
    name: "스네이크 게임",
    description: "클래식 뱀 게임 — 최고 점수에 도전",
    href: "/snake",
    emoji: "🐍",
    gradient: "from-green-500/20 to-emerald-500/20",
    border: "hover:border-green-500/30",
    glow: "group-hover:shadow-green-500/10",
    accent: "text-green-400",
    size: "featured",
  },
  {
    id: 12,
    name: "플래피버드",
    description: "원터치 점프로 파이프 통과!",
    href: "/flappy",
    emoji: "🐤",
    gradient: "from-amber-500/20 to-yellow-500/20",
    border: "hover:border-amber-500/30",
    glow: "group-hover:shadow-amber-500/10",
    accent: "text-amber-400",
    size: "normal",
  },
  {
    id: 13,
    name: "햄스터 키우기",
    description: "귀여운 가상 펫 육성 게임",
    href: "/hamster",
    emoji: "🐹",
    gradient: "from-orange-500/20 to-amber-500/20",
    border: "hover:border-orange-500/30",
    glow: "group-hover:shadow-orange-500/10",
    accent: "text-orange-400",
    size: "featured",
  },
  {
    id: 14,
    name: "사주 & 오늘의 운세",
    description: "사주팔자 분석과 매일 바뀌는 운세",
    href: "/fortune",
    emoji: "🔮",
    gradient: "from-purple-500/20 to-pink-500/20",
    border: "hover:border-purple-500/30",
    glow: "group-hover:shadow-purple-500/10",
    accent: "text-purple-400",
    size: "featured",
  },
  {
    id: 15, name: "밸런스 게임", description: "어려운 양자택일 30제", href: "/balance", emoji: "⚖️",
    gradient: "from-pink-500/20 to-purple-500/20", border: "hover:border-pink-500/30", glow: "group-hover:shadow-pink-500/10", accent: "text-pink-400", size: "normal",
  },
  {
    id: 16, name: "QR코드 생성기", description: "텍스트·URL을 QR코드로 변환", href: "/qrcode", emoji: "📱",
    gradient: "from-blue-500/20 to-green-500/20", border: "hover:border-blue-500/30", glow: "group-hover:shadow-blue-500/10", accent: "text-blue-400", size: "normal",
  },
  {
    id: 17, name: "2048", description: "타일을 합쳐 2048을 만드세요!", href: "/game2048", emoji: "🔢",
    gradient: "from-amber-500/20 to-orange-500/20", border: "hover:border-amber-500/30", glow: "group-hover:shadow-amber-500/10", accent: "text-amber-400", size: "featured",
  },
  {
    id: 18, name: "글자수 세기", description: "실시간 글자수·단어수·바이트 카운터", href: "/charcount", emoji: "📝",
    gradient: "from-sky-500/20 to-indigo-500/20", border: "hover:border-sky-500/30", glow: "group-hover:shadow-sky-500/10", accent: "text-sky-400", size: "normal",
  },
  {
    id: 19, name: "닮은 동물 테스트", description: "나와 닮은 동물은?", href: "/animal-test", emoji: "🐾",
    gradient: "from-amber-500/20 to-orange-500/20", border: "hover:border-amber-500/30", glow: "group-hover:shadow-amber-500/10", accent: "text-amber-400", size: "featured",
  },
  {
    id: 20, name: "나이 계산기", description: "만 나이, 띠, 별자리, 생일 계산", href: "/age-calc", emoji: "🎂",
    gradient: "from-pink-500/20 to-purple-500/20", border: "hover:border-pink-500/30", glow: "group-hover:shadow-pink-500/10", accent: "text-pink-400", size: "normal",
  },
  {
    id: 21, name: "비밀번호 생성기", description: "안전한 랜덤 비밀번호 즉시 생성", href: "/password", emoji: "🔐",
    gradient: "from-emerald-500/20 to-cyan-500/20", border: "hover:border-emerald-500/30", glow: "group-hover:shadow-emerald-500/10", accent: "text-emerald-400", size: "normal",
  },
  {
    id: 22, name: "한글 워들", description: "매일 새로운 한글 단어 맞추기", href: "/wordle-kr", emoji: "🟩",
    gradient: "from-green-500/20 to-yellow-500/20", border: "hover:border-green-500/30", glow: "group-hover:shadow-green-500/10", accent: "text-green-400", size: "featured",
  },
  {
    id: 23, name: "전생 테스트", description: "생년월일로 알아보는 나의 전생", href: "/past-life", emoji: "🔮",
    gradient: "from-violet-500/20 to-pink-500/20", border: "hover:border-violet-500/30", glow: "group-hover:shadow-violet-500/10", accent: "text-violet-400", size: "normal",
  },
  {
    id: 24, name: "연애 타로", description: "3장의 카드로 보는 연애운", href: "/tarot", emoji: "🃏",
    gradient: "from-fuchsia-500/20 to-purple-500/20", border: "hover:border-fuchsia-500/30", glow: "group-hover:shadow-fuchsia-500/10", accent: "text-fuchsia-400", size: "normal",
  },
  {
    id: 25, name: "지뢰찾기", description: "클래식 마인스위퍼 3단계 난이도", href: "/minesweeper", emoji: "💣",
    gradient: "from-blue-500/20 to-violet-500/20", border: "hover:border-blue-500/30", glow: "group-hover:shadow-blue-500/10", accent: "text-blue-400", size: "featured",
  },
  {
    id: 26, name: "틱택토", description: "AI와 대결하는 삼목 게임", href: "/tictactoe", emoji: "❌",
    gradient: "from-red-500/20 to-amber-500/20", border: "hover:border-red-500/30", glow: "group-hover:shadow-red-500/10", accent: "text-red-400", size: "normal",
  },
  {
    id: 27, name: "단위 변환기", description: "길이·무게·온도·넓이·속도 즉시 변환", href: "/unit-convert", emoji: "🔄",
    gradient: "from-cyan-500/20 to-green-500/20", border: "hover:border-cyan-500/30", glow: "group-hover:shadow-cyan-500/10", accent: "text-cyan-400", size: "normal",
  },
];

export default function Home() {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 20% 0%, rgba(120,60,200,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(60,120,200,0.1) 0%, transparent 50%), #0a0a0f",
      }}
    >
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          animation: "grain 8s steps(10) infinite",
        }}
      />

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[500px] h-[500px] opacity-[0.07]"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.8), transparent 70%)",
            top: "-10%",
            right: "-10%",
            animation: "blob 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] opacity-[0.05]"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.8), transparent 70%)",
            bottom: "0%",
            left: "-5%",
            animation: "blob 25s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] opacity-[0.04]"
          style={{
            background:
              "radial-gradient(circle, rgba(236,72,153,0.8), transparent 70%)",
            top: "50%",
            left: "50%",
            animation: "blob 18s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <header className="pt-16 sm:pt-24 pb-12 sm:pb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#4ade80", boxShadow: "0 0 8px #4ade8060" }}
            />
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {apps.length} Apps Live
            </span>
          </div>

          <h1
            className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] mb-4"
            style={{
              background:
                "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 50%, rgba(168,85,247,0.8) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            무료 온라인 도구
            <br />
            & 게임 모음
          </h1>

          <p
            className="text-base sm:text-lg max-w-lg leading-relaxed"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            이름궁합, MBTI, 계산기, 맞춤법 퀴즈, 오늘의 운세부터
            스네이크, 햄스터 키우기까지 — 설치 없이 바로 사용하세요.
          </p>
        </header>

        {/* Intro section */}
        <section className="max-w-3xl pb-12 sm:pb-16" style={{ color: "rgba(255,255,255,0.55)" }}>
          <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: "rgba(255,255,255,0.85)" }}>
            한국어 사용자를 위한 27가지 무료 웹 도구·게임
          </h2>
          <p className="text-sm sm:text-base leading-relaxed mb-3">
            <strong style={{ color: "rgba(255,255,255,0.75)" }}>FunAppBox</strong>는 일상에서 자주 필요한 도구와
            짧은 휴식 시간에 즐길 수 있는 미니 게임을 한 곳에 모아둔 무료 웹 서비스입니다.
            연봉 계산기·디데이·QR코드 같은 실용 도구부터, 한글 워들·플래피버드·햄스터 키우기 같은
            캐주얼 게임까지 모두 <strong style={{ color: "rgba(255,255,255,0.75)" }}>회원가입 없이 무료</strong>로
            바로 사용할 수 있습니다.
          </p>
          <p className="text-sm sm:text-base leading-relaxed">
            모든 도구는 한국어 사용자에게 최적화되어 있으며 (한글 IME 처리, 한국식 만 나이, 한국식 사주팔자 등),
            입력한 데이터는 사용자의 브라우저에만 저장되어 외부로 전송되지 않습니다.
          </p>
        </section>

        {/* Why FunAppBox */}
        <section className="pb-12 sm:pb-16">
          <h2 className="text-lg sm:text-xl font-bold mb-6" style={{ color: "rgba(255,255,255,0.85)" }}>
            왜 FunAppBox인가요?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              { icon: "⚡", title: "설치 없이 즉시 사용", desc: "브라우저만 있으면 됩니다. 앱 다운로드, 회원가입 모두 불필요." },
              { icon: "🆓", title: "100% 무료", desc: "모든 도구와 게임이 영구 무료. 결제·구독 시스템 없음." },
              { icon: "🔒", title: "개인정보 보호", desc: "입력값은 사용자 브라우저(localStorage)에만 저장. 서버 전송 없음." },
              { icon: "🇰🇷", title: "한국어 최적화", desc: "한글 IME, 만 나이, 사주팔자, 맞춤법 등 한국식 기능 다수." },
              { icon: "📱", title: "모바일·PC 모두 지원", desc: "반응형 디자인으로 어떤 기기에서도 잘 동작합니다." },
              { icon: "🚀", title: "빠른 로딩", desc: "정적 사전 렌더링(SSG)으로 1초 이내 즉시 로드." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl p-4 sm:p-5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="text-sm sm:text-base font-bold mb-1" style={{ color: "rgba(255,255,255,0.85)" }}>{item.title}</h3>
                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories overview */}
        <section className="pb-8 sm:pb-10">
          <h2 className="text-lg sm:text-xl font-bold mb-3" style={{ color: "rgba(255,255,255,0.85)" }}>
            어떤 도구·게임이 있나요?
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
            27개의 앱이 4개 카테고리로 나뉘어 있습니다. 아래에서 원하는 카테고리를 둘러보세요.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "🛠️ 실용 도구", count: 10, color: "#22c55e", desc: "계산기·QR·디데이·색상·단위변환" },
              { label: "🔮 테스트·점술", count: 8, color: "#a855f7", desc: "MBTI·운세·타로·이름궁합·맞춤법" },
              { label: "🎮 미니 게임", count: 8, color: "#fbbf24", desc: "워들·2048·스네이크·플래피·햄스터" },
              { label: "📊 기타", count: 1, color: "#60a5fa", desc: "투자 시뮬레이터" },
            ].map((cat) => (
              <div key={cat.label} className="rounded-xl p-3 sm:p-4 text-center" style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${cat.color}20` }}>
                <div className="text-xs sm:text-sm font-bold mb-1" style={{ color: cat.color }}>{cat.label}</div>
                <div className="text-2xl font-black tabular-nums mb-1" style={{ color: "rgba(255,255,255,0.85)" }}>{cat.count}개</div>
                <div className="text-[10px] sm:text-xs leading-tight" style={{ color: "rgba(255,255,255,0.4)" }}>{cat.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pb-24">
          {apps.map((app, index) => (
            <Link
              key={app.id}
              href={app.href}
              className={`group relative rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 transition-all duration-500 hover:-translate-y-1 ${app.border} ${app.glow} hover:shadow-2xl ${
                app.size === "featured" ? "sm:col-span-2" : ""
              }`}
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
                animation: `fadeInUp 0.6s ${index * 0.06}s both`,
              }}
            >
              {/* Hover gradient overlay */}
              <div
                className={`absolute inset-0 rounded-[20px] sm:rounded-[24px] bg-gradient-to-br ${app.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Content */}
              <div className="relative z-10">
                <div
                  className="text-3xl sm:text-4xl mb-4 transition-transform duration-500 group-hover:scale-110 inline-block"
                  style={{ filter: "saturate(0.9)" }}
                >
                  {app.emoji}
                </div>

                <div
                  className={`flex items-center gap-2 ${
                    app.size === "featured" ? "sm:flex-row" : "flex-col items-start"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <h2
                      className={`font-bold tracking-tight mb-1.5 transition-colors duration-300 text-base sm:text-lg ${app.accent} group-hover:text-white`}
                      style={{ color: "rgba(255,255,255,0.85)" }}
                    >
                      {app.name}
                    </h2>
                    <p
                      className="text-xs sm:text-sm leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                    >
                      {app.description}
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <div
                  className="absolute top-5 right-5 sm:top-6 sm:right-6 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    <path
                      d="M1 7h12m0 0L8 2m5 5L8 12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Shimmer effect on hover */}
              <div
                className="absolute inset-0 rounded-[20px] sm:rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s linear infinite",
                  }}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Usage guide */}
        <section className="pb-12 sm:pb-16">
          <h2 className="text-lg sm:text-xl font-bold mb-4" style={{ color: "rgba(255,255,255,0.85)" }}>
            처음 오셨나요? 추천 사용법
          </h2>
          <div className="space-y-3">
            {[
              { step: "1", title: "관심 있는 카드를 탭하세요", desc: "위의 카드 그리드에서 끌리는 도구나 게임을 선택하면 즉시 실행됩니다." },
              { step: "2", title: "회원가입 불필요", desc: "어떤 정보도 입력할 필요 없이 바로 사용 가능합니다." },
              { step: "3", title: "기록은 자동 저장", desc: "게임 점수, 도구 설정 등은 브라우저에 자동으로 저장되어 다음 방문 시 그대로 이어집니다." },
              { step: "4", title: "결과를 공유해보세요", desc: "MBTI·타로·운세·게임 점수 등은 친구에게 카톡·인스타로 공유 가능합니다." },
            ].map((s) => (
              <div key={s.step} className="rounded-xl p-4 flex gap-4 items-start" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="text-xl font-black w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(168,85,247,0.15)", color: "#c084fc" }}>{s.step}</div>
                <div>
                  <div className="text-sm font-bold mb-1" style={{ color: "rgba(255,255,255,0.85)" }}>{s.title}</div>
                  <div className="text-xs sm:text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ section */}
        <section className="pb-12 sm:pb-16 max-w-3xl">
          <h2 className="text-lg sm:text-xl font-bold mb-6" style={{ color: "rgba(255,255,255,0.85)" }}>
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            {[
              { q: "정말 모두 무료인가요?", a: "네, 모든 27개 도구와 게임은 완전 무료입니다. 결제·구독·인앱 구매가 일절 없습니다. 사이트 운영비는 Google AdSense 광고로 충당합니다." },
              { q: "회원가입이 필요한가요?", a: "필요 없습니다. 모든 도구는 회원가입·로그인 없이 즉시 사용 가능합니다." },
              { q: "내가 입력한 정보(이름·생년월일 등)는 어디에 저장되나요?", a: "오직 사용자의 브라우저(localStorage)에만 저장됩니다. 서버나 외부로 절대 전송되지 않으며, 브라우저 데이터를 삭제하면 함께 사라집니다." },
              { q: "모바일에서도 잘 동작하나요?", a: "모든 도구는 모바일·PC 양쪽 모두 최적화되어 있습니다. 'iOS Safari 홈 화면에 추가'를 사용하면 앱처럼 사용할 수도 있습니다." },
              { q: "오프라인에서도 사용 가능한가요?", a: "한 번 페이지를 로드하면 대부분의 도구는 인터넷 없이도 동작합니다. 단, 첫 방문 시에는 인터넷이 필요합니다." },
              { q: "새로운 도구 제안은 어디로 보내나요?", a: "문의 페이지에서 이메일로 보내주세요. 사용자 제안을 적극 반영하고 있습니다." },
            ].map((item) => (
              <div key={item.q} className="rounded-xl p-4 sm:p-5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="text-sm sm:text-base font-bold mb-2" style={{ color: "rgba(255,255,255,0.85)" }}>Q. {item.q}</div>
                <div className="text-xs sm:text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>A. {item.a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SEO long-form content */}
        <section className="pb-12 max-w-3xl" style={{ color: "rgba(255,255,255,0.5)" }}>
          <h2 className="text-base sm:text-lg font-bold mb-3" style={{ color: "rgba(255,255,255,0.75)" }}>FunAppBox에 대해 더 알아보기</h2>
          <p className="text-sm leading-relaxed mb-3">
            FunAppBox는 일상에서 자주 필요한 작은 도구와 짧은 시간 즐길 수 있는 미니 게임을
            한 곳에 모아둔 무료 웹 서비스입니다. 매번 다른 사이트에서 계산기·단위변환·이름궁합을
            찾는 번거로움을 줄이고, 잠깐의 휴식 시간에 부담 없이 즐길 수 있는 캐주얼 게임을 제공합니다.
          </p>
          <p className="text-sm leading-relaxed mb-3">
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>실용 도구</strong>에는 만능 계산기,
            연봉 실수령액 계산, BMI 측정, 단위 변환기, 나이 계산기, 디데이 카운터, 비밀번호 생성기,
            QR코드 생성, 글자수 세기, 색상 도구가 포함됩니다. 일상적인 작업부터 디자이너·개발자의
            전문적인 작업까지 폭넓게 활용됩니다.
          </p>
          <p className="text-sm leading-relaxed mb-3">
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>테스트·점술</strong> 카테고리에는
            이름 궁합, MBTI 16가지 성격 분석, 동물 성격 테스트, 연애 타로, 전생 테스트, 오늘의
            사주 운세, 밸런스 게임, 한국어 맞춤법 퀴즈가 있습니다. 친구·가족과 결과를 공유하며
            즐길 수 있는 가벼운 심리·점술 콘텐츠입니다.
          </p>
          <p className="text-sm leading-relaxed mb-3">
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>미니 게임</strong>은 한글 워들,
            지뢰찾기, 2048, 틱택토, 스네이크, 플래피버드, 햄스터 키우기(다마고치), 타이핑 챌린지로
            구성됩니다. 클래식 게임부터 현대적인 픽셀 아트 게임까지 다양하게 준비되어 있습니다.
          </p>
          <p className="text-sm leading-relaxed">
            추가로 <strong style={{ color: "rgba(255,255,255,0.7)" }}>투자 시뮬레이터</strong>로
            과거 시점의 투자를 백테스트해볼 수 있습니다. 비트코인, 삼성전자, S&amp;P500 등 주요
            자산을 2005~2026년 사이 임의 시점에 투자했을 때의 수익률을 그래프로 확인하세요.
          </p>
        </section>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "FunAppBox",
              url: "https://www.funappbox.com",
              description: "무료 온라인 도구와 게임 모음 — 이름궁합, MBTI, 계산기, 운세, 스네이크, 햄스터 키우기 등 27가지",
              inLanguage: "ko",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.funappbox.com/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </div>
    </div>
  );
}
