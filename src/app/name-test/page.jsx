"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";

/*
  ╔══════════════════════════════════════════════════════════════╗
  ║  이름궁합 테스트 — Redesigned                                  ║
  ║  Design: Romantic Glassmorphism + Ambient Particle System    ║
  ║  Font: Pretendard Variable (Korean-optimized)                ║
  ║  Palette: Deep space + rose/violet accents                   ║
  ╚══════════════════════════════════════════════════════════════╝
*/

// ===== ALGORITHM (compact) =====
const CH=["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"],JU=["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"],JO=["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const SM={"ㄱ":2,"ㄲ":4,"ㄴ":2,"ㄷ":3,"ㄸ":6,"ㄹ":5,"ㅁ":4,"ㅂ":4,"ㅃ":8,"ㅅ":2,"ㅆ":4,"ㅇ":1,"ㅈ":3,"ㅉ":6,"ㅊ":4,"ㅋ":3,"ㅌ":4,"ㅍ":4,"ㅎ":3,"ㅏ":2,"ㅐ":3,"ㅑ":3,"ㅒ":4,"ㅓ":2,"ㅔ":3,"ㅕ":3,"ㅖ":4,"ㅗ":2,"ㅘ":4,"ㅙ":5,"ㅚ":3,"ㅛ":3,"ㅜ":2,"ㅝ":4,"ㅞ":5,"ㅟ":3,"ㅠ":3,"ㅡ":1,"ㅢ":2,"ㅣ":1,"":0};
const EL={"ㄱ":"木","ㄲ":"木","ㄴ":"火","ㄷ":"火","ㄸ":"火","ㄹ":"火","ㅁ":"土","ㅂ":"金","ㅃ":"金","ㅅ":"金","ㅆ":"金","ㅇ":"土","ㅈ":"火","ㅉ":"火","ㅊ":"金","ㅋ":"木","ㅌ":"火","ㅍ":"水","ㅎ":"水"};
const SY={木:{火:90,土:60,金:30,水:80,木:50},火:{土:90,金:40,水:20,木:80,火:50},土:{金:90,水:30,木:40,火:80,土:50},金:{水:90,木:20,火:30,土:80,金:50},水:{木:90,火:20,土:40,金:80,水:50}};
const YV=new Set(["ㅏ","ㅑ","ㅗ","ㅛ","ㅘ","ㅙ","ㅐ","ㅒ"]);
function dc(c){const k=c.charCodeAt(0)-0xAC00;if(k<0||k>11171)return null;return{cho:CH[k/588|0],jung:JU[(k%588)/28|0],jong:JO[k%28]};}
function gs(n){return[...n].reduce((s,c)=>{const d=dc(c);return d?s+(SM[d.cho]||0)+(SM[d.jung]||0)+(SM[d.jong]||0):s;},0);}
function hn(a,b){let h=0;for(const c of a+b)h=((h<<5)-h+c.charCodeAt(0))|0;return Math.abs(h);}
function calc(n1,n2,ti=0){
  const ss=Math.max(0,100-Math.abs(gs(n1)-gs(n2))*6);
  const c1=[...n1].map(dc).filter(Boolean),c2=[...n2].map(dc).filter(Boolean);
  const e1=c1.map(d=>EL[d.cho]).filter(Boolean),e2=c2.map(d=>EL[d.cho]).filter(Boolean);
  let es=50;if(e1.length&&e2.length){const sc=[];e1.forEach(a=>e2.forEach(b=>{if(SY[a]?.[b])sc.push(SY[a][b]);}));if(sc.length)es=sc.reduce((a,b)=>a+b)/sc.length;}
  const y1=c1.filter(d=>YV.has(d.jung)).length,y2=c2.filter(d=>YV.has(d.jung)).length;
  const hs=(y1>c1.length-y1)!==(y2>c2.length-y2)?85:(y1===c1.length-y1||y2===c2.length-y2)?70:55;
  const rb=(hn(n1,n2)%21)-10;
  const w=[[.4,.3,.2,.1],[.25,.2,.35,.2],[.35,.35,.15,.15],[.3,.4,.2,.1]][ti];
  return{score:Math.max(5,Math.min(99,Math.round(ss*w[0]+es*w[1]+hs*w[2]+rb*w[3]))),strokeScore:ss,elScore:es,harmonyScore:hs,elements:{el1:e1,el2:e2}};
}

const GRADES=[
  {min:90,label:"천생연분",emoji:"💞",color:"#FF1493",glow:"rgba(255,20,147,0.15)"},
  {min:75,label:"최고의 인연",emoji:"❤️‍🔥",color:"#FF4081",glow:"rgba(255,64,129,0.12)"},
  {min:60,label:"좋은 인연",emoji:"🧡",color:"#FF9100",glow:"rgba(255,145,0,0.12)"},
  {min:45,label:"보통 인연",emoji:"💛",color:"#FFC107",glow:"rgba(255,193,7,0.10)"},
  {min:0,label:"노력 필요",emoji:"🩶",color:"#90A4AE",glow:"rgba(144,164,174,0.08)"},
];
const MSGS={h:["하늘이 맺어준 운명적 인연!","우주가 축복하는 완벽한 조합!","이 만남은 필연이에요!","서로를 완벽하게 채워주는 관계!"],m:["시간이 갈수록 깊어지는 인연.","서로의 다름이 매력이 되는 관계.","작은 배려가 큰 행복을 만들어요."],l:["다르기에 더 많이 배울 수 있어요.","예상 밖의 케미가 터질 수도!","도전적이지만 단단해지는 관계."]};
const THEMES=[
  {id:0,name:"연애",emoji:"💑",grad:"from-rose-500 to-pink-600",ring:"#ff6b9d"},
  {id:1,name:"우정",emoji:"🫂",grad:"from-amber-400 to-orange-500",ring:"#fbbf24"},
  {id:2,name:"비즈니스",emoji:"🤝",grad:"from-cyan-400 to-blue-500",ring:"#22d3ee"},
  {id:3,name:"소울메이트",emoji:"🔮",grad:"from-violet-400 to-purple-600",ring:"#a78bfa"},
];
function gg(s){return GRADES.find(g=>s>=g.min);}
function gm(s){const p=s>=75?MSGS.h:s>=50?MSGS.m:MSGS.l;return p[Math.random()*p.length|0];}

export default function App(){
  const[pg,setPg]=useState("home");
  const[n1,setN1]=useState("");
  const[n2,setN2]=useState("");
  const[res,setRes]=useState(null);
  const[ti,setTi]=useState(0);
  const[particles,setParticles]=useState(false);
  const[msg,setMsg]=useState("");
  const[lp,setLp]=useState(0);
  const[as,setAs]=useState(0);
  const[hist,setHist]=useState([]);
  const cvs=useRef(null);
  const ok=n=>/^[가-힣]{2,4}$/.test(n);

  const go=useCallback(()=>{
    if(!ok(n1)||!ok(n2))return;
    setPg("load");setLp(0);
    [0,15,32,52,70,88,100].forEach((v,i)=>setTimeout(()=>setLp(v),i*380));
    setTimeout(()=>{
      const r=calc(n1,n2,ti);setRes(r);setMsg(gm(r.score));setAs(0);setPg("res");
      setParticles(true);setTimeout(()=>setParticles(false),3500);
      const st=Date.now();(function a(){const p=Math.min((Date.now()-st)/1800,1);setAs(Math.round(r.score*(1-Math.pow(1-p,4))));if(p<1)requestAnimationFrame(a);})();
      setHist(p=>[{n1,n2,score:r.score,ti},...p.filter(h=>!(h.n1===n1&&h.n2===n2&&h.ti===ti))].slice(0,8));
    },2800);
  },[n1,n2,ti]);

  const switchTheme=(id)=>{
    setTi(id);const r=calc(n1,n2,id);setRes(r);setMsg(gm(r.score));setAs(0);
    setParticles(true);setTimeout(()=>setParticles(false),2000);
    const st=Date.now();(function a(){const p=Math.min((Date.now()-st)/1200,1);setAs(Math.round(r.score*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(a);})();
  };

  const share=()=>{
    if(!res)return;
    const t=`${n1} ♥ ${n2} 궁합: ${res.score}% — ${gg(res.score).label}`;
    if(navigator.share)navigator.share({title:"이름궁합",text:t,url:location.href});
    else{navigator.clipboard.writeText(t);alert("복사됨!");}
  };

  const save=useCallback(()=>{
    const c=cvs.current;if(!c||!res)return;const x=c.getContext("2d");
    c.width=640;c.height=480;
    // deep space bg
    const g=x.createRadialGradient(320,200,0,320,240,450);
    g.addColorStop(0,"#1a0a2e");g.addColorStop(0.6,"#0c0618");g.addColorStop(1,"#04020a");
    x.fillStyle=g;x.fillRect(0,0,640,480);
    // ambient circles
    x.globalAlpha=0.04;x.fillStyle="#ff69b4";
    [[500,80,100],[120,400,70],[400,380,50]].forEach(([cx,cy,r])=>{x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.fill();});
    x.globalAlpha=1;x.textAlign="center";
    // header
    x.fillStyle="rgba(255,255,255,0.25)";x.font="600 12px sans-serif";x.fillText("이름궁합 테스트",320,36);
    // names
    x.fillStyle="#fff";x.font="700 30px sans-serif";x.fillText(n1,210,100);
    x.fillStyle=gg(res.score).color;x.font="28px sans-serif";x.fillText("♥",320,100);
    x.fillStyle="#fff";x.font="700 30px sans-serif";x.fillText(n2,430,100);
    // score
    x.fillStyle=gg(res.score).color;x.font="900 80px sans-serif";x.fillText(`${res.score}%`,320,230);
    // grade
    const gr=gg(res.score);
    x.font="700 24px sans-serif";x.fillText(`${gr.emoji} ${gr.label}`,320,280);
    x.fillStyle="rgba(255,255,255,0.3)";x.font="14px sans-serif";x.fillText(msg,320,315);
    // footer
    x.fillStyle="rgba(255,255,255,0.15)";x.font="11px sans-serif";x.fillText("나도 테스트 해보기 →",320,455);
    const l=document.createElement("a");l.download=`궁합_${n1}_${n2}.png`;l.href=c.toDataURL();l.click();
  },[res,n1,n2,msg]);

  const gr=res?gg(as):null;
  const theme=THEMES[ti];

  return(
    <div className="min-h-screen text-white overflow-x-hidden relative" style={{background:"radial-gradient(ellipse at 50% 0%, #1a0a2e 0%, #080412 40%, #04020a 100%)",fontFamily:"'Pretendard Variable','Pretendard',-apple-system,sans-serif"}}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');
        @keyframes floatUp{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-92vh) scale(.2) rotate(45deg)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes heartPulse{0%,100%{transform:scale(1)}15%{transform:scale(1.18)}30%{transform:scale(1)}45%{transform:scale(1.12)}60%{transform:scale(1)}}
        @keyframes orbFloat{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(15px,-20px) scale(1.05)}66%{transform:translate(-10px,15px) scale(.95)}}
        @keyframes dotPulse{0%,80%,100%{opacity:.15}40%{opacity:1}}
        .si{animation:slideIn .55s cubic-bezier(.16,1,.3,1) forwards}
        .hp{animation:heartPulse 2s ease-in-out infinite}
        .of{animation:orbFloat 12s ease-in-out infinite}
        .gl{background:rgba(255,255,255,.035);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.06)}
        .gl2{background:rgba(255,255,255,.06);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);border:1px solid rgba(255,255,255,.08)}
        .dp{animation:dotPulse 1.4s infinite}.dp:nth-child(2){animation-delay:.2s}.dp:nth-child(3){animation-delay:.4s}
        input:focus{outline:none}
        input::placeholder{color:rgba(255,255,255,.1)}
        ::-webkit-scrollbar{display:none}
      `}</style>
      <canvas ref={cvs} className="hidden"/>

      {/* Particles */}
      {particles&&<div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {Array.from({length:28}).map((_,i)=><span key={i} className="absolute" style={{left:`${Math.random()*100}%`,bottom:"-20px",fontSize:10+Math.random()*22,animation:`floatUp ${2+Math.random()*3}s ${Math.random()*1.5}s ease-out forwards`,opacity:0}}>{["❤️","💕","💗","💖","✨","💘","🩷","🤍","💫"][i%9]}</span>)}
      </div>}

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[600px] h-[600px] rounded-full of" style={{background:`radial-gradient(circle,${theme.ring}08,transparent 70%)`,top:"-20%",right:"-20%"}}/>
        <div className="absolute w-[400px] h-[400px] rounded-full of" style={{background:"radial-gradient(circle,rgba(139,92,246,.06),transparent 70%)",bottom:"5%",left:"-15%",animationDelay:"-4s"}}/>
        <div className="absolute w-[300px] h-[300px] rounded-full of" style={{background:"radial-gradient(circle,rgba(96,165,250,.04),transparent 70%)",top:"40%",right:"10%",animationDelay:"-8s"}}/>
      </div>

      {/* Header */}
      <header className="relative z-10 pt-10 pb-5 text-center"><Link href="/" className="absolute left-5 top-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:bg-white/10 z-20" style={{color:"rgba(255,255,255,.35)",border:"1px solid rgba(255,255,255,.06)"}}>← 홈</Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full gl mb-4" style={{fontSize:10,letterSpacing:"0.2em",color:"rgba(255,255,255,.25)"}}>
          NAME CHEMISTRY
        </div>
        <h1 className="text-[32px] font-black tracking-tight leading-none">
          <span style={{background:`linear-gradient(135deg, ${theme.ring}, #c084fc, #60a5fa)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>이름궁합</span>
        </h1>
        <p className="text-[11px] mt-2 tracking-[0.12em]" style={{color:"rgba(255,255,255,.2)"}}>두 사람의 이름으로 운명을 읽다</p>
      </header>

      {/* Ad top */}
      <div className="w-full flex justify-center my-3 relative z-10"><div className="w-full max-w-[728px] h-[70px] rounded-2xl flex items-center justify-center" style={{border:"1px dashed rgba(255,255,255,.04)",color:"rgba(255,255,255,.06)",fontSize:9,letterSpacing:"0.15em"}}>AD BANNER</div></div>

      <main className="max-w-[420px] mx-auto px-5 pb-32 relative z-10">
        {/* ===== HOME ===== */}
        {pg==="home"&&<div className="si">
          {/* Theme pills */}
          <div className="flex gap-2 overflow-x-auto py-2 mb-6 px-0.5">
            {THEMES.map(t=>(
              <button key={t.id} onClick={()=>setTi(t.id)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-[11px] font-semibold tracking-[0.05em] transition-all duration-300 ${ti===t.id?`bg-gradient-to-r ${t.grad} text-white shadow-lg scale-[1.03]`:"gl text-white/30 hover:text-white/50"}`}
                style={ti===t.id?{boxShadow:`0 8px 25px -5px ${t.ring}30`}:{}}>
                {t.emoji} {t.name}
              </button>
            ))}
          </div>

          {/* Input card */}
          <div className="gl2 rounded-[28px] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full" style={{background:`radial-gradient(circle at 100% 0%, ${theme.ring}08, transparent 70%)`}}/>
            <div className="relative space-y-6">
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] mb-2 ml-0.5" style={{color:"rgba(255,255,255,.2)"}}>First Name</label>
                <input type="text" value={n1} onChange={e=>setN1(e.target.value)} placeholder="이름 입력" maxLength={4}
                  className="w-full rounded-2xl px-5 py-4 text-center text-lg font-bold transition-all duration-300" style={{background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.06)"}} onFocus={e=>e.target.style.borderColor=`${theme.ring}40`} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.06)"}/>
              </div>

              <div className="flex items-center">
                <div className="flex-1 h-px" style={{background:`linear-gradient(90deg, transparent, ${theme.ring}15, transparent)`}}/>
                <span className="mx-5 text-2xl hp">💕</span>
                <div className="flex-1 h-px" style={{background:`linear-gradient(90deg, transparent, ${theme.ring}15, transparent)`}}/>
              </div>

              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] mb-2 ml-0.5" style={{color:"rgba(255,255,255,.2)"}}>Second Name</label>
                <input type="text" value={n2} onChange={e=>setN2(e.target.value)} placeholder="이름 입력" maxLength={4}
                  className="w-full rounded-2xl px-5 py-4 text-center text-lg font-bold transition-all duration-300" style={{background:"rgba(255,255,255,.025)",border:"1px solid rgba(255,255,255,.06)"}} onFocus={e=>e.target.style.borderColor=`${theme.ring}40`} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,.06)"}/>
              </div>

              <button onClick={go} disabled={!ok(n1)||!ok(n2)}
                className={`w-full rounded-2xl font-bold text-[15px] tracking-[0.03em] transition-all duration-300 ${ok(n1)&&ok(n2)?`bg-gradient-to-r ${theme.grad} shadow-xl active:scale-[0.97]`:"text-white/15 cursor-not-allowed"}`}
                style={{padding:"18px 0",...(ok(n1)&&ok(n2)?{boxShadow:`0 12px 35px -8px ${theme.ring}25`}:{background:"rgba(255,255,255,.03)"})}}>
                {theme.emoji} 궁합 확인하기
              </button>

              {n1&&!ok(n1)&&<p className="text-center text-[10px]" style={{color:"rgba(255,100,100,.5)"}}>한글 2~4자를 입력해주세요</p>}
            </div>
          </div>

          {/* History */}
          {hist.length>0&&<div className="mt-8">
            <h3 className="text-[9px] uppercase tracking-[0.2em] mb-3 ml-0.5" style={{color:"rgba(255,255,255,.15)"}}>Recent Tests</h3>
            <div className="space-y-1.5">
              {hist.slice(0,4).map((h,i)=>(
                <button key={i} onClick={()=>{setN1(h.n1);setN2(h.n2);setTi(h.ti);}}
                  className="w-full flex items-center justify-between gl rounded-2xl px-4 py-3 hover:bg-white/[0.04] transition-all group">
                  <span className="text-[13px] text-white/40 group-hover:text-white/60">{h.n1} <span style={{color:`${THEMES[h.ti].ring}50`}}>♥</span> {h.n2}</span>
                  <span className="text-[13px] font-black tabular-nums" style={{color:gg(h.score).color}}>{h.score}%</span>
                </button>
              ))}
            </div>
          </div>}

          <div className="mt-12 space-y-2.5" style={{color:"rgba(255,255,255,.12)",fontSize:10.5,lineHeight:1.9}}>
            <h2 style={{color:"rgba(255,255,255,.2)",fontSize:12,fontWeight:700}}>이름궁합 테스트</h2>
            <p>한글 획수, 음양오행, 모음 조화를 종합 분석합니다. 4가지 테마로 연애, 우정, 비즈니스, 소울메이트 궁합을 확인해보세요.</p>
          </div>
        </div>}

        {/* ===== LOADING ===== */}
        {pg==="load"&&<div className="flex flex-col items-center justify-center min-h-[65vh] si">
          <div className="text-6xl mb-8 hp">💘</div>
          <p className="text-[13px] tracking-[0.08em] mb-5" style={{color:"rgba(255,255,255,.3)"}}>
            {lp<30?"획수를 분석하고 있어요":lp<60?"오행 상성을 확인하고 있어요":lp<90?"음양 조화를 계산하고 있어요":"결과를 종합하고 있어요"}
            <span className="dp">.</span><span className="dp">.</span><span className="dp">.</span>
          </p>
          <div className="w-52 h-[3px] rounded-full overflow-hidden" style={{background:"rgba(255,255,255,.04)"}}>
            <div className="h-full rounded-full transition-all duration-500" style={{width:`${lp}%`,background:`linear-gradient(90deg, ${theme.ring}88, ${theme.ring})`}}/>
          </div>
          <div className="mt-8 flex items-center gap-2" style={{color:"rgba(255,255,255,.25)",fontSize:13}}>
            <span className="font-bold text-white/50">{n1}</span>
            <span style={{color:`${theme.ring}60`}}>♥</span>
            <span className="font-bold text-white/50">{n2}</span>
          </div>
        </div>}

        {/* ===== RESULT ===== */}
        {pg==="res"&&res&&gr&&<div className="si">
          {/* Badge */}
          <div className="flex justify-center mb-3">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.1em] bg-gradient-to-r ${theme.grad}`} style={{boxShadow:`0 4px 15px -3px ${theme.ring}25`}}>
              {theme.emoji} {theme.name} 궁합
            </span>
          </div>

          {/* Names */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-[22px] font-black">{n1}</span>
            <span className="text-2xl hp" style={{color:theme.ring}}>♥</span>
            <span className="text-[22px] font-black">{n2}</span>
          </div>

          {/* Score ring */}
          <div className="flex justify-center my-7">
            <div className="relative">
              <svg width="170" height="170" style={{filter:`drop-shadow(0 0 25px ${gr.glow})`}}>
                <circle cx="85" cy="85" r="66" fill="none" stroke="rgba(255,255,255,.03)" strokeWidth="5"/>
                <circle cx="85" cy="85" r="66" fill="none" stroke={gr.color} strokeWidth="5"
                  strokeDasharray={2*Math.PI*66} strokeDashoffset={2*Math.PI*66*(1-as/100)}
                  strokeLinecap="round" transform="rotate(-90 85 85)" className="transition-all duration-[2.5s] ease-out"/>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[46px] font-black tabular-nums leading-none" style={{color:gr.color}}>{as}</span>
                <span className="text-[10px] mt-0.5" style={{color:"rgba(255,255,255,.15)"}}>%</span>
              </div>
            </div>
          </div>

          {/* Grade */}
          <div className="gl2 rounded-3xl p-6 text-center mb-5" style={{boxShadow:`inset 0 0 60px ${gr.glow}`}}>
            <div className="text-[28px] font-black" style={{color:gr.color}}>{gr.emoji} {gr.label}</div>
            <p className="text-[12px] mt-3 leading-relaxed italic" style={{color:"rgba(255,255,255,.3)"}}>&ldquo;{msg}&rdquo;</p>
          </div>

          {/* Analysis */}
          <div className="gl rounded-2xl p-5 mb-5">
            <h3 className="text-[9px] uppercase tracking-[0.2em] mb-4" style={{color:"rgba(255,255,255,.15)"}}>Detail Analysis</h3>
            {[["획수 조화",res.strokeScore,"#ff6b9d"],["오행 상성",res.elScore,"#c084fc"],["음양 조화",res.harmonyScore,"#60a5fa"]].map(([l,v,c])=>(
              <div key={l} className="mb-3">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[11px]" style={{color:"rgba(255,255,255,.25)"}}>✦ {l}</span>
                  <span className="text-[11px] font-black tabular-nums" style={{color:c}}>{Math.round(v)}%</span>
                </div>
                <div className="h-[5px] rounded-full overflow-hidden" style={{background:"rgba(255,255,255,.03)"}}>
                  <div className="h-full rounded-full transition-all duration-[2s]" style={{width:`${v}%`,background:`linear-gradient(90deg, ${c}55, ${c})`}}/>
                </div>
              </div>
            ))}
          </div>

          {/* Ad */}
          <div className="w-full flex justify-center my-5"><div className="rounded-2xl flex items-center justify-center" style={{width:300,height:250,border:"1px dashed rgba(255,255,255,.04)",color:"rgba(255,255,255,.06)",fontSize:9,letterSpacing:"0.15em"}}>AD 300×250</div></div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {[["다시하기",()=>{setN1("");setN2("");setRes(null);setPg("home");}],["📸 저장",save],["공유",share]].map(([l,fn],i)=>(
              <button key={i} onClick={fn}
                className={`py-3.5 rounded-2xl text-[11px] font-semibold tracking-[0.05em] transition-all active:scale-95 ${i===1?`bg-gradient-to-r ${theme.grad}`:"gl hover:bg-white/[0.05]"}`}
                style={i===1?{boxShadow:`0 8px 20px -5px ${theme.ring}20`}:{color:"rgba(255,255,255,.4)"}}>
                {l}
              </button>
            ))}
          </div>

          {/* Other themes */}
          <div className="gl rounded-2xl p-5 mb-5">
            <h3 className="text-[9px] uppercase tracking-[0.2em] mb-3" style={{color:"rgba(255,255,255,.15)"}}>Other Chemistry</h3>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.filter(t=>t.id!==ti).map(t=>(
                <button key={t.id} onClick={()=>switchTheme(t.id)}
                  className="py-3 rounded-xl gl text-center transition-all active:scale-95 hover:bg-white/[0.04]">
                  <div className="text-lg">{t.emoji}</div>
                  <div className="text-[10px] mt-1" style={{color:"rgba(255,255,255,.25)"}}>{t.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Method */}
          <div className="gl rounded-2xl p-5" style={{fontSize:10.5,lineHeight:1.8,color:"rgba(255,255,255,.2)"}}>
            <h3 className="text-[9px] uppercase tracking-[0.2em] mb-3" style={{color:"rgba(255,255,255,.12)"}}>Methodology</h3>
            <p><span className="font-semibold" style={{color:"#ff6b9d"}}>획수</span> — 초성·중성·종성 획수 합으로 수리적 조화를 측정합니다.</p>
            <p className="mt-1.5"><span className="font-semibold" style={{color:"#c084fc"}}>오행</span> — 木火土金水 속성을 비교하여 상생·상극을 파악합니다.</p>
            <p className="mt-1.5"><span className="font-semibold" style={{color:"#60a5fa"}}>음양</span> — 양성모음·음성모음 분포로 균형을 평가합니다.</p>
          </div>

          <div className="w-full flex justify-center my-5"><div className="w-full h-[70px] rounded-2xl flex items-center justify-center" style={{border:"1px dashed rgba(255,255,255,.04)",color:"rgba(255,255,255,.06)",fontSize:9,letterSpacing:"0.15em"}}>AD BANNER</div></div>
        </div>}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-20" style={{background:"linear-gradient(to top, rgba(4,2,10,.97), rgba(4,2,10,.5), transparent)"}}>
        <div className="text-center py-2.5">
          <div className="inline-block rounded-xl px-8 py-1.5" style={{border:"1px dashed rgba(255,255,255,.04)",color:"rgba(255,255,255,.06)",fontSize:8,letterSpacing:"0.2em"}}>ANCHOR AD</div>
        </div>
      </footer>
    </div>
  );
}
