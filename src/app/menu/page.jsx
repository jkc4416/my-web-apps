"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";

/*
  ╔══════════════════════════════════════════════════════════════╗
  ║  밥뭐먹지? — Redesigned                                       ║
  ║  Design: Warm Food Energy + Orange-Red Accent                ║
  ║  Palette: Deep warm dark + vibrant orange accents            ║
  ╚══════════════════════════════════════════════════════════════╝
*/

const MENUS = [
  {id:"kimchi-jjigae",name:"김치찌개",cat:"korean",emoji:"🍲",cal:350,tags:["매운","국물"],desc:"잘 익은 김치와 돼지고기가 어우러진 소울푸드. 밥 한 공기가 순삭.",similar:["doenjang-jjigae","budae-jjigae","sundubu"]},
  {id:"doenjang-jjigae",name:"된장찌개",cat:"korean",emoji:"🫕",cal:280,tags:["구수한","국물"],desc:"구수한 된장 향 가득한 전통 찌개. 두부, 애호박이 들어가 영양 만점.",similar:["kimchi-jjigae","bibimbap"]},
  {id:"bibimbap",name:"비빔밥",cat:"korean",emoji:"🍚",cal:550,tags:["건강","채소"],desc:"다양한 나물과 고추장이 어우러진 한 그릇 완성 식사.",similar:["dolsot-bibimbap","bulgogi"]},
  {id:"bulgogi",name:"불고기",cat:"korean",emoji:"🥩",cal:480,tags:["달콤","고기"],desc:"달콤한 간장 양념 쇠고기. 남녀노소 인기 메뉴.",similar:["galbi","jeyuk","samgyeopsal"]},
  {id:"galbi",name:"갈비찜",cat:"korean",emoji:"🍖",cal:620,tags:["고기","특별한날"],desc:"소갈비를 달콤짭조롬하게 조린 한국식 브레이징.",similar:["bulgogi","bossam"]},
  {id:"jeyuk",name:"제육볶음",cat:"korean",emoji:"🌶️",cal:490,tags:["매운","밥도둑"],desc:"매콤한 고추장 양념 돼지고기. 가성비 최고 밥도둑.",similar:["bulgogi","dakgalbi"]},
  {id:"sundubu",name:"순두부찌개",cat:"korean",emoji:"🥘",cal:320,tags:["매운","부드러운"],desc:"부드러운 순두부에 해물/고기를 넣고 끓인 뜨끈한 찌개.",similar:["kimchi-jjigae","doenjang-jjigae"]},
  {id:"dakgalbi",name:"닭갈비",cat:"korean",emoji:"🍗",cal:450,tags:["매운","단체"],desc:"매콤한 양념 닭고기와 야채. 치즈 추가 시 더 맛있음.",similar:["jeyuk","tteokbokki"]},
  {id:"bossam",name:"보쌈",cat:"korean",emoji:"🥬",cal:400,tags:["고기","쌈"],desc:"삶은 돼지고기를 상추/깻잎에 싸먹는 요리.",similar:["jokbal","samgyeopsal"]},
  {id:"samgyeopsal",name:"삼겹살",cat:"korean",emoji:"🥓",cal:550,tags:["고기","구이"],desc:"한국인이 가장 사랑하는 고기. 소주와 최고의 조합.",similar:["bossam","bulgogi"]},
  {id:"jajangmyeon",name:"자장면",cat:"chinese",emoji:"🍜",cal:650,tags:["면","배달"],desc:"검은 춘장 소스에 면을 비벼 먹는 대표 중화요리.",similar:["jjamppong","tangsuyuk"]},
  {id:"jjamppong",name:"짬뽕",cat:"chinese",emoji:"🌶️",cal:550,tags:["매운","면"],desc:"해산물과 채소가 푸짐한 매콤 국물 면.",similar:["jajangmyeon","malatang"]},
  {id:"tangsuyuk",name:"탕수육",cat:"chinese",emoji:"🍖",cal:700,tags:["튀김","달콤"],desc:"바삭한 고기에 새콤달콤 소스. 인기 중식.",similar:["jajangmyeon"]},
  {id:"malatang",name:"마라탕",cat:"chinese",emoji:"🔥",cal:480,tags:["매운","트렌디"],desc:"얼얼한 마라 향신료에 재료 골라 끓여 먹는 인기 메뉴.",similar:["jjamppong","tteokbokki"]},
  {id:"ramen",name:"라멘",cat:"japanese",emoji:"🍜",cal:500,tags:["면","국물"],desc:"진한 돼지뼈 육수에 쫄깃한 면. 일본식 라멘.",similar:["udon","jjamppong"]},
  {id:"sushi",name:"초밥",cat:"japanese",emoji:"🍣",cal:380,tags:["해산물","고급"],desc:"신선한 생선을 밥 위에 올린 일본 대표 음식.",similar:["donkatsu","kimbap"]},
  {id:"donkatsu",name:"돈카츠",cat:"japanese",emoji:"🍱",cal:650,tags:["튀김","고기"],desc:"두툼한 돼지고기를 바삭하게 튀긴 커틀릿.",similar:["curry","udon"]},
  {id:"udon",name:"우동",cat:"japanese",emoji:"🍲",cal:420,tags:["면","따뜻한"],desc:"쫄깃한 굵은 면에 맑은 국물.",similar:["ramen","soba"]},
  {id:"curry",name:"카레라이스",cat:"japanese",emoji:"🍛",cal:580,tags:["밥","달콤"],desc:"걸쭉한 카레에 밥을 곁들인 일본식.",similar:["donkatsu","bibimbap"]},
  {id:"pasta",name:"파스타",cat:"western",emoji:"🍝",cal:550,tags:["면","데이트"],desc:"크림/토마토/오일 등 다양한 소스의 이탈리안.",similar:["pizza","steak"]},
  {id:"pizza",name:"피자",cat:"western",emoji:"🍕",cal:700,tags:["빵","단체"],desc:"치즈와 토핑을 올려 구운 이탈리안.",similar:["pasta","burger"]},
  {id:"burger",name:"햄버거",cat:"western",emoji:"🍔",cal:600,tags:["빵","패스트푸드"],desc:"패티, 채소, 소스를 빵 사이에.",similar:["pizza","sandwich"]},
  {id:"steak",name:"스테이크",cat:"western",emoji:"🥩",cal:650,tags:["고기","데이트"],desc:"두꺼운 소고기를 그릴에 구운 서양식.",similar:["pasta","bulgogi"]},
  {id:"tteokbokki",name:"떡볶이",cat:"snack",emoji:"🍢",cal:450,tags:["매운","간식"],desc:"매콤달콤 고추장 소스에 쫄깃한 떡. 국민 간식.",similar:["sundae","kimbap"]},
  {id:"kimbap",name:"김밥",cat:"snack",emoji:"🍙",cal:350,tags:["밥","도시락"],desc:"김에 밥과 속재료를 말아 만든 한국식 롤.",similar:["bibimbap","sushi"]},
  {id:"ramen-instant",name:"라면",cat:"snack",emoji:"🍜",cal:500,tags:["면","간편"],desc:"한국인의 국민 야식. 3분이면 완성.",similar:["tteokbokki","jjamppong"]},
  {id:"chicken",name:"치킨",cat:"delivery",emoji:"🍗",cal:700,tags:["튀김","배달"],desc:"바삭 튀긴 닭고기. 양념/후라이드/반반.",similar:["pizza","jokbal"]},
  {id:"jokbal",name:"족발",cat:"delivery",emoji:"🦶",cal:550,tags:["고기","술안주"],desc:"삶은 돼지 족발을 얇게 썰어 먹는 배달 인기.",similar:["bossam","chicken"]},
  {id:"salad",name:"샐러드",cat:"cafe",emoji:"🥗",cal:250,tags:["건강","다이어트"],desc:"신선한 채소와 드레싱의 건강한 한 끼.",similar:["poke","brunch"]},
  {id:"poke",name:"포케",cat:"cafe",emoji:"🥗",cal:420,tags:["건강","트렌디"],desc:"신선한 회와 채소를 밥 위에 올린 하와이식.",similar:["salad","sushi"]},
  {id:"budae-jjigae",name:"부대찌개",cat:"night",emoji:"🍲",cal:600,tags:["국물","단체"],desc:"햄, 소시지, 라면, 김치가 어우러진 퓨전 찌개.",similar:["kimchi-jjigae","ramen-instant"]},
  {id:"fried-chicken",name:"치맥",cat:"night",emoji:"🍺",cal:800,tags:["야식","술"],desc:"치킨과 맥주의 완벽한 조합.",similar:["chicken","pizza"]},
];

const CATS = [
  {id:"all",name:"전체",emoji:"🍽️",color:"#f97316"},
  {id:"korean",name:"한식",emoji:"🇰🇷",color:"#ef4444"},
  {id:"chinese",name:"중식",emoji:"🇨🇳",color:"#fbbf24"},
  {id:"japanese",name:"일식",emoji:"🇯🇵",color:"#ec4899"},
  {id:"western",name:"양식",emoji:"🍝",color:"#60a5fa"},
  {id:"snack",name:"분식",emoji:"🍢",color:"#fb923c"},
  {id:"cafe",name:"카페",emoji:"☕",color:"#84cc16"},
  {id:"delivery",name:"배달",emoji:"🛵",color:"#22d3ee"},
  {id:"night",name:"야식",emoji:"🌙",color:"#c084fc"},
];

// ===== ROULETTE WHEEL =====
function Wheel({ items, spinning, targetIdx, onSpin }) {
  const cvs = useRef(null);
  const [rot, setRot] = useState(0);
  const anim = useRef(null);

  useEffect(() => {
    const c = cvs.current; if (!c) return;
    const x = c.getContext("2d"); const sz = 300; c.width = sz; c.height = sz;
    const cx = sz / 2, cy = sz / 2, r = sz / 2 - 10;
    const seg = (2 * Math.PI) / items.length;
    x.clearRect(0, 0, sz, sz);
    items.forEach((it, i) => {
      const s = seg * i + (rot * Math.PI / 180), e = s + seg;
      x.beginPath(); x.moveTo(cx, cy); x.arc(cx, cy, r, s, e); x.closePath();
      const hue = (i * 360 / items.length + 15) % 360;
      x.fillStyle = `hsl(${hue}, 55%, ${i % 2 === 0 ? 32 : 42}%)`;
      x.fill(); x.strokeStyle = "rgba(255,255,255,0.06)"; x.lineWidth = 1; x.stroke();
      x.save(); x.translate(cx, cy); x.rotate(s + seg / 2);
      x.fillStyle = "rgba(255,255,255,0.85)"; x.font = `bold ${items.length > 14 ? 9 : 11}px sans-serif`; x.textAlign = "right";
      x.fillText(it.emoji + " " + (it.name.length > 4 ? it.name.slice(0, 3) + ".." : it.name), r - 14, 3);
      x.restore();
    });
    x.beginPath(); x.arc(cx, cy, 26, 0, 2 * Math.PI);
    x.fillStyle = "#1a0e08"; x.fill();
    x.strokeStyle = "rgba(255,255,255,0.08)"; x.lineWidth = 2; x.stroke();
    x.fillStyle = "rgba(255,255,255,0.6)"; x.font = "bold 10px sans-serif"; x.textAlign = "center"; x.fillText("GO!", cx, cy + 3);
  }, [items, rot]);

  useEffect(() => {
    if (!spinning || targetIdx == null || items.length === 0) return;
    // Calculate target angle so the pointer (top, 270deg) lands on targetIdx
    const segDeg = 360 / items.length;
    // The segment for targetIdx starts at segDeg * targetIdx degrees
    // Pointer is at top (270deg in canvas coords = -90deg)
    // We need the middle of the target segment to be at the top
    // Since wheel rotates by adding rot to each segment's start angle,
    // we need: segDeg * targetIdx + rot + segDeg/2 ≡ 270 (mod 360) (in canvas: top = -90deg = 270deg)
    // So targetRot = 270 - segDeg * targetIdx - segDeg/2 (mod 360)
    const landAngle = 270 - segDeg * targetIdx - segDeg / 2;
    // Add multiple full rotations for visual effect
    const fullSpins = 5 + Math.floor(Math.random() * 3); // 5-7 full rotations
    const targetRot = fullSpins * 360 + ((landAngle - (rot % 360)) + 3600) % 360;
    const startRot = rot;
    const st = Date.now();
    const dur = 3200 + Math.random() * 800;
    const tick = () => {
      const el = Date.now() - st;
      const p = Math.min(el / dur, 1);
      const ea = 1 - Math.pow(1 - p, 3);
      setRot(startRot + targetRot * ea);
      if (p < 1) anim.current = requestAnimationFrame(tick);
    };
    anim.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(anim.current);
  }, [spinning, targetIdx]);

  return (
    <div className="relative flex items-center justify-center my-5">
      <div className="absolute -top-1 z-10" style={{ width: 0, height: 0, borderLeft: "9px solid transparent", borderRight: "9px solid transparent", borderTop: "18px solid #f97316", filter: "drop-shadow(0 2px 4px rgba(249,115,22,0.4))" }} />
      <canvas ref={cvs} width={300} height={300} onClick={onSpin}
        className="cursor-pointer rounded-full" style={{ width: 260, height: 260, filter: "drop-shadow(0 8px 30px rgba(0,0,0,0.5))" }} />
    </div>
  );
}

// ===== MAIN =====
export default function MenuRoulette() {
  const [pg, setPg] = useState("home");
  const [selCats, setSelCats] = useState(["all"]);
  const [spinning, setSpinning] = useState(false);
  const [targetIdx, setTargetIdx] = useState(null);
  const [result, setResult] = useState(null);
  const [detail, setDetail] = useState(null);
  const [history, setHistory] = useState([]);
  const [customItems, setCustomItems] = useState([]);
  const [customIn, setCustomIn] = useState("");
  const [customMode, setCustomMode] = useState(false);
  const [particles, setParticles] = useState(false);
  const cvs = useRef(null);

  const filtered = useMemo(() => {
    if (selCats.includes("all")) return MENUS;
    return MENUS.filter(m => selCats.includes(m.cat));
  }, [selCats]);

  const toggleCat = (id) => {
    if (id === "all") { setSelCats(["all"]); return; }
    setSelCats(p => {
      const n = p.filter(c => c !== "all");
      if (n.includes(id)) { const f = n.filter(c => c !== id); return f.length === 0 ? ["all"] : f; }
      return [...n, id];
    });
  };

  const spin = useCallback(() => {
    if (spinning) return;
    // Use the same items that the wheel displays
    const pool = customMode && customItems.length > 0
      ? customItems.map((name, i) => ({ id: `c${i}`, name, emoji: "🎯", cat: "custom", cal: 0, tags: [], desc: "", similar: [] }))
      : filtered.slice(0, 20);
    if (pool.length < 2) return;
    // Choose result first, then tell wheel where to stop
    const chosenIdx = Math.floor(Math.random() * pool.length);
    const chosen = pool[chosenIdx];
    setTargetIdx(chosenIdx);
    setSpinning(true); setPg("spinning"); setResult(null);
    setTimeout(() => {
      setResult(chosen); setSpinning(false); setParticles(true);
      setTimeout(() => setParticles(false), 3000);
      setPg("result");
      setHistory(p => [chosen, ...p.filter(h => h.id !== chosen.id)].slice(0, 10));
    }, 3800);
  }, [spinning, filtered, customMode, customItems]);

  const openDetail = (m) => { if (!m.desc) return; setDetail(m); setPg("detail"); };

  const addCustom = () => { const v = customIn.trim(); if (!v || customItems.includes(v)) return; setCustomItems(p => [...p, v]); setCustomIn(""); };

  const wheelItems = useMemo(() => {
    if (customMode && customItems.length > 0) return customItems.map((n, i) => ({ id: `c${i}`, name: n, emoji: "🎯" }));
    return filtered.slice(0, 20);
  }, [filtered, customMode, customItems]);

  const saveImg = useCallback(() => {
    const c = cvs.current; if (!c || !result) return; const x = c.getContext("2d");
    c.width = 600; c.height = 350;
    const g = x.createRadialGradient(300, 160, 0, 300, 175, 350);
    g.addColorStop(0, "#1a0e06"); g.addColorStop(1, "#0a0604");
    x.fillStyle = g; x.fillRect(0, 0, 600, 350);
    x.textAlign = "center";
    x.fillStyle = "#555"; x.font = "12px sans-serif"; x.fillText("밥뭐먹지? 룰렛", 300, 32);
    x.font = "56px sans-serif"; x.fillText(result.emoji, 300, 130);
    x.fillStyle = "#fff"; x.font = "bold 34px sans-serif"; x.fillText(result.name, 300, 185);
    if (result.cal) { x.fillStyle = "#888"; x.font = "15px sans-serif"; x.fillText(`${result.cal} kcal`, 300, 215); }
    x.fillStyle = "#444"; x.font = "11px sans-serif"; x.fillText("나도 돌려보기 →", 300, 320);
    const l = document.createElement("a"); l.download = `밥뭐먹지_${result.name}.png`; l.href = c.toDataURL(); l.click();
  }, [result]);

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: "radial-gradient(ellipse at 50% 0%, #1a0e06 0%, #0e0806 40%, #080504 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        @keyframes si { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pop { 0% { transform:scale(.8); opacity:0; } 60% { transform:scale(1.06); } 100% { transform:scale(1); opacity:1; } }
        @keyframes confetti { 0% { opacity:1; transform:translateY(0) rotate(0); } 100% { opacity:0; transform:translateY(-85vh) rotate(60deg) scale(.2); } }
        @keyframes orbF { 0%,100% { transform:translate(0,0); } 33% { transform:translate(14px,-20px); } 66% { transform:translate(-10px,14px); } }
        .si { animation: si 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
        .pop { animation: pop 0.5s ease-out forwards; }
        .cf { animation: confetti 2.5s ease-out forwards; }
        .od { animation: orbF 16s ease-in-out infinite; }
        .gl { background:rgba(255,255,255,.03); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,.06); }
        .gl2 { background:rgba(255,255,255,.06); backdrop-filter:blur(28px); -webkit-backdrop-filter:blur(28px); border:1px solid rgba(255,255,255,.08); }
        ::-webkit-scrollbar { display:none; } input:focus { outline:none; }
      `}</style>
      <canvas ref={cvs} className="hidden" />

      {/* Confetti */}
      {particles && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 22 }).map((_, i) => (
            <span key={i} className="absolute cf text-lg" style={{ left: `${Math.random() * 100}%`, bottom: "-20px", animationDelay: `${Math.random() * 1}s` }}>
              {["🎉", "🎊", "✨", "🍽️", "🎯", "⭐"][i % 6]}
            </span>
          ))}
        </div>
      )}

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[500px] h-[500px] rounded-full od" style={{ background: "radial-gradient(circle,rgba(249,115,22,.05),transparent 70%)", top: "-18%", right: "-20%" }} />
        <div className="absolute w-[350px] h-[350px] rounded-full od" style={{ background: "radial-gradient(circle,rgba(239,68,68,.04),transparent 70%)", bottom: "8%", left: "-12%", animationDelay: "-6s" }} />
      </div>

      {/* Home */}<Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{color:"rgba(255,255,255,.4)",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",backdropFilter:"blur(12px)"}}>← 홈</Link>
      {/* Header */}
      <header className="sticky top-0 z-30" style={{ background: "rgba(14,8,6,.88)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          {pg === "detail" ? (
            <button onClick={() => setPg("result")} className="text-[13px] hover:text-white transition-colors" style={{ color: "rgba(255,255,255,.3)" }}>← 결과</button>
          ) : pg !== "home" && pg !== "spinning" ? (
            <button onClick={() => setPg("home")} className="text-[13px] hover:text-white transition-colors" style={{ color: "rgba(255,255,255,.3)" }}>← 홈</button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg">🍽️</span>
              <span className="text-[16px] font-black" style={{ background: "linear-gradient(135deg, #f97316, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>밥뭐먹지?</span>
            </div>
          )}
          <button onClick={() => { setCustomMode(!customMode); if (pg !== "home") setPg("home"); }}
            className="text-[10px] px-2.5 py-1 rounded-full transition-all"
            style={customMode ? { background: "rgba(249,115,22,.12)", color: "#f97316", border: "1px solid rgba(249,115,22,.2)" } : { color: "rgba(255,255,255,.2)", border: "1px solid transparent" }}>
            {customMode ? "✓ 커스텀" : "커스텀"}
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 pb-16 relative z-10">
        {/* ===== HOME ===== */}
        {pg === "home" && (
          <div className="si">
            {/* Categories */}
            {!customMode && (
              <div className="flex gap-1.5 overflow-x-auto py-3">
                {CATS.map(c => {
                  const on = selCats.includes(c.id);
                  return (
                    <button key={c.id} onClick={() => toggleCat(c.id)}
                      className="flex-shrink-0 px-3 py-2 rounded-xl text-[10px] font-semibold transition-all"
                      style={on ? { background: `${c.color}12`, color: c.color, border: `1px solid ${c.color}25` } : { color: "rgba(255,255,255,.2)", border: "1px solid transparent" }}>
                      {c.emoji} {c.name}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Custom editor */}
            {customMode && (
              <div className="py-3">
                <h3 className="text-[9px] uppercase tracking-[0.2em] mb-2 ml-0.5" style={{ color: "rgba(255,255,255,.12)" }}>Custom Items</h3>
                <div className="flex gap-2 mb-3">
                  <input type="text" value={customIn} onChange={e => setCustomIn(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addCustom()} placeholder="메뉴 이름" maxLength={20}
                    className="flex-1 rounded-2xl px-4 py-2.5 text-[12px]" style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", color: "#e2e8f0" }} />
                  <button onClick={addCustom} className="px-4 py-2.5 rounded-2xl font-bold text-[13px] active:scale-95" style={{ background: "#f97316", color: "#fff" }}>+</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {customItems.map((it, i) => (
                    <span key={i} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px]" style={{ background: "rgba(249,115,22,.08)", border: "1px solid rgba(249,115,22,.15)", color: "#fb923c" }}>
                      {it}<button onClick={() => setCustomItems(p => p.filter((_, j) => j !== i))} className="ml-0.5 opacity-50 hover:opacity-100">×</button>
                    </span>
                  ))}
                  {customItems.length === 0 && <span className="text-[11px]" style={{ color: "rgba(255,255,255,.12)" }}>메뉴를 추가하세요 (최소 2개)</span>}
                </div>
              </div>
            )}

            {/* Wheel */}
            <Wheel items={wheelItems} spinning={false} targetIdx={null} onSpin={spin} />

            {/* Spin button */}
            <button onClick={spin} disabled={customMode && customItems.length < 2}
              className="w-full rounded-2xl font-bold text-[16px] transition-all active:scale-[0.97]"
              style={{ padding: "18px 0", ...(customMode && customItems.length < 2) ? { background: "rgba(255,255,255,.03)", color: "rgba(255,255,255,.15)" } : { background: "linear-gradient(135deg, #f97316, #ef4444)", color: "#fff", boxShadow: "0 12px 35px -8px rgba(249,115,22,.3)" } }}>
              🎰 룰렛 돌리기!
            </button>
            <div className="text-center mt-2 text-[11px]" style={{ color: "rgba(255,255,255,.1)" }}>
              {customMode ? `${customItems.length}개 메뉴` : `${filtered.length}개 메뉴`}
            </div>

            {/* Ad placeholder removed */}

            {/* History */}
            {history.length > 0 && (
              <div className="mt-2">
                <h3 className="text-[9px] uppercase tracking-[0.2em] mb-2 ml-0.5" style={{ color: "rgba(255,255,255,.1)" }}>Recent</h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {history.map((h, i) => (
                    <button key={i} onClick={() => h.desc && openDetail(h)}
                      className="flex-shrink-0 text-center p-3 rounded-xl gl hover:bg-white/[0.04] transition-all min-w-[72px] active:scale-95">
                      <div className="text-xl">{h.emoji}</div>
                      <div className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,.25)" }}>{h.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 space-y-2" style={{ color: "rgba(255,255,255,.08)", fontSize: 10.5, lineHeight: 1.9, borderTop: "1px solid rgba(255,255,255,.03)", paddingTop: 16 }}>
              <h2 style={{ color: "rgba(255,255,255,.12)", fontSize: 11, fontWeight: 700 }}>밥뭐먹지?</h2>
              <p>한식, 중식, 일식, 양식 등 30가지 이상의 메뉴에서 랜덤 추천. 커스텀 룰렛도 가능합니다.</p>
            </div>
          </div>
        )}

        {/* ===== SPINNING ===== */}
        {pg === "spinning" && (
          <div className="py-6 text-center si">
            <Wheel items={wheelItems} spinning={true} targetIdx={targetIdx} onSpin={() => {}} />
            <div className="mt-4 text-[14px] font-bold animate-pulse" style={{ color: "rgba(255,255,255,.25)" }}>메뉴를 고르는 중...</div>
          </div>
        )}

        {/* ===== RESULT ===== */}
        {pg === "result" && result && (
          <div className="py-6 text-center pop">
            <div className="text-[10px] mb-2" style={{ color: "rgba(255,255,255,.2)" }}>오늘의 추천 메뉴</div>
            <div className="text-7xl mb-3">{result.emoji}</div>
            <h2 className="text-[30px] font-black">{result.name}</h2>
            {result.cal > 0 && <div className="text-[13px] mt-1" style={{ color: "rgba(255,255,255,.2)" }}>{result.cal} kcal</div>}
            {result.tags?.length > 0 && (
              <div className="flex justify-center gap-1.5 mt-2">
                {result.tags.map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,.04)", color: "rgba(255,255,255,.25)" }}>#{t}</span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-3 gap-2.5 mt-6 mb-5">
              {[["🔄 다시", () => { setPg("home"); setTimeout(spin, 300); }], [result.desc ? "📋 상세" : "📸 저장", result.desc ? () => openDetail(result) : saveImg], ["🔗 공유", () => { const t = `오늘의 메뉴: ${result.emoji} ${result.name}!`; if (navigator.share) navigator.share({ title: "밥뭐먹지?", text: t, url: location.href }); else { navigator.clipboard.writeText(t); alert("복사됨!"); } }]].map(([l, fn], i) => (
                <button key={i} onClick={fn}
                  className={`py-3.5 rounded-2xl text-[11px] font-semibold tracking-[0.05em] transition-all active:scale-95 ${i === 1 ? "" : "gl hover:bg-white/[0.05]"}`}
                  style={i === 1 ? { background: "linear-gradient(135deg, #f97316, #ef4444)", color: "#fff", boxShadow: "0 8px 20px -5px rgba(249,115,22,.2)" } : { color: "rgba(255,255,255,.35)" }}>
                  {l}
                </button>
              ))}
            </div>

            {/* Ad placeholder removed */}
          </div>
        )}

        {/* ===== DETAIL ===== */}
        {pg === "detail" && detail && (
          <div className="py-4 si">
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">{detail.emoji}</div>
              <h2 className="text-[22px] font-black">{detail.name}</h2>
              <div className="flex justify-center gap-3 mt-2 text-[12px]" style={{ color: "rgba(255,255,255,.25)" }}>
                <span>🔥 {detail.cal} kcal</span>
                <span>📂 {CATS.find(c => c.id === detail.cat)?.name}</span>
              </div>
            </div>

            {detail.tags?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                {detail.tags.map(t => (
                  <span key={t} className="text-[10px] px-2.5 py-1 rounded-full" style={{ background: "rgba(249,115,22,.08)", border: "1px solid rgba(249,115,22,.12)", color: "#fb923c" }}>#{t}</span>
                ))}
              </div>
            )}

            <div className="gl2 rounded-2xl p-5 mb-4">
              <h3 className="text-[9px] uppercase tracking-[0.2em] mb-2" style={{ color: "rgba(255,255,255,.12)" }}>소개</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,.4)" }}>{detail.desc}</p>
            </div>

            {/* Calorie bar */}
            <div className="gl rounded-2xl p-5 mb-4">
              <h3 className="text-[9px] uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(255,255,255,.12)" }}>Calories</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.04)" }}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min((detail.cal / 800) * 100, 100)}%`, background: detail.cal > 600 ? "#f87171" : detail.cal > 400 ? "#fbbf24" : "#2dd4bf" }} />
                </div>
                <span className="text-[13px] font-black tabular-nums" style={{ color: detail.cal > 600 ? "#f87171" : detail.cal > 400 ? "#fbbf24" : "#2dd4bf" }}>{detail.cal}</span>
              </div>
              <div className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,.1)" }}>1인분 | 일일 2,000kcal 기준</div>
            </div>

            {/* Ad placeholder removed */}

            {/* Similar menus — session depth */}
            {detail.similar?.length > 0 && (
              <div className="gl rounded-2xl p-5 mb-4">
                <h3 className="text-[9px] uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(255,255,255,.12)" }}>비슷한 메뉴</h3>
                <div className="grid grid-cols-2 gap-2">
                  {detail.similar.map(sid => {
                    const m = MENUS.find(x => x.id === sid);
                    if (!m) return null;
                    return (
                      <button key={sid} onClick={() => { setDetail(m); window.scrollTo(0, 0); }}
                        className="flex items-center gap-2.5 p-3 rounded-xl gl hover:bg-white/[0.04] transition-all active:scale-95 text-left">
                        <span className="text-xl">{m.emoji}</span>
                        <div>
                          <div className="text-[11px] font-bold" style={{ color: "rgba(255,255,255,.6)" }}>{m.name}</div>
                          <div className="text-[9px]" style={{ color: "rgba(255,255,255,.15)" }}>{m.cal} kcal</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button onClick={() => { setResult(detail); setPg("result"); }}
                className="py-3.5 rounded-2xl font-bold text-[13px] transition-all active:scale-95"
                style={{ background: "linear-gradient(135deg, #f97316, #ef4444)", color: "#fff", boxShadow: "0 8px 20px -5px rgba(249,115,22,.2)" }}>
                ✅ 이걸로 결정!
              </button>
              <button onClick={() => { setPg("home"); setTimeout(spin, 300); }}
                className="py-3.5 rounded-2xl gl font-medium text-[13px] transition-all active:scale-95" style={{ color: "rgba(255,255,255,.35)" }}>
                🔄 다시 돌리기
              </button>
            </div>

            {/* Ad placeholder removed */}
          </div>
        )}
      </main>

      {/* Anchor ad placeholder removed */}
    </div>
  );
}
