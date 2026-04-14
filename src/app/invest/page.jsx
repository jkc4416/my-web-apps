"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Link from "next/link";

/*
  ╔══════════════════════════════════════════════════════════════╗
  ║  만약에 투자했다면 — Enhanced                                    ║
  ║  Expanded data through 2026-Q1, preset periods, custom dates ║
  ╚══════════════════════════════════════════════════════════════╝
*/

const ASSETS = [
  { id:"samsung",name:"삼성전자",emoji:"📱",cat:"kr_stock",color:"#1428a0",
    prices:[{d:"2010-01",p:16000},{d:"2011-01",p:18800},{d:"2012-01",p:20800},{d:"2013-01",p:30000},{d:"2014-01",p:24600},{d:"2015-01",p:26400},{d:"2016-01",p:23200},{d:"2017-01",p:38200},{d:"2018-01",p:51900},{d:"2019-01",p:43000},{d:"2020-01",p:55200},{d:"2020-06",p:52600},{d:"2021-01",p:81000},{d:"2021-06",p:80000},{d:"2022-01",p:74400},{d:"2022-06",p:59800},{d:"2023-01",p:60600},{d:"2023-06",p:71400},{d:"2024-01",p:74200},{d:"2024-06",p:81000},{d:"2025-01",p:53600},{d:"2025-06",p:58000},{d:"2026-01",p:56800}]},
  { id:"sk-hynix",name:"SK하이닉스",emoji:"💾",cat:"kr_stock",color:"#e4002b",
    prices:[{d:"2012-01",p:24000},{d:"2013-01",p:27500},{d:"2014-01",p:34500},{d:"2015-01",p:46200},{d:"2016-01",p:27700},{d:"2017-01",p:45800},{d:"2018-01",p:75000},{d:"2019-01",p:60800},{d:"2020-01",p:96200},{d:"2021-01",p:130000},{d:"2022-01",p:119000},{d:"2022-06",p:89200},{d:"2023-01",p:80000},{d:"2023-06",p:120000},{d:"2024-01",p:141000},{d:"2024-06",p:214000},{d:"2025-01",p:178000},{d:"2025-06",p:195000},{d:"2026-01",p:210000}]},
  { id:"kakao",name:"카카오",emoji:"💬",cat:"kr_stock",color:"#fee500",
    prices:[{d:"2017-01",p:88000},{d:"2018-01",p:140000},{d:"2019-01",p:115000},{d:"2020-01",p:170000},{d:"2020-06",p:312000},{d:"2021-01",p:460000},{d:"2021-06",p:530000},{d:"2022-01",p:395000},{d:"2022-06",p:230000},{d:"2023-01",p:195000},{d:"2023-06",p:200000},{d:"2024-01",p:170000},{d:"2024-06",p:145000},{d:"2025-01",p:120000},{d:"2025-06",p:110000},{d:"2026-01",p:105000}]},
  { id:"naver",name:"네이버",emoji:"🟢",cat:"kr_stock",color:"#03c75a",
    prices:[{d:"2010-01",p:85000},{d:"2012-01",p:105000},{d:"2014-01",p:145000},{d:"2015-01",p:170000},{d:"2016-01",p:155000},{d:"2017-01",p:180000},{d:"2018-01",p:195000},{d:"2019-01",p:125000},{d:"2020-01",p:180000},{d:"2021-01",p:345000},{d:"2021-06",p:410000},{d:"2022-01",p:340000},{d:"2022-06",p:210000},{d:"2023-01",p:210000},{d:"2023-06",p:220000},{d:"2024-01",p:230000},{d:"2025-01",p:195000},{d:"2025-06",p:205000},{d:"2026-01",p:198000}]},
  { id:"kospi",name:"KOSPI",emoji:"📈",cat:"kr_index",color:"#0066b3",
    prices:[{d:"2005-01",p:895},{d:"2006-01",p:1379},{d:"2007-01",p:1434},{d:"2008-01",p:1897},{d:"2008-06",p:1683},{d:"2009-01",p:1124},{d:"2010-01",p:1682},{d:"2011-01",p:2070},{d:"2012-01",p:1891},{d:"2013-01",p:1997},{d:"2014-01",p:1967},{d:"2015-01",p:1916},{d:"2016-01",p:1918},{d:"2017-01",p:2067},{d:"2018-01",p:2470},{d:"2019-01",p:2065},{d:"2020-01",p:2175},{d:"2020-06",p:2152},{d:"2021-01",p:3064},{d:"2021-06",p:3285},{d:"2022-01",p:2750},{d:"2022-06",p:2332},{d:"2023-01",p:2399},{d:"2023-06",p:2586},{d:"2024-01",p:2556},{d:"2024-06",p:2804},{d:"2025-01",p:2400},{d:"2025-06",p:2580},{d:"2026-01",p:2520},{d:"2026-04",p:2490}]},
  { id:"sp500",name:"S&P 500",emoji:"🇺🇸",cat:"us_index",color:"#b22234",
    prices:[{d:"2005-01",p:1181},{d:"2006-01",p:1280},{d:"2007-01",p:1438},{d:"2008-01",p:1378},{d:"2008-06",p:1280},{d:"2009-01",p:825},{d:"2010-01",p:1115},{d:"2011-01",p:1282},{d:"2012-01",p:1312},{d:"2013-01",p:1498},{d:"2014-01",p:1848},{d:"2015-01",p:2059},{d:"2016-01",p:1940},{d:"2017-01",p:2279},{d:"2018-01",p:2824},{d:"2019-01",p:2607},{d:"2020-01",p:3278},{d:"2020-06",p:3100},{d:"2021-01",p:3714},{d:"2021-06",p:4298},{d:"2022-01",p:4516},{d:"2022-06",p:3785},{d:"2023-01",p:4077},{d:"2023-06",p:4450},{d:"2024-01",p:4770},{d:"2024-06",p:5460},{d:"2025-01",p:5880},{d:"2025-06",p:5650},{d:"2026-01",p:5960},{d:"2026-04",p:5200}]},
  { id:"nasdaq",name:"나스닥",emoji:"💻",cat:"us_index",color:"#0096d6",
    prices:[{d:"2005-01",p:2062},{d:"2006-01",p:2305},{d:"2007-01",p:2452},{d:"2008-01",p:2389},{d:"2009-01",p:1476},{d:"2010-01",p:2269},{d:"2011-01",p:2700},{d:"2012-01",p:2813},{d:"2013-01",p:3142},{d:"2014-01",p:4143},{d:"2015-01",p:4757},{d:"2016-01",p:4614},{d:"2017-01",p:5614},{d:"2018-01",p:7411},{d:"2019-01",p:6636},{d:"2020-01",p:9150},{d:"2021-01",p:13070},{d:"2021-06",p:14504},{d:"2022-01",p:14240},{d:"2022-06",p:11028},{d:"2023-01",p:11510},{d:"2023-06",p:13787},{d:"2024-01",p:15164},{d:"2024-06",p:17862},{d:"2025-01",p:19627},{d:"2025-06",p:18500},{d:"2026-01",p:19800},{d:"2026-04",p:16300}]},
  { id:"apple",name:"애플",emoji:"🍎",cat:"us_stock",color:"#555",
    prices:[{d:"2005-01",p:1.6},{d:"2006-01",p:2.8},{d:"2007-01",p:3},{d:"2008-01",p:5.6},{d:"2009-01",p:3},{d:"2010-01",p:7.5},{d:"2011-01",p:11.4},{d:"2012-01",p:14.7},{d:"2013-01",p:19},{d:"2014-01",p:19.3},{d:"2015-01",p:27},{d:"2016-01",p:24.2},{d:"2017-01",p:29.6},{d:"2018-01",p:41.6},{d:"2019-01",p:38.5},{d:"2020-01",p:77.4},{d:"2021-01",p:131},{d:"2021-06",p:137},{d:"2022-01",p:175},{d:"2022-06",p:137},{d:"2023-01",p:143},{d:"2023-06",p:193},{d:"2024-01",p:185},{d:"2024-06",p:210},{d:"2025-01",p:237},{d:"2025-06",p:215},{d:"2026-01",p:232},{d:"2026-04",p:198}]},
  { id:"tesla",name:"테슬라",emoji:"🚗",cat:"us_stock",color:"#cc0000",
    prices:[{d:"2015-01",p:14},{d:"2016-01",p:10},{d:"2017-01",p:16.6},{d:"2018-01",p:23.3},{d:"2019-01",p:20},{d:"2020-01",p:28.7},{d:"2020-06",p:68},{d:"2021-01",p:264},{d:"2021-06",p:226},{d:"2022-01",p:360},{d:"2022-06",p:224},{d:"2023-01",p:128},{d:"2023-06",p:261},{d:"2024-01",p:225},{d:"2024-06",p:197},{d:"2025-01",p:378},{d:"2025-06",p:340},{d:"2026-01",p:355},{d:"2026-04",p:245}]},
  { id:"bitcoin",name:"비트코인",emoji:"₿",cat:"crypto",color:"#f7931a",
    prices:[{d:"2013-01",p:13},{d:"2014-01",p:800},{d:"2015-01",p:220},{d:"2016-01",p:430},{d:"2017-01",p:1000},{d:"2017-06",p:2500},{d:"2018-01",p:13000},{d:"2018-06",p:6200},{d:"2019-01",p:3500},{d:"2019-06",p:11000},{d:"2020-01",p:7200},{d:"2020-06",p:9100},{d:"2021-01",p:33000},{d:"2021-06",p:35000},{d:"2022-01",p:38000},{d:"2022-06",p:19000},{d:"2023-01",p:23000},{d:"2023-06",p:30000},{d:"2024-01",p:42000},{d:"2024-06",p:62000},{d:"2025-01",p:94000},{d:"2025-06",p:105000},{d:"2026-01",p:98000},{d:"2026-04",p:84000}]},
  { id:"ethereum",name:"이더리움",emoji:"⟠",cat:"crypto",color:"#627eea",
    prices:[{d:"2016-01",p:1},{d:"2017-01",p:8},{d:"2017-06",p:300},{d:"2018-01",p:1100},{d:"2018-06",p:430},{d:"2019-01",p:110},{d:"2020-01",p:130},{d:"2020-06",p:230},{d:"2021-01",p:1300},{d:"2021-06",p:2300},{d:"2022-01",p:2900},{d:"2022-06",p:1050},{d:"2023-01",p:1570},{d:"2023-06",p:1880},{d:"2024-01",p:2300},{d:"2024-06",p:3400},{d:"2025-01",p:3300},{d:"2025-06",p:3800},{d:"2026-01",p:2500},{d:"2026-04",p:1600}]},
  { id:"gold",name:"금",emoji:"🥇",cat:"commodity",color:"#d4a017",
    prices:[{d:"2005-01",p:424},{d:"2006-01",p:530},{d:"2007-01",p:632},{d:"2008-01",p:889},{d:"2009-01",p:858},{d:"2010-01",p:1096},{d:"2011-01",p:1362},{d:"2012-01",p:1656},{d:"2013-01",p:1681},{d:"2014-01",p:1240},{d:"2015-01",p:1185},{d:"2016-01",p:1097},{d:"2017-01",p:1210},{d:"2018-01",p:1340},{d:"2019-01",p:1290},{d:"2020-01",p:1580},{d:"2020-06",p:1780},{d:"2021-01",p:1860},{d:"2022-01",p:1830},{d:"2022-06",p:1810},{d:"2023-01",p:1920},{d:"2023-06",p:1930},{d:"2024-01",p:2050},{d:"2024-06",p:2330},{d:"2025-01",p:2770},{d:"2025-06",p:3100},{d:"2026-01",p:3050},{d:"2026-04",p:3200}]},
];

const CATS = [
  { id: "all", name: "전체", emoji: "📋" },
  { id: "kr_stock", name: "한국 주식", emoji: "🇰🇷" },
  { id: "kr_index", name: "한국 지수", emoji: "📈" },
  { id: "us_index", name: "미국 지수", emoji: "🇺🇸" },
  { id: "us_stock", name: "미국 주식", emoji: "💻" },
  { id: "crypto", name: "암호화폐", emoji: "₿" },
  { id: "commodity", name: "원자재", emoji: "🥇" },
];

const PERIOD_PRESETS = [
  { label: "1년", months: 12 },
  { label: "3년", months: 36 },
  { label: "5년", months: 60 },
  { label: "10년", months: 120 },
  { label: "15년", months: 180 },
  { label: "20년", months: 240 },
  { label: "전체", months: -1 },
];

function getPrice(a, ds) {
  const d = new Date(ds), ps = a.prices;
  if (d <= new Date(ps[0].d)) return ps[0].p;
  if (d >= new Date(ps[ps.length - 1].d)) return ps[ps.length - 1].p;
  for (let i = 0; i < ps.length - 1; i++) {
    const d1 = new Date(ps[i].d), d2 = new Date(ps[i + 1].d);
    if (d >= d1 && d <= d2) return ps[i].p + (ps[i + 1].p - ps[i].p) * ((d - d1) / (d2 - d1));
  }
  return ps[ps.length - 1].p;
}

function fm(n) {
  if (n === undefined || isNaN(n)) return "0";
  if (Math.abs(n) >= 1e8) return (n / 1e8).toFixed(2) + "억";
  if (Math.abs(n) >= 1e4) return (n / 1e4).toFixed(1) + "만";
  return Math.round(n).toLocaleString();
}
function ff(n) { return Math.round(n || 0).toLocaleString(); }

function getAvailableDates(asset) {
  const first = new Date(asset.prices[0].d);
  const last = new Date(asset.prices[asset.prices.length - 1].d);
  const dates = [];
  const cur = new Date(first);
  while (cur <= last) {
    dates.push(cur.toISOString().slice(0, 7));
    cur.setMonth(cur.getMonth() + 1);
  }
  return dates;
}

export default function InvestSim() {
  const [pg, setPg] = useState("home");
  const [simType, setSimType] = useState("lump");
  const [asset, setAsset] = useState(null);
  const [amount, setAmount] = useState("");
  const [startD, setStartD] = useState("2019-01");
  const [endD, setEndD] = useState("");
  const [monthlyAmt, setMonthlyAmt] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [res, setRes] = useState(null);
  const cvs = useRef(null);

  const filtered = filterCat === "all" ? ASSETS : ASSETS.filter(a => a.cat === filterCat);

  const selectAsset = (a) => {
    setAsset(a);
    setStartD(a.prices[0].d.slice(0, 7));
    setEndD(a.prices[a.prices.length - 1].d.slice(0, 7));
    setPg("sim");
  };

  const allDates = useMemo(() => asset ? getAvailableDates(asset) : [], [asset]);

  const applyPreset = useCallback((months) => {
    if (!asset) return;
    const lastDate = asset.prices[asset.prices.length - 1].d;
    setEndD(lastDate.slice(0, 7));
    if (months === -1) {
      setStartD(asset.prices[0].d.slice(0, 7));
    } else {
      // Use day 15 to avoid timezone edge cases with UTC
      const end = new Date(lastDate + "-15");
      end.setMonth(end.getMonth() - months);
      const earliest = new Date(asset.prices[0].d + "-15");
      const target = end < earliest ? earliest : end;
      setStartD(target.toISOString().slice(0, 7));
    }
  }, [asset]);

  const run = useCallback(() => {
    if (!asset) return;
    const finalEnd = endD || asset.prices[asset.prices.length - 1].d;
    // Prevent invalid date range
    if (startD >= finalEnd) return;
    if (simType === "lump") {
      const inv = parseFloat(amount) * 1e4; if (!inv || inv <= 0) return;
      const sp = getPrice(asset, startD + "-15"), ep = getPrice(asset, finalEnd + "-15");
      const shares = inv / sp, cv = shares * ep, profit = cv - inv, ret = ((cv / inv) - 1) * 100;
      const chart = []; const s = new Date(startD + "-15"), e = new Date(finalEnd + "-15"), cur = new Date(s);
      let safety = 0;
      while (cur <= e && safety < 600) { const ds = cur.toISOString().slice(0, 7); const pr = getPrice(asset, ds + "-15"); chart.push({ date: ds, value: Math.round(shares * pr), principal: Math.round(inv) }); cur.setMonth(cur.getMonth() + 1); safety++; }
      const yrs = (e - s) / (365.25 * 864e5);
      const cagr = yrs > 0 ? (Math.pow(cv / inv, 1 / yrs) - 1) * 100 : 0;
      setRes({ type: "lump", inv, cv: Math.round(cv), profit: Math.round(profit), ret, cagr, chart, yrs: yrs.toFixed(1), startD, endD: finalEnd });
    } else {
      const mo = parseFloat(monthlyAmt) * 1e4; if (!mo || mo <= 0) return;
      const s = new Date(startD + "-15"), e = new Date(finalEnd + "-15"), chart = []; let ti = 0, ts = 0, cur = new Date(s);
      let safety = 0;
      while (cur <= e && safety < 600) { const ds = cur.toISOString().slice(0, 7); const pr = getPrice(asset, ds + "-15"); ti += mo; ts += mo / pr; chart.push({ date: ds, value: Math.round(ts * pr), principal: Math.round(ti) }); cur.setMonth(cur.getMonth() + 1); safety++; }
      const ep = getPrice(asset, finalEnd + "-15"), cv = ts * ep, profit = cv - ti, ret = ti > 0 ? ((cv / ti) - 1) * 100 : 0;
      setRes({ type: "dca", inv: Math.round(ti), cv: Math.round(cv), profit: Math.round(profit), ret, chart, avgP: ts > 0 ? ti / ts : 0, months: chart.length, startD, endD: finalEnd });
    }
    setPg("result");
  }, [asset, simType, amount, startD, endD, monthlyAmt]);

  const saveImg = useCallback(() => {
    const c = cvs.current; if (!c || !res || !asset) return; const x = c.getContext("2d");
    c.width = 640; c.height = 400;
    const g = x.createRadialGradient(320, 180, 0, 320, 200, 380);
    g.addColorStop(0, "#0a1a12"); g.addColorStop(1, "#040a08");
    x.fillStyle = g; x.fillRect(0, 0, 640, 400);
    x.textAlign = "center";
    x.fillStyle = "#555"; x.font = "12px sans-serif"; x.fillText("만약에 투자했다면?", 320, 32);
    x.fillStyle = "#fff"; x.font = "bold 20px sans-serif"; x.fillText(`${asset.emoji} ${asset.name}에 ${fm(res.inv)}원`, 320, 72);
    x.fillStyle = "#888"; x.font = "12px sans-serif"; x.fillText(`${res.startD} → ${res.endD}`, 320, 95);
    const pc = res.profit >= 0 ? "#2dd4bf" : "#f87171";
    x.fillStyle = pc; x.font = "bold 56px sans-serif"; x.fillText(`${res.profit >= 0 ? "+" : ""}${fm(res.profit)}원`, 320, 180);
    x.font = "bold 22px sans-serif"; x.fillText(`수익률 ${res.ret >= 0 ? "+" : ""}${res.ret.toFixed(1)}%`, 320, 220);
    x.fillStyle = "#888"; x.font = "14px sans-serif"; x.fillText(`현재 가치: ${ff(res.cv)}원`, 320, 255);
    x.fillStyle = "#444"; x.font = "11px sans-serif"; x.fillText("나도 시뮬레이션 →", 320, 370);
    const l = document.createElement("a"); l.download = `투자_${asset.name}.png`; l.href = c.toDataURL(); l.click();
  }, [res, asset]);

  const pc = res?.profit >= 0 ? "#2dd4bf" : "#f87171";

  return (
    <div className="min-h-screen text-white" style={{ background: "radial-gradient(ellipse at 50% 0%, #0a1a12 0%, #060e0a 40%, #030806 100%)", fontFamily: "'Pretendard Variable','Pretendard',-apple-system,sans-serif" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        @keyframes si { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes orbF { 0%,100% { transform:translate(0,0); } 33% { transform:translate(14px,-20px); } 66% { transform:translate(-10px,14px); } }
        .si { animation: si 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
        .od { animation: orbF 16s ease-in-out infinite; }
        .gl { background:rgba(255,255,255,.03); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,.06); }
        .gl2 { background:rgba(255,255,255,.06); backdrop-filter:blur(28px); -webkit-backdrop-filter:blur(28px); border:1px solid rgba(255,255,255,.08); }
        ::-webkit-scrollbar { display:none; }
        input:focus,select:focus { outline:none; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance:none; }
      `}</style>
      <canvas ref={cvs} className="hidden" />

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[500px] h-[500px] rounded-full od" style={{ background: "radial-gradient(circle,rgba(45,212,191,.05),transparent 70%)", top: "-18%", right: "-20%" }} />
        <div className="absolute w-[350px] h-[350px] rounded-full od" style={{ background: "radial-gradient(circle,rgba(96,165,250,.03),transparent 70%)", bottom: "8%", left: "-12%", animationDelay: "-6s" }} />
      </div>

      <Link href="/" className="fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 active:scale-95" style={{color:"rgba(255,255,255,.4)",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)",backdropFilter:"blur(12px)"}}>← 홈</Link>
      <header className="sticky top-0 z-30" style={{ background: "rgba(6,14,10,.88)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
        <div className="max-w-lg mx-auto px-5 py-3 flex items-center justify-between">
          {pg !== "home" ? (
            <button onClick={() => { setPg("home"); setRes(null); }} className="text-[13px] hover:text-white transition-colors" style={{ color: "rgba(255,255,255,.3)" }}>← 목록</button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <span className="text-[16px] font-black" style={{ background: "linear-gradient(135deg, #2dd4bf, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>만약에 투자했다면?</span>
            </div>
          )}
          {asset && pg !== "home" && <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,.3)" }}>{asset.emoji} {asset.name}</span>}
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 pb-16 relative z-10">
        {/* HOME */}
        {pg === "home" && (
          <div className="si">
            <div className="text-center py-6">
              <h2 className="text-[20px] font-black leading-tight">과거에 투자했다면<br /><span style={{ color: "#2dd4bf" }}>얼마가 됐을까?</span></h2>
              <p className="text-[11px] mt-2" style={{ color: "rgba(255,255,255,.2)" }}>종목을 선택하고 기간을 지정하여 시뮬레이션하세요</p>
            </div>

            <div className="flex gap-1.5 overflow-x-auto mb-4 pb-1">
              {CATS.map(c => (
                <button key={c.id} onClick={() => setFilterCat(c.id)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all"
                  style={filterCat === c.id ? { background: "rgba(45,212,191,.1)", color: "#2dd4bf", border: "1px solid rgba(45,212,191,.2)" } : { color: "rgba(255,255,255,.2)", border: "1px solid transparent" }}>
                  {c.emoji} {c.name}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filtered.map((a, i) => {
                const first = a.prices[0], last = a.prices[a.prices.length - 1];
                const ret = ((last.p / first.p) - 1) * 100;
                return (
                  <button key={a.id} onClick={() => selectAsset(a)}
                    className="w-full text-left p-4 rounded-2xl gl hover:bg-white/[0.04] active:scale-[0.98] transition-all si"
                    style={{ animationDelay: `${i * 40}ms`, animationFillMode: "backwards" }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{a.emoji}</span>
                        <div>
                          <div className="text-[13px] font-bold">{a.name}</div>
                          <div className="text-[10px]" style={{ color: "rgba(255,255,255,.15)" }}>{first.d} ~ {last.d}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[14px] font-black tabular-nums" style={{ color: ret >= 0 ? "#2dd4bf" : "#f87171" }}>
                          {ret >= 0 ? "+" : ""}{ret.toFixed(1)}%
                        </div>
                        <div className="text-[9px]" style={{ color: "rgba(255,255,255,.12)" }}>전체 수익률</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 p-3 rounded-2xl" style={{ background: "rgba(251,191,36,.03)", border: "1px solid rgba(251,191,36,.06)" }}>
              <p className="text-[10px] leading-relaxed" style={{ color: "rgba(251,191,36,.3)" }}>⚠️ 과거 데이터 기반 가상 계산이며, 투자 조언이 아닙니다. 세금·수수료·환율 미반영.</p>
            </div>
          </div>
        )}

        {/* SIM INPUT */}
        {pg === "sim" && asset && (
          <div className="py-5 si">
            <div className="text-center mb-5">
              <span className="text-3xl">{asset.emoji}</span>
              <h2 className="text-[18px] font-black mt-1">{asset.name}</h2>
              <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,.15)" }}>데이터 범위: {asset.prices[0].d} ~ {asset.prices[asset.prices.length - 1].d}</p>
            </div>

            {/* Type toggle */}
            <div className="flex gap-2 mb-5">
              {[["lump", "💰 일시불"], ["dca", "📅 적립식"]].map(([t, l]) => (
                <button key={t} onClick={() => setSimType(t)}
                  className="flex-1 py-2.5 rounded-xl text-[11px] font-semibold transition-all"
                  style={simType === t ? { background: "rgba(45,212,191,.1)", color: "#2dd4bf", border: "1px solid rgba(45,212,191,.2)" } : { color: "rgba(255,255,255,.2)", border: "1px solid rgba(255,255,255,.04)" }}>
                  {l}
                </button>
              ))}
            </div>

            {/* Amount input */}
            <div className="space-y-3">
              {simType === "lump" ? (
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] mb-2 ml-0.5" style={{ color: "rgba(255,255,255,.2)" }}>투자 금액</label>
                  <div className="relative">
                    <input type="number" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="1000"
                      className="w-full rounded-2xl px-5 py-3.5 text-[13px] font-medium tabular-nums transition-all"
                      style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)", color: "#e2e8f0" }}
                      onFocus={e => e.target.style.borderColor = "rgba(45,212,191,.3)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.06)"} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px]" style={{ color: "rgba(255,255,255,.15)" }}>만원</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[100, 500, 1000, 5000].map(v => (
                      <button key={v} onClick={() => setAmount(String(v))}
                        className="flex-1 py-1.5 rounded-lg text-[10px] transition-all active:scale-95 gl" style={{ color: "rgba(255,255,255,.25)" }}>
                        {v >= 1000 ? `${v / 10000}억` : `${v}만`}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] mb-2 ml-0.5" style={{ color: "rgba(255,255,255,.2)" }}>월 투자 금액</label>
                  <div className="relative">
                    <input type="number" inputMode="decimal" value={monthlyAmt} onChange={e => setMonthlyAmt(e.target.value)} placeholder="50"
                      className="w-full rounded-2xl px-5 py-3.5 text-[13px] font-medium tabular-nums transition-all"
                      style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)", color: "#e2e8f0" }}
                      onFocus={e => e.target.style.borderColor = "rgba(45,212,191,.3)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.06)"} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px]" style={{ color: "rgba(255,255,255,.15)" }}>만원/월</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[10, 30, 50, 100].map(v => (
                      <button key={v} onClick={() => setMonthlyAmt(String(v))}
                        className="flex-1 py-1.5 rounded-lg text-[10px] transition-all active:scale-95 gl" style={{ color: "rgba(255,255,255,.25)" }}>{v}만</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Period presets */}
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] mb-2 ml-0.5" style={{ color: "rgba(255,255,255,.2)" }}>기간 프리셋</label>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {PERIOD_PRESETS.map(p => {
                    const firstDate = asset.prices[0].d;
                    const lastDate = asset.prices[asset.prices.length - 1].d;
                    const maxMonths = (new Date(lastDate).getFullYear() - new Date(firstDate).getFullYear()) * 12 + new Date(lastDate).getMonth() - new Date(firstDate).getMonth();
                    const disabled = p.months > 0 && p.months > maxMonths;
                    return (
                      <button key={p.label} onClick={() => !disabled && applyPreset(p.months)} disabled={disabled}
                        className="flex-shrink-0 px-3 py-2 rounded-xl text-[10px] font-semibold transition-all active:scale-95 disabled:opacity-20"
                        style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", color: "rgba(255,255,255,.3)" }}>
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom date range */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] mb-2 ml-0.5" style={{ color: "rgba(255,255,255,.2)" }}>시작일</label>
                  <select value={startD} onChange={e => setStartD(e.target.value)}
                    className="w-full rounded-2xl px-4 py-3 text-[12px] appearance-none transition-all"
                    style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)", color: "#e2e8f0" }}>
                    {allDates.filter(d => !endD || d < endD).map(d => (<option key={d} value={d}>{d.replace("-", ".")}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] mb-2 ml-0.5" style={{ color: "rgba(255,255,255,.2)" }}>종료일</label>
                  <select value={endD} onChange={e => setEndD(e.target.value)}
                    className="w-full rounded-2xl px-4 py-3 text-[12px] appearance-none transition-all"
                    style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.06)", color: "#e2e8f0" }}>
                    {allDates.filter(d => !startD || d > startD).map(d => (<option key={d} value={d}>{d.replace("-", ".")}</option>))}
                  </select>
                </div>
              </div>

              {/* Selected period display */}
              <div className="text-center text-[11px] py-1" style={{ color: "rgba(255,255,255,.2)" }}>
                📅 {startD.replace("-", ".")} → {endD.replace("-", ".")}
                <span className="ml-2" style={{ color: "rgba(45,212,191,.4)" }}>
                  ({(() => { const s = new Date(startD); const e = new Date(endD); const m = (e.getFullYear() - s.getFullYear()) * 12 + e.getMonth() - s.getMonth(); return m >= 12 ? `${(m / 12).toFixed(1)}년` : `${m}개월`; })()})
                </span>
              </div>
            </div>

            <button onClick={run} disabled={simType === "lump" ? !amount : !monthlyAmt}
              className="w-full mt-5 rounded-2xl font-bold text-[14px] transition-all active:scale-[0.97]"
              style={{ padding: "18px 0", ...(simType === "lump" ? amount : monthlyAmt) ? { background: "linear-gradient(135deg, #2dd4bf, #14b8a6)", color: "#fff", boxShadow: "0 12px 35px -8px rgba(45,212,191,.25)" } : { background: "rgba(255,255,255,.03)", color: "rgba(255,255,255,.15)" } }}>
              📊 시뮬레이션 실행
            </button>
          </div>
        )}

        {/* RESULT */}
        {pg === "result" && res && asset && (
          <div className="py-5 si">
            <div className="text-center mb-1">
              <span className="text-[11px]" style={{ color: "rgba(255,255,255,.2)" }}>{asset.emoji} {asset.name} · {res.type === "lump" ? "일시불" : "적립식"} · {res.startD} → {res.endD}</span>
            </div>

            <div className="gl2 rounded-3xl p-6 text-center mb-5" style={{ boxShadow: `inset 0 0 80px ${res.profit >= 0 ? "rgba(45,212,191,.06)" : "rgba(248,113,113,.06)"}` }}>
              <div className="text-[10px] uppercase tracking-[0.15em]" style={{ color: "rgba(255,255,255,.2)" }}>현재 가치</div>
              <div className="text-[28px] font-black tabular-nums mt-1">{ff(res.cv)}원</div>
              <div className="text-[20px] font-bold mt-1 tabular-nums" style={{ color: pc }}>
                {res.profit >= 0 ? "+" : ""}{ff(res.profit)}원
                <span className="text-[13px] ml-1">({res.ret >= 0 ? "+" : ""}{res.ret.toFixed(1)}%)</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                ["투자 원금", fm(res.inv) + "원", "rgba(255,255,255,.5)"],
                ["수익률", `${res.ret >= 0 ? "+" : ""}${res.ret.toFixed(1)}%`, pc],
                [res.type === "lump" ? "연평균(CAGR)" : "평균 매입가", res.type === "lump" ? `${res.cagr?.toFixed(1)}%` : fm(Math.round(res.avgP || 0)), "#a78bfa"],
              ].map(([l, v, c]) => (
                <div key={l} className="text-center p-3 rounded-2xl gl">
                  <div className="text-[9px] uppercase tracking-[0.12em]" style={{ color: "rgba(255,255,255,.12)" }}>{l}</div>
                  <div className="text-[15px] font-black tabular-nums mt-1" style={{ color: c }}>{v}</div>
                </div>
              ))}
            </div>

            <div className="gl rounded-2xl p-4 mb-5">
              <h3 className="text-[9px] uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(255,255,255,.12)" }}>자산 추이</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={res.chart} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={pc} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={pc} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.03)" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: "rgba(255,255,255,.15)" }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,.03)" }}
                    interval={Math.max(0, Math.floor(res.chart.length / 5) - 1)} />
                  <YAxis tick={{ fontSize: 9, fill: "rgba(255,255,255,.15)" }} tickLine={false} axisLine={false}
                    tickFormatter={v => v >= 1e8 ? `${(v / 1e8).toFixed(0)}억` : v >= 1e4 ? `${(v / 1e4).toFixed(0)}만` : v} />
                  <Tooltip contentStyle={{ background: "rgba(10,26,18,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, fontSize: 11, backdropFilter: "blur(10px)" }}
                    formatter={(v, n) => [ff(v) + "원", n === "value" ? "평가액" : "원금"]} labelStyle={{ color: "rgba(255,255,255,.3)" }} />
                  <Area type="monotone" dataKey="principal" stroke="rgba(255,255,255,.15)" strokeWidth={1} strokeDasharray="4 4" fill="none" name="원금" />
                  <Area type="monotone" dataKey="value" stroke={pc} strokeWidth={2} fill="url(#vg)" name="평가액" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {[["다시하기", () => { setPg("sim"); setRes(null); }], ["📸 저장", saveImg], ["공유", () => { const t = `${asset.name}에 ${fm(res.inv)}원 (${res.startD}~${res.endD}) → ${res.profit >= 0 ? "+" : ""}${ff(res.profit)}원 (${res.ret.toFixed(1)}%)`; if (navigator.share) navigator.share({ title: "투자 시뮬", text: t, url: location.href }); else { navigator.clipboard.writeText(t); alert("복사됨!"); } }]].map(([l, fn], i) => (
                <button key={i} onClick={fn}
                  className={`py-3.5 rounded-2xl text-[11px] font-semibold tracking-[0.05em] transition-all active:scale-95 ${i === 1 ? "" : "gl hover:bg-white/[0.05]"}`}
                  style={i === 1 ? { background: "linear-gradient(135deg, #2dd4bf, #14b8a6)", color: "#fff", boxShadow: "0 8px 20px -5px rgba(45,212,191,.2)" } : { color: "rgba(255,255,255,.35)" }}>
                  {l}
                </button>
              ))}
            </div>

            <div className="gl rounded-2xl p-4 mb-5">
              <h3 className="text-[9px] uppercase tracking-[0.2em] mb-3" style={{ color: "rgba(255,255,255,.12)" }}>다른 자산</h3>
              <div className="flex gap-2 overflow-x-auto">
                {ASSETS.filter(a => a.id !== asset.id).slice(0, 6).map(a => (
                  <button key={a.id} onClick={() => { selectAsset(a); setRes(null); setPg("sim"); }}
                    className="flex-shrink-0 px-3 py-2.5 rounded-xl gl text-center transition-all active:scale-95 hover:bg-white/[0.04]">
                    <div className="text-lg">{a.emoji}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,.25)" }}>{a.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl" style={{ background: "rgba(251,191,36,.03)", border: "1px solid rgba(251,191,36,.06)" }}>
              <p className="text-[10px] leading-relaxed" style={{ color: "rgba(251,191,36,.3)" }}>⚠️ 과거 데이터 기반 가상 시뮬레이션. 세금·수수료·환율·배당 미반영. 투자 결정 시 전문가 상담 필수.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
