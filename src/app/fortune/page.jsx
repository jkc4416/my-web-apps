"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

// ===== 천간 & 지지 =====
const 천간 = ["갑","을","병","정","무","기","경","신","임","계"];
const 지지 = ["자","축","인","묘","진","사","오","미","신","유","술","해"];
const 띠이름 = ["쥐","소","호랑이","토끼","용","뱀","말","양","원숭이","닭","개","돼지"];
const 띠이모지 = ["🐭","🐮","🐯","🐰","🐲","🐍","🐴","🐑","🐵","🐔","🐶","🐷"];
const 오행 = ["목","화","토","금","수"];
const 오행한자 = ["木","火","土","金","水"];
const 오행색 = ["#4ade80","#ef4444","#fbbf24","#c0c0c0","#60a5fa"];
const 오행이모지 = ["🌳","🔥","🏔️","⚔️","💧"];
const 음양 = ["양","음"];

// 천간 → 오행 매핑: 갑을=목, 병정=화, 무기=토, 경신=금, 임계=수
const 천간오행 = [0,0,1,1,2,2,3,3,4,4];
// 지지 → 오행 매핑: 자=수,축=토,인=목,묘=목,진=토,사=화,오=화,미=토,신=금,유=금,술=토,해=수
const 지지오행 = [4,2,0,0,2,1,1,2,3,3,2,4];
// 천간 음양: 갑병무경임=양, 을정기신계=음
const 천간음양 = [0,1,0,1,0,1,0,1,0,1];

// 시간 → 시주 지지 (시간대별)
const 시간지지 = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11]; // 23-1=자, 1-3=축...

// ===== 사주 계산 =====
function calc년주(year) {
  const g = (year - 4) % 10;
  const z = (year - 4) % 12;
  return { 간: (g + 10) % 10, 지: (z + 12) % 12 };
}

function calc월주(year, month) {
  const yearGan = (year - 4) % 10;
  const baseGan = (yearGan % 5) * 2 + 2;
  const g = (baseGan + month - 1) % 10;
  const z = (month + 1) % 12;
  return { 간: g, 지: z };
}

function calc일주(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const y = year - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + 1721119;
  const g = (jdn + 9) % 10;
  const z = (jdn + 1) % 12;
  return { 간: g, 지: z };
}

function calc시주(dayGan, hour) {
  const z = 시간지지[hour];
  const baseGan = (dayGan % 5) * 2;
  const g = (baseGan + z) % 10;
  return { 간: g, 지: z };
}

// ===== 해시 함수 (운세용) =====
function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function getDailyHash(birth, category) {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  return hashCode(`${birth}-${category}-${dateStr}`);
}

// ===== 텍스트 데이터 =====
const 일간성격 = {
  갑: { title: "큰 나무", desc: "곧고 정직하며 리더십이 강합니다. 한번 정한 목표는 끝까지 밀고 나가는 추진력의 소유자. 다만 고집이 세고 융통성이 부족할 수 있습니다.", trait: ["리더십","정직함","추진력","독립심"], weak: ["고집","완고함","타협 부족"] },
  을: { title: "풀과 꽃", desc: "유연하고 적응력이 뛰어납니다. 부드러운 카리스마로 사람을 끄는 매력이 있으며, 예술적 감각이 뛰어납니다. 때로 우유부단할 수 있습니다.", trait: ["유연함","예술적 감각","사교성","인내심"], weak: ["우유부단","의존성","소극적"] },
  병: { title: "태양", desc: "밝고 활발한 에너지의 소유자. 뜨거운 열정으로 주변을 밝히는 태양 같은 사람. 화끈한 성격으로 시원시원하지만 다혈질일 수 있습니다.", trait: ["열정","밝은 에너지","화끈함","솔직함"], weak: ["다혈질","성급함","과시욕"] },
  정: { title: "촛불", desc: "따뜻하고 세심한 성격. 조용히 빛을 내며 주변을 돌보는 섬세한 사람. 감수성이 풍부하고 직관력이 뛰어나지만 걱정이 많을 수 있습니다.", trait: ["섬세함","직관력","따뜻함","감수성"], weak: ["걱정 과다","신경질","완벽주의"] },
  무: { title: "산", desc: "듬직하고 안정적인 성격. 넓은 포용력으로 사람들에게 신뢰를 줍니다. 묵묵히 자기 자리를 지키는 신뢰의 상징이지만 변화를 싫어합니다.", trait: ["안정감","포용력","신뢰","묵직함"], weak: ["보수적","게으름","변화 거부"] },
  기: { title: "논밭", desc: "실용적이고 현실적인 성격. 꼼꼼하게 계획하고 착실하게 실행하는 능력자. 재물 운용에 밝고 실리를 추구합니다.", trait: ["실용적","꼼꼼함","재물운","현실감각"], weak: ["소심함","계산적","인색"] },
  경: { title: "바위·칼", desc: "강인하고 결단력 있는 성격. 의리를 중시하고 불의를 참지 못합니다. 거친 카리스마가 있으나 독선적일 수 있습니다.", trait: ["결단력","의리","강인함","정의감"], weak: ["독선","무뚝뚝","과격함"] },
  신: { title: "보석", desc: "섬세하고 예리한 성격. 완벽을 추구하며 미적 감각이 뛰어납니다. 날카로운 분석력이 장점이지만 예민하고 까다로울 수 있습니다.", trait: ["예리함","미적 감각","분석력","완벽추구"], weak: ["예민함","까다로움","비판적"] },
  임: { title: "큰 바다", desc: "넓고 깊은 지혜의 소유자. 포용력이 크고 지적 호기심이 강합니다. 자유로운 영혼으로 창의적이지만 방향을 잃기 쉽습니다.", trait: ["지혜","포용력","창의성","자유로움"], weak: ["방황","무계획","변덕"] },
  계: { title: "이슬·비", desc: "조용하고 깊은 내면의 소유자. 직감이 강하고 영적 감수성이 뛰어납니다. 겉은 차분하나 속은 깊은 감정을 품고 있습니다.", trait: ["직감","깊은 내면","차분함","영성"], weak: ["폐쇄적","우울","비밀주의"] },
};

const 오행해석 = {
  목: "성장과 발전의 기운. 새로운 시작과 창의성에 유리합니다.",
  화: "열정과 표현의 기운. 인간관계와 명예에 영향을 줍니다.",
  토: "안정과 중재의 기운. 신뢰와 재물 축적에 도움됩니다.",
  금: "결단과 완성의 기운. 집중력과 실행력을 높여줍니다.",
  수: "지혜와 소통의 기운. 학문과 교류에 유리합니다.",
};

// 운세 텍스트 풀 (각 카테고리 12개씩)
const 운세풀 = {
  총운: [
    "오늘은 에너지가 넘치는 하루! 적극적으로 행동하면 좋은 결과가 있을 거예요.",
    "차분하게 하루를 보내는 것이 좋겠어요. 급하게 결정하지 말고 신중하게.",
    "예상치 못한 기회가 찾아올 수 있어요. 열린 마음으로 받아들이세요.",
    "주변 사람들과의 소통이 중요한 날이에요. 대화에서 답을 찾을 수 있어요.",
    "작은 일에도 감사하는 마음을 가지면 하루가 풍요로워질 거예요.",
    "오늘은 자기 자신에게 집중하는 시간을 가져보세요. 내면의 목소리에 귀 기울이세요.",
    "활발한 활동이 행운을 가져다줄 거예요. 움직이는 만큼 성과가 있어요.",
    "오래된 고민이 해결의 실마리를 찾는 날이에요. 긍정적으로 생각하세요.",
    "새로운 만남이나 인연이 있을 수 있어요. 외출 시 좋은 일이 생겨요.",
    "계획대로 진행하면 순조로운 하루가 될 거예요. 루틴을 지키세요.",
    "창의적인 아이디어가 떠오르는 날이에요. 메모해두면 나중에 큰 도움이 될 거예요.",
    "마음의 여유를 가지는 것이 중요해요. 조급해하지 마세요.",
  ],
  애정: [
    "연인과 달콤한 시간을 보낼 수 있는 날이에요. 사소한 표현이 큰 감동을 줘요.",
    "솔로라면 새로운 인연의 기운이 감돌아요. 외모에 신경 써보세요.",
    "상대방의 말에 귀 기울이면 관계가 더 깊어질 거예요.",
    "오해가 생길 수 있으니 솔직한 대화가 필요해요.",
    "오늘은 혼자만의 시간이 필요할 수 있어요. 상대를 존중해주세요.",
    "오래된 친구나 지인에게서 좋은 소식이 올 수 있어요.",
    "감정 표현을 아끼지 마세요. 진심은 반드시 통합니다.",
    "연애보다 자기 개발에 집중하면 더 매력적인 사람이 될 거예요.",
    "뜻밖의 고백이나 호감 표현을 받을 수 있어요.",
    "가족이나 가까운 사람에게 감사의 마음을 전해보세요.",
    "썸 타는 사이라면 오늘 용기를 내보세요. 좋은 결과가 있을 거예요.",
    "과거의 인연을 떠올리게 되는 날이에요. 미련보다는 교훈을 얻으세요.",
  ],
  재물: [
    "예상치 못한 수입이 생길 수 있어요. 재물운이 좋은 날!",
    "충동구매를 조심하세요. 오늘은 지갑을 꼭 닫아두세요.",
    "투자보다는 저축에 집중하는 것이 좋은 날이에요.",
    "지인을 통해 좋은 재테크 정보를 얻을 수 있어요.",
    "큰 지출은 피하고 소소한 행복에 투자하세요.",
    "그동안의 노력이 금전적 보상으로 돌아올 수 있어요.",
    "새로운 수입원을 모색해보기 좋은 때예요.",
    "빌려준 돈이 돌아오거나 잊었던 수입이 들어올 수 있어요.",
    "오늘은 아끼는 것이 미덕이에요. 절약 정신을 발휘하세요.",
    "재물 관련 서류나 계약은 꼼꼼히 확인하세요.",
    "부수입이나 보너스의 기운이 있어요. 열심히 하면 보상이 따라요.",
    "돈보다 사람이 중요한 날이에요. 인간관계에 투자하세요.",
  ],
  건강: [
    "가벼운 운동으로 몸을 풀어주면 컨디션이 좋아질 거예요.",
    "수분 섭취를 충분히 하세요. 물을 많이 마시면 좋은 날이에요.",
    "과식을 주의하세요. 소화기관에 부담을 줄 수 있어요.",
    "스트레칭으로 뭉친 근육을 풀어주면 기분도 상쾌해져요.",
    "충분한 수면이 필요한 날이에요. 일찍 잠자리에 들어보세요.",
    "야외 활동이 건강에 좋은 날이에요. 산책이라도 해보세요.",
    "눈의 피로에 주의하세요. 디지털 기기 사용을 줄여보세요.",
    "비타민이 풍부한 과일을 섭취하면 좋겠어요.",
    "감기 기운을 조심하세요. 따뜻하게 입으세요.",
    "명상이나 요가로 마음의 안정을 찾아보세요.",
    "무리한 운동보다는 가볍게 걷는 것이 좋아요.",
    "오늘은 에너지가 넘치는 날! 하고 싶던 운동에 도전해보세요.",
  ],
  직장: [
    "업무에서 좋은 성과를 낼 수 있는 날이에요. 집중하세요!",
    "동료와의 협업이 빛을 발하는 날이에요. 소통이 핵심이에요.",
    "새로운 프로젝트나 업무 제안이 들어올 수 있어요.",
    "오늘은 꼼꼼하게 일하는 것이 중요해요. 실수를 줄이세요.",
    "상사의 인정을 받을 수 있는 기회가 있어요. 최선을 다하세요.",
    "학업이나 자격증 공부에 집중하면 좋은 결과가 있을 거예요.",
    "회의나 발표에서 자신감을 가지세요. 좋은 반응이 올 거예요.",
    "루틴한 업무보다 창의적인 접근이 필요한 날이에요.",
    "직장 내 인간관계에 신경 쓰면 도움이 돼요.",
    "지금 하는 일의 방향이 맞는지 점검해볼 시간이에요.",
    "멀티태스킹보다 한 가지에 집중하는 것이 효율적이에요.",
    "업무 스트레스를 풀 수 있는 취미활동을 찾아보세요.",
  ],
};

const 럭키색 = [
  { name: "빨간색", color: "#ef4444" }, { name: "주황색", color: "#f97316" },
  { name: "노란색", color: "#eab308" }, { name: "초록색", color: "#22c55e" },
  { name: "파란색", color: "#3b82f6" }, { name: "남색", color: "#6366f1" },
  { name: "보라색", color: "#a855f7" }, { name: "분홍색", color: "#ec4899" },
  { name: "하늘색", color: "#38bdf8" }, { name: "금색", color: "#fbbf24" },
];
const 럭키방향 = ["동쪽","서쪽","남쪽","북쪽","동남쪽","서남쪽","동북쪽","서북쪽"];
const 럭키음식 = ["국밥","비빔밥","치킨","파스타","초밥","떡볶이","샐러드","삼겹살","칼국수","카레","김치찌개","된장찌개","햄버거","우동","볶음밥"];

const 띠운세 = [
  "새로운 기회가 다가오는 시기! 주저하지 말고 도전하세요.",
  "꾸준함이 빛을 발하는 때. 묵묵히 자기 길을 가세요.",
  "리더십을 발휘할 기회가 와요. 자신감을 가지세요.",
  "예상치 못한 행운이 찾아와요. 열린 마음으로 받아들이세요.",
  "큰 그림을 그릴 때! 원대한 계획을 세워보세요.",
  "지혜로운 판단이 필요해요. 신중하게 결정하세요.",
  "활발한 활동이 행운을 불러와요. 적극적으로 움직이세요.",
  "부드러운 태도가 행복을 가져와요. 양보의 미덕을 발휘하세요.",
  "재치와 유머로 인기를 끌어요. 사교활동에 유리해요.",
  "완벽을 추구하면 좋은 결과가 와요. 디테일에 신경 쓰세요.",
  "충성스러운 인연이 복을 가져와요. 사람을 소중히 하세요.",
  "재물운이 상승하는 시기! 재테크에 관심을 가져보세요.",
];

const SAVE_KEY = "fortune-birth";

export default function FortunePage() {
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthHour, setBirthHour] = useState("-1"); // -1 = 모름
  const [gender, setGender] = useState("male");
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState("saju");

  // Load saved data
  useEffect(() => {
    let saved; try { saved = localStorage.getItem(SAVE_KEY); } catch {}
    if (saved) {
      const d = JSON.parse(saved);
      setBirthYear(d.year || ""); setBirthMonth(d.month || ""); setBirthDay(d.day || "");
      setBirthHour(d.hour ?? "-1"); setGender(d.gender || "male");
      if (d.year && d.month && d.day) { setShowResult(true); setActiveTab("fortune"); }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!birthYear || !birthMonth || !birthDay) return;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ year: birthYear, month: birthMonth, day: birthDay, hour: birthHour, gender })); } catch {}
    setShowResult(true);
    setActiveTab("saju");
  };

  const reset = () => { setShowResult(false); try { localStorage.removeItem(SAVE_KEY); } catch {} };

  // 사주 계산
  const saju = useMemo(() => {
    if (!birthYear || !birthMonth || !birthDay) return null;
    const y = parseInt(birthYear), m = parseInt(birthMonth), d = parseInt(birthDay);
    if (isNaN(y) || isNaN(m) || isNaN(d) || y < 1920 || y > 2025 || m < 1 || m > 12 || d < 1 || d > 31) return null;
    const h = parseInt(birthHour);
    const 년 = calc년주(y);
    const 월 = calc월주(y, m);
    const 일 = calc일주(y, m, d);
    const 시 = h >= 0 ? calc시주(일.간, h) : null;

    // 오행 점수
    const elements = [0, 0, 0, 0, 0]; // 목화토금수
    [년, 월, 일].forEach((p) => { elements[천간오행[p.간]]++; elements[지지오행[p.지]]++; });
    if (시) { elements[천간오행[시.간]]++; elements[지지오행[시.지]]++; }

    // 음양
    let yangCount = 0, yinCount = 0;
    [년, 월, 일].forEach((p) => { if (천간음양[p.간] === 0) yangCount++; else yinCount++; });
    if (시) { if (천간음양[시.간] === 0) yangCount++; else yinCount++; }

    // 띠
    const 띠idx = 년.지;

    // 일간 (핵심 성격)
    const 일간 = 천간[일.간];

    // 용신 (부족한 오행)
    const minElement = elements.indexOf(Math.min(...elements));

    return { 년, 월, 일, 시, elements, yangCount, yinCount, 띠idx, 일간, minElement };
  }, [birthYear, birthMonth, birthDay, birthHour]);

  // 오늘의 운세
  const fortune = useMemo(() => {
    if (!saju) return null;
    const birth = `${birthYear}-${birthMonth}-${birthDay}`;
    const categories = ["총운", "애정", "재물", "건강", "직장"];
    const results = {};

    categories.forEach((cat, ci) => {
      const hash = getDailyHash(birth, cat + ci);
      const texts = 운세풀[cat];
      const idx = hash % texts.length;
      const score = ((hash >> (ci * 3)) % 5) + 1; // vary per category
      results[cat] = { text: texts[idx], score };
    });

    // Lucky items
    const h1 = getDailyHash(birth, "color");
    const h2 = getDailyHash(birth, "number");
    const h3 = getDailyHash(birth, "direction");
    const h4 = getDailyHash(birth, "food");
    results.lucky = {
      color: 럭키색[h1 % 럭키색.length],
      number: (h2 % 9) + 1,
      direction: 럭키방향[h3 % 럭키방향.length],
      food: 럭키음식[h4 % 럭키음식.length],
    };

    return results;
  }, [saju, birthYear, birthMonth, birthDay]);

  const maxElement = saju ? Math.max(...saju.elements) : 1;

  return (
    <div className="min-h-screen text-white relative" style={{ background: "radial-gradient(ellipse at 50% 0%, #1a0a2e 0%, #0c0618 40%, #04020a 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>

      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{ color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", backdropFilter: "blur(12px)" }}>← 홈</Link>

      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        @keyframes fadeIn { from { opacity:0; transform:translateY(15px); } to { opacity:1; transform:translateY(0); } }
        .fi { animation: fadeIn 0.5s ease-out forwards; }
        .gl { background:rgba(255,255,255,.03); backdrop-filter:blur(16px); border:1px solid rgba(255,255,255,.06); }
      `}</style>

      <div className="max-w-[440px] mx-auto px-5 pb-20">
        {/* Header */}
        <header className="pt-16 pb-6 text-center">
          <div className="text-4xl mb-3">🔮</div>
          <h1 className="text-3xl font-black tracking-tight" style={{ background: "linear-gradient(135deg, #c084fc, #f472b6, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            사주팔자 & 오늘의 운세
          </h1>
          <p className="text-[12px] mt-2" style={{ color: "rgba(255,255,255,.25)" }}>생년월일로 보는 나의 사주와 매일 바뀌는 운세</p>
        </header>

        {/* ===== INPUT FORM ===== */}
        {!showResult && (
          <form onSubmit={handleSubmit} className="fi">
            <div className="gl rounded-3xl p-6 space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,.2)" }}>생년월일</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <input type="number" placeholder="년 (1950~)" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} min="1920" max="2025" required inputMode="numeric" className="w-full rounded-xl px-3 py-3 text-center text-[15px] font-bold bg-white/[0.03] border border-white/[0.06] outline-none focus:border-purple-500/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    <span className="block text-center text-[9px] mt-1" style={{ color: "rgba(255,255,255,.15)" }}>년</span>
                  </div>
                  <div>
                    <input type="number" placeholder="월" value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} min="1" max="12" required inputMode="numeric" className="w-full rounded-xl px-3 py-3 text-center text-[15px] font-bold bg-white/[0.03] border border-white/[0.06] outline-none focus:border-purple-500/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    <span className="block text-center text-[9px] mt-1" style={{ color: "rgba(255,255,255,.15)" }}>월</span>
                  </div>
                  <div>
                    <input type="number" placeholder="일" value={birthDay} onChange={(e) => setBirthDay(e.target.value)} min="1" max="31" required inputMode="numeric" className="w-full rounded-xl px-3 py-3 text-center text-[15px] font-bold bg-white/[0.03] border border-white/[0.06] outline-none focus:border-purple-500/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                    <span className="block text-center text-[9px] mt-1" style={{ color: "rgba(255,255,255,.15)" }}>일</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,.2)" }}>태어난 시간 (선택)</label>
                <select value={birthHour} onChange={(e) => setBirthHour(e.target.value)} className="w-full rounded-xl px-3 py-3 text-[14px] border border-white/[0.06] outline-none focus:border-purple-500/40" style={{ color: "rgba(255,255,255,.7)", background: "#1a0e28" }}>
                  <option value="-1">모름</option>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{String(i).padStart(2, "0")}:00 ~ {String(i).padStart(2, "0")}:59 ({지지[시간지지[i]]}시)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,.2)" }}>성별</label>
                <div className="flex gap-2">
                  {[{ v: "male", label: "남성", emoji: "👨" }, { v: "female", label: "여성", emoji: "👩" }].map((g) => (
                    <button key={g.v} type="button" onClick={() => setGender(g.v)} className="flex-1 py-3 rounded-xl text-[13px] font-medium transition-all" style={{ background: gender === g.v ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,.02)", border: `1px solid ${gender === g.v ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,.06)"}`, color: gender === g.v ? "#c084fc" : "rgba(255,255,255,.35)" }}>
                      {g.emoji} {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full py-4 rounded-2xl font-bold text-[15px] transition-all active:scale-[0.97]" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)", boxShadow: "0 8px 25px rgba(168,85,247,0.2)" }}>
                🔮 사주 보기
              </button>
            </div>
          </form>
        )}

        {/* ===== RESULTS ===== */}
        {showResult && saju && fortune && (
          <div className="fi">
            {/* User info bar */}
            <div className="gl rounded-2xl p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{띠이모지[saju.띠idx]}</span>
                <div>
                  <div className="text-[14px] font-bold">{birthYear}년 {birthMonth}월 {birthDay}일생</div>
                  <div className="text-[11px]" style={{ color: "rgba(255,255,255,.3)" }}>{띠이름[saju.띠idx]}띠 · {gender === "male" ? "남성" : "여성"}</div>
                </div>
              </div>
              <button onClick={reset} className="text-[11px] px-3 py-1.5 rounded-lg" style={{ color: "rgba(255,255,255,.3)", border: "1px solid rgba(255,255,255,.06)" }}>변경</button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1.5 mb-4">
              {[{ id: "saju", label: "사주팔자" }, { id: "fortune", label: "오늘의 운세" }, { id: "lucky", label: "행운" }].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold transition-all" style={{ background: activeTab === tab.id ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,.02)", border: `1px solid ${activeTab === tab.id ? "rgba(168,85,247,0.25)" : "rgba(255,255,255,.04)"}`, color: activeTab === tab.id ? "#c084fc" : "rgba(255,255,255,.3)" }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ===== 사주팔자 TAB ===== */}
            {activeTab === "saju" && (
              <div className="space-y-4 fi">
                {/* 핵심 요약 */}
                <div className="rounded-2xl p-5 text-center" style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.08), rgba(236,72,153,0.08))", border: "1px solid rgba(168,85,247,0.12)" }}>
                  <div className="text-3xl mb-2">{띠이모지[saju.띠idx]}</div>
                  <div className="text-[20px] font-black mb-1" style={{ color: "#c084fc" }}>{일간성격[saju.일간].title}의 기운</div>
                  <div className="text-[12px]" style={{ color: "rgba(255,255,255,.35)" }}>일간 {saju.일간} · {띠이름[saju.띠idx]}띠 · {오행[천간오행[saju.일.간]]} 속성</div>
                </div>

                {/* 사주 기둥 */}
                <div className="gl rounded-2xl p-5">
                  <h3 className="text-[10px] uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,.2)" }}>사주 네 기둥</h3>
                  <div className={`grid ${saju.시 ? "grid-cols-4" : "grid-cols-3"} gap-2`}>
                    {[
                      { label: "년주", pillar: saju.년 },
                      { label: "월주", pillar: saju.월 },
                      { label: "일주", pillar: saju.일 },
                      ...(saju.시 ? [{ label: "시주", pillar: saju.시 }] : []),
                    ].map((col) => (
                      <div key={col.label} className="text-center rounded-xl p-3" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)" }}>
                        <div className="text-[9px] mb-2" style={{ color: "rgba(255,255,255,.2)" }}>{col.label}</div>
                        <div className="text-2xl font-black mb-1" style={{ color: 오행색[천간오행[col.pillar.간]] }}>{천간[col.pillar.간]}</div>
                        <div className="text-[9px] mb-2" style={{ color: "rgba(255,255,255,.2)" }}>{오행[천간오행[col.pillar.간]]}({음양[천간음양[col.pillar.간]]})</div>
                        <div className="h-px my-1.5" style={{ background: "rgba(255,255,255,.04)" }} />
                        <div className="text-2xl font-black mb-1" style={{ color: 오행색[지지오행[col.pillar.지]] }}>{지지[col.pillar.지]}</div>
                        <div className="text-[9px]" style={{ color: "rgba(255,255,255,.2)" }}>{오행[지지오행[col.pillar.지]]}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 일간 성격 */}
                <div className="gl rounded-2xl p-5">
                  <h3 className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,.2)" }}>일간 — {saju.일간}({일간성격[saju.일간].title})</h3>
                  <p className="text-[13px] leading-relaxed mb-4" style={{ color: "rgba(255,255,255,.5)" }}>{일간성격[saju.일간].desc}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl p-3" style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.1)" }}>
                      <div className="text-[10px] font-semibold text-green-400 mb-1.5">강점</div>
                      {일간성격[saju.일간].trait.map((t) => <div key={t} className="text-[11px]" style={{ color: "rgba(255,255,255,.35)" }}>+ {t}</div>)}
                    </div>
                    <div className="rounded-xl p-3" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)" }}>
                      <div className="text-[10px] font-semibold text-red-400 mb-1.5">약점</div>
                      {일간성격[saju.일간].weak.map((w) => <div key={w} className="text-[11px]" style={{ color: "rgba(255,255,255,.35)" }}>- {w}</div>)}
                    </div>
                  </div>
                </div>

                {/* 오행 분석 */}
                <div className="gl rounded-2xl p-5">
                  <h3 className="text-[10px] uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,.2)" }}>오행 분석</h3>
                  <div className="space-y-3">
                    {오행.map((name, i) => (
                      <div key={name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[12px] flex items-center gap-1.5" style={{ color: "rgba(255,255,255,.4)" }}>
                            <span>{오행이모지[i]}</span> {name}({오행한자[i]})
                          </span>
                          <span className="text-[12px] font-bold" style={{ color: 오행색[i] }}>{saju.elements[i]}</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.04)" }}>
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${maxElement > 0 ? (saju.elements[i] / maxElement) * 100 : 0}%`, background: 오행색[i], opacity: 0.7 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 rounded-xl" style={{ background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.04)" }}>
                    <div className="text-[11px] font-semibold mb-1" style={{ color: 오행색[saju.minElement] }}>
                      {오행이모지[saju.minElement]} 보완이 필요한 오행: {오행[saju.minElement]}({오행한자[saju.minElement]})
                    </div>
                    <div className="text-[11px]" style={{ color: "rgba(255,255,255,.25)" }}>{오행해석[오행[saju.minElement]]}</div>
                  </div>
                </div>

                {/* 음양 */}
                <div className="gl rounded-2xl p-5">
                  <h3 className="text-[10px] uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,.2)" }}>음양 균형</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 text-center p-3 rounded-xl" style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.1)" }}>
                      <div className="text-xl font-black text-amber-400">☀️ {saju.yangCount}</div>
                      <div className="text-[10px]" style={{ color: "rgba(255,255,255,.25)" }}>양 (陽)</div>
                    </div>
                    <div className="text-lg" style={{ color: "rgba(255,255,255,.1)" }}>:</div>
                    <div className="flex-1 text-center p-3 rounded-xl" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.1)" }}>
                      <div className="text-xl font-black text-indigo-400">🌙 {saju.yinCount}</div>
                      <div className="text-[10px]" style={{ color: "rgba(255,255,255,.25)" }}>음 (陰)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ===== 오늘의 운세 TAB ===== */}
            {activeTab === "fortune" && (
              <div className="space-y-3 fi">
                {(() => {
                  const avg = ((fortune.총운.score + fortune.애정.score + fortune.재물.score + fortune.건강.score + fortune.직장.score) / 5).toFixed(1);
                  const label = avg >= 4 ? "대길 🎉" : avg >= 3 ? "길 ✨" : avg >= 2 ? "보통 🙂" : "소길 💪";
                  return (
                    <div className="rounded-2xl p-5 text-center mb-1" style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.08), rgba(236,72,153,0.08))", border: "1px solid rgba(251,191,36,0.12)" }}>
                      <div className="text-[11px] mb-1" style={{ color: "rgba(255,255,255,.2)" }}>
                        {new Date().getFullYear()}년 {new Date().getMonth() + 1}월 {new Date().getDate()}일
                      </div>
                      <div className="text-3xl font-black mb-1" style={{ color: "#fbbf24" }}>{avg}점</div>
                      <div className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,.4)" }}>{label}</div>
                    </div>
                  );
                })()}

                {[
                  { key: "총운", emoji: "🌟", label: "총운" },
                  { key: "애정", emoji: "💕", label: "애정운" },
                  { key: "재물", emoji: "💰", label: "재물운" },
                  { key: "건강", emoji: "💪", label: "건강운" },
                  { key: "직장", emoji: "💼", label: "직장/학업운" },
                ].map((cat) => (
                  <div key={cat.key} className="gl rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,.5)" }}>{cat.emoji} {cat.label}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} style={{ color: i < fortune[cat.key].score ? "#fbbf24" : "rgba(255,255,255,.1)", fontSize: 14 }}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,.35)" }}>{fortune[cat.key].text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ===== 행운 TAB ===== */}
            {activeTab === "lucky" && (
              <div className="fi">
                {/* 띠 운세 */}
                <div className="gl rounded-2xl p-5 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{띠이모지[saju.띠idx]}</span>
                    <div>
                      <div className="text-[14px] font-bold" style={{ color: "rgba(255,255,255,.6)" }}>{띠이름[saju.띠idx]}띠 운세</div>
                      <div className="text-[10px]" style={{ color: "rgba(255,255,255,.2)" }}>{birthYear}년생</div>
                    </div>
                  </div>
                  <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,.35)" }}>{띠운세[saju.띠idx]}</p>
                </div>

                <div className="text-center mb-4">
                  <div className="text-[11px]" style={{ color: "rgba(255,255,255,.2)" }}>오늘의 행운 아이템</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="gl rounded-2xl p-5 text-center">
                    <div className="w-10 h-10 rounded-full mx-auto mb-2" style={{ background: fortune.lucky.color.color, boxShadow: `0 0 20px ${fortune.lucky.color.color}40` }} />
                    <div className="text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,.2)" }}>행운의 색</div>
                    <div className="text-[14px] font-bold" style={{ color: fortune.lucky.color.color }}>{fortune.lucky.color.name}</div>
                  </div>
                  <div className="gl rounded-2xl p-5 text-center">
                    <div className="text-3xl mb-2">🔢</div>
                    <div className="text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,.2)" }}>행운의 숫자</div>
                    <div className="text-[14px] font-bold text-amber-400">{fortune.lucky.number}</div>
                  </div>
                  <div className="gl rounded-2xl p-5 text-center">
                    <div className="text-3xl mb-2">🧭</div>
                    <div className="text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,.2)" }}>행운의 방향</div>
                    <div className="text-[14px] font-bold text-cyan-400">{fortune.lucky.direction}</div>
                  </div>
                  <div className="gl rounded-2xl p-5 text-center">
                    <div className="text-3xl mb-2">🍽️</div>
                    <div className="text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,.2)" }}>행운의 음식</div>
                    <div className="text-[14px] font-bold text-orange-400">{fortune.lucky.food}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Share */}
        {showResult && (
          <button onClick={() => {
            const text = `🔮 ${birthYear}년 ${birthMonth}월 ${birthDay}일생 오늘의 운세\n총운: ${"★".repeat(fortune?.총운?.score || 0)}${"☆".repeat(5 - (fortune?.총운?.score || 0))}\n${fortune?.총운?.text}\n\n나도 보러가기 → funappbox.com/fortune`;
            if (navigator.share) navigator.share({ title: "오늘의 운세", text });
            else { try { navigator.clipboard.writeText(text); alert("복사되었습니다!"); } catch { alert("복사에 실패했습니다."); } }
          }} className="w-full rounded-2xl py-3 mt-4 text-center text-[13px] font-semibold transition-all active:scale-[0.98]" style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.15)", color: "#c084fc" }}>
            📤 오늘의 운세 공유하기
          </button>
        )}

        <div className="mt-10 text-center text-[10px] leading-relaxed px-4 py-3 rounded-xl mx-auto max-w-xs" style={{ color: "rgba(255,255,255,.15)", background: "rgba(255,255,255,.01)", border: "1px solid rgba(255,255,255,.03)" }}>
          <p>⚠️ 본 운세는 전통 사주 이론을 기반으로 한 <strong>재미 콘텐츠</strong>입니다.</p>
          <p>실제 운명이나 미래를 예측하는 것이 아닙니다.</p>
        </div>
      </div>
    </div>
  );
}
