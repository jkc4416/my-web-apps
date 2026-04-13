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
              11 Apps Live
            </span>
          </div>

          <h1
            className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05] mb-4"
            style={{
              background:
                "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 50%, rgba(168,85,247,0.8) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Web Tools
            <br />
            Collection
          </h1>

          <p
            className="text-base sm:text-lg max-w-md leading-relaxed"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            유용하고 재미있는 미니 웹 앱 & 게임.
            <br />
            클릭 한 번으로 바로 사용하세요.
          </p>
        </header>

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

        {/* Footer */}
        <footer
          className="pb-12 text-center"
          style={{ color: "rgba(255,255,255,0.12)" }}
        >
          <div
            className="h-px max-w-xs mx-auto mb-6"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
            }}
          />
          <p className="text-xs tracking-widest uppercase">
            Built with Next.js
          </p>
        </footer>
      </div>
    </div>
  );
}
